// pages/api/instagram.js
export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: 'user is required' });

  const APIFY_TOKEN = process.env.APIFY_TOKEN;
  if (!APIFY_TOKEN) return res.status(500).json({ error: 'Missing APIFY_TOKEN' });

  const apiUrl = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
  const input = {
    usernames: [user],
    resultsLimit: 20,
    scrapePosts: true,
    proxyConfig: { useApifyProxy: true }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Apify API error: ${response.status}`);

    const data = await response.json();
    const posts = (data[0]?.latestPosts || []).map(post => ({
      id: post.id,
      imageUrl: post.displayUrl, // using displayUrl instead of imageUrl
      likes: post.likesCount ?? 0,
      link: post.url,
      caption: post.caption || '',
    })).sort((a, b) => b.likes - a.likes);

    res.status(200).json({ username: user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
