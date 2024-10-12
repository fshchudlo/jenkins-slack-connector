import { checkboxGroup } from "../checkboxGroup";

describe("checkboxGroup", () => {
    it("should create a checkbox group with the correct properties", () => {
        const control = checkboxGroup("Select options", "action_id", { option1: "Option 1", option2: "Option 2" }, { option1: "Option 1" });
        expect(control).toMatchSnapshot();
    });

    it("should throw an error if more than 10 checkboxes are provided", () => {
        const checkboxes = {
            option1: "Option 1",
            option2: "Option 2",
            option3: "Option 3",
            option4: "Option 4",
            option5: "Option 5",
            option6: "Option 6",
            option7: "Option 7",
            option8: "Option 8",
            option9: "Option 9",
            option10: "Option 10",
            option11: "Option 11"
        };
        expect(() => checkboxGroup("Select options", "action_id", checkboxes)).toThrow(
            "Maximum number of checkboxes allowed by Slack is 10"
        );
    });
});
