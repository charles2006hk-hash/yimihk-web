'use client';

import React, { useState } from 'react';
import { FileText, X, Clock, ChevronRight } from 'lucide-react';

// 模擬的 AI 智庫數據庫 (未來可從 Firebase 讀取)
const newsData = [
  {
    id: 1,
    date: '2026-04-10',
    category: '政策解讀',
    title: '香港「超級聯繫人」政策升級：大灣區資本跨境流動新指南',
    summary: '最新政策放寬了大灣區企業在港融資的限制，預計將釋放超 500 億資金流動性。',
    fullText: '根據集團 AI 智庫即時分析，香港特區政府最新發佈的金融白皮書進一步確認了其作為「超級聯繫人」的絕對地位。新規重點放寬了科技創新、AI 及 Web3 企業的跨境融資審批流程。我們的預測模型顯示，這將在未來兩個季度內，為大灣區的高端地產與大宗貿易帶來顯著的資金流入。建議集團內部加快「蟻米智慧港」項目的招商推進，並為核心客戶提供專屬的跨境資產配置方案。'
  },
  {
    id: 2,
    date: '2026-04-09',
    category: '行業洞察',
    title: 'AIGC 工業應用報告：生成式 AI 如何降低 40% 營銷成本',
    summary: '多媒體廣告矩陣全面引入 AI 輔助，重塑數字創意產業鏈。',
    fullText: '結合本週全球科技股財報數據與行業動態，AIGC（人工智能生成內容）已正式從「概念」轉向「工業化落地」。集團旗下「AI 領域與創意工業」板塊的最新測試數據表明，在多媒體廣告的生成、AB 測試及精準投放環節引入 AI 模型後，企業客戶的平均營銷成本下降了 42%，同時轉化率提升了 15%。報告建議，應盡快將此模型標準化，作為一項 SaaS 服務開放給生態圈內的合作夥伴。'
  },
  {
    id: 3,
    date: '2026-04-08',
    category: '市場預警',
    title: '全球大宗商品價格波動與區塊鏈溯源的避險價值',
    summary: '受地緣政治影響，大宗貿易波動加劇，Web3 溯源系統成為信任基石。',
    fullText: '全球 AI 預測引擎昨晚發出大宗商品波動預警。受歐洲與非洲地緣政治因素影響，未來一個月內能源與貴金屬貿易可能面臨較大不確定性。在此背景下，集團結合 Web3 技術開發的「大宗商品區塊鏈溯源系統」其戰略價值凸顯。該系統不僅能保證貨物數據的不可篡改，還能為供應鏈金融提供 100% 可信的底層資產證明，有效對沖國際貿易風險。'
  }
];

export default function NewsWidget() {
  const [selectedArticle, setSelectedArticle] = useState<typeof newsData[0] | null>(null);

  return (
    <div className="w-full">
      {/* 文章列表 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsData.map((news) => (
          <div 
            key={news.id} 
            onClick={() => setSelectedArticle(news)}
            className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">{news.category}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {news.date}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{news.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2">{news.summary}</p>
            </div>
            <div className="mt-6 flex items-center text-sm text-slate-500 group-hover:text-blue-400 font-medium">
              閱讀深度報告 <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* 閱讀全文彈窗 (Modal) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedArticle(null)}></div>
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-8 md:p-10 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300">
              <X size={24} />
            </button>
            <div className="mb-6 flex items-center gap-3">
               <span className="text-sm font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">{selectedArticle.category}</span>
               <span className="text-sm text-slate-500">{selectedArticle.date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">{selectedArticle.title}</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 text-lg leading-relaxed">{selectedArticle.fullText}</p>
            </div>
            <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
              <button className="flex items-center text-slate-400 hover:text-white transition-colors text-sm">
                <FileText size={16} className="mr-2" /> 下載 PDF 簡報 (僅限合作夥伴)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
