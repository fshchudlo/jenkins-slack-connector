import {submitJenkinsPendingInput} from "../../index";
import {JenkinsAPI} from "../../../jenkins-api/JenkinsAPI";

jest.mock("../../../jenkins-api/JenkinsAPI");

describe("submitJenkinsPendingInput", () => {
    let context: any;
    let body: any;
    let ack: jest.Mock;
    let respond: jest.Mock;

    beforeEach(() => {
        context = {jenkinsAPI: new JenkinsAPI(null, null)};
        body = {
            actions: [{value: "http://example.com/submit", block_id: "http://example.com/build"}],
            state: {
                values: {
                    "someStringParam": {
                        "someStringParam": {
                            "type": "plain_text_input",
                            "value": "test"
                        }
                    }
                }
            },
            user_name: "test_user"
        };
        ack = jest.fn();
        respond = jest.fn();
    });

    it("responds with submitted values", async () => {
        jest.spyOn(context.jenkinsAPI, "submitJobPendingInput").mockResolvedValueOnce(undefined);

        await submitJenkinsPendingInput({context, body, ack, respond});

        expect(context.jenkinsAPI.submitJobPendingInput).toHaveBeenCalledWith("http://example.com/build", "http://example.com/submit", {someStringParam: "test"});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("responds without submitted values", async () => {
        body.state.values = {}
        jest.spyOn(context.jenkinsAPI, "submitJobPendingInput").mockResolvedValueOnce(undefined);

        await submitJenkinsPendingInput({context, body, ack, respond});

        expect(context.jenkinsAPI.submitJobPendingInput).toHaveBeenCalledWith("http://example.com/build", "http://example.com/submit", {});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });

    it("responds with an error message if submission fails", async () => {
        const error = new Error("Network error");
        jest.spyOn(context.jenkinsAPI, "submitJobPendingInput").mockRejectedValueOnce(error);

        await submitJenkinsPendingInput({context, body, ack, respond});

        expect(context.jenkinsAPI.submitJobPendingInput).toHaveBeenCalledWith("http://example.com/build", "http://example.com/submit", {someStringParam: "test"});
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });
});