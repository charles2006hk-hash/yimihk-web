"use client";

import { useEffect, useMemo, useState } from "react";

// Styles are scoped under .virginia-plan so they never leak onto the host site.
// Copy this file to: src/app/demo/virginia-university/page.tsx
const CSS = `
.virginia-plan{--paper:#fbfbf9;--surface:#fff;--surface-2:#f3f3ee;--ink:#1c2430;--ink-2:#46536a;--ink-3:#6d7a89;--line:#dde0d8;--accent:#8a2d4b;--accent-soft:#f7e6ec;--teal:#1f5c50;--teal-soft:#e4f0ea;--warn:#96650d;--warn-soft:#f8efdb;--bad:#a32525;--bad-soft:#f9e7e5;--shadow:0 1px 2px rgba(28,36,48,.06),0 8px 24px -12px rgba(28,36,48,.18);background:var(--paper);color:var(--ink);font-family:"Noto Sans TC",-apple-system,"PingFang TC","Microsoft JhengHei",sans-serif;font-size:16px;line-height:1.75;-webkit-font-smoothing:antialiased}
.virginia-plan .wrap{max-width:920px;margin:0 auto;padding:0 20px 72px}
.virginia-plan header.masthead{padding:44px 0 8px;border-bottom:3px solid var(--ink)}
.virginia-plan .doc-meta{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;color:var(--ink-2);letter-spacing:.04em;margin-bottom:18px}
.virginia-plan .doc-meta b{color:var(--ink)}
.virginia-plan h1{font-family:"Noto Serif TC",serif;font-weight:900;font-size:clamp(30px,6vw,46px);line-height:1.25;margin:0 0 14px}
.virginia-plan .lede{font-size:17px;color:var(--ink-2);max-width:46em;margin:0 0 26px}
.virginia-plan .lede b{color:var(--ink)}
.virginia-plan .next-box{border:1px solid var(--line);border-top:4px solid var(--accent);background:var(--surface);padding:20px 22px;box-shadow:var(--shadow);margin:26px 0 6px}
.virginia-plan .next-box .k{font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--accent)}
.virginia-plan .next-box .date{font-family:"Noto Serif TC",serif;font-size:clamp(34px,6vw,52px);font-weight:900;line-height:1.1;color:var(--accent)}
.virginia-plan .next-box h3{font-size:20px;margin:6px 0 4px;line-height:1.5}
.virginia-plan .next-box p{font-size:14.5px;color:var(--ink-2);margin:0}
.virginia-plan .verdicts{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0 6px}
.virginia-plan .verdict{border:1px solid var(--line);border-top:4px solid var(--ink);background:var(--surface);padding:16px 18px 14px;box-shadow:var(--shadow)}
.virginia-plan .verdict.v-accent{border-top-color:var(--accent)}.virginia-plan .verdict.v-teal{border-top-color:var(--teal)}.virginia-plan .verdict.v-warn{border-top-color:var(--warn)}
.virginia-plan .verdict .tag{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.08em;padding:2px 9px;border-radius:999px;margin-bottom:8px}
.virginia-plan .v-accent .tag{background:var(--accent-soft);color:var(--accent)}.virginia-plan .v-teal .tag{background:var(--teal-soft);color:var(--teal)}.virginia-plan .v-warn .tag{background:var(--warn-soft);color:var(--warn)}
.virginia-plan .verdict h3{font-size:16.5px;margin:0 0 6px;line-height:1.5}.virginia-plan .verdict p{font-size:14px;color:var(--ink-2);margin:0;line-height:1.65}
.virginia-plan nav.toc{margin:30px 0 4px;padding:18px 20px;background:var(--surface-2);border:1px solid var(--line)}
.virginia-plan nav.toc h2{font-size:13px;letter-spacing:.12em;margin:0 0 10px;color:var(--ink-2)}
.virginia-plan nav.toc ol{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:4px 28px}
.virginia-plan nav.toc a{color:var(--ink);text-decoration:none;font-size:15px;display:flex;gap:10px;padding:3px 0}.virginia-plan nav.toc a:hover{color:var(--accent)}
.virginia-plan nav.toc a .no{color:var(--accent);font-weight:700;font-size:13.5px;padding-top:2px}
.virginia-plan section{margin-top:52px}
.virginia-plan section>h2{font-family:"Noto Serif TC",serif;font-weight:900;font-size:clamp(23px,4.4vw,30px);line-height:1.35;margin:0 0 6px;display:flex;gap:14px;align-items:baseline}
.virginia-plan section>h2 .no{color:var(--accent);font-size:.72em;font-weight:600}
.virginia-plan .sec-sub{color:var(--ink-2);margin:0 0 20px;font-size:15.5px}
.virginia-plan p{margin:0 0 14px}.virginia-plan ul,.virginia-plan ol.plain{margin:0 0 16px;padding-left:1.35em}.virginia-plan li{margin-bottom:7px}.virginia-plan li::marker{color:var(--accent)}
.virginia-plan a{color:var(--accent)}.virginia-plan .src{color:var(--ink-3);font-size:13px}
.virginia-plan .filters{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0 6px}
.virginia-plan .filters button{border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:6px 14px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit}
.virginia-plan .filters button.on{border-color:var(--ink);background:var(--ink);color:var(--paper)}
.virginia-plan .scheme{border-bottom:1px solid var(--line);padding:18px 0}
.virginia-plan .scheme-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}
.virginia-plan .scheme-head h3{font-family:"Noto Serif TC",serif;font-size:18px;font-weight:700;margin:0}
.virginia-plan .scheme-head .kind{font-size:12px;color:var(--ink-3)}
.virginia-plan .stamp{margin-left:auto;display:inline-block;padding:2px 9px;font-size:12px;font-weight:600;background:var(--teal-soft);color:var(--teal);white-space:nowrap}
.virginia-plan .stamp.urgent{background:var(--accent);color:#fff}.virginia-plan .stamp.pending{background:transparent;border:1px dashed var(--ink-3);color:var(--ink-3)}
.virginia-plan .scheme .sname{font-size:14.5px;font-weight:500;margin:4px 0 0}
.virginia-plan .scheme .deadline{font-size:14px;margin:2px 0 0}.virginia-plan .scheme .deadline.confirmed{font-weight:600;color:var(--accent)}.virginia-plan .scheme .deadline.dim{color:var(--ink-3)}
.virginia-plan .scheme .academic{font-size:14px;color:var(--teal);margin:2px 0 0}
.virginia-plan .scheme .toggle{background:none;border:none;padding:0;margin-top:8px;font-size:14px;font-weight:500;color:var(--accent);text-decoration:underline;text-underline-offset:4px;cursor:pointer;font-family:inherit}
.virginia-plan .scheme .detail{margin-top:12px;background:var(--surface-2);padding:14px 16px;font-size:14.5px;line-height:1.7}
.virginia-plan .scheme .detail h4{font-size:12px;letter-spacing:.08em;color:var(--ink-2);margin:12px 0 4px}.virginia-plan .scheme .detail h4:first-child{margin-top:0}
.virginia-plan .timeline{list-style:none;margin:0;padding:0}
.virginia-plan .timeline li{display:flex;gap:14px;border-bottom:1px solid var(--line);padding:12px 0;margin:0}
.virginia-plan .timeline li.past{opacity:.45}
.virginia-plan .timeline .when{width:84px;flex-shrink:0}.virginia-plan .timeline .when b{display:block;font-family:"Noto Serif TC",serif;font-size:16px;line-height:1.3}
.virginia-plan .timeline .when span{font-size:12px;color:var(--ink-3)}
.virginia-plan .timeline .what b{font-size:14.5px}.virginia-plan .timeline .what p{font-size:14px;color:var(--ink-2);margin:2px 0 0}
.virginia-plan .timeline .cat{font-size:12px;color:var(--ink-3)}
.virginia-plan .badge-next{display:inline-block;margin-left:8px;background:var(--accent);color:#fff;font-size:11px;font-weight:700;padding:1px 7px;vertical-align:2px}
.virginia-plan .progress{height:8px;background:var(--surface-2);margin:14px 0 4px}.virginia-plan .progress i{display:block;height:100%;background:var(--teal)}
.virginia-plan .check-sec{font-size:13px;font-weight:700;letter-spacing:.08em;color:var(--ink-2);margin:26px 0 4px}
.virginia-plan .check-list{list-style:none;margin:0;padding:0}
.virginia-plan .check-list li{border-bottom:1px solid var(--line);margin:0}
.virginia-plan .check-list label{display:flex;gap:12px;align-items:flex-start;padding:12px 0;cursor:pointer}
.virginia-plan .check-list input{width:20px;height:20px;margin-top:3px;flex-shrink:0;accent-color:#1f5c50}
.virginia-plan .check-list .lab{display:block;font-size:14.5px;font-weight:500}.virginia-plan .check-list .lab.done{color:var(--ink-3);text-decoration:line-through}
.virginia-plan .check-list .det{display:block;font-size:14px;color:var(--ink-2);margin-top:2px}
.virginia-plan .rule{border-left:4px solid var(--accent);background:var(--surface);padding:10px 14px;font-size:14.5px;line-height:1.7;margin-bottom:12px}
.virginia-plan .callout{border:1px solid var(--line);padding:16px 20px 8px;margin:20px 0;background:var(--surface)}
.virginia-plan .callout.amber{background:var(--warn-soft);border-color:transparent}.virginia-plan .callout h4{margin:0 0 8px;font-size:16px}.virginia-plan .callout p,.virginia-plan .callout li{font-size:15px}
.virginia-plan footer.foot{margin-top:60px;border-top:3px solid var(--ink);padding-top:18px;font-size:13px;color:var(--ink-2);line-height:1.7}
@media (prefers-color-scheme:dark){.virginia-plan{--paper:#14181e;--surface:#1c2129;--surface-2:#232933;--ink:#e9ebee;--ink-2:#b3bccb;--ink-3:#8b96a8;--line:#333c49;--accent:#e59ab5;--accent-soft:#33222a;--teal:#6fc7a4;--teal-soft:#1d2f28;--warn:#e0b45e;--warn-soft:#332b18;--bad:#ef9a94;--bad-soft:#352121;--shadow:0 1px 2px rgba(0,0,0,.3),0 8px 24px -12px rgba(0,0,0,.5)}}
@media (max-width:760px){.virginia-plan .verdicts{grid-template-columns:1fr}.virginia-plan nav.toc ol{grid-template-columns:1fr}.virginia-plan .stamp{margin-left:0}}
`;

type Scheme = {
  id: string; institution: string; name: string; kind: string;
  route: "direct" | "nomination" | "either" | "na";
  deadlineText: string; deadlineDate: string | null;
  status: "confirmed" | "pending" | "pattern";
  academic: string | null; notes: string; documents: string[];
  sourceUrl: string; verified: string;
};

const SCHEMES: Scheme[] = [
  { id: "cityu-saas", institution: "城市大學 CityUHK", name: "Student Athletes Admission Scheme (SAAS)", kind: "取錄計劃", route: "direct",
    deadlineText: "第一批：2026年11月11日（星期三）23:59（JUPAS 及非 JUPAS）；第二批：2027年1月8日（只限非 JUPAS）；第三批：2027年2月12日（JUPAS 及非 JUPAS）", deadlineDate: "2026-11-11", status: "confirmed", academic: null,
    notes: "由學生發展事務處（SDS）統籌。學生經網上表格（Qualtrics）直接申請，文件以掃描 PDF 上載。2027 入學共三批（據城大官方《SAAS Application Reminders》2026年9月29日更新版）：第一批 2026年11月11日 23:59 截止，面試 2026年12月1–2日；第二批 2027年1月8日，只限非 JUPAS；第三批 2027年2月12日，JUPAS 及非 JUPAS 均可 — 第一批趕唔切，JUPAS 申請人仲有第三批做後備。JUPAS 選科要求：提名課程須在 JUPAS 選科內，官方寫明「preferably in band A1 category」— 最好放 Band A1，唔係必要條件。",
    documents: ["推薦信（體院 HKSI／體育總會／體育會／學校）", "運動成就證明文件", "履歷 CV", "學校成績表／學業成績單／HKDSE 成績（如適用）", "JUPAS 選科／非 JUPAS 申請紀錄"],
    sourceUrl: "https://www.cityu.edu.hk/sds/physical-education-wellness-and-sports/student-athletes-admission", verified: "verified live" },
  { id: "cityu-salsa", institution: "城市大學 CityUHK", name: "Student-Athlete Learning Support and Admission (SALSA) Scheme", kind: "取錄計劃", route: "direct",
    deadlineText: "優先輪：2026年11月30日；申請期 2026年9月至2027年3月初", deadlineDate: "2026-11-30", status: "confirmed", academic: "無最低學業或年齡要求",
    notes: "資格：體院提名的現役資深精英運動員，或屬認可體育總會、在成人賽事取得 Elite Vote (EV) Point 3 或以上（少年錦標賽不計）；須合資格代表香港出戰國際總會認可賽事。學生經網上表格直接申請，最多 3 個課程選擇。甄選看運動水平、面試／測試及英語能力。",
    documents: ["履歷 CV", "最新學校成績表／學業成績單", "體院／體育總會推薦信", "EV Point 3 或以上之運動成就證明"],
    sourceUrl: "https://www.cityu.edu.hk/sds/physical-education-wellness-and-sports/student-athletes-admission/salsa", verified: "verified live" },
  { id: "ugc-salsa", institution: "大學教育資助委員會 UGC", name: "Student-Athlete Learning Support and Admission Scheme (SALSA Scheme)", kind: "全港框架", route: "na",
    deadlineText: "無中央截止日期 — 向各大學各自申請", deadlineDate: null, status: "confirmed", academic: null,
    notes: "2022/23 學年推出；教資會為 8 間資助大學在 2025/26–2027/28 三年期預留 HK$150M（2025/26 約 260 名合資格本科生運動員）。沒有中央申請：每間大學各自設 SALSA 直接取錄渠道、各自的截止日期與提名規則 — 向大學申請，不是向教資會申請。",
    documents: [], sourceUrl: "https://www.ugc.edu.hk/eng/ugc/activity/salsa_scheme.html", verified: "index" },
  { id: "hku-tadas", institution: "香港大學 HKU", name: "Top Athletes Direct Admission Scheme (TADAS)", kind: "取錄計劃", route: "nomination",
    deadlineText: "2027 入學日期未公佈（2026 週期：2025年12月7日 23:59 截止）", deadlineDate: null, status: "pending", academic: "整體評核 — 學業成績未必是主要考慮；所有入圍者均須面試",
    notes: "必須由香港體育學院或同等體育總會提名，提名經計劃表格遞交。甄選看運動排名證據、比賽級別（本地／全國／國際）、教練推薦、港大面試及個人陳述。經 TADAS 取錄而又符合 SALSA 資格者，可獲 SALSA 資助／支援。另設 Sports Scholarship Scheme（1995 年起）— 是獎學金／支援，不是入學途徑。衝突：TADAS 申請人不可同時經 JUPAS 校長推薦計劃（SPN）或學校推薦直接取錄計劃（SNDAS）申請入學。查詢：tadas@hku.hk。",
    documents: ["運動成就成績", "運動履歷 CV", "推薦信及／或提名信", "個人陳述", "體院／認可體育總會提名信"],
    sourceUrl: "https://admissions.hku.hk/top_athletes_direct_admission_scheme", verified: "verified live" },
  { id: "cuhk-salsa", institution: "中文大學 CUHK", name: "Student-Athlete Learning Support and Admission (SALSA) Scheme", kind: "取錄計劃", route: "either",
    deadlineText: "2027年1月8日 — 自行提名初步申請截止；體院提名者由2026年12月起獲邀交正式申請", deadlineDate: "2027-01-08", status: "confirmed", academic: "按運動才能直接取錄，不按學業成績；修業期最長可延長至 12 年",
    notes: "初步申請 2026年10月2日開放。兩條途徑：(a) 體院提名 → 中大由 2026年12月起邀請提名者交正式申請；(b) 自行提名 → 2027年1月8日前經網上提交初步申請。資格：合資格代表香港出戰國際總會認可賽事，且 (i) 獲體院提名，或 (ii) 屬認可總會、EV 達 3 級或以上的現役資深精英運動員（少年成績不計）；面試表現滿意；退役運動員亦合資格。結果通知 2027年3–8月（取錄者繳 HK$5,000 首期接納）。SALSA 取錄生可獲 Sports Scholarship 最高 HK$80,000／年。衝突：SNDAS 提名者不可同時使用 SALSA 計劃。",
    documents: [], sourceUrl: "https://admission.cuhk.edu.hk/application/salsa/eligibility-and-apply-here/", verified: "verified live" },
  { id: "hkust-saas", institution: "科技大學 HKUST", name: "Student Athletes Admissions Scheme (SAAS)（連 SALSA）", kind: "取錄計劃", route: "direct",
    deadlineText: "2027 入學日期未公佈（2026 週期：JUPAS 2026年1月8日；非 JUPAS 早輪 2025年11月20日）", deadlineDate: null, status: "pending", academic: "低於最低入學要求但獲提名／推薦者，按個案考慮",
    notes: "學生經網上 SAAS/SALSA 表格直接申請。資格：本地學生；運動表現達本地／地區／國際水平（包括中國代表隊成員、香港青年軍成員、USFHK 或學界體育聯會成員）；獲體院／知名體育會／體育總會／就讀學校推薦。入圍者須面試。Band A 規則：SAAS 取錄是有條件的 — 課程必須在最終 JUPAS 選科中列入 Band A；取錄在 HKDSE 放榜前公佈。獎學金：學費獎學金最高 HK$44,500／年 + 生活津貼最高 HK$60,000／年（可續）。",
    documents: ["網上 SAAS/SALSA 申請表格", "履歷 CV", "國家／省體育協會、體院或相關體育機構推薦信", "獎項／成就證書副本", "科大本科入學申請（JUPAS 或非 JUPAS）"],
    sourceUrl: "https://join.ust.hk/saas/", verified: "verified live" },
  { id: "polyu-osrs", institution: "理工大學 PolyU", name: "Outstanding Sportsmen Recommendation Scheme (OSRS)（SALSA 為其子計劃）", kind: "取錄計劃", route: "direct",
    deadlineText: "2026年11月1日 09:00 – 11月30日 23:59", deadlineDate: "2026-11-30", status: "confirmed",
    academic: "OSRS：學業門檻不豁免 — 須符合理大一般入學要求及課程要求；SALSA 子計劃：無最低學業或年齡要求",
    notes: "1998 年設立。提交 OSRS 申請者會自動獲考慮 SALSA 子計劃。OSRS 資格：曾參加大型國際賽事或為港隊／青年軍成員；合資格代表香港出戰國際總會認可賽事；面試表現滿意。SALSA 子計劃資格：獲體院提名，或屬認可總會並達 EV Point 3+；合資格代表香港；面試表現滿意。OSRS 冇寫明要 Band A — 將 PolyU 放 A1 唔會為 OSRS 申請加分。查詢：polyu.sports.teams@polyu.edu.hk。",
    documents: ["JUPAS 申請人：中五學校成績", "體院或體育總會推薦信", "個人運動證書", "非 JUPAS 申請人另加：學歷證明（如 HD/AD 成績表）、理大非 JUPAS 申請表副本"],
    sourceUrl: "https://www.polyu.edu.hk/en/sao/counselling-and-wellness-section/sports-development/sports-team/outstanding-sportsmen-recommendation-scheme/", verified: "verified live" },
];

SCHEMES.push(
  { id: "hkbu-tadas", institution: "浸會大學 HKBU", name: "Talented Athletes Direct Admission Scheme (TADAS)", kind: "取錄計劃", route: "direct",
    deadlineText: "2027年1月4日（JUPAS 及非 JUPAS 申請人相同）", deadlineDate: "2027-01-04", status: "confirmed", academic: null,
    notes: "浸大推行教資會 SALSA 的渠道（2016 年的 Elite Athletes Admission Scheme 已於 2022 年由 TADAS 取代）。學生自行申請：下載紙本表格 TADAS-application-form_2027，填妥後電郵至 butadas@hkbu.edu.hk。資格：可正式代表香港出戰地區／國際賽事並有認可排名／成就；獲體院或其他體育總會提名（最好 EV 達 3 級或以上）；或有出色地區／國際成績的退役港隊運動員。甄選看運動排名／成就證據、面試、教練（及前老師）推薦信、自我陳述。衝突：經 SPN 或 SNDAS 提名的學生不合資格申請 TADAS，反之亦然 — 只能選一條途徑。",
    documents: ["紙本申請表 TADAS-application-form_2027（電郵至 butadas@hkbu.edu.hk）", "運動排名／成就證據", "教練推薦信", "自我陳述"],
    sourceUrl: "https://tadas.hkbu.edu.hk/en/admission-and-application/apply-now.html", verified: "verified live" },
  { id: "eduhk-nsea", institution: "教育大學 EdUHK", name: "Nomination Scheme for Elite Athletes (NSEA)", kind: "取錄計劃", route: "nomination",
    deadlineText: "2027 入學提名期未公佈（2026 週期：主輪 2025年12月31日截止；次輪至2026年5月27日）", deadlineDate: null, status: "pending", academic: null,
    notes: "2022/23 學年起，適用於所有教資會資助本科課程，JUPAS 及非 JUPAS 本地申請人均可。由體院或香港奧委會提名（其他認可體育機構按個案）；完成 JUPAS／非 JUPAS 申請後，學生經教大「特別取錄計劃申請系統」遞交 NSEA 申請。JUPAS 申請人必須把目標課程放在 Band A。經 NSEA 取錄者自動獲 SALSA 計劃考慮。",
    documents: ["合併為一個 PDF（上限 4MB）：運動成就證明", "個人陳述（300–500 字）", "推薦信：校長（如有）及體院／奧委會／認可體育機構"],
    sourceUrl: "https://www.apply.eduhk.hk/ug/nsea", verified: "verified live" },
  { id: "eduhk-selfnom", institution: "教育大學 EdUHK", name: "Self-Nomination Admissions Scheme（運動：JS8010 / JS8726）", kind: "取錄計劃", route: "direct",
    deadlineText: "2027 入學提名期未公佈（2026 週期：主輪 2025年12月31日截止；次輪至2026年5月27日）", deadlineDate: null, status: "pending", academic: null,
    notes: "供在音樂、運動、STEAM 或視覺藝術有卓越才能的 JUPAS 申請人自行提名（網上 Qualtrics 表格）。運動課程：JS8010 運動科學及教練榮譽理學士及體育教育榮譽學士、JS8726 運動科學及教練榮譽理學士。準則：課程須為 JUPAS Band A 選擇；運動表現高水平（如體院精英運動員、現役／前港隊成員、現役青年軍、學界／USFHK 傑出學生運動員）；獲體院／奧委會／總會／認可機構／學校推薦（注意：會員證明不等於推薦信）。經 NSEA 或自行提名取錄的精英運動員可獲教大精英運動員學費獎學金 HK$49,500（一次性）。面試在 2 月或 6 月。",
    documents: ["合併為一個 PDF（上限 15MB）：運動成就證明", "個人陳述（300–500 字）", "推薦信"],
    sourceUrl: "https://www.apply.eduhk.hk/ug/selfnom", verified: "verified live" },
  { id: "lingnan-salsa", institution: "嶺南大學 Lingnan", name: "Student-Athlete Learning Support and Admission Scheme (SALSA)", kind: "取錄計劃", route: "nomination",
    deadlineText: "未公佈確實日期 — 網上系統 2026年10月8日開放，提早面試，面試後 1 個月內出結果", deadlineDate: null, status: "pending", academic: null,
    notes: "供代表香港出戰地區／國際賽事的運動員；支援最高 HK$400,000／3 年（學習 + 生活 + 交流）。由體院、體育總會或同等體育機構提名（自行提名按個案考慮）；學生經網上「Apply (SALSA)」連結遞交。宜盡早申請。查詢：學生事務處 (852) 2616 7026、osa-pe@ln.edu.hk。",
    documents: ["個人陳述 + 履歷 CV", "提名機構或相關教練推薦信（如有）", "面試"],
    sourceUrl: "https://www.ln.edu.hk/admissions/ug/apply-now/elite-athletes", verified: "verified live" },
  { id: "lingnan-esea", institution: "嶺南大學 Lingnan", name: "Entrance Scholarships for Elite Athletes (ESEA)", kind: "獎學金", route: "direct",
    deadlineText: "2027年2月28日", deadlineDate: "2027-02-28", status: "confirmed", academic: "學業門檻不豁免 — 須符合大學一般入學及英語要求",
    notes: "2017 年起，本地、內地及海外運動員均可申請；學生經網上「Apply (ESEA)」連結直接申請。獎學金：全額或半額學費（教資會資助標準）+ 相當部分的宿舍費（可續）。查詢：學生事務處 (852) 2616 7026、osa-pe@ln.edu.hk。",
    documents: [], sourceUrl: "https://www.ln.edu.hk/admissions/ug/apply-now/elite-athletes", verified: "verified live" },
  { id: "hkmu-scholarship", institution: "都會大學 HKMU", name: "HKMU Admission Sports Scholarship Scheme", kind: "獎學金", route: "direct",
    deadlineText: "本地：1月31日前／非本地：5月31日前（頁面無標年份；2027/28 學年日期未確認 — 2026/27 週期為 2026年1月31日／5月31日）", deadlineDate: null, status: "pattern", academic: "這是入學獎學金，不是降低分數的取錄計劃；都大是自資院校，不屬教資會 SALSA",
    notes: "學生直接申請，本地及非本地、全日制本科（5 間學院）均可。資格：在本地／地區／全國／國際賽事有出色紀錄（只限全日制榮譽或普通學士課程申請人）；或須面試／提交運動影片。獎學金：本地 HK$80,000／年；非本地 HK$120,000／年 + 免費校外住宿（視供應）；最多 4 個名額；學業及運動表現滿意可續。得獎者須定期訓練並代表都大出戰 USFHK／大專賽事。此校資料只經搜尋索引核實（官方頁面直接讀取被封，HTTP 403），日期屬推算，未經確認。",
    documents: [], sourceUrl: "https://www.hkmu.edu.hk/sao/sch/hkmu-admission-scholarships/", verified: "index" },
);

type Milestone = { date: string; timeText: string | null; title: string; detail: string | null; category: string };
const MILESTONES: Milestone[] = [
  { date: "2026-10-02", timeText: null, title: "中大 SALSA 初步申請開放", detail: "自行提名及體院提名兩條途徑", category: "運動員計劃" },
  { date: "2026-10-07", timeText: "09:00", title: "JUPAS 申請開始", detail: "經 JUPAS 網上系統提交申請及選科（最多 20 個選擇）", category: "JUPAS" },
  { date: "2026-10-07", timeText: null, title: "SNDAS 第六屆提名期開始", detail: "至 2026年12月2日；選 SNDAS 即要放棄港大 TADAS、浸大 TADAS 及中大 SALSA", category: "JUPAS" },
  { date: "2026-10-08", timeText: null, title: "嶺南 SALSA 網上系統開放", detail: "提早面試，面試後 1 個月內出結果 — 宜盡早申請", category: "運動員計劃" },
  { date: "2026-11-01", timeText: "09:00", title: "理大 OSRS 申請期開始", detail: "提交 OSRS 申請者自動獲考慮 SALSA 子計劃", category: "運動員計劃" },
  { date: "2026-11-11", timeText: "23:59", title: "城大 SAAS 第一批提名截止", detail: "Student Athletes Admission Scheme — 學生經網上表格直接申請", category: "運動員計劃" },
  { date: "2026-11-30", timeText: "23:59", title: "理大 OSRS 申請截止", detail: "Outstanding Sportsmen Recommendation Scheme", category: "運動員計劃" },
  { date: "2026-11-30", timeText: null, title: "城大 SALSA 優先輪截止", detail: "申請期延續至 2027年3月初，優先輪在此日截止", category: "運動員計劃" },
  { date: "2026-12-02", timeText: "17:00", title: "JUPAS 申請及選科截止", detail: "同時是殘疾資料及證明文件上載截止；SNDAS 提名期亦於此日結束", category: "JUPAS" },
  { date: "2026-12-04", timeText: "09:00", title: "JUPAS 逾期申請／更新選科期開始", detail: "至 2027年5月26日 17:00；更新選科每次 HK$100", category: "JUPAS" },
  { date: "2027-01-04", timeText: null, title: "浸大 TADAS 截止", detail: "紙本表格電郵至 butadas@hkbu.edu.hk", category: "運動員計劃" },
  { date: "2027-01-08", timeText: null, title: "中大 SALSA 自行提名初步申請截止", detail: "體院提名者由 2026年12月起獲邀交正式申請", category: "運動員計劃" },
  { date: "2027-01-08", timeText: null, title: "城大 SAAS 第二批提名截止", detail: "Student Athletes Admission Scheme 第二批 — 只限非 JUPAS 申請人", category: "運動員計劃" },
  { date: "2027-01-20", timeText: null, title: "JUPAS OEA 及證明文件截止", detail: "Other Experiences and Achievements 及相關證明文件提交截止", category: "JUPAS" },
  { date: "2027-02-12", timeText: null, title: "城大 SAAS 第三批提名截止", detail: "Student Athletes Admission Scheme 第三批 — JUPAS 及非 JUPAS 申請人均可", category: "運動員計劃" },
  { date: "2027-02-28", timeText: null, title: "嶺南 ESEA 精英運動員入學獎學金截止", detail: "Entrance Scholarships for Elite Athletes", category: "運動員計劃" },
  { date: "2027-05-26", timeText: "17:00", title: "JUPAS 更新選科最後截止", detail: "放榜前最後修改選科機會（每次提交 HK$100）", category: "JUPAS" },
  { date: "2027-07-14", timeText: null, title: "HKDSE 放榜", detail: "同日 15:00 起 JUPAS 放榜後改選期開始", category: "DSE" },
  { date: "2027-07-16", timeText: "15:00", title: "JUPAS 放榜後改選期結束", detail: "可增刪／取代最多 5 個課程、重排及刪除選科（免費一次）", category: "JUPAS" },
  { date: "2027-08-04", timeText: null, title: "JUPAS 主輪取錄結果公佈", detail: null, category: "JUPAS" },
];

type CheckItem = { id: string; section: string; label: string; detail: string | null };
const CHECKLIST: CheckItem[] = [
  { id: "doc-cv", section: "核心文件", label: "運動履歷 CV", detail: "城大 SAAS／SALSA、港大 TADAS、科大 SAAS、嶺南 SALSA 均要求" },
  { id: "doc-transcript", section: "核心文件", label: "最新學校成績表／學業成績單", detail: "理大 OSRS（JUPAS 申請人）要中五成績；科大、城大亦要成績表" },
  { id: "doc-achievements", section: "核心文件", label: "運動成就證明（獎狀、成績、排名）", detail: "SALSA 渠道要證明成人賽事 EV Point 3 或以上；少年錦標賽成績不計" },
  { id: "doc-hksi-letter", section: "核心文件", label: "體院 HKSI／體育總會推薦信或提名信", detail: "幾乎所有計劃都要；向總會申請需時數星期，及早辦理。注意：會員證明不等於推薦信（教大明言）" },
  { id: "doc-school-letter", section: "核心文件", label: "學校運動推薦信（Letter of Recommendation）", detail: "Virginia 申請運動員計劃所需的校方推薦信，向 St. Rose of Lima's College 申請" },
  { id: "doc-coach-letter", section: "核心文件", label: "教練推薦信", detail: "浸大 TADAS、嶺南 SALSA 甄選會看教練推薦" },
  { id: "doc-statement", section: "核心文件", label: "個人陳述 Personal Statement", detail: "教大 NSEA／自行提名要求 300–500 字；港大 TADAS、嶺南 SALSA 亦要" },
  { id: "doc-jupas-record", section: "核心文件", label: "JUPAS 選科／申請紀錄", detail: "城大 SAAS 要上載 JUPAS 選科或非 JUPAS 申請紀錄" },
  { id: "sch-cityu-saas", section: "各計劃專屬", label: "城大 SAAS：掃描 PDF 上載至網上表格", detail: "推薦信、成就證明、CV、成績表、JUPAS 紀錄 — 第一批 11月11日 23:59 前；第三批（JUPAS 亦可）2027年2月12日" },
  { id: "sch-polyu", section: "各計劃專屬", label: "理大 OSRS：中五成績 + 總會推薦信 + 個人運動證書", detail: "申請期 11月1日 09:00 至 11月30日 23:59" },
  { id: "sch-hkbu-form", section: "各計劃專屬", label: "浸大 TADAS：紙本表格電郵 butadas@hkbu.edu.hk", detail: "下載 TADAS-application-form_2027 填妥電郵遞交 — 2027年1月4日截止" },
  { id: "sch-eduhk-nsea", section: "各計劃專屬", label: "教大 NSEA：文件合併成一個 PDF（上限 4MB）", detail: "成就證明 + 個人陳述 + 校長及體院／奧委會推薦信；目標課程須放 JUPAS Band A" },
  { id: "sch-eduhk-selfnom", section: "各計劃專屬", label: "教大自行提名：一個 PDF（上限 15MB）", detail: "成就證明 + 個人陳述 + 推薦信；JS8010／JS8726 須放 Band A" },
  { id: "sch-band-a", section: "各計劃專屬", label: "目標課程放入 JUPAS Band A", detail: "教大 NSEA／自行提名強制；科大 SAAS 取錄只在課程最終列入 Band A 時才生效" },
  { id: "sch-hku-nomination", section: "各計劃專屬", label: "港大 TADAS：先落實體院／總會提名", detail: "提名制 — 先同教練／總會商量，由提名機構經計劃表格遞交" },
  { id: "jupas-fee", section: "JUPAS", label: "完成 JUPAS 帳戶申請並繳費 HK$500", detail: "帳戶要喺同一部掃過 QR code 嘅手機完成；費用未繳交申請不算完成" },
  { id: "jupas-choices", section: "JUPAS", label: "12月2日 17:00 前提交申請及 20 個選科排序", detail: "逾期申請期 12月4日至 2027年1月13日，費用 HK$1,000" },
  { id: "jupas-oea", section: "JUPAS", label: "OEA 及證明文件：2027年1月20日前提交", detail: "Other Experiences and Achievements — 運動成就可在此部分呈交" },
  { id: "route-decision", section: "JUPAS", label: "12月初前決定途徑：SNDAS／SPN 與運動員計劃互斥", detail: "選 SNDAS 即不可用港大 TADAS、浸大 TADAS、中大 SALSA；SNDAS 提名期至 12月2日" },
];

const TIPS: string[] = [
  "目標：成人賽事 EV Point 3 或以上。SALSA 渠道（城大、理大、中大、浸大）的門檻是成人賽事 EV Point 3+ — 例如亞錦賽、全運會、世界大學生運動會、亞洲盃決賽、世界盃系列賽、亞運、世界盃決賽、奧運、世錦賽排 4–8 名（或前三分之一），或亞洲盃系列賽／全國錦標賽／亞洲室內暨武藝運動會獎牌。少年錦標賽成績一律不計。若 EV3 未達標，科大 SAAS 門檻較寬（本地／地區／國際，包括學界級別運動員）可作後備。",
  "及早安排體院／總會／奧委會推薦或提名信。幾乎每個計劃都要；教大明言「會員證明不等於推薦信」— 要一封正式簽署的信，預留數星期給總會辦理。",
  "目標課程放入 JUPAS Band A。教大 NSEA 及自行提名強制要求；科大 SAAS 的取錄只在課程最終列入 Band A 時生效；城大 SAAS 亦要交 JUPAS 選科紀錄。城大 SAAS 官方只寫 preferably Band A1 — 係偏好，唔係必要條件，所以 A1 嗰格應該俾最想入嗰個課程。",
  "2026年10–11月就申請，不要等 DSE 成績。最早的硬死線是城大 SAAS（11月11日）、理大 OSRS（11月30日）及城大 SALSA 優先輪（11月30日）。大部分計劃在放榜前已出取錄，科大和中大明言如此。",
  "按運動員背景揀渠道，並留意學業門檻分別。提名制途徑（港大 TADAS、教大 NSEA、嶺南 SALSA、中大體院途徑）要體院／總會先行動 — 現在就同教練／總會傾。直接申請途徑在學生自己手上。學業門檻：SALSA 渠道豁免學業最低要求；理大 OSRS、嶺南 ESEA 不豁免。",
];

const PARALLEL_RULES: string[] = [
  "可並行：SAAS／SALSA 申請一般與正常 JUPAS 申請並行（城大 SAAS 要交 JUPAS 選科紀錄；教大 NSEA 要同時有 JUPAS／非 JUPAS 申請並把課程放 Band A；科大 SAAS 取錄建基於 JUPAS 選科之上）。研究未發現任何官方頁面禁止同時申請多間大學的運動員計劃。",
  "明確衝突（不可同時）：港大 — TADAS 申請人不可同時經 SPN（JUPAS）或 SNDAS 申請；浸大 — 經 SPN 或 SNDAS 提名者不合資格申請 TADAS，反之亦然，只能選一條途徑；中大 — SNDAS 提名者不可同時使用 SALSA 計劃。",
  "自動綑綁：理大 OSRS 申請人自動獲考慮 SALSA；教大 NSEA 取錄生自動獲 SALSA 考慮；港大 TADAS 取錄生如符合 SALSA 資格，可獲 SALSA 資助／支援。",
  "時間提醒：SNDAS 第六屆提名期為 2026年10月7日至12月2日 — 選 SNDAS 的運動員要放棄港大 TADAS、浸大 TADAS 及中大 SALSA，所以要在 2026年12月初前決定途徑。",
];

const OPEN_QUESTIONS: string[] = [
  "港大 TADAS 2027 週期日期 — 官方頁面在 2026年10月14日仍顯示 2026 週期（2025年12月7日截止）。",
  "科大 SAAS 2027 週期日期 — 頁面仍參照 2025 入學年度；只有 2026 週期模式（JUPAS 截止 2026年1月8日）有記錄。",
  "教大 NSEA 及自行提名 2027 日期 — 2026年10月14日實查確認頁面仍顯示 2026 週期（主輪 2025年12月31日截止）。",
  "嶺南 SALSA 確實截止日期 — 只公佈了系統開放日（2026年10月8日）及滾動式提早面試；ESEA 的 2027年2月28日已確認。",
  "都大 2027/28 運動獎學金日期 — 頁面直接讀取被封（HTTP 403）；只確認了「1月31日前」（本地）／「5月31日前」（非本地）的月日模式及 2026/27 日期。",
  "中大 Sports Scholarship Scheme 運作詳情 — 只從二手來源確認是獨立命名的計劃（2001 年起）；招生頁面無申請詳情。",
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
function hktToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Hong_Kong", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}
function daysBetween(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00+08:00").getTime();
  const b = new Date(toISO + "T00:00:00+08:00").getTime();
  return Math.round((b - a) / 86400000);
}
function fmtDate(iso: string) {
  const parts = iso.split("-"); const y = parts[0] ?? "2026"; const m = parts[1] ?? "1"; const d = parts[2] ?? "1";
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return { md: Number(m) + "月" + Number(d) + "日", weekday: "星期" + (WEEKDAYS[dt.getDay()] ?? ""), full: y + "年" + Number(m) + "月" + Number(d) + "日" };
}
function routeLabel(route: string): string {
  if (route === "direct") return "直接申請";
  if (route === "nomination") return "提名制";
  if (route === "either") return "提名或自行提名";
  return "—";
}

function SchemeCard({ scheme, today }: { scheme: Scheme; today: string }) {
  const [open, setOpen] = useState(false);
  const days = scheme.deadlineDate ? daysBetween(today, scheme.deadlineDate) : null;
  const urgent = days !== null && days >= 0 && days <= 14;
  return (
    <article className="scheme">
      <div className="scheme-head">
        <h3>{scheme.institution}</h3>
        <span className="kind">{scheme.kind}</span>
        <span className="kind">{routeLabel(scheme.route)}</span>
        {scheme.status !== "confirmed" ? (
          <span className="stamp pending">{scheme.status === "pattern" ? "日期模式推算 · 未確認" : "2027 日期未公佈"}</span>
        ) : (
          <span className={"stamp" + (urgent ? " urgent" : "")}>
            截止 {scheme.deadlineDate ? fmtDate(scheme.deadlineDate).md : ""}
            {days !== null && days >= 0 ? " · 仲有 " + days + " 日" : ""}
            {days !== null && days < 0 ? " · 已過" : ""}
          </span>
        )}
      </div>
      <p className="sname">{scheme.name}</p>
      <p className={"deadline " + (scheme.status === "confirmed" ? "confirmed" : "dim")}>{scheme.deadlineText}</p>
      {scheme.academic ? <p className="academic">學業門檻：{scheme.academic}</p> : null}
      <button type="button" className="toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? "收起詳情" : "詳情・所需文件・官方連結"}
      </button>
      {open ? (
        <div className="detail">
          <p style={{ margin: 0 }}>{scheme.notes}</p>
          {scheme.documents.length > 0 ? (
            <>
              <h4>所需文件</h4>
              <ul style={{ margin: 0, paddingLeft: "1.3em" }}>
                {scheme.documents.map((d) => (<li key={d}>{d}</li>))}
              </ul>
            </>
          ) : null}
          <p className="src" style={{ margin: "10px 0 0" }}>
            資料核實：{scheme.verified === "verified live" ? "研究員於 2026年10月14日實讀官方頁面" : "來自官方頁面搜尋索引（未能直讀）"} ·{" "}
            <a href={scheme.sourceUrl} target="_blank" rel="noreferrer">官方頁面</a>
          </p>
        </div>
      ) : null}
    </article>
  );
}

export default function VirginiaUniversityPage() {
  const [today] = useState<string>(() => hktToday());
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("virginia-plan-checklist");
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch { /* ignore */ }
  }, []);

  function toggleCheck(id: string, value: boolean) {
    setDone((prev) => {
      const next = { ...prev, [id]: value };
      try { window.localStorage.setItem("virginia-plan-checklist", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  const nextMilestone = useMemo(() => MILESTONES.find((m) => m.date >= today) ?? null, [today]);
  const filtered = useMemo(() => {
    if (routeFilter === "all") return SCHEMES;
    if (routeFilter === "pending") return SCHEMES.filter((s) => s.status !== "confirmed");
    return SCHEMES.filter((s) => s.route === routeFilter);
  }, [routeFilter]);
  const sections = useMemo(() => {
    const out: { name: string; items: CheckItem[] }[] = [];
    for (const item of CHECKLIST) {
      const f = out.find((s) => s.name === item.section);
      if (f) f.items.push(item); else out.push({ name: item.section, items: [item] });
    }
    return out;
  }, []);
  const doneCount = CHECKLIST.filter((c) => done[c.id]).length;

  return (
    <div className="virginia-plan">
      <style>{CSS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@600;700;900&display=swap" rel="stylesheet" />
      <div className="wrap">
        <header className="masthead">
          <div className="doc-meta">
            <span>學生 <b>Virginia Lam（F6 · St. Rose of Lima&apos;s College）</b></span>
            <span>入學年度 <b>2027</b></span>
            <span>主線 <b>JUPAS + 運動員計劃</b></span>
          </div>
          <h1>Virginia 考大學計劃</h1>
          <p className="lede">
            全港 10 間院校運動員入學途徑、JUPAS 同 DSE 關鍵日子，一頁睇晒。
            最關鍵三課：<b>成人賽事 EV Point 3+ 係 SALSA 渠道門檻</b>、<b>推薦信要及早向體院／總會申請</b>、<b>目標課程要放 JUPAS Band A</b>。
            最早嘅硬死線喺 11 月 — 唔好等 DSE 成績先郁手。
          </p>
          {nextMilestone ? (
            <div className="next-box">
              <span className="k">下一個死線</span>
              <div className="date">{fmtDate(nextMilestone.date).md}</div>
              <h3>{nextMilestone.title}{nextMilestone.timeText ? " · " + nextMilestone.timeText : ""}</h3>
              <p>{fmtDate(nextMilestone.date).full}（{fmtDate(nextMilestone.date).weekday}） — {daysBetween(today, nextMilestone.date) === 0 ? "就係今日" : "仲有 " + daysBetween(today, nextMilestone.date) + " 日"}</p>
              {nextMilestone.detail ? <p style={{ marginTop: 4 }}>{nextMilestone.detail}</p> : null}
            </div>
          ) : null}
          <div className="verdicts">
            <div className="verdict v-accent">
              <span className="tag">城大 SAAS</span>
              <h3>A1 只係偏好，唔係條件</h3>
              <p>官方寫明 JUPAS 選科「preferably in band A1」— 提名課程要在 JUPAS 選科內就合資格。第一批 11月11日截止，面試 12月1–2日；趕唔切仲有第三批 2027年2月12日（JUPAS 亦可）。</p>
            </div>
            <div className="verdict v-warn">
              <span className="tag">理大 OSRS</span>
              <h3>學業門檻唔豁免</h3>
              <p>OSRS 要達到理大一般入學要求加課程特定要求；但申請 OSRS 會自動同時考慮 SALSA，SALSA 就冇學業最低要求。OSRS 冇要求 Band A，將 PolyU 放 A1 唔會加分。</p>
            </div>
            <div className="verdict v-teal">
              <span className="tag">策略</span>
              <h3>兩個計劃可以同時行</h3>
              <p>SAAS（11月11日）同 OSRS／SALSA 優先輪（11月30日）唔使二揀一。A1 嗰格應該俾佢最想入嗰個課程；JUPAS 選科 12月2日前免費改，2027年7月14–16日仲可以再改。</p>
            </div>
          </div>
        </header>

        <nav className="toc" aria-label="目錄">
          <h2>目錄</h2>
          <ol>
            <li><a href="#timeline"><span className="no">01</span>死線時間線</a></li>
            <li><a href="#schemes"><span className="no">02</span>運動員計劃比較（13 個）</a></li>
            <li><a href="#checklist"><span className="no">03</span>文件清單（19 項）</a></li>
            <li><a href="#rules"><span className="no">04</span>並行與互斥規則</a></li>
            <li><a href="#tips"><span className="no">05</span>實用貼士</a></li>
            <li><a href="#open"><span className="no">06</span>未公佈・待確認</a></li>
          </ol>
        </nav>

        <section id="timeline">
          <h2><span className="no">01</span>死線時間線</h2>
          <p className="sec-sub">運動員計劃 + JUPAS + DSE 全部關鍵日子（香港時間），共 {MILESTONES.length} 項。</p>
          <ul className="timeline">
            {MILESTONES.map((m) => {
              const f = fmtDate(m.date); const isNext = nextMilestone?.date === m.date && nextMilestone?.title === m.title;
              return (
                <li key={m.date + m.title} className={m.date < today ? "past" : ""}>
                  <div className="when"><b style={isNext ? { color: "var(--accent)" } : undefined}>{f.md}</b><span>{f.weekday}{m.timeText ? " " + m.timeText : ""}</span></div>
                  <div className="what">
                    <b>{m.title}</b>{isNext ? <span className="badge-next">下一個死線</span> : null}
                    {m.detail ? <p>{m.detail}</p> : null}
                    <span className="cat">{m.category}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section id="schemes">
          <h2><span className="no">02</span>運動員計劃比較</h2>
          <p className="sec-sub">SALSA 沒有中央申請 — 每間大學各自渠道、各自死線。SALSA 渠道豁免學業最低要求；理大 OSRS、嶺南 ESEA 不豁免。共 {SCHEMES.length} 個計劃，撳「詳情」展開資格、文件同官方連結。</p>
          <div className="filters" role="group" aria-label="篩選計劃">
            {[["all", "全部"], ["direct", "直接申請"], ["nomination", "提名制"], ["pending", "未公佈日期"]].map(([v, label]) => (
              <button key={v} type="button" aria-pressed={routeFilter === v} className={routeFilter === v ? "on" : ""} onClick={() => setRouteFilter(v ?? "all")}>{label}</button>
            ))}
          </div>
          <div>
            {filtered.map((s) => (<SchemeCard key={s.id} scheme={s} today={today} />))}
            {filtered.length === 0 ? <p style={{ color: "var(--ink-2)", fontSize: 14 }}>此篩選下暫無計劃。</p> : null}
          </div>
        </section>

        <section id="checklist">
          <h2><span className="no">03</span>文件清單</h2>
          <p className="sec-sub">已備妥 {doneCount} / {CHECKLIST.length} 項 — 打勾進度會儲存在此瀏覽器（localStorage），唔會上傳。</p>
          <div className="progress" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={CHECKLIST.length} aria-label="文件準備進度">
            <i style={{ width: (CHECKLIST.length ? (doneCount / CHECKLIST.length) * 100 : 0) + "%" }} />
          </div>
          {sections.map((sec) => (
            <div key={sec.name}>
              <h3 className="check-sec">{sec.name}</h3>
              <ul className="check-list">
                {sec.items.map((item) => (
                  <li key={item.id}>
                    <label>
                      <input type="checkbox" checked={!!done[item.id]} aria-label={item.label} onChange={(e) => toggleCheck(item.id, e.target.checked)} />
                      <span>
                        <span className={"lab" + (done[item.id] ? " done" : "")}>{item.label}</span>
                        {item.detail ? <span className="det">{item.detail}</span> : null}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section id="rules">
          <h2><span className="no">04</span>邊啲可以同時申請・邊啲互斥</h2>
          <div>{PARALLEL_RULES.map((r) => (<p key={r.slice(0, 24)} className="rule">{r}</p>))}</div>
          <div className="callout amber">
            <h4>學校內部事項（St. Rose of Lima&apos;s）</h4>
            <ul>
              <li><b>SNDAS 校內意向（EOI）：</b>截止為 2026年11月1日 17:00 — 有冇交到未確認；如未交，聯絡學校 Careers team 跟進。</li>
              <li><b>SPN：</b>2026年12月31日 23:59 截止 — 表格 + 中五全年成績表 + 文件合併成一個 PDF（≤8MB），檔名格式 &lt;Class&gt;_&lt;Class No&gt;_&lt;Full Name&gt;_SPN_2627.pdf，上載至 Classroom，逾期不受理。SPN 與 SNDAS 互斥。</li>
              <li><b>音樂／語文證書核實：</b>2027年2月17日 17:00 前 — 先在 JUPAS 填最高學歷，再逐張證書影相（貼上寫有 JUPAS 編號、班別、班號的便條），上載至 Classroom。</li>
            </ul>
          </div>
        </section>

        <section id="tips">
          <h2><span className="no">05</span>實用貼士</h2>
          <ol className="plain">
            {TIPS.map((t) => (<li key={t.slice(0, 24)} style={{ fontSize: 15, lineHeight: 1.75 }}>{t}</li>))}
          </ol>
        </section>

        <section id="open">
          <h2><span className="no">06</span>未公佈・待確認</h2>
          <p className="sec-sub">以下日期官方尚未公佈 2027 版本，申請前請以官方頁面最新公佈為準。</p>
          <ul>{OPEN_QUESTIONS.map((q) => (<li key={q.slice(0, 24)}>{q}</li>))}</ul>
        </section>

        <footer className="foot">
          <p>資料來源：各大學及教資會官方頁面，經深度研究於 2026年10月14日逐頁核實（都大資料只經搜尋索引，頁面直讀被封）；城大 SAAS 三批日期於 2026年11月8日按城大官方《Application Reminders》再核實；JUPAS 日子來自 jupas.edu.hk 及教育局中六學生資訊專頁。申請前請以官方頁面最新公佈為準。</p>
          <p>使用方法：將此檔案放喺 Next.js 項目嘅 src/app/demo/virginia-university/page.tsx，開 /demo/virginia-university 即用。此為靜態版：打勾進度只儲存在瀏覽器 localStorage，死線唔會自動更新。</p>
        </footer>
      </div>
    </div>
  );
}
