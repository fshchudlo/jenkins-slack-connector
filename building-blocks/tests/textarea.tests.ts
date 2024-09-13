import { textarea } from "../textarea";

describe("textarea", () => {
    it("should create a textarea with the correct properties", () => {
        const control = textarea("Enter text", "action_id", "initial value", "placeholder");
        expect(control).toMatchSnapshot();
    });

    it("should handle empty initial_value and placeholder", () => {
        const control = textarea("Enter text", "action_id");
        expect(control.element.initial_value).toBeFalsy();
        expect(control.element.placeholder).toBeUndefined();
    });
});
