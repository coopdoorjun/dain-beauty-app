import { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Types ────────────────────────────────────────────────
interface NavItem { id: string; icon: string; label: string; alert?: number; }
interface Video { rank: number; views: string; likes: string; comments: string; shares: string; thumbnail: string; }
interface SocialChannel { followers: string; followerGrowth: string; color: string; label: string; videos: Video[]; }
interface InventoryItem { name: string; stock: number; daily: number; days: number; status: string; price: number; cost: number; ad: number; }
interface CSItem { ch: string; user: string; msg: string; time: string; urgent: boolean; }
interface GovProgram { name: string; agency: string; deadline: string; dday: number; tag: string; amount: string; url: string; }
interface SalesPoint { n: string; s: number; }
interface RoasPoint { n: string; r: number; }
interface CvrPoint { n: string; cvr: number; }
interface KpiData { sales: string; cvr: string; roas: string; }

// ── Constants ────────────────────────────────────────────
const NAVER_STORE = "https://smartstore.naver.com/dain_kr";
const SOCIAL_ID   = "@imdainii";

const T = {
  bg: "#020202", surface: "#070707", card: "#0D0D0D", card2: "#111111",
  border: "#1A1A1A", border2: "#222222",
  point: "#FF3366", teal: "#00E5CC", gold: "#FFB800",
  blue: "#3D8BFF", green: "#00C87A", warn: "#FF7A2F",
  text: "#F0F0F0", sub: "#666666", dim: "#2A2A2A",
};
const GS = {
  pink:  "linear-gradient(135deg,#FF3366 0%,#FF6B9D 100%)",
  teal:  "linear-gradient(135deg,#00E5CC 0%,#00B4D8 100%)",
  gold:  "linear-gradient(135deg,#FFB800 0%,#FF8C00 100%)",
  blue:  "linear-gradient(135deg,#3D8BFF 0%,#7B61FF 100%)",
  green: "linear-gradient(135deg,#00C87A 0%,#00E5A0 100%)",
};
const glassCard: React.CSSProperties = {
  background: "rgba(15,15,15,0.7)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 18,
  boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
};

const SALES_BASE: Record<string, SalesPoint[]> = {
  일간: [{n:"05.07",s:2100000},{n:"05.08",s:2650000},{n:"05.09",s:2800000},{n:"05.10",s:3100000},{n:"05.11",s:2950000},{n:"05.12",s:3420000}],
  주간: [{n:"4/3W",s:15400000},{n:"4/4W",s:17200000},{n:"5/1W",s:18900000},{n:"5/2W",s:21400000}],
  월간: [{n:"3월",s:62000000},{n:"4월",s:78500000},{n:"5월",s:72000000}],
};
const CVR_BASE: CvrPoint[] = [{n:"05.07",cvr:2.1},{n:"05.08",cvr:2.4},{n:"05.09",cvr:2.2},{n:"05.10",cvr:2.8},{n:"05.11",cvr:2.6},{n:"05.12",cvr:3.1}];
const ROAS_BASE: Record<string, RoasPoint[]> = {
  일간: [{n:"05.07",r:4.8},{n:"05.08",r:5.2},{n:"05.09",r:4.9},{n:"05.10",r:6.1},{n:"05.11",r:6.8},{n:"05.12",r:7.2}],
  주간: [{n:"4/3W",r:4.5},{n:"4/4W",r:5.1},{n:"5/1W",r:5.8},{n:"5/2W",r:6.2}],
  월간: [{n:"3월",r:4.2},{n:"4월",r:5.4},{n:"5월",r:6.5}],
};
const FUNNEL_DATA = [
  {name:"노출",value:182400,fill:T.blue},
  {name:"클릭",value:24830,fill:T.teal},
  {name:"페이지 체류",value:9640,fill:T.gold},
  {name:"결제 완료",value:1058,fill:T.green},
];
const INVENTORY: InventoryItem[] = [
  {name:"세라마이드 토너",stock:124,daily:10,days:12,status:"안전",price:28000,cost:9800,ad:3200},
  {name:"리바이브 세럼",stock:12,daily:6,days:2,status:"품절임박",price:45000,cost:16000,ad:5500},
  {name:"선크림 SPF50",stock:88,daily:4,days:22,status:"안전",price:22000,cost:7500,ad:2800},
];
const CS_FEED: CSItem[] = [
  {ch:"스토어",user:"sunshine_k",msg:"배송 언제 올까요?",time:"2분 전",urgent:true},
  {ch:"TikTok",user:"beautylog_7",msg:"세럼 성분 알러지 걱정돼서요",time:"8분 전",urgent:true},
  {ch:"인스타",user:"dain_fan09",msg:"토너 리뷰 써도 될까요?",time:"22분 전",urgent:false},
  {ch:"YouTube",user:"anti_skin",msg:"팩 후 따가워요 ㅠ",time:"1시간 전",urgent:false},
];
const GOV_PROGRAMS: GovProgram[] = [
  {name:"청년창업사관학교 5기 모집",agency:"창업진흥원",deadline:"2025-06-15",dday:8,tag:"청년창업",amount:"최대 1억",url:"https://www.k-startup.go.kr/"},
  {name:"경기도 뷰티산업 수출지원",agency:"경기기업비서",deadline:"2025-06-22",dday:15,tag:"뷰티",amount:"2,000만원",url:"https://www.egbiz.or.kr/"},
  {name:"화성시 소공인 제품개발지원",agency:"기업마당",deadline:"2025-07-03",dday:26,tag:"화성시",amount:"1,500만원",url:"https://www.bizinfo.go.kr/"},
  {name:"K-뷰티 글로벌 진출 패키지",agency:"창업진흥원",deadline:"2025-07-10",dday:33,tag:"뷰티",amount:"3,000만원",url:"https://www.k-startup.go.kr/"},
  {name:"청년 디지털 마케팅 바우처",agency:"기업마당",deadline:"2025-07-20",dday:43,tag:"청년창업",amount:"500만원",url:"https://www.bizinfo.go.kr/"},
];
const GOV_SOURCES = [
  {name:"기업마당",color:T.blue,url:"https://www.bizinfo.go.kr/",desc:"중소기업 지원사업 통합포털"},
  {name:"경기기업비서",color:T.teal,url:"https://www.egbiz.or.kr/",desc:"경기도 기업지원 플랫폼"},
  {name:"창업진흥원",color:T.point,url:"https://www.k-startup.go.kr/",desc:"K-Startup 창업지원포털"},
];
const SOCIAL_DATA: Record<string, SocialChannel> = {
  tiktok:{followers:"12.4K",followerGrowth:"+284",color:"#00E5CC",label:"TikTok",videos:[{rank:1,views:"148K",likes:"9.2K",comments:"342",shares:"1.8K",thumbnail:"https://picsum.photos/seed/tk1/80/110"},{rank:2,views:"87K",likes:"5.4K",comments:"218",shares:"924",thumbnail:"https://picsum.photos/seed/tk2/80/110"},{rank:3,views:"62K",likes:"3.1K",comments:"145",shares:"510",thumbnail:"https://picsum.photos/seed/tk3/80/110"},{rank:4,views:"34K",likes:"1.9K",comments:"88",shares:"290",thumbnail:"https://picsum.photos/seed/tk4/80/110"}]},
  insta:{followers:"8.7K",followerGrowth:"+132",color:"#E1306C",label:"Instagram",videos:[{rank:1,views:"92K",likes:"7.1K",comments:"284",shares:"1.2K",thumbnail:"https://picsum.photos/seed/ig1/80/110"},{rank:2,views:"55K",likes:"4.2K",comments:"196",shares:"640",thumbnail:"https://picsum.photos/seed/ig2/80/110"},{rank:3,views:"38K",likes:"2.8K",comments:"110",shares:"390",thumbnail:"https://picsum.photos/seed/ig3/80/110"},{rank:4,views:"21K",likes:"1.5K",comments:"67",shares:"180",thumbnail:"https://picsum.photos/seed/ig4/80/110"}]},
  youtube:{followers:"3.2K",followerGrowth:"+58",color:"#FF0000",label:"YouTube",videos:[{rank:1,views:"24K",likes:"1.4K",comments:"198",shares:"320",thumbnail:"https://picsum.photos/seed/yt1/80/110"},{rank:2,views:"18K",likes:"940",comments:"142",shares:"210",thumbnail:"https://picsum.photos/seed/yt2/80/110"},{rank:3,views:"11K",likes:"580",comments:"88",shares:"120",thumbnail:"https://picsum.photos/seed/yt3/80/110"},{rank:4,views:"7K",likes:"310",comments:"54",shares:"78",thumbnail:"https://picsum.photos/seed/yt4/80/110"}]},
};
const SCRIPTS: Record<string,Record<string,{hook:string;body:string;shot:string;cta:string;hashtags:Record<string,string[]>}>> = {
  "토너":{"문제성피부":{hook:"피부 뒤집어졌는데 화장해야 한다고요? 딱 이것만 하세요.",body:"성난 피부 진정시키고 화장까지 잘 먹게 만드는 다인 세라마이드 토너.",shot:"뒤집어진 피부에 토너 팩 → 화장 착 붙는 클로즈업",cta:"스토어찜하면 진정 꿀팁 더 보기 가능!",hashtags:{tiktok:["#피부진정","#토너추천","#문제성피부","#dain뷰티","#kbeauty"],insta:["#다인","#세라마이드토너","#문제성피부케어"],youtube:["#피부진정토너","#문제성피부솔루션"]}},"지속력":{hook:"오후만 되면 화장 다 무너지는 분들 필독!",body:"기초부터 탄탄하게 잡아주는 수분 장벽. 다인 토너로 레이어링하면 밤까지 OK.",shot:"오전 9시 vs 오후 6시 피부 유지력 비교",cta:"스토어찜하고 롱라스팅 화장 비법 확인!",hashtags:{tiktok:["#지속력메이크업","#화장오래가는법","#dain"],insta:["#롱라스팅","#화장지속력"],youtube:["#화장오래가는법"]}}},
  "세럼":{"문제성피부":{hook:"트러블 자국 때문에 화장 두꺼워지는 게 고민이라면?",body:"진정 성분 가득 담은 세럼으로 피부 컨디션부터 회복하세요.",shot:"스포이드 낙하 제형 컷 → 붉은기 가라앉는 과정",cta:"다인 뷰티 스토어찜하고 할인 쿠폰 챙기기!",hashtags:{tiktok:["#트러블케어","#세럼추천","#dain세럼"],insta:["#트러블피부","#세럼루틴"],youtube:["#트러블세럼"]}},"지속력":{hook:"깐달걀 피부 결, 세럼 하나로 끝내고 싶나요?",body:"화장 지속력을 2배로 늘려주는 고농축 영양막.",shot:"세럼 바른 후 손가락으로 쫀쫀함 테스트",cta:"단골 전용 혜택, 스토어찜 누르고 확인!",hashtags:{tiktok:["#글래스스킨","#세럼추천"],insta:["#글라스스킨","#세럼루틴"],youtube:["#글래스스킨세럼"]}}},
};
const CHECKLIST = ["조명 세팅 완료","배경 정리 완료","제품 준비 완료","대본 숙지 완료","카메라 초점 설정","음성 녹음 테스트","자막 템플릿 준비","CTA 멘트 확인"];

// ── Helpers ──────────────────────────────────────────────
const fmt = (n: number) => Number(n).toLocaleString("ko-KR");
const pct = (a: number, b: number) => Math.round((a / b) * 100);
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const simulateMobileFetch = async (): Promise<void> => {
  const delay = 500 + Math.random() * 1500;
  const _headers = {
    "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "cross-site",
    "sec-fetch-dest": "document",
  };
  await new Promise(resolve => setTimeout(resolve, delay));
};

// ── Sub-components ───────────────────────────────────────
function Logo() {
  const [err, setErr] = useState(false);
  return err ? (
    <span style={{fontSize:26,fontWeight:"bold" as const,letterSpacing:"-0.5px",fontFamily:"Helvetica, Arial, sans-serif",background:GS.pink,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>d:ain</span>
  ) : (
    <img src="./assets/logo.png" alt="DAIN" onError={()=>setErr(true)} style={{height:32,objectFit:"contain"}} />
  );
}

function Badge({children,color=T.point}:{children:React.ReactNode;color?:string}) {
  return <span style={{fontSize:10,padding:"3px 9px",borderRadius:20,background:color+"20",color,border:"1px solid "+color+"40",fontWeight:700,letterSpacing:0.5}}>{children}</span>;
}

function KPI({label,value,color=T.text,sub,icon,gradient,onRefresh}:{label:string;value:string;color?:string;sub?:string;icon?:string;gradient?:string;onRefresh?:()=>void}) {
  const [loading,setLoading]=useState(false);
  const handle=async()=>{
    if(!onRefresh)return;
    setLoading(true);
    await simulateMobileFetch();
    onRefresh();
    setLoading(false);
  };
  return (
    <div style={{...glassCard,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
      {gradient&&<div style={{position:"absolute",top:0,right:0,width:90,height:90,background:gradient,opacity:0.07,borderRadius:"0 18px 0 90px"}}/>}
      <div style={{fontSize:11,color:T.sub,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        {icon&&<span style={{fontSize:14}}>{icon}</span>}{label}
        {onRefresh&&<button onClick={handle} style={{marginLeft:"auto",background:"transparent",border:"1px solid "+T.border2,color:T.sub,padding:"2px 8px",borderRadius:6,fontSize:9,cursor:"pointer"}}>
          {loading?"⏳":"🔄"} 실시간
        </button>}
      </div>
      <div style={{fontSize:24,fontWeight:800,color,letterSpacing:"-1px",lineHeight:1}}>{loading?"갱신 중…":value}</div>
      {sub&&<div style={{fontSize:11,color:T.sub,marginTop:8,lineHeight:1.5}}>{sub}</div>}
    </div>
  );
}

function SectionTitle({children,accent=T.point,emoji}:{children:React.ReactNode;accent?:string;emoji?:string}) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
      {emoji&&<span style={{fontSize:16}}>{emoji}</span>}
      <div style={{width:3,height:18,borderRadius:2,background:accent,boxShadow:"0 0 8px "+accent+"88"}}/>
      <h3 style={{margin:0,fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase" as const,color:T.text}}>{children}</h3>
    </div>
  );
}

function RefreshBtn({onClick,loading}:{onClick:()=>void;loading:boolean}) {
  return (
    <button onClick={onClick} disabled={loading} style={{background:loading?"rgba(255,51,102,0.15)":GS.pink,border:"none",color:"#fff",padding:"6px 14px",borderRadius:8,fontSize:10,cursor:loading?"not-allowed":"pointer",fontWeight:700,boxShadow:loading?"none":"0 4px 12px rgba(255,51,102,0.35)",transition:"all 0.2s",display:"flex",alignItems:"center",gap:5}}>
      {loading ? "⏳ 갱신 중…" : "🔄 실시간 현황 파악"}
    </button>
  );
}

function ProgressBar({pct:p,color=T.point,height=6}:{pct:number;color?:string;height?:number}) {
  return (
    <div style={{width:"100%",height,background:T.dim,borderRadius:3,overflow:"hidden"}}>
      <div style={{width:Math.min(p,100)+"%",height:"100%",background:color,borderRadius:3,transition:"width 0.8s cubic-bezier(0.4,0,0.2,1)",boxShadow:"0 0 8px "+color+"55"}}/>
    </div>
  );
}

function FunnelViz() {
  const total=FUNNEL_DATA[0].value;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {FUNNEL_DATA.map((d,i)=>{
        const w=pct(d.value,total);
        const prev=i>0?FUNNEL_DATA[i-1].value:null;
        const dropout=prev?Math.round((1-d.value/prev)*100):null;
        return (
          <div key={d.name}>
            {dropout!==null&&<div style={{display:"flex",justifyContent:"center",fontSize:10,color:T.warn,marginBottom:6}}>↓ 이탈 {dropout}%</div>}
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:82,fontSize:11,color:T.sub,textAlign:"right",flexShrink:0}}>{d.name}</div>
              <div style={{flex:1,height:30,background:T.border,borderRadius:6,overflow:"hidden"}}>
                <div style={{width:w+"%",height:"100%",background:d.fill,display:"flex",alignItems:"center",paddingLeft:12,transition:"width 1s ease",boxShadow:"2px 0 10px "+d.fill+"44"}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#000",whiteSpace:"nowrap"}}>{fmt(d.value)}</span>
                </div>
              </div>
              <div style={{width:34,fontSize:11,color:T.sub,textAlign:"right",flexShrink:0}}>{w}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ChartTip=({active,payload,label}:any)=>{
  if(!active||!payload?.length)return null;
  return (
    <div style={{...glassCard,padding:"10px 14px",fontSize:11}}>
      <div style={{color:T.sub,marginBottom:4}}>{label}</div>
      {payload.map((p:any,i:number)=><div key={i} style={{color:p.color||T.text,fontWeight:700}}>{p.name}: {p.value}</div>)}
    </div>
  );
};

// ── Login Screen ─────────────────────────────────────────
function LoginScreen({onLogin}:{onLogin:()=>void}) {
  const [id,setId]=useState("");
  const [pw,setPw]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const handle=async()=>{
    setLoading(true);setErr("");
    await new Promise(r=>setTimeout(r,600));
    if(id==="admin"&&pw==="1234"){onLogin();}
    else{setErr("아이디 또는 비밀번호가 올바르지 않습니다.");}
    setLoading(false);
  };
  return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Pretendard,-apple-system,system-ui,sans-serif"}}>
      <style>{`@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');*{box-sizing:border-box;}input{outline:none;}`}</style>
      <div style={{...glassCard,padding:"48px 44px",width:"100%",maxWidth:400,textAlign:"center" as const}}>
        <div style={{marginBottom:32}}>
          <Logo/>
          <div style={{fontSize:11,color:T.sub,marginTop:10,letterSpacing:2}}>ADMIN DASHBOARD v4.0</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
          <input value={id} onChange={e=>setId(e.target.value)} placeholder="아이디" style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+T.border2,borderRadius:10,padding:"13px 16px",color:T.text,fontSize:13,width:"100%"}} />
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handle()} placeholder="비밀번호" style={{background:"rgba(255,255,255,0.04)",border:"1px solid "+T.border2,borderRadius:10,padding:"13px 16px",color:T.text,fontSize:13,width:"100%"}} />
        </div>
        {err&&<div style={{fontSize:11,color:T.point,marginBottom:14}}>{err}</div>}
        <button onClick={handle} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:GS.pink,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 20px rgba(255,51,102,0.4)",transition:"all 0.2s"}}>
          {loading?"로그인 중…":"로그인"}
        </button>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [tab,setTab]=useState("dashboard");
  const [salesRange,setSalesRange]=useState("일간");
  const [roasRange,setRoasRange]=useState("일간");
  const [socialPlatform,setSocialPlatform]=useState("tiktok");
  const [sfProduct,setSfProduct]=useState("토너");
  const [sfTarget,setSfTarget]=useState("문제성피부");
  const [sfPlatform,setSfPlatform]=useState("tiktok");
  const [checklist,setChecklist]=useState<Record<number,boolean>>({});
  const [hashCopied,setHashCopied]=useState(false);
  const [kpi,setKpi]=useState<KpiData>({sales:"₩3,420,000",cvr:"3.1%",roas:"7.2x"});
  const [loadingCard,setLoadingCard]=useState<Record<string,boolean>>({});

  const urgentCount=CS_FEED.filter(c=>c.urgent).length;
  const lowStockCount=INVENTORY.filter(i=>i.days<=3).length;
  const govUrgentCount=GOV_PROGRAMS.filter(p=>p.dday<=7).length;
  const totalAlerts=urgentCount+lowStockCount+govUrgentCount;
  const checkedCount=Object.values(checklist).filter(Boolean).length;
  const currentScript=SCRIPTS[sfProduct][sfTarget];

  const refreshCard=useCallback(async(key:string,updater:()=>void)=>{
    setLoadingCard(p=>({...p,[key]:true}));
    await simulateMobileFetch();
    updater();
    setLoadingCard(p=>({...p,[key]:false}));
  },[]);

  const refreshKpi=()=>setKpi({
    sales:"₩"+fmt(rand(2800000,4200000)),
    cvr:(2+Math.random()*1.5).toFixed(1)+"%",
    roas:(5+Math.random()*3).toFixed(1)+"x",
  });

  if(!loggedIn) return <LoginScreen onLogin={()=>setLoggedIn(true)}/>;

  const NAV:NavItem[]=[
    {id:"dashboard",icon:"◈",label:"통합 대시보드",alert:totalAlerts},
    {id:"store",icon:"◉",label:"스마트스토어"},
    {id:"inventory",icon:"◧",label:"재고 & 목표"},
    {id:"social",icon:"◐",label:"소셜 통합 관리"},
    {id:"funding",icon:"◆",label:"정부지원사업",alert:govUrgentCount},
  ];

  const RBtn=({val,cur,set}:{val:string;cur:string;set:(v:string)=>void})=>(
    <button onClick={()=>set(val)} style={{background:cur===val?T.point:T.border2,border:"none",color:cur===val?"#fff":T.sub,padding:"5px 12px",borderRadius:7,fontSize:10,cursor:"pointer",fontWeight:cur===val?700:400,boxShadow:cur===val?"0 0 10px rgba(255,51,102,0.4)":"none",transition:"all 0.15s"}}>{val}</button>
  );

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"Pretendard,-apple-system,system-ui,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:2px;}
        @media(max-width:768px){
          .nav-sidebar{display:none!important;}
          .main-content{padding:20px 16px!important;}
          .grid-4{grid-template-columns:1fr 1fr!important;}
          .grid-2{grid-template-columns:1fr!important;}
          button{min-height:44px;padding:12px 16px!important;width:100%;}
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="nav-sidebar" style={{width:232,background:T.surface,borderRight:"1px solid "+T.border,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",boxShadow:"2px 0 24px rgba(0,0,0,0.5)"}}>
        <div style={{padding:"28px 24px 22px",borderBottom:"1px solid "+T.border}}>
          <Logo/>
          <div style={{fontSize:9,color:T.sub,marginTop:8,letterSpacing:2}}>{SOCIAL_ID} · ADMIN v4.0</div>
          <button onClick={()=>window.open(NAVER_STORE,"_blank")} style={{marginTop:12,width:"100%",padding:"8px 12px",background:"rgba(3,199,90,0.1)",border:"1px solid rgba(3,199,90,0.3)",borderRadius:9,color:"#03C75A",fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:0.5}}>
            🛒 디아인 네이버 스토어
          </button>
        </div>
        {totalAlerts>0&&(
          <div style={{margin:"14px 14px 0",background:"rgba(255,51,102,0.06)",border:"1px solid rgba(255,51,102,0.18)",borderRadius:12,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:T.point,fontWeight:700,letterSpacing:1.5,marginBottom:8}}>⚡ 긴급 알람</div>
            {urgentCount>0&&<div style={{fontSize:10,color:T.text,marginBottom:4}}>• 미답변 CS {urgentCount}건</div>}
            {lowStockCount>0&&<div style={{fontSize:10,color:T.warn,marginBottom:4}}>• 품절 임박 {lowStockCount}건</div>}
            {govUrgentCount>0&&<div style={{fontSize:10,color:T.gold}}>• 마감 7일 내 공고 {govUrgentCount}건</div>}
          </div>
        )}
        <nav style={{flex:1,padding:"10px 0"}}>
          {NAV.map(item=>(
            <div key={item.id} onClick={()=>setTab(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 24px",cursor:"pointer",fontSize:12,color:tab===item.id?T.text:T.sub,background:tab===item.id?"rgba(255,51,102,0.08)":"transparent",borderLeft:"3px solid "+(tab===item.id?T.point:"transparent"),transition:"all 0.15s"}}>
              <span style={{color:tab===item.id?T.point:T.dim,fontSize:15}}>{item.icon}</span>
              <span style={{flex:1,fontWeight:tab===item.id?700:400}}>{item.label}</span>
              {(item.alert??0)>0&&<span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:18,height:18,borderRadius:9,background:GS.pink,color:"#fff",fontSize:9,fontWeight:900,padding:"0 5px"}}>{item.alert}</span>}
            </div>
          ))}
        </nav>
        <div style={{padding:"14px 18px",borderTop:"1px solid "+T.border}}>
          <div style={{fontSize:9,color:T.sub,marginBottom:8,letterSpacing:1.5}}>촬영 체크리스트</div>
          <ProgressBar pct={pct(checkedCount,CHECKLIST.length)} color={checkedCount===CHECKLIST.length?T.green:T.gold} height={5}/>
          <div style={{fontSize:9,color:T.sub,marginTop:6}}>{checkedCount}/{CHECKLIST.length} 완료</div>
        </div>
        <div style={{padding:"12px 18px",borderTop:"1px solid "+T.border}}>
          <button onClick={()=>setLoggedIn(false)} style={{width:"100%",padding:"8px",background:"rgba(255,51,102,0.08)",border:"1px solid rgba(255,51,102,0.2)",borderRadius:8,color:T.point,fontSize:10,cursor:"pointer",fontWeight:700}}>로그아웃</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content" style={{flex:1,overflowY:"auto",padding:"36px 40px"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
              <div>
                <h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:1}}>💰 통합 대시보드</h1>
                <p style={{margin:"6px 0 0",fontSize:12,color:T.sub}}>전일 대비 매출 <span style={{color:T.green}}>▲ 12.4%</span> · CVR <span style={{color:T.green}}>▲ 0.5%p</span></p>
              </div>
              <button onClick={()=>window.open(NAVER_STORE,"_blank")} style={{padding:"9px 18px",background:"rgba(3,199,90,0.1)",border:"1px solid rgba(3,199,90,0.3)",borderRadius:10,color:"#03C75A",fontSize:11,fontWeight:700,cursor:"pointer"}}>🛒 네이버 스토어 바로가기</button>
            </div>
            <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
              <KPI label="오늘 매출" value={kpi.sales} color={T.green} sub="전일비 +12.4%" icon="💰" gradient={GS.green} onRefresh={()=>setKpi(p=>({...p,sales:"₩"+fmt(rand(2800000,4200000))}))}/>
              <KPI label="전체 CVR" value={kpi.cvr} color={T.teal} sub="전일비 +0.5%p" icon="⚡" gradient={GS.teal} onRefresh={()=>setKpi(p=>({...p,cvr:(2+Math.random()*1.5).toFixed(1)+"%"}))}/>
              <KPI label="평균 ROAS" value={kpi.roas} color={T.gold} sub="목표 5.0x 초과" icon="📈" gradient={GS.gold} onRefresh={()=>setKpi(p=>({...p,roas:(5+Math.random()*3).toFixed(1)+"x"}))}/>
              <KPI label="미처리 긴급" value={totalAlerts+"건"} color={totalAlerts>0?T.point:T.green} sub="CS · 재고 · 공고" icon="🔔" gradient={GS.pink}/>
            </div>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              <div style={{...glassCard,padding:26}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <SectionTitle emoji="📊">매출 트렌드</SectionTitle>
                  <div style={{display:"flex",gap:4}}>
                    {["일간","주간","월간"].map(r=><RBtn key={r} val={r} cur={salesRange} set={setSalesRange}/>)}
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                  <RefreshBtn loading={!!loadingCard["sales"]} onClick={()=>refreshCard("sales",()=>{})}/>
                </div>
                <div style={{height:180}}>
                  <ResponsiveContainer>
                    <AreaChart data={SALES_BASE[salesRange]}>
                      <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FF3366" stopOpacity={0.4}/><stop offset="100%" stopColor="#FF3366" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid stroke={T.border} vertical={false} strokeDasharray="3 3"/>
                      <XAxis dataKey="n" stroke={T.dim} fontSize={10} tickLine={false} axisLine={false}/>
                      <YAxis stroke={T.dim} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>(v/1000000).toFixed(1)+"M"}/>
                      <Tooltip content={<ChartTip/>} formatter={(v:number)=>["₩"+fmt(v),"매출"]}/>
                      <Area type="monotone" dataKey="s" stroke={T.point} strokeWidth={2.5} fill="url(#sg)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{...glassCard,padding:26}}>
                <SectionTitle accent={T.teal} emoji="🔽">구매 퍼널 분석</SectionTitle>
                <FunnelViz/>
                <div style={{marginTop:16,padding:"10px 14px",background:"rgba(0,229,204,0.06)",border:"1px solid rgba(0,229,204,0.15)",borderRadius:10}}>
                  <div style={{fontSize:11,color:T.teal}}>📌 최종 전환율: <strong>{((FUNNEL_DATA[3].value/FUNNEL_DATA[0].value)*100).toFixed(2)}%</strong> · 최대 이탈: 노출→클릭 (86%)</div>
                </div>
              </div>
            </div>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
              <div style={{...glassCard,padding:26}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <SectionTitle accent={T.teal} emoji="📈">CVR 트렌드</SectionTitle>
                  <RefreshBtn loading={!!loadingCard["cvr"]} onClick={()=>refreshCard("cvr",()=>{})}/>
                </div>
                <div style={{height:170}}>
                  <ResponsiveContainer>
                    <LineChart data={CVR_BASE}>
                      <CartesianGrid stroke={T.border} vertical={false} strokeDasharray="3 3"/>
                      <XAxis dataKey="n" stroke={T.dim} fontSize={10} tickLine={false} axisLine={false}/>
                      <YAxis stroke={T.dim} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>v+"%"} domain={[1.5,3.5]}/>
                      <Tooltip content={<ChartTip/>} formatter={(v:number)=>[v+"%","CVR"]}/>
                      <Line type="monotone" dataKey="cvr" stroke={T.teal} strokeWidth={2.5} dot={{fill:T.teal,r:4,strokeWidth:0}} activeDot={{r:6}}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{...glassCard,padding:26}}>
                <SectionTitle accent={T.point} emoji="⚡">긴급 알람</SectionTitle>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {urgentCount>0&&<div style={{background:"rgba(255,51,102,0.06)",border:"1px solid rgba(255,51,102,0.18)",borderRadius:12,padding:"12px 14px"}}><div style={{fontSize:10,color:T.point,fontWeight:700,marginBottom:6}}>💬 미답변 CS {urgentCount}건</div>{CS_FEED.filter(c=>c.urgent).map((c,i)=><div key={i} style={{fontSize:10,color:T.sub,lineHeight:1.6}}>{c.ch} · {c.user}: {c.msg.slice(0,14)}...</div>)}</div>}
                  {lowStockCount>0&&<div style={{background:"rgba(255,122,47,0.06)",border:"1px solid rgba(255,122,47,0.18)",borderRadius:12,padding:"12px 14px"}}><div style={{fontSize:10,color:T.warn,fontWeight:700,marginBottom:6}}>📦 품절 임박 {lowStockCount}건</div>{INVENTORY.filter(i=>i.days<=3).map((item,i)=><div key={i} style={{fontSize:10,color:T.sub,lineHeight:1.6}}>{item.name} — {item.days}일치</div>)}</div>}
                  {govUrgentCount>0&&<div style={{background:"rgba(255,184,0,0.06)",border:"1px solid rgba(255,184,0,0.18)",borderRadius:12,padding:"12px 14px"}}><div style={{fontSize:10,color:T.gold,fontWeight:700,marginBottom:6}}>📋 마감 임박 {govUrgentCount}건</div>{GOV_PROGRAMS.filter(p=>p.dday<=7).map((p,i)=><div key={i} style={{fontSize:10,color:T.sub,lineHeight:1.6}}>D-{p.dday} · {p.name.slice(0,14)}...</div>)}</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STORE ── */}
        {tab==="store"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
              <div><h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:1}}>🛒 스마트스토어 관리</h1><p style={{margin:"6px 0 0",fontSize:12,color:T.sub}}>네이버 스마트스토어 · 5분 단위 동기화</p></div>
              <button onClick={()=>window.open(NAVER_STORE,"_blank")} style={{padding:"9px 18px",background:"rgba(3,199,90,0.1)",border:"1px solid rgba(3,199,90,0.3)",borderRadius:10,color:"#03C75A",fontSize:11,fontWeight:700,cursor:"pointer"}}>🛒 스토어 바로가기</button>
            </div>
            <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
              <KPI label="오늘 매출" value="₩3,420,000" color={T.green} sub="전일비 +12.4%" gradient={GS.green} onRefresh={()=>setKpi(p=>({...p,sales:"₩"+fmt(rand(2800000,4200000))}))}/>
              <KPI label="주간 매출" value="₩21,400,000" color={T.teal} sub="전주비 +13.2%" gradient={GS.teal}/>
              <KPI label="월간 매출" value="₩72,000,000" sub="목표 대비 72%" gradient={GS.blue}/>
              <KPI label="객단가(AOV)" value="₩32,400" color={T.gold} sub="전주비 +5.1%" gradient={GS.gold} onRefresh={()=>{}}/>
            </div>
            <div style={{...glassCard,padding:26,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <SectionTitle emoji="📋">기간별 매출 요약 & 성장률</SectionTitle>
                <RefreshBtn loading={!!loadingCard["storeTable"]} onClick={()=>refreshCard("storeTable",()=>{})}/>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{borderBottom:"1px solid "+T.border2}}>{["기간","매출","전기 대비","성장률","객단가(AOV)"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontWeight:500,color:T.sub,fontSize:10,letterSpacing:0.8}}>{h}</th>)}</tr></thead>
                <tbody>{[{period:"오늘 (05.12)",sales:"3,420,000",prev:"3,042,000",growth:"+12.4%",aov:"32,400",pos:true},{period:"이번 주",sales:"21,400,000",prev:"18,900,000",growth:"+13.2%",aov:"31,800",pos:true},{period:"5월 (현재)",sales:"72,000,000",prev:"78,500,000",growth:"-8.3%",aov:"30,200",pos:false}].map((row,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid "+T.border}}>
                    <td style={{padding:"15px 16px",color:T.sub}}>{row.period}</td>
                    <td style={{padding:"15px 16px",fontWeight:700}}>₩{row.sales}</td>
                    <td style={{padding:"15px 16px",color:T.dim}}>₩{row.prev}</td>
                    <td style={{padding:"15px 16px",color:row.pos?T.green:T.point,fontWeight:700}}>{row.growth}</td>
                    <td style={{padding:"15px 16px",color:T.gold}}>₩{row.aov}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{...glassCard,padding:26}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <SectionTitle accent={T.point} emoji="💬">실시간 CS 피드</SectionTitle>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <Badge color={T.point}>미답변 {urgentCount}건</Badge>
                    <RefreshBtn loading={!!loadingCard["cs"]} onClick={()=>refreshCard("cs",()=>{})}/>
                  </div>
                </div>
                {CS_FEED.map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 0",borderBottom:"1px solid "+T.border}}>
                    <div style={{width:7,height:7,borderRadius:"50%",background:c.urgent?T.point:T.dim,flexShrink:0,marginTop:5,boxShadow:c.urgent?"0 0 8px "+T.point:"none"}}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,marginBottom:5,alignItems:"center"}}><Badge color={c.urgent?T.point:T.dim}>{c.ch}</Badge><span style={{fontSize:12,fontWeight:700}}>{c.user}</span><span style={{fontSize:10,color:T.dim,marginLeft:"auto"}}>{c.time}</span></div>
                      <div style={{fontSize:12,color:T.sub,lineHeight:1.5}}>{c.msg}</div>
                    </div>
                    <button style={{background:T.border2,border:"none",color:T.text,padding:"5px 12px",borderRadius:7,fontSize:10,cursor:"pointer"}}>AI 답변</button>
                  </div>
                ))}
              </div>
              <div style={{...glassCard,padding:26}}>
                <SectionTitle accent={T.blue} emoji="📦">물류 현황판</SectionTitle>
                <div style={{display:"flex",marginBottom:20,borderRadius:12,overflow:"hidden",border:"1px solid "+T.border2}}>
                  {[{label:"신규 주문",value:28,color:T.blue},{label:"배송 준비",value:142,color:T.teal},{label:"배송 중",value:315,color:T.gold},{label:"배송 완료",value:852,color:T.green},{label:"반품/교환",value:3,color:T.point}].map((s,i,arr)=>(
                    <div key={i} style={{flex:1,padding:"14px 6px",textAlign:"center",background:T.card2,borderRight:i<arr.length-1?"1px solid "+T.border2:"none"}}>
                      <div style={{fontSize:20,fontWeight:800,color:s.color,letterSpacing:"-0.5px"}}>{fmt(s.value)}</div>
                      <div style={{fontSize:9,color:T.sub,marginTop:4,lineHeight:1.4}}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:"12px 16px",background:"rgba(255,51,102,0.05)",border:"1px solid rgba(255,51,102,0.15)",borderRadius:10}}>
                  <div style={{fontSize:11,color:T.point}}>⚠️ 반품/교환 3건 · 24시간 내 처리 필요</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {tab==="inventory"&&(
          <div>
            <div style={{marginBottom:32}}><h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:1}}>📦 재고 & 목표 관리</h1></div>
            <div style={{...glassCard,padding:26,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <SectionTitle accent={T.gold} emoji="🎯">5월 매출 목표 달성도</SectionTitle>
                <RefreshBtn loading={!!loadingCard["goal"]} onClick={()=>refreshCard("goal",()=>{})}/>
              </div>
              <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
                {[{label:"5월 목표",value:"₩100,000,000",color:T.sub},{label:"현재 달성",value:"₩72,000,000",color:T.green},{label:"잔여 목표",value:"₩28,000,000",color:T.warn}].map((item,i)=>(
                  <div key={i} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:"16px 20px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.sub,marginBottom:8}}>{item.label}</div>
                    <div style={{fontSize:19,fontWeight:700,color:item.color,letterSpacing:"-0.5px"}}>{item.value}</div>
                  </div>
                ))}
              </div>
              {[{label:"전체 매출",pct:72,color:T.point},{label:"세라마이드 토너",pct:85,color:T.blue},{label:"리바이브 세럼",pct:48,color:T.warn}].map((bar,i)=>(
                <div key={i} style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:7,color:T.sub}}><span>{bar.label}</span><span style={{color:bar.color,fontWeight:700}}>{bar.pct}%</span></div>
                  <ProgressBar pct={bar.pct} color={bar.color} height={8}/>
                </div>
              ))}
            </div>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1.3fr 0.7fr",gap:20}}>
              <div style={{...glassCard,padding:26}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <SectionTitle emoji="📊">품목별 재고 & 판매 속도</SectionTitle>
                  <RefreshBtn loading={!!loadingCard["inv"]} onClick={()=>refreshCard("inv",()=>{})}/>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{borderBottom:"1px solid "+T.border2}}>{["품목명","현재고","일 판매량","예상 품절","상태"].map(h=><th key={h} style={{padding:"10px 10px",textAlign:"left",fontWeight:500,color:T.sub,fontSize:10,letterSpacing:0.8}}>{h}</th>)}</tr></thead>
                  <tbody>{INVENTORY.map((item,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid "+T.border}}>
                      <td style={{padding:"15px 10px",fontWeight:600}}>{item.name}</td>
                      <td style={{padding:"15px 10px",color:T.sub}}>{item.stock}ea</td>
                      <td style={{padding:"15px 10px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:44,height:5,background:T.dim,borderRadius:2}}><div style={{width:Math.min(item.daily*8,100)+"%",height:"100%",background:item.status==="품절임박"?T.point:T.green,borderRadius:2}}/></div>
                          <span style={{fontSize:11,color:T.sub}}>{item.daily}/일</span>
                        </div>
                      </td>
                      <td style={{padding:"15px 10px",color:item.days<=2?T.point:item.days<=7?T.warn:T.green,fontWeight:700}}>{item.days}일 후</td>
                      <td style={{padding:"15px 10px"}}><Badge color={item.status==="안전"?T.green:T.point}>{item.status}</Badge></td>
                    </tr>
                  ))}</tbody>
                </table>
                {INVENTORY.some(i=>i.days<=3)&&(
                  <div style={{marginTop:18,padding:16,background:"rgba(255,51,102,0.05)",border:"1px dashed rgba(255,51,102,0.3)",borderRadius:12}}>
                    <div style={{fontSize:11,color:T.point,fontWeight:700,marginBottom:8}}>⚠️ 발주 알림</div>
                    <div style={{fontSize:12,marginBottom:12,lineHeight:1.6}}>리바이브 세럼 재고 <strong style={{color:T.point}}>2일치</strong> 남음 → 즉시 발주 권장</div>
                    <button style={{background:GS.pink,border:"none",color:"#fff",padding:"9px 20px",borderRadius:9,fontSize:12,cursor:"pointer",fontWeight:700,boxShadow:"0 4px 16px rgba(255,51,102,0.4)"}}>📦 발주 요청하기</button>
                  </div>
                )}
              </div>
              <div style={{...glassCard,padding:26}}>
                <SectionTitle accent={T.gold} emoji="💰">마진율 계산기</SectionTitle>
                {INVENTORY.map((item,i)=>{
                  const profit=item.price-item.cost-item.ad;
                  const margin=pct(profit,item.price);
                  return (
                    <div key={i} style={{background:T.card2,border:"1px solid "+T.border,borderRadius:12,padding:16,marginBottom:14}}>
                      <div style={{fontSize:12,fontWeight:700,marginBottom:12}}>{item.name}</div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:10,color:T.sub,marginBottom:12}}>
                        <span>판매가 <strong style={{color:T.text}}>₩{fmt(item.price)}</strong></span>
                        <span>원가 <strong style={{color:T.warn}}>₩{fmt(item.cost)}</strong></span>
                        <span>광고비 <strong style={{color:T.point}}>₩{fmt(item.ad)}</strong></span>
                        <span>순이익 <strong style={{color:T.green}}>₩{fmt(profit)}</strong></span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:7}}><span style={{color:T.sub}}>마진율</span><span style={{color:margin>=40?T.green:margin>=25?T.warn:T.point,fontWeight:700}}>{margin}%</span></div>
                      <ProgressBar pct={margin} color={margin>=40?T.green:margin>=25?T.warn:T.point}/>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── SOCIAL ── */}
        {tab==="social"&&(
          <div>
            <div style={{marginBottom:32}}><h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:1}}>📱 소셜 통합 관리</h1><p style={{margin:"6px 0 0",fontSize:12,color:T.sub}}>{SOCIAL_ID} · TikTok / Instagram / YouTube</p></div>
            <div style={{display:"flex",gap:10,marginBottom:22}}>
              {Object.entries(SOCIAL_DATA).map(([key,data])=>(
                <button key={key} onClick={()=>setSocialPlatform(key)} style={{flex:1,padding:"13px 16px",borderRadius:12,border:"2px solid "+(socialPlatform===key?data.color:T.border),background:socialPlatform===key?data.color+"12":T.card,color:socialPlatform===key?data.color:T.sub,cursor:"pointer",fontSize:13,fontWeight:socialPlatform===key?700:400,transition:"all 0.15s",boxShadow:socialPlatform===key?"0 0 20px "+data.color+"30":"none"}}>
                  {data.label}
                </button>
              ))}
            </div>
            <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
              <KPI label="팔로워" value={SOCIAL_DATA[socialPlatform].followers} color={SOCIAL_DATA[socialPlatform].color} gradient={GS.teal} onRefresh={()=>{}}/>
              <KPI label="7일 증감" value={SOCIAL_DATA[socialPlatform].followerGrowth} color={T.green} gradient={GS.green} onRefresh={()=>{}}/>
              <KPI label="수집 영상" value={SOCIAL_DATA[socialPlatform].videos.length+"개"} gradient={GS.blue}/>
              <KPI label="총 조회수" value={SOCIAL_DATA[socialPlatform].videos.reduce((a,v)=>a+parseFloat(v.views)*(v.views.includes("K")?1000:1000000),0).toLocaleString()} gradient={GS.gold} onRefresh={()=>{}}/>
            </div>
            <div style={{...glassCard,padding:26,marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <SectionTitle accent={SOCIAL_DATA[socialPlatform].color} emoji="📊">영상별 성과 비교 — {SOCIAL_ID}</SectionTitle>
                <RefreshBtn loading={!!loadingCard["social"]} onClick={()=>refreshCard("social",()=>{})}/>
              </div>
              <div style={{height:200}}>
                <ResponsiveContainer>
                  <BarChart data={SOCIAL_DATA[socialPlatform].videos.map(v=>({name:"#"+v.rank,views:parseFloat(v.views)*(v.views.includes("K")?1000:1000000),likes:parseFloat(v.likes)*(v.likes.includes("K")?1000:1000000)}))}>
                    <defs>
                      <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={SOCIAL_DATA[socialPlatform].color} stopOpacity={1}/><stop offset="100%" stopColor={SOCIAL_DATA[socialPlatform].color} stopOpacity={0.3}/></linearGradient>
                      <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.point} stopOpacity={1}/><stop offset="100%" stopColor={T.point} stopOpacity={0.3}/></linearGradient>
                    </defs>
                    <CartesianGrid stroke={T.border} vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="name" stroke={T.dim} fontSize={11} tickLine={false} axisLine={false}/>
                    <YAxis stroke={T.dim} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v=>(v/1000).toFixed(0)+"K"}/>
                    <Tooltip content={<ChartTip/>}/>
                    <Bar dataKey="views" fill="url(#vg)" radius={[6,6,0,0]} name="조회수"/>
                    <Bar dataKey="likes" fill="url(#lg)" radius={[6,6,0,0]} name="좋아요"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid-2" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:32}}>
              {SOCIAL_DATA[socialPlatform].videos.map((video,i)=>(
                <div key={i} style={{...glassCard,padding:16,display:"flex",gap:14}}>
                  <div style={{position:"relative",flexShrink:0}}>
                    <img src={video.thumbnail} alt="" style={{width:68,height:90,objectFit:"cover",borderRadius:10}} onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                    <div style={{position:"absolute",top:5,left:5,background:"rgba(0,0,0,0.8)",borderRadius:5,padding:"2px 6px",fontSize:9,color:SOCIAL_DATA[socialPlatform].color,fontWeight:800}}>#{video.rank}</div>
                  </div>
                  <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[{label:"조회수",value:video.views,color:SOCIAL_DATA[socialPlatform].color},{label:"좋아요",value:video.likes,color:T.point},{label:"댓글",value:video.comments,color:T.green},{label:"공유",value:video.shares,color:T.gold}].map((stat,j)=>(
                      <div key={j} style={{background:T.card2,borderRadius:8,padding:"8px 10px",border:"1px solid "+T.border}}>
                        <div style={{fontSize:9,color:T.sub,marginBottom:3}}>{stat.label}</div>
                        <div style={{fontSize:14,fontWeight:800,color:stat.color}}>{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Shortform section */}
            <div style={{borderTop:"1px solid "+T.border,paddingTop:32}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24}}>
                <div><h2 style={{margin:0,fontSize:18,fontWeight:800}}>🎬 숏폼 전략실</h2><p style={{margin:"6px 0 0",fontSize:12,color:T.sub}}>AI 대본 · 해시태그 · 촬영 체크리스트</p></div>
                <div style={{display:"flex",gap:8}}>
                  {[{state:sfProduct,set:setSfProduct,opts:["토너","세럼"]},{state:sfTarget,set:setSfTarget,opts:["문제성피부","지속력"]}].map((sel,i)=>(
                    <select key={i} value={sel.state} onChange={e=>sel.set(e.target.value)} style={{background:T.card2,color:T.text,border:"1px solid "+T.border2,padding:"9px 14px",borderRadius:9,fontSize:12,cursor:"pointer"}}>
                      {sel.opts.map(o=><option key={o} value={o}>{o}</option>)}
                    </select>
                  ))}
                  {["tiktok","insta","youtube"].map(p=>(
                    <button key={p} onClick={()=>setSfPlatform(p)} style={{padding:"9px 14px",borderRadius:9,border:"2px solid "+(sfPlatform===p?SOCIAL_DATA[p].color:T.border),background:sfPlatform===p?SOCIAL_DATA[p].color+"12":T.card,color:sfPlatform===p?SOCIAL_DATA[p].color:T.sub,cursor:"pointer",fontSize:11,fontWeight:sfPlatform===p?700:400,transition:"all 0.15s"}}>
                      {SOCIAL_DATA[p].label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid-2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
                <div style={{...glassCard,border:"2px solid "+SOCIAL_DATA[sfPlatform].color+"33",padding:26}}>
                  <SectionTitle accent={SOCIAL_DATA[sfPlatform].color}>AI 생성 대본</SectionTitle>
                  <div style={{marginBottom:16,padding:16,background:T.bg,borderRadius:12,borderLeft:"3px solid "+SOCIAL_DATA[sfPlatform].color}}>
                    <div style={{fontSize:9,color:T.sub,marginBottom:8,letterSpacing:1.5}}>HOOK (0~3초)</div>
                    <div style={{fontSize:15,fontWeight:700,lineHeight:1.6}}>"{currentScript.hook}"</div>
                  </div>
                  <div style={{marginBottom:14}}><div style={{fontSize:9,color:T.sub,marginBottom:7,letterSpacing:1.5}}>BODY</div><div style={{fontSize:13,lineHeight:1.8,color:"#bbb"}}>{currentScript.body}</div></div>
                  <div style={{marginBottom:14}}><div style={{fontSize:9,color:T.sub,marginBottom:7,letterSpacing:1.5}}>씬 구성</div><div style={{fontSize:13,lineHeight:1.8,color:"#bbb"}}>{currentScript.shot}</div></div>
                  <div style={{padding:14,background:"rgba(0,200,122,0.07)",borderRadius:10,border:"1px dashed rgba(0,200,122,0.3)"}}>
                    <div style={{fontSize:9,color:T.green,marginBottom:6,letterSpacing:1.5}}>CTA</div>
                    <div style={{fontSize:13,lineHeight:1.6}}>👉 {currentScript.cta}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:16}}>
                  <div style={{...glassCard,padding:22}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                      <SectionTitle>🏷️ 해시태그</SectionTitle>
                      <button onClick={()=>{navigator.clipboard.writeText(currentScript.hashtags[sfPlatform].join(" "));setHashCopied(true);setTimeout(()=>setHashCopied(false),2000);}} style={{background:hashCopied?T.green:T.point,border:"none",color:"#fff",padding:"6px 16px",borderRadius:7,fontSize:10,cursor:"pointer",fontWeight:700,transition:"all 0.2s"}}>{hashCopied?"✓ 복사됨":"복사"}</button>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                      {currentScript.hashtags[sfPlatform].map((tag,i)=><span key={i} style={{background:SOCIAL_DATA[sfPlatform].color+"18",color:SOCIAL_DATA[sfPlatform].color,padding:"5px 12px",borderRadius:20,fontSize:11,border:"1px solid "+SOCIAL_DATA[sfPlatform].color+"33"}}>{tag}</span>)}
                    </div>
                  </div>
                  <div style={{...glassCard,padding:22,flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                      <SectionTitle>✅ 체크리스트</SectionTitle>
                      <span style={{fontSize:11,color:checkedCount===CHECKLIST.length?T.green:T.warn,fontWeight:700}}>{checkedCount}/{CHECKLIST.length}</span>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                      {CHECKLIST.map((item,i)=>(
                        <div key={i} onClick={()=>setChecklist(p=>({...p,[i]:!p[i]}))} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 13px",background:checklist[i]?"rgba(0,200,122,0.07)":T.card2,borderRadius:9,border:"1px solid "+(checklist[i]?T.green:T.border),cursor:"pointer",transition:"all 0.15s"}}>
                          <div style={{width:15,height:15,borderRadius:4,border:"2px solid "+(checklist[i]?T.green:T.dim),background:checklist[i]?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>{checklist[i]&&<span style={{fontSize:9,color:"#000",fontWeight:900}}>✓</span>}</div>
                          <span style={{fontSize:10,color:checklist[i]?T.green:T.sub,textDecoration:checklist[i]?"line-through":"none",lineHeight:1.4}}>{item}</span>
                        </div>
                      ))}
                    </div>
                    {checkedCount===CHECKLIST.length&&<div style={{marginTop:14,padding:14,background:"rgba(0,200,122,0.08)",border:"1px solid rgba(0,200,122,0.25)",borderRadius:10,textAlign:"center",fontSize:12,color:T.green,fontWeight:700}}>🎬 촬영 준비 완료! 지금 바로 찍으세요!</div>}
                  </div>
                </div>
              </div>
              <div style={{...glassCard,padding:26}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <SectionTitle accent={T.gold} emoji="📈">광고 수익률 (ROAS)</SectionTitle>
                  <div style={{display:"flex",gap:4}}>{["일간","주간","월간"].map(r=><RBtn key={r} val={r} cur={roasRange} set={setRoasRange}/>)}</div>
                </div>
                <div style={{height:190}}>
                  <ResponsiveContainer>
                    <AreaChart data={ROAS_BASE[roasRange]}>
                      <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FFB800" stopOpacity={0.4}/><stop offset="100%" stopColor="#FFB800" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid stroke={T.border} vertical={false} strokeDasharray="3 3"/>
                      <XAxis dataKey="n" stroke={T.dim} fontSize={10} tickLine={false} axisLine={false}/>
                      <YAxis stroke={T.dim} fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>v+"x"} domain={[3,8]}/>
                      <Tooltip content={<ChartTip/>} formatter={(v:number)=>[v+"x","ROAS"]}/>
                      <Area type="monotone" dataKey="r" stroke={T.gold} strokeWidth={2.5} fill="url(#rg)" dot={{fill:T.gold,r:4,strokeWidth:0}} activeDot={{r:6}}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FUNDING ── */}
        {tab==="funding"&&(
          <div>
            <div style={{marginBottom:32}}><h1 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:1}}>🏛️ 정부지원사업 스케줄러</h1><p style={{margin:"6px 0 0",fontSize:12,color:T.sub}}>기업마당 · 경기기업비서 · 창업진흥원</p></div>
            <div className="grid-4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
              {GOV_SOURCES.map((s,i)=>(
                <button key={i} onClick={()=>window.open(s.url,"_blank")} style={{...glassCard as any,padding:"18px 22px",border:"1px solid "+s.color+"33",cursor:"pointer",textAlign:"left",display:"flex",flexDirection:"column",gap:8,transition:"all 0.2s",background:"rgba(15,15,15,0.7)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:13,color:s.color,fontWeight:800}}>{s.name}</span>
                    <span style={{fontSize:10,color:s.color,background:s.color+"18",padding:"3px 10px",borderRadius:20,border:"1px solid "+s.color+"33",fontWeight:600}}>바로가기 →</span>
                  </div>
                  <div style={{fontSize:11,color:T.sub,lineHeight:1.5}}>{s.desc}</div>
                  <div style={{fontSize:9,color:T.dim}}>{s.url}</div>
                </button>
              ))}
            </div>
            <div style={{...glassCard,padding:20,marginBottom:20}}>
              <div style={{fontSize:10,color:T.sub,marginBottom:12,letterSpacing:1.5}}>AI 키워드 필터 (가중치 적용)</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[{tag:"뷰티",color:T.point},{tag:"창업",color:T.teal},{tag:"청년창업",color:T.gold},{tag:"화성시",color:T.green},{tag:"디지털마케팅",color:T.blue}].map(kw=>(
                  <span key={kw.tag} style={{background:kw.color+"18",color:kw.color,padding:"7px 16px",borderRadius:20,fontSize:12,border:"1px solid "+kw.color+"44",fontWeight:700,cursor:"pointer"}}>#{kw.tag}</span>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
              {GOV_PROGRAMS.map((prog,i)=>{
                const isUrgent=prog.dday<=7;
                const ddayColor=isUrgent?T.point:prog.dday<=14?T.warn:T.green;
                return (
                  <div key={i} style={{...glassCard,border:"1px solid "+(isUrgent?T.point+"44":T.border),padding:"20px 24px",display:"flex",alignItems:"center",gap:20}}>
                    <div style={{width:70,textAlign:"center",flexShrink:0}}>
                      <div style={{fontSize:9,color:T.sub,letterSpacing:1.5,marginBottom:4}}>마감까지</div>
                      <div style={{fontSize:24,fontWeight:900,color:ddayColor,letterSpacing:"-1px",lineHeight:1,textShadow:isUrgent?"0 0 12px rgba(255,51,102,0.5)":"none"}}>D-{prog.dday}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                        <span style={{fontSize:14,fontWeight:700}}>{prog.name}</span>
                        {isUrgent&&<Badge color={T.point}>마감 임박</Badge>}
                      </div>
                      <div style={{display:"flex",gap:12,fontSize:11,color:T.sub,alignItems:"center"}}>
                        <span>📋 {prog.agency}</span><span>📅 {prog.deadline}</span><Badge color={T.teal}>{prog.tag}</Badge>
                      </div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:15,fontWeight:800,color:T.gold,marginBottom:8}}>{prog.amount}</div>
                      <button onClick={()=>window.open(prog.url,"_blank")} style={{background:GS.blue,border:"none",color:"#fff",padding:"7px 16px",borderRadius:8,fontSize:11,cursor:"pointer",fontWeight:700,boxShadow:"0 4px 12px rgba(61,139,255,0.35)"}}>신청하기 →</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{...glassCard,padding:26}}>
              <SectionTitle accent={T.blue} emoji="📅">공고 캘린더 (2025년 6월)</SectionTitle>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5}}>
                {["일","월","화","수","목","금","토"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:T.dim,padding:"8px 0",letterSpacing:0.5}}>{d}</div>)}
                {Array.from({length:35},(_,i)=>{
                  const date=i+1;
                  const prog=GOV_PROGRAMS.find(p=>parseInt(p.deadline.split("-")[2])===date&&parseInt(p.deadline.split("-")[1])===6);
                  return (
                    <div key={i} style={{textAlign:"center",padding:"10px 4px",borderRadius:8,background:prog?"rgba(255,51,102,0.1)":"transparent",border:prog?"1px solid rgba(255,51,102,0.25)":"1px solid transparent",boxShadow:prog?"0 0 12px rgba(255,51,102,0.15)":"none"}}>
                      <span style={{fontSize:12,color:date>=1&&date<=30?(prog?T.point:T.sub):"transparent",fontWeight:prog?700:400}}>{date>=1&&date<=30?date:""}</span>
                      {prog&&<div style={{fontSize:7,color:T.point,lineHeight:1.3,marginTop:3}}>마감</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
