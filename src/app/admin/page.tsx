'use client';

import React, { useState } from 'react';
import { 
  Lock, Cpu, Mail, Settings, LogOut, Activity, 
  PieChart, TrendingUp, DollarSign, Briefcase, Calendar, 
  MapPin, AlertCircle, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 狀態管理：控制當前顯示的視圖 ('dashboard' | 'capital')
  const [activeView, setActiveView] = useState('dashboard');

  // 登入驗證
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

  // 登入成功後的管理介面
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

      {/* 視圖切換邏輯 */}
      {activeView === 'dashboard' ? (
        <div className="max-w-6xl mx-auto p-6 py-12 animate-in fade-in duration-300">
          <h1 className="text-3xl font-bold text-white mb-8">控制中心 Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 新增的卡片：資金監控 */}
            <div className="bg-slate-900 border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)] p-6 rounded-2xl hover:bg-slate-800 transition-all">
              <div className="w-12 h-12 bg-blue-900/40 text-blue-400 rounded-xl flex items-center justify-center mb-4">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">資金監控矩陣</h3>
              <p className="text-slate-400 text-sm mb-6">監控全球專項融資成本與多維度本地/異地項目收益模型。</p>
              <button 
                onClick={() => setActiveView('capital')}
                className="w-full py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/20"
              >
                進入監控面板
              </button>
            </div>

            {/* 原有卡片 1：觸發 AI 生成 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center mb-4">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI 新聞引擎</h3>
              <p className="text-slate-400 text-sm mb-6">手動觸發 AI 模型，根據今日大盤與國際動態生成最新智庫報告。</p>
              <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-all">
                一鍵生成今日報告
              </button>
            </div>

            {/* 原有卡片 2：客戶名單 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-emerald-900/30 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">業務諮詢名單</h3>
              <p className="text-slate-400 text-sm mb-6">查看來自首頁「聯繫業務負責人」表單的潛在客戶名單與需求。</p>
              <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-all">
                查看 3 條未讀訊息
              </button>
            </div>

            {/* 原有卡片 3：網站設定 */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all">
              <div className="w-12 h-12 bg-purple-900/30 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Settings size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">系統與參數設定</h3>
              <p className="text-slate-400 text-sm mb-6">設定 AI 引擎的 Prompt 提示詞、管理員密碼以及接收通知的 Email。</p>
              <button className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 rounded-lg font-semibold transition-all">
                進入設定
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 資金監控矩陣 詳細面板 */
        <div className="max-w-7xl mx-auto p-6 py-8 animate-in slide-in-from-right-8 duration-300">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" /> 返回控制中心
          </button>

          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                全球資金佈局監控 <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md border border-emerald-500/30">實時監控中</span>
              </h1>
              <p className="text-slate-400">專項融資成本與跨地域項目收益分析模型 (月度動態)</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors flex items-center text-white">
              <Calendar size={16} className="mr-2"/> 匯出月度財報
            </button>
          </div>

          {/* Phase 1: 資金源與成本池 */}
          <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">Phase 1: Capital Source & Costs (融資成本池)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-slate-400 text-sm mb-1 flex items-center"><DollarSign size={14} className="mr-1"/> 專項貸款本金</div>
              <div className="text-3xl font-bold text-white">HK$ 100M</div>
              <div className="mt-2 text-xs text-slate-500">期限：5 年期</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-slate-400 text-sm mb-1">年化利息 (8%)</div>
              <div className="text-3xl font-bold text-red-400">HK$ 8.0M<span className="text-sm text-slate-500 font-normal"> /年</span></div>
              <div className="mt-2 text-xs text-slate-500">5年總息: HK$ 40M</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <div className="text-slate-400 text-sm mb-1">前端手續費 (6%)</div>
              <div className="text-3xl font-bold text-red-400">HK$ 6.0M</div>
              <div className="mt-2 text-xs text-slate-500">一次性扣除</div>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
              <div className="text-blue-300 text-sm mb-1 font-medium">盈虧平衡基準線 (Target ROI)</div>
              <div className="text-3xl font-bold text-blue-400">9.2%</div>
              <div className="mt-2 text-xs text-blue-300/70">項目平均年化需大於此數值方可覆蓋所有資金成本</div>
            </div>
          </div>

          {/* Phase 2: 資金流向與資產配置 */}
          <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">Phase 2: Capital Deployment (資產配置與流向)</h2>
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl mb-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-2xl font-bold text-white">已配置資金：HK$ 85,000,000</div>
                <div className="text-slate-400 text-sm mt-1">佔總本金 85% | 剩餘流動性：HK$ 15M</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold text-xl flex items-center justify-end"><TrendingUp size={20} className="mr-1"/> 12.5%</div>
                <div className="text-slate-500 text-xs mt-1">當前綜合預期年化收益</div>
              </div>
            </div>
            
            <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex mb-3">
              <div className="bg-blue-500 h-full w-[40%]" title="貿易項目 40M"></div>
              <div className="bg-indigo-500 h-full w-[30%]" title="地產項目 30M"></div>
              <div className="bg-cyan-500 h-full w-[15%]" title="科技項目 15M"></div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>大宗貿易 (40%)</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>智慧地產 (30%)</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>AI與科技 (15%)</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-slate-700 rounded-full mr-2"></span>閒置資金 (15%)</span>
            </div>
          </div>

          {/* Phase 3: 多維度項目收益追蹤 */}
          <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-4">Phase 3: Multi-Project ROI Tracking (項目收益追蹤 - 本月)</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">項目名稱</th>
                    <th className="px-6 py-4 font-medium">地域板塊</th>
                    <th className="px-6 py-4 font-medium">佔用資金</th>
                    <th className="px-6 py-4 font-medium">運行週期</th>
                    <th className="px-6 py-4 font-medium">當前 ROI (年化)</th>
                    <th className="px-6 py-4 font-medium text-right">狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2"><Briefcase size={16} className="text-blue-500"/> 非洲礦產大宗貿易</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1 text-slate-400"><MapPin size={14}/> 國際/約翰尼斯堡</span></td>
                    <td className="px-6 py-4">HK$ 40.0M</td>
                    <td className="px-6 py-4">第 3 個月</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">14.2%</td>
                    <td className="px-6 py-4 text-right"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">收益健康</span></td>
                  </tr>
                  <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2"><Building2 size={16} className="text-indigo-500"/> 蟻米智慧港 (產城開發)</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1 text-slate-400"><MapPin size={14}/> 本地/香港</span></td>
                    <td className="px-6 py-4">HK$ 30.0M</td>
                    <td className="px-6 py-4">第 8 個月</td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">11.5%</td>
                    <td className="px-6 py-4 text-right"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs border border-emerald-500/20">穩健增值</span></td>
                  </tr>
                  <tr className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-2"><Cpu size={16} className="text-cyan-500"/> AIGC 傳媒孵化器</td>
                    <td className="px-6 py-4"><span className="flex items-center gap-1 text-slate-400"><MapPin size={14}/> 異地/大灣區廣州</span></td>
                    <td className="px-6 py-4">HK$ 15.0M</td>
                    <td className="px-6 py-4">第 1 個月</td>
                    <td className="px-6 py-4 text-amber-400 font-medium">8.0% (爬坡期)</td>
                    <td className="px-6 py-4 text-right"><span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs border border-amber-500/20">建倉期預警</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-blue-900/10 border-t border-blue-900/30 text-xs text-blue-300/80 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" /> 系統提示：綜合 ROI (12.5%) 已超過盈虧基準線 (9.2%)，本月資金池淨利潤為正。建議將 15M 剩餘流動性投入短期金融商品以抵消利息成本。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
