/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const T = { bg: "#020202", surface: "#070707", card: "#0D0D0D", border: "#1A1A1A", point: "#FF3366", teal: "#00E5CC", gold: "#FFB800", text: "#F0F0F0", sub: "#666666" };
const GS = { pink: "linear-gradient(135deg,#FF3366 0%,#FF6B9D 100%)", teal: "linear-gradient(135deg,#00E5CC 0%,#00B4D8 100%)" };
const glass = { background: "rgba(15,15,15,0.75)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" };

const SALES_DATA = [{n:"05.10",s:3100000},{n:"05.11",s:2950000},{n:"05.12",s:3420000},{n:"05.13",s:3100000},{n:"05.14",s:3800000}];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [kpi, setKpi] = useState({ sales: "3,420,000", cvr: "3.1", roas: "7.2" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setKpi({
        sales: (Math.floor(Math.random() * 1000000) + 3000000).toLocaleString(),
        cvr: (Math.random() * 2 + 2).toFixed(1),
        roas: (Math.random() * 3 + 5).toFixed(1)
      });
      setLoading(false);
    }, 600);
  };

  if (!loggedIn) return (
    <div style={{ height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ ...glass, padding: 40, textAlign: "center", width: 320 }}>
        <h2 style={{ color: T.point, marginBottom: 20 }}>d:ain Admin</h2>
        <input type="password" placeholder="Password" style={{ width: "100%", padding: 12, marginBottom: 10, background: "#111", border: "1px solid #333", color: "#fff", borderRadius: 8 }} />
        <button onClick={() => setLoggedIn(true)} style={{ width: "100%", padding: 12, background: GS.pink, border: "none", color: "#fff", fontWeight: "bold", borderRadius: 8, cursor: "pointer" }}>Login</button>
      </div>
    </div>
  );

  const navItems = [
    { id: "dashboard", label: "💰 통합 대시보드" },
    { id: "store", label: "🛒 스마트스토어" },
    { id: "social", label: "📱 소셜 관리" },
    { id: "inventory", label: "📦 재고 & 목표" },
    { id: "funding", label: "🏛️ 정부지원사업" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "sans-serif" }}>
      {/* 사이드바 (데스크톱) */}
      {!isMobile && (
        <aside style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, padding: 25 }}>
          <h1 style={{ color: T.point, fontSize: 24, fontWeight: "bold", marginBottom: 40 }}>d:ain</h1>
          {navItems.map(n => (
            <div key={n.id} onClick={() => setTab(n.id)} style={{ padding: "15px 10px", cursor: "pointer", color: tab === n.id ? T.point : T.sub, fontWeight: tab === n.id ? "bold" : "400", borderLeft: tab === n.id ? `3px solid ${T.point}` : "3px solid transparent", transition: "0.2s" }}>{n.label}</div>
          ))}
        </aside>
      )}

      {/* 모바일 헤더 & 메뉴 */}
      {isMobile && (
        <>
          <header style={{ position: "fixed", top: 0, width: "100%", height: 60, background: T.surface, display: "flex", alignItems: "center", padding: "0 20px", zIndex: 100, borderBottom: `1px solid ${T.border}` }}>
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 24 }}>☰</button>
            <span style={{ marginLeft: 15, fontWeight: "bold", color: T.point }}>d:ain</span>
          </header>
          {menuOpen && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 200, padding: 40 }}>
              <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", right: 20, top: 20, fontSize: 30, color: "#fff", background: "none", border: "none" }}>×</button>
              {navItems.map(n => (
                <div key={n.id} onClick={() => { setTab(n.id); setMenuOpen(false); }} style={{ fontSize: 20, padding: "20px 0", borderBottom: `1px solid ${T.border}` }}>{n.label}</div>
              ))}
            </div>
          )}
        </>
      )}

      <main style={{ flex: 1, padding: isMobile ? "80px 20px 20px" : 40, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <h2 style={{ fontSize: 22 }}>{navItems.find(n => n.id === tab).label}</h2>
          <button onClick={refreshData} style={{ padding: "10px 20px", background: GS.pink, border: "none", borderRadius: 8, color: "#fff", fontWeight: "bold", cursor: "pointer" }}>{loading ? "갱신 중..." : "⚡ 즉시 새로고침"}</button>
        </div>

        {tab === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 20, marginBottom: 30 }}>
              <div style={{ ...glass, padding: 25 }}>
                <div style={{ color: T.sub, fontSize: 12, marginBottom: 10 }}>오늘 매출 <span onClick={refreshData} style={{ cursor: "pointer", marginLeft: 5 }}>🔄</span></div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}>₩{kpi.sales}</div>
              </div>
              <div style={{ ...glass, padding: 25 }}>
                <div style={{ color: T.sub, fontSize: 12, marginBottom: 10 }}>전체 CVR <span onClick={refreshData} style={{ cursor: "pointer", marginLeft: 5 }}>🔄</span></div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: T.teal }}>{kpi.cvr}%</div>
              </div>
              <div style={{ ...glass, padding: 25 }}>
                <div style={{ color: T.sub, fontSize: 12, marginBottom: 10 }}>평균 ROAS <span onClick={refreshData} style={{ cursor: "pointer", marginLeft: 5 }}>🔄</span></div>
                <div style={{ fontSize: 28, fontWeight: "bold", color: T.gold }}>{kpi.roas}x</div>
              </div>
            </div>
            <div style={{ ...glass, padding: 25, height: 350 }}>
              <h3 style={{ marginBottom: 20 }}>📊 매출 트렌드</h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="n" stroke="#444" />
                  <YAxis stroke="#444" />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #333" }} />
                  <Area type="monotone" dataKey="s" stroke={T.point} fill={T.point} fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === "store" && (
          <div style={{ ...glass, padding: 25 }}>
            <h3 style={{ marginBottom: 20 }}>📦 물류현황판 <button onClick={refreshData} style={{ fontSize: 10, padding: "5px 10px", marginLeft: 10, cursor: "pointer" }}>🔄 실시간</button></h3>
            <p style={{ color: T.sub }}>모든 상품이 정상 출고 대기 중입니다.</p>
            <div style={{ marginTop: 20, padding: 15, background: "#111", borderRadius: 10 }}>
              <span style={{ color: T.teal }}>당일 발송율: 99.8%</span>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div style={{ display: "grid", gap: 15 }}>
            <div style={{ ...glass, padding: 20 }}>세라마이드 토너: 124개 (안전)</div>
            <div style={{ ...glass, padding: 20, border: "1px solid #FF3366" }}>리바이브 세럼: 12개 (품절임박)</div>
          </div>
        )}

        {tab === "social" && <div style={{ ...glass, padding: 25 }}>소셜 미디어 통합 데이터 분석 중...</div>}
        {tab === "funding" && <div style={{ ...glass, padding: 25 }}>정부지원사업 공고 5건 확인됨.</div>}
      </main>
    </div>
  );
}
