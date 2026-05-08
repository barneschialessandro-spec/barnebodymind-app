import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#EFF5F1", surface: "#FFFFFF", primary: "#1A3D2E", primaryHov: "#254F3B",
  accent: "#3DC98A", accentSoft: "#C8F0E0", text: "#0D1F17", muted: "#6B8C7A",
  border: "#D5E4DC", orange: "#F07048", red: "#DC4C4C", yellow: "#F5BE30",
  shadow: "0 2px 16px rgba(26,61,46,0.09)", shadowLg: "0 8px 32px rgba(26,61,46,0.13)",
};

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>💚</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: C.primary, marginBottom: 10 }}>BarneBodyMind</h1>
        <p style={{ fontSize: 18, color: C.muted, marginBottom: 30 }}>Piattaforma di allenamento personalizzato</p>
        <div style={{ background: C.accentSoft, padding: "16px 32px", borderRadius: 12, color: C.primary, fontWeight: 600 }}>
          ✅ Server attivo e funzionante!
        </div>
      </div>
    </div>
  );
}
