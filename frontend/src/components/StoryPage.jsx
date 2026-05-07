import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Bookmark, Heart, Share2, Play, Users, Star, ChevronRight, AlertTriangle, Info, Clock, BookOpen
} from 'lucide-react';

/* 
  NOTE: For Runware.ai integration, you can use their SDK or REST API.
  Example usage with a real API key:
  const fetchRunwareImage = async (prompt) => {
    // Call Runware API to generate image
  }
*/

const CHARACTERS = [
  { name: 'Seraphine', role: 'Protagonist', emoji: '👸', bio: 'A voiceless princess with iron will. Commands armies through written words alone.' },
  { name: 'Kaizen', role: 'Love interest', emoji: '🗡️', bio: 'A shadow spy who sold his loyalty to the highest bidder — until now.' },
  { name: 'Empress Vael', role: 'Antagonist', emoji: '👑', bio: 'Rules through beautiful deception. Never makes a move without three backup plans.' },
  { name: 'Lyra', role: 'Ally', emoji: '🌿', bio: 'Seraphine\'s only true friend. An herbalist who knows more than she lets on.' },
];

const RELATIONSHIPS = [
  { a: 'Seraphine', b: 'Kaizen', type: 'love', label: 'Slow burn tension' },
  { a: 'Seraphine', b: 'Lyra', type: 'friends', label: 'Best friends' },
  { a: 'Seraphine', b: 'Empress Vael', type: 'enemies', label: 'Sworn enemies' },
  { a: 'Kaizen', b: 'Empress Vael', type: 'rivals', label: 'Complicated history' },
];

const REL_COLORS = {
  love: 'rel-love',
  friends: 'rel-friends',
  enemies: 'rel-enemies',
  rivals: 'rel-rivals',
};

export default function StoryPage({ stories = [], user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChar, setSelectedChar] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('episodes'); // episodes | about | characters

  // Find story or use fallback
  const story = stories.find(s => String(s.id) === id) || {
    id: id,
    title: id === '69f7365c1cd954ae93abb532' ? "The Lemon Forest" : "The Silent Crown",
    logline: id === '69f7365c1cd954ae93abb532' 
      ? "A mystical journey through a forest where lemons glow with ancient magic and secrets are hidden in the peel."
      : "A voiceless princess must reclaim her throne with nothing but courage—and the spy she should never trust.",
    image: id === '69f7365c1cd954ae93abb532' 
      ? "/src/assets/lemon_forest.png"
      : "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80",
    tags: ['Fantasy', 'Adventure', 'Magic'], 
    tagTypes: ['tag-genre', 'tag-teal', 'tag-mood'],
    rating: 'PG', 
    genre: 'Fantasy', 
    episodes: 15, 
    completion: 45,
    readers: '12.5K',
    score: 4.9
  };

  return (
    <div className="story-page-container fade-in">
      {/* Background Blur Hero */}
      <div className="story-hero-bg" style={{ backgroundImage: `url(${story.image})` }}></div>
      
      <div className="story-content-wrapper">
        {/* Top Navigation */}
        <div className="story-top-nav">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20}/>
          </button>
          <div className="story-nav-actions">
            <button className={`nav-icon-btn ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
              <Bookmark size={20} fill={bookmarked ? 'currentColor' : 'none'}/>
            </button>
            <button className="nav-icon-btn">
              <Share2 size={20}/>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="story-hero-main">
          <div className="story-cover-wrapper">
            <img src={story.image} alt={story.title} className="story-main-cover" />
            <div className="cover-badge">{story.rating}</div>
          </div>

          <div className="story-primary-info">
            <div className="story-tags">
              {story.tags?.map((tag, i) => (
                <span key={tag} className={`premium-tag ${story.tagTypes?.[i] || 'tag-genre'}`}>{tag}</span>
              ))}
            </div>
            <h1 className="premium-title">{story.title}</h1>
            <div className="story-stats-row">
              <div className="stat-item">
                <Star size={16} fill="var(--amber)" color="var(--amber)"/>
                <span>{story.score || 4.8}</span>
              </div>
              <div className="stat-item">
                <Users size={16}/>
                <span>{story.readers || '3.2K'}</span>
              </div>
              <div className="stat-item">
                <Clock size={16}/>
                <span>Updated Mon</span>
              </div>
            </div>
            
            <p className="story-description">
              {story.logline}
            </p>

            <div className="story-main-actions">
              <button className="read-now-btn" onClick={() => navigate(`/read/${story.id}`)}>
                <Play size={18} fill="currentColor"/>
                <span>Read First Episode</span>
              </button>
              <button 
                className={`follow-btn ${followed ? 'followed' : ''}`} 
                onClick={() => setFollowed(!followed)}
              >
                <Heart size={18} fill={followed ? 'currentColor' : 'none'}/>
                <span>{followed ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="story-tabs-container">
          <div className="story-tabs">
            <button className={`tab-btn ${activeTab === 'episodes' ? 'active' : ''}`} onClick={() => setActiveTab('episodes')}>
              Episodes <span>{story.episodes}</span>
            </button>
            <button className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
              About
            </button>
            <button className={`tab-btn ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')}>
              Characters
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'episodes' && (
              <div className="episodes-list">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="episode-card" onClick={() => navigate(`/read/${story.id}`)}>
                    <div className="ep-num">{i + 1}</div>
                    <div className="ep-thumbnail" style={{ backgroundImage: `url(${story.image})` }}>
                      <div className="ep-overlay"><Play size={16} fill="white"/></div>
                    </div>
                    <div className="ep-info">
                      <div className="ep-title">Episode {i + 1}: {i === 0 ? "The Awakening" : i === 1 ? "Golden Secrets" : "Hidden Paths"}</div>
                      <div className="ep-meta">May {10 - i}, 2026 • 8 min read</div>
                    </div>
                    <ChevronRight size={18} className="ep-arrow"/>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-content">
                <div className="about-card">
                  <h3>Story Summary</h3>
                  <p>{story.logline}</p>
                  <div className="story-details-grid">
                    <div className="detail-item">
                      <BookOpen size={16}/>
                      <span>Genre: {story.genre}</span>
                    </div>
                    <div className="detail-item">
                      <Info size={16}/>
                      <span>Rating: {story.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relationship-section">
                  <h3>Relationship Map</h3>
                  <div className="rel-map-premium">
                    {RELATIONSHIPS.map((r, i) => (
                      <div key={i} className="rel-card-premium">
                        <span className={`rel-badge ${REL_COLORS[r.type]}`}>{r.type}</span>
                        <div className="rel-entities">
                          <span>{r.a}</span>
                          <span className="rel-arrow">↔</span>
                          <span>{r.b}</span>
                        </div>
                        <div className="rel-label">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="characters-grid">
                {CHARACTERS.map(c => (
                  <div key={c.name} className={`char-card-premium ${selectedChar?.name === c.name ? 'selected' : ''}`} onClick={() => setSelectedChar(selectedChar?.name === c.name ? null : c)}>
                    <div className="char-avatar">{c.emoji}</div>
                    <div className="char-info">
                      <div className="char-name">{c.name}</div>
                      <div className="char-role">{c.role}</div>
                    </div>
                    {selectedChar?.name === c.name && (
                      <div className="char-bio-overlay">
                        <p>{c.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .story-page-container {
          position: relative;
          min-height: 100vh;
          background: #0f111a;
          color: white;
          overflow-x: hidden;
        }

        .story-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 600px;
          background-size: cover;
          background-position: center;
          filter: blur(80px) brightness(0.4);
          opacity: 0.6;
          z-index: 0;
          mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
        }

        .story-content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
        }

        .story-top-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .back-btn, .nav-icon-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .nav-icon-btn.active {
          background: var(--primary);
          border-color: var(--primary);
        }

        .story-hero-main {
          display: flex;
          gap: 48px;
          margin-bottom: 60px;
          align-items: flex-start;
        }

        .story-cover-wrapper {
          position: relative;
          flex-shrink: 0;
          width: 320px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          border-radius: 20px;
          overflow: hidden;
        }

        .story-main-cover {
          width: 100%;
          aspect-ratio: 2/3;
          object-fit: cover;
          display: block;
        }

        .cover-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
        }

        .premium-tag {
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          margin-right: 8px;
          background: rgba(108, 62, 244, 0.2);
          color: #a78bfa;
          border: 1px solid rgba(167, 139, 250, 0.3);
        }

        .premium-title {
          font-size: 48px;
          font-weight: 900;
          margin: 16px 0;
          line-height: 1.1;
          letter-spacing: -1.5px;
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .story-stats-row {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 600;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .story-description {
          font-size: 17px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          margin-bottom: 32px;
          max-width: 600px;
        }

        .story-main-actions {
          display: flex;
          gap: 16px;
        }

        .read-now-btn {
          background: white;
          color: black;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: transform 0.2s;
        }

        .follow-btn {
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 14px 24px;
          border-radius: 14px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .follow-btn.followed {
          background: rgba(240, 80, 122, 0.15);
          color: #f0507a;
          border-color: rgba(240, 80, 122, 0.3);
        }

        .story-tabs {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          margin-bottom: 32px;
        }

        .tab-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.5);
          padding: 16px 0;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
        }

        .tab-btn span {
          font-size: 12px;
          opacity: 0.5;
          margin-left: 4px;
        }

        .tab-btn.active {
          color: white;
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--primary);
          border-radius: 3px;
        }

        .episode-card {
          display: flex;
          align-items: center;
          padding: 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .episode-card:hover {
          background: rgba(255,255,255,0.07);
          transform: translateX(5px);
        }

        .ep-num {
          width: 40px;
          font-size: 18px;
          font-weight: 900;
          opacity: 0.3;
        }

        .ep-thumbnail {
          width: 120px;
          aspect-ratio: 16/9;
          border-radius: 10px;
          background-size: cover;
          background-position: center;
          position: relative;
          margin-right: 20px;
        }

        .ep-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .episode-card:hover .ep-overlay {
          opacity: 1;
        }

        .ep-info {
          flex: 1;
        }

        .ep-title {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .ep-meta {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .char-card-premium {
          background: rgba(255,255,255,0.03);
          padding: 20px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.05);
        }

        .char-avatar {
          font-size: 32px;
        }

        .char-name {
          font-weight: 800;
          font-size: 15px;
        }

        .char-role {
          font-size: 12px;
          color: var(--primary);
          font-weight: 700;
        }

        .char-bio-overlay {
          position: absolute;
          inset: 0;
          background: var(--primary);
          padding: 15px;
          font-size: 12px;
          display: flex;
          align-items: center;
          animation: fadeIn 0.2s ease;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .story-hero-main {
            flex-direction: column;
            gap: 30px;
            align-items: center;
            text-align: center;
          }
          .story-cover-wrapper {
            width: 240px;
          }
          .premium-title {
            font-size: 36px;
          }
          .story-stats-row {
            justify-content: center;
          }
          .story-description {
            margin: 0 auto 32px;
          }
          .story-main-actions {
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .ep-thumbnail {
            width: 80px;
          }
          .ep-num {
            width: 20px;
            font-size: 14px;
          }
          .story-main-actions {
            flex-direction: column;
          }
          .premium-title {
            font-size: 28px;
          }
        }
      `}} />
    </div>
  );
}
