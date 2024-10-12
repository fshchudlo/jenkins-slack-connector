import { section } from "./section";

export function errorMessage(message: string, details: any) {
    return [
        section(`:octagonal_sign: *${message}* \n\`${details}\``)
    ];
}