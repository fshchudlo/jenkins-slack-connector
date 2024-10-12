import { textBlock } from "./textBlock";

export function button(text: string, action_id: string, value: string = action_id, style: string = "primary") {
    return {
        type: "button",
        text: textBlock(text),
        style: style,
        value: value,
        action_id: action_id
    };
}