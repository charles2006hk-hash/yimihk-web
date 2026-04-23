'use client';

import React, { useState } from 'react';
import { 
  Lock, Cpu, Mail, Settings, LogOut, Activity, 
  PieChart, TrendingUp, DollarSign, Briefcase, Calendar, 
  MapPin, AlertCircle, ArrowLeft, Building2, User, 
  MessageSquare, Save, Key, Bell, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 狀態管理：控制當前顯示的視圖 ('dashboard' | 'capital' | 'consultation' | 'settings')
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yimi2026') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('密碼錯誤，請重新輸入或聯繫系統管理員。');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">內部系統登入</h2>
          <p className="text-slate-400 text-center text-sm mb-8">蟻米集團 (國際) AI 管理後台</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入系統密碼"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center tracking-widest"
              />
              {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
              進入系統
            </button>
            <div className="text-center">
              <Link href="/" className="text-slate-500 text-sm hover:text-white transition-colors">返回官網首頁</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-bold text-xl text-white flex items-center gap-2">
          <Cpu className="text-blue-500" /> YIMI Admin
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-slate-400 hover:text-white text-sm">
          <LogOut size={16} className="mr-1" /> 登出系統
        </button>
      </nav>

      {/* 1. 控制中心總覽 (Dashboard) */}
      {activeView === 'dashboard' && (
        <div className="max-w-6xl mx-auto p-6 py-12 animate-in fade-in duration-300">
          <h1 className="text-3xl font-bold text-white mb-8">控制中心 Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 卡片：資金監控 */}
            <div className="bg-slate-900 border border-blue-500/50 p-6 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="w-12 h-12 bg-blue-900/40 text-blue-400 rounded-xl flex items-center justify-center mb-4"><PieChart size={24} /></div>
              <h3 className="text-xl font-bold text-white mb-2">資金監控矩陣</h3>
              <p className="text-slate-400 text-sm mb-6">監控全球專項融資成本與項目收益模型。</p>
              <button onClick={() => setActiveView('capital')} className="w-full py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-lg font-semibold transition-all">進入監控面板</button>
            </div>

            {/* 卡片：AI 新聞引擎 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center mb-4"><Activity size={24} /></div>
              <h3 className="text-xl font-bold text-white mb-2">AI 新聞引擎</h3>
              <p className="text-slate-400 text-sm mb-6">自動生成今日全球大盤與國際智庫報告。</p>
              <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-all">一鍵生成報告</button>
            </div>

            {/* 卡片：業務諮詢名單 (信息管理) */}
            <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="w-12 h-12 bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center mb-4"><Mail size={24} /></div>
              <h3 className="text-xl font-bold text-white mb-2">業務諮詢名單</h3>
              <p className="text-slate-400 text-sm mb-6">管理來自首頁表單的潛在客戶名單與需求。</p>
              <button onClick={() => setActiveView('consultation')} className="w-full py-3 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 rounded-lg font-semibold transition-all">管理名單 (3)</button>
            </div>

            {/* 卡片：系統設定 */}
            <div className="bg-slate-900 border border-purple-500/30 p-6 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="w-12 h-12 bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center mb-4"><Settings size={24} /></div>
              <h3 className="text-xl font-bold text-white mb-2">系統與參數設定</h3>
              <p className="text-slate-400 text-sm mb-6">設定 AI 提示詞、密碼及接收通知的 Email。</p>
              <button onClick={() => setActiveView('settings')} className="w-full py-3 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg font-semibold transition-all">進入設定</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 資金監控矩陣 (詳情頁) */}
      {activeView === 'capital' && (
        <div className="max-w-7xl mx-auto p-6 py-8 animate-in slide-in-from-right-8 duration-300">
          <button onClick={() => setActiveView('dashboard')} className="flex items-center text-slate-400 hover:text-white mb-8"><ArrowLeft size={18} className="mr-2" /> 返回控制中心</button>
          <div className="flex justify-between items-end mb-8">
            <div><h1 className="text-3xl font-bold text-white mb-2">全球資金佈局監控</h1><p className="text-slate-400">融資成本與跨地域項目收益分析</p></div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">匯出月度財報</button>
          </div>
          {/* ... 此處省略之前的表格代碼以節省空間，功能完全一致 ... */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="text-slate-500 uppercase text-xs border-b border-slate-800">
                    <tr><th className="pb-4 px-4">項目名稱</th><th className="pb-4 px-4">地域</th><th className="pb-4 px-4">佔用資金</th><th className="pb-4 px-4">ROI</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    <tr><td className="py-4 px-4 flex items-center gap-2 text-white"><Briefcase size={16} className="text-blue-500"/> 非洲礦產貿易</td><td className="py-4 px-4">國際</td><td className="py-4 px-4">40.0M</td><td className="py-4 px-4 text-emerald-400">14.2%</td></tr>
                    <tr><td className="py-4 px-4 flex items-center gap-2 text-white"><Building2 size={16} className="text-indigo-500"/> 蟻米智慧港</td><td className="py-4 px-4">本地</td><td className="py-4 px-4">30.0M</td><td className="py-4 px-4 text-emerald-400">11.5%</td></tr>
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. 業務諮詢名單 (信息管理詳情頁) */}
      {activeView === 'consultation' && (
        <div className="max-w-7xl mx-auto p-6 py-8 animate-in slide-in-from-right-8 duration-300">
          <button onClick={() => setActiveView('dashboard')} className="flex items-center text-slate-400 hover:text-white mb-8"><ArrowLeft size={18} className="mr-2" /> 返回控制中心</button>
          <h1 className="text-3xl font-bold text-white mb-8">業務諮詢名單管理</h1>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 text-slate-500 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">時間</th>
                  <th className="px-6 py-4">客戶名稱</th>
                  <th className="px-6 py-4">聯絡方式</th>
                  <th className="px-6 py-4">來源板塊</th>
                  <th className="px-6 py-4">具體需求摘要</th>
                  <th className="px-6 py-4 text-right">處理</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {[
                  { date: '2026-04-10 16:21', name: '王先生', contact: 'wang@example.com', sector: '跨境資本與貿易', need: '需要了解大宗商品資金通道與風險對沖方案。' },
                  { date: '2026-04-10 14:05', name: '李總', contact: '+852 9876 XXXX', sector: 'AI 領域與創意工業', need: '公司產線希望引入 AI 視覺檢測，進行生產優化。' },
                  { date: '2026-04-09 22:18', name: 'Charles', contact: 'charles@yimihk.com', sector: '地產開發及營運', need: '諮詢優才融入計劃下的高端住宅配對服務。' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2"><User size={14} className="text-blue-400"/> {item.name}</td>
                    <td className="px-6 py-4 text-blue-400">{item.contact}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs border border-blue-500/20">{item.sector}</span></td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{item.need}</td>
                    <td className="px-6 py-4 text-right"><button className="text-xs text-slate-500 hover:text-white underline">已跟進</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 系統與參數設定 (詳情頁) */}
      {activeView === 'settings' && (
        <div className="max-w-4xl mx-auto p-6 py-8 animate-in slide-in-from-right-8 duration-300">
          <button onClick={() => setActiveView('dashboard')} className="flex items-center text-slate-400 hover:text-white mb-8"><ArrowLeft size={18} className="mr-2" /> 返回控制中心</button>
          <h1 className="text-3xl font-bold text-white mb-8">系統參數設定</h1>

          <div className="space-y-6">
            {/* 安全設定 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Key size={20} className="text-blue-500"/> 安全與權限</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">修改管理後台密碼</label>
                  <input type="password" placeholder="輸入新密碼" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                </div>
                <div className="flex items-end"><button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"><Save size={18}/> 保存更新</button></div>
              </div>
            </div>

            {/* 通知設定 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell size={20} className="text-emerald-500"/> 通知與推送</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">客戶表單接收郵箱 (Formspree 目標)</label>
                  <input type="email" placeholder="charles@yimihk.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked className="w-4 h-4 accent-emerald-500" />
                  <span className="text-sm text-slate-300">當有新諮詢時，發送手機簡訊通知</span>
                </div>
              </div>
            </div>

            {/* AI 設定 */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck size={20} className="text-purple-500"/> AI 智庫生成參數</h3>
              <div>
                <label className="block text-sm text-slate-400 mb-2">AI 深度分析 Prompt 預設提示詞</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-purple-500 h-32 resize-none">
                  你現在是蟻米集團的首席 AI 分析師。請結合今日全球財經數據，為大灣區的高端客戶生成一份關於「跨境資本流動」與「AI 工業轉型」的深度洞察報告...
                </textarea>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
