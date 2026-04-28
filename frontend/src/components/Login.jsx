import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, User, Lock, Mail, Phone, MapPin, CreditCard, ShieldCheck, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS (Synced with Dashboard)
// ═══════════════════════════════════════════════════════
const C = {
  bg: "#0C0A14",
  surface: "#13101F",
  surfaceHover: "#1A1628",
  card: "#1A1628",
  cardBorder: "#2A2240",
  glass: "rgba(255,255,255,0.04)",
  glassBorder: "rgba(255,255,255,0.08)",
  plum: "#8B5CF6",
  plumLight: "#A78BFA",
  plumDark: "#6D28D9",
  plumGlow: "rgba(139,92,246,0.35)",
  rose: "#F472B6",
  roseGlow: "rgba(244,114,182,0.3)",
  gold: "#F59E0B",
  goldLight: "#FCD34D",
  cyan: "#22D3EE",
  cyanGlow: "rgba(34,211,238,0.25)",
  green: "#10B981",
  orange: "#F97316",
  text: "#F1EEF9",
  textMuted: "#9CA3AF",
  textDim: "#6B7280",
  ink: "#0C0A14",
  gradient: "linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%)",
  gradientGold: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
};

export default function Login({ type = 'user' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [step, setStep] = useState(1); // 1: Auth, 2: Address, 3: Payment
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [settings, setSettings] = useState({ site_name: "ToonVault" });
  const [formData, setFormData] = useState({
    username: '', email: '', password: '',
    plan: 'Free',
    phone: '',
    address: { street: '', city: '', state: '', zip: '', country: 'USA' },
    billing: { cardNumber: '', expiry: '', cvv: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    if (planParam) {
      setFormData(prev => ({ ...prev, plan: planParam }));
      setIsRegister(true);
    }

    // Fetch payment settings
    axios.get('/api/settings/public')
      .then(res => {
        setPaypalEnabled(res.data.payment_paypal_enabled === 'true');
        setSettings(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => setPaypalEnabled(true));
  }, [location]);

  const isAdmin = type === 'admin';
  const title = isAdmin ? `Admin Login — ${settings.site_name}` : isRegister ? `Join ${settings.site_name} — Membership` : `Sign In — ${settings.site_name}`;

  const PLANS = [
    { name: 'Free', price: '0', color: C.textMuted },
    { name: 'Silver', price: '9.99', color: C.plumLight },
    { name: 'Gold', price: '19.99', color: C.gold }
  ];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isRegister && step < 3 && !isAdmin) {
      setStep(step + 1);
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      if (isRegister && !isAdmin) {
        const res = await axios.post('/api/auth/register', formData);
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        const res = await axios.post('/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 14px 14px 44px',
    background: C.bg, border: `1px solid ${C.cardBorder}`,
    borderRadius: 14, color: C.text, fontSize: 14, outline: 'none',
    boxSizing: 'border-box', transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif"
  };

  const iconStyle = {
    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.textDim
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: C.bg,
      fontFamily: "'DM Sans', sans-serif", color: C.text,
      position: 'relative', overflow: 'hidden'
    }}>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      {/* Decorative Blobs */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: C.plumGlow, filter: 'blur(100px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: C.roseGlow, filter: 'blur(100px)', zIndex: 0 }} />

      {/* Header */}
      <header style={{ 
        padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
        background: 'rgba(12,10,20,0.85)', backdropFilter: 'blur(20px)', 
        borderBottom: `1px solid ${C.cardBorder}`, zIndex: 10 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ 
            width: 32, height: 32, borderRadius: 10, 
            background: C.gradient, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 16, boxShadow: `0 0 16px ${C.plumGlow}` 
          }}>📖</div>
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>
            <span style={{ color: C.plumLight }}>Toon</span><span style={{ color: C.rose }}>Vault</span>
          </span>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', zIndex: 10 }}>
        <div style={{ 
          background: C.card, borderRadius: 28, border: `1px solid ${C.cardBorder}`, 
          width: '100%', maxWidth: isRegister ? 520 : 420, padding: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
             <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
               {isAdmin ? 'Admin Portal' : isRegister ? 'Create Your Account' : 'Welcome Back'}
             </h1>
             <p style={{ fontSize: 14, color: C.textDim }}>
               {isRegister ? `Step ${step} of 3` : 'Enter your credentials to continue'}
             </p>
          </div>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', 
              borderRadius: 12, padding: '12px', color: '#EF4444', 
              fontSize: 13, textAlign: 'center', marginBottom: 20 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isRegister && !isAdmin && step === 1 && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.textDim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'block' }}>Choose Your Plan</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {PLANS.map(p => (
                    <div key={p.name} onClick={() => setFormData({ ...formData, plan: p.name })} style={{
                      padding: '16px 10px', borderRadius: 16, border: `2px solid ${formData.plan === p.name ? p.color : C.glassBorder}`,
                      background: formData.plan === p.name ? `${p.color}15` : C.bg, 
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: formData.plan === p.name ? p.color : C.text }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>${p.price}/mo</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Basic Info */}
            {(step === 1 || !isRegister || isAdmin) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {isRegister && !isAdmin && (
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={iconStyle} />
                    <input type="text" placeholder="Full Name" value={formData.username} required style={inputStyle} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={iconStyle} />
                  <input type="email" placeholder="Email Address" value={formData.email} required style={inputStyle} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                {isRegister && !isAdmin && (
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={iconStyle} />
                    <input type="tel" placeholder="Phone Number" value={formData.phone} required style={inputStyle} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={iconStyle} />
                  <input type="password" placeholder="Password" value={formData.password} required style={inputStyle} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                </div>
              </div>
            )}

            {/* STEP 2: Address Info */}
            {isRegister && step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={iconStyle} />
                  <input type="text" placeholder="Street Address" value={formData.address.street} required style={inputStyle} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="City" value={formData.address.city} required style={{ ...inputStyle, paddingLeft: 16 }} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} />
                  <input type="text" placeholder="State (e.g. CA)" value={formData.address.state} required style={{ ...inputStyle, paddingLeft: 16 }} onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" placeholder="Zip Code" value={formData.address.zip} required style={{ ...inputStyle, paddingLeft: 16 }} onChange={e => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })} />
                  <input type="text" placeholder="Country" value={formData.address.country} readOnly style={{ ...inputStyle, paddingLeft: 16, opacity: 0.6 }} />
                </div>
              </div>
            )}

            {/* STEP 3: Payment Info */}
            {isRegister && step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ 
                  padding: '20px', background: C.bg, borderRadius: 20, 
                  marginBottom: 10, border: `1px solid ${C.cardBorder}` 
                }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: C.textDim }}>Selected Plan:</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: C.plumLight }}>{formData.plan}</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, color: C.textDim }}>Monthly Charge:</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: C.rose }}>${PLANS.find(p => p.name === formData.plan)?.price}</span>
                   </div>
                </div>
                
                {formData.plan !== 'Free' ? (
                  <div style={{ marginTop: 10 }}>
                    {paypalEnabled ? (
                      <PayPalScriptProvider options={{ "client-id": "test" }}>
                        <div style={{ minHeight: 150 }}>
                          <PayPalButtons 
                            style={{ layout: "vertical", shape: "rect", color: "blue" }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                purchase_units: [{
                                  amount: { value: PLANS.find(p => p.name === formData.plan)?.price }
                                }]
                              });
                            }}
                            onApprove={async (data, actions) => {
                              const details = await actions.order.capture();
                              console.log("PayPal Transaction Completed", details);
                              handleSubmit();
                            }}
                          />
                        </div>
                      </PayPalScriptProvider>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#ff8da1' }}>
                        PayPal is currently disabled. Please contact support.
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px', opacity: 0.6, justifyContent: 'center' }}>
                      <ShieldCheck size={14} />
                      <span style={{ fontSize: 11 }}>Secure PayPal Checkout</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ 
                      width: 56, height: 56, borderRadius: '50%', 
                      background: 'rgba(16, 185, 129, 0.1)', color: C.green, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      margin: '0 auto 16px', boxShadow: `0 0 20px rgba(16, 185, 129, 0.2)`
                    }}>
                       <Check size={28} strokeWidth={3} />
                    </div>
                    <p style={{ fontSize: 14, color: C.textMuted, margin: 0 }}>No payment required for the Free plan. Just click complete!</p>
                  </div>
                )}
              </div>
            )}

            {(step !== 3 || formData.plan === 'Free' || isAdmin || !isRegister) && (
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '16px', background: loading ? C.plumDark : C.gradient,
                color: 'white', border: 'none', borderRadius: 18, fontSize: 16, fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: 24,
                boxShadow: loading ? 'none' : `0 10px 25px ${C.plumGlow}`,
                fontFamily: "'DM Sans', sans-serif"
              }}>
                {loading ? 'Processing...' : isRegister ? (step === 3 ? 'Complete Signup' : 'Continue') : 'Sign In'}
              </button>
            )}
          </form>

          {!isAdmin && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
               <button onClick={() => { setIsRegister(!isRegister); setStep(1); setError(''); }} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = C.plumLight}
                 onMouseLeave={e => e.currentTarget.style.color = C.textDim}
               >
                 {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Join Now"}
               </button>
            </div>
          )}

          {isRegister && step > 1 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
               <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', color: C.textDim, fontSize: 12, cursor: 'pointer' }}>
                 ← Back to previous step
               </button>
            </div>
          )}
        </div>
      </main>

      <footer style={{ padding: '30px', textAlign: 'center', color: C.textDim, fontSize: 12, zIndex: 10 }}>
         &copy; 2026 {settings.site_name}. All rights reserved.
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: ${C.textDim}; opacity: 0.6; }
      `}</style>
    </div>
  );
}
