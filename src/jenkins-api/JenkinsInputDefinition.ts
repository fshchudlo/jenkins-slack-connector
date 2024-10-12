import {JenkinsParameterDefinition} from "./JenkinsParameterDefinition";

export type JenkinsInputDefinition = {
    id: string;
    message: string;
    proceedText: string;
    proceedUrl: string;
    abortUrl: string;
    inputs: JenkinsParameterDefinition[];
}