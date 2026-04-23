'use client';

import React, { useState } from 'react';
import { 
  Lock, Cpu, Mail, Settings, LogOut, Activity, 
  PieChart, TrendingUp, DollarSign, Briefcase, Calendar, 
  MapPin, AlertCircle, Building2, User, Save, Key, Bell, 
  ShieldCheck, Plus, FileText, UploadCloud, Edit3, Trash2, X, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  // ================= 1. 系統層級狀態 =================
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('capital');

  // ================= 2. 資金監控系統狀態 =================
  const [capitalConfig, setCapitalConfig] = useState({
    principal: 100000000, 
    interestRate: 8,      
    durationYears: 5,     
    upfrontFeeRate: 6     
  });

  const [projects, setProjects] = useState([
    { id: 1, name: '非洲礦產大宗貿易', region: '國際/約堡', allocated: 40000000, monthsActive: 3, roi: 14.2, status: '收益健康' },
    { id: 2, name: '蟻米智慧港 (產城開發)', region: '本地/香港', allocated: 30000000, monthsActive: 8, roi: 11.5, status: '穩健增值' },
    { id: 3, name: 'AIGC 傳媒孵化器', region: '異地/廣州', allocated: 15000000, monthsActive: 1, roi: 8.0, status: '建倉期預警' }
  ]);

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState({
    id: 0, name: '', region: '本地/香港', allocated: 0, monthsActive: 1, roi: 0, status: '建倉期預警'
  });

  const totalAllocated = projects.reduce((sum, p) => sum + Number(p.allocated), 0);
  const remainingLiquidity = capitalConfig.principal - totalAllocated;
  const annualInterestCost = capitalConfig.principal * (capitalConfig.interestRate / 100);
  const upfrontFeeCost = capitalConfig.principal * (capitalConfig.upfrontFeeRate / 100);
  const targetROI = ((annualInterestCost + (upfrontFeeCost / capitalConfig.durationYears)) / capitalConfig.principal) * 100;
  const currentAvgROI = totalAllocated === 0 ? 0 : projects.reduce((sum, p) => sum + (Number(p.roi) * (Number(p.allocated)/totalAllocated)), 0);

  // ================= 3. AI 智庫狀態 =================
  const [newsArticles, setNewsArticles] = useState([
    { id: 1, title: '香港「超級聯繫人」政策升級：大灣區資本跨境流動新指南', category: '政策解讀', date: '2026-04-10', published: true },
    { id: 2, title: 'AIGC 工業應用報告：生成式 AI 如何降低 40% 營銷成本', category: '行業洞察', date: '2026-04-09', published: true },
    { id: 3, title: '全球大宗商品價格波動與區塊鏈溯源的避險價值', category: '市場預警', date: '2026-04-08', published: true }
  ]);

  // ================= 4. 操作邏輯函數 =================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yimi2026') { setIsLoggedIn(true); setError(''); } 
    else { setError('密碼錯誤，請重新輸入。'); }
  };

  const handleGenerateNews = () => {
    const newArticle = {
      id: Date.now(),
      title: `AI 實時預測：${new Date().toLocaleDateString()} 亞洲跨境資本流向異動分析`,
      category: '實時研報',
      date: new Date().toISOString().split('T')[0],
      published: false
    };
    setNewsArticles([newArticle, ...newsArticles]);
    alert('✅ AI 引擎已成功抓取最新數據並生成草稿報告！');
  };

  const openAddProject = () => {
    setEditingProject({ id: 0, name: '', region: '本地/香港', allocated: 0, monthsActive: 1, roi: 0, status: '建倉期預警' });
    setShowProjectModal(true);
  };

  const openEditProject = (project: any) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const saveProject = () => {
    if (editingProject.id === 0) {
      setProjects([...projects, { ...editingProject, id: Date.now() }]);
    } else {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setShowProjectModal(false);
  };

  const deleteProject = (id: number) => {
    if (window.confirm("確定要刪除這個監控項目嗎？")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  // ================= 登入畫面 =================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]"><Lock size={32} /></div></div>
          <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-wide">YIMI ADMIN</h2>
          <p className="text-slate-400 text-center text-sm mb-8">蟻米集團 (國際) 內部管控系統</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="請輸入系統密碼" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none text-center tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">安全登入</button>
            <div className="text-center"><Link href="/" className="text-slate-500 text-sm hover:text-white transition-colors">← 返回官網首頁</Link></div>
          </form>
        </div>
      </div>
    );
  }

  // ================= 主系統畫面 =================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-40 relative shadow-md">
        <div className="font-bold text-xl text-white flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg"><Cpu className="text-blue-500" size={20} /></div>YIMI Admin
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"><LogOut size={16} className="mr-2" /> 登出系統</button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* 左側選單 */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: <Activity size={18}/>, label: '系統總覽' },
            { id: 'capital', icon: <PieChart size={18}/>, label: '資金監控系統' },
            { id: 'news', icon: <FileText size={18}/>, label: 'AI 智庫管理' },
            { id: 'leads', icon: <Mail size={18}/>, label: '業務諮詢名單' },
            { id: 'settings', icon: <Settings size={18}/>, label: '系統設定' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full text-left
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </aside>

        {/* 右側內容 */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950 relative">
          
          {/* ================= 模組 1：系統總覽 ================= */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-white mb-2">控制中心 Dashboard</h1>
              <p className="text-slate-400 mb-8">歡迎回來，這裡是蟻米集團的數字化指揮中心。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('capital')} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 cursor-pointer transition-all shadow-lg hover:shadow-blue-900/20 group">
                  <PieChart className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">資金水位：HK$ {(capitalConfig.principal / 1000000).toFixed(0)}M</h3>
                  <p className="text-slate-400 text-sm">已配置 {capitalConfig.principal > 0 ? ((totalAllocated/capitalConfig.principal)*100).toFixed(0) : 0}%，剩餘流動性 HK$ {(remainingLiquidity/1000000).toFixed(1)}M</p>
                </div>
                <div onClick={() => setActiveTab('leads')} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500 cursor-pointer transition-all shadow-lg hover:shadow-emerald-900/20 group">
                  <Mail className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">新諮詢名單</h3>
                  <p className="text-slate-400 text-sm">3 筆來自首頁「聯繫業務負責人」的未讀需求。</p>
                </div>
                <div onClick={() => { setActiveTab('news'); handleGenerateNews(); }} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500 cursor-pointer transition-all shadow-lg hover:shadow-purple-900/20 group">
                  <Cpu className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">AI 研報引擎</h3>
                  <p className="text-slate-400 text-sm">點擊手動觸發 AI 模型生成今日大盤智庫報告。</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 模組 2：資金監控系統 ================= */}
          {activeTab === 'capital' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">動態資金監控系統 <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md border border-emerald-500/30">實時運算中</span></h1>
                  <p className="text-slate-400">所有參數皆可點擊修改，系統將自動重算成本水位與收益配置。</p>
                </div>
                <button onClick={() => alert('開發中功能：此處將開啟上傳視窗，讀取銀行的 CSV 檔自動映射各專案金流。')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center text-white border border-slate-600 transition-colors">
                  <UploadCloud size={16} className="mr-2"/> 導入銀行月結單對帳
                </button>
              </div>

              {/* 總資金池設定 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl">
                <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-6 flex items-center"><DollarSign size={16} className="mr-1"/> 總資金池設定 (可編輯)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div><label className="block text-xs text-slate-500 mb-1">貸款本金 (HK$)</label><input type="number" value={capitalConfig.principal} onChange={(e) => setCapitalConfig({...capitalConfig, principal: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">年化利息 (%)</label><input type="number" value={capitalConfig.interestRate} onChange={(e) => setCapitalConfig({...capitalConfig, interestRate: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">前端手續費 (%)</label><input type="number" value={capitalConfig.upfrontFeeRate} onChange={(e) => setCapitalConfig({...capitalConfig, upfrontFeeRate: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">貸款期限 (年)</label><input type="number" value={capitalConfig.durationYears} onChange={(e) => setCapitalConfig({...capitalConfig, durationYears: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500 transition-colors" /></div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl"><div className="text-xs text-slate-500">每年利息支出</div><div className="text-xl font-bold text-red-400 mt-1">HK$ {(annualInterestCost/1000000).toFixed(2)}M</div></div>
                  <div className="bg-slate-950 p-4 rounded-xl"><div className="text-xs text-slate-500">總手續費成本</div><div className="text-xl font-bold text-red-400 mt-1">HK$ {(upfrontFeeCost/1000000).toFixed(2)}M</div></div>
                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                    <div className="text-xs text-blue-300 font-medium z-10 relative">系統計算：盈虧平衡基準線</div>
                    <div className="text-2xl font-bold text-blue-400 mt-1 z-10 relative">{targetROI.toFixed(2)}% ROI</div>
                  </div>
                </div>
              </div>

              {/* 專案監控列表 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">各項配置監控與月度紀錄</h2>
                    <p className="text-sm text-slate-400">目前綜合 ROI：<span className="text-emerald-400 font-bold ml-1">{currentAvgROI.toFixed(2)}%</span> <span className="mx-2">|</span> 剩餘未配置資金：<span className={remainingLiquidity < 0 ? 'text-red-400 font-bold ml-1' : 'text-slate-300 ml-1'}>HK$ {(remainingLiquidity/1000000).toFixed(2)}M</span></p>
                  </div>
                  <button onClick={openAddProject} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold text-white flex items-center transition-all shadow-lg shadow-blue-500/20">
                    <Plus size={16} className="mr-1"/> 新增監控項目
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium tracking-wider">項目名稱 / 地域</th>
                        <th className="px-6 py-4 font-medium tracking-wider">佔用資金</th>
                        <th className="px-6 py-4 font-medium tracking-wider">運行時間</th>
                        <th className="px-6 py-4 font-medium tracking-wider">實時 ROI</th>
                        <th className="px-6 py-4 font-medium tracking-wider">當前狀態</th>
                        <th className="px-6 py-4 font-medium text-right tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-1"><MapPin size={12} className="mr-1"/>{p.region}</div>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium">HK$ {(p.allocated/1000000).toFixed(1)}M</td>
                          <td className="px-6 py-4">{p.monthsActive} 個月</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{p.roi}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs border ${
                              p.status === '收益健康' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                              p.status === '穩健增值' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{p.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openEditProject(p)} className="text-blue-400 hover:text-white px-2 transition-colors"><Edit3 size={16}/></button>
                            <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-white px-2 transition-colors"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-slate-500">尚無專案，請點擊上方按鈕新增。</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 模組 3：AI 智庫發佈系統 ================= */}
          {activeTab === 'news' && (
            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">AI 智庫管理系統</h1>
                  <p className="text-slate-400">管理將顯示在官網首頁的新聞、研報與洞察。</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleGenerateNews} className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-sm font-bold transition-all flex items-center shadow-lg hover:shadow-purple-900/20">
                    <Cpu size={16} className="mr-2"/> AI 一鍵生成研報
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all flex items-center shadow-lg shadow-blue-500/20">
                    <Plus size={16} className="mr-1"/> 手動發佈文章
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-medium tracking-wider">文章標題</th>
                      <th className="px-6 py-4 font-medium tracking-wider">分類</th>
                      <th className="px-6 py-4 font-medium tracking-wider">日期</th>
                      <th className="px-6 py-4 font-medium tracking-wider">狀態</th>
                      <th className="px-6 py-4 font-medium text-right tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {newsArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{article.title}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">{article.category}</span></td>
                        <td className="px-6 py-4 text-slate-400">{article.date}</td>
                        <td className="px-6 py-4">
                          {article.published ? 
                            <span className="text-emerald-400 flex items-center text-xs font-medium"><div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>已發佈</span> : 
                            <span className="text-amber-400 flex items-center text-xs font-medium"><div className="w-2 h-2 bg-amber-400 rounded-full mr-2 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>草稿 (待審核)</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-400 hover:text-white px-2 transition-colors"><Edit3 size={16}/></button>
                          <button className="text-red-400 hover:text-white px-2 transition-colors" onClick={() => {if(window.confirm('確定刪除文章？')) setNewsArticles(newsArticles.filter(a => a.id !== article.id))}}><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 模組 4：業務諮詢名單 ================= */}
          {activeTab === 'leads' && (
             <div className="animate-in fade-in duration-300">
               <div className="flex justify-between items-end mb-8">
                 <div>
                   <h1 className="text-3xl font-bold text-white mb-2">業務諮詢名單管理</h1>
                   <p className="text-slate-400">來自首頁「聯繫業務負責人」表單的潛在客戶詢問單。</p>
                 </div>
                 <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-600">
                    匯出 CSV 名單
                 </button>
               </div>
               
               <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-950 text-slate-500 uppercase text-xs border-b border-slate-800">
                     <tr>
                       <th className="px-6 py-4 font-medium tracking-wider">時間</th>
                       <th className="px-6 py-4 font-medium tracking-wider">客戶名稱</th>
                       <th className="px-6 py-4 font-medium tracking-wider">聯絡方式</th>
                       <th className="px-6 py-4 font-medium tracking-wider">來源板塊</th>
                       <th className="px-6 py-4 font-medium tracking-wider">具體需求摘要</th>
                       <th className="px-6 py-4 text-right font-medium tracking-wider">處理狀態</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800 text-slate-300">
                     {[
                       { id: 1, date: '2026-04-10 16:21', name: '王先生', contact: 'wang@example.com', sector: '跨境資本與貿易', need: '需要了解大宗商品資金通道與風險對沖方案。' },
                       { id: 2, date: '2026-04-10 14:05', name: '李總', contact: '+852 9876 XXXX', sector: 'AI 領域與創意工業', need: '公司產線希望引入 AI 視覺檢測，進行生產優化。' },
                       { id: 3, date: '2026-04-09 22:18', name: 'Charles', contact: 'charles@yimihk.com', sector: '地產開發及營運', need: '諮詢優才融入計劃下的高端住宅配對服務。' },
                     ].map((item) => (
                       <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                         <td className="px-6 py-4 text-xs text-slate-500">{item.date}</td>
                         <td className="px-6 py-4 font-medium text-white flex items-center gap-2"><User size={14} className="text-blue-400"/> {item.name}</td>
                         <td className="px-6 py-4 text-emerald-400">{item.contact}</td>
                         <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-950 text-slate-300 rounded text-xs border border-slate-800">{item.sector}</span></td>
                         <td className="px-6 py-4 text-slate-400 text-xs">{item.need}</td>
                         <td className="px-6 py-4 text-right">
                           <button className="text-xs text-blue-400 hover:text-white px-3 py-1 bg-blue-900/20 rounded-md border border-blue-500/20 transition-colors flex items-center justify-end ml-auto"><CheckCircle size={12} className="mr-1"/> 標記跟進</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* ================= 模組 5：系統設定 ================= */}
          {activeTab === 'settings' && (
             <div className="animate-in fade-in duration-300">
               <h1 className="text-3xl font-bold text-white mb-8">系統參數設定</h1>

               <div className="space-y-6 max-w-4xl">
                 {/* 安全設定 */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Key size={20} className="text-blue-500"/> 安全與權限</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm text-slate-400 mb-2">修改管理後台登入密碼</label>
                       <input type="password" placeholder="輸入新密碼" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-colors" />
                     </div>
                     <div className="flex items-end">
                       <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"><Save size={18}/> 保存密碼</button>
                     </div>
                   </div>
                 </div>

                 {/* 通知設定 */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Bell size={20} className="text-emerald-500"/> 接收通知設定</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm text-slate-400 mb-2">客戶表單接收郵箱 (Formspree 綁定端點)</label>
                       <input type="email" defaultValue="charles@yimihk.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors" />
                     </div>
                     <div className="flex items-center gap-3 pt-2">
                       <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded cursor-pointer" id="sms-notify" />
                       <label htmlFor="sms-notify" className="text-sm text-slate-300 cursor-pointer">當收到新潛在客戶諮詢時，發送手機 SMS 簡訊通知管理員</label>
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                        <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all border border-slate-700">更新通知設定</button>
                     </div>
                   </div>
                 </div>

                 {/* AI 設定 */}
                 <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ShieldCheck size={20} className="text-purple-500"/> AI 智庫引擎生成參數 (System Prompt)</h3>
                   <div>
                     <label className="block text-sm text-slate-400 mb-2">請設定 AI 分析師的行為準則與語氣</label>
                     <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-purple-500 transition-colors h-32 resize-none leading-relaxed" defaultValue="你現在是蟻米集團的首席 AI 分析師。請結合今日全球財經數據，為大灣區的高端客戶生成一份關於「跨境資本流動」與「AI 工業轉型」的深度洞察報告。語氣需要權威、數據驅動且符合國際投行標準。"></textarea>
                   </div>
                   <div className="mt-4 flex justify-end">
                     <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"><Save size={18} className="inline mr-2"/> 儲存 Prompt 模型</button>
                   </div>
                 </div>
               </div>
             </div>
          )}

        </main>
      </div>

      {/* ================= 專案新增/編輯彈窗 (Modal) ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowProjectModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingProject.id === 0 ? '新增監控項目' : '編輯專案細節'}</h2>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1 font-medium">項目名稱</label>
                  <input type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" placeholder="例如：非洲礦產貿易" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1 font-medium">地域板塊</label>
                  <input type="text" value={editingProject.region} onChange={(e) => setEditingProject({...editingProject, region: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" placeholder="例如：國際/約堡" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-1 font-medium">佔用資金 (HK$)</label>
                  <input type="number" value={editingProject.allocated} onChange={(e) => setEditingProject({...editingProject, allocated: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1 font-medium">實時 ROI (%)</label>
                  <input type="number" value={editingProject.roi} onChange={(e) => setEditingProject({...editingProject, roi: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1 font-medium">運行時間 (個月)</label>
                  <input type="number" value={editingProject.monthsActive} onChange={(e) => setEditingProject({...editingProject, monthsActive: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1 font-medium">當前狀態</label>
                <select value={editingProject.status} onChange={(e) => setEditingProject({...editingProject, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                  <option value="收益健康">收益健康</option>
                  <option value="穩健增值">穩健增值</option>
                  <option value="建倉期預警">建倉期預警</option>
                  <option value="清算中">清算中</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowProjectModal(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">取消</button>
              <button onClick={saveProject} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">儲存更新</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
