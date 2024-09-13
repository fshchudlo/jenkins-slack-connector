import { placeholder } from "../placeholder";

describe("placeholder", () => {
    it("should create a plain_text placeholder", () => {
        const control = placeholder("Enter text here");
        expect(control).toEqual({
            type: "plain_text",
            text: "Enter text here",
        });
    });

    it("should throw an error if the text length exceeds 150 characters", () => {
        const longText = "a".repeat(151);
        expect(() => placeholder(longText)).toThrow(
            "Maximum placeholder length is 150"
        );
    });

    it("should handle empty string", () => {
        const control = placeholder("");
        expect(control).toEqual({
            type: "plain_text",
            text: "",
        });
    });

    it("should handle special characters and whitespace", () => {
        const control = placeholder("!@#$%^&*() \n\t");
        expect(control).toEqual({
            type: "plain_text",
            text: "!@#$%^&*() \n\t",
        });
    });
});
