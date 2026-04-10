import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 在生產環境中，這裡可以對接到 Yahoo Finance 或新浪財經 API
    // 目前我們先模擬即時數據，確保前端 UI 能正常顯示
    const marketData = [
      { symbol: 'HSI', name: '恒生指數', value: '16,723.92', change: '+0.54%', trend: 'up' },
      { symbol: 'SSEC', name: '上證指數', value: '3,047.05', change: '-0.12%', trend: 'down' },
      { symbol: 'SPX', name: '標普 500', value: '5,204.34', change: '+1.12%', trend: 'up' },
      { symbol: 'IXIC', name: '納斯達克', value: '16,306.64', change: '+1.24%', trend: 'up' },
    ];

    return NextResponse.json({ success: true, data: marketData }, {
      headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=1800' } // 快取 15 分鐘
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: '無法獲取市場數據' }, { status: 500 });
  }
}