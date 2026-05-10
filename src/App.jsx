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
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", color: C.text, background: "#fff" }} />
  </div>
);

const Avatar = ({ size = 40, bg = C.accentSoft }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.48, flexShrink: 0 }}>👤</div>
);
function InstallButton() {
  const [prompt, setPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setIsIOS(/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()));
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setPrompt(e);
    });
    window.addEventListener('appinstalled', () => setInstalled(true));
  }, []);

  if (installed) return null;

  if (isIOS) return (
    <div style={{ marginTop: 12, padding: "10px 16px", background: "rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 13, color: "#fff" }}>
      📲 Tocca <strong>Condividi</strong> → <strong>Aggiungi alla Home</strong>
    </div>
  );

  if (!prompt) return null;

  return (
    <button onClick={() => prompt.prompt()} style={{ marginTop: 12, padding: "10px 24px", background: C.accent, border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
      📲 Installa App
    </button>
  );
}

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
          <div style={{ fontSize: 60, marginBottom: 12 }}>🏋🏻‍♂️</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>BarneBodyMind</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, marginTop: 5 }}>Piattaforma di allenamento personalizzato</p>
       <InstallButton />
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
function CreaScheda({ cliente, esercizi, onBack }) {
  const [nome, setNome] = useState("");
  const [durata, setDurata] = useState("");
  const [inizio, setInizio] = useState("");
  const [fine, setFine] = useState("");
  const [giorni, setGiorni] = useState([{ giorno: "Lunedì", esercizi: [] }]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const aggiungiGiorno = () => setGiorni(prev => [...prev, { giorno: "Lunedì", esercizi: [] }]);

  const aggiungiEsercizio = (gi) => {
    setGiorni(prev => prev.map((g, i) => i !== gi ? g : {
      ...g, esercizi: [...g.esercizi, { esercizio_id: "", serie: 3, ripetizioni: 12, tempo: "", recupero: "90 sec", note: "" }]
    }));
  };

  const salva = async () => {
    if (!nome) { setMsg("❌ Inserisci il nome della scheda."); return; }
    setSaving(true);
    const { data: scheda } = await supabase.from("schede").insert([{ paziente_id: cliente.id, nome, durata, data_inizio: inizio, data_fine: fine, attiva: true }]).select().single();
    if (scheda) {
      for (let gi = 0; gi < giorni.length; gi++) {
        const { data: g } = await supabase.from("giorni_scheda").insert([{ scheda_id: scheda.id, giorno: giorni[gi].giorno, ordine: gi }]).select().single();
        if (g) {
          for (const ex of giorni[gi].esercizi) {
            if (ex.esercizio_id) {
              await supabase.from("esercizi_scheda").insert([{ giorno_id: g.id, esercizio_id: ex.esercizio_id, serie: ex.serie, ripetizioni: ex.ripetizioni, tempo: ex.tempo, recupero: ex.recupero, note: ex.note, completato: false }]);
            }
          }
        }
      }
      setMsg("✅ Scheda salvata!");
      setTimeout(() => onBack(), 1500);
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <Btn size="sm" variant="ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Torna ai clienti</Btn>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Crea Scheda</h1>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>Cliente: <strong>{cliente.nome} {cliente.cognome}</strong></p>
      <Card style={{ padding: 22, marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>📋 Dati Scheda</h3>
        <Input label="Nome Scheda" value={nome} onChange={e => setNome(e.target.value)} placeholder="es. Scheda Recupero Fase 1" />
        <Input label="Durata" value={durata} onChange={e => setDurata(e.target.value)} placeholder="es. 8 settimane" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label="Data Inizio" type="date" value={inizio} onChange={e => setInizio(e.target.value)} />
          <Input label="Data Fine" type="date" value={fine} onChange={e => setFine(e.target.value)} />
        </div>
      </Card>
      {giorni.map((g, gi) => (
        <Card key={gi} style={{ padding: 22, marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <select value={g.giorno} onChange={e => setGiorni(prev => prev.map((x, i) => i !== gi ? x : { ...x, giorno: e.target.value }))}
              style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit" }}>
              {["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"].map(d => <option key={d}>{d}</option>)}
            </select>
            <Btn size="sm" variant="soft" onClick={() => aggiungiEsercizio(gi)}>+ Esercizio</Btn>
          </div>
          {g.esercizi.map((ex, ei) => (
            <div key={ei} style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 10 }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 5 }}>Esercizio</div>
                <select value={ex.esercizio_id} onChange={e => setGiorni(prev => prev.map((x, i) => i !== gi ? x : { ...x, esercizi: x.esercizi.map((ex2, ei2) => ei2 !== ei ? ex2 : { ...ex2, esercizio_id: e.target.value }) }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit" }}>
                  <option value="">-- Seleziona esercizio --</option>
                  {esercizi.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                {[["Serie", "serie"], ["Ripetizioni", "ripetizioni"]].map(([l, k]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{l}</div>
                    <input type="number" value={ex[k]} onChange={e => setGiorni(prev => prev.map((x, i) => i !== gi ? x : { ...x, esercizi: x.esercizi.map((ex2, ei2) => ei2 !== ei ? ex2 : { ...ex2, [k]: e.target.value }) }))}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13 }} />
                  </div>
                ))}
                {[["Tempo", "tempo"], ["Recupero", "recupero"]].map(([l, k]) => (
                  <div key={k}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>{l}</div>
                    <input value={ex[k]} onChange={e => setGiorni(prev => prev.map((x, i) => i !== gi ? x : { ...x, esercizi: x.esercizi.map((ex2, ei2) => ei2 !== ei ? ex2 : { ...ex2, [k]: e.target.value }) }))}
                      placeholder={k === "tempo" ? "es. 30 sec" : "es. 90 sec"}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13 }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 4 }}>Note personalizzate</div>
                <input value={ex.note} onChange={e => setGiorni(prev => prev.map((x, i) => i !== gi ? x : { ...x, esercizi: x.esercizi.map((ex2, ei2) => ei2 !== ei ? ex2 : { ...ex2, note: e.target.value }) }))}
                  placeholder="Note specifiche per questo cliente..."
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13 }} />
              </div>
            </div>
          ))}
        </Card>
      ))}
      <Btn variant="ghost" onClick={aggiungiGiorno} full style={{ marginBottom: 16, borderRadius: 10, padding: 12 }}>+ Aggiungi Giorno</Btn>
      {msg && <div style={{ padding: "10px 14px", borderRadius: 10, background: msg.includes("✅") ? C.accentSoft : "#FDDEDE", fontSize: 13, marginBottom: 16, color: msg.includes("✅") ? "#0A7A4A" : "#A02020" }}>{msg}</div>}
      <Btn variant="dark" full onClick={salva} style={{ borderRadius: 10, padding: 13 }}>
        {saving ? "⏳ Salvataggio..." : "💾 Salva Scheda"}
      </Btn>
    </div>
  );
}
function AdminApp({ user, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [clienti, setClienti] = useState([]);
  const [esercizi, setEsercizi] = useState([]);
  const [selCliente, setSelCliente] = useState(null);
  const [selScheda, setSelScheda] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const msgRef = useRef(null);

  useEffect(() => {
    supabase.from("pazienti").select("*").neq("ruolo", "admin").then(({ data }) => data && setClienti(data));
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
        {view === "clienti" && !selScheda && (
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
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <Btn variant="dark" full onClick={() => setSelScheda({ cliente: p, modo: "nuova" })} style={{ borderRadius: 10, padding: "10px 0", fontSize: 13 }}>📋 Crea Scheda</Btn>
          </div>
        </Card>
      ))}
    </div>
  </div>
)}
{view === "clienti" && selScheda && (
  <CreaScheda cliente={selScheda.cliente} esercizi={esercizi} onBack={() => setSelScheda(null)} />
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
