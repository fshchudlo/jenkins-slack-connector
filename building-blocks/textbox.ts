import { textBlock } from "./textBlock";
import { placeholder } from "./placeholder";

export function textbox(label: string, action_id: string, initial_value: string = "", placeholder_text: string | null = null, multiline: boolean = false) {
    return {
        type: "input",
        label: textBlock(label),
        block_id: action_id,
        element: {
            type: "plain_text_input",
            action_id: action_id,
            multiline: multiline,
            initial_value: initial_value,
            placeholder: placeholder_text ? placeholder(placeholder_text) : undefined
        }
    };
}