import { textbox } from "./textbox";

export function textarea(label: string, action_id: string, initial_value: string | null = null, placeholder: string | null = null) {
    return textbox(label, action_id, initial_value, placeholder, true);
}