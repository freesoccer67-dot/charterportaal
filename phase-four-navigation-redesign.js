(function () {
  const NAV_VERSION = "phase-four-navigation-2026-06-28";
  const htmlEsc = value => String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  function countOpenDisputes() {
    return state.disputes.filter(d => !["afgerond", "afgewezen"].includes(String(d.status || "").toLowerCase())).length;
  }

  function countInvoices() {
    return state.facturen.filter(f => ["ingediend", "controle nodig", "te beoordelen"].includes(String(f.status || "").toLowerCase())).length;
  }

  function countRequests() {
    return state.aanvragen.filter(a => String(a.status || "").toLowerCase() === "te beoordelen").length;
  }

  function countDocs() {
    return state.documenten.filter(d => String(d.status || "").toLowerCase() !== "goedgekeurd").length;
  }

  function isActive(item) {
    const current = state.view;
    return item.view === current || (item.aliases || []).includes(current);
  }

  function navButton(item) {
    const active = isActive(item) ? "active" : "";
    const count = item.count ? `<span class="badge-count">${item.count}</span>` : "";
    return `<button class="nav-btn ${active}" data-view="${htmlEsc(item.view)}"><span class="nav-left"><span class="nav-code">${htmlEsc(item.code)}</span>${htmlEsc(item.label)}</span>${count}</button>`;
  }

  function officeItems() {
    return [
      { view: "dashboard", code: "DB", label: "Dashboard" },
      { view: "routebeheer", code: "RT", label: "Routes", count: state.routes.filter(r => ["te publiceren", "open", "wacht op goedkeuring"].includes(String(r.status || "").toLowerCase())).length, aliases: ["routes", "upload", "routeReview", "operatie", "execution", "loading"] },
      { view: "approval", code: "AB", label: "Aanvragen & biedingen", count: countRequests() },
      { view: "finance", code: "FD", label: "Facturen & disputes", count: countInvoices() + countOpenDisputes(), aliases: ["invoices", "disputes", "betalingen"] },
      { view: "charterbeheer", code: "CH", label: "Charters", count: countDocs(), aliases: ["netwerk", "charters", "documents", "vehicles"] },
      { view: "instellingen", code: "IN", label: "Instellingen" }
    ];
  }

  function charterItems() {
    return [
      { view: "chartermarkt", code: "MK", label: "Marketplace", count: state.routes.filter(r => String(r.status || "").toLowerCase() === "open").length, aliases: ["routes"] },
      { view: "applications", code: "AA", label: "Mijn aanvragen", count: state.aanvragen.filter(a => a.charter === huidigeCharter()).length, aliases: ["requests"] },
      { view: "mijntransporten", code: "MR", label: "Mijn routes", aliases: ["assigned", "execution"] },
      { view: "invoices", code: "FA", label: "Facturen", count: state.facturen.filter(f => f.charter === huidigeCharter()).length, aliases: ["charterfinance"] },
      { view: "disputes", code: "DI", label: "Disputes", count: state.disputes.filter(d => d.charter === huidigeCharter()).length },
      { view: "charterprofiel", code: "PR", label: "Profiel", count: countDocs(), aliases: ["mijnwagenpark", "vehicles", "documents"] }
    ];
  }

  function shellSubtitle() {
    return state.role === "office"
      ? "Control room voor routes, aanvragen, finance en charters."
      : "Charter workspace voor marktplaats, routes, facturen en profiel.";
  }

  navigatie = function () {
    const items = state.role === "office" ? officeItems() : charterItems();
    const roleLabel = state.role === "office" ? (state.officeRol || "Office") : huidigeCharter();
    const charterSelect = state.role === "charter" ? `<div class="field" style="margin:14px 0"><label>Charter</label><select id="charterSelect">${state.charters.map(c => `<option ${c.bedrijf === huidigeCharter() ? "selected" : ""}>${htmlEsc(c.bedrijf)}</option>`).join("")}</select></div>` : "";
    return `<aside class="sidebar">
      <div class="brand-card"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">${htmlEsc(roleLabel)}</div></div></div><p>${shellSubtitle()}</p></div>
      <button class="btn ghost full" data-act="logout" style="margin-top:14px">Terug naar voorpagina</button>
      ${charterSelect}
      <div class="nav-group-title">Navigatie</div>
      ${items.map(navButton).join("")}
      <div class="control-room-context"><strong>${state.source === "supabase" ? "Supabase actief" : "Lokale testdata"}</strong><span>Business logic en dataflows blijven ongewijzigd.</span></div>
    </aside>`;
  };

  const mainBeforePhaseFour = renderMain;
  renderMain = function () {
    if (state.role === "office" && state.view === "finance") {
      const payments = typeof betalingen === "function" ? `<section class="module-section"><div class="section-head"><div><h2>Betalingen</h2><p>Verwachte betaling, factuurstatus en open controles per charter.</p></div></div>${zonderHero(betalingen())}</section>` : "";
      return dutch(invoices() + disputes() + payments);
    }
    if (state.role === "office" && state.view === "charterbeheer") {
      return dutch(charterbeheer());
    }
    if (state.role === "charter" && state.view === "applications") {
      return dutch(requests());
    }
    if (state.role === "charter" && state.view === "invoices") {
      return dutch(invoices());
    }
    if (state.role === "charter" && state.view === "disputes") {
      return dutch(disputes());
    }
    return mainBeforePhaseFour();
  };

  state._phaseFourNavVersion = NAV_VERSION;
  if (typeof render === "function") render();
})();
