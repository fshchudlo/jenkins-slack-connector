import { displayJenkinsPendingInputForm } from "../../../actions";
import { JenkinsAPI } from "../../../jenkins-api/JenkinsAPI";

jest.mock("../../../jenkins-api/JenkinsAPI");

describe("displayJenkinsPendingInputForm", () => {
    let context: any;
    let message: any;
    let client: any;

    beforeEach(() => {
        context = { botId: "BOT_ID", jenkinsAPI: new JenkinsAPI(null, null) };
        message = {
            bot_id: "BOT_ID",
            channel: "CHANNEL_ID",
            ts: "1234567890.123456",
            blocks: [
                {
                    elements: [
                        {
                            elements: [
                                { type: "link", url: "http://example.com/build", text: "Build Name" }
                            ]
                        }
                    ]
                }
            ]
        };
        client = { chat: { update: jest.fn() } };
    });

    it("updates the message with the pending input form if Jenkins input is pending", async () => {
        const jenkinsInputDefinition = {
            message: "Input message",
            proceedText: "Proceed",
            proceedUrl: "http://example.com/proceed",
            abortUrl: "http://example.com/abort",
            inputs: [{
                type: "StringParameterDefinition",
                name: "someStringParam",
                description: "Some string popup param",
                definition: {
                    defaultVal: null
                }
            },
                {
                    type: "BooleanParameterDefinition",
                    name: "someBooleanPopupParam",
                    description: "Some boolean popup param",
                    definition: {
                        defaultVal: false
                    }
                }]
        };
        jest.spyOn(context.jenkinsAPI, "getJobPendingInput").mockResolvedValueOnce(jenkinsInputDefinition);

        await displayJenkinsPendingInputForm({ context, message, client });

        expect(client.chat.update).toHaveBeenCalledWith({
            channel: "CHANNEL_ID",
            ts: "1234567890.123456",
            blocks: expect.any(Array)
        });
        expect(client.chat.update.mock.calls[0][0]).toMatchSnapshot();
    });

    it("updates the message with the failure form if Jenkins input is not pending", async () => {
        jest.spyOn(context.jenkinsAPI, "getJobPendingInput").mockResolvedValueOnce(null);

        await displayJenkinsPendingInputForm({ context, message, client });

        expect(client.chat.update).toHaveBeenCalledWith({
            channel: "CHANNEL_ID",
            ts: "1234567890.123456",
            blocks: expect.any(Array)
        });

        expect(client.chat.update.mock.calls[0][0]).toMatchSnapshot();
    });

    it("does not update the message if the bot ID does not match", async () => {
        context.botId = "DIFFERENT_BOT_ID";

        await displayJenkinsPendingInputForm({ context, message, client });

        expect(client.chat.update).not.toHaveBeenCalled();
    });
});