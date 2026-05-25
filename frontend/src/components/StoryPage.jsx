import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Bookmark, Heart, Share2, Play, Users, Star, ChevronRight, AlertTriangle, 
  Info, Clock, BookOpen, Map as MapIcon, Check, ShieldAlert, ThumbsUp, MessageSquare, 
  List, Sparkles, ArrowRight, Menu, X, Send, Eye, ShieldCheck, User, Compass, BookmarkCheck
} from 'lucide-react';
import StoryMap from './StoryMap';
import axios from 'axios';

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

const COLORS = {
  bg: "#050408",
  surface: "#0D0B1A",
  accent: "#7C3AED", 
  accentGlow: "rgba(124, 58, 237, 0.2)",
  rose: "#F43F8E",
  emerald: "#10B981",
  textMain: "#F1EEF9",
  textDim: "#6B6789",
  border: "rgba(255, 255, 255, 0.08)",
  glass: "rgba(255, 255, 255, 0.03)",
  glassBorder: "rgba(255, 255, 255, 0.06)"
};

// ──────────────────────────────────────────────
// Scroll-triggered Fade-In Panel Component
// ──────────────────────────────────────────────
function AnimatedPanel({ url, index, panelData, isQuoteStory, isMatureGated }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="panel-container"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        filter: isMatureGated ? 'blur(20px)' : 'none'
      }}
    >
      <img
        src={url}
        alt={`Panel ${index + 1}`}
        className="panel-img"
        loading="lazy"
      />

      {/* Text Dialogue Overlay */}
      {panelData?.text && !isMatureGated && (
        isQuoteStory ? (
          /* Quote overlay styling */
          <div className="quote-overlay-container">
            <div className="quote-overlay-box">
              <div className="quote-decoration">
                <div className="quote-line" />
                <div className="quote-dot" />
                <div className="quote-line" />
              </div>
              <div className="quote-text-body">
                <span className="quote-mark">"</span>
                {panelData.text}
                <span className="quote-mark">"</span>
              </div>
            </div>
          </div>
        ) : (
          /* Dialogue Speech Bubbles */
          <div className="dialogue-overlay-container">
            <div className="dialogue-speech-box">
              {panelData.speaker && (
                <div className="dialogue-speaker-tag">
                  {panelData.speaker}
                </div>
              )}
              <div className="dialogue-bubble-text">
                {panelData.text}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Main StoryPage Component
// ──────────────────────────────────────────────
export default function StoryPage({ stories = [], user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL query parameter for active episode
  const queryParams = new URLSearchParams(location.search);
  const epNum = parseInt(queryParams.get('ep')) || 1;

  // UI States
  const [selectedChar, setSelectedChar] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('episodes'); // episodes | about | characters
  const [bottomActiveTab, setBottomActiveTab] = useState('episodes'); // episodes | about | characters
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMatureModal, setShowMatureModal] = useState(false);
  const [pendingEpNav, setPendingEpNav] = useState(null);
  
  // Responsive sidebar drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Floating Story Map Modal state
  const [showMapModal, setShowMapModal] = useState(false);
  
  // Interactive reader states (liked status, choices selected, and user comments per episode)
  const [likedEpisodes, setLikedEpisodes] = useState({}); // { epNum: boolean }
  const [selectedChoices, setSelectedChoices] = useState({}); // { epNum: choiceId }
  const [commentsByEpisode, setCommentsByEpisode] = useState({
    1: [
      { id: 1, user: "LunaDreams", text: "This beginning is so mysterious! I love the peels glowing in the forest.", likes: 142, date: "5m ago" },
      { id: 2, user: "ManhwaReader99", text: "The slow-burn vibe of Seraphine and Kaizen is real! High quality layout.", likes: 89, date: "1h ago" },
      { id: 3, user: "StoryLover", text: "I voted to protect the secret! Let's see what happens.", likes: 34, date: "3h ago" }
    ],
    2: [
      { id: 1, user: "WebtoonGuru", text: "Golden Secrets is a perfect title! Need more answers about Lyra.", likes: 110, date: "20m ago" },
      { id: 2, user: "ArtLover", text: "The color styling on these panels are pure state-of-the-art.", likes: 65, date: "2h ago" }
    ],
    3: [
      { id: 1, user: "KaizenSimp", text: "A silent alliance? Yes please! Kaizen is looking extremely sharp here.", likes: 230, date: "10m ago" },
      { id: 2, user: "PlotTwister", text: "That cliffhanger was illegal! I need the next episode now.", likes: 154, date: "4h ago" }
    ]
  });
  const [newComment, setNewComment] = useState("");
  
  // Reading scroll progress indicator state
  const [scrollProgress, setScrollProgress] = useState(0);
  const readerScrollRef = useRef(null);

  // Load story details & map schema
  useEffect(() => {
    const fetchStoryDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/stories/${id}`);
        const s = res.data;
        
        const mappedStory = {
          id: s._id,
          title: s.title,
          logline: s.description || "No description available.",
          image: s.panels && s.panels.length > 0 ? s.panels[0] : (s.coverIcon || "📖"),
          tags: s.genre ? [s.genre] : ['Fantasy'],
          tagTypes: ['tag-genre'],
          rating: s.genre?.toLowerCase() === 'mature' ? 'R' : 'PG',
          genre: s.genre || 'Fantasy',
          episodesCount: s.episodes && s.episodes.length > 0 ? s.episodes.length + 1 : 1,
          completion: s.status === 'Live' ? 100 : 50,
          readers: s.views > 1000 ? (s.views / 1000).toFixed(1) + 'K' : s.views || '1.2K',
          score: s.rating || 4.9,
          nodes: s.nodes || [],
          currentNodeId: s.nodes && s.nodes.length > 0 ? s.nodes[s.nodes.length - 1].id : 's4',
          dbEpisodes: s.episodes || [],
          panels: s.panels || [],
          content: s.content || ""
        };
        setStory(mappedStory);
      } catch (err) {
        console.warn("Could not fetch story from backend. Falling back to local data.", err.message);
        const localStory = stories.find(s => String(s.id) === id);
        if (localStory) {
          setStory({
            id: localStory.id,
            title: localStory.title,
            logline: localStory.description || "A mystical story in ToonVault.",
            image: localStory.image || "/src/assets/lemon_forest.png",
            tags: localStory.tags || ['Fantasy'],
            tagTypes: ['tag-genre'],
            rating: 'PG',
            genre: localStory.genre || 'Fantasy',
            episodesCount: localStory.episodes || 5,
            completion: 45,
            readers: '12.5K',
            score: localStory.score || 4.9,
            nodes: localStory.nodes || [],
            currentNodeId: 's4',
            dbEpisodes: [],
            panels: [
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000"
            ],
            content: JSON.stringify([
              { speaker: "Narrator", text: "Deep in the Lemon Tree Forest, lemons glowed with an ancient, forbidden magic..." },
              { speaker: "Seraphine", text: "We shouldn't stay here. If the Empress's sentries find us, everything burns." },
              { speaker: "Kaizen", text: "Don't worry, Princess. My daggers are silent. And I never miss." }
            ])
          });
        } else {
          // Absolute fallback
          setStory({
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
            rating: id === '69f7365c1cd954ae93abb532' ? 'PG' : 'R', 
            genre: 'Fantasy', 
            episodesCount: 5, 
            completion: 45,
            readers: '12.5K',
            score: 4.9,
            nodes: [],
            currentNodeId: 's4',
            dbEpisodes: [],
            panels: [
              "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000"
            ],
            content: JSON.stringify([
              { speaker: "Narrator", text: "Deep in the Lemon Tree Forest, lemons glowed with an ancient, forbidden magic..." },
              { speaker: "Seraphine", text: "We shouldn't stay here. If the Empress's sentries find us, everything burns." },
              { speaker: "Kaizen", text: "Don't worry, Princess. My daggers are silent. And I never miss." }
            ])
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetails();
  }, [id, stories]);

  // Handle active reader viewport scroll tracking
  const handleScroll = () => {
    if (!readerScrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = readerScrollRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  // Keep scroll aligned on episode changes
  useEffect(() => {
    if (readerScrollRef.current) {
      readerScrollRef.current.scrollTo(0, 0);
    }
    setScrollProgress(0);
  }, [epNum]);

  if (loading || !story) {
    return (
      <div className="loader-screen">
        <div className="spinner"></div>
        <div className="spinner-text">Unlocking Story Vault...</div>
        <style dangerouslySetInnerHTML={{ __html: `
          .loader-screen {
            background: #050408;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #7C3AED;
            font-family: 'Outfit', sans-serif;
          }
          .spinner {
            border: 4px solid rgba(124, 58, 237, 0.1);
            border-top: 4px solid #7C3AED;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner-text {
            font-size: 16px;
            font-weight: 600;
            color: rgba(255,255,255,0.7);
            letter-spacing: 0.5px;
          }
        `}} />
      </div>
    );
  }

  // Retrieve active viewer content based on routing index
  const getActiveEpisodeData = () => {
    if (epNum > 1 && story.dbEpisodes && story.dbEpisodes.length > 0) {
      const ep = story.dbEpisodes.find(e => e.number === epNum);
      if (ep) {
        return {
          title: ep.title || `Episode ${ep.number}`,
          panels: ep.panels && ep.panels.length > 0 ? ep.panels : [story.image],
          content: ep.content || "[]"
        };
      }
    }
    
    // Default first episode or fallback episode mock
    const fallbackTitles = {
      1: "Episode 1: The Beginning",
      2: "Episode 2: Golden Secrets",
      3: "Episode 3: Hidden Paths",
      4: "Episode 4: Silent Alliance",
      5: "Episode 5: The Climax"
    };

    const fallbackPanels = {
      1: story.panels || [story.image],
      2: [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000"
      ],
      3: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000"
      ],
      4: [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000"
      ],
      5: [
        story.image,
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000"
      ]
    };

    const fallbackContents = {
      1: story.content || "[]",
      2: JSON.stringify([
        { speaker: "Lyra", text: "They are looking for the scroll. If they find it, the lemons will lose their glow forever." },
        { speaker: "Seraphine", text: "Then we must hide it where no one would dare to look..." }
      ]),
      3: JSON.stringify([
        { speaker: "Kaizen", text: "The paths here are twisted. Keep close, Princess. One wrong step and we fall into the abyss." },
        { speaker: "Seraphine", text: "I've faced darker pits, Kaizen. Let's move." }
      ]),
      4: JSON.stringify([
        { speaker: "Empress Vael", text: "You think you can defy me? You are nothing but whispers in the dark." },
        { speaker: "Kaizen", text: "Then prepare to be haunted by the shadows." }
      ]),
      5: JSON.stringify([
        { speaker: "Narrator", text: "With their hands joined, the Lemon Forest burst with a blinding golden dawn..." },
        { speaker: "Seraphine", text: "We did it. The secret is safe." },
        { speaker: "Kaizen", text: "As long as I'm with you, Seraphine. Always." }
      ])
    };

    return {
      title: fallbackTitles[epNum] || `Episode ${epNum}`,
      panels: fallbackPanels[epNum] || [story.image],
      content: fallbackContents[epNum] || "[]"
    };
  };

  const activeEp = getActiveEpisodeData();

  // Mature Audience Consent Gating
  const localUser = (() => {
    try {
      const u = localStorage.getItem('user');
      return u && u !== 'undefined' ? JSON.parse(u) : null;
    } catch(e) { return null; }
  })();

  const activeUser = user || localUser;
  const consentKey = `tv_consent_${id}`;
  const hasConsented = 
    localStorage.getItem('age_consent') === 'true' ||
    localStorage.getItem('tv_mature_consent') === 'true' ||
    localStorage.getItem(consentKey) === 'true';

  const isMatureGated = (story.rating === 'R' || story.genre?.toLowerCase() === 'mature') && !hasConsented;

  // Intercept navigation for consent
  const handleReadEpisode = (targetEpNum) => {
    const epUrl = `/story/${story.id}?ep=${targetEpNum}`;
    if (isMatureGated) {
      setPendingEpNav(epUrl);
      setShowMatureModal(true);
    } else {
      navigate(epUrl);
      setSidebarOpen(false);
    }
  };

  const handleMatureProceed = () => {
    localStorage.setItem('age_consent', 'true');
    localStorage.setItem('tv_mature_consent', 'true');
    localStorage.setItem(consentKey, 'true');
    setShowMatureModal(false);
    if (pendingEpNav) {
      navigate(pendingEpNav);
    } else {
      navigate(`/story/${story.id}?ep=${epNum}`);
    }
  };

  // Thumbs up / Likes triggers
  const handleToggleLike = () => {
    setLikedEpisodes(prev => ({
      ...prev,
      [epNum]: !prev[epNum]
    }));
  };

  // Branching story voting choice selection
  const handleSelectChoice = (choiceId) => {
    if (selectedChoices[epNum]) return; // Single-vote lock-in
    setSelectedChoices(prev => ({
      ...prev,
      [epNum]: choiceId
    }));
  };

  // Add a user comment
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const commentObj = {
      id: Date.now(),
      user: activeUser ? activeUser.username : "GuestReader",
      text: newComment,
      likes: 0,
      date: "Just now"
    };

    setCommentsByEpisode(prev => ({
      ...prev,
      [epNum]: [commentObj, ...(prev[epNum] || [])]
    }));
    setNewComment("");
  };

  // Helper check for pagination limits
  const totalEps = story.dbEpisodes && story.dbEpisodes.length > 0 ? story.dbEpisodes.length + 1 : story.episodesCount;
  const hasNext = epNum < totalEps;
  const hasPrev = epNum > 1;

  // Parse speaker panels
  let parsedContent = [];
  try {
    if (activeEp.content) {
      parsedContent = JSON.parse(activeEp.content);
    }
  } catch (e) {
    parsedContent = [];
  }

  const isQuoteStory = story.genre?.toLowerCase() === 'quotes';

  return (
    <div className="tapas-layout-container fade-in">
      
      {/* ── Mature Content Modal ── */}
      {showMatureModal && (
        <div className="mature-modal-overlay">
          <div className="mature-modal-box">
            <div className="mature-modal-icon-wrapper">
              <ShieldAlert size={40} color="#F43F8E" />
            </div>
            <div className="mature-modal-info">
              <span className="mature-badge-alert">Viewer Notice</span>
              <h2 className="mature-title">Mature Audience Advisory</h2>
              <p className="mature-desc">
                This series contains thematic elements, drama, and situations recommended for mature audiences.
              </p>
              <p className="mature-subdesc">Viewer discretion is strongly advised.</p>
            </div>
            <div className="mature-actions">
              <button onClick={handleMatureProceed} className="mature-btn-agree">
                Confirm & Continue
              </button>
              <button onClick={() => setShowMatureModal(false)} className="mature-btn-decline">
                Cancel
              </button>
            </div>
            <p className="mature-footer-terms">By continuing, you verify you are 18 years of age or older.</p>
          </div>
        </div>
      )}

      {/* ── Fullscreen Story Map Modal ── */}
      {showMapModal && (
        <div className="map-modal-overlay">
          <div className="map-modal-content">
            <button className="map-modal-close" onClick={() => setShowMapModal(false)}>
              <X size={24} />
            </button>
            <div className="map-modal-header">
              <Compass size={24} color="#7C3AED" style={{ marginRight: 8 }} />
              <h2>Destiny Roadmap: {story.title}</h2>
            </div>
            <div className="map-modal-body">
              <StoryMap 
                storyNodes={story.nodes || []} 
                currentNodeId={story.currentNodeId || 's4'}
                onSelectNode={(id, action) => console.log('Scene Action:', action, 'Node:', id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Sidebar Backdrop Overlay ── */}
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* ── DUAL-PANE GRID SYSTEM ── */}
      <div className="tapas-layout-grid">
        
        {/* ── LEFT SIDEBAR COLUMN (Series Hub) ── */}
        <aside className={`tapas-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <button className="sidebar-back-btn" onClick={() => navigate('/browse')}>
              <ArrowLeft size={16} style={{ marginRight: 8 }} />
              <span>Back to Vault</span>
            </button>
            <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Series Card */}
          <div className="series-card-profile">
            <div className="profile-cover-frame">
              <img 
                src={story.image} 
                alt={story.title} 
                className="profile-cover-img"
                style={{ filter: isMatureGated ? 'blur(16px)' : 'none' }}
              />
              <div className="profile-rating-badge">{story.rating}</div>
              {isMatureGated && (
                 <div className="profile-mature-blur-overlay">
                    <AlertTriangle size={20} color="#F43F8E" style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 10, fontWeight: 900 }}>18+ Restricted</div>
                 </div>
              )}
            </div>

            <div className="profile-details">
              <div className="profile-genre-row">
                <span className="profile-genre-tag">{story.genre || 'Fantasy'}</span>
                <span className="profile-schedule-tag">UP EVERY MON</span>
              </div>
              <h1 className="profile-title">{story.title}</h1>
              
              {/* Stats Grid */}
              <div className="profile-stats-grid">
                <div className="p-stat">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <span className="p-stat-val">{story.score || 4.9}</span>
                  <span className="p-stat-lbl">Rating</span>
                </div>
                <div className="p-stat">
                  <Eye size={14} color="#7C3AED" />
                  <span className="p-stat-val">{story.readers || '12.5K'}</span>
                  <span className="p-stat-lbl">Views</span>
                </div>
                <div className="p-stat">
                  <Heart size={14} color="#F43F8E" />
                  <span className="p-stat-val">{followed ? "1" : "0"}+</span>
                  <span className="p-stat-lbl">Subs</span>
                </div>
              </div>

              {/* Description */}
              <p className="profile-summary">
                {story.logline}
              </p>

              {/* Action Rows */}
              <div className="profile-actions-bar">
                <button 
                  onClick={() => handleToggleLike()} 
                  className={`profile-action-btn ${likedEpisodes[epNum] ? 'active' : ''}`}
                >
                  <ThumbsUp size={16} fill={likedEpisodes[epNum] ? "#7C3AED" : "none"} />
                  <span>{likedEpisodes[epNum] ? "Liked" : "Like"}</span>
                </button>
                <button 
                  onClick={() => setFollowed(!followed)} 
                  className={`profile-action-btn ${followed ? 'active' : ''}`}
                >
                  <Heart size={16} fill={followed ? "#F43F8E" : "none"} />
                  <span>{followed ? "Subscribed" : "Subscribe"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Hub Tabs */}
          <div className="tabs-navigation-strip">
            <button 
              className={`hub-tab-btn ${activeTab === 'episodes' ? 'active' : ''}`} 
              onClick={() => setActiveTab('episodes')}
            >
              Episodes
            </button>
            <button 
              className={`hub-tab-btn ${activeTab === 'about' ? 'active' : ''}`} 
              onClick={() => setActiveTab('about')}
            >
              Relations
            </button>
            <button 
              className={`hub-tab-btn ${activeTab === 'characters' ? 'active' : ''}`} 
              onClick={() => setActiveTab('characters')}
            >
              Cast
            </button>
          </div>

          {/* Tabs Viewport Panel */}
          <div className="tabs-viewport-content">
            
            {activeTab === 'episodes' && (
              <div className="episodes-drawer-list">
                {/* Custom Trigger for Story Map floating modal */}
                <div className="story-map-quicktrigger" onClick={() => setShowMapModal(true)}>
                  <Compass size={18} color="#A78BFA" />
                  <div className="qt-info">
                    <span className="qt-title">View Interactive Story Map</span>
                    <span className="qt-desc">Forge your own story pathways</span>
                  </div>
                  <ChevronRight size={16} color="#A78BFA" />
                </div>

                {/* Hardcoded Pilot Episode Row */}
                <div 
                  onClick={() => handleReadEpisode(1)}
                  className={`ep-row-card ${epNum === 1 ? 'active' : ''}`}
                >
                  <div 
                    className="ep-row-thumb"
                    style={{ backgroundImage: `url(${story.image})`, filter: isMatureGated ? 'blur(8px)' : 'none' }}
                  >
                    <div className="ep-row-overlay"><Play size={12} fill="white" /></div>
                  </div>
                  <div className="ep-row-details">
                    <div className="ep-row-title">Episode 1: The Beginning</div>
                    <div className="ep-row-meta">
                      <span className="ep-num-label">#1</span>
                      <span className="ep-date-label">May 2026</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic DB Episodes */}
                {story.dbEpisodes && story.dbEpisodes.length > 0 ? (
                  story.dbEpisodes.map((ep) => (
                    <div 
                      key={ep.number}
                      onClick={() => handleReadEpisode(ep.number)}
                      className={`ep-row-card ${epNum === ep.number ? 'active' : ''}`}
                    >
                      <div 
                        className="ep-row-thumb"
                        style={{ backgroundImage: `url(${ep.panels && ep.panels.length > 0 ? ep.panels[0] : story.image})`, filter: isMatureGated ? 'blur(8px)' : 'none' }}
                      >
                        <div className="ep-row-overlay"><Play size={12} fill="white" /></div>
                      </div>
                      <div className="ep-row-details">
                        <div className="ep-row-title">{ep.title || `Episode ${ep.number}`}</div>
                        <div className="ep-row-meta">
                          <span className="ep-num-label">#{ep.number}</span>
                          <span className="ep-date-label">May 2026</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback Mock Episodes
                  [...Array(4)].map((_, i) => {
                    const number = i + 2;
                    const titles = ["Golden Secrets", "Hidden Paths", "Silent Alliance", "The Climax"];
                    return (
                      <div 
                        key={number}
                        onClick={() => handleReadEpisode(number)}
                        className={`ep-row-card ${epNum === number ? 'active' : ''}`}
                      >
                        <div 
                          className="ep-row-thumb"
                          style={{ backgroundImage: `url(${story.image})`, filter: isMatureGated ? 'blur(8px)' : 'none' }}
                        >
                          <div className="ep-row-overlay"><Play size={12} fill="white" /></div>
                        </div>
                        <div className="ep-row-details">
                          <div className="ep-row-title">Episode {number}: {titles[i]}</div>
                          <div className="ep-row-meta">
                            <span className="ep-num-label">#{number}</span>
                            <span className="ep-date-label">May 2026</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="about-drawer-content">
                <h3 className="section-small-title">Character Relationships</h3>
                <div className="relationship-vertical-list">
                  {RELATIONSHIPS.map((r, i) => (
                    <div key={i} className="premium-rel-badge">
                      <span className={`rel-type-tag ${REL_COLORS[r.type]}`}>{r.type}</span>
                      <div className="rel-nodes-row">
                        <span className="rel-node-name">{r.a}</span>
                        <span className="rel-nodes-divider">↔</span>
                        <span className="rel-node-name">{r.b}</span>
                      </div>
                      <div className="rel-meta-caption">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'characters' && (
              <div className="characters-drawer-grid">
                {CHARACTERS.map(c => (
                  <div 
                    key={c.name} 
                    className={`profile-char-card ${selectedChar?.name === c.name ? 'expanded' : ''}`}
                    onClick={() => setSelectedChar(selectedChar?.name === c.name ? null : c)}
                  >
                    <div className="char-avatar-sphere">{c.emoji}</div>
                    <div className="char-card-body">
                      <div className="char-head-row">
                        <span className="char-card-name">{c.name}</span>
                        <span className="char-card-role">{c.role}</span>
                      </div>
                      {selectedChar?.name === c.name && (
                        <p className="char-card-bio-full">{c.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </aside>

        {/* ── RIGHT COLUMN (Vertical Viewer & Interactions) ── */}
        <main 
          className="tapas-reader" 
          ref={readerScrollRef}
          onScroll={handleScroll}
        >
          {/* Sticky Reader Header */}
          <header className="sticky-reader-header">
            <div className="header-left">
              <button className="header-menu-btn" onClick={() => setSidebarOpen(true)}>
                <Menu size={20} />
              </button>
              <div className="header-breadcrumbs">
                <span className="h-story-title">{story.title}</span>
                <span className="h-divider">/</span>
                <span className="h-ep-title">{activeEp.title}</span>
              </div>
            </div>
            
            {/* Embedded Mini Scroll Progress */}
            <div className="header-scroll-track">
              <div className="header-scroll-fill" style={{ width: `${scrollProgress}%` }} />
            </div>

            <div className="header-actions">
              <button className="h-icon-btn" onClick={() => setBookmarked(!bookmarked)}>
                <BookmarkCheck size={20} color={bookmarked ? "#7C3AED" : "white"} fill={bookmarked ? "#7C3AED" : "none"} />
              </button>
              <button className="h-icon-btn">
                <Share2 size={20} />
              </button>
            </div>
          </header>

          {/* Webtoon Viewer Canvas */}
          <section className="webtoon-canvas">
            {/* Active Episode Header Banner */}
            <div className="episode-banner-intro">
              <span className="banner-subtitle">{story.title}</span>
              <h2 className="banner-title">{activeEp.title}</h2>
              <div className="banner-decoration-bar" />
            </div>

            {/* Vertically stacked high-res panels with text overlays */}
            <div className="viewer-panels-vertical-stack">
              {activeEp.panels.map((url, i) => (
                <AnimatedPanel
                  key={i}
                  url={url}
                  index={i}
                  panelData={parsedContent[i] || null}
                  isQuoteStory={isQuoteStory}
                  isMatureGated={isMatureGated}
                />
              ))}
            </div>
          </section>

          {/* FORGE YOUR DESTINY (Branching Choice Section) */}
          <section className="destiny-interaction-hub">
            <div className="interaction-intro-box">
              <div className="forge-tag-row">
                <div className="forge-line" />
                <Sparkles size={16} color="#7C3AED" />
                <span className="forge-tag-text">Forge Your Destiny</span>
                <div className="forge-line" />
              </div>
              <h3 className="forge-heading">What happens next?</h3>
              <p className="forge-desc">Make your choice to unlock the next node on the roadmap.</p>
            </div>

            <div className="destiny-options-grid">
              {[
                { id: 'A', title: 'Protect the Secret', desc: 'Keep the truth hidden a little longer.', popular: true, votes: '42%' },
                { id: 'B', title: 'Follow Your Heart', desc: 'Confess what you have been holding in.', votes: '28%' },
                { id: 'C', title: 'Chase the Truth', desc: 'Dig deeper, no matter the consequence.', votes: '30%' },
              ].map((choice) => {
                const isSelected = selectedChoices[epNum] === choice.id;
                const hasVoted = !!selectedChoices[epNum];
                
                return (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`destiny-choice-card ${isSelected ? 'active' : ''} ${hasVoted ? 'voted-locked' : ''}`}
                    disabled={hasVoted}
                  >
                    {choice.popular && !hasVoted && (
                      <div className="choice-popular-badge">POPULAR</div>
                    )}
                    <div className="choice-letter-sphere">{choice.id}</div>
                    <div className="choice-card-content">
                      <div className="choice-title-text">{choice.title}</div>
                      <p className="choice-desc-text">{choice.desc}</p>
                    </div>

                    {hasVoted && (
                      <div className="choice-vote-results-bar">
                        <div className="result-percentage-fill" style={{ width: choice.votes }} />
                        <span className="result-pct-value">{choice.votes} of readers</span>
                        {isSelected && <span className="your-vote-tag">Your Choice</span>}
                      </div>
                    )}
                  </button>
                );
              })}

              <button
                className="destiny-choice-card custom-writein-card"
                onClick={() => navigate(`/story/${story.id}?ep=${epNum}`)}
              >
                <div className="choice-letter-sphere writein">
                  <Sparkles size={16} color="#7C3AED" />
                </div>
                <div className="choice-card-content">
                  <div className="choice-title-text">Suggest Custom Pathway</div>
                  <p className="choice-desc-text">Submit your own narrative twist to the writer!</p>
                </div>
              </button>
            </div>
          </section>

          {/* End of Episode Reaction Bar */}
          <section className="episode-reaction-bar">
            <h4 className="reaction-title">How was this episode?</h4>
            <p className="reaction-subtitle">Show your appreciation to the author!</p>

            <div className="reaction-buttons-strip">
              <button 
                onClick={() => handleToggleLike()} 
                className={`heart-like-huge-btn ${likedEpisodes[epNum] ? 'liked' : ''}`}
              >
                <ThumbsUp size={28} fill={likedEpisodes[epNum] ? "#7C3AED" : "none"} />
                <span className="huge-btn-label">{likedEpisodes[epNum] ? 'Liked!' : 'Like This'}</span>
              </button>
              <button 
                onClick={() => {
                  const commentsEl = document.getElementById('comments-section');
                  if (commentsEl) commentsEl.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="heart-like-huge-btn chat-trigger-btn"
              >
                <MessageSquare size={28} />
                <span className="huge-btn-label">Comment</span>
              </button>
            </div>

            {/* Pagination Navigation */}
            <div className="reader-pagination-row">
              {hasPrev ? (
                <button
                  onClick={() => handleReadEpisode(epNum - 1)}
                  className="pag-nav-btn prev"
                >
                  ← Previous Episode
                </button>
              ) : (
                <div className="pag-nav-disabled">First Episode</div>
              )}
              
              {hasNext ? (
                <button
                  onClick={() => handleReadEpisode(epNum + 1)}
                  className="pag-nav-btn next"
                >
                  Next Episode →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab('episodes');
                    setSidebarOpen(true);
                  }}
                  className="pag-nav-btn finish"
                >
                  Back to List
                </button>
              )}
            </div>
          </section>

          {/* Creator Corner Box */}
          <section className="creator-corner-card">
            <div className="creator-row">
              <div className="creator-avatar-badge">🎨</div>
              <div className="creator-metadata">
                <div className="creator-verified-row">
                  <span className="creator-name">ToonVault AI</span>
                  <span className="verified-check">✓</span>
                </div>
                <div className="creator-followers-lbl">12.4K Followers</div>
              </div>
              <button onClick={() => setFollowed(!followed)} className="creator-follow-btn">
                {followed ? "Following" : "Follow"}
              </button>
            </div>
            <p className="creator-bio">
              "Creating immersive, responsive Manhwa stories with interactive storyboards. Your choices direct the final panels."
            </p>
          </section>

          {/* ── BOTTOM SERIES HUB (Episodes, Relations, Cast) ── */}
          <section className="bottom-series-hub">
            <div className="bottom-hub-header">
              <h3 className="bottom-hub-title">Series Hub</h3>
              <p className="bottom-hub-subtitle">Explore episodes, connections, and the cast of {story.title}</p>
            </div>

            {/* Hub Tabs Navigation */}
            <div className="bottom-hub-tabs-strip">
              <button 
                className={`bottom-hub-tab-btn ${bottomActiveTab === 'episodes' ? 'active' : ''}`}
                onClick={() => setBottomActiveTab('episodes')}
              >
                <BookOpen size={16} style={{ marginRight: 8 }} />
                <span>Episodes</span>
              </button>
              <button 
                className={`bottom-hub-tab-btn ${bottomActiveTab === 'about' ? 'active' : ''}`}
                onClick={() => setBottomActiveTab('about')}
              >
                <Users size={16} style={{ marginRight: 8 }} />
                <span>Relations</span>
              </button>
              <button 
                className={`bottom-hub-tab-btn ${bottomActiveTab === 'characters' ? 'active' : ''}`}
                onClick={() => setBottomActiveTab('characters')}
              >
                <User size={16} style={{ marginRight: 8 }} />
                <span>Cast List</span>
              </button>
            </div>

            {/* Hub Active Tab Viewport */}
            <div className="bottom-hub-viewport">
              {bottomActiveTab === 'episodes' && (
                <div className="bottom-episodes-grid">
                  {story.dbEpisodes && story.dbEpisodes.length > 0 ? (
                    story.dbEpisodes.map((ep) => {
                      const isLocked = ep.number > 3 && String(story.title).includes("Beloved");
                      return (
                        <div 
                          key={ep.number}
                          onClick={() => handleReadEpisode(ep.number)}
                          className={`bottom-ep-card ${epNum === ep.number ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                        >
                          <div 
                            className="bottom-ep-thumb"
                            style={{ backgroundImage: `url(${ep.panels && ep.panels.length > 0 ? ep.panels[0] : story.image})`, filter: isMatureGated ? 'blur(10px)' : 'none' }}
                          >
                            {isLocked && <div className="bottom-locked-overlay">🔒</div>}
                            <div className="bottom-ep-num">#{ep.number}</div>
                          </div>
                          <div className="bottom-ep-info">
                            <div className="bottom-ep-title">{ep.title || `Episode ${ep.number}`}</div>
                            <div className="bottom-ep-date">Release: May 2026</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    Array.from({ length: story.episodesCount }, (_, i) => {
                      const number = i + 1;
                      const isLocked = number > 3 && String(story.title).includes("Beloved");
                      const viewsVal = `${Math.max(20, 163 - i * 12).toFixed(0)}K`;
                      const likesVal = `${Math.max(1.0, 9.1 - i * 0.6).toFixed(1)}K`;

                      return (
                        <div 
                          key={number}
                          onClick={() => handleReadEpisode(number)}
                          className={`bottom-ep-card ${epNum === number ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                        >
                          <div 
                            className="bottom-ep-thumb"
                            style={{ backgroundImage: `url(${story.image})`, filter: isMatureGated ? 'blur(10px)' : 'none' }}
                          >
                            {isLocked && <div className="bottom-locked-overlay">🔒</div>}
                            <div className="bottom-ep-num">#{number}</div>
                          </div>
                          <div className="bottom-ep-info">
                            <div className="bottom-ep-title">Episode {number}: {number === 1 ? "The Beginning" : number === 2 ? "Golden Secrets" : number === 3 ? "Hidden Paths" : `Chapter ${number}`}</div>
                            <div className="bottom-ep-meta">
                              <span>👁️ {viewsVal}</span>
                              <span>❤️ {likesVal}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {bottomActiveTab === 'about' && (
                <div className="bottom-relations-grid">
                  {RELATIONSHIPS.map((r, i) => (
                    <div key={i} className="bottom-rel-card">
                      <div className="bottom-rel-header">
                        <span className={`bottom-rel-tag ${REL_COLORS[r.type]}`}>{r.type}</span>
                      </div>
                      <div className="bottom-rel-characters">
                        <span className="bottom-rel-char">{r.a}</span>
                        <span className="bottom-rel-arrow">↔</span>
                        <span className="bottom-rel-char">{r.b}</span>
                      </div>
                      <p className="bottom-rel-label">{r.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {bottomActiveTab === 'characters' && (
                <div className="bottom-cast-grid">
                  {CHARACTERS.map((c) => (
                    <div key={c.name} className="bottom-cast-card">
                      <div className="bottom-cast-head">
                        <div className="bottom-cast-avatar">{c.emoji}</div>
                        <div className="bottom-cast-meta">
                          <h4 className="bottom-cast-name">{c.name}</h4>
                          <span className="bottom-cast-role">{c.role}</span>
                        </div>
                      </div>
                      <p className="bottom-cast-bio">{c.bio}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* COMMENTS BOARD */}
          <section className="episode-comments-board" id="comments-section">
            <div className="comments-header-row">
              <h3 className="comments-title">Comments <span>({(commentsByEpisode[epNum] || []).length})</span></h3>
            </div>

            {/* Post comment form */}
            <form className="comment-input-form" onSubmit={handlePostComment}>
              <div className="comment-user-avatar">
                {activeUser ? activeUser.username[0].toUpperCase() : "G"}
              </div>
              <input
                type="text"
                placeholder="Join the discussion... (be nice!)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-text-field"
              />
              <button type="submit" className="comment-submit-btn">
                <Send size={16} />
              </button>
            </form>

            {/* List of comments */}
            <div className="comments-list-stack">
              {(commentsByEpisode[epNum] || []).length > 0 ? (
                (commentsByEpisode[epNum] || []).map((c) => (
                  <div key={c.id} className="comment-card-item">
                    <div className="comment-card-avatar">
                      {c.user[0].toUpperCase()}
                    </div>
                    <div className="comment-card-main">
                      <div className="comment-card-meta">
                        <span className="comment-username">{c.user}</span>
                        <span className="comment-timestamp">{c.date}</span>
                      </div>
                      <p className="comment-card-text">{c.text}</p>
                      <div className="comment-actions-row">
                        <button className="comment-action-likes">
                          <ThumbsUp size={12} style={{ marginRight: 4 }} />
                          <span>{c.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comments-fallback">
                  Be the first to share your thoughts on this episode!
                </div>
              )}
            </div>
          </section>
        </main>

      </div>

      {/* ── STYLE TAG (Vanilla CSS with harmonious HSL variables) ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Top Layout */
        .tapas-layout-container {
          background: ${COLORS.bg};
          min-height: 100vh;
          min-height: 100dvh;
          color: ${COLORS.textMain};
          font-family: 'Outfit', 'Inter', sans-serif;
          overflow: hidden;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .tapas-layout-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          height: 100vh;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
        }

        /* Sidebar Column */
        .tapas-sidebar {
          background: ${COLORS.surface};
          border-right: 1px solid ${COLORS.border};
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          position: relative;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }

        .sidebar-header {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid ${COLORS.border};
        }

        .sidebar-back-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
        }

        .sidebar-back-btn:hover {
          color: white;
        }

        .mobile-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
        }

        /* Series Profile Details */
        .series-card-profile {
          padding: 24px;
          border-bottom: 1px solid ${COLORS.border};
        }

        .profile-cover-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 2/3;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
          margin-bottom: 20px;
          border: 1px solid ${COLORS.border};
        }

        .profile-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .profile-rating-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 900;
          color: white;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-mature-blur-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5, 4, 8, 0.65);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 16px;
        }

        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .profile-genre-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-genre-tag {
          background: rgba(124, 58, 237, 0.15);
          color: #A78BFA;
          border: 1px solid rgba(124, 58, 237, 0.3);
          padding: 2px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-schedule-tag {
          background: rgba(244, 63, 142, 0.12);
          color: ${COLORS.rose};
          border: 1px solid rgba(244, 63, 142, 0.25);
          padding: 2px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .profile-title {
          font-size: 24px;
          font-weight: 900;
          line-height: 1.25;
          letter-spacing: -0.5px;
          color: white;
        }

        /* Stats Grid */
        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 12px 6px;
          text-align: center;
        }

        .p-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .p-stat:not(:last-child) {
          border-right: 1px solid ${COLORS.border};
        }

        .p-stat-val {
          font-size: 14px;
          font-weight: 900;
          color: white;
        }

        .p-stat-lbl {
          font-size: 9px;
          color: ${COLORS.textDim};
          font-weight: 600;
          text-transform: uppercase;
        }

        .profile-summary {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .profile-actions-bar {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 4px;
        }

        .profile-action-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid ${COLORS.border};
          color: rgba(255, 255, 255, 0.7);
          padding: 10px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-action-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .profile-action-btn.active {
          background: rgba(124, 58, 237, 0.1);
          border-color: rgba(124, 58, 237, 0.3);
          color: #A78BFA;
        }

        /* Sidebar Tabs */
        .tabs-navigation-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid ${COLORS.border};
          background: rgba(0, 0, 0, 0.15);
        }

        .hub-tab-btn {
          background: transparent;
          border: none;
          color: ${COLORS.textDim};
          padding: 14px 0;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .hub-tab-btn:hover {
          color: white;
        }

        .hub-tab-btn.active {
          color: white;
        }

        .hub-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 15%;
          right: 15%;
          height: 3px;
          background: ${COLORS.accent};
          border-radius: 3px;
        }

        .tabs-viewport-content {
          flex: 1;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.1);
        }

        /* Episodes Drawer List */
        .episodes-drawer-list {
          display: flex;
          flex-direction: column;
        }

        .story-map-quicktrigger {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(5,4,8,0) 100%);
          border-bottom: 1px solid ${COLORS.border};
          cursor: pointer;
          transition: all 0.2s;
        }

        .story-map-quicktrigger:hover {
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(124, 58, 237, 0.03) 100%);
        }

        .qt-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 12px;
        }

        .qt-title {
          font-size: 13px;
          font-weight: 800;
          color: white;
        }

        .qt-desc {
          font-size: 10px;
          color: ${COLORS.textDim};
        }

        .ep-row-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.2s;
        }

        .ep-row-card:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .ep-row-card.active {
          background: rgba(124, 58, 237, 0.08);
          border-left: 3px solid ${COLORS.accent};
          padding-left: 17px;
        }

        .ep-row-thumb {
          width: 64px;
          height: 64px;
          border-radius: 10px;
          background-size: cover;
          background-position: center;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          border: 1px solid ${COLORS.border};
        }

        .ep-row-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .ep-row-card:hover .ep-row-overlay {
          opacity: 1;
        }

        .ep-row-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ep-row-title {
          font-size: 13px;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.4;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .ep-row-card.active .ep-row-title {
          color: #A78BFA;
        }

        .ep-row-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ep-num-label {
          font-size: 10px;
          font-weight: 800;
          color: ${COLORS.accent};
        }

        .ep-date-label {
          font-size: 10px;
          color: ${COLORS.textDim};
        }

        /* Relationship Vertical List */
        .about-drawer-content {
          padding: 20px;
        }

        .section-small-title {
          font-size: 13px;
          font-weight: 900;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .relationship-vertical-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .premium-rel-badge {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          padding: 12px;
        }

        .rel-type-tag {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .rel-type-tag.rel-love { background: rgba(244, 63, 142, 0.15); color: ${COLORS.rose}; }
        .rel-type-tag.rel-friends { background: rgba(16, 185, 129, 0.15); color: ${COLORS.emerald}; }
        .rel-type-tag.rel-enemies { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
        .rel-type-tag.rel-rivals { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }

        .rel-nodes-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .rel-nodes-divider {
          color: ${COLORS.textDim};
        }

        .rel-meta-caption {
          font-size: 11px;
          color: ${COLORS.textDim};
          font-style: italic;
        }

        /* Characters Drawer Cast */
        .characters-drawer-grid {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .profile-char-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .profile-char-card:hover {
          background: rgba(255, 255, 255, 0.04);
        }

        .profile-char-card.expanded {
          flex-direction: column;
          align-items: flex-start;
        }

        .char-avatar-sphere {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .char-card-body {
          flex: 1;
          width: 100%;
        }

        .char-head-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .char-card-name {
          font-size: 13px;
          font-weight: 800;
          color: white;
        }

        .char-card-role {
          font-size: 10px;
          font-weight: 700;
          color: ${COLORS.accent};
        }

        .char-card-bio-full {
          font-size: 11px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* ── READER COLUMN ── */
        .tapas-reader {
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          background: ${COLORS.bg};
          position: relative;
        }

        /* Sticky Reader Header */
        .sticky-reader-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(5, 4, 8, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid ${COLORS.border};
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          padding-left: calc(24px + env(safe-area-inset-left, 0px));
          padding-right: calc(24px + env(safe-area-inset-right, 0px));
          z-index: 90;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-menu-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
        }

        .header-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .h-story-title {
          color: white;
          font-weight: 900;
          letter-spacing: -0.3px;
        }

        .h-divider {
          color: ${COLORS.textDim};
        }

        .h-ep-title {
          color: ${COLORS.accent};
          font-weight: 800;
          text-transform: uppercase;
          font-size: 11px;
        }

        .header-scroll-track {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.05);
        }

        .header-scroll-fill {
          height: 100%;
          background: linear-gradient(to right, ${COLORS.accent}, ${COLORS.rose});
          transition: width 0.1s ease-out;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .h-icon-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid ${COLORS.border};
          color: white;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .h-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Webtoon Panels Canvas */
        .webtoon-canvas {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        .episode-banner-intro {
          padding: 60px 24px 30px;
          text-align: center;
        }

        .banner-subtitle {
          font-size: 11px;
          font-weight: 900;
          color: ${COLORS.accent};
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }

        .banner-title {
          font-size: 28px;
          font-weight: 900;
          color: white;
          letter-spacing: -0.5px;
          margin-bottom: 16px;
        }

        .banner-decoration-bar {
          width: 40px;
          height: 3px;
          background: ${COLORS.accent};
          border-radius: 2px;
          margin: 0 auto;
        }

        .viewer-panels-vertical-stack {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        /* Panel Container */
        .panel-container {
          width: 100%;
          position: relative;
          transition: opacity 0.6s ease, transform 0.6s ease;
          overflow: hidden;
        }

        .panel-img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Dialogue Speech Bubbles */
        .dialogue-overlay-container {
          position: absolute;
          bottom: 24px;
          left: 0;
          right: 0;
          padding: 0 20px;
        }

        .dialogue-speech-box {
          background: rgba(5, 4, 8, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.25);
          border-radius: 16px;
          padding: 14px 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.7);
        }

        .dialogue-speaker-tag {
          font-size: 9px;
          font-weight: 900;
          color: #A78BFA;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .dialogue-bubble-text {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.5;
          font-weight: 500;
        }

        /* Quote overlays */
        .quote-overlay-container {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding-bottom: 40px;
        }

        .quote-overlay-box {
          width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 70%, transparent 100%);
          padding: 60px 24px 24px;
          text-align: center;
        }

        .quote-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .quote-line {
          height: 1px;
          width: 30px;
          background: linear-gradient(to right, transparent, rgba(167, 139, 250, 0.6));
        }

        .quote-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #A78BFA;
        }

        .quote-text-body {
          font-size: 17px;
          font-style: italic;
          font-weight: 500;
          color: white;
          line-height: 1.6;
          font-family: 'Crimson Pro', serif;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }

        .quote-mark {
          font-size: 1.4em;
          color: #A78BFA;
          vertical-align: -0.2em;
        }

        /* Destiny Interactive Choice Box */
        .destiny-interaction-hub {
          padding: 80px 24px;
          background: linear-gradient(to bottom, #050408 0%, #0c0a18 100%);
          border-top: 1px solid ${COLORS.border};
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .interaction-intro-box {
          text-align: center;
          margin-bottom: 44px;
        }

        .forge-tag-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .forge-line {
          height: 1px;
          width: 50px;
          background: linear-gradient(to right, transparent, ${COLORS.accent});
        }

        .forge-tag-text {
          font-size: 12px;
          font-weight: 900;
          color: ${COLORS.accent};
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .forge-heading {
          font-size: 26px;
          font-weight: 900;
          color: white;
          margin-bottom: 8px;
        }

        .forge-desc {
          font-size: 13px;
          color: ${COLORS.textDim};
        }

        .destiny-options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          width: 100%;
        }

        .destiny-choice-card {
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 18px;
          text-align: left;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .destiny-choice-card:hover:not(.voted-locked) {
          transform: translateY(-4px);
          background: rgba(124, 58, 237, 0.04);
          border-color: rgba(124, 58, 237, 0.3);
          box-shadow: 0 10px 30px rgba(124, 58, 237, 0.15);
        }

        .choice-popular-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: ${COLORS.rose};
          color: white;
          font-size: 9px;
          font-weight: 900;
          padding: 4px 12px;
          border-bottom-left-radius: 12px;
          letter-spacing: 1px;
        }

        .choice-letter-sphere {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: ${COLORS.accent};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 900;
          flex-shrink: 0;
        }

        .choice-letter-sphere.writein {
          background: rgba(124, 58, 237, 0.1);
          border: 1px dashed ${COLORS.accent};
        }

        .choice-card-content {
          flex: 1;
        }

        .choice-title-text {
          font-size: 15px;
          font-weight: 800;
          margin-bottom: 2px;
        }

        .choice-desc-text {
          font-size: 12px;
          color: ${COLORS.textDim};
          margin: 0;
          line-height: 1.4;
        }

        /* Voting Results */
        .destiny-choice-card.voted-locked {
          cursor: default;
          background: rgba(255, 255, 255, 0.01);
          border-color: rgba(255, 255, 255, 0.03);
          opacity: 0.85;
        }

        .destiny-choice-card.voted-locked.active {
          opacity: 1;
          background: rgba(124, 58, 237, 0.03);
          border-color: rgba(124, 58, 237, 0.2);
        }

        .choice-vote-results-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          pointer-events: none;
          z-index: 10;
        }

        .result-percentage-fill {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          background: rgba(124, 58, 237, 0.08);
          z-index: -1;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .result-pct-value {
          font-size: 12px;
          font-weight: 800;
          color: #A78BFA;
          margin-left: auto;
        }

        .your-vote-tag {
          font-size: 9px;
          font-weight: 900;
          color: white;
          background: ${COLORS.accent};
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          margin-left: 10px;
        }

        .custom-writein-card {
          border: 1px dashed rgba(124, 58, 237, 0.3);
          background: rgba(124, 58, 237, 0.01);
        }

        .custom-writein-card:hover {
          background: rgba(124, 58, 237, 0.05) !important;
          border-color: ${COLORS.accent} !important;
        }

        /* Episode Reaction Hub */
        .episode-reaction-bar {
          padding: 60px 24px;
          border-top: 1px solid ${COLORS.border};
          text-align: center;
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .reaction-title {
          font-size: 20px;
          font-weight: 900;
          color: white;
          margin-bottom: 4px;
        }

        .reaction-subtitle {
          font-size: 13px;
          color: ${COLORS.textDim};
          margin-bottom: 32px;
        }

        .reaction-buttons-strip {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 50px;
        }

        .heart-like-huge-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          color: white;
          padding: 16px 36px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 140px;
        }

        .heart-like-huge-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          transform: scale(1.02);
        }

        .heart-like-huge-btn.liked {
          background: rgba(124, 58, 237, 0.1);
          border-color: rgba(124, 58, 237, 0.35);
          color: #A78BFA;
        }

        .heart-like-huge-btn.liked svg {
          filter: drop-shadow(0 0 8px ${COLORS.accent});
        }

        .huge-btn-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        /* Pagination Rows */
        .reader-pagination-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          max-width: 440px;
          margin: 0 auto;
        }

        .pag-nav-btn {
          flex: 1;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pag-nav-btn.prev {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid ${COLORS.border};
          color: white;
        }

        .pag-nav-btn.prev:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .pag-nav-btn.next {
          background: ${COLORS.accent};
          border: none;
          color: white;
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
        }

        .pag-nav-btn.next:hover {
          background: #8B5CF6;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
        }

        .pag-nav-btn.finish {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
        }

        .pag-nav-disabled {
          flex: 1;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.02);
          color: ${COLORS.textDim};
        }

        /* Creator Corner Card */
        .creator-corner-card {
          margin: 0 auto 40px;
          width: 90%;
          max-width: 680px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid ${COLORS.border};
          border-radius: 20px;
          padding: 24px;
        }

        .creator-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }

        .creator-avatar-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.rose});
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .creator-metadata {
          flex: 1;
        }

        .creator-verified-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .creator-name {
          font-weight: 800;
          color: white;
          font-size: 15px;
        }

        .verified-check {
          color: ${COLORS.emerald};
          font-weight: 900;
          font-size: 12px;
        }

        .creator-followers-lbl {
          font-size: 11px;
          color: ${COLORS.textDim};
        }

        .creator-follow-btn {
          padding: 6px 16px;
          border-radius: 10px;
          background: rgba(124, 58, 237, 0.15);
          color: white;
          border: 1px solid ${COLORS.accent};
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .creator-follow-btn:hover {
          background: ${COLORS.accent};
        }

        .creator-bio {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin: 0;
          font-style: italic;
        }

        /* COMMENTS SECTION */
        .episode-comments-board {
          padding: 60px 24px;
          border-top: 1px solid ${COLORS.border};
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
        }

        .comments-header-row {
          margin-bottom: 24px;
        }

        .comments-title {
          font-size: 18px;
          font-weight: 900;
          color: white;
        }

        .comments-title span {
          color: ${COLORS.textDim};
          font-size: 14px;
          font-weight: 500;
          margin-left: 6px;
        }

        .comment-input-form {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 10px 14px;
          margin-bottom: 32px;
        }

        .comment-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${COLORS.accent};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }

        .comment-text-field {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 13px;
          outline: none;
        }

        .comment-text-field::placeholder {
          color: ${COLORS.textDim};
        }

        .comment-submit-btn {
          background: transparent;
          border: none;
          color: ${COLORS.accent};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s;
        }

        .comment-submit-btn:hover {
          transform: translateX(2px);
        }

        .comments-list-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .comment-card-item {
          display: flex;
          gap: 14px;
        }

        .comment-card-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .comment-card-main {
          flex: 1;
        }

        .comment-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .comment-username {
          font-size: 12px;
          font-weight: 800;
          color: white;
        }

        .comment-timestamp {
          font-size: 10px;
          color: ${COLORS.textDim};
        }

        .comment-card-text {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
        }

        .comment-actions-row {
          display: flex;
          align-items: center;
        }

        .comment-action-likes {
          background: transparent;
          border: none;
          color: ${COLORS.textDim};
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }

        .comment-action-likes:hover {
          color: white;
        }

        .no-comments-fallback {
          text-align: center;
          color: ${COLORS.textDim};
          font-size: 12px;
          padding: 24px 0;
          font-style: italic;
        }

        /* ── MODALS STYLING ── */
        .mature-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 4, 8, 0.95);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 900;
          animation: fadeIn 0.3s ease;
        }

        .mature-modal-box {
          background: ${COLORS.surface};
          border: 1px solid rgba(244, 63, 142, 0.25);
          border-radius: 24px;
          padding: 40px 32px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }

        .mature-modal-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(244, 63, 142, 0.08);
          border: 1px solid rgba(244, 63, 142, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .mature-badge-alert {
          display: inline-block;
          background: rgba(244, 63, 142, 0.15);
          color: ${COLORS.rose};
          border: 1px solid rgba(244, 63, 142, 0.3);
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 4px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }

        .mature-title {
          font-size: 22px;
          font-weight: 900;
          color: white;
          margin-bottom: 12px;
        }

        .mature-desc {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 8px;
        }

        .mature-subdesc {
          font-size: 12px;
          color: ${COLORS.textDim};
          margin-bottom: 28px;
        }

        .mature-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mature-btn-agree {
          background: linear-gradient(135deg, ${COLORS.rose}, #B81D57);
          border: none;
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(244, 63, 142, 0.25);
          transition: all 0.2s;
        }

        .mature-btn-agree:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(244, 63, 142, 0.4);
        }

        .mature-btn-decline {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid ${COLORS.border};
          color: rgba(255, 255, 255, 0.6);
          padding: 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .mature-btn-decline:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mature-footer-terms {
          font-size: 10px;
          color: ${COLORS.textDim};
          margin-top: 20px;
        }

        /* Map modal */
        .map-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(5, 4, 8, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 800;
          animation: fadeIn 0.2s ease;
        }

        .map-modal-content {
          background: ${COLORS.bg};
          border: 1px solid ${COLORS.border};
          border-radius: 28px;
          width: 100%;
          max-width: 1080px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 40px;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.7);
        }

        .map-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid ${COLORS.border};
          color: rgba(255, 255, 255, 0.6);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .map-modal-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .map-modal-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
        }

        .map-modal-header h2 {
          font-size: 22px;
          font-weight: 900;
          color: white;
        }

        /* Sidebar Drawer backdrop */
        .sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 95;
          animation: fadeIn 0.2s ease;
        }

        /* ── BOTTOM SERIES HUB ── */
        .bottom-series-hub {
          margin: 40px auto;
          width: 90%;
          max-width: 680px;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid ${COLORS.border};
          border-radius: 24px;
          padding: 32px 28px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        }

        .bottom-hub-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .bottom-hub-title {
          font-size: 20px;
          font-weight: 900;
          color: white;
          margin-bottom: 6px;
          letter-spacing: -0.3px;
        }

        .bottom-hub-subtitle {
          font-size: 12px;
          color: ${COLORS.textDim};
          margin: 0;
        }

        .bottom-hub-tabs-strip {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid ${COLORS.border};
          border-radius: 14px;
          padding: 4px;
          margin-bottom: 24px;
          gap: 4px;
        }

        .bottom-hub-tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: ${COLORS.textDim};
          padding: 10px 0;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bottom-hub-tab-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.02);
        }

        .bottom-hub-tab-btn.active {
          color: white;
          background: ${COLORS.accent};
          box-shadow: 0 4px 12px ${COLORS.accent}33;
        }

        .bottom-hub-viewport {
          min-height: 200px;
        }

        /* Bottom Episodes Grid */
        .bottom-episodes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 16px;
        }

        .bottom-ep-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
        }

        .bottom-ep-card:hover {
          transform: translateY(-4px);
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(124, 58, 237, 0.3);
        }

        .bottom-ep-card.active {
          border-color: ${COLORS.accent};
          background: rgba(124, 58, 237, 0.05);
        }

        .bottom-ep-thumb {
          aspect-ratio: 1;
          width: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
          border-bottom: 1px solid ${COLORS.border};
        }

        .bottom-locked-overlay {
          position: absolute;
          inset: 0;
          background: rgba(5,4,8,0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .bottom-ep-num {
          position: absolute;
          bottom: 8px;
          left: 8px;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: white;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 900;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bottom-ep-info {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .bottom-ep-title {
          font-size: 11px;
          font-weight: 800;
          color: white;
          line-height: 1.35;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .bottom-ep-meta {
          font-size: 9px;
          color: ${COLORS.textDim};
          display: flex;
          justify-content: space-between;
        }

        /* Bottom Relations Grid */
        .bottom-relations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .bottom-rel-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          padding: 16px;
        }

        .bottom-rel-header {
          margin-bottom: 10px;
        }

        .bottom-rel-tag {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 6px;
          display: inline-block;
        }

        .bottom-rel-characters {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 900;
          color: white;
          margin-bottom: 6px;
        }

        .bottom-rel-arrow {
          color: ${COLORS.accent};
        }

        .bottom-rel-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-style: italic;
          line-height: 1.4;
        }

        /* Bottom Cast Grid */
        .bottom-cast-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .bottom-cast-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bottom-cast-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bottom-cast-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .bottom-cast-meta {
          display: flex;
          flex-direction: column;
        }

        .bottom-cast-name {
          font-size: 13px;
          font-weight: 800;
          color: white;
          margin: 0;
        }

        .bottom-cast-role {
          font-size: 10px;
          font-weight: 700;
          color: ${COLORS.accent};
        }

        .bottom-cast-bio {
          font-size: 11px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* ── RESPONSIVENESS ── */
        @media (max-width: 1024px) {
          .tapas-layout-grid {
            grid-template-columns: 1fr;
          }

          .tapas-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            height: 100vh;
            height: 100dvh;
            width: 320px;
            transform: translateX(-100%);
            z-index: 100;
            box-shadow: 20px 0 50px rgba(0, 0, 0, 0.5);
          }

          .tapas-sidebar.open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: flex;
          }

          .header-menu-btn {
            display: flex;
          }
        }

        @media (max-width: 600px) {
          .sticky-reader-header {
            padding: 0 16px;
            padding-left: calc(16px + env(safe-area-inset-left, 0px));
            padding-right: calc(16px + env(safe-area-inset-right, 0px));
          }

          .bottom-series-hub {
            width: calc(100vw - 24px);
            padding: 24px 16px;
            margin: 24px auto;
            border-radius: 18px;
          }

          .bottom-episodes-grid {
            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
            gap: 12px;
          }

          .bottom-relations-grid, .bottom-cast-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .header-breadcrumbs {
            font-size: 11px;
          }

          .banner-title {
            font-size: 22px;
          }

          .destiny-interaction-hub {
            padding: 50px 16px;
          }

          .destiny-choice-card {
            padding: 16px;
            gap: 12px;
          }

          .choice-letter-sphere {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }

          .choice-title-text {
            font-size: 14px;
          }

          .choice-desc-text {
            font-size: 11px;
          }

          .heart-like-huge-btn {
            padding: 12px 24px;
            min-width: 110px;
          }

          .episode-comments-board {
            padding: 40px 16px;
          }

          .map-modal-content {
            padding: 20px;
            border-radius: 20px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />

    </div>
  );
}
