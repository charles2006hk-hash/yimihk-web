import React from 'react';
import { ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            蟻米集團（國際）有限公司
            <span className="block text-2xl md:text-3xl text-blue-400 mt-4 font-light tracking-widest">
              YIMI INTERNATIONAL HOLDINGS LIMITED
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-slate-300 leading-relaxed">
            立足香港，深耕國內，放眼全球。我們致力於 AI 科技創新、Web3 實體消費融合、
            跨境資本與大宗貿易，以及頂尖地產項目運營。以孵化多家上市企業的雄厚背景，引領未來產業佈局。
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2">
              探索業務板塊 <ArrowRight size={18} />
            </button>
            <button className="bg-transparent border border-white hover:bg-white hover:text-slate-900 px-8 py-3 rounded-full font-medium transition-all">
              投資者關係
            </button>
          </div>
        </div>
      </section>

      {/* Core Business Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">戰略佈局與核心業務</h2>
          <p className="mt-4 text-slate-600">聚焦前沿科技與實體經濟的深度融合，構建跨國資本橋樑</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business 1 */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <Cpu className="text-blue-600 mb-6" size={40} />
            <h3 className="text-xl font-bold mb-3">AI 領域與創意工業</h3>
            <p className="text-slate-600 leading-relaxed">
              針對全球 AI 發展趨勢，打造 AI 多媒體領域平台。利用深度學習與生成式 AI 技術，重塑創意工業生態，提供高效能的自動化內容與設計解決方案。
            </p>
          </div>

          {/* Business 2 */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <Blocks className="text-blue-600 mb-6" size={40} />
            <h3 className="text-xl font-bold mb-3">Web3 消費與區塊鏈底層</h3>
            <p className="text-slate-600 leading-relaxed">
              打破虛擬與現實邊界，構建消費層級的實體與虛擬雙結合模式。以區塊鏈為底層技術，確保資產透明與流通，打造全新的下一代消費經濟體系。
            </p>
          </div>

          {/* Business 3 */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <Globe className="text-blue-600 mb-6" size={40} />
            <h3 className="text-xl font-bold mb-3">跨境資本與大宗貿易</h3>
            <p className="text-slate-600 leading-relaxed">
              依託香港國際金融中心優勢，打通南北向多通道資金流。專注於跨國大宗貿易買賣、供應鏈金融及大型項目管理，為策略投資者提供穩健回報。
            </p>
          </div>

          {/* Business 4 */}
          <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <Building2 className="text-blue-600 mb-6" size={40} />
            <h3 className="text-xl font-bold mb-3">地產開發與運營</h3>
            <p className="text-slate-600 leading-relaxed">
              涵蓋高端商業地產與創新科技園區的開發及營運。結合智慧城市理念，為企業孵化與產業升級提供頂級的物理空間與配套服務。
            </p>
          </div>
        </div>
      </section>

      {/* AI Dynamic News Section (Placeholder) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <BarChart3 className="text-blue-400" /> 實時動態與政策指數
              </h2>
              <p className="mt-2 text-slate-400">由 AI 引擎實時聚合分析的金融與行業數據</p>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">查看完整報告 &rarr;</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* 這裡未來會接駁 API Route: /api/news */}
             {[1, 2, 3].map((item) => (
                <div key={item} className="bg-slate-800 p-6 rounded-xl border border-slate-700 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-slate-600 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-slate-700 rounded w-full"></div>
                </div>
             ))}
          </div>
        </div>
      </section>
    </main>
  );
}