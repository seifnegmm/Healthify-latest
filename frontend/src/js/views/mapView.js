import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN } from '../config';
import View from './view';

class MapView extends View {
  #map;
  #markerStart;
  #markerEnd;
  #popup;

  constructor() {
    super();
    this.#getCoords();
  }

  displayWorkoutRoute(routeData) {
    this.#markerStart && this.#markerStart.remove();
    this.#markerEnd && this.#markerEnd.remove();
    this.#removeAddedLayers(this.#map);
    this.#removeAddedSources(this.#map);

    const { startPoint, midPoint, endPoint, geojson } = routeData;
    this.#map.addSource('line', {
      type: 'geojson',
      data: geojson,
    });
    this.#addLineLayer(this.#map);
    this.#addDashedLineLayer(this.#map);
    this.#displayRouteMarkers(this.#map, startPoint, endPoint);
    this.#animateRoute(this.#map);
    this.#flyToRoute(this.#map, midPoint);
  }

  #removeAddedSources(map) {
    if (map.getStyle().sources.line) map.removeSource('line');
  }

  #removeAddedLayers(map) {
    map.getStyle().layers.forEach(layer => {
      if (layer.id === 'line-background' || layer.id === 'line-dashed') {
        map.removeLayer(layer.id);
      }
    });
  }

  #flyToRoute(map, point) {
    map.flyTo({
      center: point,
      zoom: 13.5,
      essential: true,
    });
  }

  #displayRouteMarkers(map, start, end) {
    this.#markerStart = new mapboxgl.Marker({ color: '#8B0000' })
      .setLngLat(start)
      .addTo(map);
    this.#markerEnd = new mapboxgl.Marker({ color: '#8B0000' })
      .setLngLat(end)
      .addTo(map);
  }

  #addLineLayer(map) {
    map.addLayer({
      type: 'line',
      source: 'line',
      id: 'line-background',
      paint: {
        'line-color': 'red',
        'line-width': 6,
        'line-opacity': 0.4,
      },
    });
  }

  #addDashedLineLayer(map) {
    map.addLayer({
      type: 'line',
      source: 'line',
      id: 'line-dashed',
      paint: {
        'line-color': 'red',
        'line-width': 6,
        'line-dasharray': [0, 4, 3],
      },
    });
  }

  #animateRoute(map) {
    const dashArraySequence = [
      [0, 4, 3],
      [0.5, 4, 2.5],
      [1, 4, 2],
      [1.5, 4, 1.5],
      [2, 4, 1],
      [2.5, 4, 0.5],
      [3, 4, 0],
      [0, 0.5, 3, 3.5],
      [0, 1, 3, 3],
      [0, 1.5, 3, 2.5],
      [0, 2, 3, 2],
      [0, 2.5, 3, 1.5],
      [0, 3, 3, 1],
      [0, 3.5, 3, 0.5],
    ];

    let step = 0;

    function animateDashArray(timestamp) {
      const newStep = parseInt((timestamp / 50) % dashArraySequence.length);

      if (newStep !== step) {
        map.setPaintProperty(
          'line-dashed',
          'line-dasharray',
          dashArraySequence[step]
        );
        step = newStep;
      }
      requestAnimationFrame(animateDashArray);
    }
    animateDashArray(0);
  }

  #loadMap(pos) {
    const { latitude, longitude } = pos.coords;
    const coords = [longitude, latitude];

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    this.#map = new mapboxgl.Map({
      container: 'map',
      center: coords,
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 13.5,
    });

    this.#popup = new mapboxgl.Popup({ offset: 25 }).setText(
      'Current Location'
    );

    this.#markerStart = new mapboxgl.Marker({ color: '#8B0000' })
      .setLngLat([longitude, latitude])
      .setPopup(this.#popup)
      .addTo(this.#map);
  }

  #getCoords() {
    navigator.geolocation.getCurrentPosition(
      this.#loadMap.bind(this),
      function () {
        console.log('Error loading map');
      }
    );
  }
}

export default new MapView();
