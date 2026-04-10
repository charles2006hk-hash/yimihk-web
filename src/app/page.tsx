import React from 'react';
import { ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3 } from 'lucide-react';
import NewsWidget from '@/components/NewsWidget';
import MarketTicker from '@/components/MarketTicker';

export default function Home() {
  return (
    // 使用 relative 確保 sticky 子組件能相對於 body 運作
    <main className="min-h-screen bg-slate-50 text-slate-900 relative">
      
      {/* 1. 頂部即時指數欄 
         在組件內已設定 sticky top-0，這裏確保它在 main 的最上方
      */}
      <MarketTicker />

      {/* 2. Hero Section 
         調整高度為 calc(100vh - 40px) 補償 Ticker 的高度，讓視覺比例更完美
      */}
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
        {/* 背景圖層 */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        
        {/* 內容圖層 */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
            Leading the Future of AI & Capital
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            蟻米集團（國際）有限公司
            <span className="block text-2xl md:text-3xl text-blue-400 mt-4 font-light tracking-widest uppercase">
              YIMI International Holdings Limited
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-slate-300 leading-relaxed font-light">
            立足香港金融樞紐，深耕國內產業佈局。致力於 **AI 多媒體工業**、**Web3 區塊鏈消費模式**、
            **跨國大宗貿易**及**智慧地產營運**。以孵化多家上市企業之雄厚底蘊，驅動虛實結合的全新經濟體系。
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20">
              探索板塊 <ArrowRight size={18} />
            </button>
            <button className="bg-transparent border border-white/30 hover:bg-white/10 px-10 py-4 rounded-full font-medium transition-all backdrop-blur-sm">
              投資者關係
            </button>
          </div>
        </div>
        
        {/* 裝飾性漸變底部，平滑過渡到業務板塊 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* 3. 業務板塊 */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <Cpu className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-bold mb-3">AI 領域與創意工業</h3>
            <p className="text-slate-600 leading-relaxed">針對 AI 趨勢發展多媒體平台創意工業，利用生成式技術重塑內容生產力。</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <Blocks className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-bold mb-3">Web3 與區塊鏈消費</h3>
            <p className="text-slate-600 leading-relaxed">實體與虛擬雙結合模式，以區塊鏈為底層重構全新消費場景與價值交換。</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <Globe className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-bold mb-3">跨境資本與貿易</h3>
            <p className="text-slate-600 leading-relaxed">南北向資金多通道管理，專注大宗貿易買賣與專業項目資產管理。</p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <Building2 className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="text-xl font-bold mb-3">地產開發及營運</h3>
            <p className="text-slate-600 leading-relaxed">高端地產項目開發，結合智慧城市與科技園區管理，提供國際級營運服務。</p>
          </div>
        </div>
      </section>

      {/* 4. AI News Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="text-blue-400" /> 實時動態與政策指數
              </h2>
              <p className="mt-2 text-slate-400 font-light">
                由集團 AI 引擎即時分析全球政策導向、金融波動及行業深度動態。
              </p>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium border-b border-blue-400/30 pb-1 transition-all">
              查看分析報告 &rarr;
            </button>
          </div>
          {/* AI 新聞組件 */}
          <NewsWidget />
        </div>
      </section>

      {/* Footer 簡單版 */}
      <footer className="bg-white py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
          © 2026 蟻米集團（國際）有限公司 YIMI International Holdings Limited. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}