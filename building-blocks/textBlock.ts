export function textBlock(text: string, type: "plain_text" | "mrkdwn" = "plain_text") {
    return {type, text};
}