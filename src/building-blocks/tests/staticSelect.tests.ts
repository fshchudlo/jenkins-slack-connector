import { staticSelect } from "../staticSelect";

describe("staticSelect", () => {
    it("should create a static select with the correct properties", () => {
        const options = { option1: "Option 1", option2: "Option 2" };
        const control = staticSelect("Select an option", options, "action_id", "option1", "Choose an option");
        expect(control).toMatchSnapshot();
    });

    it("should throw an error if more than 100 options are provided", () => {
        const options: { [key: string]: string } = {};
        for (let i = 1; i <= 101; i++) {
            options[`option${i}`] = `Option ${i}`;
        }
        expect(() => staticSelect("Select an option", options, "some_action_id")).toThrow(
            "Maximum number of options allowed by Slack is 100"
        );
    });

    it("should throw an error if the display text length exceeds 75 characters", () => {
        const options = { option1: "This is a very long option text that exceeds the maximum allowed length of 75 symbols" };
        expect(() => staticSelect("Select an option", options, "some_action_id")).toThrow(
            "Display text length allowed by Slack is 75"
        );
    });
});
