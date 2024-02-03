const { MOD_CHUNK_DRAW_HOOKS, MapChunkView } = require("shapez/game/map_chunk_view");
const { MapView } = require("shapez/game/map_view");

export function patchMapChunkView() {
    MOD_CHUNK_DRAW_HOOKS.wiresBefore = [];
    MOD_CHUNK_DRAW_HOOKS.wiresAfter = [];

    this.modInterface.extendClass(MapChunkView, ({ $super, $old }) => ({
        drawWiresForegroundLayer(parameters) {
            const systems = this.root.systemMgr.systems;

            MOD_CHUNK_DRAW_HOOKS.wiresBefore.forEach(systemId =>
                systems[systemId].drawChunk(parameters, this)
            );

            systems.wire.drawChunk(parameters, this);
            systems.staticMapEntities.drawWiresChunk(parameters, this);

            MOD_CHUNK_DRAW_HOOKS.wiresAfter.forEach(systemId =>
                systems[systemId].drawChunk(parameters, this)
            );
        },
        drawWiredPins(parameters) {
            const systems = this.root.systemMgr.systems;
            systems.wiredPins.drawChunk(parameters, this);
        }
    }));
}