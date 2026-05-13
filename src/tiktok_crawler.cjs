const { chromium } = require('playwright');
const fs = require('fs');

const TARGET = 'https://www.tiktok.com/@imdainii';
const OUTPUT = './src/data.json';

async function crawlTikTok() {
  console.log('TikTok 크롤러 시작...');
  
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ko-KR',
    timezoneId: 'Asia/Seoul'
  });

  const page = await context.newPage();

  try {
    console.log(`접속 중: ${TARGET}`);
    await page.goto(TARGET, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 팔로워 수 수집
    let followerCount = '0';
    try {
      const followerEl = await page.$('[data-e2e="followers-count"]');
      if (followerEl) followerCount = await followerEl.innerText();
    } catch(e) {}

    // 영상 목록 수집
    console.log('영상 목록 수집 중...');
    await page.waitForSelector('[data-e2e="user-post-item"]', { timeout: 15000 });
    
    const videos = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-e2e="user-post-item"]');
      const results = [];
      
      items.forEach((item, index) => {
        if (index >= 12) return; // 최근 12개만
        
        const link = item.querySelector('a');
        const url = link ? link.href : '';
        
        // 조회수
        let views = '0';
        const viewEl = item.querySelector('[data-e2e="video-views"]') || 
                       item.querySelector('strong') ||
                       item.querySelector('.video-count');
        if (viewEl) views = viewEl.innerText;

        // 썸네일
        const img = item.querySelector('img');
        const thumbnail = img ? img.src : '';

        results.push({ url, views, thumbnail, index: index + 1 });
      });
      
      return results;
    });

    console.log(`영상 ${videos.length}개 발견. 상세 데이터 수집 중...`);

    // 각 영상 상세 데이터 수집
    const detailedVideos = [];
    
    for (let i = 0; i < Math.min(videos.length, 6); i++) {
      const video = videos[i];
      if (!video.url) continue;

      try {
        console.log(`[${i+1}/${Math.min(videos.length, 6)}] 영상 분석 중...`);
        
        const detailPage = await context.newPage();
        await detailPage.goto(video.url, { waitUntil: 'networkidle', timeout: 20000 });
        await detailPage.waitForTimeout(2000);

        const detail = await detailPage.evaluate(() => {
          const getText = (selectors) => {
            for (const sel of selectors) {
              const el = document.querySelector(sel);
              if (el && el.innerText) return el.innerText.trim();
            }
            return '0';
          };

          return {
            likes: getText([
              '[data-e2e="like-count"]',
              'strong[data-e2e="like-count"]',
            ]),
            comments: getText([
              '[data-e2e="comment-count"]',
              'strong[data-e2e="comment-count"]',
            ]),
            shares: getText([
              '[data-e2e="share-count"]',
              'strong[data-e2e="share-count"]',
            ]),
            saves: getText([
              '[data-e2e="undefined-count"]',
            ]),
            description: getText([
              '[data-e2e="browse-video-desc"]',
              'h1[data-e2e="video-desc"]',
            ]),
          };
        });

        detailedVideos.push({
          rank: i + 1,
          url: video.url,
          thumbnail: video.thumbnail,
          views: video.views,
          likes: detail.likes,
          comments: detail.comments,
          shares: detail.shares,
          saves: detail.saves,
          description: detail.description,
        });

        await detailPage.close();
        await page.waitForTimeout(1500); // 너무 빠른 요청 방지

      } catch(e) {
        console.log(`영상 ${i+1} 수집 실패: ${e.message}`);
        detailedVideos.push({
          rank: i + 1,
          url: video.url,
          views: video.views,
          likes: '0', comments: '0', shares: '0',
          error: true
        });
      }
    }

    // 결과 저장
    const result = {
      account: '@imdainii',
      platform: 'tiktok',
      profileUrl: TARGET,
      followerCount,
      crawledAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      totalVideos: videos.length,
      videos: detailedVideos
    };

    fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf8');
    console.log('');
    console.log('============================');
    console.log('크롤링 완료!');
    console.log(`팔로워: ${followerCount}`);
    console.log(`수집된 영상: ${detailedVideos.length}개`);
    console.log(`저장 위치: ${OUTPUT}`);
    console.log('============================');

  } catch(e) {
    console.error('크롤링 오류:', e.message);
    
    // 오류 발생 시 샘플 데이터로 대체
    const fallback = {
      account: '@imdainii',
      platform: 'tiktok',
      crawledAt: new Date().toLocaleString('ko-KR'),
      error: e.message,
      videos: []
    };
    fs.writeFileSync(OUTPUT, JSON.stringify(fallback, null, 2), 'utf8');
  } finally {
    await browser.close();
  }
}

crawlTikTok();
