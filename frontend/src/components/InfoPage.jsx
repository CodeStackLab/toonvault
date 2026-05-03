import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, Book, Info, Users, HelpCircle, ArrowLeft, Sparkles, Search } from 'lucide-react';
import axios from 'axios';

const COLORS = {
  bg: "#FAF7F2",
  card: "#FFFFFF",
  cardTint: "#F6F0E8",
  ink: "#1F2430",
  muted: "#6B7280",
  mutedLight: "#9CA3AF",
  plum: "#6D4AE8",
  plumLight: "#EDE8FD",
  plumDark: "#4C2DB5",
  rose: "#E86A8A",
  roseLight: "#FDEEF3",
  gold: "#D79A2B",
  goldLight: "#FEF3DC",
  border: "#EDE8DF",
  success: "#2E8B6E",
};

const CONTENT = {
  about: {
    title: "About ToonVault",
    icon: <Info size={24} color={COLORS.plum} />,
    body: (
      <div className="info-body">
        <p>ToonVault is the world's leading AI-powered storytelling platform, where imagination meets cutting-edge technology. Founded in 2026, we aim to democratize the creation of high-quality comics and novels.</p>
        <h3>Our Mission</h3>
        <p>We empower creators by providing them with advanced AI tools that handle the tedious parts of production—like panel generation and background rendering—so they can focus on what matters most: the story.</p>
        <h3>The Community</h3>
        <p>With millions of readers worldwide, ToonVault is more than just a publishing tool. It's a vibrant ecosystem where fans and creators connect through shared passion for digital art and literature.</p>
      </div>
    )
  },
  terms: {
    title: "Terms of Service",
    icon: <Book size={24} color={COLORS.plum} />,
    body: (
      <div className="info-body">
        <p>Last Updated: May 2026</p>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using ToonVault, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.</p>
        <h3>2. User Accounts</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility.</p>
        <h3>3. Creator Content</h3>
        <p>Creators retain ownership of their original work. However, by publishing on ToonVault, you grant us a non-exclusive license to distribute and promote your content globally.</p>
        <h3>4. Prohibited Conduct</h3>
        <p>Harassment, plagiarism, and the distribution of illegal content are strictly prohibited and will result in immediate termination of account access.</p>
      </div>
    )
  },
  privacy: {
    title: "Privacy Policy",
    icon: <Shield size={24} color={COLORS.plum} />,
    body: (
      <div className="info-body">
        <p>Your privacy is paramount at ToonVault. This policy outlines how we collect and protect your data.</p>
        <h3>1. Data Collection</h3>
        <p>We collect basic information like email and username to provide our services. Usage data is collected to improve your reading and creation experience.</p>
        <h3>2. AI Usage</h3>
        <p>When you use our AI tools, your prompts are processed to generate results. We do not use your private drafts to train public models without explicit consent.</p>
        <h3>3. Security</h3>
        <p>We use industry-standard encryption to protect your personal information and transaction data.</p>
      </div>
    )
  },
  help: {
    title: "Help Center",
    icon: <HelpCircle size={24} color={COLORS.plum} />,
    body: (
      <div className="info-body">
        <h3>Common Questions</h3>
        <details>
          <summary>How do I start writing a story?</summary>
          <p>Navigate to the "Become a Creator" page and click "Start Writing". You will be guided through our AI Studio.</p>
        </details>
        <details>
          <summary>How do I withdraw my earnings?</summary>
          <p>Go to your Wallet in the Dashboard. Once you reach the minimum threshold of $10, you can request a payout via PayPal or Stripe.</p>
        </details>
        <details>
          <summary>Is my data secure?</summary>
          <p>Yes, we use bank-level encryption for all sensitive data and transactions.</p>
        </details>
        <h3>Contact Support</h3>
        <p>Email us at: support@toonvault.com</p>
      </div>
    )
  },
  community: {
    title: "Community Guidelines",
    icon: <Users size={24} color={COLORS.plum} />,
    body: (
      <div className="info-body">
        <p>Join a community built on respect and creativity.</p>
        <h3>1. Be Respectful</h3>
        <p>Feedback should be constructive. Toxicity and hate speech are not tolerated.</p>
        <h3>2. No Spoilers</h3>
        <p>Use spoiler tags when discussing recent chapters in the comments.</p>
        <h3>3. Support Creators</h3>
        <p>The best way to help creators is through likes, follows, and direct coin support.</p>
      </div>
    )
  }
};

export default function InfoPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef(null);
  
  const page = CONTENT[slug] || CONTENT['about'];

  const handleNav = (item) => {
    if (item.path) navigate(item.path);
    else if (item.target) {
      if (item.target.startsWith('/')) navigate(item.target);
      else window.location.href = '/' + item.target;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.ink, minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ═══ TOP NAV (FROM HOME) ═══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 200,
        background: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.plum}, ${COLORS.rose})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, boxShadow: "0 4px 12px rgba(109,74,232,0.2)" }}>📖</div>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.ink, letterSpacing: -0.5 }}>
                Toon<span style={{ color: COLORS.rose }}>Vault</span>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate('/')} style={{ padding: "8px 16px", background: "none", border: "none", fontSize: 14, fontWeight: 600, color: COLORS.ink, cursor: "pointer" }}>Home</button>
            <button onClick={() => navigate('/browse')} style={{ padding: "8px 16px", background: "none", border: "none", fontSize: 14, fontWeight: 600, color: COLORS.ink, cursor: "pointer" }}>Browse</button>
            <button onClick={() => navigate(isLoggedIn ? '/dashboard' : '/user')} style={{
              padding: "8px 18px", border: `1.5px solid ${COLORS.plum}`,
              background: isLoggedIn ? COLORS.plum : "transparent", borderRadius: 22, fontSize: 13,
              fontWeight: 600, color: isLoggedIn ? "white" : COLORS.plum, cursor: "pointer"
            }}>{isLoggedIn ? "Dashboard" : "Log in"}</button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.plumLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {page.icon}
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: -1.5, color: COLORS.ink }}>{page.title}</h1>
        </div>
        
        <div className="content-area" style={{ lineHeight: 1.8, fontSize: 18, color: COLORS.muted }}>
          {page.body}
        </div>
      </main>

      {/* ═══ FOOTER (FROM HOME) ═══ */}
      <footer style={{ background: "#1F2430", padding: "80px 0 60px", color: "white", marginTop: 100 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 60 }}>
            <div style={{ gridColumn: "span 1.5" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, cursor: "pointer" }} onClick={() => navigate("/")}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.plum}, ${COLORS.rose})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: "0 4px 15px rgba(109,74,232,0.3)" }}>📖</div>
                <span style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: -0.8 }}>Toon<span style={{ color: COLORS.rose }}>Vault</span></span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 300, color: "rgba(255,255,255,0.5)" }}>
                An AI-powered interactive storytelling platform where choices shape every story. Create, share, and monetize your imagination.
              </p>
            </div>
            {[
              { 
                title: "Discover", 
                links: [
                  { l: "Browse", t: "/browse" },
                  { l: "Originals", t: "/#daily-schedule" },
                  { l: "Categories", t: "/#categories" },
                  { l: "Rankings", t: "/#rankings" },
                  { l: "Pricing", t: "/#pricing" }
                ] 
              },
              { 
                title: "Create", 
                links: [
                  { l: "Become a Creator", t: "/creators" },
                  { l: "Publish a story", t: "/dashboard?page=ai" },
                  { l: "Creator tools", t: "/creators" },
                ] 
              },
              { 
                title: "Company", 
                links: [
                  { l: "About", t: "/about" },
                  { l: "Help center", t: "/help" },
                  { l: "Community", t: "/community" },
                  { l: "Terms", t: "/terms" },
                  { l: "Privacy", t: "/privacy" }
                ] 
              },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "white", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {col.links.map(link => (
                    <div key={link.l} 
                      onClick={() => handleNav({ target: link.t })}
                      style={{ fontSize: 14, cursor: "pointer", transition: "all 0.2s", color: "rgba(255,255,255,0.45)" }}
                      onMouseEnter={e => e.currentTarget.style.color = "white"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                    >{link.l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>© 2026 ToonVault. All rights reserved.</div>
            <div style={{ display: "flex", gap: 24 }}>
              {["Discord", "Instagram", "Twitter", "YouTube"].map(s => (
                <span key={s} style={{ fontSize: 14, cursor: "pointer", transition: "all 0.2s", color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "white"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                >{s}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .info-body h3 { color: ${COLORS.ink}; margin-top: 40px; margin-bottom: 16px; font-size: 22px; font-weight: 800; }
        .info-body p { margin-bottom: 20px; }
        .info-body details { background: white; border: 1px solid ${COLORS.border}; border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .info-body summary { font-weight: 700; cursor: pointer; outline: none; color: ${COLORS.ink}; }
        .info-body summary::-webkit-details-marker { color: ${COLORS.plum}; }
      `}</style>
    </div>
  );
}
