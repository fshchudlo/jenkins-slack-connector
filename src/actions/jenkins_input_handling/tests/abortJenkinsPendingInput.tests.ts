import { abortJenkinsPendingInput } from "../../index";
import { JenkinsAPI } from "../../../jenkins-api/JenkinsAPI";

jest.mock("../../../jenkins-api/JenkinsAPI");

describe("abortJenkinsPendingInput", () => {
    let context: any;
    let body: any;
    let ack: jest.Mock;
    let respond: jest.Mock;

    beforeEach(() => {
        context = { jenkinsAPI: new JenkinsAPI(null, null) };
        body = {
            actions: [{ value: "http://example.com/abort" }],
            user_name: "test_user"
        };
        ack = jest.fn();
        respond = jest.fn();
    });

    it("responds with success message when input is aborted", async () => {
        jest.spyOn(context.jenkinsAPI, "abortJobPendingInput").mockResolvedValueOnce(undefined);

        await abortJenkinsPendingInput({ context, body, ack, respond });

        expect(context.jenkinsAPI.abortJobPendingInput).toHaveBeenCalledWith("http://example.com/abort");
        expect(respond).toHaveBeenCalledWith("Input was aborted by test_user");
    });

    it("responds with an error message if aborting the input fails", async () => {
        const error = new Error("Network error");
        jest.spyOn(context.jenkinsAPI, "abortJobPendingInput").mockRejectedValueOnce(error);

        await abortJenkinsPendingInput({ context, body, ack, respond });

        expect(context.jenkinsAPI.abortJobPendingInput).toHaveBeenCalledWith("http://example.com/abort");
        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });
});