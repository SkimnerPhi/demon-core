import { BaseItem } from "shapez/game/base_item";
import { WireSystem } from "shapez/game/systems/wire";

export function patchWire() {
    this.modInterface.replaceMethod(WireSystem, "getSpriteSetAndOpacityForWire", function ($old, [ wireComp ]) {
        if (!wireComp.linkedNetwork) {
            return {
                spriteSet: this.wireSprites[wireComp.variant],
                opacity: 0.5,
            };
        }

        const network = wireComp.linkedNetwork;
        if (network.valueConflict) {
            return {
                spriteSet: this.wireSprites.conflict,
                opacity: 1,
            };
        }

        return {
            spriteSet: this.wireSprites[wireComp.variant],
            opacity: BaseItem.isTruthyItem(network.currentValue) ? 1 : 0.5,
        };
    });
}