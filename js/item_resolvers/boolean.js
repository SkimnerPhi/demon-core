import { BOOL_TRUE_SINGLETON, BOOL_FALSE_SINGLETON } from "shapez/game/items/boolean_item";
import { ItemResolver } from "../item_resolver";

export class BooleanItemResolver extends ItemResolver {
    constructor() {
        super("bool");
    }

    isValidCode(code, root) {
        code = code.trim();
        const lower = code.toLowerCase();
        return code === "1" || lower === "true"
            || code === "0" || lower === "false";
    }

    parseCode(code, root) {
        code = code.trim();
        const lower = code.toLowerCase();
        if (code === "1" || lower === "true") {
            return BOOL_TRUE_SINGLETON;
        }
        if (code === "0" || lower === "false") {
            return BOOL_FALSE_SINGLETON;
        }
    }

    suggestCode(input, root) {
        if (input.length === 0) {
            return [ "true", "false" ];
        }

        const lower = input;
        if ("true".startsWith(lower)) {
            return [ "true" ];
        }
        if ("false".startsWith(lower)) {
            return [ "false" ];
        }

        return [];
    }
}