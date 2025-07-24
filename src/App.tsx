import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import DeckGL, { GeoJsonLayer, PickingInfo } from "deck.gl";
import { useCallback, useEffect } from "react";
import type { Feature, Geometry } from "geojson";
import { useMemo, useState } from "react";
import { DataFilterExtension } from "@deck.gl/extensions";
import { Slider } from "@mui/material";

type PropertiesType = {
  velocity: number[];
  timestamp: number;
};

function App() {
  // State to store quantile thresholds
  const [quantiles, setQuantiles] = useState<number[][]>([[]]);
  // State to store the fetched geojson data
  const [geojsonData, setGeojsonData] = useState<any>(null);

  const [geojsonAssembled, setgeojsonAssembled] = useState<any>(null);

  const [sliderIndex, setSliderIndex] = useState<number>(0);

  // Fetch and compute quantiles once, and store geojson data
  useEffect(() => {
    fetch("/points_v4_allveltime.geojson")
      .then((res) => res.json())
      .then((geojson) => {
        setGeojsonData(geojson);

        console.log("GeoJSON data fetched:", geojson);
        // const velocities = geojson.features
        //   .map((f: Feature<Geometry, PropertiesType>) => f.properties?.velocity)
        //   .filter((v: number) => !isNaN(v))
        //   .sort((a: number, b: number) => a - b);

        // // Compute quantiles (e.g., 25%, 50%, 75%)
        // const q1 = velocities[Math.floor(velocities.length * 0.25)];
        // const q2 = velocities[Math.floor(velocities.length * 0.5)];
        // const q3 = velocities[Math.floor(velocities.length * 0.75)];
        // setQuantiles([q1, q2, q3]);

        setQuantiles(geojson.properties.quantiles || []);
        console.log("Quantiles computed:", geojson.properties.quantiles);
      });
  }, []);

  // const layer = useMemo(() =>
  //   new GeoJsonLayer({
  //     id: 'geojson',
  //     data: geojsonData,
  //     pointType: 'circle',
  //     getFillColor: (f: Feature<Geometry, PropertiesType>) => {
  //       const velocity = Array.isArray(f.properties?.velocity)
  //         ? f.properties.velocity.map((v: number) => v)
  //         : [];
  //       if (!velocity) return [160, 160, 180, 200];
  //       const speed = Array.isArray(velocity)
  //         ? velocity.reduce((sum: number, v: number) => sum + v, 0)
  //         : parseFloat(velocity as string);
  //       // console.log("Speed: ", speed, "velocity: ", velocity);
  //       if (speed < quantiles[0]) return [0, 0, 255, 200];      // 0-25%: Blue
  //       if (speed < quantiles[1]) return [0, 255, 0, 200];      // 25-50%: Green
  //       if (speed < quantiles[2]) return [255, 255, 0, 200];    // 50-75%: Yellow
  //       return [255, 0, 0, 200];                                // 75-100%: Red
  //     },
  //     getPointRadius: 100,
  //     stroked: true,
  //     getLineColor: (f: Feature<Geometry, PropertiesType>) => {
  //       const velocity = f.properties?.velocity;
  //       if (!velocity || quantiles.length < 3) return [160, 160, 180, 200];
  //       const speed = velocity;
  //       if (speed < quantiles[0]) return [0, 0, 255, 200];      // 0-25%: Blue
  //       if (speed < quantiles[1]) return [0, 255, 0, 200];      // 25-50%: Green
  //       if (speed < quantiles[2]) return [255, 255, 0, 200];    // 50-75%: Yellow
  //       return [255, 0, 0, 200];                                // 75-100%: Red
  //     },
  //     getLineWidth: 1,
  //     filled: true,
  //     getFilterValue: (f: Feature<Geometry, PropertiesType>) => f.properties?.timestamp,
  //     filterRange: [8999, 9001],
  //     extensions: [new DataFilterExtension({
  //       filterSize: 1
  //     })],
  //   }), [quantiles, geojsonData]
  // );

  const pointLayer = useMemo(() => {
    // console.log(" use memo sliderIndex:", sliderIndex);
    return new GeoJsonLayer({
      id: `point-layer-${sliderIndex}`,
      data: geojsonData,
      pointType: "circle",
      getFillColor: (f: Feature<Geometry, PropertiesType>) => {
        const velocity = f.properties?.velocity[sliderIndex];
        if (velocity === undefined || quantiles.length < 3) return [160, 160, 180, 200]; // color : gray
        const speed = velocity;
        // console.log("velocity: ", velocity);
        // console.log("quantiles: ", quantiles[sliderIndex]);
        if (speed < quantiles[sliderIndex][0]) return [0, 0, 255, 200]; // 0-25%: Blue
        if (speed < quantiles[sliderIndex][1]) return [0, 255, 0, 200]; // 25-50%: Green
        if (speed < quantiles[sliderIndex][2]) return [255, 255, 0, 200]; // 50-75%: Yellow
        return [255, 0, 0, 200]; // 75-100%: Red
      },
      getPointRadius: 100,
      stroked: false,
      getLineColor: [0, 0, 0, 200],
      getLineWidth: 1,
    });
  }, [geojsonData, quantiles, sliderIndex]);

  const getTooltip = useCallback(({object}: PickingInfo<PropertiesType>) => {
    if (!object) return null;
    const velocity = object.velocity;
    if (Array.isArray(velocity)) {
      return `Velocity: [${velocity.join(", ")}]`;
    }
    if (typeof velocity === "number") {
      return `Velocity: ${velocity}`;
    }
    return "No velocity data";
  }, []);

  return (
    <DeckGL
      initialViewState={{
        longitude: -70.9082, // Adjusted longitude for more northeast
        latitude: 47.0139, // Adjusted latitude for more northeast
        zoom: 9,
        pitch: 0,
        bearing: 0,
            }}
            controller
            layers={[pointLayer]}
            getTooltip={getTooltip}
          >
            <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
BONJOUR
            </div>
            
              <Slider
          aria-label="Time Slider"
          value={sliderIndex}
          onChange={(_, value) => {
            setSliderIndex(value as number);
          }}
          // onChangeCommitted={(_, value) => {
          //   setSliderIndex(value as number);
          //   console.log("Slider value changed to: ", value);
          // }}
          getAriaValueText={(value) => `Time: ${value}`}
          valueLabelDisplay="auto"
          style={{ position: "absolute", bottom: 20, left:"30%", width: 600, zIndex: 10 }}
          shiftStep={1}
          step={1}
          marks
          min={0}
          max={30}
              />
            {/* <Map mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" > */}
      <Map mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json">
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />
        <ScaleControl position="bottom-right" />
      </Map>
    </DeckGL>
    // <Map
    //       initialViewState={{
    //         latitude: 45.508888,
    //         longitude: -73.561668,
    //         zoom: 11,
    //       }}
    //       style={{ width: "100vw", height: "100vh" }}
    //       mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    //     >
    //       <Marker longitude={0} latitude={0} />
    //       <FullscreenControl position="top-right" />
    //       <NavigationControl position="top-right" />
    //       <GeolocateControl position="top-right" />
    //       <ScaleControl position="bottom-right" />
    //     </Map>
  );
}

export default App;
