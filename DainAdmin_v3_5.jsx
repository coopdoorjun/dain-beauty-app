import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, LabelList
} from 'recharts';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [naverRange, setNaverRange] = useState('일간');

  const theme = { bg: '#050505', card: '#121212', point: '#ff4081', success: '#4caf50', naver: '#03c75a', info: '#2196f3', text: '#ffffff', gray: '#888', border: '#222' };

  // --- 1. 통합 대시보드용 데이터 (구매 퍼널) ---
  const funnelData = [
    { step: '노출', value: 100, display: '12,500', fill: '#333' },
    { step: '클릭', value: 40, display: '4,200', fill: '#555' },
    { step: '상세페이지', value: 15, display: '1,800', fill: theme.info },
    { step: '결제완료', value: 5, display: '450', fill: theme.point },
  ];

  // --- 2. 네이버 스마트스토어 데이터 (매출 및 요약) ---
  const naverSalesData = {
    '일간': { total: '₩3,420,000', rate: '12.4%', data: [{n:'05.10', s:280}, {n:'05.11', s:310}, {n:'오늘', s:342}] },
    '주간': { total: '₩21,400,000', rate: '8.2%', data: [{n:'1주', s:1800}, {n:'2주', s:2100}, {n:'3주', s:1950}, {n:'4주', s:2400}] },
    '월간': { total: '₩92,000,000', rate: '15.7%', data: [{n:'3월', s:7200}, {n:'4월', s:8500}, {n:'5월', s:9200}] }
  };

  const socialMock = { follower: '124K', views: '2.4M', likes: '150K' };

  // --- 공통 레이아웃 컴포넌트 ---
  const SidebarItem = (id, label) => (
    <div onClick={() => setTab(id)} style={{ 
      padding: '16px 20px', cursor: 'pointer', fontSize: '13px', 
      color: tab === id ? theme.point : '#999', 
      backgroundColor: tab === id ? '#161616' : 'transparent',
      borderLeft: tab === id ? `4px solid ${theme.point}` : '4px solid transparent',
      fontWeight: tab === id ? 'bold' : 'normal', transition: '0.3s' 
    }}>{label}</div>
  );

  const StatBox = (label, value, color, subText, isAlert = false) => (
    <div style={{ 
      backgroundColor: isAlert ? 'rgba(255, 64, 129, 0.1)' : theme.card, 
      padding: '20px', borderRadius: '12px', border: `1px solid ${isAlert ? theme.point : theme.border}` 
    }}>
      <div style={{ fontSize: '11px', color: theme.gray, marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: color }}>{value}</div>
      <div style={{ fontSize: '11px', marginTop: '6px', color: isAlert ? theme.point : theme.success }}>{subText}</div>
    </div>
  );

  const PlatformLive = (name, color) => (
    <div>
      <h2 style={{ color, marginBottom: '20px' }}>{name} 실시간 분석</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        {StatBox('팔로워', socialMock.follower, color, '▲ 1.2%')}
        {StatBox('누적 조회수', socialMock.views, theme.text, '▲ 240K')}
        {StatBox('반응률', '6.8%', theme.success, '업계 평균 상회')}
      </div>
      <div style={{ height: '300px', backgroundColor: theme.card, borderRadius: '12px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.gray }}>
        [실시간 {name} 영상 피드 데이터 시각화 영역]
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'Pretendard, sans-serif' }}>
      {/* 사이드바 */}
      <aside style={{ width: '240px', borderRight: `1px solid ${theme.border}`, backgroundColor: '#080808' }}>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '4px', color: theme.point }}>DAIN ADMIN</div>
          <div style={{ fontSize: '10px', color: theme.gray, marginTop: '5px' }}>v3.5 PREMIUM EDITION</div>
        </div>
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

      {/* 메인 콘텐츠 */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* 1. 통합 대시보드 */}
        {tab === 'dashboard' && (
          <div>
            <h2 style={{ marginBottom: '25px', fontWeight: '800' }}>INTEGRATED DASHBOARD</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
              {StatBox('실시간 매출', '₩3,420,000', theme.text, '▲ 12%')}
              {StatBox('전체 전환율', '4.8%', theme.info, '목표 5.0% 대비 근접')}
              {StatBox('방문자수', '12,402', theme.text, '실시간 접속 45')}
              {StatBox('🚨 긴급 알람', '재고 부족', theme.point, '리바이브 세럼 (2개 남음)', true)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '25px' }}>
              <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                <h4 style={{ marginBottom: '20px', color: theme.gray }}>매출 트렌드 분석</h4>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={naverSalesData['일간'].data}>
                      <CartesianGrid stroke="#222" vertical={false} />
                      <XAxis dataKey="n" stroke="#555" fontSize={12} />
                      <YAxis stroke="#555" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: '#111', border: 'none' }} />
                      <Area type="monotone" dataKey="s" stroke={theme.point} fill={theme.point} fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
                <h4 style={{ marginBottom: '20px', color: theme.gray }}>구매 퍼널 (Funnel)</h4>
                <div style={{ height: '280px' }}>
                  <ResponsiveContainer>
                    <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="step" type="category" stroke="#ccc" fontSize={11} width={80} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor:'#111', border:'none'}} />
                      <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={35}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList dataKey="display" position="right" style={{ fill: '#fff', fontSize: '12px' }} />
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
              <h2 style={{ color: theme.naver, fontWeight: '800' }}>🍀 NAVER SMART STORE</h2>
              <div style={{ background: '#111', padding: '5px', borderRadius: '8px' }}>
                {['일간', '주간', '월간'].map(r => (
                  <button key={r} onClick={() => setNaverRange(r)} style={{ 
                    padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                    background: naverRange === r ? theme.naver : 'transparent', color: '#fff'
                  }}>{r}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: theme.card, padding: '25px', borderRadius: '15px', borderLeft: `5px solid ${theme.naver}` }}>
                <div style={{ fontSize: '12px', color: theme.gray }}>{naverRange} 총 매출액</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0' }}>{naverSalesData[naverRange].total}</div>
                <div style={{ color: theme.naver, fontSize: '13px' }}>전기 대비 ▲ {naverSalesData[naverRange].rate} 상승</div>
              </div>
              <div style={{ background: theme.card, padding: '25px', borderRadius: '15px' }}>
                <div style={{ fontSize: '12px', color: theme.gray }}>신규 주입 피드</div>
                <div style={{ fontSize: '20px', margin: '10px 0' }}>배송대기 <span style={{ color: theme.naver, fontWeight: 'bold' }}>124</span>건</div>
                <div style={{ fontSize: '11px', color: theme.gray }}>클레임/반품: 1건</div>
              </div>
              <div style={{ background: theme.card, padding: '25px', borderRadius: '15px' }}>
                <div style={{ fontSize: '12px', color: theme.gray }}>실시간 CS 문의</div>
                <div style={{ fontSize: '14px', marginTop: '10px' }}>"배송 언제 시작되나요?" <span style={{ fontSize: '10px', color: theme.naver }}>- 방금 전</span></div>
              </div>
            </div>
            
            <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '15px' }}>
              <h4 style={{ marginBottom: '15px' }}>📦 물류 및 출고 현황</h4>
              <div style={{ width: '100%', height: '10px', background: '#222', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '70%', background: theme.naver }} />
                <div style={{ width: '20%', background: theme.info }} />
                <div style={{ width: '10%', background: theme.point }} />
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '15px', fontSize: '12px', color: theme.gray }}>
                <span>● 출고완료 (70%)</span> <span>● 배송중 (20%)</span> <span>● 취소/환불 (10%)</span>
              </div>
            </div>
          </div>
        )}

        {/* 3~6번 카테고리 (유지 및 동일 구조) */}
        {tab === 'inventory' && <div style={{ padding: '40px', textAlign: 'center', color: theme.gray }}>[재고 및 목표 상세 테이블 영역]</div>}
        {tab === 'tiktok' && PlatformLive('TikTok', '#00f2ea')}
        {tab === 'youtube' && PlatformLive('YouTube', '#ff0000')}
        {tab === 'insta' && PlatformLive('Instagram', '#e1306c')}

        {/* 7. 숏폼 전략실 */}
        {tab === 'shortform' && (
          <div>
            <h2 style={{ marginBottom: '25px' }}>🎬 숏폼 제작 전략실</h2>
            <div style={{ backgroundColor: theme.card, padding: '30px', borderRadius: '15px', border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.point, marginBottom: '15px' }}>AI 추천 후킹 문구</div>
              <div style={{ fontSize: '22px', padding: '20px', background: '#000', borderRadius: '10px', borderLeft: `5px solid ${theme.point}` }}>
                "피부 뒤집어졌는데 화장해야 한다고요? 딱 이것만 하세요."
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
