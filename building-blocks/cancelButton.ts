import { ActionKeys } from "../actions";
import { button } from "./button";

export function cancelButton(text: string = "Cancel", action_id: string = ActionKeys.DISPLAY_CANCELLATION_MESSAGE, value: string = "Cancel", style: string = "danger") {
    return button(text, action_id, value, style);
}