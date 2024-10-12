import { reformatHtml } from "../reformatHtml";

describe("reformatHtml", () => {
    it("should reformat links and linebreaks", () => {
        const expectedDescription = "String with a <https://example.com|link> and \na line break.";
        expect(reformatHtml("String with a <a href=\"https://example.com\">link</a> and <br/>a line break.")).toEqual(expectedDescription);
    });
});
