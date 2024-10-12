import { checkboxGroup, contextBlock, staticSelect, textarea, textBlock, textbox } from "../../building-blocks";
import { reformatHtml } from "./reformatHtml";
import { JenkinsParameterDefinition } from "../../jenkins-api/JenkinsParameterDefinition";
import { Block } from "@slack/bolt";

export function mapJenkinsParametersToSlackControls(parametersDefinition: JenkinsParameterDefinition[]): any[] {
    return parametersDefinition.flatMap(createParameterBlocks);
}

function createParameterBlocks(parameter: JenkinsParameterDefinition): Block[] {
    const placeholderText = getPlaceholderText(parameter.description);
    const description = reformatHtml(parameter.description);
    const appendDescription = description && (placeholderText !== description || parameter.type === "BooleanParameterDefinition");

    const control = createParameterControl(parameter, appendDescription, placeholderText);

    return appendDescription ? [control, contextBlock(textBlock(description, "mrkdwn"))] : [control];
}

function createParameterControl(parameter: JenkinsParameterDefinition, appendDescription: boolean, placeholderText: string) {
    const controlName = humanizeParameterName(parameter.name);
    const initialValue = parameter.defaultParameterValue?.value ?? parameter.definition?.defaultVal ?? "";

    switch (parameter.type) {
        case "StringParameterDefinition":
            return textbox(controlName, parameter.name, initialValue, appendDescription ? null : placeholderText);
        case "TextParameterDefinition":
            return textarea(controlName, parameter.name, initialValue, appendDescription ? null : placeholderText);
        case "ChoiceParameterDefinition":
            return staticSelect(controlName, getSelectOptions(parameter), parameter.name, initialValue, appendDescription ? null : placeholderText);
        case "BooleanParameterDefinition":
            const initialOption = { [parameter.name]: controlName };
            return checkboxGroup(" ", parameter.name, initialOption, initialValue ? initialOption : undefined);
        default:
            throw new Error(`Unknown control type ${parameter.type} for the field ${parameter.name}`);
    }
}

function getSelectOptions(parameter: JenkinsParameterDefinition): Record<string, string> {
    const choices = parameter.definition?.choices || parameter.choices || [];
    return Object.fromEntries(choices.map(choice => [choice, choice]));
}

function humanizeParameterName(parameterName: string): string {
    return parameterName.includes("-") ? parameterName : parameterName.replace(/([A-Z][a-z]+)/g, " $1")
        .replace(/([A-Z]+)/g, " $1")
        .trim()
        .split(" ")
        .filter(word => !!word)
        .map((word, index) => index === 0 ? capitalize(word) : word.toLowerCase())
        .join(" ");
}

function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getPlaceholderText(description: string): string | null {
    return description && description.length < 150 ? description : null;
}