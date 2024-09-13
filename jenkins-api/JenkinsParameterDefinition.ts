export type JenkinsParameterDefinition = {
    type: "StringParameterDefinition" | "TextParameterDefinition" | "ChoiceParameterDefinition" | "BooleanParameterDefinition";
    name: string;
    description?: string;
    defaultParameterValue?: { value: any };
    definition?: {
        choices?: string[];
        defaultVal?: any;
    };
    choices?: string[];
}
