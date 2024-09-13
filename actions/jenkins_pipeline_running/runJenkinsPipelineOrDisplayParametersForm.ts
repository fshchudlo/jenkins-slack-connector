import {JenkinsAPI} from "../../jenkins-api/JenkinsAPI";
import {actionsBlock, button, cancelButton, divider, errorMessage, link, section} from "../../building-blocks";
import {mapJenkinsParametersToSlackControls} from "../helpers/mapJenkinsParametersToSlackControls";
import {RespondFn} from "@slack/bolt";
import {JenkinsParameterDefinition} from "../../jenkins-api/JenkinsParameterDefinition";
import { ActionKeys } from "../ActionKeys";

export async function runJenkinsPipelineOrDisplayParametersForm({context, body, ack, respond}): Promise<void> {
    await ack();

    const selectedPipelineOption = body.state.values.pipeline_name.pipeline_name.selected_option;
    const pipelineId = selectedPipelineOption.value;
    const pipelineDisplayName = selectedPipelineOption.text.text;
    const jenkinsAPI: JenkinsAPI = context.jenkinsAPI;

    const pipelineParameters = await jenkinsAPI.getJobParameters(pipelineId);

    if (pipelineParameters) {
        const parametersForm = buildPipelineParametersForm(pipelineParameters, pipelineDisplayName, pipelineId);        
        await respond({blocks: parametersForm});
    } else {
        await runParameterlessPipeline(context.jenkinsAPI, pipelineId, pipelineDisplayName, respond);
    }
}

async function runParameterlessPipeline(jenkinsAPI: JenkinsAPI, pipelineId: string, pipelineDisplayName: string, respond: RespondFn) {
    try {
        const startedJobUrl = await jenkinsAPI.startJob(pipelineId);
        await respond(`:rocket: Here is the ${link(pipelineDisplayName, startedJobUrl)} pipeline that you run`);
    } catch (error) {
        await respond({blocks: errorMessage("Unable to run pipeline", error)});
    }
}

function buildPipelineParametersForm(pipelineParameters: JenkinsParameterDefinition[], pipelineDisplayName: string, pipelineId: string) {
    return [
        section("Please, specify parameters"),
        divider(),

        ...mapJenkinsParametersToSlackControls(pipelineParameters),

        actionsBlock(pipelineId, [
            button("Run", ActionKeys.RUN_PARAMETERIZED_PIPELINE, pipelineDisplayName),
            cancelButton()
        ])
    ];
}