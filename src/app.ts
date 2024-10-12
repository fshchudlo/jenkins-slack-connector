import { App } from "@slack/bolt";
import { AppConfig } from "./app.config";
import { constructJenkinsAPI } from "./middlewares/constructJenkinsAPI";
import * as actions from "./actions";
import { ActionKeys } from "./actions";

export const slackApp = new App({
    token: AppConfig.SLACK_BOT_TOKEN,
    appToken: AppConfig.SLACK_APP_TOKEN,
    socketMode: true,
    ignoreSelf: false,
});

slackApp.command(`/${ActionKeys.RUN_JENKINS_PIPELINE}`, constructJenkinsAPI, actions.displayPipelineSelectionForm);

slackApp.action(ActionKeys.RUN_JENKINS_PIPELINE, constructJenkinsAPI, actions.runJenkinsPipelineOrDisplayParametersForm);
slackApp.action(ActionKeys.RUN_PARAMETERIZED_PIPELINE, constructJenkinsAPI, actions.runParameterizedJenkinsPipeline);

slackApp.action(ActionKeys.SUBMIT_PENDING_INPUT, constructJenkinsAPI, actions.submitJenkinsPendingInput);
slackApp.action(ActionKeys.APORT_PENDING_INPUT, constructJenkinsAPI, actions.abortJenkinsPendingInput);

slackApp.action(ActionKeys.DISPLAY_CANCELLATION_MESSAGE, actions.displayCancellationMessage);

slackApp.view(ActionKeys.SAVE_ACCESS_TOKENS, actions.saveJenkinsAccessToken);

slackApp.message(ActionKeys.PENDING_INPUT_REQUEST_MESSAGE_PATTERN, actions.displayJenkinsPendingInputForm);

(async () => {
    await slackApp.start(AppConfig.SLACK_BOT_PORT);
    console.log("⚡️ Jenkins-Slack connector is running!");
})();
