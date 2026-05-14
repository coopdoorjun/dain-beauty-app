/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// --- 디자인 테마 및 상수 (사용자님 원본 그대로 보존) ---
const T = { bg: "#020202", surface: "#070707", border: "#1A1A1A", point: "#FF3366", teal: "#00E5CC", gold: "#FFB800", text: "#F0F0F0", sub: "#666666", dim: "#2A2A2A", green: "#00C87A" };
const GS = { pink: "linear-gradient(135deg,#FF3366 0%,#FF6B9D 100%)" };
const glass = { background: "rgba(15,15,15,0.75)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" };

const SALES_DATA = [{ n: "05.07", s: 2100000 }, { n: "05.08", s: 2650000 }, { n: "05.09", s: 2800000 }, { n: "05.10", s: 3100000 }, { n: "05.11", s: 2950000 }, { n: "05.12", s: 3420000 }];
const INVENTORY = [
  { name: "세라마이드 토너", stock: 124, status: "안전" },
  { name: "리바이브 세럼", stock: 12, status: "품절임박" },
  { name: "선크림 SPF50", stock: 88, status: "안전" }
];

// --- 컴포넌트 ---
const Logo = () => <span style={{ fontSize: 24, fontWeight: "bold", fontFamily: "Helvetica", background: GS.pink, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>d:ain</span>;

const KpiCard = ({ label, value, color, sub }) => (
  <div style={{ ...glass, padding: "20px", flex: 1 }}>
    <div style={{ fontSize: 11, color: T.sub, marginBottom: 10 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color: color || T.text }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: T.sub, marginTop: 8 }}>{sub}</div>}
  </div>
);

// --- 메인 앱 ---
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("dashboard");

  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div style={{ ...glass, padding: 40, textAlign: "center", width: 320 }}>
          <Logo /><br /><br />
          <input type="password" placeholder="PASSWORD" style={{ width: "100%", padding: 12, marginBottom: 15, background: "#111", border: "1px solid #333", color: "#fff", borderRadius: 10 }} />
          <button onClick={() => setLoggedIn(true)} style={{ width: "100%", padding: 14, background: GS.pink, border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, cursor: "pointer" }}>LOGIN</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "sans-serif" }}>
      <aside style={{ width: 230, background: T.surface, borderRight: `1px solid ${T.border}`, padding: "20px" }}>
        <Logo /><br /><br />
        <div style={{ marginTop: 20 }}>
          <div onClick={() => setTab("dashboard")} style={{ padding: "12px", cursor: "pointer", color: tab === "dashboard" ? T.point : T.sub }}>◈ 통합 대시보드</div>
          <div onClick={() => setTab("store")} style={{ padding: "12px", cursor: "pointer", color: tab === "store" ? T.point : T.sub }}>◉ 스마트스토어</div>
          <div onClick={() => setTab("inventory")} style={{ padding: "12px", cursor: "pointer", color: tab === "inventory" ? T.point : T.sub }}>◧ 재고 관리</div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "40px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 30 }}>{tab === "dashboard" ? "통합 대시보드" : tab === "store" ? "스마트스토어" : "재고 관리"}</h1>

        {tab === "dashboard" && (
          <>
            <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
              <KpiCard label="오늘 매출" value="₩3,420,000" color={T.green} sub="전일비 +12.4%" />
              <KpiCard label="전체 CVR" value="3.1%" color={T.teal} sub="전일비 +0.5%p" />
              <KpiCard label="평균 ROAS" value="7.2x" color={T.gold} sub="목표 초과" />
            </div>
            <div style={{ ...glass, padding: 24, height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="n" stroke="#444" />
                  <YAxis stroke="#444" />
                  <Tooltip contentStyle={{ background: "#111", border: "none" }} />
                  <Area type="monotone" dataKey="s" stroke={T.point} fill={T.point} fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === "inventory" && (
          <div style={{ ...glass, padding: 24 }}>
            {INVENTORY.map(item => (
              <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: `1px solid ${T.border}` }}>
                <span>{item.name}</span>
                <span style={{ color: item.status === "안전" ? T.green : T.point }}>{item.stock}개 ({item.status})</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}