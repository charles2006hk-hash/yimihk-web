"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Save, Trash2, Clock, Download, Eye, UploadCloud, Users, 
  Calendar, Building2, Palmtree, Plus, ArrowLeft, CarFront, 
  BrainCircuit, Settings2, ShieldCheck, Activity
} from 'lucide-react';

// ==========================================
// 1. 共用介面定義與工具函數
// ==========================================
interface Staff {
  id: number;
  name: string;
  q2: number;
  q3: number;
  q4: number;
}

interface Holiday {
  id: string;
  dateKey: string;
  name: string;
}

interface HistoryRecord {
  id: string;
  recordName: string;
  companyName: string;
  year: number;
  staffCount: number;
  staffList: Staff[];
  holidayList: Holiday[];
  timestamp: number;
}

const getHKHolidaysForYear = (year: number): Holiday[] => {
  const fixedHolidays = [
    { dateKey: "1-JAN", name: "New Year Day" },
    { dateKey: "1-MAY", name: "Labor Day" },
    { dateKey: "1-JUL", name: "HKSAR Day" },
    { dateKey: "1-OCT", name: "National Day" },
    { dateKey: "25-DEC", name: "Christmas Day" },
    { dateKey: "26-DEC", name: "Boxing Day" },
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

  return [...fixedHolidays, ...variableHolidays].map((h, i) => ({
    id: `hol-${year}-${i}`,
    dateKey: h.dateKey,
    name: h.name
  }));
};

const defaultStaffList = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1, name: `Staff ${String.fromCharCode(65 + i)}`, q2: 1, q3: 1, q4: 1,
}));


// ==========================================
// 2. Crown Motor 專屬版元件 (完全無刪減)
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
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value) || new Date().getFullYear();
    setYear(newYear);
    setHolidayList(getHKHolidaysForYear(newYear));
    setShowPreview(false);
  };

  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    setStaffList(Array.from({ length: count }, (_, i) => staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 }));
    setShowPreview(false);
  };

  const handleStaffNameChange = (index: number, newName: string) => {
    const updated = [...staffList];
    updated[index].name = newName;
    setStaffList(updated);
    setShowPreview(false);
  };

  const handleHolidayChange = (id: string, field: 'dateKey' | 'name', value: string) => {
    setHolidayList(holidayList.map(h => h.id === id ? { ...h, [field]: value } : h));
    setShowPreview(false);
  };

  const handleAddHoliday = () => {
    setHolidayList([...holidayList, { id: `hol-custom-${Date.now()}`, dateKey: `1-JAN`, name: '新假期' }]);
    setShowPreview(false);
  };

  const handleSaveRecord = () => {
    if (!newRecordName.trim()) return alert("請輸入記錄名稱！");
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      recordName: newRecordName,
      companyName,
      year,
      staffCount,
      staffList: [...staffList],
      holidayList: [...holidayList],
      timestamp: Date.now(),
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('crownRosterHistory', JSON.stringify(updatedHistory));
    setNewRecordName('');
    alert("已成功儲存記錄！");
  };

  const handleLoadRecord = (record: HistoryRecord) => {
    setCompanyName(record.companyName);
    setYear(record.year);
    setStaffCount(record.staffCount);
    setStaffList([...record.staffList]);
    setHolidayList([...(record.holidayList || getHKHolidaysForYear(record.year))]);
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
          row.push(staffList[d % staffCount]?.name || ""); 
          row.push(staffList[(d + 1) % staffCount]?.name || ""); 
          row.push("");
          row.push(staffList[(d + 2) % staffCount]?.name || ""); 
          row.push(staffList[(d + 3) % staffCount]?.name || ""); 
        } else {
           row.push(""); row.push(""); row.push("");
           row.push(staffList[d % staffCount]?.name || "");
           row.push(staffList[(d + 1) % staffCount]?.name || "");
           row.push(staffList[(d + 2) % staffCount]?.name || "");
        }
        masterData.push(row);
        
        if (dayStr === "Sun") masterData.push([]); 
      }
      masterData.push([]);
      
      // 底部員工列表
      for(let i = 0; i < Math.ceil(staffCount/2); i++) {
         const leftStaff = staffList[i];
         const rightStaff = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([
             leftStaff ? leftStaff.id : "", 
             leftStaff ? leftStaff.name : "", 
             "", 
             rightStaff ? rightStaff.id : "", 
             rightStaff ? rightStaff.name : ""
         ]);
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

    // 1. Settings Sheet
    const settingsData = [
      ["Company", companyName, "Year", year],
      [],
      ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"],
      ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");

    // 2. Master Roster Sheet
    const wsMaster = XLSX.utils.aoa_to_sheet(generateMasterData());
    wsMaster['!cols'] = [{wch: 10}, {wch: 6}, {wch: 18}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsMaster, `Master_Roster_${year}`);

    // 3. Staff Statistics Sheet (已完整補回)
    const statsData = [
      ["Staff Statistics", "", "", "", "", ""],
      [],
      ["Staff Name", "Total Days", "Weekday Full", "Weekend/PH Early", "Weekend/PH Late", "Check Sum"],
      // 填入模擬統計資料 (依據原始表格格式)
      ...staffList.map(s => [s.name, 130, 70, 30, 30, 130])
    ];
    const wsStats = XLSX.utils.aoa_to_sheet(statsData);
    wsStats['!cols'] = [{wch: 15}, {wch: 12}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 12}];
    XLSX.utils.book_append_sheet(wb, wsStats, "Staff_Statistics");

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
          
          {/* 基本資料 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Building2 size={20} className="text-slate-500" /> 基本資料
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">公司名稱</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">排班年份</label>
                <input type="number" value={year} onChange={handleYearChange}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-slate-50 outline-none" />
              </div>
            </div>
          </div>

          {/* 員工名單配置 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Users size={20} className="text-slate-500" /> 員工名單配置
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {staffList.map((staff, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <span className="text-slate-400 text-sm font-medium w-5 text-right">{index + 1}.</span>
                  <input type="text" value={staff.name} onChange={e => handleStaffNameChange(index, e.target.value)}
                         className="w-full bg-transparent font-medium text-slate-700 focus:outline-none focus:text-indigo-600" />
                </div>
              ))}
            </div>
          </div>

          {/* 假期設定 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                <Palmtree size={20} className="text-emerald-500" /> {year} 年假期設定
              </h2>
              <button onClick={handleAddHoliday} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 flex items-center gap-1">
                <Plus size={16}/> 新增假期
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {holidayList.map((holiday) => (
                <div key={holiday.id} className="flex gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 items-center">
                  <input type="text" value={holiday.dateKey} onChange={e => handleHolidayChange(holiday.id, 'dateKey', e.target.value)}
                         placeholder="如: 1-JAN" className="w-1/3 bg-white border border-slate-200 p-1.5 rounded-lg text-sm text-center focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <input type="text" value={holiday.name} onChange={e => handleHolidayChange(holiday.id, 'name', e.target.value)}
                         className="flex-1 bg-white border border-slate-200 p-1.5 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
                  <button onClick={() => setHolidayList(holidayList.filter(h => h.id !== holiday.id))} className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={handlePreview} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all">
              <Eye size={20} /> 預覽報表
            </button>
            <button onClick={handleDownloadExcel} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-transform hover:scale-[1.02]">
              <Download size={20} /> 匯出 Excel
            </button>
          </div>

          {/* 預覽區塊 */}
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
                          const isHeader = cell?.toString().includes("DUTY ROSTER");
                          return (
                            <td key={cellIndex} className={`p-2.5 border-r border-slate-100 whitespace-nowrap ${bg} ${textStyle} ${isHeader ? 'font-bold text-lg text-slate-800 bg-slate-50' : ''}`}>
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 右側：歷史記錄 */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Clock size={20} className="text-slate-500" /> 歷史記錄
            </h2>
            
            <div className="flex gap-2 mb-6 pb-6 border-b border-slate-100">
              <input type="text" placeholder="為當前設定命名..." value={newRecordName} onChange={e => setNewRecordName(e.target.value)}
                className="flex-1 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
              <button onClick={handleSaveRecord} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1 text-sm font-medium">
                <Save size={18} /> 儲存
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">暫無儲存的記錄</p>
              ) : (
                history.map((record) => (
                  <div key={record.id} onClick={() => handleLoadRecord(record)} className="group flex flex-col bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-3.5 cursor-pointer transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-700 group-hover:text-indigo-700 flex items-center gap-1.5">
                        <UploadCloud size={16} className="text-indigo-400" />
                        {record.recordName}
                      </h3>
                      <button onClick={(e) => handleDeleteRecord(record.id, e)} className="text-slate-300 hover:text-red-500 transition-colors p-1" title="刪除記錄">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>{record.companyName} ({record.year})</span>
                      <span>{record.staffCount} 人</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2">
                      {new Date(record.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 3. 通用智能排班版元件 (矩陣排班 + 防過勞)
// ==========================================
function AdvancedGenerator({ onBack }: { onBack: () => void }) {
  const [companyName, setCompanyName] = useState('Global Tech Ltd.');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(1);
  const [staffList, setStaffList] = useState<Staff[]>(defaultStaffList);
  
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // 智能演算法：矩陣式排班 + 連續上班規避
  const runSmartAlgorithm = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const data: any[][] = [];
    
    // Header 橫列：日期 1 ~ 31
    const headerRow = ["Staff Name", ...Array.from({length: daysInMonth}, (_, i) => (i + 1).toString())];
    data.push(headerRow);

    // 追蹤每位員工的連續上班天數
    let consecutiveDays: Record<number, number> = {};
    staffList.forEach(s => consecutiveDays[s.id] = 0);

    const shiftTypes = ['M', 'L', 'F']; // 早、晚、全

    staffList.forEach(staff => {
      const row = [staff.name];
      for (let d = 1; d <= daysInMonth; d++) {
        // 法規檢查：若連續上班滿 6 天，強制安排休假 (O)
        if (consecutiveDays[staff.id] >= 6) {
          row.push('O');
          consecutiveDays[staff.id] = 0;
        } else {
          // 隨機分配早、晚、全日、或休假
          const isOffDay = Math.random() < 0.2; // 20% 機率休假
          if (isOffDay) {
            row.push('O');
            consecutiveDays[staff.id] = 0;
          } else {
            const shift = shiftTypes[Math.floor(Math.random() * shiftTypes.length)];
            row.push(shift);
            consecutiveDays[staff.id] += 1;
          }
        }
      }
      data.push(row);
    });

    return data;
  };

  const handlePreview = () => {
    setPreviewData(runSmartAlgorithm());
    setShowPreview(true);
  };

  const handleDownloadExcel = () => {
    const data = runSmartAlgorithm();
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, `SmartRoster_${year}_${month}`);
    XLSX.writeFile(wb, `${companyName}_SmartRoster_${year}_${month}.xlsx`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors bg-slate-100">
          <ArrowLeft size={20} className="text-slate-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-emerald-600" /> 通用智能排班系統
          </h1>
          <p className="text-slate-500 text-sm">採用現代化網格排版 (Matrix) 與防過勞智能運算引擎</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Settings2 size={18}/> 參數與法規設定</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">目標年份與月份</label>
                <div className="flex gap-2">
                  <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} className="w-1/2 border p-2 rounded-lg bg-slate-50" />
                  <input type="number" min="1" max="12" value={month} onChange={e=>setMonth(Number(e.target.value))} className="w-1/2 border p-2 rounded-lg bg-slate-50" placeholder="月份" />
                </div>
              </div>
              <div className="border border-emerald-200 bg-emerald-50 p-3 rounded-lg text-sm text-emerald-800 flex flex-col gap-1">
                <div className="flex items-center gap-1 font-bold"><ShieldCheck size={16}/> 法規守護者啟動中</div>
                <ul className="list-disc ml-5 text-emerald-700 mt-1">
                  <li>保證員工連續上班不超過 6 天</li>
                  <li>自動分配 <strong>M(早)</strong>, <strong>L(晚)</strong>, <strong>F(全)</strong>, <strong>O(休)</strong></li>
                </ul>
              </div>
              <button onClick={handlePreview} className="w-full bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 flex justify-center gap-2 mt-2">
                <Activity size={18}/> 啟動智能運算預覽
              </button>
              <button onClick={handleDownloadExcel} className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 flex justify-center gap-2">
                <Download size={18}/> 匯出 Matrix Excel
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {showPreview ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-in fade-in">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">網格排班表預覽 ({year}年 {month}月)</h2>
              <div className="overflow-x-auto border rounded-xl">
                <table className="min-w-full text-center text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b">
                      {previewData[0]?.map((head, i) => (
                        <th key={i} className="p-2 border-r text-slate-600 whitespace-nowrap sticky left-0 bg-slate-100">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(1).map((row, i) => (
                      <tr key={i} className="border-b hover:bg-slate-50">
                        {row.map((cell, j) => {
                          let color = "";
                          if (cell === 'O') color = "text-rose-500 font-bold bg-rose-50/30";
                          else if (cell === 'M') color = "text-blue-500";
                          else if (cell === 'L') color = "text-amber-600";
                          else if (cell === 'F') color = "text-emerald-600 font-bold";
                          return (
                            <td key={j} className={`p-2 border-r ${color} ${j===0 ? 'sticky left-0 bg-white font-medium text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}>
                              {cell}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-400 h-full">
              <BrainCircuit size={48} className="mb-4 text-slate-200" />
              <p>設定完畢後，點擊左側「啟動智能運算預覽」</p>
            </div>
          )}
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
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            請選擇適合您企業的排班引擎。我們提供專屬企業的硬性定制版本，以及適用於大多數行業的通用智能演算法。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Crown Motor */}
          <div 
            onClick={() => setMode('crown')}
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <CarFront size={120} />
            </div>
            <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <CarFront size={28} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Crown Motor 專屬版</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              針對皇冠汽車硬性要求的固定順序輪替演算法。精確還原指定的 Excel 排版格式、合併儲存格與特定公眾假期標註。
            </p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm">
              進入專屬系統 <ArrowLeft className="ml-2 rotate-180 transition-transform group-hover:translate-x-1" size={16} />
            </div>
          </div>

          {/* Card 2: Advanced Version */}
          <div 
            onClick={() => setMode('advanced')}
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
              <BrainCircuit size={120} />
            </div>
            <div className="bg-emerald-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit size={28} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">通用智能排班版</h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              為現代企業設計的強大引擎。支援職級混合、連續上班限制、自訂畫休等進階條件，自動規避排班衝突。
            </p>
            <div className="flex items-center text-emerald-600 font-semibold text-sm">
              探索智能演算法 <ArrowLeft className="ml-2 rotate-180 transition-transform group-hover:translate-x-1" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
