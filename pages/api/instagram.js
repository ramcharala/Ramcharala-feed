import axios from 'axios';
import cheerio from 'cheerio';

function extractJSONFromHTML(html) {
  const match = html.match(/window\._sharedData\s*=\s*(\{.+?\});\s*<\//s);
  if (match && match[1]) {
    try { return JSON.parse(match[1]); } catch(e) { return null; }
  }
  return null;
}

export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: 'user required' });

  try {
    const url = `https://www.instagram.com/${encodeURIComponent(user)}/`;
    const r = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = r.data;
    const shared = extractJSONFromHTML(html);
    let edges = [];

    try {
      const userData = shared?.entry_data?.ProfilePage?.[0]?.graphql?.user;
      const timeline = userData?.edge_owner_to_timeline_media?.edges || [];
      edges = timeline.map(edge => {
        const node = edge.node;
        return {
          id: node.id,
          imageUrl: node.display_url,
          likes: node.edge_liked_by?.count || 0,
          link: `https://www.instagram.com/p/${node.shortcode}/`,
          caption: node.edge_media_to_caption?.edges?.[0]?.node?.text || ''
        }
      });
    } catch (e) {
      edges = [];
    }

    return res.status(200).json({ username: user, posts: edges });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'failed to fetch instagram' });
  }
}
