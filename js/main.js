import { Mod } from "shapez/mods/mod";
import { MODS } from "shapez/mods/modloader";

import { patchBaseItem } from "./patches/base_item";
import { patchBooleanItem } from "./patches/boolean_item";
import { patchItemProcessor } from "./patches/item_processor";
import { patchItemProcessorOverlays } from "./patches/item_processor_overlays";
import { patchLogicGate } from "./patches/logic_gate";
import { patchMapChunkView } from "./patches/map_chunk_view";
import { patchMapView } from "./patches/map_view";
import { patchShapeDefinition } from "./patches/shape_definition";
import { patchShapeDefinitionManager } from "./patches/shape_definition_manager";
import { patchWire } from "./patches/wire";
import { itemResolverManager } from "./item_resolver_manager";
import { BooleanItemResolver } from "./item_resolvers/boolean";
import { ColorItemResolver } from "./item_resolvers/color";
import { ShapeItemResolver } from "./item_resolvers/shape";

class ModImpl extends Mod {
    init() {
        this.#sortModOrder();

        this.registerItemResolver(BooleanItemResolver);
        this.registerItemResolver(ColorItemResolver);
        this.registerItemResolver(ShapeItemResolver);

        this.#patchAll();
    }

    registerItemResolver(resolverClass) {
        itemResolverManager.addResolver(resolverClass);
    }
    removeItemResolver(resolverClass) {
        itemResolverManager.removeResolver(resolverClass);
    }

    #sortModOrder() {
        const [ core, ...modLoadQueue ] = MODS.modLoadQueue;
    
        modLoadQueue.forEach(({ meta }) => {
            if (!meta.loadBefore) {
                meta.loadBefore = [];
            } else if (typeof meta.loadBefore === "string") {
                meta.loadBefore = [ meta.loadBefore ];
            }
    
            if (!meta.loadAfter) {
                meta.loadAfter = [];
            } else if (typeof meta.loadAfter === "string") {
                meta.loadAfter = [ meta.loadAfter ];
            }
        });
    
        modLoadQueue.sort((a, b) => {
            const am = a.meta;
            const bm = b.meta;
    
            const shouldLoadBeforeAny = am.loadBefore.includes("*")
                || bm.loadAfter.includes("*");
            const shouldLoadBefore = am.loadBefore.some(x => x ===  bm.id)
                || bm.loadAfter.some(x => x === am.id);
    
            const shouldLoadAfterAny = bm.loadBefore.includes("*")
                || am.loadAfter.includes("*");
            const shouldLoadAfter = bm.loadBefore.some(x => x === am.id)
                || am.loadAfter.some(x => x === bm.id);
            
            let order = 0;
            order += shouldLoadBeforeAny && -1;
            order += shouldLoadBefore && -2;
            order += shouldLoadAfterAny && 1;
            order += shouldLoadAfter && 2;
            return order;
        });
    
        MODS.modLoadQueue = [ core, ...modLoadQueue ];
    }

    #patchAll() {
        patchBaseItem.call(this);
        patchBooleanItem.call(this);
        patchItemProcessor.call(this);
        patchItemProcessorOverlays.call(this);
        patchLogicGate.call(this);
        patchMapChunkView.call(this);
        patchMapView.call(this);
        patchShapeDefinition.call(this);
        patchShapeDefinitionManager.call(this);
        patchWire.call(this);
    }
}
