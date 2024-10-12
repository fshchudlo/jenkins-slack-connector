import { button } from "../button";

describe("button", () => {
    it("should create a button with the correct properties", () => {
        const buttonData = button("Click me", "action_id", "value", "primary");
        expect(buttonData).toMatchSnapshot();
    });

    it("should use the default style if not provided", () => {
        const buttonData = button("Click me", "action_id", "value");
        expect(buttonData.style).toBe("primary");
    });
});