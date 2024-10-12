import {actionsBlock, button, cancelButton, divider, link, section} from "../../building-blocks";
import {mapJenkinsParametersToSlackControls} from "../helpers/mapJenkinsParametersToSlackControls";
import { ActionKeys } from "../ActionKeys";
import { JenkinsInputDefinition } from "../../jenkins-api/JenkinsInputDefinition";

export async function displayJenkinsPendingInputForm({context, message, client}) {
    if (context.botId != message.bot_id) {
        return;
    }
    const [{url: buildUrl, text: buildName}] = message.blocks.flatMap(b => b.elements).flatMap(e => e.elements).filter(e => e.type == "link");

    // give Jenkins time to render the input
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const jenkinsInputDefinition = await context.jenkinsAPI.getJobPendingInput(buildUrl);
    const formBlocks = jenkinsInputDefinition? await buildJenkinsPendingInputForm(buildUrl, jenkinsInputDefinition) : buildInputHandlingFailureForm(buildName, buildUrl);

    await client.chat.update({
        channel: message.channel,
        ts: message.ts,
        blocks: formBlocks,
    });
}

async function buildJenkinsPendingInputForm(buildUrl: string, jenkinsInputDefinition: JenkinsInputDefinition) {
    const header = [
        section(jenkinsInputDefinition.message),
        divider()
    ];

    const footer = [
        actionsBlock(buildUrl, [
            button(
                jenkinsInputDefinition.proceedText,
                ActionKeys.SUBMIT_PENDING_INPUT,
                jenkinsInputDefinition.proceedUrl
            ),
            cancelButton(
                "Abort",
                ActionKeys.APORT_PENDING_INPUT,
                jenkinsInputDefinition.abortUrl
            )
        ])
    ];

    const blocks = mapJenkinsParametersToSlackControls(jenkinsInputDefinition.inputs);

    return [...header, ...blocks, ...footer];
}

function buildInputHandlingFailureForm(buildName: string, buildUrl: string) {
    return [
        section(
            `${link(normalizeBuildName(buildName), buildUrl)} requested the input, ` +
            `but it was submitted or timeout had been reached before I was able to ` +
            `handle it :crying_cat_face:`
        )
    ];
}

function normalizeBuildName(buildName: string): string {
    return buildName.replace(/%2F/g, "/");
}
