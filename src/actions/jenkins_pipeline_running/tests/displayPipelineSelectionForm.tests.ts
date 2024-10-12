import { displayPipelineSelectionForm } from "../../index";

describe("displayPipelineSelectionForm", () => {
    let ack: jest.Mock;
    let respond: jest.Mock;

    beforeEach(() => {
        ack = jest.fn();
        respond = jest.fn();
    });

    it("responds with the pipeline selection form", async () => {
        await displayPipelineSelectionForm({ ack, respond } as any);

        expect(respond).toHaveBeenCalled();
        expect(respond.mock.calls[0][0]).toMatchSnapshot();
    });
});