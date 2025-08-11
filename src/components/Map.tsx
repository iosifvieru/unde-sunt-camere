import { LatLngBounds } from "leaflet";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import { type CameraData } from "../cameradata";

import "leaflet/dist/leaflet.css";
import "./Map.css";

interface CameraDataProps {
    cameras: CameraData[];
}

export default function Map({ cameras }: CameraDataProps) {
    const romaniaPosition = [45.9, 25.0];

    const romaniaBounds: LatLngBounds = new LatLngBounds([
        [43.618682, 20.261759],
        [48.265396, 29.730299],
    ]);

    // console.log(cameras);

    return (
        <>
            <div className="map-container">
                <MapContainer
                    center={[romaniaPosition[0], romaniaPosition[1]]}
                    zoom={6}
                    maxBoundsViscosity={1}
                    maxBounds={romaniaBounds}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {cameras.map((camera) => (
                        <Marker
                            key={camera.id}
                            position={[camera.latitude, camera.longitude]}
                        >
                            <Popup>
                                <strong>{camera.city}</strong>
                                <br />
                                Locatie: {camera.location}
                                <br />
                                Road: {camera.road}
                                <br />
                                {camera.description}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </>
    );
}
