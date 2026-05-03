import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Wand2, BookOpen, Image as ImageIcon, Send, CheckCircle2, X } from 'lucide-react';
import api from '../api';

const C = {
  bg: "#050408",
  surface: "#0D0B1A",
  card: "#120F24",
  cardBorder: "rgba(255,255,255,0.06)",
  plum: "#8B5CF6",
  plumGlow: "rgba(139,92,246,0.2)",
  rose: "#F43F8E",
  roseGlow: "rgba(244,63,142,0.2)",
  text: "#F1EEF9",
  textDim: "#6B6789",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #F43F8E 100%)",
};

export default function StoryWizPopup({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    prompt: "",
    genre: "Fantasy",
    title: "",
    summary: "",
    type: "Comic"
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const generateInitialConcept = async () => {
    if (!formData.prompt) return;
    setLoading(true);
    setError("");
    try {
      // Mock AI thinking or actual API call to refine plot
      // For now, we'll use the prompt as a base
      setFormData(prev => ({
        ...prev,
        title: "The " + prev.genre + " Tale: " + (prev.prompt.split(' ').slice(0, 3).join(' ')),
        summary: "An epic journey beginning with: " + prev.prompt
      }));
      handleNext();
    } catch (e) {
      setError("AI was unable to process your idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const finalGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.generateStory({
        topic: formData.title,
        prompt: formData.summary,
        images: formData.type === "Comic" ? 4 : 0,
        category: formData.genre,
        status: "draft"
      });
      setResult(res.data.story);
      handleNext();
    } catch (e) {
      setError(e.response?.data?.error || "Magic failed! Check your AI configuration.");
    } finally {
      setLoading(false);
    }
  };

  const GENRES = ["Fantasy", "Romance", "Action", "Mystery", "Sci-Fi", "Horror"];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{
        background: C.surface, width: "100%", maxWidth: 600,
        borderRadius: 32, border: `1px solid ${C.cardBorder}`,
        overflow: "hidden", position: "relative",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6)"
      }}>
        
        {/* Header */}
        <div style={{ padding: "32px 40px 20px", borderBottom: `1px solid ${C.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={24} style={{ color: C.plum }} /> AI Story Wizard
            </h2>
            <p style={{ fontSize: 13, color: C.textDim, margin: "4px 0 0" }}>Step {step} of 4: {step === 1 ? "The Concept" : step === 2 ? "Refine Plot" : step === 3 ? "Generating Magic" : "Finished"}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "40px" }}>
          
          {step === 1 && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.plum, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 12 }}>What's your story idea?</label>
                <textarea 
                  value={formData.prompt}
                  onChange={e => setFormData({...formData, prompt: e.target.value})}
                  placeholder="e.g. A lonely robot finds a flower in a post-apocalyptic world..."
                  style={{ width: "100%", height: 120, background: "#050408", border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 20, color: "white", fontSize: 15, outline: "none", resize: "none" }}
                />
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.plum, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 12 }}>Select Genre</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {GENRES.map(g => (
                    <button 
                      key={g} 
                      onClick={() => setFormData({...formData, genre: g})}
                      style={{ 
                        padding: "10px 20px", borderRadius: 12, border: `1px solid ${formData.genre === g ? C.plum : C.cardBorder}`,
                        background: formData.genre === g ? C.plum + "15" : "transparent", color: formData.genre === g ? C.plum : C.textDim,
                        fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
                      }}
                    >{g}</button>
                  ))}
                </div>
              </div>
              <button 
                onClick={generateInitialConcept}
                disabled={!formData.prompt || loading}
                style={{ width: "100%", padding: 18, borderRadius: 18, background: C.gradient, border: "none", color: "white", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: `0 10px 30px ${C.plumGlow}` }}
              >
                {loading ? <div className="spinner" /> : <><Wand2 size={20} /> Next: Refine Plot</>}
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation: "fadeIn 0.4s ease" }}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: C.plum, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>AI Generated Title</label>
                <input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  style={{ width: "100%", background: "#050408", border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "14px 18px", color: "white", fontSize: 15 }}
                />
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: C.plum, textTransform: "uppercase", letterSpacing: 1.5, display: "block", marginBottom: 10 }}>Refined Summary</label>
                <textarea 
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                  style={{ width: "100%", height: 100, background: "#050408", border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: "14px 18px", color: "white", fontSize: 14, resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleBack} style={{ flex: 1, padding: 16, borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "none", color: C.textDim, fontWeight: 700, cursor: "pointer" }}>Back</button>
                <button onClick={finalGenerate} style={{ flex: 2, padding: 16, borderRadius: 14, background: C.gradient, border: "none", color: "white", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Sparkles size={18} /> Finalize Magic
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.4s ease" }}>
              <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 32px" }}>
                 <div className="pulse-ring" style={{ position: "absolute", inset: -10, borderRadius: "50%", border: `2px solid ${C.plum}`, opacity: 0.5 }} />
                 <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, boxShadow: `0 0 50px ${C.plumGlow}` }}>
                   🔮
                 </div>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Weaving Your Story...</h3>
              <p style={{ color: C.textDim, marginBottom: 32 }}>Our AI is creating your world, characters, and panels. Please wait a moment.</p>
              
              <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 12 }}>
                <div className="progress-bar-fill" style={{ height: "100%", background: C.gradient, width: "65%" }} />
              </div>
              <div style={{ fontSize: 12, color: C.plum, fontWeight: 700 }}>GENERATING HIGH-FIDELITY PANELS...</div>

              {error && <div style={{ marginTop: 24, color: "#EF4444", fontSize: 14 }}>{error} <br/> <button onClick={handleBack} style={{ background: "none", border: "none", color: C.plum, textDecoration: "underline", cursor: "pointer", marginTop: 8 }}>Try again</button></div>}
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: "center", animation: "fadeIn 0.6s ease" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(16,185,129,0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <CheckCircle2 size={44} />
              </div>
              <h3 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Story Created!</h3>
              <p style={{ color: C.textDim, marginBottom: 40 }}>Your story "<strong>{result?.title}</strong>" is ready to be shared with the world.</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button 
                  onClick={() => {
                    onComplete(result);
                    onClose();
                  }}
                  style={{ width: "100%", padding: 18, borderRadius: 16, background: C.gradient, border: "none", color: "white", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                >
                  <BookOpen size={20} /> View in Library
                </button>
                <button onClick={onClose} style={{ width: "100%", padding: 14, borderRadius: 16, background: "transparent", border: `1px solid ${C.cardBorder}`, color: C.textDim, fontWeight: 700, cursor: "pointer" }}>
                  Close Wizard
                </button>
              </div>
            </div>
          )}

        </div>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; borderRadius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .pulse-ring { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.1; } }
          .progress-bar-fill { animation: progress 15s linear forwards; }
          @keyframes progress { from { width: 0%; } to { width: 95%; } }
        `}</style>
      </div>
    </div>
  );
}
