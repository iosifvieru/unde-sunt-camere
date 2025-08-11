import "./App.css";
import Map from "./components/Map";
import { useEffect, useState } from "react";
import { type CameraData } from "./cameradata";

function App() {
    const [cameraData, setCameraData] = useState<CameraData[]>([]);

    /* API CALL */
    const domain = import.meta.env.VITE_CAMERA_API_DOMAIN;
    useEffect(() => {
        fetch(`/api/cameras`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                const mapped: CameraData[] = data.cameras.map((cam: any) => ({
                    id: cam._id,
                    city: cam.city,
                    description: cam.description,
                    longitude: cam.longitude,
                    latitude: cam.latitude,
                    location: cam.location,
                    road: cam.road,
                }));
                setCameraData(mapped);
            })
            .catch((error) => console.error("Fetch error:", error));
    }, [domain]);

    return <Map cameras={cameraData} />;
}

export default App;
