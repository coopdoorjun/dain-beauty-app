import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, LabelList, PieChart, Pie
} from 'recharts';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [naverRange, setNaverRange] = useState('일간');

  const theme = { 
    bg: '#050505', card: '#121212', point: '#ff4081', success: '#4caf50', 
    naver: '#03c75a', info: '#2196f3', text: '#ffffff', gray: '#888', border: '#222' 
  };

  // --- 1. 통합 대시보드: 구매 퍼널 데이터 ---
  const funnelData = [
    { step: '노출', value: 12500, fill: '#333' },
    { step: '클릭', value: 4200, fill: '#555' },
    { step: '상세페이지', value: 1800, fill: theme.info },
    { step: '결제완료', value: 450, fill: theme.point },
  ];

  // --- 2. 네이버 스마트스토어 전용 데이터 ---
  const naverSales = {
    '일간': { total: '₩3,420,000', up: '12.4%', data: [{n:'05.10', s:280}, {n:'05.11', s:310}, {n:'오늘', s:342}] },
    '주간': { total: '₩21,400,000', up: '8.2%', data: [{n:'1주', s:1800}, {n:'2주', s:2100}, {n:'3주', s:1950}, {n:'4주', s:2400}] },
    '월간': { total: '₩92,000,000', up: '15.7%', data: [{n:'3월', s:7200}, {n:'4월', s:8500}, {n:'5월', s:9200}] }
  };

  // --- 사이드바 메뉴 렌더링 ---
  const SidebarItem = (id, label) => (
    <div onClick={() => setTab(id)} style={{ 
      padding: '16px 20px', cursor: 'pointer', fontSize: '13px', 
      color: tab === id ? theme.point : '#888', 
      backgroundColor: tab === id ? '#161616' : 'transparent',
      borderLeft: tab === id ? `4px solid ${theme.point}` : '4px solid transparent',
      fontWeight: tab === id ? 'bold' : 'normal'
    }}>{label}</div>
  );

  // --- 소셜 실시간 레이아웃 공통 ---
  const SocialLayout = (title, color) => (
    <div>
      <h2 style={{ color, marginBottom: '20px', fontWeight: '900' }}>{title} 실시간 분석</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: theme.card, padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: theme.gray }}>실시간 팔로워</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>124.5K</div>
        </div>
        <div style={{ background: theme.card, padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: theme.gray }}>영상 조회수</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2.4M</div>
        </div>
        <div style={{ background: theme.card, padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '11px', color: theme.gray }}>참여도</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.success }}>8.2%</div>
        </div>
      </div>
      <div style={{ height: '300px', background: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        콘텐츠 성과 실시간 트래킹 중...
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif' }}>
      <aside style={{ width: '250px', borderRight: `1px solid ${theme.border}`, backgroundColor: '#080808' }}>
        <div style={{ padding: '40px 24px', color: theme.point, fontSize: '22px', fontWeight: '900', letterSpacing: '3px' }}>DAIN ADMIN</div>
        <nav>
          {SidebarItem('dashboard', '1. 📊 통합 대시보드')}
          {SidebarItem('naver', '2. 🍀 네이버 스마트스토어')}
          {SidebarItem('inventory', '3. 📦 재고 & 목표')}
          {SidebarItem('tiktok', '4. 🎵 TikTok 실시간')}
          {SidebarItem('youtube', '5. 📺 YouTube 실시간')}
          {SidebarItem('insta', '6. 📸 Instagram 실시간')}
          {SidebarItem('shortform', '7. 🎬 숏폼 전략실')}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* 1. 통합 대시보드 */}
        {tab === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: '25px' }}>통합 대시보드</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '25px' }}>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>실시간 총 매출</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.success }}>₩4,250,000</div>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>전체 전환율(CVR)</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.info }}>4.85%</div>
              </div>
              <div style={{ background: theme.card, padding: '20px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: '11px', color: theme.gray }}>방문자수</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12,402</div>
              </div>
              <div style={{ background: 'rgba(255, 64, 129, 0.1)', padding: '20px', borderRadius: '12px', border: `1px solid ${theme.point}` }}>
                <div style={{ fontSize: '11px', color: theme.point, fontWeight: 'bold' }}>🚨 긴급 알람</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>리바이브 세럼 품절 임박</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
              <div style={{ background: theme.card, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                <h4 style={{ marginBottom: '20px', color: theme.gray }}>매출 트렌드 분석</h4>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer><AreaChart data={naverSales['일간'].data}><CartesianGrid stroke="#222" vertical={false}/><XAxis dataKey="n" stroke="#555" fontSize={12}/><YAxis stroke="#555" fontSize={12}/><Tooltip contentStyle={{backgroundColor:'#111',border:'none'}}/><Area type="monotone" dataKey="s" stroke={theme.point} fill={theme.point} fillOpacity={0.1}/></AreaChart></ResponsiveContainer>
                </div>
              </div>
              <div style={{ background: theme.card, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                <h4 style={{ marginBottom: '20px', color: theme.gray }}>구매 퍼널 (Funnel)</h4>
                <div style={{ height: '250px' }}>
                  <ResponsiveContainer>
                    <BarChart data={funnelData} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="step" type="category" stroke="#ccc" fontSize={11} width={80} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30}>
                        {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                        <LabelList dataKey="value" position="right" style={{fill:'#fff', fontSize:'11px'}} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 네이버 스마트스토어 */}
        {tab === 'naver' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ color: theme.naver }}>🍀 NAVER SMART STORE 관리</h2>
              <div style={{ background: '#111', padding: '5px', borderRadius: '8px' }}>
                {['일간', '주간', '월간'].map(r => (
                  <button key={r} onClick={() => setNaverRange(r)} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: naverRange === r ? theme.naver : 'transparent', color: '#fff' }}>{r}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
               <div style={{ background: theme.card, padding: '25px', borderRadius: '12px', borderLeft: `5px solid ${theme.naver}` }}>
                  <div style={{ fontSize: '11px', color: theme.gray }}>{naverRange} 총 매출</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{naverSales[naverRange].total}</div>
                  <div style={{ color: theme.naver, fontSize: '13px' }}>상승률 ▲ {naverSales[naverRange].up}</div>
               </div>
               <div style={{ background: theme.card, padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: theme.gray }}>실시간 CS 피드</div>
                  <div style={{ fontSize: '14px', marginTop: '10px' }}>"배송 언제 오나요?" <span style={{color:theme.naver}}>- 답변대기</span></div>
               </div>
               <div style={{ background: theme.card, padding: '25px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: theme.gray }}>물류 현황</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px' }}>출고 대기: <span style={{color:theme.info}}>42건</span></div>
               </div>
            </div>
          </div>
        )}

        {/* 3. 재고 & 목표 */}
        {tab === 'inventory' && (
          <div style={{ background: theme.card, padding: '30px', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>재고 및 월간 목표</h2>
            <div style={{ width: '100%', height: '10px', background: '#333', borderRadius: '5px', marginBottom: '10px' }}>
              <div style={{ width: '72%', height: '100%', background: theme.point, borderRadius: '5px' }}></div>
            </div>
            <div style={{ fontSize: '14px' }}>월 목표 달성률: 72% (₩72,000,000 / ₩100,000,000)</div>
          </div>
        )}

        {/* 4~6. 소셜 실시간 */}
        {tab === 'tiktok' && SocialLayout('TikTok', '#00f2ea')}
        {tab === 'youtube' && SocialLayout('YouTube', '#ff0000')}
        {tab === 'insta' && SocialLayout('Instagram', '#e1306c')}

        {/* 7. 숏폼 전략실 */}
        {tab === 'shortform' && (
          <div style={{ background: theme.card, padding: '30px', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
            <h2 style={{ marginBottom: '20px' }}>🎬 숏폼 제작 전략</h2>
            <div style={{ padding: '20px', background: '#000', borderRadius: '10px', borderLeft: `5px solid ${theme.point}` }}>
               <div style={{ color: theme.gray, fontSize: '12px', marginBottom: '10px' }}>AI 추천 훅(HOOK)</div>
               <div style={{ fontSize: '18px', fontWeight: 'bold' }}>"피부 뒤집어졌는데 화장해야 한다고요? 딱 이것만 하세요."</div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
