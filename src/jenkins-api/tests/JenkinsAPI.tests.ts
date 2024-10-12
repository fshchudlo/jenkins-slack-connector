import { JenkinsAPI } from "../JenkinsAPI";
import { AppConfig } from "../../app.config";

describe("JenkinsAPI", () => {
    it.skip("Should run pipeline and return link to the running job", async () => {
        const pipelineName = "job/Sandbox/job/parameterless-pipeline-example";
        const result = await new JenkinsAPI(AppConfig.JENKINS_CREDENTIALS, AppConfig.JENKINS_URL).startJob(pipelineName);
        expect(result.startsWith(`${AppConfig.JENKINS_URL}/${pipelineName}/`)).toBe(true);
    });
    it.skip("Should fetch pipeline parameters", async () => {
        const parameterlessPipelineResult = await new JenkinsAPI(AppConfig.JENKINS_CREDENTIALS, AppConfig.JENKINS_URL).getJobParameters("job/Sandbox/job/parameterless-pipeline-example");
        expect(parameterlessPipelineResult).toBeNull();

        const parameterizedPipelineResult = await new JenkinsAPI(AppConfig.JENKINS_CREDENTIALS, AppConfig.JENKINS_URL).getJobParameters("job/Sandbox/job/parameterized-pipeline-example");
        expect(parameterizedPipelineResult).toBeInstanceOf(Array);
        expect(parameterizedPipelineResult).not.toHaveLength(0);
    });
});
