import { errorMessage } from "../errorMessage";

describe("errorMessage", () => {
    it("should create an error message section", () => {
        const control = errorMessage("Something went wrong", "Error details");
        expect(control).toMatchSnapshot();
    });
});
