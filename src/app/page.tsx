import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3, Shield, TrendingUp } from 'lucide-react';
import NewsWidget from '@/components/NewsWidget';
import MarketTicker from '@/components/MarketTicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-blue-600 selection:text-white font-sans">
      
      {/* 1. 頂部即時指數欄 */}
      <MarketTicker />

      {/* 2. Hero Section 首屏視覺 */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-40px)] px-6 py-20 overflow-hidden">
        {/* 深色科技感背景光暈 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-900/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay -z-20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-10 md:mt-0">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest text-blue-400 uppercase bg-blue-900/30 border border-blue-500/30 rounded-full backdrop-blur-sm">
            <Globe className="w-4 h-4 mr-2" /> Global Hub for AI & Capital
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            蟻米集團（國際）有限公司
            <span className="block text-xl md:text-3xl text-slate-400 mt-4 font-light tracking-widest uppercase">
              YIMI International Holdings
            </span>
          </h1>
          
          <p className="mt-6 text-base md:text-xl max-w-3xl mx-auto text-slate-300 leading-relaxed font-light">
            立足香港金融樞紐，依託中國大陸「蟻米控股」強大的科技產投生態與 <strong className="text-white font-medium">17億創投資本</strong>。我們專注於驅動 <strong className="text-white font-medium">AI 科技、區塊鏈消費、跨境資本與智慧地產</strong> 的全球化佈局。
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link href="#ai-news" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] group">
              探索 AI 財經智庫 <TrendingUp size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#ecosystem" className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm group">
              了解集團生態 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. 實力背書區塊 (整合 yimivc 資源) */}
      <section className="relative z-20 border-y border-slate-800 bg-slate-900/80 backdrop-blur-md py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2">中國強大後盾 Backed By</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">廣州蟻米控股</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              全國獨創<span className="text-slate-200 font-medium">「教+創+孵+投」</span>四位一體閉環生態。作為粵港澳大灣區數字化與區塊鏈產業的領軍者，我們成功投資孵化多家上市科技企業，為國際業務提供堅實的資本與技術護城河。
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            {[
              { label: '管理創投基金', value: '17 億+' },
              { label: '運營產業園區', value: '4 座' },
              { label: '深度佈局領域', value: 'AI & Web3' },
              { label: '核心投資模式', value: '教創孵投' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center flex flex-col justify-center transition-colors hover:border-blue-500/50">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 國際業務板塊 (繼承原有設定) */}
      <section id="ecosystem" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">國際業務佈局</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">整合總部數字化技術與投資網絡，推動虛實結合的全新經濟體系。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="p-8 md:p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
            <Cpu className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />
            <h3 className="text-2xl font-bold mb-4 text-white">AI 領域與創意工業</h3>
            <p className="text-slate-400 leading-relaxed">針對 AI 趨勢發展多媒體平台創意工業，利用生成式技術重塑內容生產力與商業轉化率。</p>
          </div>
          <div className="p-8 md:p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
            <Blocks className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />
            <h3 className="text-2xl font-bold mb-4 text-white">Web3 與區塊鏈消費</h3>
            <p className="text-slate-400 leading-relaxed">實體與虛擬雙結合模式，以區塊鏈為底層重構全新消費場景與價值交換體系。</p>
          </div>
          <div className="p-8 md:p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
            <Globe className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />
            <h3 className="text-2xl font-bold mb-4 text-white">跨境資本與貿易</h3>
            <p className="text-slate-400 leading-relaxed">南北向資金多通道管理，專注大宗貿易買賣與專業項目資產管理，鏈接全球流動性。</p>
          </div>
          <div className="p-8 md:p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 group">
            <Building2 className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />
            <h3 className="text-2xl font-bold mb-4 text-white">地產開發及營運</h3>
            <p className="text-slate-400 leading-relaxed">高端地產項目開發，結合智慧城市與科技園區管理，輸出國際級的產城融合營運服務。</p>
          </div>
        </div>
      </section>

      {/* 5. AI News Section */}
      <section id="ai-news" className="py-24 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-white tracking-tight">
                <BarChart3 className="text-blue-500" /> AI 實時智庫與動態
              </h2>
              <p className="mt-3 text-slate-400 font-light max-w-2xl text-lg">
                由集團 AI 引擎即時分析全球政策導向、金融波動及行業深度動態，為決策提供精準洞察。
              </p>
            </div>
          </div>
          {/* AI 新聞組件 */}
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-2 md:p-6 shadow-2xl">
            <NewsWidget />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm text-center md:text-left">
            © 2026 蟻米集團（國際）有限公司 YIMI International Holdings Limited. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span className="hover:text-blue-400 cursor-pointer transition-colors">隱私政策</span>
            <Link href="/admin" className="flex items-center hover:text-blue-400 transition-colors group">
              <Shield className="w-4 h-4 mr-1 text-slate-600 group-hover:text-blue-400" /> 內部管理
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
