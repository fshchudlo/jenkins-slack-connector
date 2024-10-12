export function contextBlock(...elements: any[]) {
    return {
        type: "context",
        elements: elements
    };
}