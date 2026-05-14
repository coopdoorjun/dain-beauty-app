/* eslint-disable */
// @ts-nocheck
import { useState, useCallback, useEffect } from "react";
import { AreaChart,Area,BarChart,Bar,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from "recharts";

interface NavItem{id:string;icon:string;label:string;alert?:number}
interface Video{rank:number;views:string;likes:string;comments:string;shares:string;thumbnail:string}
interface SocialChannel{followers:string;followerGrowth:string;color:string;label:string;videos:Video[]}
interface InventoryItem{name:string;stock:number;daily:number;days:number;status:string;price:number;cost:number;ad:number}
interface CSItem{ch:string;user:string;msg:string;time:string;urgent:boolean}
interface GovProgram{name:string;agency:string;deadline:string;dday:number;tag:string;amount:string;url:string}
interface KpiData{sales:string;cvr:string;roas:string}

const NAVER_STORE="https://smartstore.naver.com/dain_kr";
const SOCIAL_ID="@imdainii";
const T={bg:"#020202",surface:"#070707",card:"#0D0D0D",card2:"#111111",border:"#1A1A1A",border2:"#222222",point:"#FF3366",teal:"#00E5CC",gold:"#FFB800",blue:"#3D8BFF",green:"#00C87A",warn:"#FF7A2F",text:"#F0F0F0",sub:"#666666",dim:"#2A2A2A"};
const GS={pink:"linear-gradient(135deg,#FF3366 0%,#FF6B9D 100%)",teal:"linear-gradient(135deg,#00E5CC 0%,#00B4D8 100%)",gold:"linear-gradient(135deg,#FFB800 0%,#FF8C00 100%)",blue:"linear-gradient(135deg,#3D8BFF 0%,#7B61FF 100%)",green:"linear-gradient(135deg,#00C87A 0%,#00E5A0 100%)"};
const glass:React.CSSProperties={background:"rgba(15,15,15,0.75)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,boxShadow:"0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.04)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"};

const SALES_BASE:Record<string,{n:string;s:number}[]>={
  일간:[{n:"05.07",s:2100000},{n:"05.08",s:2650000},{n:"05.09",s:2800000},{n:"05.10",s:3100000},{n:"05.11",s:2950000},{n:"05.12",s:3420000}],
  주간:[{n:"4/3W",s:15400000},{n:"4/4W",s:17200000},{n:"5/1W",s:18900000},{n:"5/2W",s:21400000}],
  월간:[{n:"3월",s:62000000},{n:"4월",s:78500000},{n:"5월",s:72000000}],
};
const CVR_BASE=[{n:"05.07",cvr:2.1},{n:"05.08",cvr:2.4},{n:"05.09",cvr:2.2},{n:"05.10",cvr:2.8},{n:"05.11",cvr:2.6},{n:"05.12",cvr:3.1}];
const ROAS_BASE:Record<string,{n:string;r:number}[]>={
  일간:[{n:"05.07",r:4.8},{n:"05.08",r:5.2},{n:"05.09",r:4.9},{n:"05.10",r:6.1},{n:"05.11",r:6.8},{n:"05.12",r:7.2}],
  주간:[{n:"4/3W",r:4.5},{n:"4/4W",r:5.1},{n:"5/1W",r:5.8},{n:"5/2W",r:6.2}],
  월간:[{n:"3월",r:4.2},{n:"4월",r:5.4},{n:"5월",r:6.5}],
};
const FUNNEL_DATA=[{name:"노출",value:182400,fill:T.blue},{name:"클릭",value:24830,fill:T.teal},{name:"페이지 체류",value:9640,fill:T.gold},{name:"결제 완료",value:1058,fill:T.green}];
const INVENTORY:InventoryItem[]=[
  {name:"세라마이드 토너",stock:124,daily:10,days:12,status:"안전",price:28000,cost:9800,ad:3200},
  {name:"리바이브 세럼",stock:12,daily:6,days:2,status:"품절임박",price:45000,cost:16000,ad:5500},
  {name:"선크림 SPF50",stock:88,daily:4,days:22,status:"안전",price:22000,cost:7500,ad:2800},
];
const CS_FEED:CSItem[]=[
  {ch:"스토어",user:"sunshine_k",msg:"배송 언제 올까요?",time:"2분 전",urgent:true},
  {ch:"TikTok",user:"beautylog_7",msg:"세럼 성분 알러지 걱정돼서요",time:"8분 전",urgent:true},
  {ch:"인스타",user:"dain_fan09",msg:"토너 리뷰 써도 될까요?",time:"22분 전",urgent:false},
  {ch:"YouTube",user:"anti_skin",msg:"팩 후 따가워요 ㅠ",time:"1시간 전",urgent:false},
];
const GOV_PROGRAMS:GovProgram[]=[
  {name:"청년창업사관학교 5기 모집",agency:"창업진흥원",deadline:"2025-06-15",dday:8,tag:"청년창업",amount:"최대 1억",url:"https://www.k-startup.go.kr/"},
  {name:"경기도 뷰티산업 수출지원",agency:"경기기업비서",deadline:"2025-06-22",dday:15,tag:"뷰티",amount:"2,000만원",url:"https://www.egbiz.or.kr/"},
  {name:"화성시 소공인 제품개발지원",agency:"기업마당",deadline:"2025-07-03",dday:26,tag:"화성시",amount:"1,500만원",url:"https://www.bizinfo.go.kr/"},
];

const fmt=(n:number)=>Number(n).toLocaleString("ko-KR");
const pct=(a:number,b:number)=>Math.round((a/b)*100);

function Logo(){ return <span style={{fontSize:24,fontWeight:"bold",letterSpacing:"-0.5px",fontFamily:"Helvetica",background:GS.pink,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>d:ain</span>; }
function Badge({children,color=T.point}:{children:React.ReactNode;color?:string}){ return <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:color+"20",color,border:"1px solid "+color+"40",fontWeight:700}}>{children}</span>; }

function KpiCard({label,value,color=T.text,sub,icon,onRefresh}:{label:string;value:string;color?:string;sub?:string;icon?:string;onRefresh?:()=>void}){
  return(
    <div style={{...glass,padding:"20px 22px",position:"relative"}}>
      <div style={{fontSize:11,color:T.sub,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        {icon&&<span>{icon}</span>}{label}
        {onRefresh&&<button onClick={onRefresh} style={{marginLeft:"auto",background:"none",border:"1px solid #333",color:T.sub,fontSize:9,cursor:"pointer",borderRadius:4,padding:"2px 5px"}}>🔄 실시간</button>}
      </div>
      <div style={{fontSize:24,fontWeight:800,color}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:T.sub,marginTop:8}}>{sub}</div>}
    </div>
  );
}

export default function App(){
  const[loggedIn,setLoggedIn]=useState(false);
  const[tab,setTab]=useState("dashboard");
  const[isMobile,setIsMobile]=useState(false);
  const[drawerOpen,setDrawerOpen]=useState(false);
  const[kpi,setKpi]=useState<KpiData>({sales:"₩3,420,000",cvr:"3.1%",roas:"7.2x"});

  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<=768);
    check(); window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  const NAV:NavItem[]=[
    {id:"dashboard",icon:"◈",label:"통합 대시보드",alert:3},
    {id:"store",icon:"◉",label:"스마트스토어"},
    {id:"inventory",icon:"◧",label:"재고 & 목표"},
    {id:"social",icon:"◐",label:"소셜 통합 관리"},
    {id:"funding",icon:"◆",label:"정부지원사업"},
  ];

  if(!loggedIn) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",padding:20}}>
      <div style={{...glass,padding:40,textAlign:"center",width:350}}>
        <Logo/><br/><br/>
        <input type="password" placeholder="PASSWORD" style={{width:"100%",padding:12,marginBottom:15,background:"#111",border:"1px solid #333",color:"#fff",borderRadius:10}} />
        <button onClick={()=>setLoggedIn(true)} style={{width:"100%",padding:14,background:GS.pink,border:"none",borderRadius:12,color:"#fff",fontWeight:700,cursor:"pointer"}}>LOGIN</button>
      </div>
    </div>
  );

  const SidebarContent=()=>(
    <>
      <div style={{padding:"28px 24px",borderBottom:"1px solid "+T.border}}><Logo/></div>
      <nav style={{marginTop:20,flex:1}}>
        {NAV.map(n=>(
          <div key={n.id} onClick={()=>{setTab(n.id);setDrawerOpen(false)}} style={{padding:"14px 24px",cursor:"pointer",color:tab===n.id?T.text:T.sub,background:tab===n.id?"rgba(255,51,102,0.08)":"",fontSize:13,display:"flex",alignItems:"center",gap:10,borderLeft:tab===n.id?"3px solid "+T.point:"3px solid transparent"}}>
            <span style={{color:tab===n.id?T.point:T.dim}}>{n.icon}</span>{n.label}
          </div>
        ))}
      </nav>
    </>
  );

  return(
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Pretendard,sans-serif"}}>
      {!isMobile && <aside style={{width:232,background:T.surface,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh"}}><SidebarContent/></aside>}
      
      {isMobile && drawerOpen && <div onClick={()=>setDrawerOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:998}}/>}
      {isMobile && <aside style={{position:"fixed",top:0,left:0,height:"100vh",width:260,background:T.surface,zIndex:999,transform:drawerOpen?"translateX(0)":"translateX(-100%)",transition:"0.3s"}}><SidebarContent/></aside>}

      <div style={{flex:1,minWidth:0}}>
        {isMobile && <header style={{height:60,background:T.surface,display:"flex",alignItems:"center",padding:"0 20px",borderBottom:"1px solid "+T.border}}><button onClick={()=>setDrawerOpen(true)} style={{background:"none",border:"none",color:"#fff",fontSize:24}}>☰</button><div style={{marginLeft:20}}><Logo/></div></header>}
        
        <main style={{padding:isMobile?20:40}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:30}}>
            <h1 style={{fontSize:22,fontWeight:900}}>{NAV.find(n=>n.id===tab)?.label}</h1>
            <button onClick={()=>setKpi({...kpi,sales:"₩"+fmt(Math.floor(Math.random()*1000000)+3000000)})} style={{padding:"10px 20px",background:GS.pink,border:"none",borderRadius:10,color:"#fff",fontWeight:700,cursor:"pointer"}}>⚡ 즉시 새로고침</button>
          </div>

          {tab==="dashboard"&&(
            <>
              <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12,marginBottom:20}}>
                <KpiCard label="오늘 매출" value={kpi.sales} color={T.green} sub="전일비 +12.4%" onRefresh={()=>{}}/>
                <KpiCard label="전체 CVR" value={kpi.cvr} color={T.teal} sub="전일비 +0.5%p"/>
                <KpiCard label="평균 ROAS" value={kpi.roas} color={T.gold} sub="목표 5.0x 초과"/>
                <KpiCard label="미처리 긴급" value="3건" color={T.point}/>
              </div>
              <div style={{...glass,padding:24,height:300}}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_BASE.일간}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/>
                    <XAxis dataKey="n" stroke="#444" fontSize={10}/>
                    <YAxis stroke="#444" fontSize={10}/>
                    <Tooltip contentStyle={{background:"#111",border:"none"}}/>
                    <Area type="monotone" dataKey="s" stroke={T.point} fill={T.point} fillOpacity={0.1} strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {tab==="store"&&(
            <div style={{display:"grid",gap:20}}>
              <div style={{...glass,padding:24}}>
                <h3 style={{marginBottom:20}}>📦 물류현황판 <button style={{fontSize:10,background:"none",border:"1px solid #333",color:T.sub,padding:"3px 7px",borderRadius:4,marginLeft:10}}>🔄 실시간 현황</button></h3>
                <div style={{display:"flex",gap:15,flexWrap:"wrap"}}>
                  <div style={{background:"#111",padding:"15px 20px",borderRadius:12,flex:1,minWidth:150}}>오늘 주문: 142건</div>
                  <div style={{background:"#111",padding:"15px 20px",borderRadius:12,flex:1,minWidth:150}}>출고 대기: 18건</div>
                  <div style={{background:"#111",padding:"15px 20px",borderRadius:12,flex:1,minWidth:150}}>CS 미답변: <span style={{color:T.point}}>2건</span></div>
                </div>
              </div>
            </div>
          )}

          {tab==="inventory"&&(
            <div style={{...glass,padding:24}}>
              <h3 style={{marginBottom:20}}>📦 재고 관리</h3>
              {INVENTORY.map(item=>(
                <div key={item.name} style={{display:"flex",justifyContent:"space-between",padding:"15px 0",borderBottom:"1px solid #1a1a1a"}}>
                  <span>{item.name}</span>
                  <Badge color={item.status==="안전"?T.green:T.point}>{item.stock}개 ({item.status})</Badge>
                </div>
              ))}
            </div>
          )}

          {tab==="social" && <div style={{...glass,padding:24}}>📱 소셜 통합 관리 화면 (준비 중)</div>}
          {tab==="funding" && <div style={{...glass,padding:24}}>🏛️ 정부지원사업 공고 확인 (준비 중)</div>}
        </main>
      </div>
    </div>
  );
}
