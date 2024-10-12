export function section(text: string) {
    return {
        type: "section",
        text: { type: "mrkdwn", text: text }
    };
}