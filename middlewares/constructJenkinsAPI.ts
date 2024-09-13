import { ModalView } from "@slack/bolt";
import { ActionKeys } from "../actions";
import { AppConfig } from "../app.config";
import { divider, section, textbox } from "../building-blocks";
import { JenkinsAPI } from "../jenkins-api/JenkinsAPI";
import { CredentialsStore } from "../CredentialsStore";

export async function constructJenkinsAPI({context, client, body, next}) {
    const credentials = CredentialsStore.getCredentials(context.userId);
    if (credentials) {
        context.jenkinsAPI = new JenkinsAPI(credentials, AppConfig.JENKINS_URL);
        await next();
        return;
    }
    await client.views.open({
        trigger_id: body.trigger_id,
        view: buildJenkinsTokenModalForm()
    });
    await next();
}

function buildJenkinsTokenModalForm(): ModalView {
    return {
        type: "modal",
        callback_id: ActionKeys.SAVE_ACCESS_TOKENS,
        title: {
            type: "plain_text",
            text: "Access tokens required"
        },
        submit: {
            type: "plain_text",
            text: "Submit",
            emoji: true
        },
        blocks: [
            section("Hi! Please, give me access token to perform useful stuff for you"),
            divider(),
            textbox("Jenkins API token", "jenkins_token")
        ]
    };
}