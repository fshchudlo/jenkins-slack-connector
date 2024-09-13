import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from "@slack/bolt";

export async function displayCancellationMessage({ ack, respond }: AllMiddlewareArgs & SlackActionMiddlewareArgs) {
    await ack();

    await respond("Ok, I've canceled the operation. See you soon.");
}
