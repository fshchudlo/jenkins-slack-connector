import {contextBlock, errorMessage, link, section, textBlock} from "../../building-blocks";
import {getSlackFormValues} from "../helpers/getSlackFormValues";
import {JenkinsAPI} from "../../jenkins-api/JenkinsAPI";

export async function runParameterizedJenkinsPipeline({context, body, payload, ack, respond}): Promise<void> {
    ack();

    const pipelineId = payload.block_id;
    const submittedValues = getSlackFormValues(body.state.values);

    try {
        const startedJobUrl = await (<JenkinsAPI>context.jenkinsAPI).startJob(pipelineId, submittedValues);

        await respond({
            blocks: [
                section(`:rocket: Here is the running ${link(payload.value, startedJobUrl)} pipeline.`),
                contextBlock(textBlock("Submitted values:")),
                ...Object.entries(submittedValues).map(([key, value]) => contextBlock(textBlock(`\t• ${key}: ${value}`)))
            ]
        });
    } catch (error) {
        respond({blocks: errorMessage("Unable to run pipeline", error)});
    }
}