import { ShapeDefinition } from "shapez/game/shape_definition";
import { ItemResolver } from "../item_resolver";

export class ShapeItemResolver extends ItemResolver {
    constructor(root) {
        super("shape");
    }

    isValidCode(code, root) {
        return ShapeDefinition.isValidShortKey(code);
    }

    parseCode(code, root) {
        return root.shapeDefinitionManager.getShapeItemFromShortKey(code);
    }
}