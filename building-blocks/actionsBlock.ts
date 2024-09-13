export function actionsBlock(block_id: string, elements: any[]) {
    return {
        type: "actions",
        block_id: block_id,
        elements: elements
    };
}