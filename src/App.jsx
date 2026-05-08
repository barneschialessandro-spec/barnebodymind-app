import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#EFF5F1", surface: "#FFFFFF", primary: "#1A3D2E", primaryHov: "#254F3B",
  accent: "#3DC98A", accentSoft: "#C8F0E0", text: "#0D1F17", muted: "#6B8C7A",
  border: "#D5E4DC", orange: "#F07048", red: "#DC4C4C", yellow: "#F5BE30",
  shadow: "0 2px 16px rgba(26,61,46,0.09)", shadowLg: "0 8px 32px rgba(26,61,46,0.13)",
};

const PAZIENTI = [
  { id: 1, nome: "Marco Rossi", email: "marco@email.com", tel: "333 1234567", nascita: "15/03/1985", altezza: 178, peso: 82, livello: "Intermedio", condizioni: "Dolore lombare cronico. Operazione ginocchio destro nel 2022.", emoji: "👨", unread: 0 },
  { id: 2, nome: "Laura Bianchi", email: "laura@email.com", tel: "347 9876543", nascita: "22/07/1992", altezza: 165, peso: 61, livello: "Principiante", condizioni: "Lieve scoliosi dorsale. Bolla al tallone sinistro.", emoji: "👩", unread: 1 },
  { id: 3, nome: "Giuseppe Verdi", email: "giuseppe@email.com", tel: "339 5554443", nascita: "08/11/1978", altezza: 182, peso: 91, livello: "Avanzato", condizioni: "Strappo muscolare coscia destra (guarito 2024).", emoji: "🧔", unread: 2 },
];

const ESERCIZI = [
  { id: 1, nome: "Squat con Bilanciere", muscoli: ["Quadricipiti", "Glutei"], diff: "Avanzato", attrezzi: ["Bilanciere"], desc: "Schiena dritta, ginocchia in asse.", emoji: "🏋️" },
  { id: 2, nome: "Plank", muscoli: ["Core", "Addominali"], diff: "Facile", attrezzi: ["Tappetino"], desc: "Corpo in linea retta, respiro regolare.", emoji: "🧘" },
  { id: 3, nome: "Camminata Tapis Roulant", muscoli: ["Gambe"], diff: "Facile", attrezzi: ["Tapis Roulant"], desc: "Cardio a basso impatto.", emoji: "🚶" },
  { id: 4, nome: "Curl Manubri", muscoli: ["Bicipiti"], diff: "Facile", attrezzi: ["Manubri"], desc: "Gomiti fermi ai fianchi.", emoji: "💪" },
  { id: 5, nome: "Stretching Lombare", muscoli: ["Lombare"], diff: "Facile", attrezzi: ["Tappetino"], desc: "Fondamentale per lombalgia.", emoji: "🤸" },
];
const Btn = ({ children, onClick, variant = "primary", size = "md", full = false, style = {} }) => {
  const [h, setH] = useState(false);
  const sz = { sm: { padding: "5px 13px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 14 }, lg: { padding: "13px 26px", fontSize: 15 } };
  const v = {
    primary: { background: h ? "#2EB87B" : C.accent, color: "#fff" },
    dark: { background: h ? C.primaryHov : C.primary, color: "#fff" },
    ghost: { background: h ? C.bg : "transparent", color: C.primary, border: `1.5px solid ${C.border}` },
    soft: { background: h ? C.accentSoft : C.accentSoft + "AA", color: C.primary },
    danger: { background: h ? "#BE3030" : C.red, color: "#fff" },
  };
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, width: full ? "100%" : "auto", justifyContent: "center", transition: "all 0.15s", cursor: "pointer", ...sz[size], ...v[variant], ...style }}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "accent" }) => {
  const map = { accent: ["#C8F0E0", "#0A7A4A"], orange: ["#FDEBD9", "#B84C1A"], red: ["#FDDEDE", "#A02020"], gray: [C.bg, C.muted], yellow: ["#FFF3D0", "#8A6500"] };
  const [bg, fg] = map[color] || map.accent;
  return <span style={{ background: bg, color: fg, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{children}</span>;
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.surface, borderRadius: 16, boxShadow: C.shadow, padding: 20, border: `1px solid ${C.border}88`, cursor: onClick ? "pointer" : "default", ...style }}>
    {children}
  </div>
);

const Avatar = ({ emoji, size = 40, bg = C.accentSoft }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.48, flexShrink: 0 }}>{emoji}</div>
);

function LoginScreen({ onLogin }) {
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.primary} 0%, #2D6E52 60%, #3D8C6A 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 64, marginBottom: 14 }}>💚</div>
          <h1 style={{ fontFamily: "sans-serif", fontSize: 30, fontWeight: 800, color: "#fff" }}>BarneBodyMind</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 5 }}>Piattaforma di allenamento personalizzato</p>
        </div>
        <div style={{ background: "rgba(255,255,255,0.96)", borderRadius: 24, padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 22 }}>Accedi alla piattaforma</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { emoji: "👨‍💼", nome: "Alessandro — Trainer", sub: "Pannello amministratore", data: { role: "admin", nome: "Alessandro", emoji: "👨‍💼" } },
              { emoji: "👨", nome: "Marco Rossi — Paziente", sub: "Scheda recupero ginocchio", data: { role: "paziente", id: 1, nome: "Marco Rossi", emoji: "👨" } },
            ].map(u => (
              <button key={u.nome} onClick={() => onLogin(u.data)}
                style={{ padding: "16px 18px", borderRadius: 14, border: `2px solid ${C.border}`, background: C.surface, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 30 }}>{u.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{u.nome}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{u.sub}</div>
                  </div>
                  <span style={{ color: C.accent, fontSize: 22 }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function AdminApp({ user, onLogout }) {
  const [view, setView] = useState("dashboard");
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", background: C.bg }}>
      <div style={{ width: 224, background: C.primary, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 20px 18px" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>💚 BarneBodyMind</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>PANNELLO TRAINER</div>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {[["dashboard","⬡","Dashboard"],["pazienti","👥","Pazienti"],["esercizi","🏋️","Esercizi"],["chat","💬","Chat"]].map(([id,ic,la]) => (
            <button key={id} onClick={() => setView(id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: view===id ? "rgba(61,201,138,0.15)" : "transparent", color: view===id ? C.accent : "rgba(255,255,255,0.6)", fontWeight: view===id ? 600 : 400, fontSize: 14, fontFamily: "inherit" }}>
              <span style={{ fontSize: 17 }}>{ic}</span>{la}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.09)" }}>
          <button onClick={onLogout} style={{ width: "100%", padding: "8px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>← Esci</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>
        {view === "dashboard" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Buongiorno, Alessandro! 👋</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
              {[["👥","4","Pazienti attivi",C.accent],["🏋️","3","Allenamenti oggi",C.orange],["💬","3","Messaggi",C.primary],["📋","2","Feedback",C.yellow]].map(([ic,v,la,c]) => (
                <Card key={la} style={{ padding: 20 }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{ic}</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{la}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding: 22 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Pazienti Recenti</h3>
              {PAZIENTI.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}44` }}>
                  <Avatar emoji={p.emoji} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.nome}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{p.livello}</div>
                  </div>
                  {p.unread > 0 && <span style={{ background: C.red, color: "#fff", borderRadius: 20, fontSize: 10, padding: "2px 7px", fontWeight: 700 }}>{p.unread}</span>}
                </div>
              ))}
            </Card>
          </div>
        )}
        {view === "pazienti" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Pazienti</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
              {PAZIENTI.map(p => (
                <Card key={p.id} style={{ padding: 20 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <Avatar emoji={p.emoji} size={50} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{p.nome}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>{p.email}</div>
                      <div style={{ marginTop: 8 }}><Badge color="gray">{p.livello}</Badge></div>
                    </div>
                  </div>
                  {p.condizioni && (
                    <div style={{ marginTop: 12, padding: "9px 12px", background: "#FFF8F0", borderRadius: 8, fontSize: 12, color: "#8A4B1A" }}>⚠️ {p.condizioni}</div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
        {view === "esercizi" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Libreria Esercizi</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {ESERCIZI.map(e => (
                <Card key={e.id} style={{ padding: 18 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{e.emoji}</div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{e.nome}</h3>
                  <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>{e.desc}</p>
                  <Badge color="gray">{e.diff}</Badge>
                </Card>
              ))}
            </div>
          </div>
        )}
        {view === "chat" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Chat</h1>
            {PAZIENTI.map(p => (
              <Card key={p.id} style={{ padding: 18, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar emoji={p.emoji} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{p.nome}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>Scrivi un messaggio...</div>
                  </div>
                  {p.unread > 0 && <span style={{ background: C.red, color: "#fff", borderRadius: 20, fontSize: 10, padding: "2px 7px", fontWeight: 700 }}>{p.unread}</span>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PatientApp({ user, onLogout }) {
  const [view, setView] = useState("home");
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "sans-serif" }}>
      <div style={{ padding: 20, paddingBottom: 80 }}>
        {view === "home" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 20 }}>Ciao, {user.nome}! 👋</h1>
            <Card style={{ background: `linear-gradient(135deg, ${C.primary}, #2D6E52)`, marginBottom: 20 }}>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>SCHEDA ATTIVA</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Scheda Recupero Ginocchio</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Scade: 26/05/2026</div>
              </div>
            </Card>
            <h2 style={{ fontWeight: 700, fontSize: 17, marginBottom: 14 }}>📅 Allenamento di oggi</h2>
            {ESERCIZI.slice(0,3).map(e => (
              <Card key={e.id} style={{ marginBottom: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 28 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{e.nome}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>3 serie · 12 ripetizioni</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {view === "profilo" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Il Mio Profilo</h1>
            <Card style={{ padding: 20, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <Avatar emoji={user.emoji} size={60} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20 }}>{user.nome}</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Paziente</div>
                </div>
              </div>
            </Card>
            <Btn full variant="ghost" onClick={onLogout} style={{ borderRadius: 10, padding: 12 }}>← Esci</Btn>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 14px" }}>
        {[["home","🏠","Home"],["chat","💬","Chat"],["profilo","👤","Profilo"]].map(([id,ic,la]) => (
          <button key={id} onClick={() => setView(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, border: "none", background: "transparent", cursor: "pointer", color: view===id ? C.primary : C.muted, fontFamily: "inherit" }}>
            <span style={{ fontSize: 22 }}>{ic}</span>
            <span style={{ fontSize: 10, fontWeight: view===id ? 700 : 400 }}>{la}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: sans-serif; }`;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);
  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.role === "admin") return <AdminApp user={user} onLogout={() => setUser(null)} />;
  return <PatientApp user={user} onLogout={() => setUser(null)} />;
}
