import { textbox } from "../textbox";

describe("textbox", () => {
    it("should create a textbox with the correct properties", () => {
        const control = textbox("Enter text", "action_id", "initial value", "placeholder text");
        expect(control).toMatchSnapshot();
    });

    it("should handle empty initial_value and placeholder_text", () => {
        const textboxData = textbox("Enter text", "action_id");
        expect(textboxData).toMatchSnapshot();
    });

    it("should set multiline to true when provided", () => {
        const textboxData = textbox("Enter text", "action_id", "", null, true);
        expect(textboxData.element.multiline).toBe(true);
    });
});
