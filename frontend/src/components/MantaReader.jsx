import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2, Heart, MessageSquare, BookOpen, Star, MoreVertical, List, ThumbsUp } from 'lucide-react';
import axios from 'axios';

const COLORS = {
  bg: "#000000",
  header: "#1A182E",
  accent: "#00E599", // Webtoon green
  rose: "#F472B6",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
};

export default function MantaReader() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const scrollRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const epNum = parseInt(queryParams.get('ep')) || 1;
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`/api/stories/${storyId}`);
        const s = res.data;
        if (epNum > 1 && s.episodes) {
          const ep = s.episodes.find(e => e.number === epNum);
          if (ep) {
            s.displayPanels = ep.panels;
            s.displayTitle = ep.title || `Episode ${ep.number}`;
            s.displayContent = ep.content;
          } else {
            s.displayPanels = s.panels;
            s.displayTitle = "Episode 1";
            s.displayContent = s.content;
          }
        } else {
          s.displayPanels = s.panels;
          s.displayTitle = "Episode 1";
          s.displayContent = s.content;
        }
        setStory(s);
      } catch (err) {
        setStory({
          title: "The Lemon Tree Forest",
          displayTitle: `Episode ${epNum}`,
          authorName: "ToonVault AI",
          displayPanels: [
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000",
          ],
          description: "A beautiful AI-generated story."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
    window.scrollTo(0, 0);
  }, [storyId, epNum]);

  if (loading) {
    return (
      <div style={{ background: COLORS.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <BookOpen size={48} />
        </motion.div>
      </div>
    );
  }

  const hasNext = story.episodes && epNum < (1 + story.episodes.length);
  const hasPrev = epNum > 1;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'Inter', sans-serif" }}>
      
      {/* ═══ TOP STICKY NAV (WEBTOON STYLE) ═══ */}
      <header style={{ 
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1100,
        height: 60, background: "rgba(26, 24, 46, 0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate(`/story/${storyId}`)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            <ChevronLeft size={28} />
          </button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{story.title}</div>
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700 }}>{story.displayTitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button onClick={() => navigate(`/story/${storyId}`)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            <List size={22} />
          </button>
          <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            <Share2 size={22} />
          </button>
        </div>
      </header>

      {/* ═══ PROGRESS BAR ═══ */}
      <motion.div
        style={{
          position: "fixed", top: 60, left: 0, right: 0, height: 3,
          background: COLORS.accent, transformOrigin: "0%",
          zIndex: 1200, scaleX
        }}
      />

      {/* ═══ MAIN VIEWER ═══ */}
      <main style={{ maxWidth: 800, margin: "0 auto", paddingTop: 60 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {story.displayPanels?.map((url, i) => (
            <div key={i} style={{ width: "100%", marginBottom: 0 }}>
              <img
                src={url}
                alt={`Panel ${i + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              
              {/* Content Overlay */}
              {story.displayContent && (
                (() => {
                  try {
                    const contentArr = JSON.parse(story.displayContent);
                    const panelData = contentArr[i];
                    if (panelData && panelData.text) {
                      return (
                        <div style={{
                          padding: "30px 24px", textAlign: "center", background: "#000",
                          color: "white", fontSize: 17, lineHeight: 1.7, fontWeight: 400
                        }}>
                          {panelData.text}
                        </div>
                      );
                    }
                  } catch(e) { return null; }
                })()
              )}
            </div>
          ))}
        </div>

        {/* ═══ END OF EPISODE ═══ */}
        <div style={{ padding: "80px 20px", textAlign: "center", background: "linear-gradient(to bottom, #000, #12101F)" }}>
           <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>{story.displayTitle} End</h2>
           <p style={{ color: COLORS.textMuted, marginBottom: 40 }}>How was this episode? Let the author know!</p>
           
           <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 60 }}>
              <button onClick={() => setLiked(!liked)} style={{ background: "none", border: "none", color: liked ? COLORS.rose : "white", cursor: "pointer", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: liked ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, transition: "all 0.2s" }}>
                  <ThumbsUp size={28} fill={liked ? COLORS.rose : "none"} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{liked ? "Liked" : "Like"}</div>
              </button>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                  <MessageSquare size={28} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Comment</div>
              </button>
           </div>

           {/* Next/Prev Navigation */}
           <div style={{ display: "flex", gap: 16, maxWidth: 500, margin: "0 auto" }}>
             {hasPrev && (
               <button 
                onClick={() => navigate(`/manta/${storyId}?ep=${epNum - 1}`)}
                style={{ flex: 1, padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
               >
                 Previous
               </button>
             )}
             {hasNext ? (
               <button 
                onClick={() => navigate(`/manta/${storyId}?ep=${epNum + 1}`)}
                style={{ flex: 2, padding: "18px", borderRadius: 12, background: COLORS.accent, color: "#000", border: "none", fontSize: 16, fontWeight: 900, cursor: "pointer" }}
               >
                 Next Episode
               </button>
             ) : (
               <button 
                onClick={() => navigate(`/story/${storyId}`)}
                style={{ flex: 2, padding: "18px", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "white", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}
               >
                 Go to List
               </button>
             )}
           </div>
        </div>
      </main>

      {/* ═══ STICKY BOTTOM NAV (WEBTOON STYLE) ═══ */}
      <footer style={{ 
        position: "fixed", bottom: 0, left: 0, right: 0, height: 60,
        background: "rgba(26, 24, 46, 0.95)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", zIndex: 1100
      }}>
        <button 
          disabled={!hasPrev}
          onClick={() => navigate(`/manta/${storyId}?ep=${epNum - 1}`)}
          style={{ background: "none", border: "none", color: hasPrev ? "white" : "rgba(255,255,255,0.2)", cursor: hasPrev ? "pointer" : "default" }}
        >
          <ChevronLeft size={30} />
        </button>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
           <button onClick={() => navigate(`/story/${storyId}`)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
             <List size={24} />
           </button>
           <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
           <div style={{ fontSize: 16, fontWeight: 900 }}>{epNum}</div>
           <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
           <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
             <MoreVertical size={24} />
           </button>
        </div>

        <button 
          disabled={!hasNext}
          onClick={() => navigate(`/manta/${storyId}?ep=${epNum + 1}`)}
          style={{ background: "none", border: "none", color: hasNext ? "white" : "rgba(255,255,255,0.2)", cursor: hasNext ? "pointer" : "default" }}
        >
          <ChevronRight size={30} />
        </button>
      </footer>
    </div>
  );
}
