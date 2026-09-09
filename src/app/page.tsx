'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Globe, Cpu, Blocks, Building2, BarChart3, 
  Shield, Target, Zap, ShieldCheck, Users, BarChart, X, Send, CheckCircle2, 
  Sparkles, Clapperboard, MonitorPlay, Layers 
} from 'lucide-react';
import NewsWidget from '@/components/NewsWidget';
import MarketTicker from '@/components/MarketTicker';

// ================= 全新業務矩陣資料 (AIGC 戰略升級版) =================
const servicesData = [
  {
    id: 'aigc',
    icon: <Clapperboard className="text-purple-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: 'AIGC 數字內容與傳媒',
    shortDesc: '專注於網絡短劇、AI 電影及創新數字媒體內容的策劃、製作與發行，打造泛娛樂 IP。',
    deepImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop', // 替換為科技娛樂感圖片
    deepTitle: '引領下一代生成式數字娛樂',
    deepPoints: [
      { icon: <MonitorPlay size={18}/>, title: 'AI 影視策劃與發行', desc: '從劇本生成、虛擬角色塑造到後期渲染，全面引入 AI 輔助，大幅縮短網絡短劇與 AI 電影的製作週期並降低成本。' },
      { icon: <Zap size={18}/>, title: '全矩陣數字媒體宣發', desc: '利用大數據模型預測爆款趨勢，並透過跨平台分發機制，精準觸達全球受眾，最大化數字內容的商業變現能力。' }
    ],
    stat: '重新定義數字娛樂生產力'
  },
  {
    id: 'platform',
    icon: <MonitorPlay className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: 'YIMI 數字與訂閱平台',
    shortDesc: '獨立運營的線上訂閱與分發生態。直接向企業與消費者提供專屬數字產品與技術服務。',
    deepImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', // 替換為平台螢幕感圖片
    deepTitle: '構建企業與個人的專屬 SaaS 生態',
    deepPoints: [
      { icon: <Users size={18}/>, title: 'B2C 數字內容訂閱', desc: '為 C 端用戶提供無縫的線上觀影、短劇解鎖及高級會員專屬的數字資產體驗。' },
      { icon: <Cpu size={18}/>, title: 'B2B 企業級 API 賦能', desc: '向企業客戶開放 AI 技術接口與解決方案訂閱，助力實體產業快速實現智能化轉型。' }
    ],
    stat: '全球化在線訂閱生態'
  },
  {
    id: 'ai-tech',
    icon: <BrainCircuit size={44} className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />,
    title: 'AI 核心科技研發',
    shortDesc: '以尖端人工智能算法為基石，提供企業級的智能解決方案與大數據深度分析。',
    deepImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop', // 替換為運算晶片感圖片
    deepTitle: '數據驅動的工業與商業大腦',
    deepPoints: [
      { icon: <BarChart size={18}/>, title: '企業級智能優化', desc: '深入企業核心流程，利用 AI 模型進行大數據過濾、預測性維護與供應鏈優化，大幅提升營運效率。' },
      { icon: <ShieldCheck size={18}/>, title: '金融與合規模型', desc: '部署私有化大模型，確保跨境資本調撥、大宗貿易合約的安全審查與實時風險對沖。' }
    ],
    stat: '核心算法賦能百業'
  },
  {
    id: 'smart-commerce',
    icon: <Layers className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={44} />,
    title: '區塊鏈與智慧商業',
    shortDesc: '融合區塊鏈重塑消費場景信任機制，結合實體資本發展跨境商業與智慧地產項目。',
    deepImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop', // 智慧城市圖片
    deepTitle: '虛實融合 (Phygital) 的未來場景',
    deepPoints: [
      { icon: <Globe size={18}/>, title: '跨境資本與大宗貿易', desc: '深度配合區域金融政策，為大型企業提供合規的資金調撥方案與跨國大宗商品買賣樞紐服務。' },
      { icon: <Building2 size={18}/>, title: '智慧產城與高端地產', desc: '整合 IoT 與 AI 樓宇管理系統，開發符合國際標準的優質地產項目，打造兼具生活品質與創新活力的科技聚落。' }
    ],
    stat: '打通實體與數字資本'
  }
];

// 用戶手動引入圖標 (因為上方未引入 BrainCircuit)
import { BrainCircuit } from 'lucide-react';

const btn1DeepResearch = `由集團 AI 引擎即時分析全球政策導向、金融波動及行業深度動態。我們的 AI 模型不僅分析 Market Ticker 等每日開盤數據，更能針對國際政治、大宗商品期貨、智慧地產園區管理等特定領域，生成具有國際投行水準的深度研究報告與決策建議，為跨境資本開拓新的增長極。`;

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [contactContext, setContactContext] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeData = servicesData.find(s => s.id === activeModal);

  const handleOpenContact = (title: string) => {
    setActiveModal(null); 
    setContactContext(title); 
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('來源板塊', contactContext || '未定');

    try {
      await fetch('https://formspree.io/f/meepbnpb', {
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      });
      setIsSubmitted(true);
      setTimeout(() => { setContactContext(null); }, 3000);
    } catch (error) {
      alert('發送失敗，請稍後再試。');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 relative selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      
      <MarketTicker />

      {/* ================= 1. 全新科技感首屏 (Hero Section) ================= */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 border-b border-slate-900">
        {/* 背景光暈特效 (AIGC 氛圍) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          
          {/* Logo 處理 (維持銀白色高質感) */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full w-32 h-32 mx-auto -z-10"></div>
            <img 
              src="/logo.png" 
              alt="YIMI Group Logo" 
              className="h-14 md:h-20 w-auto object-contain grayscale brightness-[300%] contrast-125 opacity-90 hover:opacity-100 transition-all drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
              onError={(e) => e.currentTarget.style.display = 'none'} 
            />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md shadow-lg shadow-blue-900/20">
            <Sparkles size={16} className="animate-pulse" />
            <span>YIMI GROUP 戰略升級：全面佈局 AIGC 數字生態</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
            以 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">人工智能</span> 為核心<br/>
            構建綜合數字科技生態
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
            我們致力於 AI 科技、區塊鏈消費與智慧地產，並強勢拓展 <strong className="text-white font-semibold">AIGC 數字內容業務</strong>。從網絡短劇到 AI 電影策劃與發行，透過旗下專屬線上平台，為全球企業與消費者提供頂尖的數字產品與訂閱服務。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
            {/* 💡 主要引導按鈕：前往訂閱平台 */}
            <Link href="/platform" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2">
  <Globe size={18} /> 前往 ReelStory 數字訂閱平台
</Link>
            <button onClick={() => document.getElementById('ecosystem')?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all border border-slate-700 flex items-center justify-center gap-2">
              探索核心業務矩陣 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 實力背書區塊 */}
      <section className="relative z-20 bg-slate-900/40 backdrop-blur-md py-16 px-6 border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-sm text-blue-400 font-bold uppercase tracking-widest mb-2">中國強大後盾 Backed By</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">廣州蟻米控股</h2>
            <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              全國獨創<span className="text-slate-200 font-medium">「教+創+孵+投」</span>四位一體閉環生態。作為大灣區數字化產業的領軍者，我們成功孵化多家上市企業，旗下的創投基金管理規模達17億元人民幣。
            </p>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            {[
              { label: '管理創投基金', value: '17 億+' },
              { label: '運營產業園區', value: '4 座' },
              { label: '深度佈局領域', value: 'AIGC & Web3' },
              { label: '核心戰略驅動', value: 'AI 賦能' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 text-center flex flex-col justify-center transition-colors hover:border-blue-500/50">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. 核心業務矩陣 (Business Matrix) ================= */}
      <section id="ecosystem" className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">業務矩陣與數字版圖</h2>
          <p className="text-slate-400 max-w-3xl mx-auto leading-relaxed text-lg">
            打破實體與虛擬的邊界，透過四大核心引擎驅動全球企業與消費者的未來體驗。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {servicesData.map((service) => (
            <div 
              key={service.id}
              onClick={() => setActiveModal(service.id)}
              className="p-8 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-blue-900/20 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  {service.icon}
                  <ArrowRight className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{service.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 業務詳情彈窗 (Modal) */}
        {activeModal && activeData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity" onClick={() => setActiveModal(null)}></div>
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

                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-4">
                  {activeModal === 'platform' ? (
                     <a href="https://your-subscription-platform.com" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-500 font-bold transition-all text-sm md:text-base p-4 rounded-xl shadow-lg shadow-blue-500/20">
                       前往線上訂閱平台 <Globe size={18} className="ml-2" />
                     </a>
                  ) : null}
                  <button 
                    onClick={() => handleOpenContact(activeData.title)}
                    className="flex-1 flex items-center text-blue-400 hover:text-blue-300 font-semibold group transition-colors text-sm md:text-base p-4 bg-slate-800 rounded-xl justify-center border border-slate-700 hover:bg-slate-700"
                  >
                    聯繫業務對接 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 聯絡表單彈窗 */}
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
                  <h3 className="text-2xl font-bold text-white mb-2">專屬業務諮詢</h3>
                  <p className="text-slate-400 text-sm mb-6 flex items-center">
                    板塊：<span className="text-blue-400 font-medium ml-2 px-2 py-1 bg-blue-900/30 rounded-md">{contactContext}</span>
                  </p>

                 <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">您的具體需求或合作意向？</label>
                    <textarea 
                      name="諮詢需求" 
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-28 resize-none placeholder:text-slate-600"
                      placeholder="例如：了解短劇聯合發行，或需要企業 API 技術接入..."
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">您的姓名 / 稱呼</label>
                      <input type="text" name="客戶姓名" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" placeholder="王先生" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">聯絡方式</label>
                      <input type="text" name="聯絡方式" required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600" placeholder="your@email.com" />
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

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm text-center md:text-left">
            © 2018-{new Date().getFullYear()} 蟻米集團（國際）有限公司 YIMI Group. All Rights Reserved.
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
