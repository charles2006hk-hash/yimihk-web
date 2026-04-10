import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: '資料庫連線失敗，請查看伺服器終端機日誌' }, 
        { status: 500 }
      );
    }

    const newsRef = db.collection('ai_news');
    const snapshot = await newsRef.orderBy('date', 'desc').limit(3).get();

    if (snapshot.empty) {
      // 資料庫沒資料時，回傳空陣列
      return NextResponse.json({ success: true, data: [] });
    }

    const newsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as { title: string; category: string; date: string }),
    }));

    return NextResponse.json({ success: true, data: newsData }, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' }
    });
  } catch (error) {
    console.error("Firebase fetch error:", error);
    return NextResponse.json(
      { success: false, error: '內部伺服器錯誤' }, 
      { status: 500 }
    );
  }
}