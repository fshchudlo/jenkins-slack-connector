import { runJenkinsPipelineOrDisplayParametersForm } from "../../index";
import { JenkinsAPI } from "../../../jenkins-api/JenkinsAPI";

jest.mock("../../../jenkins-api/JenkinsAPI");

describe("runJenkinsPipelineOrDisplayParametersForm", () => {
    let context: any;
    let body: any;
    let ack: jest.Mock;
    let respond: jest.Mock;

    beforeEach(() => {
        context = { jenkinsAPI: new JenkinsAPI(null, null) };
        body = {
            state: { values: { pipeline_name: { pipeline_name: { selected_option: { value: "pipelineId", text: { text: "Pipeline Display Name" } } } } } }
        };
        ack = jest.fn();
        respond = jest.fn();
    });

    it("runs the parameterless pipeline", async () => {
        jest.spyOn(context.jenkinsAPI, "getJobParameters").mockResolvedValueOnce(null);
        jest.spyOn(context.jenkinsAPI, "startJob").mockResolvedValueOnce("http://example.com/job");

        await runJenkinsPipelineOrDisplayParametersForm({ context, body, ack, respond });

        expect(context.jenkinsAPI.getJobParameters).toHaveBeenCalledWith("pipelineId");
        expect(context.jenkinsAPI.startJob).toHaveBeenCalledWith("pipelineId");
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("displays the parameters form", async () => {
        const pipelineParameters = [{ name: "param1", type: "StringParameterDefinition" }];
        jest.spyOn(context.jenkinsAPI, "getJobParameters").mockResolvedValueOnce(pipelineParameters);

        await runJenkinsPipelineOrDisplayParametersForm({ context, body, ack, respond });

        expect(context.jenkinsAPI.getJobParameters).toHaveBeenCalledWith("pipelineId");
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("responds with an error message if running the parameterless pipeline fails", async () => {
        const error = new Error("Network error");
        jest.spyOn(context.jenkinsAPI, "getJobParameters").mockResolvedValueOnce(null);
        jest.spyOn(context.jenkinsAPI, "startJob").mockRejectedValueOnce(error);

        await runJenkinsPipelineOrDisplayParametersForm({ context, body, ack, respond });

        expect(context.jenkinsAPI.startJob).toHaveBeenCalledWith("pipelineId");
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });
});