const { LogicGateSystem } = require("shapez/game/systems/logic_gate");
const { BaseItem } = require("shapez/game/base_item");
const { BOOL_TRUE_SINGLETON, BOOL_FALSE_SINGLETON } = require("shapez/game/items/boolean_item");
const { enumLogicGateType } = require("shapez/game/components/logic_gate");

export function patchLogicGate() {
    const replace = {
        compute_AND(parameters) {
            return BaseItem.isTruthyItem(parameters[0]) && BaseItem.isTruthyItem(parameters[1])
                ? BOOL_TRUE_SINGLETON
                : BOOL_FALSE_SINGLETON;
        },
        compute_NOT(parameters) {
            return BaseItem.isTruthyItem(parameters[0]) ? BOOL_FALSE_SINGLETON : BOOL_TRUE_SINGLETON;
        },
        compute_XOR(parameters) {
            return BaseItem.isTruthyItem(parameters[0]) !== BaseItem.isTruthyItem(parameters[1])
                ? BOOL_TRUE_SINGLETON
                : BOOL_FALSE_SINGLETON;
        },
        compute_OR(parameters) {
            return BaseItem.isTruthyItem(parameters[0]) || BaseItem.isTruthyItem(parameters[1])
                ? BOOL_TRUE_SINGLETON
                : BOOL_FALSE_SINGLETON;
        },
        compute_IF(parameters) {
            const flag = parameters[0];
            const value = parameters[1];
    
            if (BaseItem.isTruthyItem(flag)) {
                return value;
            }
    
            return null;
        },
    };
    this.modInterface.extendClass(LogicGateSystem, () => replace);

    this.signals.gameInitialized.add(root => {
        const logicGate = root.systemMgr.systems.logicGate;
        const boundOperations = logicGate.boundOperations;

        boundOperations[enumLogicGateType.and] = replace.compute_AND.bind(logicGate);
        boundOperations[enumLogicGateType.not] = replace.compute_NOT.bind(logicGate);
        boundOperations[enumLogicGateType.xor] = replace.compute_XOR.bind(logicGate);
        boundOperations[enumLogicGateType.or] = replace.compute_OR.bind(logicGate);
        boundOperations[enumLogicGateType.transistor] = replace.compute_IF.bind(logicGate);
    });
}