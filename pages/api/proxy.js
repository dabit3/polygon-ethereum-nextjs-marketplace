// pages/api/proxy.js

export default async function handler(req, res) {
  const { url } = req.query;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}