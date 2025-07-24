import { GeoJsonLayer } from "deck.gl";
import { Feature, Geometry } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import Map from "react-map-gl/maplibre";
// import TestButtons from "../TestButtons/TestButtons";

type PropertiesType = {
  name: string;
  color: string;
};

export default function MapWrapper() {

  const layer = new GeoJsonLayer<PropertiesType>({
    id: 'GeoJsonLayer',
    data: '../../assets/test_points.geojson',

    stroked: false,
    filled: true,
    pointType: 'circle+text',
    pickable: true,

    getFillColor: [160, 160, 180, 200],
    getLineColor: (f: Feature<Geometry>) => {
      const hex = f.properties!.color;
      // convert to RGB
      return hex ? hex.match(/[0-9a-f]{2}/g).map((x: string) => parseInt(x, 16)) : [0, 0, 0];
    },
    getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
    getLineWidth: 200,
    getPointRadius: 4,
    getTextSize: 12
    });

    return (
    <Map
      initialViewState={{
      latitude: 45.508888,
      longitude: -73.561668,
      zoom: 11,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    >
      {layer}
    </Map>
    );
}
