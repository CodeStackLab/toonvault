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
  const [pwaPrompt, setPwaPrompt] = useState(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGenModal, setShowGenModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState("");
  const [genGenre, setGenGenre] = useState("Romance");
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [generatedEp, setGeneratedEp] = useState(null);

  const searchRef = useRef(null);
  const genreScrollRef = useRef(null);

  const scrollGenres = (dir) => {
    genreScrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const handleGenerateSingleEpisode = async () => {
    if (!genPrompt.trim()) return;
    setIsGenerating(true);
    setGenProgress(15);
    setGenStatus("✨ Analyzing storyline & prompt...");

    const steps = [
      { p: 35, msg: "🎨 Generating Episode Panel Art with AI..." },
      { p: 65, msg: "✍️ Writing interactive dialogues & choices..." },
      { p: 90, msg: "🔥 Finalizing choices A & B branching..." },
      { p: 100, msg: "🎉 Single Episode successfully generated!" }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setGenProgress(steps[i].p);
      setGenStatus(steps[i].msg);
    }

    const newEp = {
      id: "gen_" + Date.now(),
      title: genPrompt.length > 32 ? genPrompt.substring(0, 32) + "..." : genPrompt,
      genre: genGenre,
      episodeNumber: 1,
      cover: "/into_starfall.png",
      panels: ["/into_starfall.png", "/seraphina_crown.png", "/trust_the_stranger.png"],
      content: [
        { speaker: "Narration", text: `The story of "${genPrompt}" begins as destiny opens the vault.` },
        { speaker: "Protagonist", text: "I never thought my choice would lead to this moment..." },
        { speaker: "Companion", text: "The future is ours to shape!" }
      ],
      choices: [
        { text: "Unleash the secret power", votes: 120 },
        { text: "Seek alliance with the Oracle", votes: 95 }
      ]
    };

    setGeneratedEp(newEp);
    setIsGenerating(false);
  };

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPwaPrompt(e);
      // Show banner after 3 seconds if not dismissed
      setTimeout(() => setShowPwaBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setPwaInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = async () => {
    if (!pwaPrompt) return;
    pwaPrompt.prompt();
    const { outcome } = await pwaPrompt.userChoice;
    if (outcome === 'accepted') setPwaInstalled(true);
    setPwaPrompt(null);
    setShowPwaBanner(false);
  };

  useEffect(() => {
    // Fetch live stories from backend API
    axios.get('/api/stories')
      .then(res => {
        let mapped = [];
        if (Array.isArray(res.data) && res.data.length > 0) {
          mapped = res.data.map(s => {
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
        }

        // Fetch AI generated story if available
        axios.get('/ai_generated_story.json')
          .then(aiRes => {
            if (aiRes.data && aiRes.data.title) {
              const aiStory = {
                ...aiRes.data,
                id: "the-crowns-secret-vow",
                _id: "the-crowns-secret-vow",
                rating: "4.9",
                isNew: true
              };
              setLiveStories([aiStory, ...mapped]);
            } else {
              setLiveStories(mapped);
            }
          })
          .catch(() => setLiveStories(mapped));
      })
      .catch(err => {
        axios.get('/ai_generated_story.json')
          .then(aiRes => {
            if (aiRes.data && aiRes.data.title) {
              setLiveStories([{ ...aiRes.data, id: aiRes.data._id || "ai_real_story", rating: "4.9", isNew: true }]);
            }
          })
          .catch(e => console.error("Error fetching stories:", err));
      });
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
    setGenPrompt(aiPrompt || "The Forgotten Heir of Solaria");
    setGeneratedEp(null);
    setShowGenModal(true);
  };

  const trendingList = liveStories.length > 0 
    ? liveStories.slice(0, 6)
    : TRENDING_MOCK;

  return (
    <div className="tv-main-content" style={{ 
      fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif", 
      background: "url('/cloud_bg.png') center/cover no-repeat fixed, linear-gradient(180deg, #FDE8E8 0%, #F5D0FE 50%, #E0E7FF 100%)", 
      minHeight: "100vh", 
      color: "#1E1B4B",
      paddingBottom: 60,
      overflowX: "hidden",
      width: "100%"
    }}>
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

        .hero-layout {
          display: grid;
          grid-template-columns: 1.15fr 270px 1fr;
          gap: 28px;
          align-items: center;
        }

        /* ─── Hamburger & Mobile Drawer ─── */
        .tv-hamburger {
          display: none;
          background: rgba(255,255,255,0.95);
          border: 1.5px solid rgba(244, 63, 142, 0.2);
          border-radius: 12px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-direction: column;
          gap: 5px;
          padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }
        .tv-hamburger span {
          display: block;
          width: 18px;
          height: 2px;
          background: #1E1B4B;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .tv-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .tv-hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
        .tv-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile Drawer Menu */
        .tv-mobile-drawer {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 8000;
        }
        .tv-mobile-drawer.open { display: block; }
        .tv-drawer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(30, 27, 75, 0.3);
          backdrop-filter: blur(4px);
        }
        .tv-drawer-panel {
          position: absolute;
          top: 0; left: 0; right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(244, 63, 142, 0.12);
          border-radius: 0 0 28px 28px;
          padding: 16px 20px 24px;
          box-shadow: 0 20px 50px rgba(190, 140, 220, 0.3);
          animation: drawerSlideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes drawerSlideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .tv-drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 15px;
          font-weight: 700;
          color: #1E1B4B;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          transition: background 0.2s;
        }
        .tv-drawer-nav-item:active { background: rgba(244,63,142,0.08); }

        /* Search bar on mobile — show as icon only */
        .tv-search-mobile-btn {
          display: none;
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          border: 1.5px solid rgba(244,63,142,0.2);
          align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }

        /* PWA Install Banner */
        .pwa-install-banner {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          border: 1.5px solid rgba(244, 63, 142, 0.25);
          border-radius: 24px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 16px 40px rgba(244, 63, 142, 0.2), 0 4px 16px rgba(0,0,0,0.08);
          animation: slideUpBanner 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          min-width: 300px;
          max-width: calc(100vw - 32px);
        }
        @keyframes slideUpBanner {
          from { transform: translateX(-50%) translateY(120px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }

        /* Mobile Bottom Nav */
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 500;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(244, 63, 142, 0.12);
          box-shadow: 0 -8px 30px rgba(190, 140, 220, 0.2);
          padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
        }
        .mobile-bottom-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 16px;
        }
        .mobile-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 6px 14px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 14px;
          transition: all 0.2s;
          min-width: 56px;
        }
        .mobile-nav-btn:active { transform: scale(0.92); }
        .mobile-nav-icon { font-size: 20px; line-height: 1; }
        .mobile-nav-label { font-size: 9px; font-weight: 700; color: #64748B; font-family: 'Outfit', sans-serif; }
        .mobile-nav-btn.active .mobile-nav-label { color: #F43F8E; }
        .mobile-nav-btn.active .mobile-nav-icon { filter: drop-shadow(0 2px 6px rgba(244,63,142,0.4)); }

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
            display: none !important;
          }
          .tv-hamburger {
            display: flex;
          }
          .tv-search-mobile-btn {
            display: flex;
          }
          /* Hide login/signup in main nav on mobile */
          .tv-auth-buttons {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .hero-layout {
            grid-template-columns: 1fr;
            gap: 18px;
          }
          .desktop-only {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: block;
          }
          .tv-main-content {
            padding-bottom: 80px !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
          .feature-2col {
            grid-template-columns: 1fr !important;
          }
          .promo-grid {
            grid-template-columns: 1fr !important;
          }
          /* Stack genre pills bar scroll area */
          .tv-genre-bar {
            padding: 0 12px !important;
          }
          /* Hero section padding */
          .tv-hero-wrap {
            padding: 16px 12px !important;
          }
          .tv-hero-card {
            padding: 20px 16px !important;
            border-radius: 24px !important;
          }
          /* Sections padding */
          .tv-section-wrap {
            padding: 0 12px !important;
          }
        }

        @media (max-width: 480px) {
          .tv-pill-nav {
            padding: 8px 12px !important;
            border-radius: 20px !important;
          }
          .tv-logo-img { height: 34px !important; }
          .hero-h1 { font-size: 30px !important; }
          .hero-feature-pills {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* Scrollbar hide utility */
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { scrollbar-width: none; ms-overflow-style: none; }

        /* Touch scroll for cards */
        .tv-cards-row {
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
        }
        .tv-cards-row > * {
          scroll-snap-align: start;
        }
      `}</style>

      {/* ═══ 1. TOP FLOATING PILL NAV ═══ */}
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "16px 20px 0" }}>
        <nav className="glass-card tv-pill-nav" style={{
          borderRadius: 40,
          padding: "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          boxShadow: "0 10px 30px rgba(220, 170, 230, 0.25)"
        }}>
          {/* Brand Logo (Official 3D Logo) */}
          <div 
            style={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }} 
            onClick={() => navigate("/")}
          >
            <img src="/toonvault_logo_full.png" alt="ToonVault" className="tv-logo-img" style={{ height: 44, width: "auto" }} />
          </div>

          {/* Nav Links — desktop only */}
          <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: 24, flexShrink: 0 }}>
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
                  transition: "all 0.2s", whiteSpace: "nowrap", padding: 0
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#F43F8E"}
                onMouseLeave={e => e.currentTarget.style.color = "#1E1B4B"}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right side: search + auth — desktop only */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {/* Desktop Search */}
            <div ref={searchRef} style={{ position: "relative" }} className="desktop-search-bar">
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                borderRadius: 24, padding: "7px 16px", width: 190,
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                transition: "all 0.2s ease"
              }}>
                <span style={{ fontSize: 13, color: "#94A3B8" }}>🔍</span>
                <input 
                  type="text"
                  placeholder="Search webtoons, genres..."
                  value={searchVal}
                  onChange={e => { setSearchVal(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  style={{
                    border: "none", background: "none", outline: "none",
                    fontSize: 12, color: "#1E1B4B", width: "100%", fontWeight: 600
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

            {/* Desktop Login & Sign Up */}
            <div className="tv-auth-buttons" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button 
                onClick={() => navigate('/user')}
                style={{
                  padding: "8px 20px", borderRadius: 24,
                  border: "1.5px solid rgba(244, 63, 142, 0.35)",
                  background: "rgba(255, 255, 255, 0.95)",
                  color: "#1E1B4B", fontSize: 13, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)", whiteSpace: "nowrap"
                }}
              >Log in</button>
              <button 
                onClick={() => navigate('/user?mode=signup')}
                style={{
                  padding: "8px 22px", borderRadius: 24, border: "none",
                  background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                  color: "white", fontSize: 13, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(244, 63, 142, 0.4)", whiteSpace: "nowrap"
                }}
              >Sign up</button>
            </div>

            {/* Mobile: Hamburger Button */}
            <button 
              className={`tv-hamburger ${mobileMenuOpen ? "open" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>

      {/* ═══ MOBILE DRAWER MENU ═══ */}
      <div className={`tv-mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="tv-drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="tv-drawer-panel">
          {/* Drawer Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <img src="/toonvault_logo_full.png" alt="ToonVault" style={{ height: 36, width: "auto" }} />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: "rgba(0,0,0,0.04)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", fontSize: 18, color: "#1E1B4B" }}
            >✕</button>
          </div>

          {/* Search in drawer */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(244, 63, 142, 0.06)",
            border: "1.5px solid rgba(244, 63, 142, 0.15)",
            borderRadius: 18, padding: "10px 16px", marginBottom: 12
          }}>
            <span style={{ fontSize: 15 }}>🔍</span>
            <input 
              type="text"
              placeholder="Search stories, genres..."
              value={searchVal}
              onChange={e => { setSearchVal(e.target.value); }}
              onKeyDown={e => { if (e.key === "Enter" && searchVal.trim()) { navigate(`/browse?q=${encodeURIComponent(searchVal)}`); setMobileMenuOpen(false); }}}
              style={{ border: "none", background: "none", outline: "none", fontSize: 14, color: "#1E1B4B", width: "100%", fontWeight: 600 }}
            />
          </div>

          {/* Nav Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
            {[
              { label: "🔥 Originals", path: "/browse" },
              { label: "🏆 Rankings", path: "/browse" },
              { label: "🎨 Canvas", path: "/browse" },
              { label: "📚 Browse All", path: "/browse" },
              { label: "💎 Pricing", path: "/info/pricing" },
            ].map(item => (
              <button 
                key={item.label}
                className="tv-drawer-nav-item"
                onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button 
              onClick={() => { navigate('/user'); setMobileMenuOpen(false); }}
              style={{
                padding: "12px", borderRadius: 18,
                border: "1.5px solid rgba(244, 63, 142, 0.35)",
                background: "white", color: "#1E1B4B",
                fontSize: 14, fontWeight: 800, cursor: "pointer"
              }}
            >Log in</button>
            <button 
              onClick={() => { navigate('/user?mode=signup'); setMobileMenuOpen(false); }}
              style={{
                padding: "12px", borderRadius: 18, border: "none",
                background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(244, 63, 142, 0.35)"
              }}
            >Sign up</button>
          </div>
        </div>
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
                    padding: "8px 20px",
                    borderRadius: 24,
                    background: isActive ? "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)" : "rgba(255, 255, 255, 0.92)",
                    color: isActive ? "white" : "#1E1B4B",
                    fontSize: 13,
                    fontWeight: isActive ? 900 : 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    border: isActive ? "none" : "1px solid rgba(255, 255, 255, 0.95)",
                    boxShadow: isActive ? "0 4px 16px rgba(244, 63, 142, 0.4)" : "0 2px 8px rgba(0,0,0,0.03)",
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
      <div style={{ maxWidth: 1340, margin: "18px auto 0", padding: "0 20px" }} className="tv-section-wrap">
        <div className="tv-hero-card" style={{
          borderRadius: 36,
          padding: "30px 36px",
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
                background: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(244, 63, 142, 0.35)",
                padding: "5px 14px", borderRadius: 20, marginBottom: 14,
                boxShadow: "0 2px 10px rgba(244, 63, 142, 0.15)"
              }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#7E22CE", letterSpacing: 0.8, textTransform: "uppercase" }}>
                  ✨ AI INTERACTIVE WEBTOON STUDIO
                </span>
              </div>

              <h1 style={{
                fontSize: 48, fontWeight: 900, color: "#1E1B4B",
                lineHeight: 1.05, letterSpacing: "-1.5px", margin: "0 0 12px"
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
                fontSize: 14, color: "#475569", lineHeight: 1.5,
                margin: "0 0 16px", maxWidth: 460, fontWeight: 500
              }}>
                Read interactive webtoons shaped by your decisions. Your votes branch the story, unlock new paths, and reveal unforgettable endings.
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate('/story/the-crowns-secret-vow')}
                  style={{
                    padding: "12px 26px", borderRadius: 30, border: "none",
                    background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                    color: "white", fontSize: 14, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(244, 63, 142, 0.4)", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span>▶</span> Start Reading
                </button>

                <button
                  onClick={handlePromptSubmit}
                  style={{
                    padding: "12px 22px", borderRadius: 30,
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid rgba(244, 63, 142, 0.35)",
                    color: "#475569", fontSize: 14, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span>✨</span> Prompt a Story
                </button>
              </div>

              {/* Stats Bar */}
              <div style={{
                background: "rgba(255, 255, 255, 0.75)",
                borderRadius: 18, border: "1px solid rgba(255, 255, 255, 0.95)",
                padding: "10px 18px", display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 10, flexWrap: "wrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)"
              }}>
                {[
                  { num: "10K+", label: "Active Readers" },
                  { num: "500+", label: "Original Webtoons" },
                  { num: "50+", label: "Creators" },
                  { num: "100+", label: "Genres" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 17, fontWeight: 900, color: "#F43F8E" }}>{s.num}</div>
                    <div style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: "#F43F8E", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 4 }}>
                <span>💖</span> Create stories readers love & earn ToonCoins & rewards.
              </div>

              {/* 4 Feature pills in 1 horizontal row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {[
                  { icon: "/step_icon_choose.png", title: "Choose", sub: "next scene" },
                  { icon: "/step_icon_follow.png", title: "Follow", sub: "storylines" },
                  { icon: "/step_icon_ai.png", title: "Instant AI", sub: "panel art" },
                  { icon: "/step_icon_vault.png", title: "Vault", sub: "bookmarks" },
                ].map((f, i) => (
                  <div key={i} style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 14, padding: "8px 10px", border: "1px solid rgba(255, 255, 255, 0.95)",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                  }}>
                    <img src={f.icon} alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: "#1E1B4B", lineHeight: 1.1 }}>{f.title}</div>
                      <div style={{ fontSize: 9, color: "#64748B", fontWeight: 500 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN: FEATURED STORY COVER (ENLARGED) */}
            <div className="hero-center-col" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div 
                onClick={() => navigate(`/story/${featured?.id || 'the-crowns-secret-vow'}`)}
                style={{
                  width: 270, height: 380, borderRadius: 26, overflow: "hidden",
                  position: "relative", cursor: "pointer",
                  boxShadow: "0 20px 50px rgba(180, 120, 210, 0.4)",
                  border: "2.5px solid rgba(255, 255, 255, 0.95)",
                  transition: "transform 0.3s"
                }}
              >
                <img src={DEFAULT_COVER} alt="Trust the Stranger" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(8px)",
                  padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 900,
                  color: "#1E1B4B", display: "flex", alignItems: "center", gap: 4
                }}>
                  <span style={{ color: "#F59E0B" }}>⭐</span> 4.8
                </div>

                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "16px 14px 14px",
                  background: "linear-gradient(to top, rgba(30, 27, 75, 0.92) 20%, transparent)",
                  color: "white"
                }}>
                  <span style={{
                    background: "linear-gradient(135deg, #A855F7, #F43F8E)",
                    fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 6,
                    letterSpacing: 0.5, textTransform: "uppercase", display: "inline-block", marginBottom: 4
                  }}>AI POWERED</span>
                  <div style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}>Trust the Stranger</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>Episode 12 • Romance, Mystery</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                {[0, 1, 2, 3, 4].map(idx => (
                  <div 
                    key={idx} 
                    onClick={() => setHeroIndex(idx)}
                    style={{
                      width: idx === (heroIndex % 5) ? 22 : 6, height: 6, borderRadius: 3,
                      background: idx === (heroIndex % 5) ? "linear-gradient(135deg, #F43F8E, #A855F7)": "rgba(255, 255, 255, 0.85)",
                      cursor: "pointer", transition: "all 0.3s"
                    }} 
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: COMMUNITY CHOICES POLL */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 900, color: "#7E22CE", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>
                WHERE WILL YOU TAKE THE STORY?
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
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
                        background: isSelected ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.88)",
                        borderRadius: 16, padding: "10px 14px",
                        border: isSelected ? `2px solid ${opt.color}` : "1px solid rgba(255, 255, 255, 0.95)",
                        cursor: "pointer", position: "relative", overflow: "hidden",
                        boxShadow: isSelected ? `0 4px 14px ${opt.color}35` : "0 2px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      {opt.isTop && (
                        <span style={{
                          position: "absolute", top: 8, right: 10,
                          background: "#FBBF24", color: "#78350F",
                          fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 6
                        }}>TOP CHOICE</span>
                      )}

                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 8, background: opt.color,
                          color: "white", fontWeight: 900, fontSize: 12,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}>{opt.key}</div>
                        <div style={{ flex: 1, paddingRight: opt.isTop ? 60 : 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 900, color: "#1E1B4B" }}>{opt.title}</div>
                          <div style={{ fontSize: 10, color: "#64748B", margin: "2px 0 5px", fontWeight: 500 }}>{opt.desc}</div>
                          
                          <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <div style={{ width: `${votesPercent}%`, height: "100%", background: opt.color, borderRadius: 3 }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 900, color: opt.color, alignSelf: "flex-end" }}>{votesPercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Option D */}
              <div style={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: 16, padding: "10px 14px",
                border: "1.5px dashed #A855F7",
                boxShadow: "0 4px 14px rgba(168, 85, 247, 0.15)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 8, background: "#A855F7",
                    color: "white", fontWeight: 900, fontSize: 12,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>D</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#1E1B4B" }}>Write Your Own Twist</div>
                    <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Prompt any plot twist & AI generates the next scene.</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
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
                        background: "rgba(168, 85, 247, 0.12)", border: "1px solid rgba(168, 85, 247, 0.25)",
                        padding: "3px 8px", borderRadius: 8, cursor: "pointer"
                      }}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    type="text"
                    placeholder="e.g. The protagonist reveals a hidden power..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handlePromptSubmit(); }}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 12,
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      background: "white", fontSize: 11, color: "#1E1B4B", outline: "none", fontWeight: 600
                    }}
                  />
                  <button
                    onClick={handlePromptSubmit}
                    style={{
                      background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                      color: "white", border: "none", borderRadius: 12,
                      width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, cursor: "pointer", boxShadow: "0 4px 12px rgba(244, 63, 142, 0.4)"
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
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.35fr", gap: 20 }}>
          
          {/* Left Block: How ToonVault Works */}
          <div className="glass-card" style={{
            borderRadius: 28, padding: "24px 26px",
            background: "linear-gradient(135deg, #FDE2E8 0%, #F3DDF5 60%, #E7DDFE 100%)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 10px 30px rgba(220, 160, 220, 0.15)"
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#1E1B4B", margin: "0 0 16px" }}>
              How <span style={{ color: "#F43F8E" }}>ToonVault</span> Works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { step: "1. Choose", desc: "Pick what happens next.", icon: "/step_icon_choose.png" },
                { step: "2. Follow", desc: "Explore different story branches.", icon: "/step_icon_follow.png" },
                { step: "3. Instant AI", desc: "Watch stunning panel art unfold.", icon: "/step_icon_ai.png" },
                { step: "4. Vault", desc: "Save your favorites and never lose track.", icon: "/step_icon_vault.png" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.95)",
                  borderRadius: 18, padding: "14px 8px", textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                }}>
                  <img src={item.icon} alt="" style={{ height: 44, width: "auto", margin: "0 auto 8px", display: "block" }} />
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#1E1B4B", marginBottom: 3 }}>{item.step}</div>
                  <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500, lineHeight: 1.3 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block: Create Your Own Story (Seamless Gradient Blend & Full-Opacity Image) */}
          <div className="glass-card" style={{
            borderRadius: 28, padding: "24px 28px",
            background: "linear-gradient(135deg, #FDE2E8 0%, #F3DDF5 50%, #E7DDFE 100%)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between",
            boxShadow: "0 10px 30px rgba(220, 160, 220, 0.15)"
          }}>
            {/* Raw Anime Girl Illustration with Soft Faded Left Edge */}
            <img src="/creator_anime_girl.png" alt="" style={{
              position: "absolute", right: 0, top: 0, bottom: 0, height: "100%", width: "auto", objectFit: "cover", pointerEvents: "none", opacity: 1,
              WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)"
            }} />

            <div style={{ position: "relative", zIndex: 2 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1E1B4B", margin: "0 0 3px" }}>Create Your Own Story</h2>
              <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px", fontWeight: 600 }}>Built for creators. Loved by fans.</p>

              {/* 4 Feature Pills in 1 Horizontal Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, maxWidth: 520 }}>
                {[
                  { title: "AI Story Studio", sub: "Generate plot ideas & scenes", icon: "⚡" },
                  { title: "Branching Engine", sub: "Create choices & multiple endings", icon: "🔀" },
                  { title: "Creator Analytics", sub: "Track readers, choices & drops", icon: "📊" },
                  { title: "Global Audience", sub: "Reach readers around the world", icon: "🌐" },
                ].map((p, i) => (
                  <div key={i} style={{
                    background: "rgba(255, 255, 255, 0.92)", borderRadius: 14, padding: "8px 10px",
                    border: "1px solid rgba(255, 255, 255, 0.95)", display: "flex", flexDirection: "column", gap: 3,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                  }}>
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#1E1B4B", lineHeight: 1.2 }}>{p.title}</div>
                      <div style={{ fontSize: 8, color: "#64748B", marginTop: 2, lineHeight: 1.2 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 18, position: "relative", zIndex: 2 }}>
              <button 
                onClick={() => navigate('/user?intent=create')}
                style={{
                  padding: "11px 24px", borderRadius: 30, border: "none",
                  background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                  color: "white", fontSize: 12, fontWeight: 800, cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(244, 63, 142, 0.35)"
                }}
              >Start Creating Now</button>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ 6. SIMPLE PRICING SECTION ═══ */}
      <div style={{ maxWidth: 1340, margin: "36px auto 0", padding: "0 20px" }}>
        <div className="glass-card" style={{ borderRadius: 28, padding: "32px 36px" }}>
          
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
                position: "absolute", bottom: 0, right: -10, height: 120, width: "auto", objectFit: "contain", pointerEvents: "none"
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
            { name: "LunaReads", role: "Verified Reader", quote: "Every choice feels meaningful. The art is stunning and the stories keep me coming back!", avatar: "/avatars/avatar_lunareads.png" },
            { name: "StoryWeaver", role: "Creator", quote: "ToonVault's tools make creating branching stories so fun and easy. My readers love it!", avatar: "/avatars/avatar_storyweaver.png" },
            { name: "MysticMira", role: "Verified Reader", quote: "The community vibes are amazing. I love seeing how different choices change everything!", avatar: "/avatars/avatar_mysticmira.png" },
            { name: "InkDreamer", role: "Creator", quote: "Analytics + AI panel art = game changer for creators. Highly recommend!", avatar: "/avatars/avatar_inkdreamer.png" },
          ].map((t, i) => (
            <div key={i} className="glass-card" style={{ borderRadius: 22, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  style={{ 
                    width: 44, height: 44, borderRadius: "50%", objectFit: "cover", 
                    boxShadow: "0 4px 12px rgba(244, 63, 142, 0.25)", border: "2px solid white" 
                  }} 
                />
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
          background: "linear-gradient(135deg, #FDE2E8 0%, #F3DDF5 50%, #E7DDFE 100%)",
          border: "1.5px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 20px 50px rgba(190, 140, 220, 0.22)",
          position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          minHeight: 180
        }}>
          {/* 100% Full Opacity Vibrant Romance Couple Illustration with Soft Faded Left Edge */}
          <img src="/romance_couple.png" alt="" style={{
            position: "absolute", right: 0, top: 0, bottom: 0, height: "100%", width: "auto", objectFit: "cover", pointerEvents: "none", opacity: 1,
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)",
            maskImage: "linear-gradient(to left, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)"
          }} />

          {/* Left Text & Interactive Real Buttons */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: 520 }}>
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
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(244, 63, 142, 0.35)",
                  color: "#475569", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
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
              <div style={{ marginBottom: 12 }}>
                <img src="/toonvault_logo_full.png" alt="ToonVault" style={{ height: 38, width: "auto" }} />
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

      {/* ─── PWA Install Banner ─── */}
      {showPwaBanner && !pwaInstalled && (
        <div className="pwa-install-banner">
          <img src="/toonvault_icon.png" alt="ToonVault" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#1E1B4B" }}>Install ToonVault App</div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500, marginTop: 2 }}>Read stories offline, anytime 📖</div>
          </div>
          <button
            onClick={handleInstallPwa}
            style={{
              padding: "8px 18px", borderRadius: 20, border: "none",
              background: "linear-gradient(135deg, #F43F8E, #A855F7)",
              color: "white", fontSize: 12, fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(244, 63, 142, 0.4)", whiteSpace: "nowrap", flexShrink: 0
            }}
          >Install</button>
          <button
            onClick={() => setShowPwaBanner(false)}
            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94A3B8", padding: "0 4px", flexShrink: 0 }}
          >✕</button>
        </div>
      )}

      {/* ─── AI SINGLE EPISODE GENERATOR MODAL ─── */}
      {showGenModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(15, 13, 30, 0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16
        }} onClick={() => setShowGenModal(false)}>
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              background: "rgba(255, 255, 255, 0.96)",
              backdropFilter: "blur(24px)",
              border: "1.5px solid rgba(255, 255, 255, 0.95)",
              borderRadius: 32, padding: "28px 32px",
              maxWidth: 520, width: "100%",
              boxShadow: "0 24px 60px rgba(168, 85, 247, 0.28)",
              position: "relative", animation: "slideUpBanner 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <button 
              onClick={() => setShowGenModal(false)}
              style={{
                position: "absolute", top: 20, right: 20,
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(0,0,0,0.05)", border: "none",
                fontSize: 16, cursor: "pointer", color: "#64748B"
              }}
            >✕</button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 14,
                background: "linear-gradient(135deg, #F43F8E, #A855F7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 20, boxShadow: "0 6px 18px rgba(244, 63, 142, 0.35)"
              }}>⚡</div>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1E1B4B" }}>AI Single Episode Studio</h3>
                <p style={{ margin: 0, fontSize: 12, color: "#64748B", fontWeight: 600 }}>Generate a full webtoon episode in seconds</p>
              </div>
            </div>

            {!generatedEp ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", display: "block", marginBottom: 6 }}>
                    Genre
                  </label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["💖 Romance", "🔮 Fantasy", "⚔️ Action", "🚀 Sci-Fi"].map(g => (
                      <button
                        key={g}
                        onClick={() => setGenGenre(g.split(" ")[1])}
                        style={{
                          padding: "6px 14px", borderRadius: 18,
                          border: genGenre === g.split(" ")[1] ? "none" : "1px solid rgba(0,0,0,0.08)",
                          background: genGenre === g.split(" ")[1] ? "linear-gradient(135deg, #F43F8E, #A855F7)" : "rgba(0,0,0,0.04)",
                          color: genGenre === g.split(" ")[1] ? "white" : "#475569",
                          fontSize: 12, fontWeight: 800, cursor: "pointer"
                        }}
                      >{g}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", display: "block", marginBottom: 6 }}>
                    Episode Idea / Plot Twist Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={genPrompt}
                    onChange={e => setGenPrompt(e.target.value)}
                    placeholder="e.g. The protagonist awakens secret time-manipulation powers during a royal duel..."
                    style={{
                      width: "100%", borderRadius: 18, border: "1.5px solid rgba(168, 85, 247, 0.3)",
                      padding: "12px 16px", outline: "none", fontSize: 13, color: "#1E1B4B",
                      fontFamily: "inherit", fontWeight: 600, background: "rgba(255,255,255,0.9)",
                      resize: "none"
                    }}
                  />
                </div>

                {isGenerating ? (
                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#7E22CE", marginBottom: 8 }}>
                      {genStatus}
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "rgba(168, 85, 247, 0.15)", overflow: "hidden", position: "relative" }}>
                      <div style={{
                        height: "100%", width: `${genProgress}%`,
                        background: "linear-gradient(90deg, #F43F8E, #A855F7)",
                        borderRadius: 4, transition: "width 0.4s ease"
                      }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateSingleEpisode}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 22, border: "none",
                      background: "linear-gradient(135deg, #F43F8E 0%, #A855F7 100%)",
                      color: "white", fontSize: 14, fontWeight: 900, cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(244, 63, 142, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                    }}
                  >
                    <span>✨</span> Generate Single Episode Now
                  </button>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", animation: "slideUpBanner 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                <h4 style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B", margin: "0 0 4px" }}>
                  {generatedEp.title}
                </h4>
                <div style={{ fontSize: 12, color: "#F43F8E", fontWeight: 800, marginBottom: 16 }}>
                  Episode 1 • {generatedEp.genre} • Interactive Choices A & B
                </div>

                <div style={{
                  background: "rgba(244, 63, 142, 0.06)", borderRadius: 18, padding: "14px",
                  border: "1px solid rgba(244, 63, 142, 0.2)", marginBottom: 20, textAlign: "left"
                }}>
                  <div style={{ fontSize: 11, fontWeight: 900, color: "#7E22CE", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
                    Preview Panel Scene
                  </div>
                  <div style={{ fontSize: 13, color: "#1E1B4B", fontWeight: 600 }}>
                    "{generatedEp.content[0].text}"
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setShowGenModal(false);
                      navigate(`/manta/gen_story?ep=1`);
                    }}
                    style={{
                      flex: 1, padding: "13px", borderRadius: 20, border: "none",
                      background: "linear-gradient(135deg, #F43F8E, #A855F7)",
                      color: "white", fontSize: 14, fontWeight: 900, cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(244, 63, 142, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    <span>▶</span> Read Episode 1 Now
                  </button>
                  <button
                    onClick={() => setGeneratedEp(null)}
                    style={{
                      padding: "13px 18px", borderRadius: 20,
                      border: "1px solid rgba(0,0,0,0.1)", background: "white",
                      color: "#475569", fontSize: 13, fontWeight: 800, cursor: "pointer"
                    }}
                  >
                    New Episode
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Mobile Bottom Navigation ─── */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {[
            { icon: "🏠", label: "Home",    action: () => navigate('/') },
            { icon: "🔍", label: "Browse",  action: () => navigate('/browse') },
            { icon: "📚", label: "Library", action: () => navigate('/dashboard') },
            { icon: "👤", label: "Profile", action: () => navigate(isLoggedIn ? '/dashboard' : '/user') },
          ].map((item) => (
            <button
              key={item.label}
              className="mobile-nav-btn"
              onClick={item.action}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}
