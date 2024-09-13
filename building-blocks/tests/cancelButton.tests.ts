import { cancelButton } from "../cancelButton";

describe("cancelButton", () => {
    it("should create a cancel button with the correct properties", () => {
        const control = cancelButton();
        expect(control).toMatchSnapshot();
    });

    it("should use the provided values if provided", () => {
        const control = cancelButton("Don't do it", "cancel_action", "no", "warning");
        expect(control).toMatchSnapshot();
    });
});
