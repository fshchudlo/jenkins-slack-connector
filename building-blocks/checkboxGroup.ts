import { textBlock } from "./textBlock";

export function checkboxGroup(label: string, action_id: string, checkboxes: Record<string, string>, initial_options: Record<string, string> | null = null) {
    if (Object.keys(checkboxes).length > 10) {
        throw new Error("Maximum number of checkboxes allowed by Slack is 10");
    }

    const result = {
        type: "input",
        block_id: action_id,
        element: {
            type: "checkboxes",
            options: dictionaryToCheckboxes(checkboxes),
            action_id: action_id
        },
        label: textBlock(label)
    };

    if (initial_options) {
        (<any>result.element).initial_options = dictionaryToCheckboxes(initial_options);
    }

    return result;
}

function dictionaryToCheckboxes(checkboxes: Record<string, string> | null) {
    if (checkboxes === null) {
        return null;
    }
    return Object.entries(checkboxes).map(([c, text]) => ({
        text: textBlock(text, "mrkdwn"),
        value: c
    }));
}