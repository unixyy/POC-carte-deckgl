import DeckGL, { FlyToInterpolator, MapViewState } from "deck.gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useState } from "react";

const CITIES: { [name: string]: MapViewState } = {
  SF: {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 10,
  },
  NYC: {
    longitude: -74.0,
    latitude: 40.7,
    zoom: 10,
  },
};

export default function TestButtons() {
  const [initialViewState, setInitialViewState] = useState<MapViewState>(
    CITIES.SF
  );

  const flyToCity = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    setInitialViewState({
      ...CITIES[(evt.target as HTMLButtonElement).id],
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    });
  }, []);

  return (
    <>
      <DeckGL initialViewState={initialViewState} controller />;
      {Object.keys(CITIES).map((name) => (
        <button id={name} onClick={flyToCity}>
          {name}
        </button>
      ))}
    </>
  );
}
