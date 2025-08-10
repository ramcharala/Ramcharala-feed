import { useEffect, useState } from 'react';
import Image from 'next/image';

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
      <h1 style={{ color: 'white', marginBottom: '20px' }}>Instagram Feed</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        {posts.map(post => (
          <a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              display: 'block'
            }}
          >
            <div style={{
              transition: 'transform 0.4s ease',
              willChange: 'transform'
            }} className="hover-zoom">
              <Image
                src={post.imageUrl}
                alt={post.caption || ''}
                width={400}
                height={400}
                style={{
                  objectFit: 'cover',
                  borderRadius: '8px',
                  display: 'block'
                }}
                loading="lazy"
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              padding: '5px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              ❤️ {post.likes}
            </div>
          </a>
        ))}
      </div>
      <style jsx>{`
        a:hover .hover-zoom {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
