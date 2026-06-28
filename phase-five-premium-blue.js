(function () {
  const VERSION = "phase-five-premium-blue-2026-06-28";

  const esc = value => String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const replacements = [
    [/Eerste testversie/g, "Logistiek control portal"],
    [/Eerste test/g, "Toegang tot het portaal"],
    [/Testlogin voor de eerste validatie\. Later vervangen door Supabase Auth met rollen\./g, "Gebruik de juiste rol om het operationele portaal te openen."],
    [/Test charter/g, "Charter"],
    [/Lokale testmodus/g, "Lokale opslag actief"],
    [/Lokale testdata/g, "Lokale opslag"],
    [/Supabase testdata/g, "Supabase actief"],
    [/Supabase key controleren/g, "Configuratie controleren"],
    [/Prototype/g, "Concept"],
    [/prototype/g, "concept"],
    [/Demo/g, "Concept"],
    [/demo/g, "concept"],
    [/testdata/gi, "portalgegevens"],
    [/workflow te testen/gi, "operationele workflow te gebruiken"],
    [/Volledige testflow/g, "Volledige controleflow"],
    [/Testplan/g, "Controleplan"],
    [/Meldingen & test/g, "Meldingen & controle"],
    [/read-only/g, "vast"],
    [/Payout/g, "Betaling"],
    [/payout/g, "betaling"],
    [/POD/g, "MendriX status"],
    [/document checks/g, "documentcontrole"],
    [/Nieuwe testroute/g, "Nieuwe route"],
    [/Gesimuleerd webhook-event/g, "Webhook-event"],
    [/simuleren/g, "verwerken"]
  ];

  function polishText(value) {
    return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value ?? ""));
  }

  function polishTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const next = polishText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    root.querySelectorAll("input, textarea").forEach(input => {
      if (input.value) input.value = polishText(input.value);
      if (input.placeholder) input.placeholder = polishText(input.placeholder);
    });
    const password = root.querySelector('input[type="password"]');
    if (password && password.value === "demo123") password.value = "portal";
  }

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
    return item.view === state.view || (item.aliases || []).includes(state.view);
  }

  function navButton(item) {
    const count = item.count ? `<span class="badge-count">${item.count}</span>` : "";
    return `<button class="nav-btn ${isActive(item) ? "active" : ""}" data-view="${esc(item.view)}"><span class="nav-left"><span class="nav-code">${esc(item.code)}</span>${esc(item.label)}</span>${count}</button>`;
  }

  function officeItems() {
    return [
      { view: "dashboard", code: "DB", label: "Dashboard" },
      { view: "routebeheer", code: "RT", label: "Routes", count: state.routes.filter(r => ["te publiceren", "open", "wacht op goedkeuring"].includes(String(r.status || "").toLowerCase())).length, aliases: ["routes", "upload", "routeReview", "operatie", "execution", "loading"] },
      { view: "approval", code: "AB", label: "Aanvragen & biedingen", count: countRequests() },
      { view: "finance", code: "FD", label: "Facturen & disputes", count: countInvoices() + countOpenDisputes(), aliases: ["invoices", "disputes", "betalingen"] },
      { view: "charters", code: "CH", label: "Charters", count: countDocs(), aliases: ["charterbeheer", "netwerk", "documents", "vehicles"] },
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

  navigatie = function () {
    const items = state.role === "office" ? officeItems() : charterItems();
    const roleLabel = state.role === "office" ? (state.officeRol || "Office") : huidigeCharter();
    const charterSelect = state.role === "charter" ? `<div class="field" style="margin:14px 0"><label>Charter</label><select id="charterSelect">${state.charters.map(c => `<option ${c.bedrijf === huidigeCharter() ? "selected" : ""}>${esc(c.bedrijf)}</option>`).join("")}</select></div>` : "";
    const subtitle = state.role === "office" ? "Control room voor routes, aanvragen, facturen en charters." : "Charter workspace voor marketplace, routes, facturen en profiel.";
    return `<aside class="sidebar">
      <div class="brand-card"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">${esc(roleLabel)}</div></div></div><p>${subtitle}</p></div>
      <button class="btn ghost full" data-act="logout" style="margin-top:14px">Terug naar voorpagina</button>
      ${charterSelect}
      <div class="nav-group-title">Navigatie</div>
      ${items.map(navButton).join("")}
      <div class="control-room-context"><strong>${state.source === "supabase" ? "Supabase actief" : "Lokale opslag"}</strong><span>Operationele dataflow actief.</span></div>
    </aside>`;
  };

  const previousMain = renderMain;
  renderMain = function () {
    let html;
    if (state.role === "office" && state.view === "finance") {
      const payments = typeof betalingen === "function" ? `<section class="module-section"><div class="section-head"><div><h2>Betalingen</h2><p>Verwachte betaling, factuurstatus en open controles per charter.</p></div></div>${zonderHero(betalingen())}</section>` : "";
      html = invoices() + disputes() + payments;
    } else if (state.role === "charter" && state.view === "applications") {
      html = requests();
    } else if (state.role === "charter" && state.view === "invoices") {
      html = invoices();
    } else if (state.role === "charter" && state.view === "disputes") {
      html = disputes();
    } else {
      html = previousMain();
    }
    return polishText(html);
  };

  const previousRender = render;
  render = function () {
    previousRender();
    polishTree(document.getElementById("app") || document.body);
  };

  document.title = "Cargro Charterportaal | Logistiek control portal";
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", "Premium logistiek control portal voor routes, aanvragen, biedingen, facturen en disputes.");

  state._phaseFivePremiumBlue = VERSION;
  render();
})();
