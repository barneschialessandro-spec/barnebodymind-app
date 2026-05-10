import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const C = {
  bg: "#EFF5F1", surface: "#FFFFFF", primary: "#1A3D2E",
  accent: "#3DC98A", accentSoft: "#C8F0E0", text: "#0D1F17", muted: "#6B8C7A",
  border: "#D5E4DC", orange: "#F07048", red: "#DC4C4C",
  shadow: "0 2px 16px rgba(26,61,46,0.09)",
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: C.surface, borderRadius: 16, boxShadow: C.shadow, padding: 20, border: `1px solid ${C.border}88`, cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>
);

const Btn = ({ children, onClick, variant = "primary", full = false, style = {} }) => {
  const v = { primary: { background: C.accent, color: "#fff" }, dark: { background: C.primary, color: "#fff" }, ghost: { background: "transparent", color: C.primary, border: `1.5px solid ${C.border}` } };
  return <button onClick={onClick} style={{ border: "none", borderRadius: 10, fontFamily: "inherit", fontWeight: 600, padding: "11px 20px", fontSize: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, width: full ? "100%" : "auto", cursor: "pointer", ...v[variant], ...style }}>{children}</button>;
};

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text }} />
  </div>
);

const Avatar = ({ size = 40, bg = C.accentSoft }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.48, flexShrink: 0 }}>👤</div>
);

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setMsg("❌ Email o password non corretti."); setLoading(false); return; }
    const { data: profilo } = await supabase.from("pazienti").select("*").eq("email", email).single();
    if (profilo) onLogin({ ...profilo, role: profilo.ruolo });
    else onLogin({ email, role: "cliente", nome: email });
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!nome || !cognome || !email || !password) { setMsg("❌ Compila tutti i campi."); return; }
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setMsg("❌ " + error.message); setLoading(false); return; }
    await supabase.from("pazienti").insert([{ nome, cognome, email, ruolo: "cliente" }]);
    setMsg("✅ Registrazione completata! Controlla la tua email.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.primary} 0%, #2D6E52 60%, #3D8C6A 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="data:image/png;base64,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" style={{ width: 80, height: 80, marginBottom: 12, objectFit: "contain" }} alt="BarneBodyMind" />
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>BarneBodyMind</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 5 }}>Piattaforma di allenamento personalizzato</p>
        </div>
        <Card style={{ padding: 32 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 24, background: C.bg, padding: 4, borderRadius: 10 }}>
            {[["login","Accedi"],["register","Registrati"]].map(([id,la]) => (
              <button key={id} onClick={() => { setMode(id); setMsg(""); }} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: mode===id ? C.surface : "transparent", color: mode===id ? C.text : C.muted, fontFamily: "inherit" }}>{la}</button>
            ))}
          </div>
          {mode === "register" && <>
            <Input label="Nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Il tuo nome" />
            <Input label="Cognome" value={cognome} onChange={e => setCognome(e.target.value)} placeholder="Il tuo cognome" />
          </>}
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@esempio.it" />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimo 6 caratteri" />
          {msg && <div style={{ padding: "10px 14px", borderRadius: 10, background: msg.includes("✅") ? C.accentSoft : "#FDDEDE", fontSize: 13, marginBottom: 16, color: msg.includes("✅") ? "#0A7A4A" : "#A02020" }}>{msg}</div>}
{mode === "login" && (
  <div style={{ textAlign: "center", marginBottom: 16 }}>
    <button onClick={async () => {
      if (!email) { setMsg("❌ Inserisci prima la tua email."); return; }
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: "https://barnebodymind.it" });
      setMsg("✅ Email inviata! Controlla la tua casella.");
    }} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
      Password dimenticata?
    </button>
  </div>
)}
          <Btn full variant="dark" onClick={mode === "login" ? handleLogin : handleRegister} style={{ borderRadius: 12, padding: 13 }}>
            {loading ? "⏳ Attendere..." : mode === "login" ? "Accedi →" : "Registrati →"}
          </Btn>
          <div style={{ marginTop: 16, padding: "12px 14px", background: C.accentSoft, borderRadius: 10, fontSize: 12, color: "#0A7A4A" }}>
            💡 Prima volta? Registrati e il trainer attiverà il tuo profilo.
          </div>
        </Card>
      </div>
    </div>
  );
}
function AdminApp({ user, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [clienti, setClienti] = useState([]);
  const [esercizi, setEsercizi] = useState([]);
  const [selCliente, setSelCliente] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const msgRef = useRef(null);

  useEffect(() => {
    supabase.from("pazienti").select("*").then(({ data }) => data && setClienti(data));
    supabase.from("esercizi").select("*").then(({ data }) => data && setEsercizi(data));
  }, []);

  useEffect(() => {
    if (selCliente) {
      supabase.from("messaggi").select("*").or(`da_utente.eq.${selCliente.email},a_utente.eq.${selCliente.email}`).order("id").then(({ data }) => data && setMsgs(data));
    }
  }, [selCliente]);

  useEffect(() => { msgRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const sendMsg = async () => {
    if (!newMsg.trim() || !selCliente) return;
    const m = { da_utente: user.email, a_utente: selCliente.email, testo: newMsg.trim(), ora: new Date().toLocaleTimeString("it", { hour: "2-digit", minute: "2-digit" }), letto: false };
    await supabase.from("messaggi").insert([m]);
    setMsgs(prev => [...prev, m]);
    setNewMsg("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", background: C.bg }}>
      <div style={{ width: 224, background: C.primary, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.09)" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>💚 BarneBodyMind</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>PANNELLO TRAINER</div>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          {[["dashboard","⬡","Dashboard"],["clienti","👥","Clienti"],["esercizi","🏋️","Esercizi"],["chat","💬","Chat"],["impostazioni","⚙️","Impostazioni"]].map(([id,ic,la]) => (
            <button key={id} onClick={() => setView(id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", background: view===id ? "rgba(61,201,138,0.15)" : "transparent", color: view===id ? C.accent : "rgba(255,255,255,0.6)", fontWeight: view===id ? 600 : 400, fontSize: 14, fontFamily: "inherit", textAlign: "left" }}>
              <span>{ic}</span>{la}
            </button>
          ))}
        </nav>
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.09)" }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, padding: "0 14px 8px" }}>👨‍💼 {user.nome || user.email}</div>
          <button onClick={onLogout} style={{ width: "100%", padding: "8px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.55)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>← Esci</button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>
        {view === "dashboard" && (
          <div style={{ padding: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Buongiorno! 👋</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14, marginBottom: 28 }}>
              {[["👥",clienti.length,"Clienti registrati",C.accent],["🏋️",esercizi.length,"Esercizi in libreria",C.orange]].map(([ic,v,la,c]) => (
                <Card key={la} style={{ padding: 20 }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{ic}</div>
                  <div style={{ fontSize: 34, fontWeight: 800, color: c }}>{v}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{la}</div>
                </Card>
              ))}
            </div>
            <Card style={{ padding: 22 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Clienti Recenti</h3>
              {clienti.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>Nessun cliente ancora registrato.</p>}
              {clienti.slice(0,5).map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}44` }}>
                  <Avatar size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.nome} {p.cognome}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>{p.email}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
        {view === "clienti" && (
          <div style={{ padding: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Clienti</h1>
            {clienti.length === 0 && <p style={{ color: C.muted }}>Nessun cliente registrato.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
              {clienti.map(p => (
                <Card key={p.id} style={{ padding: 20 }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <Avatar size={46} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{p.nome} {p.cognome}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>{p.email}</div>
                      <div style={{ marginTop: 8, fontSize: 12, padding: "3px 10px", background: C.accentSoft, borderRadius: 20, display: "inline-block", color: "#0A7A4A", fontWeight: 600 }}>{p.ruolo === "paziente_eb" ? "🩺 EB BodyMind" : "💪 Cliente Standard"}</div>
                    </div>
                  </div>
                  {p.condizioni && <div style={{ marginTop: 12, padding: "9px 12px", background: "#FFF8F0", borderRadius: 8, fontSize: 12, color: "#8A4B1A" }}>⚠️ {p.condizioni}</div>}
                </Card>
              ))}
            </div>
          </div>
        )}
        {view === "esercizi" && (
          <div style={{ padding: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text }}>Libreria Esercizi</h1>
              <Btn variant="dark">+ Nuovo Esercizio</Btn>
            </div>
            {esercizi.length === 0 && <p style={{ color: C.muted }}>Nessun esercizio inserito.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
              {esercizi.map(e => (
                <Card key={e.id} style={{ padding: 18 }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏋️</div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{e.nome}</h3>
                  <p style={{ fontSize: 13, color: C.muted }}>{e.descrizione}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
        {view === "chat" && (
          <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ width: 260, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 16px", borderBottom: `1px solid ${C.border}` }}>
                <h2 style={{ fontWeight: 700, fontSize: 18 }}>Messaggi</h2>
              </div>
              <div style={{ flex: 1, overflow: "auto" }}>
                {clienti.map(p => (
                  <div key={p.id} onClick={() => setSelCliente(p)} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", gap: 10, alignItems: "center", background: selCliente?.id===p.id ? C.accentSoft : "transparent", borderBottom: `1px solid ${C.border}44` }}>
                    <Avatar size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{p.nome} {p.cognome}</div>
                      <div style={{ fontSize: 12, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {selCliente ? (
                <>
                  <div style={{ padding: "14px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar size={38} />
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selCliente.nome} {selCliente.cognome}</div>
                  </div>
                  <div style={{ flex: 1, overflow: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {msgs.map((m,i) => (
                      <div key={i} style={{ display: "flex", justifyContent: m.da_utente===user.email ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "65%", padding: "10px 14px", borderRadius: m.da_utente===user.email ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: m.da_utente===user.email ? C.primary : C.surface, color: m.da_utente===user.email ? "#fff" : C.text, fontSize: 14 }}>
                          {m.testo}
                          <div style={{ fontSize: 10, opacity: 0.55, marginTop: 4, textAlign: "right" }}>{m.ora}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={msgRef} />
                  </div>
                  <div style={{ padding: "14px 22px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
                    <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMsg()} placeholder="Scrivi un messaggio..." style={{ flex: 1, padding: "11px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none" }} />
                    <Btn onClick={sendMsg} variant="dark" style={{ borderRadius: 12 }}>Invia ↑</Btn>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Seleziona un cliente per chattare</div>
              )}
            </div>
          </div>
        )}
        {view === "impostazioni" && (
          <div style={{ padding: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginBottom: 24 }}>Impostazioni</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {[["👤","Profilo Trainer","Modifica nome e dati"],["👥","Gestione Trainer","Aggiungi colleghi"],["🔔","Notifiche","Configura notifiche"],["🔒","Privacy & GDPR","Gestisci consensi"],["🎨","Personalizzazione","Logo e colori"],["💾","Backup","Esporta dati"]].map(([ic,ti,de]) => (
                <Card key={ti} style={{ padding: 22, cursor: "pointer" }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{ic}</div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ti}</div>
                  <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{de}</div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function ClienteApp({ user, onLogout }) {
  const [view, setView] = useState("home");
  const [profilo, setProfilo] = useState(user);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const msgRef = useRef(null);

  useEffect(() => {
    if (view === "chat") {
      supabase.from("messaggi").select("*").or(`da_utente.eq.${user.email},a_utente.eq.${user.email}`).order("id").then(({ data }) => data && setMsgs(data));
    }
  }, [view]);

  useEffect(() => { msgRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const sendMsg = async () => {
    if (!newMsg.trim()) return;
    const m = { da_utente: user.email, a_utente: "trainer", testo: newMsg.trim(), ora: new Date().toLocaleTimeString("it", { hour: "2-digit", minute: "2-digit" }), letto: false };
    await supabase.from("messaggi").insert([m]);
    setMsgs(prev => [...prev, m]);
    setNewMsg("");
  };

  const saveProfilo = async () => {
    await supabase.from("pazienti").update({ nome: profilo.nome, cognome: profilo.cognome, telefono: profilo.telefono, altezza: profilo.altezza, peso: profilo.peso, condizioni: profilo.condizioni }).eq("email", user.email);
    alert("✅ Profilo aggiornato!");
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: "sans-serif" }}>
      <div style={{ padding: 20, paddingBottom: 80 }}>
        {view === "home" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Ciao, {user.nome || user.email}! 👋</h1>
            <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Benvenuto nella tua area personale</p>
<Btn variant="ghost" onClick={onLogout} style={{ marginBottom: 16, fontSize: 12, padding: "6px 14px", color: C.red, borderColor: C.red + "88" }}>← Esci</Btn>
            <Card style={{ background: `linear-gradient(135deg, ${C.primary}, #2D6E52)`, marginBottom: 20 }}>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 4 }}>IL TUO PERCORSO</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{user.ruolo === "paziente_eb" ? "🩺 Percorso EB BodyMind" : "💪 Percorso Allenamento"}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Il tuo trainer sta preparando la tua scheda</div>
              </div>
            </Card>
            <Card style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>📋 La tua scheda</h3>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>La tua scheda personalizzata sarà disponibile qui non appena il tuo trainer la creerà.</p>
            </Card>
          </div>
        )}
        {view === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
            <div style={{ padding: "16px 0 12px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
              <Avatar size={40} bg="#E8F0FF" />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Il tuo Trainer</div>
                <div style={{ fontSize: 12, color: C.accent }}>● Disponibile</div>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 12 }}>
              {msgs.length === 0 && <p style={{ color: C.muted, fontSize: 14, textAlign: "center", marginTop: 40 }}>Nessun messaggio. Scrivi al tuo trainer!</p>}
              {msgs.map((m,i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.da_utente===user.email ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.da_utente===user.email ? "16px 4px 16px 16px" : "4px 16px 16px 16px", background: m.da_utente===user.email ? C.primary : C.surface, color: m.da_utente===user.email ? "#fff" : C.text, fontSize: 14 }}>
                    {m.testo}
                    <div style={{ fontSize: 10, opacity: 0.55, marginTop: 4, textAlign: "right" }}>{m.ora}</div>
                  </div>
                </div>
              ))}
              <div ref={msgRef} />
            </div>
            <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMsg()} placeholder="Scrivi al tuo trainer..." style={{ flex: 1, padding: "12px 16px", borderRadius: 24, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", background: C.bg }} />
              <button onClick={sendMsg} style={{ width: 44, height: 44, borderRadius: 22, background: C.primary, border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>↑</button>
            </div>
          </div>
        )}
        {view === "profilo" && (
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Il Mio Profilo</h1>
            <Card style={{ padding: 20, marginBottom: 14 }}>
              <Input label="Nome" value={profilo.nome || ""} onChange={e => setProfilo({...profilo, nome: e.target.value})} />
              <Input label="Cognome" value={profilo.cognome || ""} onChange={e => setProfilo({...profilo, cognome: e.target.value})} />
              <Input label="Telefono" value={profilo.telefono || ""} onChange={e => setProfilo({...profilo, telefono: e.target.value})} />
              <Input label="Altezza (cm)" value={profilo.altezza || ""} onChange={e => setProfilo({...profilo, altezza: e.target.value})} />
              <Input label="Peso (kg)" value={profilo.peso || ""} onChange={e => setProfilo({...profilo, peso: e.target.value})} />
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>⚠️ Condizioni di Salute</div>
                <textarea value={profilo.condizioni || ""} onChange={e => setProfilo({...profilo, condizioni: e.target.value})} placeholder="Descrivi ferite, dolori, operazioni..." rows={5} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, resize: "none", outline: "none", fontFamily: "inherit" }} />
              </div>
              <Btn full variant="dark" onClick={saveProfilo} style={{ borderRadius: 10, padding: 12 }}>💾 Salva Profilo</Btn>
            </Card>
            <Btn full variant="ghost" onClick={onLogout} style={{ borderRadius: 10, padding: 12, color: C.red, borderColor: C.red + "88" }}>← Esci dall'account</Btn>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.surface, borderTop: `1px solid ${C.border}`, display: "flex", padding: "8px 0 14px", zIndex: 100 }}>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = `* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: sans-serif; }`;
    document.head.appendChild(s);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from("pazienti").select("*").eq("email", session.user.email).single().then(({ data }) => {
          if (data) setUser({ ...data, role: data.ruolo });
          else setUser({ email: session.user.email, role: "cliente" });
          setLoading(false);
        });
      } else { setLoading(false); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💚</div>
        <div style={{ color: C.muted, fontSize: 15 }}>Caricamento...</div>
      </div>
    </div>
  );

  if (!user) return <LoginScreen onLogin={setUser} />;
  if (user.ruolo === "admin" || user.role === "admin" || user.email === "barneschi.alessandro@gmail.com") return <AdminApp user={user} onLogout={handleLogout} />;
  return <ClienteApp user={user} onLogout={handleLogout} />;
}
