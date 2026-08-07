import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StoryImage from "./StoryImage";

const GENRES = [
  { id: "all",         label: "All",           emoji: "✨", color: "#F43F8E", bg: "linear-gradient(135deg, #F43F8E, #A855F7)" },
  { id: "romance",     label: "Romance",        emoji: "💖", color: "#F43F5E", bg: "linear-gradient(135deg, #F43F5E, #BE123C)" },
  { id: "fantasy",     label: "Fantasy",        emoji: "🔮", color: "#8B5CF6", bg: "linear-gradient(135deg, #8B5CF6, #6D28D9)" },
  { id: "drama",       label: "Drama",          emoji: "🎭", color: "#EC4899", bg: "linear-gradient(135deg, #EC4899, #BE185D)" },
  { id: "action",      label: "Action",         emoji: "⚔️", color: "#06B6D4", bg: "linear-gradient(135deg, #06B6D4, #0E7490)" },
  { id: "comedy",      label: "Comedy",         emoji: "😄", color: "#F59E0B", bg: "linear-gradient(135deg, #F59E0B, #B45309)" },
  { id: "sliceoflife", label: "Slice of Life",  emoji: "🌸", color: "#10B981", bg: "linear-gradient(135deg, #10B981, #047857)" },
  { id: "scifi",       label: "Sci-Fi",         emoji: "🚀", color: "#3B82F6", bg: "linear-gradient(135deg, #3B82F6, #1D4ED8)" },
  { id: "supernatural",label: "Supernatural",   emoji: "👻", color: "#A855F7", bg: "linear-gradient(135deg, #A855F7, #7E22CE)" },
  { id: "mystery",     label: "Mystery",        emoji: "🔍", color: "#6366F1", bg: "linear-gradient(135deg, #6366F1, #4338CA)" },
  { id: "thriller",    label: "Thriller",       emoji: "🔥", color: "#E11D48", bg: "linear-gradient(135deg, #E11D48, #9F1239)" },
];

const DEFAULT_COVER = "/trust_the_stranger.png";

const TRENDING_MOCK = [
  { id: "t1", title: "Seraphina's Crown", genre: "Fantasy, Romance", rating: "4.9", cover: "/seraphina_crown.png", isNew: true },
  { id: "t2", title: "Into the Starfall", genre: "Sci-Fi, Adventure", rating: "4.8", cover: "/into_starfall.png", isNew: true },
  { id: "t3", title: "The Villain's Heart", genre: "Romance, Drama", rating: "4.9", cover: "/villains_heart.png", isNew: true },
  { id: "t4", title: "Eternal Bloom", genre: "Slice of Life, Fantasy", rating: "4.7", cover: "/eternal_bloom.png", isNew: true },
  { id: "t5", title: "Code: Rebirth", genre: "Action, Sci-Fi", rating: "4.8", cover: "/code_rebirth.png", isNew: true },
  { id: "t6", title: "Whispers in Rain", genre: "Drama, Romance", rating: "4.8", cover: "/whispers_in_rain.png", isNew: true },
];

const formatRating = (val) => {
  if (!val) return "4.8";
  const num = parseFloat(val);
  return isNaN(num) ? "4.8" : num.toFixed(1);
};

function StoryCard({ story }) {
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: 20,
      border: "1px solid rgba(255, 255, 255, 0.95)",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      flexShrink: 0,
      width: 190,
      boxShadow: "0 10px 25px rgba(220, 170, 230, 0.18)"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 18px 36px rgba(244, 63, 142, 0.3)";
        e.currentTarget.style.borderColor = "#F43F8E";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(220, 170, 230, 0.18)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.95)";
      }}
      onClick={() => navigate(`/story/${story.id}`)}
    >
      <div style={{
        height: 210,
        background: "#F1F5F9",
        overflow: "hidden",
        position: "relative",
      }}>
        <StoryImage 
          src={story.cover || DEFAULT_COVER} 
          alt={story.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span style={{
          position: "absolute", top: 10, left: 10,
          background: "linear-gradient(135deg, #F43F8E, #BE123C)", color: "white",
          fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 6, letterSpacing: 0.5,
          boxShadow: "0 2px 8px rgba(244,63,142,0.4)"
        }}>NEW</span>

        <button onClick={e => { e.stopPropagation(); setBookmarked(!bookmarked); }} style={{
          position: "absolute", bottom: 8, right: 8,
          background: bookmarked ? "#F43F8E" : "rgba(255,255,255,0.9)",
          border: "none", borderRadius: 8, width: 26, height: 26,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 11, color: bookmarked ? "white" : "#1E1B4B", transition: "all 0.2s",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
        }}>🔖</button>
      </div>

      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#1E1B4B", marginBottom: 4, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {story.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>{story.genre || "Fantasy, Romance"}</div>
          <div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 800, display: "flex", alignItems: "center", gap: 3 }}>
            <span>⭐</span> {formatRating(story.rating)}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, viewAll }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1E1B4B", margin: 0, lineHeight: 1.2 }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>{sub}</p>}
      </div>
      {viewAll && (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button 
            onClick={() => navigate('/browse')}
            style={{ fontSize: 13, color: "#7E22CE", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}
          >View all ›</button>
          <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.9)", cursor: "pointer", fontSize: 14, fontWeight: 800 }}>‹</button>
          <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.9)", cursor: "pointer", fontSize: 14, fontWeight: 800 }}>›</button>
        </div>
      )}
    </div>
  );
}

export default function ToonVaultHome() {
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [liveStories, setLiveStories] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [aiPrompt, setAiPrompt] = useState("");
  const [selectedPoll, setSelectedPoll] = useState("A");
  const [pollVotes, setPollVotes] = useState({ A: 62, B: 25, C: 13 });
  const [pollVoted, setPollVoted] = useState(false);
  const [billingCycle, setBillingCycle] = useState("yearly");

  const searchRef = useRef(null);
  const genreScrollRef = useRef(null);

  const scrollGenres = (dir) => {
    genreScrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  useEffect(() => {
    axios.get('/api/stories')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(s => {
            let cover = s.coverImage || s.cover || s.image;
            if (!cover || (!cover.startsWith('http') && !cover.startsWith('/'))) {
              cover = DEFAULT_COVER;
            }
            return {
              ...s,
              id: s._id || s.id,
              cover: cover,
              genre: s.genre || "Romance",
              rating: formatRating(s.rating)
            };
          });
          setLiveStories(mapped);
        }
      })
      .catch(err => console.error("Error fetching stories:", err));
  }, []);

  useEffect(() => {
    if (searchVal.trim() && liveStories.length > 0) {
      const filtered = liveStories.filter(s => 
        s.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        s.genre?.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchVal, liveStories]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const featured = liveStories.length > 0 ? liveStories[heroIndex % liveStories.length] : {
    id: "featured-1",
    title: "Trust the Stranger",
    subtitle: "Episode 12 • Romance, Mystery",
    genre: "Romance, Mystery",
    rating: "4.8",
    cover: DEFAULT_COVER
  };

  const handleVote = (optionKey) => {
    if (pollVoted) return;
    setSelectedPoll(optionKey);
    setPollVotes(prev => ({
      ...prev,
      [optionKey]: prev[optionKey] + 1
    }));
    setPollVoted(true);
  };

  const handlePromptSubmit = () => {
    if (!aiPrompt.trim()) return;
    if (isLoggedIn) {
      navigate(`/browse?prompt=${encodeURIComponent(aiPrompt)}`);
    } else {
      localStorage.setItem('pending_prompt', aiPrompt);
      navigate('/user?intent=write');
    }
  };

  const trendingList = liveStories.length > 0 
    ? liveStories.slice(0, 6)
    : TRENDING_MOCK;

  return (
    <div style={{ 
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif", 
      background: "url('/cloud_bg.png') center/cover no-repeat fixed, linear-gradient(180deg, #FDE8E8 0%, #F5D0FE 50%, #E0E7FF 100%)", 
      minHeight: "100vh", 
      color: "#1E1B4B",
      paddingBottom: 60
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 15px 45px rgba(190, 140, 220, 0.22);
        }

        .hero-layout {
          display: grid;
          grid-template-columns: 1.15fr 270px 1fr;
          gap: 28px;
          align-items: center;
        }

        @media (max-width: 1100px) {
          .hero-layout {
            grid-template-columns: 1fr 1fr;
          }
          .hero-center-col {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .desktop-nav-links {
            display: none !important;
          }
          .desktop-search-bar {
            width: 130px !important;
          }
        }

        @media (max-width: 768px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>

      {/* ═══ 1. TOP FLOATING PILL NAV ═══ */}
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "16px 20px 0" }}>
        <nav className="glass-card" style={{
          borderRadius: 40,
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          boxShadow: "0 10px 30px rgba(220, 170, 230, 0.25)"
        }}>
          {/* Brand Logo & Tagline (Exact Reference Match) */}
          <div 
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} 
            onClick={() => navigate("/")}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 14px rgba(244, 63, 142, 0.35)", color: "white"
            }}>📖</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B", letterSpacing: "-0.5px", lineHeight: 1 }}>
                Toon<span style={{ color: "#F43F8E" }}>Vault</span>
              </div>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500, marginTop: 2, whiteSpace: "nowrap" }}>
                Stories you choose. Worlds you unlock.
              </div>
            </div>
          </div>

          {/* Nav Links (Spaced cleanly without touching logo or search bar) */}
          <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 22, flexShrink: 0 }}>
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
                  fontSize: 14, fontWeight: 700, color: "#334155", cursor: "pointer",
                  transition: "all 0.2s", whiteSpace: "nowrap", padding: 0
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#F43F8E"}
                onMouseLeave={e => e.currentTarget.style.color = "#334155"}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search, Dark mode, Login */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div ref={searchRef} style={{ position: "relative" }}>
              <div className="desktop-search-bar" style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255, 255, 255, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                borderRadius: 24, padding: "7px 14px", width: 170,
                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease"
              }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>🔍</span>
                <input 
                  type="text"
                  placeholder="Search webtoons..."
                  value={searchVal}
                  onChange={e => { setSearchVal(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  style={{
                    border: "none", background: "none", outline: "none",
                    fontSize: 12, color: "#1E1B4B", width: "100%", fontWeight: 500
                  }}
                />
              </div>

              {/* Live Search Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div style={{
                  position: "absolute", top: "115%", right: 0, width: 260,
                  background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(16px)",
                  borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)", zIndex: 100, overflow: "hidden", padding: 6
                }}>
                  {searchResults.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => { navigate(`/story/${s.id}`); setSearchOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                        borderRadius: 12, cursor: "pointer", transition: "background 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(244, 63, 142, 0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <img src={s.cover || DEFAULT_COVER} alt="" style={{ width: 34, height: 44, borderRadius: 6, objectFit: "cover" }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1E1B4B" }}>{s.title}</div>
                        <div style={{ fontSize: 10, color: "#F43F8E", fontWeight: 600 }}>{s.genre}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button 
              title="Toggle theme"
              style={{
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                background: "rgba(255, 255, 255, 0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                flexShrink: 0
              }}
            >
              🌙
            </button>

            {/* Login & Sign Up Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => navigate('/user')}
                style={{
                  padding: "8px 18px", borderRadius: 24, border: "1px solid rgba(244, 63, 142, 0.3)",
                  background: "rgba(255, 255, 255, 0.85)", color: "#1E1B4B", fontSize: 13, fontWeight: 700, cursor: "pointer"
                }}
              >Log in</button>
              <button 
                onClick={() => navigate('/user?mode=signup')}
                style={{
                  padding: "8px 20px", borderRadius: 24, border: "none",
                  background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                  color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(244, 63, 142, 0.4)"
                }}
              >Sign up</button>
            </div>
          </div>
        </nav>
      </div>

      {/* ═══ GENRE PILLS BAR ═══ */}
      <div style={{ maxWidth: 1340, margin: "16px auto 0", padding: "0 20px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button 
            onClick={() => scrollGenres(-1)}
            style={{
              position: "absolute", left: -4, zIndex: 10,
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.95)", border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#1E1B4B", fontWeight: 800
            }}
          >‹</button>

          <div 
            ref={genreScrollRef}
            style={{
              display: "flex", gap: 10, padding: "6px 36px",
              overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none",
              width: "100%"
            }}
          >
            {GENRES.map(g => {
              const isActive = activeGenre === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setActiveGenre(g.id);
                    navigate(`/browse?genre=${g.id === 'all' ? 'all' : g.label}`);
                  }}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 24,
                    background: isActive ? "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)" : "rgba(255, 255, 255, 0.8)",
                    color: isActive ? "white" : "#1E1B4B",
                    fontSize: 13,
                    fontWeight: isActive ? 800 : 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.95)",
                    boxShadow: isActive ? "0 4px 16px rgba(244, 63, 142, 0.4)" : "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    flexShrink: 0,
                    display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <span>{g.emoji}</span> {g.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => scrollGenres(1)}
            style={{
              position: "absolute", right: -4, zIndex: 10,
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.95)", border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#1E1B4B", fontWeight: 800
            }}
          >›</button>
        </div>
      </div>

      {/* ═══ 2. MAIN HERO CONTAINER ("AI INTERACTIVE WEBTOON STUDIO") ═══ */}
      <div style={{ maxWidth: 1340, margin: "20px auto 0", padding: "0 20px" }}>
        <div style={{
          borderRadius: 32,
          padding: "36px 40px",
          background: "url('/hero_bg.png') center / cover no-repeat, linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 242, 246, 0.3) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 20px 60px rgba(190, 140, 220, 0.25)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div className="hero-layout">

            {/* LEFT COLUMN: HERO TEXT & CTAs */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(244, 63, 142, 0.35)",
                padding: "6px 14px", borderRadius: 20, marginBottom: 18,
                boxShadow: "0 2px 10px rgba(244, 63, 142, 0.15)"
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#7E22CE", letterSpacing: 0.8, textTransform: "uppercase" }}>
                  ✨ AI INTERACTIVE WEBTOON STUDIO
                </span>
              </div>

              <h1 style={{
                fontSize: 50, fontWeight: 900, color: "#1E1B4B",
                lineHeight: 1.05, letterSpacing: "-1.5px", margin: "0 0 16px"
              }}>
                Your choices.<br />
                Their <span style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #F43F8E 0%, #D946EF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>destiny.</span>
              </h1>

              <p style={{
                fontSize: 15, color: "#475569", lineHeight: 1.6,
                margin: "0 0 24px", maxWidth: 440, fontWeight: 500
              }}>
                Read interactive webtoons shaped by your decisions. Your votes branch the story, unlock new paths, and reveal unforgettable endings.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate('/browse')}
                  style={{
                    padding: "13px 28px", borderRadius: 30, border: "none",
                    background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                    color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(244, 63, 142, 0.4)", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span>▶</span> Start Reading
                </button>

                <button
                  onClick={handlePromptSubmit}
                  style={{
                    padding: "13px 24px", borderRadius: 30,
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(244, 63, 142, 0.35)",
                    color: "#475569", fontSize: 14, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <span>✨</span> Prompt a Story
                </button>
              </div>

              {/* Stats Bar */}
              <div style={{
                background: "rgba(255, 255, 255, 0.65)",
                borderRadius: 20, border: "1px solid rgba(255, 255, 255, 0.95)",
                padding: "14px 20px", display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 14, flexWrap: "wrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)"
              }}>
                {[
                  { num: "10K+", label: "Active Readers" },
                  { num: "500+", label: "Original Webtoons" },
                  { num: "50+", label: "Creators" },
                  { num: "100+", label: "Genres" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: "#F43F8E" }}>{s.num}</div>
                    <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: "#F43F8E", fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span>💖</span> Create stories readers love & earn ToonCoins & rewards.
              </div>

              {/* Feature icons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { icon: "📖", title: "Choose", sub: "next scene", isBgCircle: false },
                  { icon: "📝", title: "Follow", sub: "storylines", isBgCircle: false },
                  { icon: "⚡", title: "Instant AI", sub: "panel art", isBgCircle: true },
                  { icon: "📦", title: "Vault", sub: "bookmarks", isBgCircle: false },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    borderRadius: 16, padding: "8px 14px", border: "1px solid rgba(255, 255, 255, 0.95)",
                    display: "flex", alignItems: "center", gap: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: f.isBgCircle ? "50%" : 10,
                      background: f.isBgCircle ? "linear-gradient(135deg, #3B82F6, #60A5FA)" : "rgba(244, 63, 142, 0.1)",
                      color: f.isBgCircle ? "white" : "#F43F8E",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                    }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#1E1B4B", lineHeight: 1.1 }}>{f.title}</div>
                      <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN: FEATURED STORY COVER */}
            <div className="hero-center-col" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div 
                onClick={() => navigate(`/story/${featured.id}`)}
                style={{
                  width: 250, height: 360, borderRadius: 24, overflow: "hidden",
                  position: "relative", cursor: "pointer",
                  boxShadow: "0 16px 40px rgba(180, 120, 210, 0.35)",
                  border: "2px solid rgba(255, 255, 255, 0.95)",
                  transition: "transform 0.3s"
                }}
              >
                <img src={DEFAULT_COVER} alt="Trust the Stranger" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(8px)",
                  padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 900,
                  color: "#1E1B4B", display: "flex", alignItems: "center", gap: 4
                }}>
                  <span style={{ color: "#F59E0B" }}>⭐</span> 4.8
                </div>

                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "16px 14px 14px",
                  background: "linear-gradient(to top, rgba(30, 27, 75, 0.9) 20%, transparent)",
                  color: "white"
                }}>
                  <span style={{
                    background: "linear-gradient(135deg, #A855F7, #F43F8E)",
                    fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 6,
                    letterSpacing: 0.5, textTransform: "uppercase", display: "inline-block", marginBottom: 4
                  }}>AI POWERED</span>
                  <div style={{ fontSize: 15, fontWeight: 900, lineHeight: 1.2 }}>Trust the Stranger</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>Episode 12 • Romance, Mystery</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
                {[0, 1, 2, 3, 4].map(idx => (
                  <div 
                    key={idx} 
                    onClick={() => setHeroIndex(idx)}
                    style={{
                      width: idx === (heroIndex % 5) ? 20 : 6, height: 6, borderRadius: 3,
                      background: idx === (heroIndex % 5) ? "linear-gradient(135deg, #F43F8E, #A855F7)" : "rgba(255, 255, 255, 0.8)",
                      cursor: "pointer", transition: "all 0.3s"
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: COMMUNITY CHOICES POLL */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#7E22CE", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>
                WHERE WILL YOU TAKE THE STORY?
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span>✨</span> Community Choices
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                {[
                  { key: "A", title: "Follow the Whisper", desc: "Uncover the hidden truth before it's too late.", color: "#A855F7", isTop: true },
                  { key: "B", title: "Trust the Stranger", desc: "Take the risk and step into the unknown.", color: "#F43F8E" },
                  { key: "C", title: "Leave It Behind", desc: "Walk away — before it changes everything.", color: "#10B981" },
                ].map(opt => {
                  const votesPercent = pollVotes[opt.key] || 0;
                  const isSelected = selectedPoll === opt.key;

                  return (
                    <div
                      key={opt.key}
                      onClick={() => handleVote(opt.key)}
                      style={{
                        background: isSelected ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
                        borderRadius: 16, padding: "12px 14px",
                        border: isSelected ? `2px solid ${opt.color}` : "1px solid rgba(255, 255, 255, 0.95)",
                        cursor: "pointer", position: "relative", overflow: "hidden",
                        boxShadow: isSelected ? `0 4px 14px ${opt.color}35` : "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      {opt.isTop && (
                        <span style={{
                          position: "absolute", top: 8, right: 10,
                          background: "#FBBF24", color: "#78350F",
                          fontSize: 9, fontWeight: 900, padding: "2px 8px", borderRadius: 6
                        }}>TOP CHOICE</span>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, background: opt.color,
                          color: "white", fontWeight: 900, fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>{opt.key}</div>
                        <div style={{ flex: 1, paddingRight: opt.isTop ? 60 : 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: "#1E1B4B" }}>{opt.title}</div>
                          <div style={{ fontSize: 11, color: "#64748B", margin: "2px 0 6px", fontWeight: 500 }}>{opt.desc}</div>
                          
                          <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ width: `${votesPercent}%`, height: "100%", background: opt.color, borderRadius: 3 }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: opt.color, alignSelf: "flex-end" }}>{votesPercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Option D */}
              <div style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: 18, padding: "12px 14px",
                border: "1.5px dashed #A855F7",
                boxShadow: "0 4px 14px rgba(168, 85, 247, 0.15)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: "#A855F7",
                    color: "white", fontWeight: 900, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>D</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1E1B4B" }}>Write Your Own Twist</div>
                    <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Prompt any plot twist & AI generates the next scene.</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {[
                    { label: "⏳ Time Travel Twist" },
                    { label: "💌 Secret Confession" },
                    { label: "🔥 Power Awakening" },
                  ].map(tag => (
                    <button
                      key={tag.label}
                      onClick={() => setAiPrompt(tag.label)}
                      style={{
                        fontSize: 10, fontWeight: 700, color: "#7E22CE",
                        background: "rgba(168, 85, 247, 0.1)", border: "1px solid rgba(168, 85, 247, 0.2)",
                        padding: "3px 8px", borderRadius: 8, cursor: "pointer"
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="e.g. The protagonist reveals a hidden power..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handlePromptSubmit(); }}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 12,
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      background: "white", fontSize: 11, color: "#1E1B4B", outline: "none", fontWeight: 500
                    }}
                  />
                  <button
                    onClick={handlePromptSubmit}
                    style={{
                      width: 34, height: 34, borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                      color: "white", cursor: "pointer", fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(244, 63, 142, 0.35)"
                    }}
                  >✨</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ═══ 3. THREE MIDDLE PROMO BANNERS ═══ */}
      <div style={{ maxWidth: 1340, margin: "24px auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {[
            { icon: "🏆", line1: "22 comics • 2,300+ episodes", line2: "Dive all the way in!", color: "#6B21A8" },
            { icon: "🎁", line1: "Check in daily &", line2: "catch 100 free episodes!", color: "#C2410C" },
            { icon: "🔥", line1: "Mature versions available", line2: "Spicier cuts on website!", color: "#991B1B" },
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => navigate('/browse')}
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(20px)",
                borderRadius: 24, padding: "18px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 30px rgba(220, 170, 230, 0.2)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.95)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                }}>{card.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: card.color }}>{card.line1}</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#1E1B4B", marginTop: 2 }}>{card.line2}</div>
                </div>
              </div>
              <div style={{ fontSize: 18, color: card.color, fontWeight: 900 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 4. TRENDING RIGHT NOW SECTION ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{ borderRadius: 28, padding: "24px 28px" }}>
          <SectionHeader 
            title="Trending Right Now" 
            sub="Top picks loved by the community" 
            viewAll={true} 
          />

          <div style={{
            display: "flex", gap: 16, overflowX: "auto",
            paddingBottom: 8, scrollbarWidth: "none"
          }}>
            {trendingList.map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 5. TWO-COLUMN FEATURE BLOCK ("How ToonVault Works" + "Create Your Own Story") ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 24 }}>
          
          {/* Left Block: How ToonVault Works */}
          <div className="glass-card" style={{ borderRadius: 28, padding: "28px 30px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1E1B4B", margin: "0 0 20px" }}>
              How <span style={{ color: "#F43F8E" }}>ToonVault</span> Works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { step: "1. Choose", desc: "Pick what happens next.", icon: "📖" },
                { step: "2. Follow", desc: "Explore different story branches.", icon: "🔀" },
                { step: "3. Instant AI", desc: "Watch stunning panel art unfold.", icon: "⚡" },
                { step: "4. Vault", desc: "Save your favorites and never lose track.", icon: "📦" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.95)",
                  borderRadius: 20, padding: "18px 16px", textCenter: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, margin: "0 auto 10px",
                    background: "rgba(244, 63, 142, 0.1)", color: "#F43F8E",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
                  }}>{item.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#1E1B4B", marginBottom: 4 }}>{item.step}</div>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Create Your Own Story (With Anime Girl Artist Image) */}
          <div className="glass-card" style={{
            borderRadius: 28, padding: "28px 32px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,240,245,0.85) 100%)",
            position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <img src="/creator_anime_girl.png" alt="" style={{
              position: "absolute", right: 0, bottom: 0, height: "100%", width: "auto", objectFit: "cover", pointerEvents: "none"
            }} />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#1E1B4B", margin: "0 0 4px" }}>Create Your Own Story</h2>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 20px", fontWeight: 600 }}>Built for creators. Loved by fans.</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 420 }}>
                {[
                  { title: "AI Story Studio", sub: "Generate plot ideas & scenes", icon: "⚡" },
                  { title: "Branching Engine", sub: "Create choices & multiple endings", icon: "🔀" },
                  { title: "Creator Analytics", sub: "Track readers, choices & drops", icon: "📊" },
                  { title: "Global Audience", sub: "Reach readers around the world", icon: "🌐" },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: "rgba(255, 255, 255, 0.85)", borderRadius: 14, padding: "10px 12px",
                    border: "1px solid rgba(255, 255, 255, 0.95)", display: "flex", alignItems: "center", gap: 8
                  }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#1E1B4B" }}>{p.title}</div>
                      <div style={{ fontSize: 9, color: "#64748B" }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button 
                onClick={() => navigate('/user?intent=create')}
                style={{
                  padding: "12px 28px", borderRadius: 30, border: "none",
                  background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                  color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(244, 63, 142, 0.35)"
                }}
              >Start Creating Now</button>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ 6. SIMPLE PRICING SECTION ("Simple Pricing. Unlimited Stories.") ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{ borderRadius: 32, padding: "36px 40px", position: "relative", overflow: "hidden" }}>
          
          {/* Header & Toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30, flexWrap: "wrap", gap: 16 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1E1B4B", margin: 0 }}>
              Simple Pricing. Unlimited Stories.
            </h2>

            {/* Toggle */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255, 255, 255, 0.8)", border: "1px solid rgba(255, 255, 255, 0.95)",
              padding: "4px", borderRadius: 24
            }}>
              <button 
                onClick={() => setBillingCycle("monthly")}
                style={{
                  padding: "6px 16px", borderRadius: 20, border: "none",
                  background: billingCycle === "monthly" ? "linear-gradient(135deg, #F43F8E, #A855F7)" : "transparent",
                  color: billingCycle === "monthly" ? "white" : "#64748B",
                  fontSize: 12, fontWeight: 800, cursor: "pointer"
                }}
              >Monthly</button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                style={{
                  padding: "6px 16px", borderRadius: 20, border: "none",
                  background: billingCycle === "yearly" ? "linear-gradient(135deg, #F43F8E, #A855F7)" : "transparent",
                  color: billingCycle === "yearly" ? "white" : "#64748B",
                  fontSize: 12, fontWeight: 800, cursor: "pointer"
                }}
              >Yearly (Save 20%)</button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: 20, alignItems: "stretch" }}>
            
            {/* Reader / Free */}
            <div style={{
              background: "rgba(255, 255, 255, 0.8)", borderRadius: 24, padding: "24px 20px",
              border: "1px solid rgba(255, 255, 255, 0.95)", display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#64748B" }}>Reader</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#1E1B4B", margin: "6px 0 2px" }}>Free</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 18 }}>$0 / month</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "#475569" }}>
                  <div>✓ Read thousands of episodes</div>
                  <div>✓ Daily free episodes</div>
                  <div>✓ Vote in community choices</div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/browse')}
                style={{
                  width: "100%", padding: "10px", borderRadius: 16, border: "1px solid rgba(244, 63, 142, 0.4)",
                  background: "white", color: "#F43F8E", fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 24
                }}
              >Get Started</button>
            </div>

            {/* Fan (Most Popular) */}
            <div style={{
              background: "rgba(255, 255, 255, 0.95)", borderRadius: 24, padding: "24px 20px",
              border: "2px solid #F43F8E", display: "flex", flexDirection: "column", justifyContent: "space-between",
              position: "relative", boxShadow: "0 12px 30px rgba(244, 63, 142, 0.2)"
            }}>
              <span style={{
                position: "absolute", top: -12, right: 20,
                background: "linear-gradient(135deg, #F43F8E, #A855F7)", color: "white",
                fontSize: 9, fontWeight: 900, padding: "4px 12px", borderRadius: 10
              }}>Most Popular</span>

              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#F43F8E" }}>Fan</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#1E1B4B", margin: "6px 0 2px" }}>$4.99 <span style={{ fontSize: 13, color: "#64748B" }}>/ month</span></div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 18 }}>Billed yearly</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "#475569" }}>
                  <div>✓ Early access to new episodes</div>
                  <div>✓ Ad-free reading</div>
                  <div>✓ Premium badges & profile</div>
                  <div>✓ 100 Vault bookmarks</div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/info/pricing')}
                style={{
                  width: "100%", padding: "11px", borderRadius: 16, border: "none",
                  background: "linear-gradient(135deg, #F43F8E, #A855F7)", color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 24,
                  boxShadow: "0 4px 14px rgba(244, 63, 142, 0.4)"
                }}
              >Start Free Trial</button>
            </div>

            {/* Creator */}
            <div style={{
              background: "rgba(255, 255, 255, 0.8)", borderRadius: 24, padding: "24px 20px",
              border: "1px solid rgba(255, 255, 255, 0.95)", display: "flex", flexDirection: "column", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#7E22CE" }}>Creator</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#1E1B4B", margin: "6px 0 2px" }}>$9.99 <span style={{ fontSize: 13, color: "#64748B" }}>/ month</span></div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 18 }}>Billed yearly</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12, color: "#475569" }}>
                  <div>✓ AI panel generation credits</div>
                  <div>✓ Advanced analytics</div>
                  <div>✓ Custom story branding</div>
                  <div>✓ Priority support</div>
                </div>
              </div>

              <button 
                onClick={() => navigate('/info/pricing')}
                style={{
                  width: "100%", padding: "10px", borderRadius: 16, border: "1px solid rgba(168, 85, 247, 0.4)",
                  background: "white", color: "#7E22CE", fontSize: 13, fontWeight: 800, cursor: "pointer", marginTop: 24
                }}
              >Start Free Trial</button>
            </div>

            {/* Compare Plans Table + Chibi Mascot */}
            <div style={{
              background: "rgba(255, 255, 255, 0.75)", borderRadius: 24, padding: "20px",
              border: "1px solid rgba(255, 255, 255, 0.95)", position: "relative"
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#1E1B4B", marginBottom: 14 }}>Compare plans</div>
              
              <div style={{ fontSize: 11, color: "#475569", display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { feature: "Read Episodes", free: "✓", fan: "✓", creator: "✓" },
                  { feature: "Daily Free Episodes", free: "✓", fan: "✓", creator: "✓" },
                  { feature: "Ad-Free Experience", free: "✓", fan: "✓", creator: "✓" },
                  { feature: "Vault Bookmarks", free: "✕", fan: "✓", creator: "✓" },
                  { feature: "AI Panel Generation", free: "✕", fan: "✓", creator: "✓" },
                  { feature: "Creator Analytics", free: "✕", fan: "✓", creator: "✓" },
                  { feature: "Priority Support", free: "✕", fan: "✕", creator: "✓" },
                ].map((row, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{row.feature}</span>
                    <div style={{ display: "flex", gap: 14, fontWeight: 800 }}>
                      <span style={{ color: row.free === "✓" ? "#10B981" : "#EF4444" }}>{row.free}</span>
                      <span style={{ color: row.fan === "✓" ? "#10B981" : "#EF4444" }}>{row.fan}</span>
                      <span style={{ color: row.creator === "✓" ? "#10B981" : "#EF4444" }}>{row.creator}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chibi Mascot Image */}
              <img src="/chibi_princess.png" alt="Mascot" style={{
                position: "absolute", bottom: 6, right: 6, height: 110, width: "auto", objectFit: "contain", pointerEvents: "none"
              }} />
            </div>

          </div>

        </div>
      </div>

      {/* ═══ 7. TESTIMONIALS SECTION ("Loved by Readers & Creators") ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <SectionHeader title="Loved by Readers & Creators" viewAll={true} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { name: "LunaReads", role: "Verified Reader", quote: "Every choice feels meaningful. The art is stunning and the stories keep me coming back!", avatar: "👩‍🦰" },
            { name: "StoryWeaver", role: "Creator", quote: "ToonVault's tools make creating branching stories so fun and easy. My readers love it!", avatar: "👨‍🎨" },
            { name: "MysticMira", role: "Verified Reader", quote: "The community vibes are amazing. I love seeing how different choices change everything!", avatar: "👩‍🎤" },
            { name: "InkDreamer", role: "Creator", quote: "Analytics + AI panel art = game changer for creators. Highly recommend!", avatar: "👨‍💻" },
          ].map((t, i) => (
            <div key={i} className="glass-card" style={{ borderRadius: 22, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(244, 63, 142, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "#1E1B4B" }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600 }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "#F59E0B", fontSize: 11 }}>⭐⭐⭐⭐⭐</div>
              </div>
              <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                "{t.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 8. BOTTOM HERO CTA BANNER ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <div style={{
          borderRadius: 32, padding: "40px 48px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 240, 245, 0.85) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 20px 50px rgba(190, 140, 220, 0.22)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
          <img src="/bottom_romance_couple.png" alt="" style={{
            position: "absolute", right: 0, bottom: 0, height: "100%", width: "auto", objectFit: "cover", pointerEvents: "none"
          }} />
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "#1E1B4B", margin: "0 0 8px", lineHeight: 1.1 }}>
              Your story adventure awaits.
            </h2>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 24px", fontWeight: 500 }}>
              Read, choose, create, and unlock endless worlds.
            </p>

            <div style={{ display: "flex", gap: 14 }}>
              <button 
                onClick={() => navigate('/browse')}
                style={{
                  padding: "13px 28px", borderRadius: 30, border: "none",
                  background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                  color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(244, 63, 142, 0.4)"
                }}
              >Start Reading Now</button>
              <button 
                onClick={() => navigate('/user?intent=create')}
                style={{
                  padding: "13px 24px", borderRadius: 30,
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(244, 63, 142, 0.35)",
                  color: "#475569", fontSize: 14, fontWeight: 700, cursor: "pointer"
                }}
              >Join as Creator</button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 9. COMPLETE MODERN FOOTER ═══ */}
      <footer style={{ maxWidth: 1340, margin: "40px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{ borderRadius: 32, padding: "40px 48px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1.5fr", gap: 24, marginBottom: 36 }}>
            
            {/* Col 1: Logo & Slogan */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: "linear-gradient(135deg, #F43F8E, #A855F7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "white"
                }}>📖</div>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B" }}>Toon<span style={{ color: "#F43F8E" }}>Vault</span></span>
              </div>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, margin: 0 }}>
                Stories you choose.<br />Worlds you unlock.
              </p>
            </div>

            {/* Col 2: Explore */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Explore</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Originals</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Rankings</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Browse</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Canvas</span>
              </div>
            </div>

            {/* Col 3: For Readers */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>For Readers</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>How It Works</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Community</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>FAQ</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/browse')}>Gift Cards</span>
              </div>
            </div>

            {/* Col 4: For Creators */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>For Creators</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/user')}>Create on ToonVault</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/user')}>Creator Resources</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/user')}>Blog</span>
                <span style={{ cursor: "pointer" }} onClick={() => navigate('/user')}>Success Stories</span>
              </div>
            </div>

            {/* Col 5: Company */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 11, color: "#64748B" }}>
                <span style={{ cursor: "pointer" }}>About Us</span>
                <span style={{ cursor: "pointer" }}>Careers</span>
                <span style={{ cursor: "pointer" }}>Contact</span>
                <span style={{ cursor: "pointer" }}>Press Kit</span>
              </div>
            </div>

            {/* Col 6: Stay Connected & Newsletter */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", marginBottom: 12 }}>Stay connected</div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14, fontSize: 16 }}>
                <span>👾</span> <span>📸</span> <span>🐦</span> <span>▶️</span> <span>🎵</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255, 255, 255, 0.9)", border: "1px solid rgba(244, 63, 142, 0.3)",
                borderRadius: 20, padding: "4px 6px 4px 12px"
              }}>
                <input 
                  type="email" placeholder="Enter your email" 
                  style={{ border: "none", background: "none", outline: "none", fontSize: 11, color: "#1E1B4B", width: "100%" }} 
                />
                <button style={{
                  width: 28, height: 28, borderRadius: "50%", border: "none",
                  background: "linear-gradient(135deg, #F43F8E, #A855F7)", color: "white",
                  cursor: "pointer", fontSize: 12
                }}>➔</button>
              </div>
            </div>

          </div>

          {/* Bottom copyright bar */}
          <div style={{
            borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 20,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            fontSize: 11, color: "#94A3B8"
          }}>
            <div>© 2025 ToonVault. All rights reserved.</div>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ cursor: "pointer" }}>Terms of Service</span>
              <span style={{ cursor: "pointer" }}>Privacy Policy</span>
              <span style={{ cursor: "pointer" }}>Community Guidelines</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
