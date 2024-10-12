import { textBlock } from "./textBlock";

export function placeholder(text: string) {
    if (text.length > 150) {
        throw new Error("Maximum placeholder length is 150");
    }
    return textBlock(text);
}