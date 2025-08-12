import Map from "./components/Map";
import { useEffect, useState } from "react";
import { type CameraData } from "./cameradata";

const CACHE_EXPIRATION_TIME = 1440 * 60 * 1000; // 24h in ms

function App() {
    const [cameraData, setCameraData] = useState<CameraData[]>([]);
    const [error, setError] = useState(false);

    /* API CALL */
    const domain = import.meta.env.VITE_CAMERA_API_DOMAIN;
    useEffect(() => {
        const cachedCameraData = localStorage.getItem("cameraData");

        /* don't call the API if there is camera data in local storage */
        if (cachedCameraData) {
            try {
                const parsed = JSON.parse(cachedCameraData);

                const current_date = Date.now();
                if (parsed.expire_date && current_date < parsed.expire_date) {
                    setCameraData(parsed.data);
                    console.log(
                        "Getting the camera data information from the local storage. This may be outdated."
                    );
                    return;
                }
            } catch (err) {
                console.warn("error parsing the JSON: ", err);
            }
        }

        console.log(
            "No camera data found in local storage or it expired.. I'm calling the API."
        );

        fetch(`/api/cameras`)
            .then((response) => {
                if (!response.ok) {
                    setError(true);
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

                /* save to localstorage for caching */
                localStorage.setItem(
                    "cameraData",
                    JSON.stringify({
                        data: mapped,
                        expire_date: Date.now() + CACHE_EXPIRATION_TIME,
                    })
                );
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                setError(true);
            });
    }, [domain]);

    return (
        <>
            {error && (
                <h1>
                    Hei.. stiu ca iti place site-ul dar deocamdata partea de
                    backend doarme :(
                </h1>
            )}
            <Map cameras={cameraData} />

            <p>
                Datele au fost obtinute din sursele:
                <a href="https://www.promotor.ro/stiri-auto/exclusiv-lista-completa-cu-cele-peste-100-de-camere-de-rovinieta-si-unde-sunt-acestea-amplasate-19407773">
                    Promotor.ro
                </a>{" "}
                si
                <a href="https://www.roviniete.ro/ro/info/lista-de-camere-fixe-pentru-rovinieta-si-rca">
                    Roviniete.ro
                </a>
            </p>
        </>
    );
}

export default App;
