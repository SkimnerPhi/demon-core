import { MapChunkView } from "shapez/game/map_chunk_view";
import { MapView } from "shapez/game/map_view";

export function patchMapView() {
    this.modInterface.runAfterMethod(MapView, "drawWiresForegroundLayer", function(parameters) {
        this.drawVisibleChunks(parameters, MapChunkView.prototype.drawWiredPins);
    });
}