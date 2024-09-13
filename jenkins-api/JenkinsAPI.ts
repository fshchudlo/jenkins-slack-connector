import axios, {AxiosResponse, Method} from "axios";
import {BasicAuthCredentials} from "./BasicAuthCredentials";
import {JenkinsInputDefinition} from "./JenkinsInputDefinition";
import {JenkinsParameterDefinition} from "./JenkinsParameterDefinition";

const JENKINS_API_POSTFIX = "/api/json";

export class JenkinsAPI {
    private readonly auth: BasicAuthCredentials;
    private readonly jenkinsUrl: string;

    constructor(auth: BasicAuthCredentials, jenkinsUrl: string) {
        this.auth = auth;
        this.jenkinsUrl = jenkinsUrl;
    }

    private async request(url: string, method: Method = "GET", params?: any): Promise<AxiosResponse> {
        return axios.request({
            method,
            url,
            params,
            auth: this.auth,
            headers: {"accept": "application/json", "accept-encoding": "gzip, deflate, br"}
        });
    }

    async startJob(jobName: string, jobParams?: any): Promise<string> {
        const runUrlPart = jobParams ? "buildWithParameters" : "build";
        const runJobUrl = `${this.jenkinsUrl}/${jobName}/${runUrlPart}`;

        const queuedJobUrl = (await this.request(runJobUrl, "POST", jobParams)).headers.location;

        // give Jenkins time to start the job
        await new Promise(resolve => setTimeout(resolve, 300));

        const startedJob = (await this.request(`${queuedJobUrl}${JENKINS_API_POSTFIX}`, "GET")).data;
        if (startedJob.blocked) {
            return Promise.reject(startedJob.why);
        }
        return startedJob.executable.url;
    }

    async getJobParameters(jobPath: string): Promise<JenkinsParameterDefinition[] | null> {
        const url = `${this.jenkinsUrl}/${jobPath}/${JENKINS_API_POSTFIX}`;
        const buildInfo = (await this.request(url, "GET")).data;
        const parametersDefinition = buildInfo.property.find((item: object) => "parameterDefinitions" in item);
        return parametersDefinition?.parameterDefinitions || null;
    }

    async getJobPendingInput(jobUrl: string): Promise<JenkinsInputDefinition> {
        const url = `${jobUrl}/wfapi/nextPendingInputAction`;
        return (await this.request(url, "GET")).data;
    }

    async abortJobPendingInput(abortUrl: string): Promise<void> {
        const fullAbortUrl = `${this.jenkinsUrl}/${abortUrl}`;
        await this.request(fullAbortUrl, "POST");
    }

    async submitJobPendingInput(buildUrl: string, submitUrl: string, formValues: any): Promise<void> {
        const inputDefinition = await this.getJobPendingInput(buildUrl);

        if (!inputDefinition || !submitUrl.includes(`inputSubmit?inputId=${inputDefinition.id}`)) {
            throw new Error("Input was already submitted or timed out");
        }
        this.appendUnselectedCheckboxes(formValues, inputDefinition);

        const convertedValues = Object.entries(formValues).map(([key, value]) => ({name: key, value}));
        await this.request(`${this.jenkinsUrl}${submitUrl}`, "POST", {json: JSON.stringify({parameter: convertedValues})});
    }

    private appendUnselectedCheckboxes(formValues: any, inputDefinition: JenkinsInputDefinition): Record<string, any> {
        inputDefinition.inputs.forEach(parameter => {
            if (parameter.type === "BooleanParameterDefinition" && !(parameter.name in formValues)) {
                formValues[parameter.name] = false;
            }
        });
        return formValues;
    }
}
