export class ItemResolver {
    constructor(id) {
        this.id = id;
    }

    isValidCode(code, root) {
        throw `isValidCode() must be implmenented for ${this.id} item resolver.`;
    }
    
    parseCode(code, root) {
        throw `parseCode() must be implemented for ${this.id} item resolver.`
    }

    suggestCode(input, root) {
        return [];
    }
}