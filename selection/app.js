(() => {
  "use strict";

  const data = Array.isArray(window.SELECTION_DATA) ? window.SELECTION_DATA : [];
  const list = document.querySelector("#program-list");
  const emptyState = document.querySelector("#empty-state");
  const resultCount = document.querySelector("#result-count");
  const projectTotal = document.querySelector("#project-total");
  const search = document.querySelector("#search");
  const schoolFilter = document.querySelector("#school-filter");
  const categoryFilter = document.querySelector("#category-filter");
  const verdictFilter = document.querySelector("#verdict-filter");
  const evidenceFilter = document.querySelector("#evidence-filter");
  const sortOrder = document.querySelector("#sort-order");

  const verdictRank = { "优先入读": 4, "有条件可读": 3, "只作备选": 2, "不建议入读": 1 };
  const badgeClass = { "优先入读": "priority", "有条件可读": "conditional", "只作备选": "backup", "不建议入读": "reject" };
  const programMeta = {
    "Northwestern Medill — IMC": { school: "Northwestern", schoolZh: "西北大学梅迪尔新闻学院", programZh: "整合营销传播（IMC）" },
    "NYU SPS — MS Integrated Marketing": { school: "NYU", schoolZh: "纽约大学职业研究学院", programZh: "整合营销理学硕士" },
    "USC Marshall — MS Marketing Analytics": { school: "USC", schoolZh: "南加州大学马歇尔商学院", programZh: "营销分析理学硕士" },
    "Georgetown — MPS IMC": { school: "Georgetown", schoolZh: "乔治城大学", programZh: "整合营销传播专业研究硕士" },
    "Cornell Dyson — MPS AEM": { school: "Cornell", schoolZh: "康奈尔大学戴森学院", programZh: "应用经济与管理专业硕士" },
    "Northwestern McCormick — MS Project Management": { school: "Northwestern", schoolZh: "西北大学麦考密克工学院", programZh: "项目管理理学硕士" },
    "NYU Tandon — MS Management of Technology": { school: "NYU", schoolZh: "纽约大学坦登工程学院", programZh: "技术管理理学硕士" },
    "Duke Kunshan — MMS": { school: "Duke Kunshan", schoolZh: "昆山杜克大学", programZh: "管理学硕士" },
    "Columbia SPS — MS Enterprise Risk Management": { school: "Columbia", schoolZh: "哥伦比亚大学职业研究学院", programZh: "企业风险管理理学硕士" },
    "Columbia SPS — MS Applied Analytics": { school: "Columbia", schoolZh: "哥伦比亚大学职业研究学院", programZh: "应用分析理学硕士" },
    "Duke Fuqua — MQM Business Analytics": { school: "Duke", schoolZh: "杜克大学福库阿商学院", programZh: "管理学硕士（商业分析）", projectUrl: "https://www.fuqua.duke.edu/programs/mqm-business-analytics" },
    "Johns Hopkins Carey — BAAI": { school: "Johns Hopkins", schoolZh: "约翰斯·霍普金斯大学凯瑞商学院", programZh: "商业分析与人工智能理学硕士", projectUrl: "https://carey.jhu.edu/programs/master-science-programs/ms-business-analytics-and-artificial-intelligence" },
    "University of Michigan — Ross MBAn / Applied Economics": {
      school: "Michigan",
      schoolZh: "密歇根大学",
      programZh: "罗斯商业分析硕士 / 应用经济学",
      projectLinks: [
        { label: "Ross MBAn 官网", url: "https://michiganross.umich.edu/graduate/master-of-business-analytics" }
      ]
    },
    "USC Marshall — MS Business Analytics": { school: "USC", schoolZh: "南加州大学马歇尔商学院", programZh: "商业分析理学硕士", projectUrl: "https://www.marshall.usc.edu/programs/graduate-programs/specialized-masters/ms-business-analytics" },
    "UNC Kenan-Flagler — MS Business Analytics": { school: "UNC", schoolZh: "北卡罗来纳大学教堂山分校凯南-弗拉格勒商学院", programZh: "商业分析理学硕士" },
    "Notre Dame / UC Irvine — MS Business Analytics": {
      school: "Notre Dame / UC Irvine",
      schoolZh: "圣母大学 / 加州大学欧文分校",
      programZh: "商业分析理学硕士",
      projectLinks: [
        { label: "Notre Dame MSBA 官网", url: "https://mendoza.nd.edu/graduate-programs/business-analytics-msba/" },
        { label: "UC Irvine MSBA 官网", url: "https://merage.uci.edu/programs/masters/master-science-business-analytics/index.html" }
      ]
    },
    "UC Berkeley — MaCSS": { school: "UC Berkeley", schoolZh: "加州大学伯克利分校", programZh: "计算社会科学硕士", projectUrl: "https://macss.berkeley.edu/" },
    "Columbia GSAS — QMSS": { school: "Columbia", schoolZh: "哥伦比亚大学文理研究生院", programZh: "社会科学定量方法硕士", projectUrl: "https://qmss.columbia.edu/" },
    "UChicago — MACSS": { school: "UChicago", schoolZh: "芝加哥大学", programZh: "计算社会科学文学硕士", projectUrl: "https://macss.uchicago.edu/" },
    "Cornell — Health Policy Economics（当前名称待核）": { school: "Cornell", schoolZh: "康奈尔大学", programZh: "健康政策经济学（项目名称待核）" },
    "Penn SP2 — MSSP+DA / SPDA": { school: "Penn", schoolZh: "宾夕法尼亚大学社会政策与实践学院", programZh: "社会政策数据分析方向" },
    "Johns Hopkins AAP — Applied Economics": { school: "Johns Hopkins", schoolZh: "约翰斯·霍普金斯大学高级学术项目部", programZh: "应用经济学硕士" },
    "UChicago Harris — Master of Public Policy (MPP)": { school: "UChicago", schoolZh: "芝加哥大学哈里斯公共政策学院", programZh: "公共政策硕士" },
    "Yale Jackson — Master in Public Policy in Global Affairs": { school: "Yale", schoolZh: "耶鲁大学杰克逊全球事务学院", programZh: "全球事务公共政策硕士" },
    "CUHK — Marketing / Management / IST Management": { school: "CUHK", schoolZh: "香港中文大学", programZh: "市场营销 / 管理学 / 信息系统管理" },
    "NTU — Project Management / TIP": { school: "NTU", schoolZh: "南洋理工大学", programZh: "项目管理 / TIP（科技创业与创新）" },
    "HKUST — Marketing / Global Operations / International Management": { school: "HKUST", schoolZh: "香港科技大学", programZh: "市场营销 / 全球运营 / 国际管理" },
    "NUS — Information Studies / Sustainable Healthcare Management": { school: "NUS", schoolZh: "新加坡国立大学", programZh: "信息研究 / 可持续医疗管理" },
    "HKU — E-commerce & Internet Computing": { school: "HKU", schoolZh: "香港大学", programZh: "电子商务与互联网计算" },
    "CMU Heinz — MISM-BIDA Pathway": { school: "CMU", schoolZh: "卡内基梅隆大学海因茨学院", programZh: "信息系统管理硕士 BIDA 方向" },
    "Penn — MEDS / 环境数据科学（准确名称待核）": { school: "Penn", schoolZh: "宾夕法尼亚大学", programZh: "MEDS / 环境数据科学（准确名称待核）" },
    "BU / JHU — Quantitative or Mathematical Finance": { school: "BU / JHU", schoolZh: "波士顿大学 / 约翰斯·霍普金斯大学", programZh: "定量金融或数学金融" },
    "Columbia — Statistics / Actuarial Science": { school: "Columbia", schoolZh: "哥伦比亚大学", programZh: "统计学 / 精算科学" },
    "USC — Accounting / Spatial Economics": { school: "USC", schoolZh: "南加州大学", programZh: "会计学 / 空间经济学" },
    "UCI Merage — MS Business Analytics": { school: "UC Irvine", schoolZh: "加州大学欧文分校梅拉吉商学院", programZh: "商业分析理学硕士", projectUrl: "https://merage.uci.edu/programs/masters/master-science-business-analytics/index.html" },
    "Notre Dame Mendoza — MS Business Analytics": { school: "Notre Dame", schoolZh: "圣母大学门多萨商学院", programZh: "商业分析理学硕士", projectUrl: "https://mendoza.nd.edu/graduate-programs/business-analytics-msba/" }
  };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const option = (value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`;
  const unique = (key) => [...new Set(data.map((item) => item[key]))].filter(Boolean);
  const getProgramMeta = (item) => programMeta[item.name] || null;
  const getSchoolName = (item) => getProgramMeta(item)?.school || item.name.split(" — ")[0];
  const getProjectLinks = (item) => {
    const meta = getProgramMeta(item);
    if (Array.isArray(meta?.projectLinks) && meta.projectLinks.length) return meta.projectLinks;
    if (meta?.projectUrl) return [{ label: "项目官网", url: meta.projectUrl }];
    if (item.officialUrl) return [{ label: "项目官网 / 官网证据", url: item.officialUrl }];
    return [];
  };

  schoolFilter.insertAdjacentHTML("beforeend", [...new Set(data.map((item) => getSchoolName(item)))].filter(Boolean).sort((a, b) => a.localeCompare(b, "en")).map(option).join(""));
  categoryFilter.insertAdjacentHTML("beforeend", unique("cat").map(option).join(""));
  verdictFilter.insertAdjacentHTML("beforeend", ["优先入读", "有条件可读", "只作备选", "不建议入读"].map(option).join(""));
  evidenceFilter.insertAdjacentHTML("beforeend", ["已核实", "部分核实", "待确认", "非美国项目"].map(option).join(""));
  if (projectTotal) projectTotal.textContent = String(data.length);

  function scoreBox(label, score) {
    const safeScore = Math.max(0, Math.min(5, Number(score) || 0));
    return `
      <div class="score-box">
        <div class="score-label"><span>${escapeHtml(label)}</span><strong>${safeScore.toFixed(1)} / 5</strong></div>
        <div class="meter" aria-label="${escapeHtml(label)} ${safeScore.toFixed(1)} 分"><i style="width:${safeScore * 20}%"></i></div>
      </div>`;
  }

  function cardTemplate(item) {
    const risks = (item.risks || []).map((risk) => `<li>${escapeHtml(risk)}</li>`).join("");
    const meta = getProgramMeta(item);
    const projectLinks = getProjectLinks(item);
    const evidenceIsSeparate = item.officialUrl && !projectLinks.some((link) => link.url === item.officialUrl);
    return `
      <details class="program-card" data-verdict="${escapeHtml(item.enroll)}">
        <summary>
          <div class="program-title-wrap">
            <div class="program-category">${escapeHtml(item.cat)} · 申请 ${escapeHtml(item.apply)}</div>
            <h3 class="program-title">${escapeHtml(item.name)}</h3>
            ${meta ? `<p class="program-title-cn">${escapeHtml(meta.schoolZh)}｜${escapeHtml(meta.programZh)}</p>` : ""}
          </div>
          <div class="badges">
            <span class="badge ${badgeClass[item.enroll] || "backup"}">${escapeHtml(item.enroll)}</span>
            <span class="badge">${escapeHtml(item.evidence)}</span>
          </div>
        </summary>
        <div class="program-content">
          <div class="score-grid">
            ${scoreBox("背景匹配", item.profileFit)}
            ${scoreBox("留美路径", item.stayFit)}
            <div class="score-box evidence-box">
              <strong>STEM / 身份证据 · ${escapeHtml(item.evidence)}</strong>
              <p>${escapeHtml(item.stem)}</p>
              ${(projectLinks.length || item.officialUrl) ? `<div class="evidence-links">
                ${projectLinks.map((link) => `<a class="official-link" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`).join("")}
                ${evidenceIsSeparate ? `<a class="official-link" href="${escapeHtml(item.officialUrl)}" target="_blank" rel="noreferrer">学校官网证据 ↗</a>` : ""}
              </div>` : ""}
            </div>
          </div>
          <div class="analysis-grid">
            <section class="analysis-block"><h4>目标岗位</h4><p>${escapeHtml(item.roles)}</p></section>
            <section class="analysis-block"><h4>为什么像你</h4><p>${escapeHtml(item.fitReason)}</p></section>
            <section class="analysis-block"><h4>留美逻辑</h4><p>${escapeHtml(item.stayReason)}</p></section>
            <section class="analysis-block"><h4>主要风险</h4><ul>${risks}</ul></section>
            <section class="analysis-block conclusion"><h4>一句话结论</h4><p>${escapeHtml(item.bottomLine)}</p></section>
          </div>
        </div>
      </details>`;
  }

  function getFilteredData() {
    const query = search.value.trim().toLocaleLowerCase("zh-CN");
    const school = schoolFilter.value;
    const category = categoryFilter.value;
    const verdict = verdictFilter.value;
    const evidence = evidenceFilter.value;

    const filtered = data.filter((item) => {
      const meta = getProgramMeta(item);
      const haystack = [
        item.name,
        getSchoolName(item),
        meta?.schoolZh,
        meta?.programZh,
        item.cat,
        item.roles,
        item.fitReason,
        item.bottomLine
      ].join(" ").toLocaleLowerCase("zh-CN");
      return (!query || haystack.includes(query))
        && (school === "all" || getSchoolName(item) === school)
        && (category === "all" || item.cat === category)
        && (verdict === "all" || item.enroll === verdict)
        && (evidence === "all" || item.evidence === evidence);
    });

    return filtered.sort((a, b) => {
      if (sortOrder.value === "profile") return b.profileFit - a.profileFit || b.stayFit - a.stayFit;
      if (sortOrder.value === "stay") return b.stayFit - a.stayFit || b.profileFit - a.profileFit;
      if (sortOrder.value === "name") return a.name.localeCompare(b.name, "zh-CN");
      return (verdictRank[b.enroll] - verdictRank[a.enroll]) || (b.stayFit - a.stayFit) || (b.profileFit - a.profileFit);
    });
  }

  function render() {
    const filtered = getFilteredData();
    list.innerHTML = filtered.map(cardTemplate).join("");
    resultCount.textContent = String(filtered.length);
    emptyState.hidden = filtered.length !== 0;
    list.hidden = filtered.length === 0;
  }

  function resetFilters() {
    search.value = "";
    schoolFilter.value = "all";
    categoryFilter.value = "all";
    verdictFilter.value = "all";
    evidenceFilter.value = "all";
    sortOrder.value = "recommended";
    render();
  }

  [search, schoolFilter, categoryFilter, verdictFilter, evidenceFilter, sortOrder].forEach((control) => {
    control.addEventListener(control === search ? "input" : "change", render);
  });

  document.querySelector("#expand-all").addEventListener("click", () => {
    list.querySelectorAll("details").forEach((card) => { card.open = true; });
  });
  document.querySelector("#collapse-all").addEventListener("click", () => {
    list.querySelectorAll("details").forEach((card) => { card.open = false; });
  });
  document.querySelector("#clear-filters").addEventListener("click", resetFilters);
  document.querySelector("#open-priority").addEventListener("click", () => {
    verdictFilter.value = "优先入读";
    render();
    document.querySelector("#decision-board").scrollIntoView({ behavior: "smooth" });
  });

  render();
})();
