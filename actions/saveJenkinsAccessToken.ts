import {getSlackFormValues} from "./helpers/getSlackFormValues";
import {section} from "../building-blocks";
import {AllMiddlewareArgs, SlackViewMiddlewareArgs} from "@slack/bolt";
import { CredentialsStore } from "../CredentialsStore";

export async function saveJenkinsAccessToken({ack, client, body, context}: AllMiddlewareArgs & SlackViewMiddlewareArgs) {
    const respond = async (title: string, ...blocks: any[]): Promise<void> => {
        await ack({
            response_action: "update",
            view: {
                type: "modal",
                title: {type: "plain_text", text: title},
                blocks: blocks
            }
        });
    };

    const payload: any = getSlackFormValues(body.view.state.values);
    const userInfo = (await client.users.info({user: context.userId})).user;

    CredentialsStore.saveCredentials(context.userId, {username: userInfo.profile.email, password: payload.jenkins_token});

    await respond("Success", section(":thumbsup: Token was saved. Now you can use any of my features"));
}