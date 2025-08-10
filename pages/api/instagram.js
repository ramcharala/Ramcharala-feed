// pages/api/proxyImage.js
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).send('Missing url');
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      res.status(502).send('Error fetching image');
      return;
    }
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    // If you use Node.js 18+, response.body is a ReadableStream: use pipeTo
    if (response.body.pipe) {
      response.body.pipe(res);
    } else {
      // For Edge runtimes or if response.body does not support pipe
      const arrayBuffer = await response.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    }
  } catch (err) {
    res.status(500).send('Proxy error');
  }
}
