import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3, Shield, Zap, Target } from 'lucide-react';
import NewsWidget from '@/components/NewsWidget';
import MarketTicker from '@/components/MarketTicker';

// 全球金融網絡動態背景 SVG 組件
function FinancialNetworkMap() {
  return (
    <svg 
      className="absolute inset-0 opacity-10 mix-blend-overlay -z-20 w-full h-full" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* 1. 地圖背景層 */}
      <path d="M100 100 C 150 150, 200 100, 250 150" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" className="text-slate-700"/>
      <rect width="100%" height="100%" fill="none" stroke="none" />
      <g className="text-slate-700" fill="currentColor" fillOpacity="0.1">
        <path d="M720,130 A200,100 0 0,1 920,230 L920,430 A200,100 0 0,1 720,530 L520,530 A200,100 0 0,1 320,430 L320,230 A200,100 0 0,1 520,130 Z" />
        <circle cx="200" cy="150" r="80" /> <circle cx="150" cy="350" r="100" /> <circle cx="300" cy="500" r="90" />
      </g>
      
      {/* 2. 動態網絡連線層 - 象徵光束流動 */}
      <g className="network-lines" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5">
        <line x1="140" y1="200" x2="710" y2="445" className="text-blue-500 line-pulse-blue"/> 
        <line x1="850" y1="200" x2="710" y2="445" className="text-blue-500 line-pulse-blue"/> 
        <line x1="100" y1="400" x2="710" y2="445" className="text-blue-500 line-pulse-blue"/> 
        <line x1="400" y1="580" x2="710" y2="445" className="text-blue-500 line-pulse-blue"/> 
        <line x1="710" y1="445" x2="710" y2="445" className="text-blue-500"/>
      </g>

      {/* 3. 金色核心熱點 - 大灣區/香港脈衝 */}
      <g className="gba-hub">
        <circle cx="710" cy="445" r="8" className="text-yellow-400 fill-current animate-pulse"/>
        <circle cx="710" cy="445" r="2" className="text-yellow-400 fill-current"/>
        <text x="710" y="475" textAnchor="middle" className="text-yellow-400 font-bold text-xs">GBA HUB - ACTIVE</text>
      </g>

      {/* 4. 全球藍色熱點同步闪烁 */}
      <g className="global-hotspots text-blue-500">
        <g transform="translate(140, 200)"> {/* 歐洲倫敦 */}
          <circle r="4" className="fill-current animate-pulse"/> <circle r="1" className="fill-current"/> 
          <text y="20" textAnchor="middle" className="font-medium text-[10px]">EUROPE</text>
        </g>
        <g transform="translate(100, 400)"> {/* 非洲約翰尼斯堡 */}
          <circle r="4" className="fill-current animate-pulse-delayed"/> <circle r="1" className="fill-current"/> 
          <text y="20" textAnchor="middle" className="font-medium text-[10px]">AFRICA</text>
        </g>
        <g transform="translate(850, 200)"> {/* 澳洲雪梨 */}
          <circle r="4" className="fill-current animate-pulse"/> <circle r="1" className="fill-current"/> 
          <text y="20" textAnchor="middle" className="font-medium text-[10px]">AUSTRALIA</text>
        </g>
      </g>
      
      {/* 5. 數據粒子動態效果 */}
      <circle cx="140" cy="200" r="1.5" className="text-yellow-400 fill-current particle-move-1"/>
      <circle cx="850" cy="200" r="1.5" className="text-yellow-400 fill-current particle-move-2"/>
      
    </svg>
  );
}

// 內部按鈕內容配置 (深研內容 Deep Research)
const btn1DeepResearch = `由集團 AI 引擎即時分析全球政策導向、金融波動及行業深度動態。我們的 AI 模型不僅分析 Market Ticker 等每日開盤數據，更能針對國際政治、大宗商品期貨、智慧地產園區管理等特定領域，生成具有國際投行水準的深度研究報告與決策建議，為跨境資本開拓新的增長極。`;

const btn2DeepResearch = `香港平台專注於以技術驅動的核心板塊，通過 AI 賦能創意工業與多媒體平台重塑內容生產力；以 Web3 區塊鏈技術重構實體與虛擬消費場景；提供南北向資金多通道管理與大宗貿易溯源服務；並結合智慧城市與科技園區管理，輸出國際級的產城融合營運，為全球企業提供數字化轉型的終極解方。`;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-blue-600 selection:text-white font-sans">
      
      {/* 1. 頂部即時指數欄 */}
      <MarketTicker />

      {/* 2. Hero Section 首屏視覺 */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-40px)] px-6 py-20 overflow-hidden">
        {/* 動態全球網絡背景圖層 (代碼中包含) */}
        <FinancialNetworkMap />

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
              探索 AI 財經智庫 <Target size={18} className="group-hover:translate-x-1 transition-transform" />
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
              全國獨創<span className="text-slate-200 font-medium">「教+創+孵+投」</span>四位一體閉環生態。作為粵港澳大灣區數字化與區塊鏈產業的領軍者，我們成功投資孵化多家上市科技企業，旗下基金管理規模達17億元人民幣。
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

      {/* 4. 國際業務板塊 */}
      <section id="ecosystem" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">集團國際業務佈局</h2>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {btn2DeepResearch}
          </p>
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
              <p className="mt-4 text-slate-300 font-light max-w-3xl text-lg leading-relaxed">
                {btn1DeepResearch}
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
