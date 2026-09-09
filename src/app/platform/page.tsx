'use client';

import React, { useState } from 'react';
import Link from 'next/link';
// 🌟 這裡補上了 X 圖標的引入
import { Play, Info, Crown, Sparkles, Film, ArrowLeft, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function PlatformShowcase() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 模擬數據：AIGC 短劇與電影
  const trendingContent = [
    { id: 1, title: '賽博長安 (Cyber ChangAn)', category: 'AIGC 短劇', match: '98% Match', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop' },
    { id: 2, title: '神經網絡 (Neural Net)', category: 'AI 科幻電影', match: '95% Match', img: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop' },
    { id: 3, title: '量子戀人 (Quantum Love)', category: '互動影視', match: '92% Match', img: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop' },
    { id: 4, title: '深淵代碼 (Abyss Code)', category: 'AIGC 懸疑', match: '99% Match', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop' },
  ];

  // 處理等候名單表單提交
  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('來源', 'ReelStory TV 等候名單');

    try {
      await fetch('https://formspree.io/f/meepbnpb', { // 使用你現有的 Formspree
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      });
      setIsSubmitted(true);
      setTimeout(() => { 
        setIsSubmitted(false);
        setShowWaitlistModal(false); 
      }, 3000);
    } catch (error) {
      alert('發送失敗，請稍後再試。');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* 頂部導覽列 (透明浮動) */}
      <nav className="fixed w-full z-50 top-0 bg-gradient-to-b from-black/80 to-transparent pt-6 pb-10 px-8 flex justify-between items-center transition-all">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 flex items-center gap-2">
            <Film size={28} className="text-purple-500" /> ReelStory TV
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
            <span className="text-white cursor-pointer hover:text-purple-400 transition-colors">首頁</span>
            <span className="cursor-pointer hover:text-purple-400 transition-colors">AIGC 短劇</span>
            <span className="cursor-pointer hover:text-purple-400 transition-colors">AI 電影</span>
            <span className="cursor-pointer hover:text-purple-400 transition-colors">企業 API</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> 返回 YIMI 官網
          </Link>
          <button onClick={() => setShowWaitlistModal(true)} className="px-5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-bold backdrop-blur-md transition-all">
            登入 / 註冊
          </button>
        </div>
      </nav>

      {/* 1. Hero 巨幕區塊 (致敬 Netflix 風格) */}
      <section className="relative h-[85vh] w-full flex items-center px-8 md:px-16 pt-20">
        {/* 背景大圖與漸變遮罩 */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" alt="Hero Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="YIMI" className="h-6 w-auto grayscale brightness-200" />
            <span className="text-sm font-bold tracking-widest text-slate-300 uppercase">Originals</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            星際演算法
          </h1>
          <h2 className="text-2xl font-light text-slate-300 mb-6 tracking-wide">第一季 • AIGC 旗艦短劇</h2>
          
          <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
            人類意識被上傳至雲端後，代碼成為了新的靈魂。由 YIMI AIGC 引擎全景生成的年度科幻鉅作，體驗前所未有的視覺震撼。
          </p>
          
          <div className="flex gap-4">
            <button onClick={() => setShowWaitlistModal(true)} className="px-8 py-3.5 bg-white text-black hover:bg-slate-200 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-105">
              <Play size={20} className="fill-black" /> 立即觀看
            </button>
            <button onClick={() => setShowWaitlistModal(true)} className="px-8 py-3.5 bg-slate-500/30 hover:bg-slate-500/50 text-white rounded-lg font-bold flex items-center gap-2 backdrop-blur-md transition-all">
              <Info size={20} /> 了解更多
            </button>
          </div>
        </div>
      </section>

      {/* 2. 內容輪播預覽 (Trending Section) */}
      <section className="relative z-10 px-8 md:px-16 -mt-20 pb-20">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-purple-500" size={20}/> 本週熱門 AIGC 影視</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingContent.map((item) => (
            <div key={item.id} onClick={() => setShowWaitlistModal(true)} className="group relative rounded-md overflow-hidden cursor-pointer aspect-video bg-slate-800">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-green-500 font-bold text-xs mb-1">{item.match}</span>
                <h4 className="font-bold text-white text-sm md:text-base mb-1">{item.title}</h4>
                <span className="text-xs text-slate-400 border border-slate-600 rounded px-1.5 py-0.5 inline-block w-max">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 訂閱方案預覽 (Pricing Section) */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">解鎖無限數字體驗</h2>
            <p className="text-slate-400">選擇適合您的訂閱方案，即刻享受 YIMI 平台專屬的高品質 AIGC 內容與技術賦能。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 方案 1 */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-bold text-slate-300 mb-2">基礎會員 (Basic)</h3>
              <div className="text-4xl font-black text-white mb-6">HK$ 68 <span className="text-lg text-slate-500 font-normal">/ 月</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-400 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-500"/> 無限觀看標準畫質內容</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-500"/> 支援手機與平板設備</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-500"/> 每月解鎖 2 部專屬短劇</li>
              </ul>
              <button onClick={() => setShowWaitlistModal(true)} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">選擇方案</button>
            </div>

            {/* 方案 2 (主推) */}
            <div className="bg-gradient-to-b from-purple-900/40 to-blue-900/20 border border-purple-500/50 p-8 rounded-3xl flex flex-col relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Crown size={14}/> 最受歡迎
              </div>
              <h3 className="text-xl font-bold text-white mb-2">尊享會員 (Premium)</h3>
              <div className="text-4xl font-black text-white mb-6">HK$ 128 <span className="text-lg text-slate-400 font-normal">/ 月</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-300 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400"/> 4K HDR 超高清沉浸畫質</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400"/> AIGC 全庫內容無限解鎖</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400"/> 支援 4 台設備同時在線</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-purple-400"/> 專屬數字藏品 (NFT) 空投</li>
              </ul>
              <button onClick={() => setShowWaitlistModal(true)} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all shadow-lg">立即訂閱</button>
            </div>

            {/* 方案 3 */}
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl flex flex-col">
              <h3 className="text-xl font-bold text-slate-300 mb-2">企業接入 (Enterprise)</h3>
              <div className="text-4xl font-black text-white mb-6">客製化報價</div>
              <ul className="space-y-4 mb-8 flex-1 text-slate-400 text-sm">
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500"/> AI 影視生成 API 接口</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500"/> 企業品牌短劇客製化製作</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-blue-500"/> 專屬商務經理與技術支援</li>
              </ul>
              <button onClick={() => setShowWaitlistModal(true)} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">聯絡業務</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 等候名單/引流 Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowWaitlistModal(false)}></div>
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl z-10 animate-in zoom-in-95">
            <button onClick={() => setShowWaitlistModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={24} /></button>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} /></div>
                <h3 className="text-2xl font-bold text-white mb-2">已成功加入等候名單</h3>
                <p className="text-slate-400">平台正式上線時，我們將第一時間通知您並發送早鳥優惠！</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6"><Sparkles size={40} className="text-purple-500" /></div>
                <h3 className="text-2xl font-bold text-center text-white mb-2">ReelStory TV 即將上線</h3>
                <p className="text-center text-slate-400 text-sm mb-8">平台目前處於封閉測試階段。加入等候名單，獲取首批體驗資格與終身訂閱折扣。</p>
                
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <input type="text" name="姓名" required placeholder="您的稱呼" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <input type="email" name="Email" required placeholder="電子郵件地址" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white outline-none focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <select name="需求類型" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-300 outline-none focus:border-purple-500 transition-colors appearance-none">
                      <option value="個人訂閱觀影">我想訂閱觀看 AIGC 影視</option>
                      <option value="企業合作/API">我是企業，想了解合作與 API</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-4 mt-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors">
                    加入等候名單
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
