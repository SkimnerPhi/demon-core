import { BooleanItem } from "shapez/game/items/boolean_item";

export function patchBooleanItem() {
    this.modInterface.extendClass(BooleanItem, () => ({
        isTruthy() {
            return !!this.value;
        }
    }));
}