import { BaseItem } from "shapez/game/base_item";
import { enumItemProcessorRequirements } from "shapez/game/components/item_processor";
import { ItemProcessorSystem, MODS_CAN_PROCESS, MODS_PROCESSING_REQUIREMENTS } from "shapez/game/systems/item_processor";

export function patchItemProcessor() {
    this.modInterface.extendClass(ItemProcessorSystem, () => ({
        checkRequirements(entity, item, slotIndex) {
            const itemProcessorComp = entity.components.ItemProcessor;
            const pinsComp = entity.components.WiredPins;
    
            if (MODS_PROCESSING_REQUIREMENTS[itemProcessorComp.processingRequirement]) {
                return MODS_PROCESSING_REQUIREMENTS[itemProcessorComp.processingRequirement].bind(this)({
                    entity,
                    item,
                    slotIndex,
                });
            }
    
            switch (itemProcessorComp.processingRequirement) {
                case enumItemProcessorRequirements.painterQuad: {
                    if (slotIndex === 0) {
                        return true;
                    }
    
                    const network = pinsComp.slots[slotIndex - 1].linkedNetwork;
                    const slotIsEnabled = network && network.hasValue() && BaseItem.isTruthyItem(network.currentValue);
                    if (!slotIsEnabled) {
                        return false;
                    }
                    return true;
                }
    
                default:
                    return true;
            }
        },
        canProcess(entity) {
            const processorComp = entity.components.ItemProcessor;
    
            if (MODS_CAN_PROCESS[processorComp.processingRequirement]) {
                return MODS_CAN_PROCESS[processorComp.processingRequirement].bind(this)({
                    entity,
                });
            }
    
            switch (processorComp.processingRequirement) {
                case null: {
                    return processorComp.inputCount >= processorComp.inputsPerCharge;
                }
    
                case enumItemProcessorRequirements.painterQuad: {
                    const pinsComp = entity.components.WiredPins;
    
                    const shapeItem = processorComp.inputSlots.get(0);
                    if (!shapeItem) {
                        return false;
                    }
    
                    const slotStatus = [];
    
                    for (let i = 0; i < 4; ++i) {
                        const network = pinsComp.slots[i].linkedNetwork;
                        const networkValue = network && network.hasValue() ? network.currentValue : null;
    
                        if (!BaseItem.isTruthyItem(networkValue)) {
                            slotStatus.push(false);
                            continue;
                        }
    
                        slotStatus.push(true);
                    }
    
                    if (!slotStatus.includes(true)) {
                        return false;
                    }
    
                    for (let i = 0; i < slotStatus.length; ++i) {
                        if (slotStatus[i] && !processorComp.inputSlots.get(1 + i)) {
                            for (let j = 0; j < 4; ++j) {
                                const layer = shapeItem.definition.layers[j];
                                if (layer && layer[i]) {
                                    return false;
                                }
                            }
                        }
                    }
    
                    return true;
                }
    
                default:
                    assertAlways(false, "Unknown requirement for " + processorComp.processingRequirement);
            }
        },
    }));
}