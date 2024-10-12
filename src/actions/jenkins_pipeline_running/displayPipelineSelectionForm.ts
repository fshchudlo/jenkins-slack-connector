import {actionsBlock, button, cancelButton, divider, section, staticSelect} from "../../building-blocks";
import {AllMiddlewareArgs, SlackCommandMiddlewareArgs} from "@slack/bolt";
import {ActionKeys} from "../ActionKeys";

export async function displayPipelineSelectionForm({ack, respond}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) {
    await ack();

    const blocks = [
        section("Please choose a pipeline to run"),
        divider(),
        pipelinesDropdown(),
        actionsBlock("submit", [
            button("Run", ActionKeys.RUN_JENKINS_PIPELINE),
            cancelButton()
        ])
    ];

    await respond({blocks: blocks});
}

function pipelinesDropdown() {
    return staticSelect(
        "Select an item",
        {
            "job/Sandbox/job/parameterless-pipeline-example": "Parameterless pipeline example",
            "job/Sandbox/job/parameterized-pipeline-example": "Parameterized pipeline example",
            "job/Sandbox/job/interactive-pipeline-example": "Interactive pipeline example"
        },
        "pipeline_name",
        null,
        "Select an item"
    );
}
