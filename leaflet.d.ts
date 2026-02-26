declare module 'leaflet' {
  export function map(element: HTMLElement | string, options?: object): Map
  export function tileLayer(url: string, options?: object): TileLayer
  export function marker(latLng: [number, number], options?: object): Marker
  export function divIcon(options?: object): DivIcon

  export interface Map {
    setView(center: [number, number], zoom: number): this
    remove(): void
  }

  export interface TileLayer {
    addTo(map: Map): this
  }

  export interface Marker {
    bindPopup(content: string, options?: object): this
    addTo(map: Map): this
  }

  export interface DivIcon {}

  const L: {
    map: typeof map
    tileLayer: typeof tileLayer
    marker: typeof marker
    divIcon: typeof divIcon
  }
  export default L
}

