const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeTikTokAnalysis(userId) {
  console.log("\n🚀 [시스템] 틱톡 수집기 가동 시작...");
  
  const browser = await puppeteer.launch({ 
    headless: false,
    userDataDir: './tiktok_session',
    args: ['--no-sandbox', '--window-size=1280,1000']
  });

  const page = await browser.newPage();

  try {
    const url = `https://www.tiktok.com/@${userId.replace('@', '')}`;
    console.log(`[접속] ${url} 이동 중...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log("👀 [대기] 20초간 페이지를 로딩합니다. (필요시 로그인)");
    await new Promise(r => setTimeout(r, 20000)); 

    // 데이터 수집 로직 강화
    const rawData = await page.evaluate(() => {
      const posts = Array.from(document.querySelectorAll('[data-e2e="user-post-item"]'));
      return posts.map(post => {
        // 영상 설명글 추출 (이미지의 alt나 텍스트에서 가져옴)
        const descImg = post.querySelector('img');
        const description = descImg ? descImg.alt : post.innerText;
        
        // 순수 글자만 남기기 (조회수 숫자 등은 제거)
        const cleanDesc = description.replace(/[0-9.]+[KM]/g, '').replace(/[\n\r]/g, ' ').trim();

        return {
          desc: cleanDesc || "설명 없음",
          views: post.querySelector('[data-e2e*="view"]')?.innerText || "0"
        };
      });
    });

    if (rawData.length > 0) {
      const keywordAnalysis = {};
      rawData.forEach(item => {
        // 단어 단위로 쪼개기 (2글자 이상만)
        const words = item.desc.split(/[\s,#]+/).filter(w => w.length > 1);
        
        let viewCount = parseFloat(item.views.replace(/[^0-9.]/g, '')) || 0;
        if (item.views.includes('K')) viewCount *= 1000;
        if (item.views.includes('M')) viewCount *= 1000000;

        words.forEach(word => {
          if (!keywordAnalysis[word]) keywordAnalysis[word] = { totalViews: 0, count: 0 };
          keywordAnalysis[word].totalViews += viewCount;
          keywordAnalysis[word].count += 1;
        });
      });

      const sorted = Object.entries(keywordAnalysis)
        .map(([w, s]) => ({ 키워드: w, 점수: s.totalViews, 영상수: s.count }))
        // 너무 큰 숫자만 있는 키워드 제외 필터링
        .filter(item => !/^[0-9.K]+$/.test(item.키워드))
        .sort((a, b) => b.점수 - a.점수).slice(0, 10);
      
      fs.writeFileSync('./src/data.json', JSON.stringify(sorted, null, 2));
      console.log("\n✅ [성공] 분석 완료!");
      console.table(sorted);
    }
  } catch (error) {
    console.error("에러 발생:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeTikTokAnalysis('imdainii');