import { enumColors } from "shapez/game/colors";
import { COLOR_ITEM_SINGLETONS } from "shapez/game/items/color_item";
import { ItemResolver } from "../item_resolver";

export class ColorItemResolver extends ItemResolver {
    constructor(root) {
        super("color");
    }

    isValidCode(code, root) {
        code = code.trim();
        const lower = code.toLowerCase();
        return !!enumColors[lower];
    }

    parseCode(code, root) {
        code = code.trim();
        const lower = code.toLowerCase();
        return COLOR_ITEM_SINGLETONS[lower];
    }

    suggestCode(input, root) {
        if (input.length === 0) {
            return Object.keys(enumColors);
        }

        const lower = input;
        return Object.keys(enumColors).filter(x => x.startsWith(lower));
    }
}