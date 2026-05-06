import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Heart, Star, Play, List, Info, Clock, Bookmark, Eye, ThumbsUp, Calendar } from 'lucide-react';
import axios from 'axios';

const COLORS = {
  bg: "#0C0B14",
  card: "#161421",
  accent: "#00E599", // Webtoon green
  plum: "#8B5CF6",
  rose: "#F472B6",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  border: "rgba(255,255,255,0.08)",
};

function SeriesPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMatureWarning, setShowMatureWarning] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`/api/stories/${storyId}`);
        setStory(res.data);
      } catch (err) {
        setStory({
          _id: storyId,
          title: "The Lemon Tree Forest",
          description: "A mysterious forest where lemons grow year-round, and secrets are buried deep beneath the roots. When a young botanist arrives to study the phenomena, she discovers that the forest has a heart of its own.",
          genre: "Romance",
          authorName: "ToonVault AI",
          views: 8900000,
          likes: 245000,
          rating: 9.8,
          status: "Live",
          panels: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
    window.scrollTo(0, 0);
  }, [storyId]);

  if (loading) return <div style={{ background: COLORS.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent }}>Loading...</div>;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ═══ TOP NAV ═══ */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, background: "rgba(12,11,20,0.8)", backdropFilter: "blur(20px)", zIndex: 100, borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between" }}>
        <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><ChevronLeft size={28} /></button>
        <div style={{ fontSize: 16, fontWeight: 800 }}>Series Detail</div>
        <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><Share2 size={22} /></button>
      </div>

      {/* ═══ HERO SECTION (WEBTOON STYLE) ═══ */}
      <div style={{ marginTop: 60, position: "relative", padding: "40px 24px", background: "linear-gradient(to bottom, #1A182E, #0C0B14)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Large Cover */}
          <div style={{ 
            width: 320, height: 440, borderRadius: 12, overflow: "hidden", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)", flexShrink: 0,
            background: "#12101F"
          }}>
            <img src={story.panels?.[0] || story.coverIcon} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 300, paddingTop: 20 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <span style={{ padding: "40px 14px", height: 12, background: "rgba(0, 229, 153, 0.15)", color: COLORS.accent, borderRadius: 4, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", textTransform: "uppercase" }}>{story.genre}</span>
              {story.status === "Live" && <span style={{ padding: "4px 14px", background: "rgba(244, 114, 182, 0.15)", color: COLORS.rose, borderRadius: 4, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", textTransform: "uppercase" }}>UP Every MON</span>}
            </div>
            
            <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12, letterSpacing: -1 }}>{story.title}</h1>
            <div style={{ fontSize: 18, color: COLORS.textMuted, marginBottom: 24, fontWeight: 600 }}>{story.authorName}</div>
            
            {/* Stats Bar */}
            <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 800 }}>
                  <Eye size={18} color={COLORS.accent} /> {(story.views / 1e6).toFixed(1)}M
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Views</div>
              </div>
              <div style={{ width: 1, height: 40, background: COLORS.border }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 800 }}>
                  <ThumbsUp size={18} color={COLORS.rose} /> {(story.likes / 1e3).toFixed(1)}K
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Likes</div>
              </div>
              <div style={{ width: 1, height: 40, background: COLORS.border }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 800 }}>
                  <Star size={18} fill="#FFD700" color="#FFD700" /> {story.rating || "9.9"}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>Grade</div>
              </div>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", marginBottom: 32, maxWidth: 600 }}>
              {story.description}
            </p>

            <div style={{ display: "flex", gap: 12 }}>
              <button 
                onClick={() => navigate(`/manta/${story._id}`)}
                style={{ padding: "16px 40px", borderRadius: 30, background: COLORS.accent, color: "#000", border: "none", fontSize: 16, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
              >
                <Play size={20} fill="currentColor" /> READ FIRST
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: `1px solid ${COLORS.border}`, color: isFavorite ? COLORS.rose : "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Bookmark size={24} fill={isFavorite ? COLORS.rose : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ EPISODE LIST ═══ */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, borderBottom: `2px solid ${COLORS.accent}`, paddingBottom: 16 }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 900, borderBottom: "3px solid white", paddingBottom: 14, marginBottom: -19 }}>Episodes</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.textMuted }}>Comments</div>
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={14} /> Total {1 + (story.episodes?.length || 0)} Episodes
          </div>
        </div>

        {/* Episode Rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* First Episode */}
          <EpisodeRow 
            number={1}
            title="Episode 1"
            image={story.panels?.[0]}
            date="2026.05.01"
            onClick={() => navigate(`/manta/${story._id}?ep=1`)}
          />

          {/* Dynamic Episodes */}
          {story.episodes?.slice().reverse().map((ep, i) => (
            <EpisodeRow 
              key={ep._id || i}
              number={ep.number || story.episodes.length - i + 1}
              title={ep.title || `Episode ${ep.number}`}
              image={ep.panels?.[0]}
              date={new Date(ep.createdAt).toLocaleDateString().replace(/\//g, '.')}
              onClick={() => navigate(`/manta/${story._id}?ep=${ep.number}`)}
            />
          ))}
        </div>

        {/* Ad Placeholder */}
        <div style={{ marginTop: 60, height: 120, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px dashed ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontSize: 14 }}>
          Advertisement
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "80px 24px", borderTop: `1px solid ${COLORS.border}`, textAlign: "center" }}>
        <div style={{ fontSize: 14, color: COLORS.textMuted }}>&copy; 2026 ToonVault. All rights reserved.</div>
      </footer>
    </div>
  );
}

function EpisodeRow({ number, title, image, date, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: "flex", gap: 24, padding: "24px 0", borderBottom: `1px solid ${COLORS.border}`,
        cursor: "pointer", transition: "all 0.2s", alignItems: "center"
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = "none"}
    >
      <div style={{ width: 140, height: 90, borderRadius: 8, overflow: "hidden", background: "#12101F", flexShrink: 0 }}>
        <img src={image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{date}</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: COLORS.textMuted }} />
          <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 800 }}># {number}</div>
        </div>
      </div>
      <div style={{ color: COLORS.textMuted }}>
        <Play size={24} />
      </div>
    </div>
  );
}

export default SeriesPage;
