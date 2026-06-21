(() => {
  "use strict";

  const data = Array.isArray(window.SELECTION_DATA) ? window.SELECTION_DATA : [];
  const list = document.querySelector("#program-list");
  const emptyState = document.querySelector("#empty-state");
  const resultCount = document.querySelector("#result-count");
  const search = document.querySelector("#search");
  const categoryFilter = document.querySelector("#category-filter");
  const verdictFilter = document.querySelector("#verdict-filter");
  const evidenceFilter = document.querySelector("#evidence-filter");
  const sortOrder = document.querySelector("#sort-order");

  const verdictRank = { "优先入读": 4, "有条件可读": 3, "只作备选": 2, "不建议入读": 1 };
  const badgeClass = { "优先入读": "priority", "有条件可读": "conditional", "只作备选": "backup", "不建议入读": "reject" };

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const option = (value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`;
  const unique = (key) => [...new Set(data.map((item) => item[key]))].filter(Boolean);

  categoryFilter.insertAdjacentHTML("beforeend", unique("cat").map(option).join(""));
  verdictFilter.insertAdjacentHTML("beforeend", ["优先入读", "有条件可读", "只作备选", "不建议入读"].map(option).join(""));
  evidenceFilter.insertAdjacentHTML("beforeend", ["已核实", "部分核实", "待确认", "非美国项目"].map(option).join(""));

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
    return `
      <details class="program-card" data-verdict="${escapeHtml(item.enroll)}">
        <summary>
          <div class="program-title-wrap">
            <div class="program-category">${escapeHtml(item.cat)} · 申请 ${escapeHtml(item.apply)}</div>
            <h3 class="program-title">${escapeHtml(item.name)}</h3>
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
    const category = categoryFilter.value;
    const verdict = verdictFilter.value;
    const evidence = evidenceFilter.value;

    const filtered = data.filter((item) => {
      const haystack = [item.name, item.cat, item.roles, item.fitReason, item.bottomLine].join(" ").toLocaleLowerCase("zh-CN");
      return (!query || haystack.includes(query))
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
    categoryFilter.value = "all";
    verdictFilter.value = "all";
    evidenceFilter.value = "all";
    sortOrder.value = "recommended";
    render();
  }

  [search, categoryFilter, verdictFilter, evidenceFilter, sortOrder].forEach((control) => {
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
