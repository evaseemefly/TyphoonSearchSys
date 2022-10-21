import { Component, Vue, Watch } from 'vue-property-decorator'
import * as L from 'leaflet'

@Component
class MapMixin extends Vue {
	/**
	 *根据 leaflet_id -> map.removce(layer)
	 *
	 * @param {number} id
	 * @memberof MapMixin
	 */
	clearLayerById(id: number): void {
		const mymap: L.Map = this.$refs.basemap['mapObject']
		if (mymap) {
			mymap.eachLayer((layer: L.Layer) => {
				// @ts-ignore
				if (layer._leaflet_id === id) {
					mymap.removeLayer(layer)
				}
			})
		}
	}
}

export { MapMixin }
