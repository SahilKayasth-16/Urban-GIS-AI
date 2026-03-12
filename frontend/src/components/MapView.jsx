import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/MapView.css";
import "../styles/CompetitorMarker.css";
import { useLocation } from "../context/LocationContext";

const CATEGORY_ICONS = {
  "Emergency Services": { icon: "fa-solid fa-location-dot", color: "#00C49F" },
  "Entertainment": { icon: "fa-solid fa-location-dot", color: "#0088FE" },
  "Food & Hospitality": { icon: "fa-solid fa-location-dot", color: "#FFBB28" },
  "Corporate & IT": { icon: "fa-solid fa-location-dot", color: "#FF8042" },
  "Public Amenities": { icon: "fa-solid fa-location-dot", color: "#AA66CC" },
  "Automobile Services": { icon: "fa-solid fa-location-dot", color: "#33B5E5" },
  "Retail Shop": { icon: "fa-solid fa-location-dot", color: "#FF4444" },
  "Education": { icon: "fa-solid fa-location-dot", color: "#99CC00" },
  "Logistics": { icon: "fa-solid fa-location-dot", color: "#6f9689" },
  "Others...": { icon: "fa-solid fa-location-dot", color: "#2BBBAD" }
};

const MAP_STYLES = {
  street: "https://tiles.openfreemap.org/styles/liberty",
  light: "https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  dark: "https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  satellite: "https://tiles.stadiamaps.com/styles/alidade_satellite.json"
};

const withBase = (path) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path}`.replace("//", "/");
};

const MapView = forwardRef(({ onLocationSelect, selectedLocation, activeLayers }, ref) => {
  const mapRef = useRef(null);
  const mapContainer = useRef(null);
  const markerRef = useRef(null);
  const competitorMarkersRef = useRef([]);
  const { competitors } = useLocation();

  const [query, setQuery] = useState("");
  const [mapStyle, setMapStyle] = useState(MAP_STYLES.street);
  const [mapLoaded, setMapLoaded] = useState(false);

  const activeLayersRef = useRef(activeLayers);
  useEffect(() => {
    activeLayersRef.current = activeLayers;
  }, [activeLayers]);

  // IDEMPOTENT LAYER AND SOURCE ADDITION
  const addGeoJsonLayers = (map) => {
    if (!map || !map.isStyleLoaded()) return;

    const layersToRegister = [
      {
        id: "roads-layer",
        src: "roads-src",
        file: "roads.geojson",
        type: "line",
        paint: { "line-color": "#ffff00", "line-width": 6, "line-opacity": 0.9 }
      },
      {
        id: "rail-layer",
        src: "rail-src",
        file: "railways.geojson",
        type: "line",
        paint: { "line-color": "#ff00ff", "line-width": 6, "line-dasharray": [2, 1], "line-opacity": 0.9 }
      },
      {
        id: "landuse-layer",
        src: "landuse-src",
        file: "landuse.geojson",
        type: "fill",
        paint: {
          "fill-color": [
            "match", ["get", "type"],
            "residential", "#00ff00",
            "commerical", "#00e5ff",
            "#ffff00"
          ],
          "fill-opacity": 0.7
        }
      },
      {
        id: "water-layer",
        src: "water-src",
        file: "water.geojson",
        type: "fill",
        paint: { "fill-color": "#00b0ff", "fill-opacity": 0.8 }
      },
      {
        id: "power-layer",
        src: "power-src",
        file: "electricity.geojson",
        type: "line",
        paint: { "line-color": "#ff3d00", "line-width": 5, "line-opacity": 0.9 }
      }
    ];

    layersToRegister.forEach(layer => {
      try {
        if (!map.getSource(layer.src)) {
          console.debug(`Map: Adding source ${layer.src}`);
          map.addSource(layer.src, {
            type: "geojson",
            data: withBase(`geojson/${layer.file}`)
          });
        }

        const isVisible = activeLayersRef.current && activeLayersRef.current[layer.id];
        const visibility = isVisible ? "visible" : "none";

        if (!map.getLayer(layer.id)) {
          console.debug(`Map: Adding layer ${layer.id} (${visibility})`);
          map.addLayer({
            id: layer.id,
            type: layer.type,
            source: layer.src,
            paint: layer.paint,
            layout: { "visibility": visibility }
          });
        } else {
          const currentVis = map.getLayoutProperty(layer.id, "visibility");
          if (currentVis !== visibility) {
            map.setLayoutProperty(layer.id, "visibility", visibility);
          }
        }
      } catch (err) {
        console.warn(`Map Layer Error (${layer.id}):`, err.message);
      }
    });
  };

  // SYNC VISIBILITY ON PROP CHANGES
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sync = () => {
      if (map.isStyleLoaded()) {
        addGeoJsonLayers(map);
      }
    };

    if (map.isStyleLoaded()) {
      sync();
    } else {
      map.once("idle", sync);
    }
  }, [activeLayers]);

  // HANDLE STYLE SWITCH
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    console.debug(`Map: Switching style to ${mapStyle}`);
    map.setStyle(mapStyle);

    // style.load is the reliable event for re-adding layers after setStyle
    const onStyleLoad = () => {
      console.debug("Map: Style load complete, re-adding layers.");
      addGeoJsonLayers(map);
    };

    map.on("style.load", onStyleLoad);
    return () => map.off("style.load", onStyleLoad);
  }, [mapStyle]);

  // SYNC MARKER
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation;
      map.flyTo({ center: [longitude, latitude], zoom: 13 });

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new maplibregl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [selectedLocation, mapLoaded]);

  // SYNC COMPETITOR MARKERS
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear existing competitor markers
    competitorMarkersRef.current.forEach(m => m.remove());
    competitorMarkersRef.current = [];

    if (competitors && competitors.length > 0) {
      competitors.forEach(comp => {
        if (!comp.latitude || !comp.longitude) return;

        const el = document.createElement("div");
        el.className = "competitor-marker";
        
        const catInfo = CATEGORY_ICONS[comp.category_type] || CATEGORY_ICONS["Others..."];
        
        el.innerHTML = `
          <i class="${catInfo.icon} marker-icon" style="color: ${catInfo.color}"></i>
          <div class="marker-info-box" style="display: none;">
            <h4>${comp.business_name}</h4>
            <p><span class="label">Owner:</span> ${comp.owner_name}</p>
            <p><span class="label">Address:</span> ${comp.address}</p>
            <p><span class="label">Category:</span> ${comp.category_type}</p>
            <p><span class="label">Lat/Lng:</span> ${comp.latitude.toFixed(4)}, ${comp.longitude.toFixed(4)}</p>
          </div>
        `;

        // Hover logic
        const infoBox = el.querySelector(".marker-info-box");
        el.onmouseenter = () => infoBox.style.display = "block";
        el.onmouseleave = () => infoBox.style.display = "none";

        const m = new maplibregl.Marker({ element: el })
          .setLngLat([comp.longitude, comp.latitude])
          .addTo(map);
        
        competitorMarkersRef.current.push(m);
      });
    }
  }, [competitors, mapLoaded]);

  // INITIALIZE MAP
  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: selectedLocation ? [selectedLocation.longitude, selectedLocation.latitude] : [78.9629, 20.5937],
      zoom: selectedLocation ? 13 : 4
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      console.debug("Map: Initial load complete.");
      setMapLoaded(true);
      addGeoJsonLayers(map);

      if (selectedLocation) {
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new maplibregl.Marker()
          .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
          .addTo(map);
      }
    });

    return () => {
      if (markerRef.current) markerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  //SEARCH
  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/geocode?q=${encodeURIComponent(query)}`
      );

      if (!res.ok) {
        throw new Error("Geocoding Failed");
      }

      const data = await res.json();
      if (!data.length) return alert("Location not found");

      const place = data[0];
      const lat = Number(place.lat);
      const lon = Number(place.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        console.warn("Invalid coordinates from geocoder:", place);
        alert("Invalid location data received.");
        return;
      }

      if (!mapRef.current) {
        console.warn("Map not initialized yet");
        return;
      }

      mapRef.current.flyTo({ center: [lon, lat], zoom: 13 });

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new maplibregl.Marker()
        .setLngLat([lon, lat])
        .addTo(mapRef.current);

      onLocationSelect({
        name: place.display_name,
        latitude: lat,
        longitude: lon
      });
    } catch (err) {
      console.error(err);
      alert("Search failed. Try Again");
    }
  }

  // EXPOSE MAP API
  useImperativeHandle(ref, () => ({
    changeStyle(style) {
      setMapStyle(MAP_STYLES[style]);
    }
  }));

  return (
    <div className="map-wrapper">
      <div className="map-search">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>

      <div ref={mapContainer} className="map-container" />
    </div>
  );
});

export default MapView;