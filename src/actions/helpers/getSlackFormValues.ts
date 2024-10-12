export function getSlackFormValues(formValues: any): { [key: string]: any } {
    return Object.values(formValues)
        .flatMap(controlsGroup => Object.entries(controlsGroup))
        .reduce((result, [fieldName, field]) => {
            if (["external_select", "static_select"].includes(field.type) && field.selected_option) {
                result[fieldName] = field.selected_option.value;
            } else if (field.type === "checkboxes" && field.selected_options) {
                field.selected_options.forEach(option => result[option.value] = true);
            } else if (field.type === "plain_text_input" && field.value !== undefined) {
                result[fieldName] = field.value;
            } else {
                throw new Error(`Unknown control type ${field.type} for the field ${fieldName}`);
            }
            return result;
        }, {});
}