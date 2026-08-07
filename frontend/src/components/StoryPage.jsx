import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Share2, 
  Star,
  BookOpen,
  Lock,
  ChevronDown,
  Globe,
  Bookmark,
  Sparkles,
  Play,
  Search,
  Menu,
  X,
  Trophy,
  Check,
  Gamepad2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

// ─── Theme Tokens (Matching Homepage Pastel Glassmorphism) ─────────────
const COLORS = {
  bg: "#1E1B4B",
  pink: "#F43F8E",
  purple: "#A855F7",
  gold: "#F59E0B",
  emerald: "#10B981",
  textDark: "#1E1B4B",
  textMuted: "#64748B",
  cardBg: "rgba(255, 255, 255, 0.88)",
  cardBorder: "rgba(255, 255, 255, 0.95)",
  glassCard: "rgba(255, 255, 255, 0.82)",
};

const DEFAULT_COVER = "/hero_bg.png";

// Exact 10 Mock Episodes from Screenshot
const SAMPLE_EPISODES = [
  {
    number: 1,
    title: "The Awakening",
    isNew: true,
    isUnlocked: true,
    synopsis: "In the ruins of an ancient city, you awaken with no memories. The world holds its breath.",
    score: "92%",
    likes: "1.2K",
    thumbnail: "/hero_bg.png"
  },
  {
    number: 2,
    title: "Whispers in the Dark",
    isUnlocked: false,
    synopsis: "A mysterious stranger offers guidance, but trust comes at a price.",
    score: "89%",
    likes: "980",
    thumbnail: "/seraphina_crown.png"
  },
  {
    number: 3,
    title: "The Broken Oath",
    isUnlocked: false,
    synopsis: "Old alliances crumble as you are forced to make an impossible choice.",
    score: "91%",
    likes: "870",
    thumbnail: "/into_starfall.png"
  },
  {
    number: 4,
    title: "Blood and Loyalty",
    isUnlocked: false,
    synopsis: "Your decision ignites a war that will reshape the kingdoms forever.",
    score: "88%",
    likes: "760",
    thumbnail: "/villains_heart.png"
  },
  {
    number: 5,
    title: "Edge of Betrayal",
    isUnlocked: false,
    synopsis: "The truth comes to light, and betrayal cuts deeper than any blade.",
    score: "90%",
    likes: "690",
    thumbnail: "/trust_the_stranger.png"
  },
  {
    number: 6,
    title: "The Crown of Ashes",
    isUnlocked: false,
    synopsis: "To claim power, you must sacrifice what matters most.",
    score: "93%",
    likes: "610",
    thumbnail: "/code_rebirth.png"
  },
  {
    number: 7,
    title: "Rise of the Rebellion",
    isUnlocked: false,
    synopsis: "The oppressed rise. Will you lead them to freedom or crush their dreams?",
    score: "87%",
    likes: "540",
    thumbnail: "/hero_bg.png"
  },
  {
    number: 8,
    title: "Storm of Fate",
    isUnlocked: false,
    synopsis: "A force beyond comprehension descends, testing every choice you've made.",
    score: "86%",
    likes: "510",
    thumbnail: "/seraphina_crown.png"
  },
  {
    number: 9,
    title: "Shadows of the Past",
    isUnlocked: false,
    synopsis: "Hidden truths from long ago return to haunt the present.",
    score: "85%",
    likes: "460",
    thumbnail: "/into_starfall.png"
  },
  {
    number: 10,
    title: "Dawn of Hope",
    isUnlocked: false,
    synopsis: "As darkness fades, a new beginning awaits. The journey continues...",
    score: "94%",
    likes: "430",
    thumbnail: "/villains_heart.png"
  }
];

export default function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("episodes");
  const [searchVal, setSearchVal] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      let storyData = null;

      // Try AI generated story json
      try {
        const aiRes = await axios.get('/ai_generated_story.json');
        if (aiRes.data && aiRes.data.title) {
          storyData = aiRes.data;
        }
      } catch (e) {}

      // Try backend API
      if (!storyData) {
        try {
          const res = await axios.get(`/api/stories/${id}`);
          storyData = res.data;
        } catch (e) {}
      }

      // Default Story fallback if none found
      if (!storyData) {
        storyData = {
          _id: id || "the-crowns-secret-vow",
          title: "Trust the Stranger",
          genre: "Romance, Fantasy",
          rating: "4.9",
          chaptersCount: 12,
          soulsCount: "10k",
          description: "In a realm where light and shadow are at war, your choices determine the survival of entire civilizations. Will you be the savior, or the architect of ruin?",
          authorName: "LunaRead",
          cover: "/trust_the_stranger.png",
          episodes: SAMPLE_EPISODES
        };
      }

      // Format episodes to make sure we have 10 full items matching clone
      if (!storyData.episodes || storyData.episodes.length < 10) {
        const mergedEps = SAMPLE_EPISODES.map((sample, idx) => {
          const existing = storyData.episodes?.[idx];
          return {
            ...sample,
            title: existing?.title || sample.title,
            synopsis: existing?.description || sample.synopsis,
            thumbnail: existing?.panels?.[0] || sample.thumbnail,
            number: idx + 1
          };
        });
        storyData.episodes = mergedEps;
      }

      setStory(storyData);
      setLoading(false);
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleStartJourney = () => {
    const targetEp = story?.episodes?.[0]?.number || 1;
    navigate(`/manta/${id || 'the-crowns-secret-vow'}?ep=${targetEp}`);
  };

  const handlePlayEpisode = (epNum) => {
    navigate(`/manta/${id || 'the-crowns-secret-vow'}?ep=${epNum}`);
  };

  if (loading) {
    return (
      <div style={{
        background: "url('/cloud_bg.png') center/cover no-repeat fixed, linear-gradient(180deg, #FDE8E8 0%, #F5D0FE 50%, #E0E7FF 100%)",
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 44, height: 44, border: "4px solid rgba(244,63,142,0.2)", borderTopColor: "#F43F8E", borderRadius: "50%" }} />
        <p style={{ marginTop: 16, color: "#1E1B4B", fontSize: 14, fontWeight: 800 }}>Loading ToonVault Story...</p>
      </div>
    );
  }

  const titleText = story.title || "Trust the Stranger";
  const seoTitle = `${titleText} — Interactive AI Webtoon | ToonVault`;
  const seoDesc = story.description || "Read interactive webtoons shaped by your decisions on ToonVault.";

  return (
    <div style={{
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif",
      background: "url('/cloud_bg.png') center/cover no-repeat fixed, linear-gradient(180deg, #FDE8E8 0%, #F5D0FE 50%, #E0E7FF 100%)",
      minHeight: "100vh",
      color: "#1E1B4B",
      paddingBottom: 60,
      overflowX: "hidden"
    }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { max-width: 100%; overflow-x: hidden; }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 15px 45px rgba(190, 140, 220, 0.22);
        }

        .ep-card {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        .ep-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(168, 85, 247, 0.18);
        }

        @media (max-width: 990px) {
          .story-grid-layout {
            grid-template-columns: 1fr !important;
          }
          .hero-content-flex {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .hero-cover-img {
            width: 180px !important;
            height: 250px !important;
          }
        }
      `}</style>

      {/* ═══ 1. TOP HEADER (NAVIGATION BAR) ═══ */}
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "16px 20px 0" }}>
        <nav className="glass-card" style={{
          borderRadius: 40,
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 10px 30px rgba(220, 170, 230, 0.25)"
        }}>
          {/* Brand Logo */}
          <div 
            style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }} 
            onClick={() => navigate("/")}
          >
            <img src="/toonvault_logo_full.png" alt="ToonVault" style={{ height: 44, width: "auto" }} />
          </div>

          {/* Center Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-only">
            {[
              { label: "Originals", path: "/browse" },
              { label: "Rankings", path: "/browse" },
              { label: "Canvas", path: "/browse" },
              { label: "Browse", path: "/browse" },
              { label: "Pricing", path: "/info/pricing" },
            ].map(item => (
              <button 
                key={item.label} 
                onClick={() => navigate(item.path)} 
                style={{
                  border: "none", background: "none",
                  fontSize: 14, fontWeight: 800, color: "#1E1B4B", cursor: "pointer",
                  whiteSpace: "nowrap", padding: 0
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Search & Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              borderRadius: 24, padding: "7px 16px", width: 190,
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
            }} className="desktop-only">
              <span style={{ fontSize: 13, color: "#94A3B8" }}>🔍</span>
              <input 
                type="text"
                placeholder="Search webtoons, genres..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{ border: "none", background: "none", outline: "none", fontSize: 12, color: "#1E1B4B", width: "100%", fontWeight: 600 }}
              />
            </div>

            <button 
              onClick={() => navigate('/user')}
              style={{
                padding: "8px 20px", borderRadius: 24,
                border: "1.5px solid rgba(244, 63, 142, 0.35)",
                background: "rgba(255, 255, 255, 0.95)",
                color: "#1E1B4B", fontSize: 13, fontWeight: 800, cursor: "pointer"
              }}
              className="desktop-only"
            >Log in</button>

            <button 
              onClick={() => navigate('/user?mode=signup')}
              style={{
                padding: "8px 22px", borderRadius: 24, border: "none",
                background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(244, 63, 142, 0.4)"
              }}
              className="desktop-only"
            >Sign up</button>
          </div>
        </nav>
      </div>

      {/* ═══ 2. HERO CONTAINER ═══ */}
      <div style={{ maxWidth: 1340, margin: "20px auto 0", padding: "0 20px" }}>
        <div style={{
          borderRadius: 36,
          padding: "36px 40px",
          background: "url('/hero_bg.png') center / cover no-repeat, linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 242, 246, 0.4) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 20px 60px rgba(190, 140, 220, 0.25)",
          position: "relative", overflow: "hidden"
        }}>
          <div className="hero-content-flex" style={{ display: "flex", gap: 36, alignItems: "center" }}>
            
            {/* Story Cover Image */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div 
                className="hero-cover-img"
                style={{
                  width: 230, height: 320, borderRadius: 24, overflow: "hidden",
                  boxShadow: "0 20px 45px rgba(180, 120, 210, 0.4)",
                  border: "3px solid rgba(255, 255, 255, 0.95)",
                  position: "relative"
                }}
              >
                <img 
                  src={story.cover || "/trust_the_stranger.png"} 
                  alt={story.title} 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  onError={(e) => { e.target.src = "/trust_the_stranger.png"; }}
                />

                {/* ⭐ LIVE Tag */}
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(8px)",
                  padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 900,
                  color: "#1E1B4B", display: "flex", alignItems: "center", gap: 4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  <span style={{ color: "#F43F8E" }}>⭐</span> LIVE
                </div>
              </div>
            </div>

            {/* Story Info */}
            <div style={{ flex: 1 }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 10, fontWeight: 900, textTransform: "uppercase",
                  padding: "5px 12px", borderRadius: 14,
                  background: "rgba(244, 63, 142, 0.12)", color: "#F43F8E",
                  border: "1px solid rgba(244, 63, 142, 0.25)", letterSpacing: 0.8
                }}>
                  • INTERACTIVE AI
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 900, textTransform: "uppercase",
                  padding: "5px 12px", borderRadius: 14,
                  background: "rgba(168, 85, 247, 0.12)", color: "#A855F7",
                  border: "1px solid rgba(168, 85, 247, 0.25)", letterSpacing: 0.8
                }}>
                  AI POWERED
                </span>
              </div>

              {/* Title & Icon */}
              <h1 style={{
                fontSize: 42, fontWeight: 900, color: "#1E1B4B",
                lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 12px",
                display: "flex", alignItems: "center", gap: 12
              }}>
                {story.title || "Trust the Stranger"} 📖
              </h1>

              {/* Description */}
              <p style={{
                fontSize: 14, color: "#475569", lineHeight: 1.6,
                margin: "0 0 20px", maxWidth: 640, fontWeight: 500
              }}>
                {story.description || "In a realm where light and shadow are at war, your choices determine the survival of entire civilizations. Will you be the savior, or the architect of ruin?"}
              </p>

              {/* Meta Info Stats */}
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24, color: "#1E1B4B", fontSize: 14, fontWeight: 800 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Star size={18} fill="#F59E0B" color="#F59E0B" />
                  <span>{story.rating || "4.9"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BookOpen size={18} color="#A855F7" />
                  <span>{story.episodes?.length || 12} Chapters</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Heart size={18} fill="#F43F8E" color="#F43F8E" />
                  <span>{story.soulsCount || "10k"} Souls</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button
                  onClick={handleStartJourney}
                  style={{
                    padding: "14px 32px", borderRadius: 30, border: "none",
                    background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                    color: "white", fontSize: 15, fontWeight: 900, cursor: "pointer",
                    boxShadow: "0 10px 28px rgba(244, 63, 142, 0.4)",
                    display: "flex", alignItems: "center", gap: 8, transition: "transform 0.2s"
                  }}
                >
                  <Play size={18} fill="white" /> Start Journey
                </button>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1.5px solid rgba(244, 63, 142, 0.3)",
                    color: isLiked ? "#F43F8E" : "#1E1B4B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
                  }}
                >
                  <Heart size={20} fill={isLiked ? "#F43F8E" : "none"} />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ═══ 3. FLOATING TAB SYSTEM BAR ═══ */}
      <div style={{ maxWidth: 1340, margin: "20px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{
          borderRadius: 30, padding: "8px 24px",
          display: "flex", gap: 32, alignItems: "center",
          boxShadow: "0 10px 30px rgba(220, 170, 230, 0.2)"
        }}>
          {[
            { id: "chronicles", label: "Chronicles", icon: "💎" },
            { id: "episodes", label: "Episodes", icon: "📑" },
            { id: "map", label: "Quest Map", icon: "🗺️" },
            { id: "reviews", label: "Reviews", icon: "💬" },
            { id: "gallery", label: "Vault Gallery", icon: "🎨" },
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: "none", background: "none",
                  padding: "10px 4px", fontSize: 14, fontWeight: isActive ? 900 : 700,
                  color: isActive ? "#F43F8E" : "#64748B",
                  cursor: "pointer", position: "relative",
                  display: "flex", alignItems: "center", gap: 8
                }}
              >
                <span>{tab.icon}</span> {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    style={{
                      position: "absolute", bottom: -2, left: 0, right: 0,
                      height: 3, background: "linear-gradient(90deg, #F43F8E, #A855F7)",
                      borderRadius: 2
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ 4. MAIN CONTENT AREA (2 COLUMNS) ═══ */}
      <div style={{ maxWidth: 1340, margin: "24px auto 0", padding: "0 20px" }}>
        <div className="story-grid-layout" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

          {/* ─── LEFT COLUMN: EPISODES LIST ─── */}
          <div>
            {/* Header bar */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B", margin: 0 }}>All Episodes</h2>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#F43F8E", background: "rgba(244, 63, 142, 0.12)", padding: "2px 10px", borderRadius: 12 }}>
                  {story.episodes?.length || 12}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#64748B", cursor: "pointer" }}>
                <span>Sort by:</span>
                <span style={{ color: "#1E1B4B" }}>Episode Order ∨</span>
              </div>
            </div>

            {/* Episodes List (1 to 10) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(story.episodes || SAMPLE_EPISODES).map((ep, idx) => {
                const epNum = ep.number || (idx + 1);
                const isUnlocked = idx === 0 || ep.isUnlocked;

                return (
                  <div
                    key={idx}
                    className="glass-card ep-card"
                    style={{
                      borderRadius: 24, padding: "16px 20px",
                      display: "flex", alignItems: "center", gap: 16,
                      background: "rgba(255, 255, 255, 0.88)"
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 100, height: 68, borderRadius: 16, overflow: "hidden",
                      flexShrink: 0, position: "relative", boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
                    }}>
                      <img 
                        src={ep.thumbnail || ep.panels?.[0] || story.cover || "/hero_bg.png"} 
                        alt={ep.title} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.src = "/hero_bg.png"; }}
                      />
                    </div>

                    {/* Number Badge */}
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(244, 63, 142, 0.1)", border: "1px solid rgba(244, 63, 142, 0.2)",
                      color: "#F43F8E", fontWeight: 900, fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      {epNum}
                    </div>

                    {/* Content Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#1E1B4B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {ep.title}
                        </div>
                        {(ep.isNew || idx === 0) && (
                          <span style={{ fontSize: 9, fontWeight: 900, color: "#F43F8E", background: "rgba(244, 63, 142, 0.15)", padding: "2px 8px", borderRadius: 8, textTransform: "uppercase" }}>
                            New
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, lineHeight: 1.4, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {ep.synopsis || ep.description || "A mysterious turning point in the story..."}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11, fontWeight: 800, color: "#64748B" }}>
                        <span style={{ color: "#10B981" }}>★ {ep.score || "92%"}</span>
                        <span>💖 {ep.likes || "1.2K"}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isUnlocked ? (
                        <button
                          onClick={() => handlePlayEpisode(epNum)}
                          style={{
                            padding: "8px 20px", borderRadius: 20, border: "none",
                            background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                            color: "white", fontSize: 12, fontWeight: 900, cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(244, 63, 142, 0.35)",
                            display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                          }}
                        >
                          <Play size={12} fill="white" /> Play
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePlayEpisode(epNum)}
                          style={{
                            padding: "8px 18px", borderRadius: 20,
                            border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.7)",
                            color: "#64748B", fontSize: 12, fontWeight: 800, cursor: "pointer",
                            display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap"
                          }}
                        >
                          <Lock size={12} /> Locked
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Pagination Controls */}
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <button style={{
                padding: "10px 24px", borderRadius: 20,
                border: "1px solid rgba(244, 63, 142, 0.3)", background: "rgba(255, 255, 255, 0.9)",
                color: "#1E1B4B", fontSize: 12, fontWeight: 800, cursor: "pointer",
                marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
              }}>
                Show More Episodes ∨
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, fontWeight: 800 }}>
                <button style={{ border: "none", background: "none", color: "#94A3B8", cursor: "pointer", padding: "6px 10px" }}>‹ Previous</button>
                <button style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "linear-gradient(135deg, #F43F8E, #A855F7)", color: "white", cursor: "pointer" }}>1</button>
                <button style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "none", color: "#1E1B4B", cursor: "pointer" }}>2</button>
                <button style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "none", color: "#1E1B4B", cursor: "pointer" }}>3</button>
                <span style={{ color: "#94A3B8" }}>...</span>
                <button style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: "none", color: "#1E1B4B", cursor: "pointer" }}>12</button>
                <button style={{ border: "none", background: "none", color: "#1E1B4B", cursor: "pointer", padding: "6px 10px" }}>Next ›</button>
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: SIDEBAR ─── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Card 1: Story Analytics */}
            <div className="glass-card" style={{ borderRadius: 28, padding: "22px 24px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1E1B4B", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>📊</span> Story Analytics
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 12, fontWeight: 700 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Choice Complexity</span>
                  <span style={{ color: "#F43F8E", fontWeight: 900 }}>High</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Branch Count</span>
                  <span style={{ color: "#A855F7", fontWeight: 900 }}>32 Paths</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Avg completion</span>
                  <span style={{ color: "#10B981", fontWeight: 900 }}>92%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Reader Mood</span>
                  <span style={{ color: "#F59E0B", fontWeight: 900 }}>Intense</span>
                </div>
              </div>
            </div>

            {/* Card 2: Community Goals */}
            <div className="glass-card" style={{ borderRadius: 28, padding: "22px 24px" }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1E1B4B", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span>🏆</span> Community Goals
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 6 }}>
                    <span>💖 10k Souls bound</span>
                    <span style={{ color: "#F43F8E" }}>85%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #F43F8E, #D946EF)", borderRadius: 3 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 6 }}>
                    <span>🚗 Quest Map: Chapter 12</span>
                    <span style={{ color: "#A855F7" }}>62%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ width: "62%", height: "100%", background: "linear-gradient(90deg, #A855F7, #6366F1)", borderRadius: 3 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 6 }}>
                    <span>🌐 Global Reach</span>
                    <span style={{ color: "#10B981" }}>68%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "linear-gradient(90deg, #10B981, #059669)", borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Personal Vault */}
            <div className="glass-card" style={{ borderRadius: 28, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#1E1B4B", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>🔖</span> Personal Vault
                </div>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#A855F7", background: "rgba(168, 85, 247, 0.12)", padding: "2px 8px", borderRadius: 10 }}>2</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <img src="/trust_the_stranger.png" alt="" style={{ width: "100%", height: 110, borderRadius: 16, objectFit: "cover" }} />
                <img src="/into_starfall.png" alt="" style={{ width: "100%", height: 110, borderRadius: 16, objectFit: "cover" }} />
              </div>

              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, textAlign: "center", marginBottom: 14 }}>
                2 stories saved.<br />Pick up your adventure anytime.
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  width: "100%", padding: "10px", borderRadius: 18,
                  border: "1.5px solid rgba(244, 63, 142, 0.3)", background: "rgba(255,255,255,0.9)",
                  color: "#1E1B4B", fontSize: 12, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}
              >
                Go to Vault
              </button>
            </div>

            {/* Card 4: Creator Profile */}
            <div className="glass-card" style={{ borderRadius: 28, padding: "22px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <img src="/hero_bg.png" alt="LunaRead" style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #F43F8E" }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#A855F7", textTransform: "uppercase" }}>Master Architect</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#1E1B4B", display: "flex", alignItems: "center", gap: 4 }}>
                    LunaRead <span style={{ color: "#3B82F6", fontSize: 12 }}>✓</span>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, fontWeight: 500, margin: "0 0 16px" }}>
                Crafting immersive worlds where your decisions shape the future. Join the community of seekers.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 18,
                    border: "1.5px solid rgba(244, 63, 142, 0.35)",
                    background: isFollowing ? "#F43F8E" : "white",
                    color: isFollowing ? "white" : "#1E1B4B",
                    fontSize: 12, fontWeight: 800, cursor: "pointer"
                  }}
                >
                  {isFollowing ? "Following" : "Follow Creator"}
                </button>

                <button style={{
                  width: 40, height: 40, borderRadius: 18,
                  border: "1.5px solid rgba(0,0,0,0.08)", background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "#64748B"
                }}>
                  <Share2 size={16} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ═══ 5. FOOTER ═══ */}
      <footer style={{ maxWidth: 1340, margin: "50px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{ borderRadius: 36, padding: "36px 40px" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr) 1.5fr",
            gap: 24, marginBottom: 30
          }}>
            <div>
              <img src="/toonvault_logo_full.png" alt="ToonVault" style={{ height: 36, marginBottom: 10 }} />
              <div style={{ fontSize: 11, color: "#64748B" }}>Stories you choose. Worlds you unlock.</div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Explore</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span>Originals</span>
                <span>Rankings</span>
                <span>Browse</span>
                <span>Canvas</span>
                <span>Pricing</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>For Readers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span>How It Works</span>
                <span>Community</span>
                <span>FAQ</span>
                <span>Gift Cards</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>For Creators</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span>Create on ToonVault</span>
                <span>Creator Resources</span>
                <span>Blog</span>
                <span>Success Stories</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span>About Us</span>
                <span>Careers</span>
                <span>Contact</span>
                <span>Press Kit</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Stay connected</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <span>👾</span> <span>📸</span> <span>🐦</span> <span>▶️</span> <span>🎵</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255, 255, 255, 0.9)", border: "1px solid rgba(244, 63, 142, 0.3)",
                borderRadius: 20, padding: "4px 6px 4px 12px"
              }}>
                <input type="email" placeholder="Enter your email" style={{ border: "none", background: "none", outline: "none", fontSize: 11, color: "#1E1B4B", width: "100%" }} />
                <button style={{
                  width: 26, height: 26, borderRadius: "50%", border: "none",
                  background: "linear-gradient(135deg, #F43F8E, #A855F7)", color: "white",
                  cursor: "pointer", fontSize: 11
                }}>➔</button>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: 11, color: "#94A3B8"
          }}>
            <div>© 2025 ToonVault. All rights reserved.</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
              <span>Community Guidelines</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
