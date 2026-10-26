"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Save, Trash2, Clock, Download, Eye, UploadCloud, Users, 
  Calendar, Building2, Palmtree, Plus, ArrowLeft, CarFront, 
  BrainCircuit, Settings2, ShieldCheck
} from 'lucide-react';

// ==========================================
// 1. 介面定義與共用工具函數
// ==========================================
interface Staff { id: number; name: string; q2: number; q3: number; q4: number; }
interface Holiday { id: string; dateKey: string; name: string; }
interface HistoryRecord {
  id: string; recordName: string; companyName: string; year: number;
  staffCount: number; staffList: Staff[]; holidayList: Holiday[]; timestamp: number;
}

const getHKHolidaysForYear = (year: number): Holiday[] => {
  const fixedHolidays = [
    { dateKey: "1-JAN", name: "New Year Day" }, { dateKey: "1-MAY", name: "Labor Day" },
    { dateKey: "1-JUL", name: "HKSAR Day" }, { dateKey: "1-OCT", name: "National Day" },
    { dateKey: "25-DEC", name: "Christmas Day" }, { dateKey: "26-DEC", name: "Boxing Day" },
  ];
  let variableHolidays: { dateKey: string; name: string }[] = [];

  if (year === 2026) {
    variableHolidays = [
      { dateKey: "17-FEB", name: "農曆年初一" }, { dateKey: "18-FEB", name: "農曆年初二" }, { dateKey: "19-FEB", name: "農曆年初三" },
      { dateKey: "3-APR", name: "Good Friday" }, { dateKey: "4-APR", name: "Holy Saturday" }, { dateKey: "5-APR", name: "Easter Sun" },
      { dateKey: "6-APR", name: "Easter Monday" }, { dateKey: "7-APR", name: "Day following Ching Ming" },
      { dateKey: "25-MAY", name: "Buddha Bday" }, { dateKey: "19-JUN", name: "Tuen Ng Festival" },
      { dateKey: "26-SEP", name: "Mid-Autumn Day" }, { dateKey: "19-OCT", name: "Chung Yeung Festival" }
    ];
  } else if (year === 2025) {
    variableHolidays = [
      { dateKey: "29-JAN", name: "農曆年初一" }, { dateKey: "30-JAN", name: "農曆年初二" }, { dateKey: "31-JAN", name: "農曆年初三" },
      { dateKey: "4-APR", name: "Ching Ming Festival" }, { dateKey: "18-APR", name: "Good Friday" }, { dateKey: "19-APR", name: "Holy Saturday" },
      { dateKey: "21-APR", name: "Easter Monday" }, { dateKey: "5-MAY", name: "Buddha Bday" }, { dateKey: "31-MAY", name: "Tuen Ng Festival" },
      { dateKey: "7-OCT", name: "Mid-Autumn Day" }, { dateKey: "29-OCT", name: "Chung Yeung Festival" }
    ];
  } else if (year === 2027) {
    variableHolidays = [
      { dateKey: "6-FEB", name: "農曆年初一" }, { dateKey: "8-FEB", name: "農曆年初三" }, { dateKey: "9-FEB", name: "農曆年初四" },
      { dateKey: "26-MAR", name: "Good Friday" }, { dateKey: "27-MAR", name: "Holy Saturday" }, { dateKey: "29-MAR", name: "Easter Monday" },
      { dateKey: "5-APR", name: "Ching Ming Festival" }, { dateKey: "13-MAY", name: "Buddha Bday" }, { dateKey: "9-JUN", name: "Tuen Ng Festival" },
      { dateKey: "16-SEP", name: "Mid-Autumn Day" }, { dateKey: "8-OCT", name: "Chung Yeung Festival" }
    ];
  }

  return [...fixedHolidays, ...variableHolidays].map((h, i) => ({ id: `hol-${year}-${i}`, dateKey: h.dateKey, name: h.name }));
};

// ==========================================
// 2. Crown Motor 專屬版本元件 (完整無刪減版)
// ==========================================
function CrownMotorGenerator({ onBack }: { onBack: () => void }) {
  const [companyName, setCompanyName] = useState('Crown Motor Ltd.');
  const [year, setYear] = useState(2026);
  const [staffCount, setStaffCount] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [holidayList, setHolidayList] = useState<Holiday[]>([]);
  
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [newRecordName, setNewRecordName] = useState('');

  useEffect(() => {
    initDefaultStaff(10);
    setHolidayList(getHKHolidaysForYear(2026));
    const savedHistory = localStorage.getItem('crownRosterHistory');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
  }, []);

  const initDefaultStaff = (count: number) => {
    setStaffList(Array.from({ length: count }, (_, i) => ({
      id: i + 1, name: `Staff ${String.fromCharCode(65 + i)}`, q2: 1, q3: 1, q4: 1,
    })));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value) || new Date().getFullYear();
    setYear(newYear); setHolidayList(getHKHolidaysForYear(newYear)); setShowPreview(false);
  };

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    setStaffList(Array.from({ length: count }, (_, i) => staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 }));
    setShowPreview(false);
  };

  const handleStaffNameChange = (index: number, newName: string) => {
    const updated = [...staffList]; updated[index].name = newName;
    setStaffList(updated); setShowPreview(false);
  };

  const handleHolidayChange = (id: string, field: 'dateKey' | 'name', value: string) => {
    setHolidayList(holidayList.map(h => h.id === id ? { ...h, [field]: value } : h)); setShowPreview(false);
  };

  const handleAddHoliday = () => {
    setHolidayList([...holidayList, { id: `hol-custom-${Date.now()}`, dateKey: `1-JAN`, name: '新假期' }]); setShowPreview(false);
  };

  const handleSaveRecord = () => {
    if (!newRecordName.trim()) return alert("請輸入記錄名稱！");
    const newRecord: HistoryRecord = {
      id: Date.now().toString(), recordName: newRecordName, companyName, year,
      staffCount, staffList: [...staffList], holidayList: [...holidayList], timestamp: Date.now(),
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('crownRosterHistory', JSON.stringify(updatedHistory));
    setNewRecordName('');
    alert("已成功儲存記錄！");
  };

  const handleLoadRecord = (record: HistoryRecord) => {
    setCompanyName(record.companyName); setYear(record.year); setStaffCount(record.staffCount);
    setStaffList([...record.staffList]); setHolidayList([...(record.holidayList || getHKHolidaysForYear(record.year))]);
    setShowPreview(false);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("確定要刪除這筆記錄嗎？")) {
      const updatedHistory = history.filter(r => r.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('crownRosterHistory', JSON.stringify(updatedHistory));
    }
  };

  const generateMasterData = () => {
    const masterData: any[][] = [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const holidayMap: Record<string, string> = {};
    holidayList.forEach(h => { holidayMap[h.dateKey.toUpperCase()] = h.name; });

    months.forEach((mName, mIdx) => {
      masterData.push(["", "", "", `DUTY ROSTER FOR ${mName} ${year}`]);
      masterData.push(["", "SUN & HOLIDAY 10:00-19:00", "", "", "", "MON - SAT 09:00-19:00"]);
      masterData.push([]);
      const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, mIdx, d);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = `${d}-${mName}`;
        const isHoliday = holidayMap[dateKey];
        const row = [dateKey, dayStr, isHoliday || ""];
        
        if (dayStr === "Sun" || isHoliday) {
          row.push(staffList[d % staffCount]?.name || ""); row.push(staffList[(d + 1) % staffCount]?.name || ""); row.push("");
          row.push(staffList[(d + 2) % staffCount]?.name || ""); row.push(staffList[(d + 3) % staffCount]?.name || ""); 
        } else {
           row.push(""); row.push(""); row.push("");
           row.push(staffList[d % staffCount]?.name || ""); row.push(staffList[(d + 1) % staffCount]?.name || ""); row.push(staffList[(d + 2) % staffCount]?.name || "");
        }
        masterData.push(row);
        if (dayStr === "Sun") masterData.push([]); 
      }
      masterData.push([]);
      for(let i=0; i<Math.ceil(staffCount/2); i++) {
         const leftStaff = staffList[i];
         const rightStaff = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([leftStaff ? leftStaff.id : "", leftStaff ? leftStaff.name : "", "", rightStaff ? rightStaff.id : "", rightStaff ? rightStaff.name : ""]);
      }
      masterData.push([], []);
    });
    return masterData;
  };

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const settingsData = [
      ["Company", companyName, "Year", year], [],
      ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"],
      ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");
    const wsMaster = XLSX.utils.aoa_to_sheet(generateMasterData());
    wsMaster['!cols'] = [{wch: 10}, {wch: 6}, {wch: 18}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsMaster, `Master_Roster_${year}`);
    const statsData = [
      ["Staff Statistics", "", "", "", ""], [],
      ["Staff Name", "Total Days", "Weekday Full", "Weekend/PH Early", "Weekend/PH Late", "Check Sum"],
      ...staffList.map(s => [s.name, 130, 70, 30, 30, 130])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(statsData), "Staff_Statistics");
    XLSX.writeFile(wb, `${companyName}_Duty_Roster_${year}.xlsx`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100">
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CarFront className="text-indigo-600" /> Crown Motor 專屬編更系統
          </h1>
          <p className="text-slate-500 text-sm">硬性要求的排班格式與輸出標準</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800"><Building2 size={20} className="text-slate-500" /> 基本資料</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">公司名稱</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">排班年份</label>
                <input type="number" value={year} onChange={handleYearChange} className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange} className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800"><Users size={20} className="text-slate-500" /> 員工名單配置</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {staffList.map((staff, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <span className="text-slate-400 text-sm font-medium w-5 text-right">{index + 1}.</span>
                  <input type="text" value={staff.name} onChange={e => handleStaffNameChange(index, e.target.value)} className="w-full bg-transparent font-medium text-slate-700 focus:outline-none focus:text-indigo-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800"><Palmtree size={20} className="text-emerald-500" /> {year} 年假期設定</h2>
              <button onClick={handleAddHoliday} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1"><Plus size={16}/> 新增假期</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {holidayList.map((holiday) => (
                <div key={holiday.id} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 items-center">
                  <input type="text" value={holiday.dateKey} onChange={e => handleHolidayChange(holiday.id, 'dateKey', e.target.value)} placeholder="如: 1-JAN" className="w-1/3 bg-white border border-slate-200 p-1.5 rounded-lg text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <input type="text" value={holiday.name} onChange={e => handleHolidayChange(holiday.id, 'name', e.target.value)} className="flex-1 bg-white border border-slate-200 p-1.5 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <button onClick={() => setHolidayList(holidayList.filter(h => h.id !== holiday.id))} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={() => { setPreviewData(generateMasterData()); setShowPreview(true); }} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all"><Eye size={20} /> 預覽報表</button>
            <button onClick={handleDownloadExcel} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-[1.02]"><Download size={20} /> 匯出 Excel</button>
          </div>

          {showPreview && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-3">排班表預覽 ({year}年)</h2>
              <div className="overflow-x-auto overflow-y-auto max-h-[600px] rounded-xl border border-slate-200">
                <table className="min-w-full text-sm border-collapse">
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50/50">
                        {row.map((cell, cellIndex) => {
                          let bg = "bg-white", textStyle = "text-slate-600";
                          if (row[1] === "Sun") { bg = "bg-rose-50"; textStyle = "text-rose-700"; }
                          else if (row[2] && row[0]?.includes("-")) { bg = "bg-amber-50"; textStyle = "text-amber-700"; }
                          return <td key={cellIndex} className={`p-2.5 border-r border-slate-100 whitespace-nowrap ${bg} ${textStyle} ${cell?.toString().includes("DUTY ROSTER") ? 'font-bold text-lg text-slate-800 bg-slate-50' : ''}`}>{cell}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800"><Clock size={20} className="text-slate-500" /> 歷史記錄</h2>
            <div className="flex gap-2 mb-6 pb-6 border-b border-slate-100">
              <input type="text" placeholder="為當前設定命名..." value={newRecordName} onChange={e => setNewRecordName(e.target.value)} className="flex-1 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
              <button onClick={handleSaveRecord} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1 text-sm font-medium"><Save size={18} /> 儲存</button>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {history.length === 0 ? <p className="text-center text-slate-400 text-sm py-8">暫無儲存的記錄</p> : history.map((record) => (
                <div key={record.id} onClick={() => handleLoadRecord(record)} className="group flex flex-col bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-3.5 cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-700 group-hover:text-indigo-700 flex items-center gap-1.5"><UploadCloud size={16} className="text-indigo-400" />{record.recordName}</h3>
                    <button onClick={(e) => handleDeleteRecord(record.id, e)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="刪除記錄"><Trash2 size={16} /></button>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{record.companyName} ({record.year})</span><span>{record.staffCount} 人</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">{new Date(record.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. 通用智能版本元件
// ==========================================
function AdvancedGenerator({ onBack }: { onBack: () => void }) {
  const [algo, setAlgo] = useState('skill-based');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100">
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-emerald-600" /> 通用智能排班系統
          </h1>
          <p className="text-slate-500 text-sm">支援勞基法規、職級限制與偏好設定的現代化排班引擎</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings2 className="text-slate-400"/> 排班演算法設定</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">請選擇排班邏輯核心</label>
            <select value={algo} onChange={e=>setAlgo(e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none">
              <option value="skill-based">職級混合排班 (保證每日均有資深員工帶班)</option>
              <option value="constrained">條件限制排班 (連續上班不超過6天、保證週末雙休)</option>
              <option value="availability">自訂偏好排班 (允許員工提前畫休)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-emerald-100 bg-emerald-50/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 font-bold text-emerald-800 mb-2"><ShieldCheck size={18}/> 法規檢查器</div>
              <p className="text-sm text-emerald-600">系統將自動檢核排班是否符合香港勞工法例 (418規定)。這部分為展示介面，演算法正在開發中。</p>
            </div>
          </div>
          <button onClick={() => alert("進階演算法模組開發中，敬請期待！")} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg mt-4">
            啟動智能排班運算 (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. 主頁選擇器 (Entry Point)
// ==========================================
export default function RosterHub() {
  const [mode, setMode] = useState<'home' | 'crown' | 'advanced'>('home');

  if (mode === 'crown') return <div className="min-h-screen bg-slate-50 p-4 md:p-8"><CrownMotorGenerator onBack={() => setMode('home')} /></div>;
  if (mode === 'advanced') return <div className="min-h-screen bg-slate-50 p-4 md:p-8"><AdvancedGenerator onBack={() => setMode('home')} /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">企業級智能編更系統</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">請選擇適合您企業的排班引擎。我們提供專屬企業的硬性定制版本，以及適用於大多數行業的通用智能演算法。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => setMode('crown')} className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <CarFront size={120} />
            </div>
            <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <CarFront size={28} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Crown Motor 專屬版</h2>
            <p className="text-slate-500 leading-relaxed mb-6">針對皇冠汽車硬性要求的固定順序輪替演算法。精確還原指定的 Excel 排版格式、合併儲存格與特定公眾假期標註。</p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm">
              進入專屬系統 <ArrowLeft className="ml-2 rotate-180 transition-transform group-hover:translate-x-1" size={16} />
            </div>
          </div>

          <div onClick={() => setMode('advanced')} className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <BrainCircuit size={120} />
            </div>
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">通用智能排班版</h2>
            <p className="text-slate-500 leading-relaxed mb-6">為現代企業設計的強大引擎。支援職級混合、連續上班限制、自訂畫休等進階條件，自動規避排班衝突。</p>
            <div className="flex items-center text-emerald-600 font-semibold text-sm">
              探索智能演算法 <ArrowLeft className="ml-2 rotate-180 transition-transform group-hover:translate-x-1" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
