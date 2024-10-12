import { getSlackFormValues } from "../getSlackFormValues";

describe("getSlackFormValues", () => {
    it("should return an empty object when no form values are provided", () => {
        const result = getSlackFormValues({});
        expect(result).toEqual({});
    });

    it("should extract values from a simple form", () => {
        const formValues = {
            "abc": {
                textboxValue: { type: "plain_text_input", value: "test text value" },
                selectValue: { type: "static_select", selected_option: { value: "test select value" } },
                checkboxGroup: { type: "checkboxes", selected_options: [{ value: "one" }] }
            }
        };
        const result = getSlackFormValues(formValues);
        expect(result).toEqual({
            textboxValue: "test text value",
            selectValue: "test select value",
            one: true
        });
    });

    it("should raise error for the unknown parameter", () => {
        const formValues = {
            "abc": {
                textboxValue: { type: "unknownType", value: "test text value" },
            }
        };
        expect(() => getSlackFormValues(formValues)).toThrow("Unknown control type unknownType for the field textboxValue");
    });
});
