'use client';

import React, { useState } from 'react';
import { 
  Lock, Cpu, Mail, Settings, LogOut, Activity, 
  PieChart, TrendingUp, DollarSign, Briefcase, Calendar, 
  MapPin, AlertCircle, Building2, User, Save, Key, Bell, 
  ShieldCheck, Plus, FileText, UploadCloud, Edit3, Trash2, X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('capital');

  // 資金設定
  const [capitalConfig, setCapitalConfig] = useState({
    principal: 100000000, 
    interestRate: 8,      
    durationYears: 5,     
    upfrontFeeRate: 6     
  });

  // 專案列表
  const [projects, setProjects] = useState([
    { id: 1, name: '非洲礦產大宗貿易', region: '國際/約堡', allocated: 40000000, monthsActive: 3, roi: 14.2, status: '收益健康' },
    { id: 2, name: '蟻米智慧港 (產城開發)', region: '本地/香港', allocated: 30000000, monthsActive: 8, roi: 11.5, status: '穩健增值' },
    { id: 3, name: 'AIGC 傳媒孵化器', region: '異地/廣州', allocated: 15000000, monthsActive: 1, roi: 8.0, status: '建倉期預警' }
  ]);

  // ========= 新增：專案表單 Modal 狀態 =========
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState({
    id: 0, name: '', region: '', allocated: 0, monthsActive: 0, roi: 0, status: '建倉期預警'
  });

  // 動態計算
  const totalAllocated = projects.reduce((sum, p) => sum + Number(p.allocated), 0);
  const remainingLiquidity = capitalConfig.principal - totalAllocated;
  const annualInterestCost = capitalConfig.principal * (capitalConfig.interestRate / 100);
  const upfrontFeeCost = capitalConfig.principal * (capitalConfig.upfrontFeeRate / 100);
  const targetROI = ((annualInterestCost + (upfrontFeeCost / capitalConfig.durationYears)) / capitalConfig.principal) * 100;
  const currentAvgROI = totalAllocated === 0 ? 0 : projects.reduce((sum, p) => sum + (Number(p.roi) * (Number(p.allocated)/totalAllocated)), 0);

  // 智庫列表
  const [newsArticles, setNewsArticles] = useState([
    { id: 1, title: '香港「超級聯繫人」政策升級：大灣區資本跨境流動新指南', category: '政策解讀', date: '2026-04-10', published: true },
    { id: 2, title: 'AIGC 工業應用報告：生成式 AI 如何降低 40% 營銷成本', category: '行業洞察', date: '2026-04-09', published: true },
    { id: 3, title: '全球大宗商品價格波動與區塊鏈溯源的避險價值', category: '市場預警', date: '2026-04-08', published: true }
  ]);

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

  // ========= 新增：專案 CRUD 操作邏輯 =========
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
      // 新增
      setProjects([...projects, { ...editingProject, id: Date.now() }]);
    } else {
      // 更新
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
    }
    setShowProjectModal(false);
  };

  const deleteProject = (id: number) => {
    if (window.confirm("確定要刪除這個監控項目嗎？")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6"><div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500"><Lock size={32} /></div></div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">YIMI ADMIN</h2>
          <p className="text-slate-400 text-center text-sm mb-8">蟻米集團 (國際) 內部管控系統</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="請輸入系統密碼" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none text-center tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">安全登入</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans relative">
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-40">
        <div className="font-bold text-xl text-white flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg"><Cpu className="text-blue-500" size={20} /></div>YIMI Admin
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-slate-400 hover:text-white text-sm"><LogOut size={16} className="mr-2" /> 登出系統</button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
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

        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          
          {/* ================= 系統總覽 ================= */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in">
              <h1 className="text-3xl font-bold text-white mb-8">控制中心 Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setActiveTab('capital')} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500 cursor-pointer transition-all">
                  <PieChart className="text-blue-500 mb-4" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">資金水位：HK$ {capitalConfig.principal / 1000000}M</h3>
                  <p className="text-slate-400 text-sm">已配置 {((totalAllocated/capitalConfig.principal)*100).toFixed(0)}%，剩餘流動性 HK$ {remainingLiquidity/1000000}M</p>
                </div>
                <div onClick={() => setActiveTab('leads')} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500 cursor-pointer transition-all">
                  <Mail className="text-emerald-500 mb-4" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">新諮詢名單</h3>
                  <p className="text-slate-400 text-sm">3 筆來自「聯繫業務負責人」的未讀需求。</p>
                </div>
                <div onClick={() => handleGenerateNews()} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500 cursor-pointer transition-all">
                  <Cpu className="text-purple-500 mb-4" size={32}/>
                  <h3 className="text-xl font-bold text-white mb-2">AI 研報引擎</h3>
                  <p className="text-slate-400 text-sm">點擊手動觸發 AI 模型生成今日大盤智庫報告。</p>
                </div>
              </div>
            </div>
          )}

          {/* ================= 資金監控系統 ================= */}
          {activeTab === 'capital' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">動態資金監控系統 <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-md border border-emerald-500/30">實時運算中</span></h1>
                  <p className="text-slate-400">所有參數皆可點擊修改，系統將自動重算成本水位與收益配置。</p>
                </div>
                <button onClick={() => alert('此功能將開啟上傳視窗，讀取銀行的 CSV/PDF 檔，自動更新各專案的已動用資金。')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center text-white border border-slate-600">
                  <UploadCloud size={16} className="mr-2"/> 導入銀行月結單對帳
                </button>
              </div>

              {/* 總資金池設定 */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-lg">
                <h2 className="text-sm font-bold tracking-widest text-blue-400 uppercase mb-6 flex items-center"><DollarSign size={16} className="mr-1"/> 總資金池設定 (可編輯)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div><label className="block text-xs text-slate-500 mb-1">貸款本金 (HK$)</label><input type="number" value={capitalConfig.principal} onChange={(e) => setCapitalConfig({...capitalConfig, principal: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">年化利息 (%)</label><input type="number" value={capitalConfig.interestRate} onChange={(e) => setCapitalConfig({...capitalConfig, interestRate: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">前端手續費 (%)</label><input type="number" value={capitalConfig.upfrontFeeRate} onChange={(e) => setCapitalConfig({...capitalConfig, upfrontFeeRate: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500" /></div>
                  <div><label className="block text-xs text-slate-500 mb-1">貸款期限 (年)</label><input type="number" value={capitalConfig.durationYears} onChange={(e) => setCapitalConfig({...capitalConfig, durationYears: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-bold outline-none focus:border-blue-500" /></div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl"><div className="text-xs text-slate-500">每年利息支出</div><div className="text-xl font-bold text-red-400 mt-1">HK$ {(annualInterestCost/1000000).toFixed(2)}M</div></div>
                  <div className="bg-slate-950 p-4 rounded-xl"><div className="text-xs text-slate-500">總手續費成本</div><div className="text-xl font-bold text-red-400 mt-1">HK$ {(upfrontFeeCost/1000000).toFixed(2)}M</div></div>
                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl"><div className="text-xs text-blue-300">系統計算：盈虧平衡基準線</div><div className="text-xl font-bold text-blue-400 mt-1">{targetROI.toFixed(2)}% ROI</div></div>
                </div>
              </div>

              {/* 專案監控列表 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">各項配置監控與月度紀錄</h2>
                    <p className="text-sm text-slate-400">目前綜合 ROI：<span className="text-emerald-400 font-bold">{currentAvgROI.toFixed(2)}%</span> | 剩餘未配置資金：<span className={remainingLiquidity < 0 ? 'text-red-400' : 'text-slate-400'}>HK$ {(remainingLiquidity/1000000).toFixed(2)}M</span></p>
                  </div>
                  <button onClick={openAddProject} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white flex items-center transition-colors">
                    <Plus size={16} className="mr-1"/> 新增監控項目
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                      <tr>
                        <th className="px-6 py-4 font-medium">項目名稱 / 地域</th>
                        <th className="px-6 py-4 font-medium">佔用資金</th>
                        <th className="px-6 py-4 font-medium">運行時間</th>
                        <th className="px-6 py-4 font-medium">實時 ROI</th>
                        <th className="px-6 py-4 font-medium">當前狀態</th>
                        <th className="px-6 py-4 font-medium text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-500 flex items-center mt-1"><MapPin size={12} className="mr-1"/>{p.region}</div>
                          </td>
                          <td className="px-6 py-4 font-mono">HK$ {(p.allocated/1000000).toFixed(1)}M</td>
                          <td className="px-6 py-4">{p.monthsActive} 個月</td>
                          <td className="px-6 py-4 font-bold text-emerald-400">{p.roi}%</td>
                          <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">{p.status}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => openEditProject(p)} className="text-blue-400 hover:text-white px-2"><Edit3 size={16}/></button>
                            <button onClick={() => deleteProject(p.id)} className="text-red-400 hover:text-white px-2"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-slate-500">尚無專案，請點擊上方按鈕新增。</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 其他模組 (精簡保留) ================= */}
          {activeTab === 'news' && (
             <div className="animate-in fade-in">
               <h1 className="text-3xl font-bold text-white mb-8">AI 智庫發佈系統</h1>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
                 <p className="text-slate-400 mb-4">此模塊管理文章發佈。點擊下方按鈕測試 AI 生成文章邏輯。</p>
                 <button onClick={handleGenerateNews} className="px-6 py-3 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-sm font-medium transition-colors inline-flex items-center"><Cpu size={16} className="mr-2"/> AI 一鍵生成研報</button>
               </div>
             </div>
          )}

          {activeTab === 'leads' && (
             <div className="animate-in fade-in">
               <h1 className="text-3xl font-bold text-white mb-8">業務諮詢名單管理</h1>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center text-slate-400">目前有 3 筆未處理的表單諮詢。(展示邏輯已完備)</div>
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="animate-in fade-in">
               <h1 className="text-3xl font-bold text-white mb-8">系統參數設定</h1>
               <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center text-slate-400">後台密碼、通知信箱與 AI Prompt 提示詞設定區域。</div>
             </div>
          )}
        </main>
      </div>

      {/* ================= 專案編輯彈窗 Modal ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowProjectModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingProject.id === 0 ? '新增監控項目' : '編輯專案細節'}</h2>
              <button onClick={() => setShowProjectModal(false)} className="text-slate-400 hover:text-white"><X size={24}/></button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">項目名稱</label>
                  <input type="text" value={editingProject.name} onChange={(e) => setEditingProject({...editingProject, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="例如：非洲礦產貿易" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">地域板塊</label>
                  <input type="text" value={editingProject.region} onChange={(e) => setEditingProject({...editingProject, region: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" placeholder="例如：國際/約堡" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">佔用資金 (HK$)</label>
                  <input type="number" value={editingProject.allocated} onChange={(e) => setEditingProject({...editingProject, allocated: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">實時 ROI (%)</label>
                  <input type="number" value={editingProject.roi} onChange={(e) => setEditingProject({...editingProject, roi: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">運行時間 (個月)</label>
                  <input type="number" value={editingProject.monthsActive} onChange={(e) => setEditingProject({...editingProject, monthsActive: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">當前狀態</label>
                <select value={editingProject.status} onChange={(e) => setEditingProject({...editingProject, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 appearance-none">
                  <option value="收益健康">收益健康</option>
                  <option value="穩健增值">穩健增值</option>
                  <option value="建倉期預警">建倉期預警</option>
                  <option value="清算中">清算中</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">取消</button>
              <button onClick={saveProject} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors">儲存更新</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
