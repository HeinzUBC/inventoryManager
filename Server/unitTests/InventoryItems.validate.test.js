const {validate} = require("../Models/InventoryItem");

describe('validateInventoryItem', function () {
    it('should reject item missing name field', function () {
        const item = {
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"name\" is required");
    });

    it('should reject item missing description field', function () {
        const item = {
            name: "iPad",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"description\" is required");
    });

    it('should reject item missing price field', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"price\" is required");
    });

    it('should reject item missing imageURL field', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"imageURL\" is required");
    });

    it('should reject item missing category field', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"category\" is required");
    });

    it('should reject item with empty string for name', function () {
        const item = {
            name: "",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"name\" is not allowed to be empty");
    });

    it('should reject item with empty string for description', function () {
        const item = {
            name: "iPad",
            description: "",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"description\" is not allowed to be empty");
    });

    it('should reject item with non-numeric value for price', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: "",
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"price\" must be a number");
    });

    it('should reject item with negative number for price', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: -1,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"price\" must be greater than or equal to 0");
    });

    it('should reject item with empty string for imageURl', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"imageURL\" is not allowed to be empty");
    });

    it('should reject item with non-URL format string for imageURl', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "ELECTRONICS",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"imageURL\" must be a valid uri");
    });

    it('should reject item with empty string for category', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "",
        };

        const {error} = validate(item);

        expect(error.message).toEqual("\"category\" is not allowed to be empty");
    });

    it('should accept item with lowercase category string' +
        'by converting it to uppercase', function () {
        const item = {
            name: "iPad",
            description: "tablet computer device by Apple",
            price: 1000,
            imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/d8/IPad_Pro_11_mockup.png",
            category: "electronics",
        };

        const {error, value} = validate(item);

        expect(error).toBeUndefined();
        expect(value.category).toEqual("ELECTRONICS");
    });
});