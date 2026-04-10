import { NextResponse } from 'next/server';
// import { getFirestore } from 'firebase-admin/firestore'; 
// import { initFirebaseAdmin } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    // 1. 這裡將處理：從 Firestore 獲取由 Cron Job + AI 生成的最新政策與金融資訊
    // const db = getFirestore(initFirebaseAdmin());
    // const newsSnapshot = await db.collection('ai_news').orderBy('createdAt', 'desc').limit(3).get();
    
    // 模擬返回數據 (開發階段)
    const mockData = [
      { id: 1, title: 'AI 賦能：全球創意產業鏈迎來重構', category: '行業動態', date: '2026-04-10' },
      { id: 2, title: '大灣區資本互聯互通新政策解讀', category: '政策指南', date: '2026-04-09' },
      { id: 3, title: 'Web3 實體消費指數本週上漲 4.2%', category: '市場指數', date: '2026-04-08' },
    ];

    return NextResponse.json({ success: true, data: mockData }, {
      // 設定 Cache 策略，適合新聞類內容
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    });
  } catch (error) {
    console.error("News Fetch Error:", error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}