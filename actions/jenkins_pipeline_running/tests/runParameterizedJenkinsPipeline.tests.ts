import {runParameterizedJenkinsPipeline} from "../../../actions";
import {JenkinsAPI} from "../../../jenkins-api/JenkinsAPI";

jest.mock("../../../jenkins-api/JenkinsAPI");

describe("runParameterizedJenkinsPipeline", () => {
    let context: any;
    let body: any;
    let payload: any;
    let ack: jest.Mock;
    let respond: jest.Mock;

    beforeEach(() => {
        context = {jenkinsAPI: new JenkinsAPI(null, null)};
        body = {
            state: {
                values: {
                    "someStringParam": {
                        "someStringParam": {
                            "type": "plain_text_input",
                            "value": "test"
                        }
                    }
                }
            }
        };
        payload = {block_id: "pipelineId", value: "Pipeline Display Name"};
        ack = jest.fn();
        respond = jest.fn();
    });

    it("runs the parameterized pipeline", async () => {
        jest.spyOn(context.jenkinsAPI, "startJob").mockResolvedValueOnce("http://example.com/job");

        await runParameterizedJenkinsPipeline({context, body, payload, ack, respond});

        expect(context.jenkinsAPI.startJob).toHaveBeenCalledWith("pipelineId", {someStringParam: "test"});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("runs the parameterized pipeline with no values", async () => {
        body.state.values = {}
        jest.spyOn(context.jenkinsAPI, "startJob").mockResolvedValueOnce("http://example.com/job");

        await runParameterizedJenkinsPipeline({context, body, payload, ack, respond});

        expect(context.jenkinsAPI.startJob).toHaveBeenCalledWith("pipelineId", {});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("responds with an error message if running the parameterized pipeline fails", async () => {
        const error = new Error("Network error");
        jest.spyOn(context.jenkinsAPI, "startJob").mockRejectedValueOnce(error);

        await runParameterizedJenkinsPipeline({context, body, payload, ack, respond});

        expect(context.jenkinsAPI.startJob).toHaveBeenCalledWith("pipelineId", {someStringParam: "test"});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });
});