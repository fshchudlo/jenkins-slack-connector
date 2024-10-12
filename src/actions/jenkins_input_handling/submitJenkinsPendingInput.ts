import {getSlackFormValues} from "../helpers/getSlackFormValues";
import {contextBlock, errorMessage, link, section, textBlock} from "../../building-blocks";
import {JenkinsAPI} from "../../jenkins-api/JenkinsAPI";

export async function submitJenkinsPendingInput({context, body, ack, respond}) {
    ack();

    const submitUrl = body.actions[0].value;
    const buildUrl = body.actions[0].block_id;
    const submittedValues = getSlackFormValues(body.state.values);

    try {
        await (<JenkinsAPI>context.jenkinsAPI).submitJobPendingInput(buildUrl, submitUrl, submittedValues);

        if (Object.keys(submittedValues).length > 0) {
            await respond({
                blocks: [
                    section(`Input was submitted to the ${link("build", buildUrl)} by ${body.user_name}`),
                    contextBlock(textBlock("Submitted values:")),
                    ...Object.entries(submittedValues).map(([key, value]) => contextBlock(textBlock(`\t• ${key}: ${value}`)))
                ]
            });

        } else {
            await respond(`Input was submitted to the ${link("build", buildUrl)} by ${body.user_name}`);
        }
    } catch (error) {
        await respond({blocks: errorMessage(`Unable to submit input for the ${link("build", buildUrl)}`, error)});
    }
}