'use client';

import React, { useState, useEffect } from 'react';
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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false); // 新增：控制 AI 生成時的 Loading 狀態

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
    { id: 1, title: '香港「超級聯繫人」政策升級：大灣區資本跨境流動新指南', category: '政策解讀', date: '2026-04-10', summary: '最新政策放寬了大灣區企業在港融資的限制，預計將釋放超 500 億資金流動性。', fullText: '根據集團 AI 智庫即時分析...', published: true },
    { id: 2, title: 'AIGC 工業應用報告：生成式 AI 如何降低 40% 營銷成本', category: '行業洞察', date: '2026-04-09', summary: '多媒體廣告矩陣全面引入 AI 輔助，重塑數字創意產業鏈。', fullText: '結合本週全球科技股財報數據...', published: true },
    { id: 3, title: '全球大宗商品價格波動與區塊鏈溯源的避險價值', category: '市場預警', date: '2026-04-08', summary: '受地緣政治影響，大宗貿易波動加劇，Web3 溯源系統成為信任基石。', fullText: '全球 AI 預測引擎昨晚發出預警...', published: true }
  ]);

  const [showNewsModal, setShowNewsModal] = useState(false);
  const [editingNews, setEditingNews] = useState({ id: 0, title: '', category: '行業洞察', date: '', summary: '', fullText: '', published: true });

  // ================= 4. CRM 與單據開立系統狀態 (新增) =================
  const [crmRecords, setCrmRecords] = useState([
    { id: 'INV-20260823-01', client: 'TKP-DBPP', date: '2026-08-23', amount: 8000, type: 'QUOTATION', status: '待處理' },
    { id: 'INV-20260820-05', client: 'Global Trade Ltd.', date: '2026-08-20', amount: 15000, type: 'INVOICE', status: '已結清' }
  ]);

  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [invType, setInvType] = useState('QUOTATION');
  const [invTotal, setInvTotal] = useState(8000);
  const [invDiscountPct, setInvDiscountPct] = useState(20);
  const [invMaint, setInvMaint] = useState(2500);

  // 處理浮點數精度計算 (Financial Safety)
  const safeFloat = (num: number) => Math.round(num * 100) / 100;
  const originalAmount = invTotal > 0 ? safeFloat(invTotal / (1 - (invDiscountPct / 100))) : 0;
  const discountAmount = safeFloat(originalAmount - invTotal);
  const phase1 = safeFloat(invTotal * 0.6);
  const phase2 = safeFloat(invTotal - phase1);

  const openInvoicePreview = (record: any) => {
    setPreviewInvoice(record);
    setInvType(record.type);
    setInvTotal(record.amount);
  };

  // 初始化：讀取本地緩存的智庫數據
  useEffect(() => {
    const savedNews = localStorage.getItem('yimi_news_data');
    if (savedNews) {
      setNewsArticles(JSON.parse(savedNews));
    }
  }, []);

  // 保存數據並同步到本地緩存 (讓前台可以讀取)
  const syncNewsData = (updatedNews: any) => {
    setNewsArticles(updatedNews);
    localStorage.setItem('yimi_news_data', JSON.stringify(updatedNews));
  };

  // ================= 5. 操作邏輯函數 =================
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'yimi2026') { setIsLoggedIn(true); setError(''); } 
    else { setError('密碼錯誤，請重新輸入。'); }
  };

  // --- 智庫 CRUD 邏輯 (真實串接 AI) ---
  const handleGenerateNews = async () => {
    setIsGeneratingAI(true);
    try {
      const systemPrompt = "你現在是蟻米集團的首席 AI 分析師。請結合今日全球宏觀經濟與大灣區動態，為高端客戶生成一篇關於「跨境資本流動」或「AI 產業趨勢」的深度洞察報告。語氣需要權威、數據驅動且符合國際投行標準。";

      const response = await fetch('/api/generateNews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成失敗");
      }

      const aiResult = JSON.parse(data.result);

      const newArticle = {
        id: Date.now(),
        title: aiResult.title || 'AI 生成標題失敗',
        category: aiResult.category || '實時研報',
        date: new Date().toISOString().split('T')[0],
        summary: aiResult.summary || '摘要生成失敗',
        fullText: aiResult.fullText || '內文生成失敗',
        published: false
      };

      syncNewsData([newArticle, ...newsArticles]);
      alert('✅ 真實 AI 深度分析完成！已為您生成研報草稿。');

    } catch (error: any) {
      console.error(error);
      alert(`❌ AI 生成失敗，請確認 API Key 是否設定正確。錯誤訊息: ${error.message}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const openAddNews = () => {
    setEditingNews({ id: 0, title: '', category: '行業洞察', date: new Date().toISOString().split('T')[0], summary: '', fullText: '', published: true });
    setShowNewsModal(true);
  };

  const openEditNews = (news: any) => {
    setEditingNews(news);
    setShowNewsModal(true);
  };

  const saveNews = () => {
    if (editingNews.id === 0) {
      syncNewsData([{ ...editingNews, id: Date.now() }, ...newsArticles]);
    } else {
      syncNewsData(newsArticles.map(a => a.id === editingNews.id ? editingNews : a));
    }
    setShowNewsModal(false);
  };

  const deleteNews = (id: number) => {
    if (window.confirm("確定刪除這篇文章？前台也將同步移除。")) {
      syncNewsData(newsArticles.filter(a => a.id !== id));
    }
  };

  // --- 專案 CRUD 邏輯 ---
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
      {/* 導覽列：列印時隱藏 */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-40 relative shadow-md print:hidden">
        <div className="font-bold text-xl text-white flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-lg"><Cpu className="text-blue-500" size={20} /></div>YIMI Admin
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"><LogOut size={16} className="mr-2" /> 登出系統</button>
      </nav>

      {/* 主體區塊：列印時隱藏，讓 Modal 獨佔列印版面 */}
      <div className="flex flex-1 overflow-hidden print:hidden">
        {/* 左側選單 */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-2 overflow-y-auto">
          {[
            { id: 'dashboard', icon: <Activity size={18}/>, label: '系統總覽' },
            { id: 'capital', icon: <PieChart size={18}/>, label: '資金監控系統' },
            { id: 'crm', icon: <Briefcase size={18}/>, label: '客戶 CRM & 財務開單' }, // 新增的 CRM 選單
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
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center text-white border border-slate-600 transition-colors">
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

          {/* ================= 模組：客戶 CRM & 財務開單 (新增) ================= */}
          {activeTab === 'crm' && (
             <div className="animate-in fade-in duration-300">
               <div className="flex justify-between items-end mb-8">
                 <div>
                   <h1 className="text-3xl font-bold text-white mb-2">客戶 CRM & 財務單據系統</h1>
                   <p className="text-slate-400">管理客戶資料、歷史訂單，並自動產生 PDF 報價單與發票。</p>
                 </div>
                 <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center">
                   <Plus size={16} className="mr-1"/> 新增客戶單據
                 </button>
               </div>
               
               <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                 <table className="w-full text-left text-sm text-slate-300">
                   <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                     <tr>
                       <th className="px-6 py-4 font-medium tracking-wider">單號 (Ref No)</th>
                       <th className="px-6 py-4 font-medium tracking-wider">客戶名稱</th>
                       <th className="px-6 py-4 font-medium tracking-wider">日期</th>
                       <th className="px-6 py-4 font-medium tracking-wider">總金額 (HKD)</th>
                       <th className="px-6 py-4 font-medium tracking-wider">狀態</th>
                       <th className="px-6 py-4 text-right font-medium tracking-wider">操作</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                     {crmRecords.map((record) => (
                       <tr key={record.id} className="hover:bg-slate-800/40 transition-colors">
                         <td className="px-6 py-4 font-mono text-blue-400">{record.id}</td>
                         <td className="px-6 py-4 font-bold text-white">{record.client}</td>
                         <td className="px-6 py-4 text-slate-400">{record.date}</td>
                         <td className="px-6 py-4 font-mono font-medium">$ {record.amount.toLocaleString()}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded text-xs border ${record.status === '已結清' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                             {record.type} - {record.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={() => openInvoicePreview(record)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors text-xs flex items-center justify-end ml-auto border border-slate-600">
                             <FileText size={12} className="mr-1"/> 預覽 / 列印單據
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
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
                  <button 
                    onClick={handleGenerateNews} 
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/30 rounded-lg text-sm font-bold transition-all flex items-center shadow-lg hover:shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAI ? (
                      <><div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-2"></div> 分析中...</>
                    ) : (
                      <><Cpu size={16} className="mr-2"/> AI 一鍵生成研報</>
                    )}
                  </button>
                  <button onClick={openAddNews} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all flex items-center shadow-lg shadow-blue-500/20">
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
                          <button onClick={() => openEditNews(article)} className="text-blue-400 hover:text-white px-2 transition-colors"><Edit3 size={16}/></button>
                          <button onClick={() => deleteNews(article.id)} className="text-red-400 hover:text-white px-2 transition-colors"><Trash2 size={16}/></button>
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
                       <label htmlFor="sms-notify" className="text-sm text-slate-300 cursor-pointer">當收到新潛客戶諮詢時，發送手機 SMS 簡訊通知管理員</label>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
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

      {/* ================= 新聞新增/編輯彈窗 (Modal) ================= */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowNewsModal(false)}></div>
          
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{editingNews.id === 0 ? '發佈新文章' : '編輯文章'}</h2>
              <button onClick={() => setShowNewsModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">文章標題</label>
                <input type="text" value={editingNews.title} onChange={(e) => setEditingNews({...editingNews, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">分類</label>
                  <select value={editingNews.category} onChange={(e) => setEditingNews({...editingNews, category: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500">
                    <option value="實時研報">實時研報</option>
                    <option value="政策解讀">政策解讀</option>
                    <option value="行業洞察">行業洞察</option>
                    <option value="市場預警">市場預警</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">發佈日期</label>
                  <input type="date" value={editingNews.date} onChange={(e) => setEditingNews({...editingNews, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">文章摘要 (顯示於首頁卡片)</label>
                <textarea value={editingNews.summary} onChange={(e) => setEditingNews({...editingNews, summary: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-20 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">深度內容全文 (支持分段)</label>
                <textarea value={editingNews.fullText} onChange={(e) => setEditingNews({...editingNews, fullText: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 h-64 resize-none" />
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="publish-status" checked={editingNews.published} onChange={(e) => setEditingNews({...editingNews, published: e.target.checked})} className="w-4 h-4 accent-blue-500 cursor-pointer" />
                <label htmlFor="publish-status" className="ml-2 text-sm text-slate-300 cursor-pointer">立即在前台首頁發佈展示</label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowNewsModal(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium">取消</button>
              <button onClick={saveNews} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20">儲存並發佈</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CRM 單據預覽 / 列印彈窗 (Invoice Modal) (新增) ================= */}
      {previewInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0 print:static print:z-auto print:flex-none print:block bg-slate-950/80 backdrop-blur-sm print:bg-white print:backdrop-blur-none">
          
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible bg-[#cbd5e1] print:bg-white p-6 md:p-10 rounded-2xl print:rounded-none shadow-2xl print:shadow-none animate-in zoom-in-95 duration-200">
            
            {/* 操作列 (列印時隱藏) */}
            <div className="flex justify-between items-center mb-6 print:hidden">
              <div className="text-slate-700">
                <button onClick={() => window.print()} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-lg flex items-center transition-transform hover:-translate-y-0.5">
                  🖨️ 匯出 PDF / 列印
                </button>
                <p className="text-xs text-slate-500 mt-2">提示：列印時請將「邊界」設為「無」，系統會自動隱藏後台選單。</p>
              </div>
              <button onClick={() => setPreviewInvoice(null)} className="p-2 bg-slate-400 hover:bg-slate-500 rounded-full text-white transition-colors"><X size={24}/></button>
            </div>

            {/* ==== 單據區塊 ==== */}
            <div className="mx-auto bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] print:shadow-none relative p-[10mm_15mm] box-border w-[210mm] min-h-[297mm] print:w-full print:min-h-0 print:h-[297mm] overflow-hidden text-[#334155] font-sans text-[12px] print:text-[11px]">
              
              <style dangerouslySetInnerHTML={{__html: `
                .inv-primary { color: #0f172a; }
                .inv-secondary { color: #3b82f6; }
                .inv-muted { color: #64748b; }
                .inv-bg { background-color: #f8fafc; }
                .inv-input { display: inline-block; padding: 2px 4px; background-color: #dbeafe; border-radius: 4px; color: #3b82f6; font-weight: 900; outline: none; text-align: right; border: none; }
                .inv-input:focus { background-color: #bfdbfe; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
                @media print { 
                  .inv-input { background-color: transparent; padding: 0; color: inherit; } 
                }
              `}} />

              {invType === 'RECEIPT' && (
                <div className="absolute top-[30px] right-[180px] text-[45px] font-black text-red-500 border-4 border-red-500 p-[10px_25px] rounded-lg -rotate-12 opacity-15 tracking-[6px] z-10 pointer-events-none">
                  PAID
                </div>
              )}

              <header className="flex justify-between items-start border-b-2 border-[#0f172a] pb-3 mb-[15px] relative z-20 print:mb-[10px] print:pb-2">
                <div className="w-[55%]">
                  <div className="text-[18px] font-black inv-primary tracking-wide mb-1.5">YIMI INTERNATIONAL HOLDINGS LIMITED</div>
                  <div className="text-[11px] inv-muted leading-relaxed">
                    RM11, 22/F, TOWER B, NEW TRADE PLAZA<br/>
                    6 ON PING STREET, SHA TIN, N.T., HONG KONG<br/>
                    Tel: (+852) 3996 9796
                  </div>
                </div>
                <div className="w-[40%] text-right">
                  <select value={invType} onChange={(e) => setInvType(e.target.value)} className="text-[24px] font-light inv-primary tracking-[2px] mb-2 bg-transparent border-none outline-none text-right uppercase cursor-pointer hover:bg-slate-50 print:appearance-none print:pointer-events-none">
                    <option value="QUOTATION">QUOTATION</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="RECEIPT">RECEIPT</option>
                  </select>
                  <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[11px]">
                    <span className="font-bold inv-muted">Date:</span>
                    <span className="font-bold inv-primary">{previewInvoice.date}</span>
                    <span className="font-bold inv-muted">Ref No:</span>
                    <span className="font-bold inv-primary">{previewInvoice.id}</span>
                    <span className="font-bold inv-muted">Bill To:</span>
                    <span className="font-bold inv-primary">{previewInvoice.client}</span>
                  </div>
                </div>
              </header>

              <table className="w-full border-collapse mb-[15px] print:mb-2">
                <thead>
                  <tr>
                    <th className="inv-bg inv-muted text-[10px] uppercase tracking-wide p-[8px_10px] text-left border-y border-[#e2e8f0]">Project Description</th>
                    <th className="inv-bg inv-muted text-[10px] uppercase tracking-wide p-[8px_10px] text-right border-y border-[#e2e8f0] w-[140px]">Net Amount (HKD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">1. Official Website Development & Design</span>
                      <span className="inv-muted text-[11px]">Build a responsive website using modern full-stack architecture (Next.js + Firebase), including news and event registration modules.</span>
                      
                      <div className="mt-[10px] p-[8px_10px] inv-bg border-l-3 border-[#3b82f6] text-[11px] w-[85%]">
                        <div className="flex justify-between mb-1">
                          <span>Standard Value:</span>
                          <span><del>$ {originalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</del></span>
                        </div>
                        <div className="flex justify-between font-extrabold inv-secondary">
                          <span>Partnership Discount (
                            <input type="number" value={invDiscountPct} onChange={(e) => setInvDiscountPct(Number(e.target.value))} className="inv-input w-[40px] text-center mx-1"/>% OFF):
                          </span>
                          <span>- $ {discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-bottom text-right print:p-[6px_8px]" rowSpan={3}>
                      <div className="text-[16px] font-black inv-primary flex items-center justify-end">
                        <span className="inv-muted mr-1">$</span>
                        <input type="number" value={invTotal} onChange={(e) => setInvTotal(Number(e.target.value))} className="inv-input text-right w-[90px] text-[16px]" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">2. Database Migration & Data Entry</span>
                      <span className="inv-muted text-[11px]">Assist in structuring and importing the legacy data (Softcopy) provided by the client into the new system.</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">3. Domain Transfer & Hosting Setup</span>
                      <span className="inv-muted text-[11px]">Transfer and bind the existing domain to the new server.</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11px] font-bold inv-primary uppercase tracking-wide m-[12px_0_6px_0] pb-1 border-b border-[#e2e8f0] print:m-[10px_0_4px_0]">Payment Schedule</div>
              <table className="w-full border-collapse mb-[15px] print:mb-2">
                <tbody>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">Phase 1 (60%)</span>
                      <span className="inv-muted text-[11px]">Payable upon project commencement and issuance of this document.</span>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] font-bold text-right w-[140px] print:p-[6px_8px]">
                      <span className="inv-muted mr-1">$</span>{phase1.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">Phase 2 (40%)</span>
                      <span className="inv-muted text-[11px]">Payable upon project completion, data entry fulfillment, and official launch.</span>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] font-bold text-right w-[140px] print:p-[6px_8px]">
                      <span className="inv-muted mr-1">$</span>{phase2.toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11px] font-bold inv-primary uppercase tracking-wide m-[12px_0_6px_0] pb-1 border-b border-[#e2e8f0] print:m-[10px_0_4px_0]">Annual Maintenance</div>
              <table className="w-full border-collapse mb-[15px] print:mb-2">
                <tbody>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top print:p-[6px_8px]">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">Annual System Maintenance Fee</span>
                      <span className="inv-muted text-[11px]">Includes system bug fixes, cloud server (Vercel), and database storage.</span>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top text-right w-[140px] print:p-[6px_8px] flex justify-end items-center">
                      <span className="inv-muted mr-1">$</span>
                      <input type="number" value={invMaint} onChange={(e) => setInvMaint(Number(e.target.value))} className="inv-input text-right w-[70px]" />
                      <span className="ml-1 inv-muted text-[10px]">/ Year</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex gap-[15px] mb-[15px] print:mb-[10px] break-inside-avoid">
                <div className="flex-1 inv-bg p-[10px_12px] rounded-md border border-[#e2e8f0]">
                  <div className="text-[11px] font-bold inv-primary uppercase tracking-wide mb-2">Banking Information</div>
                  <div className="mb-1.5"><span className="text-[10px] inv-muted block uppercase">Bank Name</span><span className="text-[11px] font-bold inv-primary block">STANDARD CHARTERED BANK (HK)</span></div>
                  <div className="mb-1.5"><span className="text-[10px] inv-muted block uppercase">Account Name</span><span className="text-[11px] font-bold inv-primary block">YIMI INTERNATIONAL HOLDINGS LTD.</span></div>
                  <div><span className="text-[10px] inv-muted block uppercase">Account No. (HKD)</span><span className="text-[13px] font-black inv-primary block">41510814091</span></div>
                </div>
                
                <div className="flex-1 text-[9.5px] inv-muted text-justify leading-relaxed">
                  <strong className="inv-primary inline-block mb-0.5 text-[10px]">【Terms & Conditions】</strong><br/>
                  <strong className="inv-primary">1. Content Liability:</strong> The Client warrants that they own or have obtained necessary rights to use all text/images provided to YIMI. YIMI holds no liability for copyright disputes arising from client-provided content.<br/>
                  <strong className="inv-primary">2. Intellectual Property:</strong> Upon full clearance of payment, the Client retains ownership of the website data and frontend visual output. YIMI retains all IP rights to the underlying system architecture and codebases.
                </div>
              </div>

              <div className="flex justify-between mt-[20px] print:mt-[15px] break-inside-avoid">
                <div className="w-[42%]">
                  <div className="border-b border-[#0f172a] h-[35px] mb-1.5"></div>
                  <div className="text-[10px] inv-muted">For and on behalf of<br/><strong className="inv-primary">YIMI INTERNATIONAL HOLDINGS LIMITED</strong></div>
                </div>
                <div className="w-[42%]">
                  <div className="border-b border-[#0f172a] h-[35px] mb-1.5"></div>
                  <div className="text-[10px] inv-muted">Accepted and Agreed by<br/><strong className="inv-primary">{previewInvoice.client}</strong></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
