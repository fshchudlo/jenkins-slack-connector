import { errorMessage } from "../../building-blocks";

export async function abortJenkinsPendingInput({ context, body, ack, respond }) {
    await ack();

    const abortUrl = body.actions[0].value;

    try {
        await context.jenkinsAPI.abortJobPendingInput(abortUrl);
        await respond(`Input was aborted by ${body.user_name}`);
    } catch (error) {
        await respond({ blocks: errorMessage("Input abort failed", error) });
    }
}