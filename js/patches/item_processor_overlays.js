import { globalConfig } from "shapez/core/config";
import { smoothPulse } from "shapez/core/utils";
import { BaseItem } from "shapez/game/base_item";
import { ItemProcessorOverlaysSystem } from "shapez/game/systems/item_processor_overlays";

export function patchItemProcessorOverlays() {
    this.modInterface.replaceMethod(ItemProcessorOverlaysSystem, "drawConnectedSlotRequirement", function ($old, [ parameters, entity, { drawIfFalse = true } ]) {
        const staticComp = entity.components.StaticMapEntity;
        const pinsComp = entity.components.WiredPins;

        let anySlotConnected = false;

        // Check if any slot has a value
        for (let i = 0; i < pinsComp.slots.length; ++i) {
            const slot = pinsComp.slots[i];
            const network = slot.linkedNetwork;
            if (network && network.hasValue()) {
                anySlotConnected = true;

                if (BaseItem.isTruthyItem(network.currentValue) || !drawIfFalse) {
                    // No need to draw anything
                    return;
                }
            }
        }

        const pulse = smoothPulse(this.root.time.now());
        parameters.context.globalAlpha = 0.6 + 0.4 * pulse;
        const sprite = anySlotConnected ? this.spriteDisabled : this.spriteDisconnected;
        sprite.drawCachedCentered(
            parameters,
            (staticComp.origin.x + 0.5) * globalConfig.tileSize,
            (staticComp.origin.y + 0.5) * globalConfig.tileSize,
            globalConfig.tileSize * (0.7 + 0.2 * pulse)
        );

        parameters.context.globalAlpha = 1;
    });
}