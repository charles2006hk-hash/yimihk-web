'use client';

import React, { useState } from 'react';
import { Plus, FileText, X, Save, AlertTriangle, Trash2 } from 'lucide-react';

export default function CrmInvoiceModule() {
  // ================= 1. CRM 與單據狀態 =================
  const [crmRecords, setCrmRecords] = useState([
    { id: 'INV-20260823-01', client: 'TKP-DBPP', date: '2026-08-23', amount: 8000, type: 'QUOTATION', status: '待處理', discountPct: 20, maint: 2500, phases: [
      { id: 1, name: 'Phase 1', desc: 'Payable upon project commencement and issuance of this document.', percent: 60 },
      { id: 2, name: 'Phase 2', desc: 'Payable upon project completion and official launch.', percent: 40 }
    ]},
    { id: 'INV-20260820-05', client: 'Global Trade Ltd.', date: '2026-08-20', amount: 15000, type: 'INVOICE', status: '已結清', discountPct: 0, maint: 3000, phases: [
      { id: 1, name: 'Full Payment', desc: 'Payable upon receipt.', percent: 100 }
    ]}
  ]);

  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [invType, setInvType] = useState('QUOTATION');
  const [invTotal, setInvTotal] = useState(8000);
  const [invDiscountPct, setInvDiscountPct] = useState(20);
  const [invMaint, setInvMaint] = useState(2500);
  const [invStatus, setInvStatus] = useState('草稿');

  const defaultSinglePhase = [{ id: 1, name: 'Full Payment', desc: 'Payable upon project commencement and issuance of this document.', percent: 100 }];
  const [paymentPhases, setPaymentPhases] = useState(defaultSinglePhase);

  // 處理浮點數精度計算 (Financial Safety)
  const safeFloat = (num: number) => Math.round(num * 100) / 100;
  const originalAmount = invTotal > 0 ? safeFloat(invTotal / (1 - (invDiscountPct / 100))) : 0;
  const discountAmount = safeFloat(originalAmount - invTotal);

  // ================= 2. 操作邏輯 =================
  const openInvoicePreview = (record: any) => {
    setPreviewInvoice(record);
    setInvType(record.type);
    setInvTotal(record.amount);
    setInvStatus(record.status || '待處理'); 
    setInvDiscountPct(record.discountPct ?? 0); 
    setInvMaint(record.maint ?? 0);             
    setPaymentPhases(record.phases || defaultSinglePhase);
  };

  const openAddInvoice = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newId = `INV-${todayStr.replace(/-/g, '')}-${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`;
    const newRecord = { id: newId, client: '請輸入客戶名稱', date: todayStr, amount: 0, type: 'QUOTATION', status: '草稿', phases: defaultSinglePhase, discountPct: 0, maint: 0 };
    setPreviewInvoice(newRecord);
    setInvType('QUOTATION');
    setInvStatus('草稿'); 
    setInvTotal(0);
    setInvDiscountPct(0);
    setInvMaint(0);
    setPaymentPhases(defaultSinglePhase);
  };

  const saveInvoiceToCRM = () => {
    const exists = crmRecords.find(r => r.id === previewInvoice.id);
    const updatedRecord = { 
      ...previewInvoice, amount: invTotal, type: invType, phases: paymentPhases, 
      status: invStatus, discountPct: invDiscountPct, maint: invMaint              
    };
    if (exists) {
      setCrmRecords(crmRecords.map(r => r.id === previewInvoice.id ? updatedRecord : r));
    } else {
      setCrmRecords([updatedRecord, ...crmRecords]);
    }
    alert("✅ 單據已成功儲存至系統！");
    setPreviewInvoice(null);
  };

  const addPaymentPhase = () => { setPaymentPhases([...paymentPhases, { id: Date.now(), name: `Phase ${paymentPhases.length + 1}`, desc: 'Enter phase details here...', percent: 0 }]); };
  const removePaymentPhase = (id: number) => { if (paymentPhases.length > 1) setPaymentPhases(paymentPhases.filter(p => p.id !== id)); };
  const updatePaymentPhase = (id: number, field: string, value: any) => { setPaymentPhases(paymentPhases.map(p => p.id === id ? { ...p, [field]: value } : p)); };
  const totalPercent = paymentPhases.reduce((acc, p) => acc + p.percent, 0);

  // ================= 3. 專業列印引擎 =================
  const printUtil = (elementId: string) => {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) return;

    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    const originalInputs = originalElement.querySelectorAll('input, textarea, select');
    const clonedInputs = clonedElement.querySelectorAll('input, textarea, select');
    originalInputs.forEach((input: any, index) => {
      if (input.tagName === 'SELECT') (clonedInputs[index] as HTMLSelectElement).value = input.value;
      else if (input.tagName === 'TEXTAREA') clonedInputs[index].innerHTML = input.value;
      else clonedInputs[index].setAttribute('value', input.value);
    });

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <html>
        <head>
          <title>YIMI_${invType}_${previewInvoice?.id || 'Doc'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: ui-sans-serif, system-ui, sans-serif; }
            .inv-primary { color: #0f172a; } .inv-secondary { color: #3b82f6; } .inv-muted { color: #64748b; } .inv-bg { background-color: #f8fafc; }
            input, textarea, select { border: none !important; background: transparent !important; outline: none !important; resize: none !important; appearance: none !important; box-shadow: none !important; color: inherit !important; }
            #${elementId} { width: 210mm !important; height: 297mm !important; max-height: 297mm !important; padding: 12mm 15mm !important; box-sizing: border-box !important; overflow: hidden !important; page-break-after: avoid !important; }
            .print-hide-force { display: none !important; }
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
          <script>setTimeout(() => { window.print(); }, 800);</script>
        </body>
      </html>
    `);
    doc.close();
    setTimeout(() => { if(document.body.contains(iframe)) document.body.removeChild(iframe); }, 10000);
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* 列表視圖 */}
      <div className="flex justify-between items-end mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">客戶 CRM & 財務單據系統</h1>
          <p className="text-slate-400">管理客戶資料、歷史訂單，並自動產生 PDF 報價單與發票。</p>
        </div>
        <button onClick={openAddInvoice} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center">
          <Plus size={16} className="mr-1"/> 新增客戶單據
        </button>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl print:hidden">
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
                <td className="px-6 py-4 font-mono font-medium">$ {record.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs border ${record.status === '已結清' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : record.status === '待處理' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {record.type} - {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openInvoicePreview(record)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md transition-colors text-xs flex items-center justify-end ml-auto border border-slate-600">
                    <FileText size={12} className="mr-1"/> 編輯 / 列印
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 單據編輯 Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm print:hidden">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#cbd5e1] p-6 md:p-10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* 操作列 */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-slate-700 flex gap-3 items-center">
                <select value={invStatus} onChange={(e) => setInvStatus(e.target.value)} className={`px-3 py-2.5 font-bold rounded-lg outline-none border cursor-pointer transition-colors ${invStatus === '已結清' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' : invStatus === '待處理' ? 'bg-amber-900/40 text-amber-400 border-amber-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                  <option value="草稿">📝 草稿狀態</option>
                  <option value="待處理">⏳ 待處理 (已發送)</option>
                  <option value="已結清">✅ 已結清 (已收款)</option>
                </select>
                <button onClick={saveInvoiceToCRM} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-lg flex items-center transition-transform hover:-translate-y-0.5">
                  <Save size={18} className="mr-2"/> 儲存單據
                </button>
                <button onClick={() => printUtil('yimi-invoice-print-area')} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-lg flex items-center transition-transform hover:-translate-y-0.5">
                  🖨️ 匯出 PDF / 列印
                </button>
              </div>
              <button onClick={() => setPreviewInvoice(null)} className="p-2 bg-slate-400 hover:bg-slate-500 rounded-full text-white transition-colors"><X size={24}/></button>
            </div>

            {/* 單據實體區塊 */}
            <div id="yimi-invoice-print-area" className="mx-auto bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative p-[10mm_15mm] box-border w-[210mm] min-h-[297mm] text-[#334155] font-sans text-[12px]">
              
              <style dangerouslySetInnerHTML={{__html: `
                .inv-primary { color: #0f172a; } .inv-secondary { color: #3b82f6; } .inv-muted { color: #64748b; } .inv-bg { background-color: #f8fafc; }
                .inv-input { display: inline-block; padding: 2px 4px; background-color: #dbeafe; border-radius: 4px; color: #3b82f6; font-weight: 900; outline: none; border: none; }
                .inv-input:focus { background-color: #bfdbfe; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); }
              `}} />

              {invType === 'RECEIPT' && (
                <div className="absolute top-[30px] right-[180px] text-[45px] font-black text-red-500 border-4 border-red-500 p-[10px_25px] rounded-lg -rotate-12 opacity-15 tracking-[6px] z-10 pointer-events-none">
                  PAID
                </div>
              )}

              <header className="flex justify-between items-start border-b-2 border-[#0f172a] pb-3 mb-[15px] relative z-20">
                <div className="w-[55%]">
                  <div className="flex items-center gap-2 mb-2">
                     <img src="/logo.png" alt="YIMI" className="h-10 w-auto object-contain" />
                     <div className="text-[20px] font-black inv-primary tracking-wider mt-1">YIMI GROUP</div>
                  </div>
                  <div className="text-[11px] inv-muted leading-relaxed">
                    RM11, 22/F, TOWER B, NEW TRADE PLAZA<br/>
                    6 ON PING STREET, SHA TIN, N.T., HONG KONG<br/>
                    Tel: (+852) 3996 9796 | Email: info@yimihk.com
                  </div>
                </div>
                <div className="w-[40%] text-right">
                  <select value={invType} onChange={(e) => setInvType(e.target.value)} className="text-[24px] font-light inv-primary tracking-[2px] mb-2 bg-transparent border-none outline-none text-right uppercase cursor-pointer hover:bg-slate-50">
                    <option value="QUOTATION">QUOTATION</option>
                    <option value="INVOICE">INVOICE</option>
                    <option value="RECEIPT">RECEIPT</option>
                  </select>
                  <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 text-[11px] items-center justify-end text-right">
                    <span className="font-bold inv-muted">Date:</span>
                    <input type="date" value={previewInvoice.date} onChange={(e)=>setPreviewInvoice({...previewInvoice, date: e.target.value})} className="font-bold inv-primary bg-transparent border-none outline-none text-right hover:bg-slate-100 cursor-pointer" />
                    <span className="font-bold inv-muted">Ref No:</span>
                    <span className="font-bold inv-primary">{previewInvoice.id}</span>
                    <span className="font-bold inv-muted pt-1">Bill To:</span>
                    <input type="text" value={previewInvoice.client} onChange={(e)=>setPreviewInvoice({...previewInvoice, client: e.target.value})} className="font-bold inv-primary bg-transparent border-none outline-none text-right hover:bg-slate-100 w-full" placeholder="輸入客戶名稱..." />
                  </div>
                </div>
              </header>

              <table className="w-full border-collapse mb-[15px]">
                <thead>
                  <tr>
                    <th className="inv-bg inv-muted text-[10px] uppercase tracking-wide p-[8px_10px] text-left border-y border-[#e2e8f0]">Project Description</th>
                    <th className="inv-bg inv-muted text-[10px] uppercase tracking-wide p-[8px_10px] text-right border-y border-[#e2e8f0] w-[140px]">Net Amount (HKD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">1. Official Website Development & Design</span>
                      <span className="inv-muted text-[11px]">Build a responsive website using modern full-stack architecture (Next.js + Firebase), including news and event registration modules.</span>
                      
                      <div className="mt-[10px] p-[8px_10px] inv-bg border-l-3 border-[#3b82f6] text-[11px] w-[85%]">
                        <div className="flex justify-between mb-1">
                          <span>Standard Value:</span>
                          <span><del>$ {originalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</del></span>
                        </div>
                        <div className="flex justify-between font-extrabold inv-secondary">
                          <span>Partnership Discount (
                            <input type="number" value={invDiscountPct} onChange={(e) => setInvDiscountPct(Number(e.target.value))} className="w-[40px] bg-[#dbeafe] text-[#3b82f6] font-bold text-center rounded mx-1 outline-none border-none"/>% OFF):
                          </span>
                          <span>- $ {discountAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-bottom text-right" rowSpan={3}>
                      <div className="text-[16px] font-black inv-primary flex items-center justify-end">
                        <span className="inv-muted mr-1">$</span>
                        <input type="number" value={invTotal} onChange={(e) => setInvTotal(Number(e.target.value))} className="text-right w-[90px] bg-[#dbeafe] text-[#3b82f6] text-[16px] font-bold rounded px-1 outline-none border-none" />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">2. Database Migration & Data Entry</span>
                      <span className="inv-muted text-[11px]">Assist in structuring and importing the legacy data (Softcopy) provided by the client into the new system.</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">3. Domain Transfer & Hosting Setup</span>
                      <span className="inv-muted text-[11px]">Transfer and bind the existing domain to the new server.</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end m-[12px_0_6px_0] pb-1 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold inv-primary uppercase tracking-wide">Payment Schedule</span>
                  {totalPercent !== 100 && (
                    <span className="text-[10px] text-red-500 font-bold flex items-center print-hide-force"><AlertTriangle size={10} className="mr-1"/> 總和不等於 100% (當前: {totalPercent}%)</span>
                  )}
                </div>
                <button onClick={addPaymentPhase} className="print-hide-force text-[10px] text-blue-600 hover:text-blue-700 font-bold flex items-center bg-blue-50 px-2 py-0.5 rounded transition-colors"><Plus size={12} className="mr-0.5"/>新增期數</button>
              </div>
              <table className="w-full border-collapse mb-[15px]">
                <tbody>
                  {paymentPhases.map((phase, index) => {
                    const isLast = index === paymentPhases.length - 1;
                    const prevSum = paymentPhases.slice(0, index).reduce((acc, p) => acc + safeFloat(invTotal * (p.percent / 100)), 0);
                    const amount = isLast ? safeFloat(invTotal - prevSum) : safeFloat(invTotal * (phase.percent / 100));

                    return (
                      <tr key={phase.id} className="group">
                        <td className="p-[10px] border-b border-[#e2e8f0] align-top relative">
                          {paymentPhases.length > 1 && (
                            <button onClick={() => removePaymentPhase(phase.id)} className="absolute -left-6 top-3 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 print-hide-force transition-opacity">
                              <Trash2 size={14}/>
                            </button>
                          )}
                          <div className="flex items-center mb-1">
                            <input type="text" value={phase.name} onChange={(e) => updatePaymentPhase(phase.id, 'name', e.target.value)} className="text-[13px] font-bold inv-primary bg-transparent outline-none border-b border-transparent hover:border-slate-300 focus:border-blue-500 w-auto min-w-[80px]" />
                            <span className="text-[13px] font-bold inv-primary mx-1">(</span>
                            <input type="number" value={phase.percent} onChange={(e) => updatePaymentPhase(phase.id, 'percent', Number(e.target.value))} className="bg-[#dbeafe] text-[#3b82f6] text-center rounded px-1 outline-none border-none w-[40px] text-[13px] font-bold" />
                            <span className="text-[13px] font-bold inv-primary">%)</span>
                          </div>
                          <textarea value={phase.desc} onChange={(e) => updatePaymentPhase(phase.id, 'desc', e.target.value)} className="inv-muted text-[11px] bg-transparent outline-none w-full resize-none overflow-hidden" rows={2} />
                        </td>
                        <td className="p-[10px] border-b border-[#e2e8f0] font-bold text-right w-[140px] align-top pt-[14px]">
                          <span className="inv-muted mr-1">$</span>{amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="text-[11px] font-bold inv-primary uppercase tracking-wide m-[12px_0_6px_0] pb-1 border-b border-[#e2e8f0]">Annual Maintenance</div>
              <table className="w-full border-collapse mb-[15px]">
                <tbody>
                  <tr>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top">
                      <span className="text-[13px] font-bold inv-primary mb-1 block">Annual System Maintenance Fee</span>
                      <span className="inv-muted text-[11px]">Includes system bug fixes, cloud server (Vercel), and database storage.</span>
                    </td>
                    <td className="p-[10px] border-b border-[#e2e8f0] align-top text-right w-[140px] flex justify-end items-center">
                      <span className="inv-muted mr-1">$</span>
                      <input type="number" value={invMaint} onChange={(e) => setInvMaint(Number(e.target.value))} className="bg-[#dbeafe] text-[#3b82f6] font-bold rounded px-1 outline-none border-none text-right w-[70px]" />
                      <span className="ml-1 inv-muted text-[10px]">/ Year</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex gap-[15px] mb-[15px] break-inside-avoid">
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

              <div className="flex justify-between mt-[30px] break-inside-avoid">
                <div className="w-[42%]">
                  <div className="border-b border-[#0f172a] h-[65px] mb-2"></div>
                  <div className="text-[10px] inv-muted">For and on behalf of<br/><strong className="inv-primary">YIMI GROUP</strong></div>
                </div>
                <div className="w-[42%]">
                  <div className="border-b border-[#0f172a] h-[65px] mb-2"></div>
                  <div className="text-[10px] inv-muted">Accepted and Agreed by<br/><strong className="inv-primary">{previewInvoice.client === '請輸入客戶名稱' ? '___________________' : previewInvoice.client}</strong></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
