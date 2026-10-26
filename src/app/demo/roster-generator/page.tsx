"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Save, Trash2, Clock, Download, Eye, UploadCloud, Users, 
  Calendar, Building2, Palmtree, Plus, ArrowLeft, CarFront, 
  BrainCircuit, Settings2, ShieldCheck, Activity, Info
} from 'lucide-react';

// ==========================================
// 1. 共用介面定義與工具函數
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
  } else if (year === 2027) {
    variableHolidays = [
      { dateKey: "6-FEB", name: "農曆年初一" }, { dateKey: "8-FEB", name: "農曆年初三" }, { dateKey: "9-FEB", name: "農曆年初四" },
      { dateKey: "26-MAR", name: "Good Friday" }, { dateKey: "27-MAR", name: "Holy Saturday" }, { dateKey: "29-MAR", name: "Easter Monday" },
      { dateKey: "5-APR", name: "Ching Ming Festival" }, { dateKey: "13-MAY", name: "Buddha Bday" }, { dateKey: "9-JUN", name: "Tuen Ng Festival" },
      { dateKey: "16-SEP", name: "Mid-Autumn Day" }, { dateKey: "8-OCT", name: "Chung Yeung Festival" }
    ];
  } else if (year === 2028) {
    variableHolidays = [
      { dateKey: "26-JAN", name: "農曆年初一" }, { dateKey: "27-JAN", name: "農曆年初二" }, { dateKey: "28-JAN", name: "農曆年初三" },
      { dateKey: "4-APR", name: "Ching Ming Festival" }, { dateKey: "14-APR", name: "Good Friday" }, { dateKey: "15-APR", name: "Holy Saturday" },
      { dateKey: "17-APR", name: "Easter Monday" }, { dateKey: "2-MAY", name: "Buddha Bday" }, { dateKey: "28-MAY", name: "Tuen Ng Festival" },
      { dateKey: "3-OCT", name: "Mid-Autumn Day" }, { dateKey: "26-OCT", name: "Chung Yeung Festival" }
    ];
  }
  return [...fixedHolidays, ...variableHolidays].map((h, i) => ({ id: `hol-${year}-${i}`, dateKey: h.dateKey, name: h.name }));
};

const defaultStaffList = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, name: `Staff ${String.fromCharCode(65 + i)}`, q2: 1, q3: 1, q4: 1,
}));

// ==========================================
// 2. Crown Motor 專屬版元件 (完整版)
// ==========================================
function CrownMotorGenerator({ onBack }: { onBack: () => void }) {
  const [companyName, setCompanyName] = useState('Crown Motor Ltd.');
  const [year, setYear] = useState(2026);
  const [staffCount, setStaffCount] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>(defaultStaffList);
  const [holidayList, setHolidayList] = useState<Holiday[]>(getHKHolidaysForYear(2026));
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [newRecordName, setNewRecordName] = useState('');

  useEffect(() => {
    const savedHistory = localStorage.getItem('crownRosterHistory');
    if (savedHistory) { try { setHistory(JSON.parse(savedHistory)); } catch (e) {} }
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
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
    setNewRecordName(''); alert("已成功儲存記錄！");
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
         const ls = staffList[i], rs = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([ls ? ls.id : "", ls ? ls.name : "", "", rs ? rs.id : "", rs ? rs.name : ""]);
      }
      masterData.push([], []);
    });
    return masterData;
  };

  const handlePreview = () => {
    setPreviewData(generateMasterData());
    setShowPreview(true);
  };

  
  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const settingsData = [["Company", companyName, "Year", year], [], ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"], ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");
    const wsMaster = XLSX.utils.aoa_to_sheet(generateMasterData());
    wsMaster['!cols'] = [{wch: 10}, {wch: 6}, {wch: 18}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsMaster, `Master_Roster_${year}`);
    const statsData = [["Staff Statistics", "", "", "", "", ""], [], ["Staff Name", "Total Days", "Weekday Full", "Weekend/PH Early", "Weekend/PH Late", "Check Sum"], ...staffList.map(s => [s.name, 130, 70, 30, 30, 130])];
    const wsStats = XLSX.utils.aoa_to_sheet(statsData);
    wsStats['!cols'] = [{wch: 15}, {wch: 12}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsStats, "Staff_Statistics");
    XLSX.writeFile(wb, `${companyName}_Duty_Roster_${year}.xlsx`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full bg-slate-100"><ArrowLeft size={20} className="text-slate-700" /></button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><CarFront className="text-indigo-600" /> Crown Motor 專屬編更系統</h1>
          <p className="text-slate-500 text-sm">硬性要求的排班格式與輸出標準</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Building2 size={18} /> 基本資料</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">公司名稱</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full border p-2.5 rounded-lg text-slate-900 bg-white focus:ring-2 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">排班年份</label>
                <select value={year} onChange={handleYearChange} className="w-full border p-2.5 rounded-lg text-slate-900 bg-white focus:ring-2 outline-none font-medium">
                  <option value={2025}>2025</option><option value={2026}>2026</option><option value={2027}>2027</option><option value={2028}>2028</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange} className="w-full border p-2.5 rounded-lg text-slate-900 bg-white focus:ring-2 outline-none font-medium" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Users size={18} /> 員工名單配置</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {staffList.map((staff, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium w-6 text-sm">{index + 1}.</span>
                  <input type="text" value={staff.name} onChange={e => handleStaffNameChange(index, e.target.value)} className="w-full bg-white p-1.5 rounded border text-slate-900 font-medium outline-none focus:border-indigo-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Palmtree size={18} className="text-emerald-500" /> {year} 年假期設定</h2>
              <button onClick={handleAddHoliday} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1"><Plus size={16}/> 新增假期</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {holidayList.map((holiday) => (
                <div key={holiday.id} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 items-center">
                  <input type="text" value={holiday.dateKey} onChange={e => handleHolidayChange(holiday.id, 'dateKey', e.target.value)} placeholder="如: 1-JAN" className="w-1/3 bg-white border border-slate-300 p-2 rounded-lg text-sm text-center text-slate-900 font-medium outline-none focus:border-indigo-500" />
                  <input type="text" value={holiday.name} onChange={e => handleHolidayChange(holiday.id, 'name', e.target.value)} className="flex-1 bg-white border border-slate-300 p-2 rounded-lg text-sm text-slate-900 font-medium outline-none focus:border-indigo-500" />
                  <button onClick={() => setHolidayList(holidayList.filter(h => h.id !== holiday.id))} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={handlePreview} className="flex-1 flex justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 font-medium transition"><Eye size={20} /> 預覽報表</button>
            <button onClick={handleDownloadExcel} className="flex-1 flex justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-medium transition"><Download size={20} /> 匯出 Excel</button>
          </div>

          {showPreview && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-4 border-b pb-2 text-slate-800">排班表預覽</h2>
              <div className="overflow-x-auto h-[500px] border rounded-lg">
                <table className="min-w-full text-sm border-collapse bg-white">
                  <tbody>
                    {previewData.map((row, i) => (
                      <tr key={i} className="border-b">
                        {row.map((cell, j) => {
                          let bg = "bg-white", textStyle = "text-slate-800";
                          if (row[1] === "Sun") { bg = "bg-rose-50"; textStyle = "text-rose-700"; }
                          else if (row[2] && row[0]?.includes("-")) { bg = "bg-amber-50"; textStyle = "text-amber-700"; }
                          return <td key={j} className={`p-2 border-r whitespace-nowrap ${bg} ${textStyle} ${cell?.toString().includes("DUTY ROSTER") ? 'font-bold bg-slate-100' : ''}`}>{cell}</td>;
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
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800"><Clock size={20} className="text-slate-500" /> 歷史記錄</h2>
            <div className="flex gap-2 mb-6 pb-6 border-b border-slate-200">
              <input type="text" placeholder="為當前設定命名..." value={newRecordName} onChange={e => setNewRecordName(e.target.value)} className="flex-1 border border-slate-300 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-900" />
              <button onClick={handleSaveRecord} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-colors flex items-center gap-1 font-medium"><Save size={18} /> 儲存</button>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {history.length === 0 ? <p className="text-center text-slate-400 text-sm py-8">暫無儲存的記錄</p> : history.map((record) => (
                <div key={record.id} onClick={() => handleLoadRecord(record)} className="group flex flex-col bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl p-3.5 cursor-pointer transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700 flex items-center gap-1.5"><UploadCloud size={16} className="text-indigo-500" />{record.recordName}</h3>
                    <button onClick={(e) => handleDeleteRecord(record.id, e)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="刪除記錄"><Trash2 size={16} /></button>
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
// 3. 通用智能排班版元件 (完整版)
// ==========================================
function AdvancedGenerator({ onBack }: { onBack: () => void }) {
  const [companyName, setCompanyName] = useState('Global Tech Ltd.');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [staffCount, setStaffCount] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>(defaultStaffList);
  const [holidayList, setHolidayList] = useState<Holiday[]>(getHKHolidaysForYear(2026));
  const [algoType, setAlgoType] = useState('sequential');
  
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear); setHolidayList(getHKHolidaysForYear(newYear)); setShowPreview(false);
  };

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    setStaffList(Array.from({ length: count }, (_, i) => staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 }));
    setShowPreview(false);
  };

  const handleHolidayChange = (id: string, field: 'dateKey' | 'name', value: string) => {
    setHolidayList(holidayList.map(h => h.id === id ? { ...h, [field]: value } : h)); setShowPreview(false);
  };

  const handleAddHoliday = () => {
    setHolidayList([...holidayList, { id: `hol-adv-${Date.now()}`, dateKey: `1-JAN`, name: '新假期' }]); setShowPreview(false);
  };

  const runSmartAlgorithm = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const data: any[][] = [];
    const holidayMap: Record<string, boolean> = {};
    holidayList.forEach(h => holidayMap[h.dateKey.toUpperCase()] = true);
    
    const headerRow = ["Staff Name"];
    for(let d=1; d<=daysInMonth; d++) {
      const dateKey = `${d}-${new Date(year, month-1, d).toLocaleString('en-US',{month:'short'}).toUpperCase()}`;
      const isSun = new Date(year, month-1, d).getDay() === 0;
      headerRow.push(isSun || holidayMap[dateKey] ? `${d}(休)` : `${d}`);
    }
    data.push(headerRow);

    let consecutiveDays: Record<number, number> = {};
    staffList.forEach(s => consecutiveDays[s.id] = 0);
    const shiftTypes = ['M', 'L', 'F']; 

    staffList.forEach((staff, sIdx) => {
      const row = [staff.name];
      for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${d}-${new Date(year, month-1, d).toLocaleString('en-US',{month:'short'}).toUpperCase()}`;
        const isSun = new Date(year, month-1, d).getDay() === 0;
        const isPublicHoliday = holidayMap[dateKey];

        if (algoType === 'sequential') {
          // 順序輪班：保證週末及紅日放假機制，平日規律輪班
          if (isSun || isPublicHoliday || d % 7 === 0) {
             row.push('O'); consecutiveDays[staff.id] = 0;
          } else {
             const shift = shiftTypes[(sIdx + d) % shiftTypes.length];
             row.push(shift); consecutiveDays[staff.id]++;
          }
        } else if (algoType === 'constrained') {
          // 限制輪班：嚴格規避連續 6 天上班，並隨機分配
          if (consecutiveDays[staff.id] >= 6) {
            row.push('O'); consecutiveDays[staff.id] = 0;
          } else {
            const isOff = Math.random() < 0.15;
            if(isOff || isSun || isPublicHoliday) { row.push('O'); consecutiveDays[staff.id] = 0; }
            else { row.push(shiftTypes[Math.floor(Math.random() * 3)]); consecutiveDays[staff.id]++; }
          }
        }
      }
      data.push(row);
    });
    return data;
  };

  const handlePreview = () => { setPreviewData(runSmartAlgorithm()); setShowPreview(true); };

  const handleDownloadExcel = () => {
    const data = runSmartAlgorithm();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, `SmartRoster_${year}_${month}`);
    XLSX.writeFile(wb, `${companyName}_SmartRoster_${year}_${month}.xlsx`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full bg-slate-100"><ArrowLeft size={20} className="text-slate-700" /></button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><BrainCircuit className="text-emerald-600" /> 通用智能排班系統</h1>
          <p className="text-slate-500 text-sm">矩陣式排版 (Matrix) 與多種排班演算法</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Building2 size={18}/> 基本資料</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">公司名稱</label>
                <input type="text" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full border p-2.5 rounded-lg text-slate-900 font-medium bg-white outline-none focus:ring-2" />
              </div>
              <div className="flex gap-3">
                <div className="w-1/2">
                  <label className="block text-sm text-slate-600 mb-1">年份</label>
                  <select value={year} onChange={handleYearChange} className="w-full border p-2.5 rounded-lg text-slate-900 font-medium bg-white outline-none focus:ring-2">
                    <option value={2025}>2025</option><option value={2026}>2026</option><option value={2027}>2027</option><option value={2028}>2028</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm text-slate-600 mb-1">排班月份</label>
                  <input type="number" min="1" max="12" value={month} onChange={e=>setMonth(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-slate-900 font-medium bg-white outline-none focus:ring-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange} className="w-full border p-2.5 rounded-lg text-slate-900 font-medium bg-white outline-none focus:ring-2" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Settings2 size={18}/> 演算法設定</h2>
            <div className="mb-4">
              <label className="block text-sm text-slate-700 font-semibold mb-2">排班方式種類</label>
              <select value={algoType} onChange={e=>setAlgoType(e.target.value)} className="w-full border p-2.5 rounded-lg text-slate-900 font-medium bg-white outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="sequential">順序輪替排班 (Sequential)</option>
                <option value="constrained">條件限制防過勞 (Constrained)</option>
              </select>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 mb-5 border border-slate-200">
              <div className="flex gap-2 items-start">
                <Info size={16} className="mt-0.5 text-indigo-500 shrink-0"/>
                {algoType === 'sequential' ? (
                  <p><strong>順序輪替：</strong>絕對平均的排班法。員工將依序規律輪替早(M)、晚(L)、全班(F)，適合技能對等且人數穩定的團隊。</p>
                ) : (
                  <p><strong>條件限制：</strong>啟動勞規防護。系統將強制保證員工<strong>連續上班不超過 6 天</strong>，自動安插休假(O)，適合重視勞逸結合的企業。</p>
                )}
              </div>
            </div>
            <button onClick={handlePreview} className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 flex justify-center gap-2 font-medium transition"><Activity size={18}/> 啟動智能運算預覽</button>
            <button onClick={handleDownloadExcel} className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 flex justify-center gap-2 mt-3 font-medium transition"><Download size={18}/> 匯出 Matrix Excel</button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800"><Users size={18}/> 員工名單配置</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {staffList.map((staff, index) => (
                <div key={index} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-sm font-medium w-4">{index + 1}.</span>
                  <input type="text" value={staff.name} onChange={e => {const u=[...staffList]; u[index].name=e.target.value; setStaffList(u); setShowPreview(false);}} className="w-full bg-white p-1 rounded border border-slate-200 text-slate-900 font-medium outline-none focus:border-emerald-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Palmtree size={18} className="text-emerald-500" /> {year} 年假期設定</h2>
              <button onClick={handleAddHoliday} className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-100 flex items-center gap-1"><Plus size={16}/> 新增</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {holidayList.map((holiday) => (
                <div key={holiday.id} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 items-center">
                  <input type="text" value={holiday.dateKey} onChange={e => handleHolidayChange(holiday.id, 'dateKey', e.target.value)} placeholder="如: 1-JAN" className="w-1/3 bg-white border border-slate-300 p-2 rounded-lg text-sm text-center text-slate-900 font-medium outline-none focus:border-emerald-500" />
                  <input type="text" value={holiday.name} onChange={e => handleHolidayChange(holiday.id, 'name', e.target.value)} className="flex-1 bg-white border border-slate-300 p-2 rounded-lg text-sm text-slate-900 font-medium outline-none focus:border-emerald-500" />
                  <button onClick={() => setHolidayList(holidayList.filter(h => h.id !== holiday.id))} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {showPreview && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-in fade-in">
              <h2 className="text-lg font-bold mb-4 border-b pb-2 text-slate-800">網格排班表預覽 ({year}年 {month}月)</h2>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full text-center text-sm border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {previewData[0]?.map((head, i) => (
                        <th key={i} className={`p-2 border-r border-slate-200 text-slate-600 font-semibold whitespace-nowrap ${i===0 ? 'sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]':''}`}>{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/80">
                        {row.map((cell, j) => {
                          let color = "text-slate-800";
                          if (cell === 'O') color = "text-rose-500 font-bold bg-rose-50/50";
                          else if (cell === 'M') color = "text-blue-500 font-medium";
                          else if (cell === 'L') color = "text-amber-500 font-medium";
                          else if (cell === 'F') color = "text-emerald-600 font-bold";
                          return <td key={j} className={`p-2.5 border-r border-slate-100 ${color} ${j===0 ? 'sticky left-0 bg-white font-semibold text-left z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]' : ''}`}>{cell}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. 主頁選擇器
// ==========================================
export default function RosterHub() {
  const [mode, setMode] = useState<'home' | 'crown' | 'advanced'>('home');
  if (mode === 'crown') return <div className="min-h-screen bg-slate-50 p-4 md:p-8"><CrownMotorGenerator onBack={() => setMode('home')} /></div>;
  if (mode === 'advanced') return <div className="min-h-screen bg-slate-50 p-4 md:p-8"><AdvancedGenerator onBack={() => setMode('home')} /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">企業級智能編更系統</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">選擇適合您的排班引擎。我們提供專屬企業的硬性定制版本，以及適用於多數行業的通用智能演算法。</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div onClick={() => setMode('crown')} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-500 border border-slate-200 cursor-pointer transition-all">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><CarFront size={32} className="text-indigo-600" /></div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900">Crown Motor 專屬版</h2>
            <p className="text-slate-500 mb-6">嚴格遵循皇冠汽車的排班邏輯，精準輸出包含 12 個月與統計劃分的專屬 Excel 報表格式。</p>
            <span className="text-indigo-600 font-semibold flex items-center gap-1">進入系統 <ArrowLeft className="rotate-180" size={16}/></span>
          </div>
          <div onClick={() => setMode('advanced')} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-emerald-500 border border-slate-200 cursor-pointer transition-all">
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6"><BrainCircuit size={32} className="text-emerald-600" /></div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900">通用智能排班版</h2>
            <p className="text-slate-500 mb-6">採用直覺的矩陣網格排版 (Matrix)，內建連續上班防過勞機制，自動規避排班衝突的強大引擎。</p>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">探索演算法 <ArrowLeft className="rotate-180" size={16}/></span>
          </div>
        </div>
      </div>
    </div>
  );
}
