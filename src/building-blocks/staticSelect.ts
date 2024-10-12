import { textBlock } from "./textBlock";
import { placeholder } from "./placeholder";

export function staticSelect(label: string, options: Record<string, string>, action_id: string, initial_option: string | null = null, placeholder_text: string | null = null) {
    if (Object.keys(options).length > 100) {
        throw new Error("Maximum number of options allowed by Slack is 100");
    }

    const result = {
        type: "input",
        label: textBlock(label),
        block_id: action_id,
        element: {
            type: "static_select",
            options: Object.entries(options).map(([key, value]) => selectOption(key, value)),
            action_id: action_id
        }
    };

    if (initial_option !== null) {
        (<any>result.element).initial_option = selectOption(initial_option, options[initial_option]);
    }

    if (placeholder_text !== null) {
        (<any>result.element).placeholder = placeholder(placeholder_text);
    }

    return result;
}

function selectOption(value: string, text: string | null = null) {
    const textToDisplay = text === null ? value : text;
    if (textToDisplay.length > 75) {
        throw new Error("Display text length allowed by Slack is 75");
    }
    return {
        text: textBlock(textToDisplay),
        value: value
    };
}