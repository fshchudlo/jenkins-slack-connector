import {mapJenkinsParametersToSlackControls} from "../mapJenkinsParametersToSlackControls";
import {checkboxGroup, staticSelect, textarea, textbox} from "../../../building-blocks";
import {JenkinsParameterDefinition} from "../../../jenkins-api/JenkinsParameterDefinition";

describe("mapJenkinsParametersToSlackControls", () => {
    it("should return an empty array when no parameters are provided", () => {
        const result = mapJenkinsParametersToSlackControls([]);
        expect(result).toEqual([]);
    });

    it("should handle multiple parameters of different types", () => {
        const parameters: JenkinsParameterDefinition[] = [
            {
                name: "stringParam",
                type: "StringParameterDefinition",
                defaultParameterValue: {value: "default value"}
            },
            {name: "boolParam", type: "BooleanParameterDefinition", defaultParameterValue: {value: "true"}},
            {
                name: "choiceParam",
                type: "ChoiceParameterDefinition",
                defaultParameterValue: {value: "option1"},
                choices: ["option1", "option2", "option3"]
            },
            {
                name: "textParam",
                type: "TextParameterDefinition",
                defaultParameterValue: {value: "default value"}
            }

        ];
        const result = mapJenkinsParametersToSlackControls(parameters);
        expect(result).toHaveLength(4);

        expect(result[0]).toEqual(textbox("String param", "stringParam", "default value"));
        expect(result[1]).toEqual(checkboxGroup(" ", "boolParam", {["boolParam"]: "Bool param"}, {["boolParam"]: "Bool param"}));
        expect(result[2]).toEqual(staticSelect(
            "Choice param",
            {
                "option1": "option1",
                "option2": "option2",
                "option3": "option3"
            },
            "choiceParam",
            "option1",
            null
        ));
        expect(result[3]).toEqual(textarea("Text param", "textParam", "default value", null));
    });

    it("should reformat links and linebreaks for the parameter description", () => {
        const parameters: JenkinsParameterDefinition[] = [
            {
                name: "testParam",
                description: 'Parameter description with <a href="https://example.com">link</a> and <br/>a line break.',
                type: "StringParameterDefinition",
                defaultParameterValue: {value: "default value"}
            }
        ];
        const result = mapJenkinsParametersToSlackControls(parameters);

        const expectedDescription = "Parameter description with <https://example.com|link> and \na line break.";
        expect(result).toHaveLength(2);
        expect(result[1].elements[0].text).toEqual(expectedDescription);
    });

    it("should raise error for the unknown parameter", () => {
        const parameters = [
            {
                name: "unknownTypeParam",
                type: "unknownType"
            }
        ];
        expect(() => mapJenkinsParametersToSlackControls(<any[]>parameters)).toThrow("Unknown control type unknownType for the field unknownTypeParam");
    });
});
