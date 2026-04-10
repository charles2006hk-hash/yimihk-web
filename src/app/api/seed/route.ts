import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ success: false, error: '資料庫未連線' }, { status: 500 });
    }

    // 這些是符合蟻米集團業務領域的測試新聞
    const mockNews = [
      {
        title: 'AI 賦能：全球創意產業鏈迎來重構，集團多媒體平台用戶創新高',
        category: '行業動態',
        date: '2026-04-10',
        content: '隨著生成式 AI 技術成熟，集團旗下創意工業平台本季度活躍用戶增長 300%，大幅降低企業內容生產成本。'
      },
      {
        title: '大灣區資本互聯互通新政策解讀：跨境大宗貿易迎來新機遇',
        category: '政策指南',
        date: '2026-04-09',
        content: '針對南北向多通道資金流的最新放寬政策，預計將為集團供應鏈金融與跨境貿易板塊帶來千億級別的市場空間。'
      },
      {
        title: 'Web3 實體消費指數本週上漲 4.2%，區塊鏈底層應用落地加速',
        category: '市場指數',
        date: '2026-04-08',
        content: '打破虛擬與現實邊界，集團主導的下一代消費層級經濟體系已成功接入超過 500 家實體商戶，實現資產透明流通。'
      }
    ];

    // 使用 Firestore 的 Batch 批次寫入功能
    const batch = db.batch();
    const newsRef = db.collection('ai_news');

    mockNews.forEach((news) => {
      // .doc() 不傳參數會自動產生一組亂數唯一 ID
      const newDoc = newsRef.doc(); 
      batch.set(newDoc, {
        ...news,
        createdAt: new Date().toISOString()
      });
    });

    await batch.commit();

    return NextResponse.json({ 
      success: true, 
      message: '✅ 測試新聞已成功寫入 Firebase！請回到首頁查看。' 
    });

  } catch (error) {
    console.error("Seed API Error:", error);
    return NextResponse.json({ success: false, error: '寫入失敗' }, { status: 500 });
  }
}