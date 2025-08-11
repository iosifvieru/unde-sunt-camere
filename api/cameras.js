export default async function handler(req, res) {
  try {
    const api = process.env.VITE_CAMERA_API_DOMAIN
    console.log(api)
    const r = await fetch(`${api}/api/cameras`);
    if (!r.ok) {
      return res.status(r.status).json({ error: "Upstream API error" });
    }
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}