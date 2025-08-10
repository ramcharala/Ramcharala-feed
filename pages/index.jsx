import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`/api/instagram?user=ramcharala`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <p style={{ color: 'white' }}>Loading...</p>;

  return (
    <div style={{ background: '#141414', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white' }}>Instagram Feed</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        {posts.map(post => (
          <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer">
            <img
              src={post.imageUrl}
              alt={post.caption}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
