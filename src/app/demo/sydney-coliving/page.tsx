"use client";

import { useState } from "react";

// Styles are scoped under .syd-report so they never leak onto the host site.
const CSS = `
      .syd-report {
        --paper: #fbfbf9;
        --surface: #ffffff;
        --surface-2: #f3f3ee;
        --ink: #1c2430;
        --ink-2: #46536a;
        --ink-3: #6d7a89;
        --line: #dde0d8;
        --accent: #a03c1e;
        --accent-soft: #f7e9e2;
        --good: #1d6b4f;
        --good-soft: #e4f0ea;
        --warn: #96650d;
        --warn-soft: #f8efdb;
        --bad: #a32525;
        --bad-soft: #f9e7e5;
        --chart-1: #a03c1e;
        --chart-2: #5b7186;
        --shadow: 0 1px 2px rgba(28,36,48,.06), 0 8px 24px -12px rgba(28,36,48,.18);}
      .syd-report {
background: var(--paper);
        color: var(--ink);
        font-family: "Noto Sans TC", -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif;
        font-size: 16px;
        line-height: 1.75;
        -webkit-font-smoothing: antialiased;}
      .syd-report .num, .syd-report td.n, .syd-report .stat b, .syd-report .calc-out b { font-family: "IBM Plex Mono", "Noto Sans TC", monospace; font-variant-numeric: tabular-nums;}
      .syd-report .wrap { max-width: 920px; margin: 0 auto; padding: 0 20px 72px;}
      .syd-report header.masthead { padding: 44px 0 8px; border-bottom: 3px solid var(--ink);}
      .syd-report .doc-meta {
        display: flex; flex-wrap: wrap; gap: 6px 18px;
        font-size: 13px; color: var(--ink-2); letter-spacing: .04em;
        margin-bottom: 18px;}
      .syd-report .doc-meta span b { color: var(--ink); font-weight: 700;}
      .syd-report h1 {
        font-family: "Noto Serif TC", serif; font-weight: 900;
        font-size: clamp(30px, 6vw, 46px); line-height: 1.25; margin: 0 0 14px;}
      .syd-report .lede { font-size: 17px; color: var(--ink-2); max-width: 46em; margin: 0 0 26px;}
      .syd-report .lede b { color: var(--ink);}
      .syd-report .verdicts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 26px 0 6px;}
      .syd-report .verdict {
        border: 1px solid var(--line); border-top: 4px solid var(--ink);
        background: var(--surface); padding: 16px 18px 14px; box-shadow: var(--shadow);}
      .syd-report .verdict.v-bad { border-top-color: var(--bad);}
      .syd-report .verdict.v-warn { border-top-color: var(--warn);}
      .syd-report .verdict.v-good { border-top-color: var(--good);}
      .syd-report .verdict .tag {
        display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .08em;
        padding: 2px 9px; border-radius: 999px; margin-bottom: 8px;}
      .syd-report .v-bad .tag { background: var(--bad-soft); color: var(--bad);}
      .syd-report .v-warn .tag { background: var(--warn-soft); color: var(--warn);}
      .syd-report .v-good .tag { background: var(--good-soft); color: var(--good);}
      .syd-report .verdict h3 { font-size: 16.5px; margin: 0 0 6px; line-height: 1.5;}
      .syd-report .verdict p { font-size: 14px; color: var(--ink-2); margin: 0; line-height: 1.65;}
      .syd-report nav.toc { margin: 30px 0 4px; padding: 18px 20px; background: var(--surface-2); border: 1px solid var(--line);}
      .syd-report nav.toc h2 { font-size: 13px; letter-spacing: .12em; margin: 0 0 10px; color: var(--ink-2); font-weight: 700;}
      .syd-report nav.toc ol { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 28px;}
      .syd-report nav.toc a { color: var(--ink); text-decoration: none; font-size: 15px; display: flex; gap: 10px; padding: 3px 0;}
      .syd-report nav.toc a:hover { color: var(--accent);}
      .syd-report nav.toc a .no { color: var(--accent); font-weight: 700; font-family: "IBM Plex Mono", monospace; font-size: 13.5px; padding-top: 2px;}
      .syd-report section { margin-top: 52px;}
      .syd-report section > h2 {
        font-family: "Noto Serif TC", serif; font-weight: 900;
        font-size: clamp(23px, 4.4vw, 30px); line-height: 1.35;
        margin: 0 0 6px; display: flex; gap: 14px; align-items: baseline;}
      .syd-report section > h2 .no { color: var(--accent); font-family: "IBM Plex Mono", monospace; font-size: .72em; font-weight: 600;}
      .syd-report .sec-sub { color: var(--ink-2); margin: 0 0 20px; font-size: 15.5px;}
      .syd-report h3.sub {
        font-size: 18px; font-weight: 900; margin: 30px 0 10px;
        padding-bottom: 6px; border-bottom: 1px solid var(--line);}
      .syd-report p { margin: 0 0 14px;}
      .syd-report ul, .syd-report ol.plain { margin: 0 0 16px; padding-left: 1.35em;}
      .syd-report li { margin-bottom: 7px;}
      .syd-report li::marker { color: var(--accent);}
      .syd-report b, .syd-report strong { font-weight: 700;}
      .syd-report .src { color: var(--ink-3); font-size: 13px;}
      .syd-report a { color: var(--accent);}
      .syd-report .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0 8px;}
      .syd-report .stat { background: var(--surface); border: 1px solid var(--line); padding: 14px 16px; box-shadow: var(--shadow);}
      .syd-report .stat b { display: block; font-size: clamp(21px, 3.4vw, 27px); font-weight: 600; line-height: 1.2; color: var(--ink);}
      .syd-report .stat b em { font-style: normal; color: var(--accent);}
      .syd-report .stat span { font-size: 13px; color: var(--ink-2); line-height: 1.55; display: block; margin-top: 5px;}
      .syd-report .callout { border: 1px solid var(--line); padding: 16px 20px 8px; margin: 20px 0; background: var(--surface);}
      .syd-report .callout.red { background: var(--bad-soft); border-color: transparent;}
      .syd-report .callout.amber { background: var(--warn-soft); border-color: transparent;}
      .syd-report .callout.green { background: var(--good-soft); border-color: transparent;}
      .syd-report .callout h4 { margin: 0 0 8px; font-size: 16px;}
      .syd-report .callout p, .syd-report .callout li { font-size: 15px;}
      .syd-report .tbl-wrap { margin: 16px 0 22px;}
      .syd-report table { width: 100%; border-collapse: collapse; background: var(--surface); border: 1px solid var(--line); font-size: 14.5px;}
      .syd-report th, .syd-report td { text-align: left; padding: 10px 13px; vertical-align: top; border-bottom: 1px solid var(--line); line-height: 1.6;}
      .syd-report thead th { background: var(--surface-2); font-size: 13px; letter-spacing: .05em; color: var(--ink-2); border-bottom: 2px solid var(--line); white-space: nowrap;}
      .syd-report tbody tr:last-child td { border-bottom: none;}
      .syd-report td.n, .syd-report th.n { text-align: right; white-space: nowrap;}
      .syd-report tr.neg td.n, .syd-report td.neg { color: var(--bad); font-weight: 600;}
      .syd-report tr.pos td.n, .syd-report td.pos { color: var(--good); font-weight: 600;}
      .syd-report tr.total td { font-weight: 700; background: var(--surface-2);}
      .syd-report td .src { display: block; margin-top: 2px;}
      .syd-report .tbl-note { font-size: 13px; color: var(--ink-3); margin-top: 8px;}
      .syd-report figure.chart { margin: 22px 0; background: var(--surface); border: 1px solid var(--line); padding: 20px 20px 12px; box-shadow: var(--shadow);}
      .syd-report figure.chart figcaption { font-size: 15px; font-weight: 700; margin-bottom: 14px;}
      .syd-report figure.chart .foot { font-size: 12.5px; color: var(--ink-3); margin-top: 10px; line-height: 1.6;}
      .syd-report .legend { display: flex; gap: 18px; font-size: 13px; color: var(--ink-2); margin-bottom: 8px;}
      .syd-report .legend i { display: inline-block; width: 12px; height: 12px; margin-right: 6px; vertical-align: -1px;}
      .syd-report .calc { background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); padding: 22px 22px 18px; margin: 20px 0;}
      .syd-report .calc h4 { margin: 0 0 4px; font-size: 17px;}
      .syd-report .calc .hint { font-size: 13.5px; color: var(--ink-2); margin-bottom: 16px;}
      .syd-report .calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 28px;}
      .syd-report .ctl label { display: flex; justify-content: space-between; font-size: 14px; font-weight: 500; margin-bottom: 6px;}
      .syd-report .ctl label output { font-family: "IBM Plex Mono", monospace; font-weight: 600; color: var(--accent);}
      .syd-report .ctl input[type="range"] { width: 100%; accent-color: var(--accent); height: 28px;}
      .syd-report .calc-out { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px; border-top: 1px solid var(--line); padding-top: 18px;}
      .syd-report .calc-out > div span { display: block; font-size: 12.5px; color: var(--ink-2); letter-spacing: .04em; margin-bottom: 3px;}
      .syd-report .calc-out b { font-size: clamp(19px, 3.4vw, 25px); font-weight: 600;}
      .syd-report .calc-out b.neg { color: var(--bad);}
      .syd-report .calc-out b.pos { color: var(--good);}
      .syd-report .calc-note { font-size: 12.5px; color: var(--ink-3); margin-top: 14px; line-height: 1.65;}
      .syd-report .risk-chip { display: inline-block; font-size: 12px; font-weight: 700; padding: 1px 8px; border-radius: 999px; white-space: nowrap;}
      .syd-report .rk-hh { background: var(--bad-soft); color: var(--bad);}
      .syd-report .rk-mh { background: var(--warn-soft); color: var(--warn);}
      .syd-report .rk-mm { background: var(--surface-2); color: var(--ink-2);}
      .syd-report .rk-lm { background: var(--good-soft); color: var(--good);}
      .syd-report ol.steps { counter-reset: step; list-style: none; padding: 0; margin: 16px 0;}
      .syd-report ol.steps li {
        counter-increment: step; position: relative; padding: 12px 16px 12px 58px;
        background: var(--surface); border: 1px solid var(--line); margin-bottom: 8px; font-size: 15px;}
      .syd-report ol.steps li::before {
        content: counter(step); position: absolute; left: 16px; top: 12px;
        width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: #fff;
        font-family: "IBM Plex Mono", monospace; font-size: 14px; font-weight: 600;
        display: flex; align-items: center; justify-content: center;}
      .syd-report footer.foot { margin-top: 60px; border-top: 3px solid var(--ink); padding-top: 18px; font-size: 13px; color: var(--ink-2); line-height: 1.7;}
      .syd-report footer.foot h2 { font-size: 13px; letter-spacing: .12em; color: var(--ink); margin: 0 0 8px;}
      @media (prefers-color-scheme: dark) {
      .syd-report {
          --paper: #14181e;
          --surface: #1c2129;
          --surface-2: #232933;
          --ink: #e9ebee;
          --ink-2: #b3bccb;
          --ink-3: #8b96a8;
          --line: #333c49;
          --accent: #e08a68;
          --accent-soft: #33231c;
          --good: #6fc7a4;
          --good-soft: #1d2f28;
          --warn: #e0b45e;
          --warn-soft: #332b18;
          --bad: #ef9a94;
          --bad-soft: #352121;
          --chart-1: #e08a68;
          --chart-2: #93a9bd;
          --shadow: 0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.5);}
      .syd-report ol.steps li::before { color: #14181e;}
      }
      @media (max-width: 760px) {
      .syd-report .verdicts { grid-template-columns: 1fr;}
      .syd-report .stats { grid-template-columns: 1fr 1fr;}
      .syd-report nav.toc ol { grid-template-columns: 1fr;}
      .syd-report .calc-grid { grid-template-columns: 1fr;}
      .syd-report .calc-out { grid-template-columns: 1fr 1fr;}
      .syd-report table.stack thead { display: none;}
      .syd-report table.stack, .syd-report table.stack tbody, .syd-report table.stack tr, .syd-report table.stack td { display: block; width: 100%;}
      .syd-report table.stack tr { border-bottom: 2px solid var(--line); padding: 8px 0;}
      .syd-report table.stack td { border-bottom: none; padding: 5px 13px;}
      .syd-report table.stack td::before {
          content: attr(data-l); display: block; font-size: 11.5px; letter-spacing: .06em;
          color: var(--ink-3); font-weight: 700; margin-bottom: 1px;}
      .syd-report table.stack td.n { text-align: left;}
      .syd-report table.stack td:first-child { font-weight: 700; font-size: 15.5px;}
      .syd-report table.stack td:first-child::before { display: none;}
      }
`;

function fmt(n: number): string {
  const s = Math.abs(Math.round(n)).toLocaleString("en-AU");
  return (n < 0 ? "\u2212$" : "$") + s;
}

export default function SydneyColivingReportPage() {
  const [rooms, setRooms] = useState(6);
  const [rent, setRent] = useState(400);
  const [occ, setOcc] = useState(90);
  const [head, setHead] = useState(1900);

  const OPEX = 370; // 除總租外固定營運成本 $/週（研究假設）
  const week = rooms * rent * (occ / 100) - head - OPEX;
  const year = week * 52;
  const capex = rooms * 3650; // 每房攪分 capex，6 房 ≈ $22,000

  return (
    <div className="syd-report">
      <style>{CSS}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

          <div className="wrap">

            <header className="masthead">
              <div className="doc-meta">
                <span>日期 <b>2026 年 11 月 4 日</b></span>
                <span>市場 <b>澳洲悉尼 · 新南威爾斯州</b></span>
                <span>目標客群 <b>留學生 · 外區工作人員</b></span>
                <span>貨幣 <b>澳元 A$</b></span>
              </div>
              <h1>悉尼分租（Coliving）生意研究報告</h1>
              <p className="lede">
                評估「香港模式」——向大業主整棟承租、間房分租俾唔同租客——喺悉尼行唔行得通：
                市場需求、行家數據、攞盤與營運、NSW 法律合規、財務模型與回本期、風險與損耗。
                核心問題：<b>可唔可以向分租客預收一年租金、同時每月向大業主交租？</b>
                本報告所有關鍵數字均附來源及日期；標示「估算」者為研究員按假設計算，並非市場實數。
              </p>

              <div className="verdicts">
                <div className="verdict v-good">
                  <span className="tag">結構上可行</span>
                  <h3>大業主租盤再分間分租</h3>
                  <p>合法，但必須用「總租約 + 每間房一份書面 RTA 分租約」結構，並喺總租約內預先取得業主書面同意分租（RTA s74/s75）。咁樣先可以避開《Boarding Houses Act 2012》嘅登記制度。</p>
                </div>
                <div className="verdict v-bad">
                  <span className="tag">不可行 — 法律紅線</span>
                  <h3>向租客預收一年租金</h3>
                  <p>NSW《Residential Tenancies Act 2010》s33 規定：業主（包括轉租嘅總租客）<b>唔可以要求</b>租客預繳超過 2 星期租金。租客自願多付先得，將年繳列為租務條件即屬違規——港式現金流浮存（cash float）喺悉尼用唔到。</p>
                </div>
                <div className="verdict v-warn">
                  <span className="tag">邊際 — 靠執行</span>
                  <h3>賺唔賺到錢？</h3>
                  <p>以 Kingsford 5 房屋做基準情境（6 間房 × $400/週、入住率 90%、總租 $1,900/週），每間屋每年約<b>蝕 $5,720</b>。要做到 7 間房以上、房租 ≥$420/週、或攞到低於市價嘅總租，先至轉正。</p>
                </div>
              </div>
            </header>

            <nav className="toc" aria-label="目錄">
              <h2>目錄</h2>
              <ol>
                <li><a href="#s1"><span className="no">01</span>市場需求</a></li>
                <li><a href="#s2"><span className="no">02</span>行家與競爭</a></li>
                <li><a href="#s3"><span className="no">03</span>盤源：點樣攞盤</a></li>
                <li><a href="#s4"><span className="no">04</span>營運與技術操作</a></li>
                <li><a href="#s5"><span className="no">05</span>法律與合規（NSW）</a></li>
                <li><a href="#s6"><span className="no">06</span>香港模式可行性</a></li>
                <li><a href="#s7"><span className="no">07</span>財務模型與回本期</a></li>
                <li><a href="#s8"><span className="no">08</span>風險評估</a></li>
              </ol>
            </nav>

            {/* ============ 1 市場需求 ============ */}
            <section id="s1">
              <h2><span className="no">01</span>市場需求</h2>
              <p className="sec-sub">悉尼租盤仍然緊張，但 2026 年 9 月數據顯示 2022–2025 年嘅擠壓開始緩和——入場時機要計埋呢個轉向。</p>

              <div className="stats">
                <div className="stat"><b><em>1.3%</em></b><span>悉尼住宅空置率（SQM Research，2025 年 10 月；空置單位 9,553 間），遠低於 3–3.5% 嘅均衡水平</span></div>
                <div className="stat"><b>328,518</b><span>NSW 留學生人數（2024 年），佔全國 853,045 人嘅 38.5%；國際教育係 NSW 第二大出口，值 $19.5bn（Business Sydney / Study NSW，2025 年 9 月）</span></div>
                <div className="stat"><b>98%</b><span>機構式 coliving 營運商 UKO 嘅組合入住率（18 幢、1,000+ 單位）</span></div>
                <div className="stat"><b>&gt;90%</b><span>全國已落成 coliving 項目集中喺悉尼；全國營運中單位 &gt;2,000 間、籌備中約 10,000 間（Knight Frank Co-Living Report 2025）</span></div>
              </div>

              <h3 className="sub">空置率與租金走勢</h3>
              <ul>
                <li><b>空置率 1.3%</b>（SQM Research 2025 年 10 月數據，經 PropertyMe 2025 年 11 月發布）；全國 1.2%。CBRE（2025 年 9 月）預測悉尼公寓空置率由 2.0% 跌至 1.2%，因 2025–30 年每年僅約 11,700 伙落成、對比約 30,000 伙總需求。</li>
                <li><b>留意轉向：</b>Cotality / Domain 2026 年 9 月數據顯示全國空置率升至 2.1%（悉尼 2.5%），悉尼獨立屋租金錄得自 2024 年 12 月以來首次按季下跌（−$5 至 $835/週）。市場仍然緊，但唔再係單邊上升。<span className="src">（API Magazine，2026 年 10 月，引述 Domain 2026 年 9 月租金報告）</span></li>
                <li>悉尼整體週租中位數：獨立屋約 <b>$800–$890</b>、單位約 <b>$750</b>。<span className="src">（MyHousingMarket / rent.com.au / Domain，2025 年 9–10 月）</span></li>
              </ul>

              <figure className="chart">
                <figcaption>目標地區週租中位數（A$/週）</figcaption>
                <div className="legend"><span><i style={{background: "var(--chart-1)"}}></i>獨立屋</span><span><i style={{background: "var(--chart-2)"}}></i>單位</span></div>
                <svg viewBox="0 0 640 252" width="100%" role="img" aria-label="Randwick 獨立屋 1442 元、單位 888 元；Kingsford 獨立屋 1195 元；Strathfield 獨立屋 1050 元、單位 710 元；Burwood 獨立屋 945 元、單位 815 元">
                  {/* gridlines: scale 1500 = 460px, x0=118 */}
                  <g stroke="var(--line)" stroke-width="1">
                    <line x1="118" y1="12" x2="118" y2="216"/><line x1="271" y1="12" x2="271" y2="216"/>
                    <line x1="425" y1="12" x2="425" y2="216"/><line x1="578" y1="12" x2="578" y2="216"/>
                  </g>
                  <g font-size="11.5" fill="var(--ink-3)" font-family="IBM Plex Mono, monospace">
                    <text x="118" y="234" text-anchor="middle">$0</text>
                    <text x="271" y="234" text-anchor="middle">$500</text>
                    <text x="425" y="234" text-anchor="middle">$1,000</text>
                    <text x="578" y="234" text-anchor="middle">$1,500</text>
                  </g>
                  {/* Randwick */}
                  <text x="110" y="36" text-anchor="end" font-size="14" fill="var(--ink)" font-weight="700">Randwick</text>
                  <rect x="118" y="20" width="442" height="17" fill="var(--chart-1)"/>
                  <text x="566" y="34" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$1,442</text>
                  <rect x="118" y="41" width="272" height="17" fill="var(--chart-2)"/>
                  <text x="396" y="55" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$888</text>
                  {/* Kingsford */}
                  <text x="110" y="88" text-anchor="end" font-size="14" fill="var(--ink)" font-weight="700">Kingsford</text>
                  <rect x="118" y="72" width="366" height="17" fill="var(--chart-1)"/>
                  <text x="490" y="86" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$1,195</text>
                  <text x="118" y="106" font-size="12" fill="var(--ink-3)">單位：無單一一致來源數據</text>
                  {/* Strathfield */}
                  <text x="110" y="140" text-anchor="end" font-size="14" fill="var(--ink)" font-weight="700">Strathfield</text>
                  <rect x="118" y="124" width="322" height="17" fill="var(--chart-1)"/>
                  <text x="446" y="138" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$1,050</text>
                  <rect x="118" y="145" width="218" height="17" fill="var(--chart-2)"/>
                  <text x="342" y="159" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$710</text>
                  {/* Burwood */}
                  <text x="110" y="192" text-anchor="end" font-size="14" fill="var(--ink)" font-weight="700">Burwood</text>
                  <rect x="118" y="176" width="290" height="17" fill="var(--chart-1)"/>
                  <text x="414" y="190" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$945</text>
                  <rect x="118" y="197" width="250" height="17" fill="var(--chart-2)"/>
                  <text x="374" y="211" font-size="12.5" fill="var(--ink)" font-family="IBM Plex Mono, monospace">$815</text>
                </svg>
                <p className="foot">來源：Randwick、Strathfield、Burwood 為 NSW 按金登記數據（截至 2026 年 6 月止 12 個月，AreaSearch 2026 年 10 月）；Kingsford 獨立屋 $1,195 為 Randwick 市內最平獨立屋區（YourMortgage，2025 年 2 月，CoreLogic 數據）。Campsie、Hurstville 及 Macquarie 一帶未能取得一致口徑嘅 2025–26 中位數。</p>
              </figure>

              <h3 className="sub">留學生需求底盤</h3>
              <ul>
                <li>NSW 大學 2024 年國際生註冊 <b>105,393 人（+18.9%）</b>，每 3 個大學註冊就有 1 個係國際生。<span className="src">（Audit Office of NSW，經 NSW Parliament 文件，2025 年 10 月）</span></li>
                <li>悉尼大學 2024 年國際生 39,725 人 vs 本地生 35,727 人（51%）；UNSW 國際生佔 46%。<span className="src">（The Australian，2025 年 10 月）</span></li>
                <li>中國學生佔澳洲國際生 <b>23–24%</b><span className="src">（教育部，2026 年 5 月年至今數據）</span>；NSW 有 <b>36.1%</b> 國際註冊係職業教育（VET）課程——呢批客價格敏感，正正係分租房而唔係 PBSA 嘅客源。</li>
                <li>分租房價位錨：悉尼合租單人房約 <b>$350–$400/週</b>（iROOMit 2025）；Kingsford 5 房屋放租盤房價 $380–$500/週（Flatmates.com.au）；Erasmus Play 指「租合租單位一間房係國際生最普遍嘅選擇」，私人房全包價平均 $270–400/週。</li>
                <li>需求熱度實證：Semester in Australia（Coogee / Kingsford / Randwick）<b>2027 年第一學期已售罄</b>；Amberstudent 嘅 Kingsford 5 房盤（$300–$460/週）同樣售罄。</li>
              </ul>
            </section>

            {/* ============ 2 競爭 ============ */}
            <section id="s2">
              <h2><span className="no">02</span>行家與競爭</h2>
              <p className="sec-sub">市場分三層：機構式 coliving、UNSW 走廊嘅中小型總租營運商、以及 PBSA 學生公寓。分租模式嘅定價必須比 PBSA 平 15–30% 先有競爭力。</p>

              <h3 className="sub">機構式 coliving 營運商</h3>
              <div className="tbl-wrap">
                <table className="stack">
                  <thead><tr><th>營運商</th><th>規模 / 客群</th><th>參考房價</th><th>模式</th></tr></thead>
                  <tbody>
                    <tr>
                      <td data-l="營運商">UKO（Veriu 旗下）</td>
                      <td data-l="規模 / 客群">18 幢、1,000+ 單位；入住率 98%；年輕專業人士、流動工作者</td>
                      <td data-l="參考房價">Studio $490–$650/週</td>
                      <td data-l="模式">酒店式<b>管理協議</b>（輕資產），唔用總租約<span className="src">globalawards.news，2026 年 11 月</span></td>
                    </tr>
                    <tr>
                      <td data-l="營運商">Together Co-Living</td>
                      <td data-l="規模 / 客群">大型改建酒店項目（墨爾本 Preston 為主，悉尼佈局有限）；學生</td>
                      <td data-l="參考房價">由約 $324/週起（包賬單）；studio $459+/週</td>
                      <td data-l="模式">自置 / 營運</td>
                    </tr>
                    <tr>
                      <td data-l="營運商">CDA Coliving</td>
                      <td data-l="規模 / 客群">悉尼 + 墨爾本；年輕專業人士、留學生、數碼遊牧</td>
                      <td data-l="參考房價">週租 / 月租，包賬單</td>
                      <td data-l="模式">營運</td>
                    </tr>
                    <tr>
                      <td data-l="營運商">Nestl</td>
                      <td data-l="規模 / 客群">悉尼 Newtown、Redfern；彈性租客</td>
                      <td data-l="參考房價">月租，無最短租期</td>
                      <td data-l="模式">營運</td>
                    </tr>
                    <tr>
                      <td data-l="營運商">Dash Living</td>
                      <td data-l="規模 / 客群">接手 Hmlet 嘅 St Peters 82 房大樓；另有 Darling Harbour 項目</td>
                      <td data-l="參考房價">—</td>
                      <td data-l="模式">營運</td>
                    </tr>
                    <tr>
                      <td data-l="營運商">Nuveen「The Switch」/ Macquarie「Local」</td>
                      <td data-l="規模 / 客群">正在進場：BTR / 學生 coliving 混合項目</td>
                      <td data-l="參考房價">—</td>
                      <td data-l="模式">發展 / 營運</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="sub">直接競爭：UNSW 走廊嘅總租 / 分租營運商</h3>
              <p>UNSW 官方校外住宿頁面本身就列咗一批營運商：<b>Myola Coogee、Muse Living、Sweet Pea Living、Down Under Stay、Semester in Australia、2stay</b>——即係話「港式總租分間」呢個位已經有人做緊。價格帶：平價合租 $250–$450/週、中價 $450–$650/週（每人計）。</p>
              <ul>
                <li><b>Muse Living（Bondi）：</b>由 $380/週起全包；12 間房；套房 $480–$660/週；按金 $400。<span className="src">（uniacco.com；amberstudent.com）</span></li>
                <li><b>Semester in Australia：</b>雙人房 $9,500/學期、單人房 $13,500/學期（以 20 週計約 $475–$675/週）；2027 年第一學期售罄。</li>
                <li><b>ShareMyRoom：</b>悉尼 CBD 400+ 床位，營運 18 年。<span className="src">（Flatmates.com.au 列表）</span></li>
                <li>非正式港式營運者亦已存在：例如 Campsie 一間 5 房 3 廁全傢俬合租屋經微信放租、全包賬單。<span className="src">（RenterMate 列表，2026 年 8 月）</span></li>
              </ul>

              <div className="callout red">
                <h4>⚠ 前車之鑑：Hmlet Australia 2021 年倒閉</h4>
                <p>新加坡 coliving 初創 Hmlet 約 2019 年進軍澳洲，用嘅正正係<b>長年期總租約、而且無終止條款</b>。疫情封關令入住率崩潰，2021 年 5 月退出時欠債 <b>A$508,408</b>（清盤人 KordaMentha），其中 3 名大業主被欠超過 $400,000；一共走咗 <b>7 份總租約</b>，集團累計燒咗 US$38m。CEO Peter Kennedy：「we got absolutely clobbered」。其 Marrickville 大樓由 UKO 收購，Hmlet 其後與 Habyt 合併。<b>呢個就係港式模式最大嘅結構性風險：固定總租負債 + 浮動入住收入。</b><span className="src">（AFR 經 Business Times，2021 年 5 月 31 日；Tech in Asia，2021 年 5 月）</span></p>
              </div>

              <h3 className="sub">相鄰競爭：PBSA 學生公寓</h3>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>品牌</th><th className="n">週租參考</th><th>備註</th></tr></thead>
                  <tbody>
                    <tr><td>Scape</td><td className="n">$450–$650</td><td>大型 PBSA</td></tr>
                    <tr><td>Iglu</td><td className="n">$400–$700</td><td>合租單位 $585–$805<span className="src">latrobe.edu.au</span></td></tr>
                    <tr><td>Urbanest</td><td className="n">$380–$600</td><td>—</td></tr>
                    <tr><td>UniLodge</td><td className="n">$400–$550</td><td>全國 110+ 物業</td></tr>
                    <tr><td>Admistay（136 個悉尼盤）</td><td className="n">中位起租 $445</td><td>94% 包賬單（2026 年 11 月）</td></tr>
                  </tbody>
                </table>
                <p className="tbl-note">啟示：分租房要贏 PBSA，靠嘅係平 15–30%、租期彈性（唔使簽 12 個月）、同貼近個別校園嘅位置。</p>
              </div>
            </section>

            {/* ============ 3 盤源 ============ */}
            <section id="s3">
              <h2><span className="no">03</span>盤源：點樣攞盤</h2>
              <p className="sec-sub">核心手法係向業主推銷「保證租金」：固定收入、零空置、零管理煩惱，換取長租期同分租同意。要注意——悉尼冇任何營運商公開過總租約條款範本，以下租期基準來自英國 R2R（rent-to-rent）市場，只作參考。</p>

              <h3 className="sub">攞盤手法與條款基準</h3>
              <ul>
                <li><b>目標業主：</b>移民離澳嘅業主、厭倦管理嘅「攰業主」、長期空置或難租出嘅盤。直接接洽業主 / 地產代理，主打保證租金。</li>
                <li><b>條款基準（英國 R2R 公開規範，悉尼未核實）：</b>租期 1–5 年；無論入住率如何都付固定保證租金；營運商負責管理同小維修；利潤 = 房租總收入 − 總租嘅差價。<span className="src">（linkproperty.co.uk，2025 年 9 月；propertyredress.co.uk）</span></li>
                <li><b>首選物業：</b>獨立屋（free-standing）4–6 房，<b>避開分契（strata）物業</b>；30 分鐘內到 UNSW / USyd / UTS / Macquarie：Kingsford、Randwick、Kensington、Maroubra、Burwood、Strathfield、Campsie、Hurstville。舊、未翻新嘅屋總租較平，業主亦較受落保證收入嘅推銷。</li>
                <li><b>業主嘅顧慮：</b>高流轉造成嘅損耗、未經授權間房、保險失效、按揭 / 保險條款限制分租，同埋（Hmlet 之後）對營運商對手方風險嘅警惕。</li>
                <li><b>業主誘因（特定情況）：</b>如果物業係已登記寄宿屋（boarding house），業主或可享土地稅豁免（《Land Tax Management Act 1956》s10Q；Revenue NSW Ruling LT-119）——但條件係 ≥80% 長期住客兼收費上限，同學生高流轉模式有衝突，實際幫助有限。</li>
              </ul>

              <h3 className="sub">5 房獨立屋總租行情（放盤價）</h3>
              <div className="tbl-wrap">
                <table className="stack">
                  <thead><tr><th>地區</th><th className="n">週租</th><th>放盤例子</th></tr></thead>
                  <tbody>
                    <tr><td data-l="地區">Kingsford</td><td className="n" data-l="週租">$1,800–$2,200（中段）</td><td data-l="放盤例子">21 Leonard Ave $1,800；22 Jellicoe Ave $1,895（2026 年 2 月）；95 Rainbow St $2,100；99 Bunnerong Rd $2,200；24A Norton St $2,900<span className="src">Domain，2026 年 10 月</span></td></tr>
                    <tr><td data-l="地區">Maroubra</td><td className="n" data-l="週租">$2,000</td><td data-l="放盤例子">10 Kingsford St<span className="src">Domain，2026 年 10 月</span></td></tr>
                    <tr><td data-l="地區">Campsie</td><td className="n" data-l="週租">約 $920–$1,100</td><td data-l="放盤例子">20 Shelley St $1,100；7/55 Bexley Rd 5 房 townhouse $920<span className="src">realestate.com.au，2026 年 1 月</span></td></tr>
                  </tbody>
                </table>
                <p className="tbl-note">營運商應瞄準低於中位數嘅盤，並以保證租金 + 長約爭取折扣——以低於叫價 5–10% 成交屬合理期望，但<b>未經市場核實（估算）</b>。Campsie 總租平 Kingsford 近一半，係財務模型上更易計得掂數嘅地區（見第 7 節試算器）。</p>
              </div>
            </section>

            {/* ============ 4 營運 ============ */}
            <section id="s4">
              <h2><span className="no">04</span>營運與技術操作</h2>
              <p className="sec-sub">逐房出租係高接觸營運：睇房、換客、住客衝突調解頻繁，行內普遍自營管理，外判收費亦會比一般住宅管理貴。</p>

              <div className="tbl-wrap">
                <table className="stack">
                  <thead><tr><th>環節</th><th>做法 / 數據</th></tr></thead>
                  <tbody>
                    <tr>
                      <td data-l="環節">招租渠道</td>
                      <td data-l="做法"><b>Flatmates.com.au 為主渠道</b>（REA Group 旗下，亦係房價錨）；另有 Flatmate Finders、ZUWU、Gumtree、Facebook 群組、Domain / realestate.com.au、UniAcco、amberstudent、Erasmus Play、Admistay、大學校外住宿資料庫。中國學生佔市場 23–24%，<b>微信群同小紅書係主要發現渠道</b>（UniLodge 本身亦有經營微信 + 小紅書頻道）。<b>警告：</b>小紅書租房騙案屢有報道（SBS，2024），正規營運商應使用可驗證、可追溯嘅渠道放租。</td>
                    </tr>
                    <tr>
                      <td data-l="環節">物業管理</td>
                      <td data-l="做法">逐房營運商普遍<b>自營</b>。外判基準：悉尼都會區管理費為租金嘅 <b>5–8%</b>（悉尼平均 5.4%），放租費 1–2 週租金，另加 GST<span className="src">（WhichRealEstateAgent 2026 指南；Golden View，2026 年 10 月）</span>；逐房管理收費會明顯更高——<b>估算 8–12%</b>。</td>
                    </tr>
                    <tr>
                      <td data-l="環節">智能門鎖</td>
                      <td data-l="做法">行內標準配置：每房獨立密碼，換客即換碼，係控制門匙流轉嘅關鍵。連安裝成本 <b>$350–$950 / 道</b>（連 GST）；硬件 $200–$700；專業安裝 $100–$250；DIY 改裝由約 $149–$274 起。<span className="src">（eufy AU 2025–26 估算；laserco.com.au；thegoodguys.com.au）</span></td>
                    </tr>
                    <tr>
                      <td data-l="環節">全包賬單</td>
                      <td data-l="做法">房租包電、煤氣、水、NBN 寬頻，用量風險由營運商承擔。6–7 人一屋<b>估算約 $160–$170/週</b>（電 ~$80、煤氣 ~$20、水 ~$40、NBN ~$21）。以「合理使用」（fair-use）條款對沖濫用風險。</td>
                    </tr>
                    <tr>
                      <td data-l="環節">清潔與換客</td>
                      <td data-l="做法">公共範圍每兩週清潔一次（約 $90/次，估算）；每次換客逐房深層清潔 $150–$180（估算）；每間房入住 / 退租都要做狀況報告（condition report）——係 RTA 要求，亦係按金爭議嘅證據。</td>
                    </tr>
                    <tr>
                      <td data-l="環節">管理軟件</td>
                      <td data-l="做法">澳洲主流物管平台 PropertyMe、Property Tree、Console Cloud 都支援一物業多租約；<b>未能核實</b>小型分租營運商實際用邊套系統（市場上未見 coliving 專用平台）。</td>
                    </tr>
                    <tr>
                      <td data-l="環節">人手比例</td>
                      <td data-l="做法"><b>無公開數據。</b>估算：高接觸學生營運約 1 名全職員工對 40–60 間房（參考英國 HMO 基準，未就悉尼核實）。</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="callout amber">
                <h4>季節性：跟學期走嘅需求曲線</h4>
                <p>UNSW 2026 年學期：第一學期 2 月 16 日–5 月 14 日、第二學期 6 月 1 日–8 月 27 日、第三學期 9 月 14 日–12 月 10 日。需求高峰喺 <b>1 月底–2 月</b>同 <b>8–9 月</b>，低谷喺 <b>12 月中–1 月初</b>。租約應對齊學期完結日，並喺退租前 8–10 週啟動再放租流程；另要注意 UNSW 2028 年起改行彈性學期制，週期會變。<span className="src">（unsw.edu.au）</span></p>
              </div>
            </section>

            {/* ============ 5 法律 ============ */}
            <section id="s5">
              <h2><span className="no">05</span>法律與合規（NSW）</h2>
              <p className="sec-sub">成個模式企唔企得穩，取決於三條線：分租同意（RTA）、寄宿屋登記門檻（BHA）、同市政府規劃。以下條文已喺 AustLII 逐條核對。</p>

              <h3 className="sub">5.1 分租 — 《Residential Tenancies Act 2010》(NSW)</h3>
              <ul>
                <li><b>s74：</b>租客分租必須先取得業主<b>書面同意</b>。</li>
                <li><b>s75：</b>分租<b>成個物業</b>（即港式模式——營運商唔會自住）嘅話，業主<b>可以無理拒絕</b>；只有「分租一部分、總租客繼續自住」嗰種，先至唔可以無理拒絕。合理拒絕理由包括：住客數目超限、擬分租客列喺租務黑名單資料庫、過度擠迫。<span className="src">（gotocourt.com.au，2026 年 4 月覆核；Tenants' Union 資料單張；nsw.gov.au「Sharing a residential rental property」，2026 年 10 月 20 日）</span></li>
                <li><b>未經同意分租嘅後果：</b>構成違反租約，業主可發違約通知並向 NCAT 申請終止租約。總租客對分租客負嘅法律責任「同業主一樣」。<span className="src">（nsw.gov.au）</span></li>
                <li>業主<b>唔可以</b>就同意分租收費（合理開支除外）。</li>
                <li><b>實務結論：</b>因為成個物業分租可以被任意拒絕，分租同意必須<b>喺簽總租約嗰陣寫入約內</b>——先簽標準租約、事後先申請同意，等於將成盤生意押喺業主心情上。</li>
                <li><b>s10（合住戶）：</b>住客只有持有同總租客簽訂嘅<b>書面</b>分租約，先至係 RTA 下嘅「租客」。冇書面約，佢哋就跌出 RTA 保障之外（Redfern Legal Centre；2016 年法定檢討）。<b>所以每間房一份書面分租約唔係選項，係必需。</b>寄宿者 / 借住者（boarders/lodgers）本身就被 RTA s8(1)(c) 明文排除。</li>
              </ul>

              <h3 className="sub">5.2 《Boarding Houses Act 2012》(NSW) — 5 人門檻</h3>
              <ul>
                <li><b>s5(2)：</b>「一般寄宿屋」= 收費提供床位俾 <b>5 名或以上</b>住客嘅處所（業主 / 經理 / 親屬唔計）。</li>
                <li><b>s9：</b>經營者必須向 Fair Trading 署長<b>登記</b>。關鍵：<b>s4 將租賃物業嘅「經營者」定義為「有權即時佔用物業嘅租客或分租客」</b>——即係總租營運商本人，唔止係物業擁有人。<span className="src">（AustLII 實時核對，法例版本 2023 年 1 月 13 日）</span></li>
                <li><b>罰則：</b>無登記經營——法團最高 100 罰金單位（<b>$11,000</b>）、個人 50 單位（<b>$5,500</b>）；NSW 每罰金單位 = $110。市政府亦可發罰款通知。</li>
                <li><b>s16：</b>市政府須喺登記後 12 個月內做首次合規調查（規劃、建築、消防）。</li>
                <li><b>附表 1 入住原則：</b>書面入住協議；按金上限 2 星期；加費須 4 星期通知；唔可以就違約罰款；住客可向 NCAT 申訴。</li>
              </ul>
              <div className="callout green">
                <h4>決定性嘅結構分野：分租客 ≠ 寄宿者</h4>
                <p>NSW 政府《Guide for Councils》講明：「住宅租賃安排受《Residential Tenancies Act 2010》規管，唔係《Boarding Houses Act》……處所至少要有一名寄宿者 / 借住者，BHA 先適用。」BHA s27 附註同樣指明：受 RTA 租約規管嘅處所唔係可登記寄宿屋。<b>換言之：5 名以上住客、每人一份書面 RTA 分租約、每間房有鎖並享有獨佔使用權 = 分租客，唔係寄宿者 = 唔使 BHA 登記。</b>但呢個分野睇事實唔睇標籤：如果營運商保留權力隨意調房、提供服務、或唔畀獨佔使用權，住客就可能被定性為寄宿者，5 人門檻即刻生效。<b>每間物業都要獨立攞法律意見，唔好靠自己貼標籤。</b></p>
              </div>
              <ul>
                <li>s5(3) 排除類別包括酒店 / 汽車旅館 / B&amp;B、背包旅舍、服務式公寓、<b>僱員宿舍</b>、學校、醫療 / 安老設施、退休村、社會房屋——但 s5(3) 本身<b>冇</b>對 RTA 租約嘅概括排除；RTA / BHA 分界建基於上述寄宿者 vs 租客之分。</li>
                <li>政治風險：悉尼市長 2025 年 8 月 25 日動議指出，2020 年 BHA 法定檢討嘅 21 項加強規管建議<b>至今未落實</b>——收緊寄宿屋規管係持續嘅政治議題。</li>
              </ul>

              <h3 className="sub">5.3 市政府規劃與建築分類</h3>
              <ul>
                <li>將住宅改為寄宿屋用途 = <b>用途變更，需要發展批准（DA）</b>；《Housing SEPP 2021》第 2 章第 3 部分要求審批時考慮低租寄宿屋流失，仲可以徵收金錢貢獻。<span className="src">（lexology，2025 年 8 月；<i>LFD Homes v Council of the City of Sydney</i> [2025] NSWLEC 1492/145）</span></li>
                <li>一間屋逐房租俾 5–6 個分租客，處於<b>灰色地帶</b>：市政府按事實判斷係咪寄宿屋用途（逐房獨立出租 + 有鎖房門 + 共用設施）。Inner West 同 City of Sydney 正<b>積極執法</b>——Annandale 一案接獲 50+ 宗投訴指懷疑未經批准改建寄宿屋，市政府更向地方法院申請搜查令。<span className="src">（SMH 經 worldbytenews，2025 年 2 月）</span></li>
                <li>間房工程仲可能觸發<b>建築分類</b>問題：Class 1a 住宅 vs Class 1b 寄宿屋（≤12 人、≤300m²）。Class 1b 需要由認可從業員發出<b>年度消防安全聲明（AFSS）</b>；市政府初步檢查費約 $369–$386。<span className="src">（Wollongong 市政府收費表）</span></li>
                <li>煙霧警報器屬強制安裝，業主須每年檢查。<span className="src">（nsw.gov.au）</span></li>
              </ul>

              <h3 className="sub">5.4 分契物業（Strata）</h3>
              <p>首選獨立屋、避開分契物業。分契附例（by-laws）可以限制短租、處理過度擠迫同噪音問題；用分契盤等於自找多一個監管者（業主立案法團），呢個模式唔需要。</p>

              <h3 className="sub">5.5 間房（間隔改動）觸發咩？</h3>
              <ul>
                <li><b>RTA s66：</b>租客未經業主同意唔可以改動物業 → 間房必須有總租約嘅<b>明文同意</b>。</li>
                <li>若被定性為寄宿屋：BHA 登記 + 市政府檢查 + 消防合規 + 用途變更 DA，全部跟住嚟。</li>
              </ul>

              <h3 className="sub">5.6 稅務與公司結構</h3>
              <ul>
                <li><b>GST：</b>住宅租金屬 input-taxed——唔收 GST，亦唔可以就相關成本 claim 回 GST。<span className="src">（ATO，2026 年 9 月 14 日更新，QC22427）</span></li>
                <li><b>土地稅：</b>營運商唔持有土地 → <b>冇土地稅負擔</b>。（業主嗰邊若物業係已登記寄宿屋或符 s10Q 豁免，係業主嘅事，同學生流轉模式關係有限。）</li>
                <li><b>外國人問題：</b>冇——營運者係澳洲公民，唔涉及 FIRB，亦冇 5% 外國人附加土地稅。</li>
                <li><b>入息稅：</b>分租租金收入按邊際稅率課稅；總租、保險、維修、管理成本可扣稅。<span className="src">（houst.com，2026 年 5 月）</span></li>
                <li><b>牌照（要同律師確認）：</b>以總租客身份做<b>主事人（principal）</b>經營，應該唔需要地產代理牌照同信託戶口（《Property and Stock Agents Act 2002》）。但如果改用<b>管理協議</b>結構（代業主收租），牌照同信託戶口兩樣都要。</li>
              </ul>

              <h3 className="sub">5.7 開業前合規清單（第一位租客入住之前）</h3>
              <ol className="steps">
                <li>成立公司 / ABN + 商業保險（公眾責任 + 財物）。</li>
                <li>簽總租約，約內含<b>分租明文同意</b>（s74）、改動同意（s66）、准許用途條款，同埋<b>解約 / 續約選項</b>（Hmlet 教訓）。</li>
                <li>就該物業嘅具體用途同強度，向當區市政府做規劃查詢。</li>
                <li>消防：互連煙霧警報器、滅火器 / 滅火氈、出口標示；若觸發 Class 1b 就要行 AFSS 程序。</li>
                <li>每間房一份<b>書面</b> RTA 分租約（標準表格；s10）。</li>
                <li>按金（上限 4 星期）經 <b>Rental Bonds Online</b> 存入；逐房做狀況報告。</li>
                <li>預繳租金只可以<b>要求</b> 2 星期（s33）；任何更大額預繳必須係租客自願並留有書面記錄（見第 6 節）。</li>
                <li>如果事實上係寄宿者模式兼住客 5 人以上：開業前先向 Fair Trading 登記（s9）。</li>
              </ol>
            </section>

            {/* ============ 6 港式模式 ============ */}
            <section id="s6">
              <h2><span className="no">06</span>香港模式可行性</h2>
              <p className="sec-sub">逐點拆解 Katie 問嘅三個問題：（a）總租再分租點先合法；（b）預收一年租金得唔得；（c）總租約要寫啲乜。</p>

              <h3 className="sub">(a) 總租 + 分租：點樣先合法？</h3>
              <div className="callout green">
                <h4>合法結構：總租約 + 每間房一份書面 RTA 分租約</h4>
                <p>即：業主同營運商簽總租約（RTA 租約，或向營運公司出租嘅商業租約），營運商再同每間房嘅租客簽獨立嘅<b>書面 RTA 分租約</b>。原因：</p>
                <ul>
                  <li><b>RTA s10：</b>有書面分租約嘅住客係 RTA 下嘅租客，享有完整保障——呢個係企得穩、辯護得到嘅法律基礎。</li>
                  <li>住客係有獨佔使用權嘅<b>分租客而唔係寄宿者</b>，BHA 登記網就唔會罩落嚟（NSW《Guide for Councils》；BHA s27 附註）。</li>
                  <li><b>寄宿 / 入住協議（boarding/occupancy agreement）係錯誤選擇：</b>住客 5 人以上即觸發 BHA 登記、市政府檢查、入住原則（按金上限 2 星期、加費 4 星期通知）同規劃風險——規管更重，但冇任何商業好處。</li>
                  <li>總租約必須含<b>成個物業分租嘅明文書面同意</b>（s74/s75，否則業主可任意拒絕），加埋間房改動嘅同意（s66）。</li>
                </ul>
              </div>

              <h3 className="sub">(b) 向分租客預收 12 個月、自己每月交總租：得唔得？</h3>
              <div className="callout red">
                <h4>唔得——唔可以作為要求。呢個係港式模式喺 NSW 最大嘅法律障礙</h4>
                <ul>
                  <li><b>RTA s33</b>（及 2025 年 5 月 19 日版標準租約第 4.1 條）：業主<b>唔可以要求</b>租客預繳超過 <b>2 星期</b>租金，亦唔可以要求租客喺上一段租期完結前繳付下一段租金。轉租嘅總租客喺呢條文下同樣係「業主」。違規罰則已被《Residential Tenancies Amendment (Protection of Personal Information) Bill 2025》提高（個人 50 罰金單位 / 法團 200 單位；生效狀態要再確認）。</li>
                  <li><b>唯一合法路徑：</b>條文附註容許租客「如其意願，可繳付多於 2 星期租金」。即係營運商可以<b>接受</b>真正自願嘅預繳，但<b>唔可以</b>將預繳列為批出租約嘅條件、唔可以喺廣告寫成必需、唔可以施壓。NCAT / Fair Trading 好可能會將「名義自願、實際強迫」當成「要求」處理。<span className="src">（Flatmates.com.au NSW 租金指南；LJ Hooker 引述 Fair Trading）</span></li>
                  <li><b>現金流 / 信託含意：</b>營運商以總租客身份收嘅租係自己嘅收入，唔係客戶資金，<b>冇信託戶口義務</b>（同持牌代理唔同）。但持有大額預繳會帶來：（i）租客風險——營運商一旦倒閉，預繳租客只係無抵押債權人（參照 Hmlet）；（ii）提早解約退款複雜（解約費有上限：按租期已過比例 4/3/2/1 星期）；（iii）潛在「不公平合約條款」審查。按金（上限 4 星期）無論如何都要存入 Fair Trading，唔可以自己持有。</li>
                  <li><b>合規嘅實際做法：</b>4 星期按金（存入官方系統）+ 2 星期預繳租金；可以為<b>自願</b>預繳一個學期提供小額折扣，並書面記錄係租客自己嘅選擇，附清晰退款時間表。<b>港式現金浮存唔可以當係資金來源嚟計數。</b></li>
                </ul>
              </div>

              <h3 className="sub">(c) 總租約必備條款</h3>
              <ol className="plain">
                <li><b>分租明文同意：</b>書面同意將整個物業逐房分租（s74/s75）。</li>
                <li><b>准許用途：</b>逐房住宅分租，並寫明住客人数上限。</li>
                <li><b>改動同意：</b>容許安裝 / 拆除非結構間隔、智能門鎖、標示（s66）；交還時嘅還原（make-good）責任要寫明。</li>
                <li><b>租期與退出：</b>2–3 年期，附<b>只限租客行使嘅解約權或續約選項</b>（Hmlet 教訓——永遠唔好簽冇退出權嘅長約）。</li>
                <li><b>租金機制：</b>固定總租；裝修免租期（2–4 星期）；雜費分攤（市政 / 水費嘅服務費 vs 用量費）；營運商轉嫁俾租客嘅水電由邊個出。</li>
                <li><b>合規成本分攤：</b>若市政府將用途定性為寄宿屋，消防升級同規劃風險由邊個承擔，要預先寫明。</li>
                <li><b>保險：</b>雙方各自嘅保險責任；營運商嘅公眾責任保要通知業主知悉。</li>
                <li><b>終止保障：</b>限制業主嘅終止權，唔好因為業主賣樓或改變主意而令分租客被迫遷出——嗰筆 NCAT 責任係營運商孭嘅。</li>
              </ol>
            </section>

            {/* ============ 7 財務模型 ============ */}
            <section id="s7">
              <h2><span className="no">07</span>財務模型與回本期</h2>
              <p className="sec-sub">一個完整做得落去嘅例子：Kingsford（UNSW 旁）一間 5 房獨立屋。所有假設逐項列明；標示「估算」者為研究員假設，並非市場實數。</p>

              <h3 className="sub">假設</h3>
              <div className="tbl-wrap">
                <table className="stack">
                  <thead><tr><th>項目</th><th>假設</th><th>依據</th></tr></thead>
                  <tbody>
                    <tr><td data-l="項目">總租租金</td><td data-l="假設"><b>$1,900/週</b>（估算）</td><td data-l="依據">Domain 2026 年 10 月 Kingsford 5 房放盤 $1,800–$2,900；$1,900 約為中段價低 5%，假設有小額總租折扣（未核實）</td></tr>
                    <tr><td data-l="項目">可租出房間</td><td data-l="假設"><b>6 間</b>（5 房 + 1 間客廳改房）</td><td data-l="依據">需業主改動同意（s66）；規劃 / 建築分類風險已標示</td></tr>
                    <tr><td data-l="項目">每房租金</td><td data-l="假設"><b>$400/週</b>，全包（傢俬、水電、NBN）</td><td data-l="依據">Flatmates.com.au Kingsford $380–$500；amberstudent Kingsford 5 房 $300–$460（售罄）；Muse Living Bondi 由 $380 起；UNSW 價格帶 $250–$650</td></tr>
                    <tr><td data-l="項目">入住率（基準）</td><td data-l="假設"><b>90%</b>（估算）</td><td data-l="依據">UKO 機構級 98%；非正式營運商較低，90% 為估算</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="sub">一次性投入（Capex）</h3>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>項目</th><th className="n">成本 A$</th></tr></thead>
                  <tbody>
                    <tr><td>每房傢俬 / 床品（6 × $2,000）</td><td className="n">12,000</td></tr>
                    <tr><td>智能門鎖（7 道門 × 約 $450 連安裝；市場範圍 $350–$950，eufy AU 2025–26）</td><td className="n">3,150</td></tr>
                    <tr><td>間隔工程（多間一房）</td><td className="n">4,000</td></tr>
                    <tr><td>消防（互連警報器、滅火器、滅火氈、標示）</td><td className="n">1,500</td></tr>
                    <tr><td>床單 / 廚房 starter pack（6 × $200）</td><td className="n">1,200</td></tr>
                    <tr className="total"><td>總 capex</td><td className="n">約 21,850 ≈ 22,000</td></tr>
                  </tbody>
                </table>
                <p className="tbl-note">除智能門鎖價格範圍外，以上均為估算。</p>
              </div>

              <h3 className="sub">每週損益（基準情境，入住率 90%）</h3>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>項目</th><th className="n">A$/週</th></tr></thead>
                  <tbody>
                    <tr><td>收入：6 房 × $400 × 90%</td><td className="n">2,160</td></tr>
                    <tr><td>總租租金</td><td className="n">(1,900)</td></tr>
                    <tr><td>水電煤 + NBN（估算）</td><td className="n">(170)</td></tr>
                    <tr><td>清潔（兩週一次公共範圍 + 換客攤分，估算）</td><td className="n">(75)</td></tr>
                    <tr><td>保險（財物 + 公眾責任，估算）</td><td className="n">(35)</td></tr>
                    <tr><td>維修 / 損耗撥備（估算）</td><td className="n">(50)</td></tr>
                    <tr><td>軟件 / 行政 / 放盤（估算）</td><td className="n">(40)</td></tr>
                    <tr className="total neg"><td>淨額</td><td className="n">−110/週 ≈ −5,720/年</td></tr>
                  </tbody>
                </table>
                <p className="tbl-note"><b>點讀呢張表：</b>基準情境係<b>輕微虧蝕</b>。收支平衡點 ≈ 每房 $420/週（入住率 90%），或者入住率 95%（每房 $400）。模式要成立，至少要有以下一項：7 間房以上、優質房租、或低於市價嘅總租。</p>
              </div>

              <h3 className="sub">互動試算：自己拉下數</h3>
              <div className="calc" id="calc">
                <h4>分租利潤試算器</h4>
                <p className="hint">預設值 = 上面 Kingsford 基準情境。固定營運成本沿用研究假設：除總租外 $370/週（水電 NBN $170 + 清潔 $75 + 保險 $35 + 維修損耗 $50 + 軟件行政 $40）；capex 按每房約 $3,650 攤算間房、消防等公共成本，預設 6 房 ≈ $22,000。拉去 Campsie 水平嘅總租（約 $1,000/週）可以即刻睇到地區選擇有幾決定性。</p>
                <div className="calc-grid">
                  <div className="ctl">
                    <label>可租出房間 <output>{rooms} 間</output></label>
                    <input type="range" min={4} max={9} step={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
                  </div>
                  <div className="ctl">
                    <label>每房週租（全包） <output>{"$" + rent}</output></label>
                    <input type="range" min={280} max={600} step={10} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
                  </div>
                  <div className="ctl">
                    <label>入住率 <output>{occ}%</output></label>
                    <input type="range" min={70} max={100} step={1} value={occ} onChange={(e) => setOcc(Number(e.target.value))} />
                  </div>
                  <div className="ctl">
                    <label>總租租金（每週） <output>{"$" + head.toLocaleString("en-AU")}</output></label>
                    <input type="range" min={800} max={2600} step={25} value={head} onChange={(e) => setHead(Number(e.target.value))} />
                  </div>
                </div>
                <div className="calc-out">
                  <div><span>每週淨額</span><b className={week < 0 ? "neg" : "pos"}>{fmt(week)} / 週</b></div>
                  <div><span>每年淨額</span><b className={year < 0 ? "neg" : "pos"}>{fmt(year)} / 年</b></div>
                  <div><span>Capex 回本期</span>{year > 0 ? (
                      <b className="pos">約 {(capex / year).toFixed(1)} 年</b>
                    ) : (
                      <b className="neg">無回本期（現金流為負）</b>
                    )}</div>
                </div>
                <p className="calc-note">試算為簡化模型：未計入息稅、放租空置期之間嘅廣告費，同埋按金等一次性現金佔用（見下方組合表）；結果只可用作比較情境，唔係盈利預測。</p>
              </div>

              <h3 className="sub">敏感度分析 — 每年利潤 /（虧損）A$</h3>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>入住率 ＼ 每房週租</th><th className="n">$360（−10%）</th><th className="n">$400（基準）</th><th className="n">$440（+10%）</th></tr></thead>
                  <tbody>
                    <tr><td><b>80%</b></td><td className="n neg">−28,184</td><td className="n neg">−18,200</td><td className="n neg">−8,216</td></tr>
                    <tr><td><b>90%</b></td><td className="n neg">−16,952</td><td className="n neg"><b>−5,720</b></td><td className="n pos">+5,512</td></tr>
                    <tr><td><b>95%</b></td><td className="n neg">−11,336</td><td className="n pos">+520</td><td className="n pos">+12,376</td></tr>
                  </tbody>
                </table>
                <p className="tbl-note">固定成本基數：$2,270/週 × 52 = $118,040/年。收入 = 6 房 × 房租 × 52 × 入住率。</p>
              </div>

              <h3 className="sub">空置撥備視角 + 回本</h3>
              <ul>
                <li>以每房 $400 計：每房每年空置 2 週（≈96% 入住率）→ <b>+$1,960/年</b>；空置 4 週（≈92%）→ <b>−$2,840/年</b>；空置 8 週（≈85%）→ <b>−$12,440/年</b>。學期之間嘅空窗期就係利潤生死線。</li>
                <li><b>回本期：</b>基準情境現金流為負，<b>冇回本期</b>。樂觀情境（95% 入住率、每房 $440：+$12,376/年）下，$22,000 capex 約 <b>1.8 年</b>回本。</li>
                <li><b>「可行的配置」示範（估算）：</b>7 間房 × $400/週 × 92% 入住率，總租 $1,850/週 → 收入 $133,952/年、成本 $117,520/年 → <b>+$16,432/年</b>；約 $24,000 capex 約 <b>1.5 年</b>回本。前提係取得間房同意兼長期維持 92% 入住率——完全取決於執行。</li>
              </ul>

              <h3 className="sub">3 間屋組合 — 第一年現金狀況（估算）</h3>
              <div className="tbl-wrap">
                <table>
                  <thead><tr><th>項目</th><th className="n">A$</th></tr></thead>
                  <tbody>
                    <tr><td>裝修 capex（3 × $24,000）</td><td className="n neg">−72,000</td></tr>
                    <tr><td>總租按金，每份 4 週（3 × $7,400；可退回，存入 Fair Trading）</td><td className="n neg">−22,200</td></tr>
                    <tr><td>首 2 週總租（3 × $3,700）</td><td className="n neg">−11,100</td></tr>
                    <tr><td>營運資金緩衝（2 個月總租）</td><td className="n neg">−44,400</td></tr>
                    <tr><td>第一年營運現金流（3 × $16,432，「可行配置」情境）</td><td className="n pos">+49,296</td></tr>
                    <tr className="total"><td>第一年淨現金狀況</td><td className="n">約 −100,400</td></tr>
                  </tbody>
                </table>
                <p className="tbl-note">即係：開 3 間屋要預備約 <b>$150,000</b> 資金先有回報；就算「可行配置」假設全部成立，累計現金都要去到第 2 年打後先轉正。若用返基準情境配置，組合每年淨燒約 $17,000 營運虧損（未計 capex）。</p>
              </div>
            </section>

            {/* ============ 8 風險 ============ */}
            <section id="s8">
              <h2><span className="no">08</span>風險評估</h2>
              <p className="sec-sub">按「可能性 × 影響」排序，每項附緩解方法。</p>

              <div className="tbl-wrap">
                <table className="stack">
                  <thead><tr><th>#</th><th>風險</th><th>級別</th><th>緩解方法</th></tr></thead>
                  <tbody>
                    <tr>
                      <td data-l="#">1</td>
                      <td data-l="風險"><b>總租負債冇退出權</b>——總租係固定開支，收入隨入住率浮動；正係 Hmlet 死因（欠債 $508k、走 7 份約，2021 年）</td>
                      <td data-l="級別"><span className="risk-chip rk-hh">高 × 極高</span></td>
                      <td data-l="緩解方法">只限租客行使嘅解約條款，或 12 個月首期 + 續約選項；裝修免租期；永遠唔簽冇退出權嘅長約；總租控制喺房租潛在總收入 75% 以內</td>
                    </tr>
                    <tr>
                      <td data-l="#">2</td>
                      <td data-l="風險"><b>空置 / 季節性</b>——學生入學週期（高峰 1 月底–2 月、8–9 月；低谷 12 月中–1 月初）</td>
                      <td data-l="級別"><span className="risk-chip rk-hh">高 × 高</span></td>
                      <td data-l="緩解方法">租約對齊學期；完約前 8–10 週啟動再放租；暑期折扣 / 短租填補；分散客源至工作人員（UTS / Macquarie 通勤圈、醫院區）</td>
                    </tr>
                    <tr>
                      <td data-l="#">3</td>
                      <td data-l="風險"><b>監管重新定性</b>——市政府或 Fair Trading 將物業視為未登記寄宿屋（住客 5+）：登記、檢查、消防命令、用途變更 DA 全部跟住嚟</td>
                      <td data-l="級別"><span className="risk-chip rk-mh">中 × 高</span></td>
                      <td data-l="緩解方法">逐房書面 RTA 分租約 + 獨佔使用權；減少任何指向「寄宿者」身份嘅事實（唔好保留調房權等）；簽約前做規劃 / 消防評估；每間物業攞法律簽核</td>
                    </tr>
                    <tr>
                      <td data-l="#">4</td>
                      <td data-l="風險"><b>欠租與仲裁風險</b>——營運商對 6–7 名分租客負全份業主責任（維修、按金存入、終止程序）；NCAT 申索逐房倍增</td>
                      <td data-l="級別"><span className="risk-chip rk-mh">中 × 高</span></td>
                      <td data-l="緩解方法">嚴格欠租流程（14 日通知）；按金全數存入官方系統；狀況報告齊全；業主式保險；只接受真正自願預繳並附退款時間表</td>
                    </tr>
                    <tr>
                      <td data-l="#">5</td>
                      <td data-l="風險"><b>損耗</b>——6–7 名住客 + 高流轉加速傢俬同裝修折舊</td>
                      <td data-l="級別"><span className="risk-chip rk-mm">中 × 中</span></td>
                      <td data-l="緩解方法">定價內含 $50/週維修撥備；入住 / 退租檢查；按 RTA 扣按金；用耐用嘅商用級傢俬</td>
                    </tr>
                    <tr>
                      <td data-l="#">6</td>
                      <td data-l="風險"><b>競爭</b>——PBSA（Scape / Iglu / Urbanest $380–$800/週）同機構 coliving（UKO 入住率 98%；Knight Frank 指約 10,000 間籌備中單位）壓縮房租上行空間</td>
                      <td data-l="級別"><span className="risk-chip rk-mm">中 × 中</span></td>
                      <td data-l="緩解方法">定價比 PBSA 平 15–30%；賣點係彈性（唔使簽 12 個月）、貼近個別校園嘅位置、社群感</td>
                    </tr>
                    <tr>
                      <td data-l="#">7</td>
                      <td data-l="風險"><b>消防升級成本</b>——被重新分類為 Class 1b 會觸發 AFSS、認可從業員檢查同潛在升級命令（估算 $1,500–$5,000+）</td>
                      <td data-l="級別"><span className="risk-chip rk-mh">低–中 × 高</span></td>
                      <td data-l="緩解方法">簽總租<b>之前</b>做消防評估；傾約時將升級成本撥歸業主，或以免租期抵償</td>
                    </tr>
                    <tr>
                      <td data-l="#">8</td>
                      <td data-l="風險"><b>分契糾紛</b>——附例違規（過度擠迫、噪音）、短租限制</td>
                      <td data-l="級別"><span className="risk-chip rk-lm">低 × 中</span></td>
                      <td data-l="緩解方法">完全避開分契物業，只做獨立屋</td>
                    </tr>
                    <tr>
                      <td data-l="#">9</td>
                      <td data-l="風險"><b>利率 / 宏觀</b>——營運商本身冇借貸，直接影響有限；但利率帶動嘅投資者活動會影響總租盤供應同租金水平</td>
                      <td data-l="級別"><span className="risk-chip rk-lm">低 × 中</span></td>
                      <td data-l="緩解方法">租期內鎖定固定總租；定期睇 Domain / Cotality 季度租金報告（2026 年 9 月已見首次緩和）</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ============ 未能核實 ============ */}
            <section id="gaps">
              <h2><span className="no">§</span>未能核實嘅事項</h2>
              <p className="sec-sub">以下各點喺研究期間搵唔到可靠來源，落決定前要逐項補齊——唔好當佢哋唔存在。</p>
              <ol className="plain">
                <li><b>悉尼本地總租約條款範本</b>（租期、對市價折扣、雜費分攤）——冇營運商公開；第 3 節嘅英國 R2R 規範只作參考。</li>
                <li><b>小型 / 非正式營運商嘅入住率</b>——只有 UKO（98%）同 Together（約 95%，新加坡媒體數字）有公開宣稱。</li>
                <li><b>分租營運商嘅人手比例同管理軟件</b>——冇公開數據。</li>
                <li><b>典型 5–6 房改建嘅消防升級工程成本</b>——只有市政府收費表有來源；工程費用屬估算。</li>
                <li><b>Campsie / Hurstville 同 Macquarie 一帶</b>一致口徑嘅 2025–26 分區租金中位數。</li>
                <li><b>2025 年修訂法案就 s33 罰則提高嘅生效狀態</b>——引用罰則數字前要查最新生效情況。</li>
                <li><b>向營運公司出租嘅總租約，實務上會否被當作商業（非 RTA）租約</b>——影響業主與營運商之間適用邊套同意 / 終止規則，要律師就架構俾意見。</li>
              </ol>
            </section>

            <footer className="foot">
              <h2>來源與說明</h2>
              <p><b>法例（AustLII 實時核對）：</b>《Residential Tenancies Act 2010》(NSW) ss 8(1)(c)、10、33、66、74、75（版本至 2026 年 6 月 10 日）；《Boarding Houses Act 2012》(NSW) ss 4、5、9、16、27 附註、附表 1（版本至 2023 年 1 月 13 日）。<b>政府資料：</b>nsw.gov.au「Sharing a residential rental property」（2026 年 10 月 20 日）、「Costs at the start of a residential tenancy」（2026 年 9 月 28 日）；Fair Trading Tenant Information Statement（2025 年 5 月）；標準租約表格第 4.1 條（2025 年 5 月 19 日）；《Guide for Councils to the Boarding Houses Act 2012》（2013 年 6 月）；Revenue NSW 寄宿屋土地稅豁免 LT-119（2026 年 5 月 25 日更新）；ATO 住宅物業 GST（2026 年 9 月 14 日更新，QC22427）；悉尼市長寄宿屋改革動議（2025 年 8 月 25 日）。</p>
              <p><b>市場數據：</b>SQM Research 經 PropertyMe（2025 年 10 月）；Domain 租金報告（2025 年 9 月；2026 年 9 月經 API Magazine 2026 年 10 月）；Cotality（2026 年 9 月）；CBRE Apartment Vacancy &amp; Rent Outlook H2 2025（2025 年 9 月）；Knight Frank Co-Living Report 2025（經 commercialrealestate.com.au，2026 年 3 月）；AreaSearch 分區數據（NSW 按金登記至 2026 年 6 月，2026 年 10 月讀取）；YourMortgage（2025 年 2 月）；Flatmates.com.au 全國合租調查（2024 年 11 月）；Admistay（2026 年 11 月）；Erasmus Play（2026 年 11 月）。<b>學生數據：</b>Business Sydney / Study NSW 報告（2025 年 9 月）；Audit Office of NSW Universities 2024（經 NSW Parliament 文件，2025 年 10 月）；The Australian（2025 年 10 月）；教育部（2026 年 5 月年至今）；UNSW 校外住宿及學期日期。<b>營運商與定價：</b>uko.com.au、globalawards.news（2026 年 11 月）、uniacco.com、amberstudent.com、semesterinaustralia.com、livinghigh.com.au、holafly coliving 指南（2026）、latrobe.edu.au、leverageedu.com。<b>失敗案例：</b>Business Times / AFR（2021 年 5 月 31 日）、Straits Times（2021 年 5 月）、Tech in Asia（2021 年 5 月）。<b>營運：</b>WhichRealEstateAgent 2026 收費指南、Golden View（2026 年 10 月）、eufy AU 智能鎖數據（2025–26）、Wollongong 市政府消防收費、Domain 及 realestate.com.au 放盤（2026 年 10 月；2026 年 1–2 月）。<b>執法 / 規劃：</b>SMH 經 worldbytenews（2025 年 2 月，Annandale 案）；<i>LFD Homes v Council of the City of Sydney</i> [2025] NSWLEC 1492、145（經 lexology，2025 年 8 月）。</p>
              <p>本報告為研究資料整理，唔構成法律或投資建議；文中標示「估算」者為研究員按列明假設計算嘅數字。落實任何物業交易或租約結構前，應就個別物業取得 NSW 律師同會計師意見。報告數據截至 2026 年 11 月 4 日。</p>
            </footer>

          </div>
    </div>
  );
}
