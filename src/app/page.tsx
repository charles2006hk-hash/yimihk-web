'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3, 
  Shield, Target, Zap, ShieldCheck, Users, BarChart, X, Send, CheckCircle2 
} from 'lucide-react';
import NewsWidget from '@/components/NewsWidget';
import MarketTicker from '@/components/MarketTicker';

const btn1DeepResearch = `由集團 AI 引擎即時分析全球政策導向、金融波動及行業深度動態。我們的 AI 模型不僅分析 Market Ticker 等每日開盤數據，更能針對國際政治、大宗商品期貨、智慧地產園區管理等特定領域，生成具有國際投行水準的深度研究報告與決策建議，為跨境資本開拓新的增長極。`;

const servicesData = [
  {
    id: 'ai',
    icon: <Cpu className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: 'AI 領域與創意工業',
    shortDesc: '針對 AI 趨勢發展多媒體平台創意工業，利用生成式技術重塑內容生產力與商業轉化率。',
    deepImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
    deepTitle: 'AI 雙引擎：驅動工業升級與營銷革命',
    deepPoints: [
      { icon: <BarChart size={18}/>, title: '企業級 AI 生產優化', desc: '深入企業核心工業流程，利用 AI 模型進行大數據過濾、預測性維護與供應鏈優化，大幅提升產能效率。' },
      { icon: <Zap size={18}/>, title: 'AIGC 創意廣告平台', desc: '融合專業頂尖人才與 AI 生成技術，打造個性化、低成本、高效率的多媒體動態宣傳矩陣，精準觸達目標客群。' }
    ],
    stat: '提升 40% 內容生產效率'
  },
  {
    id: 'web3',
    icon: <Blocks className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: 'Web3 與區塊鏈消費',
    shortDesc: '實體與虛擬雙結合模式，以區塊鏈為底層重構全新消費場景與價值交換體系。',
    deepImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop',
    deepTitle: '構建大中華區中高端價值交換網絡',
    deepPoints: [
      { icon: <ShieldCheck size={18}/>, title: '底層信任架構', desc: '以區塊鏈技術確保數據不可篡改，保障跨媒體、跨企業、跨網絡的用戶隱私與資產安全。' },
      { icon: <Zap size={18}/>, title: '虛實融合 (Phygital) 消費', desc: '打通實體商圈與虛擬資產，實現大中華區中高端消費群的跨界積分互換與專屬權益，重塑會員忠誠度生態。' }
    ],
    stat: '無縫鏈接跨界消費場景'
  },
  {
    id: 'capital',
    icon: <Globe className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: '跨境資本與貿易',
    shortDesc: '南北向資金多通道管理，專注大宗貿易買賣與專業項目資產管理，鏈接全球流動性。',
    deepImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop', // 已更新為穩定圖源
    deepTitle: '發揮「超級聯繫人」戰略優勢',
    deepPoints: [
      { icon: <Globe size={18}/>, title: '大額資金與資產管理', desc: '深度配合國家與地區金融政策，為大型企業提供安全、合規的南北向資金調撥與跨境資產配置方案。' },
      { icon: <Building2 size={18}/>, title: '大宗貿易樞紐', desc: '利用香港國際金融中心地位，協助企業進行跨國大宗商品買賣、供應鏈融資與風險對沖。' }
    ],
    stat: '精準對接全球資本流動性'
  },
  {
    id: 'realestate',
    icon: <Building2 className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: '地產開發及營運',
    shortDesc: '高端地產項目開發，結合智慧城市與科技園區管理，輸出國際級的產城融合營運服務。',
    deepImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop',
    deepTitle: '賦能全球菁英的頂級人居生態',
    deepPoints: [
      { icon: <Users size={18}/>, title: '對接優才/高才引進', desc: '緊跟內外人才流動趨勢，開發符合國際標準的優質地產項目，助力國內外頂尖人才無縫融入本地與世界各地。' },
      { icon: <Zap size={18}/>, title: '智慧產城運營', desc: '整合 IoT 與 AI 樓宇管理系統，打造兼具生活品質與創新活力的科技園區及高端住宅聚落。' }
    ],
    stat: '打造國際級智慧生活圈'
  }
];

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  // 新增狀態：控制「聯繫表單」的顯示與情境
  const [contactContext, setContactContext] = useState<string | null>(null);
  // 新增狀態：表單提交成功
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeData = servicesData.find(s => s.id === activeModal);

  // 處理開啟聯繫表單
  const handleOpenContact = (title: string) => {
    setActiveModal(null); // 關閉介紹彈窗
    setContactContext(title); // 設定表單的情境標題
    setIsSubmitted(false);
  };

  // 在 src/app/page.tsx 裡面修改這個函數
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 獲取表單數據
    const formData = new FormData(e.currentTarget);
    formData.append('來源板塊', contactContext || '未定'); // 把他們點擊的業務標題加上去

    // 發送到 Formspree
    try {
      await fetch('https://formspree.io/f/meepbnpb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setContactContext(null);
      }, 3000);
    } catch (error) {
      alert('發送失敗，請稍後再試。');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-blue-600 selection:text-white font-sans">
      
      <MarketTicker />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-40px)] px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/background.png')] bg-cover bg-center" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-900/30 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center mt-10 md:mt-0 backdrop-blur-sm bg-slate-950/20 p-8 rounded-3xl border border-white/5 shadow-2xl">
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
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0 relative z-20">
            <Link href="#ai-news" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] group cursor-pointer">
              探索 AI 財經智庫 <Target size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#ecosystem" className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 backdrop-blur-sm group cursor-pointer">
              了解集團生態 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent z-10"></div>
      </section>

      {/* 實力背書區塊 */}
      <section className="relative z-20 border-y border-slate-800 bg-slate-900/80 backdrop-blur-md py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2">中國強大後盾 Backed By</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">廣州蟻米控股</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              全國獨創<span className="text-slate-200 font-medium">「教+創+孵+投」</span>四位一體閉環生態。作為粵港澳大灣區數字化與區塊鏈產業的領軍者，我們成功投資孵化多家上市科技企業，旗下的創投基金管理規模達17億元人民幣。
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

      {/* 國際業務板塊 */}
      <section id="ecosystem" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">集團國際業務佈局</h2>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg">
            以香港為超級樞紐，全面聯動 AI、區塊鏈、跨境資本與高端地產，為全球企業提供數字化轉型與資產增值的終極解方。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              onClick={() => setActiveModal(service.id)}
              className="p-8 md:p-10 bg-slate-900 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-blue-900/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  {service.icon}
                  <ArrowRight className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={24} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">{service.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 業務詳情彈窗 (Modal) */}
        {activeModal && activeData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={() => setActiveModal(null)}></div>
            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto md:overflow-y-visible">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-colors z-20">
                <X size={24} />
              </button>

              <div className="md:w-5/12 relative h-48 md:h-auto overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${activeData.deepImage})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                  <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/30 backdrop-blur-md rounded-lg mb-2 md:mb-4">
                    <span className="text-blue-400 font-bold tracking-wider text-xs md:text-sm">{activeData.stat}</span>
                  </div>
                </div>
              </div>

              <div className="md:w-7/12 p-6 md:p-12 flex flex-col justify-center bg-slate-900">
                <div className="flex items-center gap-3 mb-4 opacity-80">
                   {React.cloneElement(activeData.icon as React.ReactElement<any>, { size: 24, className: "text-blue-500 m-0" })}
                   <h4 className="text-base md:text-lg font-semibold text-slate-300">{activeData.title}</h4>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 leading-tight">{activeData.deepTitle}</h3>
                <div className="space-y-6 md:space-y-8">
                  {activeData.deepPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-3 md:gap-4 items-start">
                      <div className="p-2 md:p-3 bg-slate-800 rounded-xl text-blue-400 shrink-0">{point.icon}</div>
                      <div>
                        <h5 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">{point.title}</h5>
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-800">
                  {/* 改動：點擊這裡會觸發新的表單彈窗 */}
                  <button 
                    onClick={() => handleOpenContact(activeData.title)}
                    className="flex items-center text-blue-400 hover:text-blue-300 font-semibold group transition-colors text-sm md:text-base w-full p-4 bg-blue-900/20 rounded-xl justify-center border border-blue-500/20 hover:bg-blue-900/40"
                  >
                    聯繫業務負責人進一步探討 
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 新增：聯絡表單彈窗 (Context-Aware Form) */}
        {contactContext && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" onClick={() => setContactContext(null)}></div>
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl z-10 animate-in fade-in slide-in-from-bottom-10 duration-300">
              
              <button onClick={() => setContactContext(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">已收到您的需求</h3>
                  <p className="text-slate-400">我們的負責人將於 24 小時內與您聯繫。</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">專屬業務對接</h3>
                  <p className="text-slate-400 text-sm mb-6 flex items-center">
                    您正在諮詢：<span className="text-blue-400 font-medium ml-2 px-2 py-1 bg-blue-900/30 rounded-md">{contactContext}</span>
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">您想了解的具體方向或面臨的挑戰？</label>
                      <textarea 
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-28 resize-none placeholder:text-slate-600"
                        placeholder="例如：我們公司想引入 AI 優化產線，或者需要大宗貿易的資金通道..."
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">您的姓名 / 稱呼</label>
                        <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" placeholder="王先生" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">聯絡方式 (Email 或 電話)</label>
                        <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" placeholder="your@email.com" />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                      <Send size={18} /> 發送諮詢請求
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* AI News Section */}
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
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-2 md:p-6 shadow-2xl">
            <NewsWidget />
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm text-center md:text-left">
            © 2026 蟻米集團（國際）有限公司 YIMI International Holdings Limited. All Rights Reserved.
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
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
