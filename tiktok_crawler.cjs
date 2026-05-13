const puppeteer = require('puppeteer');

async function run() {
  console.log("잠시만 기다리세요... 창을 강제로 띄웁니다.");
  const browser = await puppeteer.launch({ 
    headless: false, // 무조건 창이 뜨게 설정
    args: ['--no-sandbox'] 
  });
  const page = await browser.newPage();
  await page.goto('https://www.tiktok.com/@imdainii');
  console.log("창이 떴나요? 틱톡 화면이 보이면 성공입니다!");
  
  // 데이터 수집 로직은 창이 뜨는 것부터 확인하고 다시 넣어도 늦지 않습니다.
}
run();