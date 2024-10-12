import {BasicAuthCredentials} from "./jenkins-api/BasicAuthCredentials";

const CREDENTIALS_STORE: Record<string, BasicAuthCredentials> = {}

export class CredentialsStore {
    static saveCredentials(userId: string, credentials: BasicAuthCredentials): void {
        CREDENTIALS_STORE[userId] = credentials;
    }

    static getCredentials(userId: string): BasicAuthCredentials | null {
        if (userId in CREDENTIALS_STORE) {
            return CREDENTIALS_STORE[userId];
        }
        return null;
    }
}