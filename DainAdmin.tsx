import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, LabelList } from 'recharts';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [salesRange, setSalesRange] = useState('일간');
  
  const theme = { bg: '#050505', card: '#121212', point: '#ff4081', naver: '#03c75a', info: '#2196f3', text: '#ffffff', gray: '#888', border: '#222' };

  const funnelData = [
    { name: '노출', value: 12500, fill: '#333' },
    { name: '클릭', value: 4200, fill: '#555' },
    { name: '상세', value: 1850, fill: '#2196f3' },
    { name: '결제', value: 420, fill: '#ff4081' }
  ];

  const naverSales = {
    '일간': { total: '3,420,000', up: '12.4%', data: [{n:'05.09', s:280}, {n:'05.10', s:310}, {n:'오늘', s:342}] },
    '주간': { total: '21,400,000', up: '8.2%', data: [{n:'1주', s:1800}, {n:'2주', s:2100}, {n:'3주', s:1950}, {n:'4주', s:2400}] },
    '월간': { total: '92,000,000', up: '15.7%', data: [{n:'3월', s:7200}, {n:'4월', s:8500}, {n:'오늘', s:9200}] }
  };

  const menuItems = [
    { id: 'dashboard', label: '1. 📊 통합 대시보드' },
    { id: 'naver', label: '2. 🍀 네이버 스마트스토어' },
    { id: 'inventory', label: '3. 📦 재고 & 목표' },
    { id: 'tiktok', label: '4. 🎵 TikTok 실시간' },
    { id: 'youtube', label: '5. 📺 YouTube 실시간' },
    { id: 'insta', label: '6. 📸 Instagram 실시간' },
    { id: 'shortform', label: '7. 🎬 숏폼 전략실' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif' }}>
      <aside style={{ width: '260px', borderRight: `1px solid ${theme.border}`, backgroundColor: '#0A0A0A' }}>
        <div style={{ padding: '30px 24px', fontSize: '22px', fontWeight: '900', color: theme.point }}>DAIN ADMIN</div>
        <nav>
          {menuItems.map(item => (
            <div key={item.id} onClick={() => setTab(item.id)} style={{ padding: '14px 24px', cursor: 'pointer', fontSize: '13px', color: tab === item.id ? theme.point : '#777', backgroundColor: tab === item.id ? '#161616' : 'transparent', borderLeft: tab === item.id ? `4px solid ${theme.point}` : '4px solid transparent', fontWeight: tab === item.id ? 'bold' : 'normal' }}>
              {item.label}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ margin: 0 }}>INTEGRATED DASHBOARD</h2>
              <div style={{ background: 'rgba(255, 64, 129, 0.1)', padding: '12px 20px', borderRadius: '10px', border: `1px solid ${theme.point}` }}>
                <div style={{ fontSize: '11px', color: theme.point, fontWeight: 'bold' }}>🚨 긴급 알람</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>리바이브 세럼 품절 임박!</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '15px' }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>실시간 매출</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>₩{naverSales[salesRange].total}</div>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '15px' }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>전체 전환율(CVR)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px', color: theme.info }}>4.85%</div>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '15px' }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>오늘 방문자</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>12,402명</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '15px', height: '350px' }}>
                <h4 style={{ marginBottom: '15px', color: theme.gray }}>매출 트렌드</h4>
                <ResponsiveContainer>
                  <AreaChart data={naverSales[salesRange].data}>
                    <CartesianGrid stroke="#222" vertical={false}/>
                    <XAxis dataKey="n" stroke="#555" fontSize={11}/>
                    <YAxis stroke="#555" fontSize={11}/>
                    <Tooltip contentStyle={{background:'#111', border:'none'}}/>
                    <Area type="monotone" dataKey="s" stroke={theme.point} fill={theme.point} fillOpacity={0.1}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '15px', height: '350px' }}>
                <h4 style={{ marginBottom: '15px', color: theme.gray }}>구매 퍼널 분석</h4>
                <ResponsiveContainer>
                  <BarChart data={funnelData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#ccc" width={60} fontSize={11} />
                    <Bar dataKey="value" radius={[0, 5, 5, 0]} barSize={25}>
                      {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      <LabelList dataKey="value" position="right" style={{ fill: '#fff', fontSize: '10px' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        {tab === 'naver' && (
          <div>
            <h2 style={{ color: theme.naver }}>🍀 네이버 스마트스토어 관리</h2>
            <p>상승률: +{naverSales[salesRange].up}</p>
          </div>
        )}
        {tab === 'inventory' && <h2>📦 재고 및 목표 관리</h2>}
        {['tiktok', 'youtube', 'insta'].includes(tab) && <h2 style={{textTransform:'uppercase'}}>{tab} 실시간 분석 중</h2>}
        {tab === 'shortform' && <h2>🎬 숏폼 전략실</h2>}
      </main>
    </div>
  );
}