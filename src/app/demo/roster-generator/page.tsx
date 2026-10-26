"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Save, Trash2, Clock, Download, Eye, UploadCloud, Users, Calendar, Building2 } from 'lucide-react';

interface Staff {
  id: number;
  name: string;
  q2: number;
  q3: number;
  q4: number;
}

interface HistoryRecord {
  id: string;
  recordName: string;
  companyName: string;
  year: number;
  staffCount: number;
  staffList: Staff[];
  timestamp: number;
}

export default function RosterGenerator() {
  // --- 狀態管理 ---
  const [companyName, setCompanyName] = useState('My Company');
  const [year, setYear] = useState(2026);
  const [staffCount, setStaffCount] = useState(10);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [newRecordName, setNewRecordName] = useState('');

  // 初始化預設名單 & 讀取本地歷史記錄
  useEffect(() => {
    initDefaultStaff(10);
    const savedHistory = localStorage.getItem('rosterHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("載入歷史記錄失敗");
      }
    }
  }, []);

  const initDefaultStaff = (count: number) => {
    setStaffList(Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Staff ${String.fromCharCode(65 + i)}`,
      q2: 1, q3: 1, q4: 1,
    })));
  };

  // --- 歷史記錄功能 ---
  const handleSaveRecord = () => {
    if (!newRecordName.trim()) {
      alert("請輸入記錄名稱！");
      return;
    }
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      recordName: newRecordName,
      companyName,
      year,
      staffCount,
      staffList: [...staffList],
      timestamp: Date.now(),
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('rosterHistory', JSON.stringify(updatedHistory));
    setNewRecordName('');
    alert("已成功儲存記錄！");
  };

  const handleLoadRecord = (record: HistoryRecord) => {
    setCompanyName(record.companyName);
    setYear(record.year);
    setStaffCount(record.staffCount);
    setStaffList([...record.staffList]);
    setShowPreview(false);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 避免觸發導入
    if (confirm("確定要刪除這筆記錄嗎？")) {
      const updatedHistory = history.filter(r => r.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('rosterHistory', JSON.stringify(updatedHistory));
    }
  };

  // --- 表單處理 ---
  const handleStaffCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 0;
    setStaffCount(count);
    const newList = Array.from({ length: count }, (_, i) => {
      return staffList[i] || { id: i + 1, name: `Staff ${i + 1}`, q2: 1, q3: 1, q4: 1 };
    });
    setStaffList(newList);
    setShowPreview(false);
  };

  const handleStaffNameChange = (index: number, newName: string) => {
    const updated = [...staffList];
    updated[index].name = newName;
    setStaffList(updated);
    setShowPreview(false);
  };

  // --- 預覽與匯出邏輯 (與原版相同，優化了排版) ---
  const generateMasterData = () => {
    const masterData: any[][] = [];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const holidays: Record<string, string> = {
      "1-JAN": "New Year Day", "17-FEB": "農曆年初一", "18-FEB": "農曆年初二", "19-FEB": "農曆年初三",
      "3-APR": "Good Friday", "4-APR": "Holy Saturday", "5-APR": "Easter Sun", "6-APR": "Easter Monday",
      "1-MAY": "Labor Day", "1-JUL": "HKSAR Day", "1-OCT": "National Day", "25-DEC": "Christmas Day"
    };

    months.forEach((mName, mIdx) => {
      masterData.push(["", "", "", `DUTY ROSTER FOR ${mName} ${year}`]);
      masterData.push(["", "SUN & HOLIDAY 10:00-19:00", "", "", "", "MON - SAT 09:00-19:00"]);
      masterData.push([]);

      const daysInMonth = new Date(year, mIdx + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, mIdx, d);
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dateKey = `${d}-${mName}`;
        const isHoliday = holidays[dateKey];
        
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
      for(let i=0; i<Math.ceil(staffCount/2); i++) {
         const leftStaff = staffList[i];
         const rightStaff = staffList[i + Math.ceil(staffCount/2)];
         masterData.push([
             leftStaff ? leftStaff.id : "", leftStaff ? leftStaff.name : "", "", 
             rightStaff ? rightStaff.id : "", rightStaff ? rightStaff.name : ""
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
    const settingsData = [
      ["Company", companyName, "Year", year], [],
      ["ID", "Staff Name", "Q2 抽籤", "Q3 抽籤", "Q4 抽籤"],
      ...staffList.map(s => [s.id, s.name, s.q2, s.q3, s.q4])
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(settingsData), "Settings");

    const wsMaster = XLSX.utils.aoa_to_sheet(generateMasterData()); // 直接生成最新數據
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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* 左側：設定與操作區 */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-indigo-600" /> 智能編更表產生器
              </h1>
              <p className="text-slate-500 mt-1 text-sm">快速配置人員、預覽排班並匯出專業 Excel 報表</p>
            </div>
          </div>

          {/* 基本設定卡片 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Building2 size={20} className="text-slate-500" /> 基本資料
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">公司名稱</label>
                <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">排班年份</label>
                <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value) || 2026)}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">員工數量</label>
                <input type="number" min="1" max="30" value={staffCount} onChange={handleStaffCountChange}
                       className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50 focus:bg-white" />
              </div>
            </div>
          </div>

          {/* 員工名單卡片 */}
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

          {/* 操作按鈕 */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <button onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all">
              <Eye size={20} /> 預覽報表
            </button>
            <button onClick={handleDownloadExcel}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md transition-transform transform hover:scale-[1.02]">
              <Download size={20} /> 直接匯出 Excel
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
                          let bg = "bg-white";
                          let textStyle = "text-slate-600";
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

        {/* 右側：歷史記錄面板 */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-6">
            <h2 className="text-lg font-semibold mb-5 flex items-center gap-2 text-slate-800">
              <Clock size={20} className="text-slate-500" /> 歷史記錄
            </h2>
            
            {/* 儲存區塊 */}
            <div className="flex gap-2 mb-6 pb-6 border-b border-slate-100">
              <input 
                type="text" 
                placeholder="為當前設定命名..." 
                value={newRecordName}
                onChange={e => setNewRecordName(e.target.value)}
                className="flex-1 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
              />
              <button 
                onClick={handleSaveRecord}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Save size={18} /> 儲存
              </button>
            </div>

            {/* 歷史列表 */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {history.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-8">暫無儲存的記錄</p>
              ) : (
                history.map((record) => (
                  <div 
                    key={record.id} 
                    onClick={() => handleLoadRecord(record)}
                    className="group flex flex-col bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl p-3.5 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-slate-700 group-hover:text-indigo-700 flex items-center gap-1.5">
                        <UploadCloud size={16} className="text-indigo-400" />
                        {record.recordName}
                      </h3>
                      <button 
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                        title="刪除記錄"
                      >
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
