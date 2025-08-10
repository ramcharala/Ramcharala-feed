import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/instagram?user=ramcharala');
        const data = await res.json();
        const sorted = (data.posts || []).sort((a,b) => (b.likes||0)-(a.likes||0));
        setPosts(sorted);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div style={{color: 'white'}}>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div style={{backgroundColor:'#111', color:'white', minHeight:'100vh', padding:'20px'}}>
      <h1 style={{fontSize:'2rem', fontWeight:'bold'}}>ramcharala — Feed</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'10px', marginTop:'20px'}}>
        {posts.map((p) => (
          <a key={p.id} href={p.link} target="_blank" rel="noopener noreferrer" style={{textDecoration:'none', color:'white'}}>
            <div style={{position:'relative'}}>
              <img src={p.imageUrl} alt={p.caption || 'Instagram post'} style={{width:'100%', height:'250px', objectFit:'cover', borderRadius:'8px'}}/>
              <div style={{position:'absolute', bottom:'8px', left:'8px', backgroundColor:'rgba(0,0,0,0.6)', padding:'4px 8px', borderRadius:'4px'}}>
                ❤️ {p.likes ?? 0}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
