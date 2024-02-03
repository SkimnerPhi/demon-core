const { BaseItem } = require("shapez/game/base_item");

export function patchBaseItem() {
    this.modInterface.extendClass(BaseItem, () => ({
        isTruthy() {
            return true;
        }
    }));
    BaseItem.isTruthyItem = (item) => {
            return item?.isTruthy();
        }
    };
}