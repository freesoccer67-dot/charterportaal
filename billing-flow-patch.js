(function () {
  if (typeof S === "undefined") return;

  const VAT = 0.21;
  const today = "2026-06-26";
  const money = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
  const esc = v => String(v ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const cls = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const status = s => `<span class="status ${cls(s)}">${esc(s)}</span>`;

  function initPatchData() {
    S.vehicleMeasurements = S.vehicleMeasurements || {
      "VH-001": { length: 4.20, width: 2.05, height: 2.10, volume: 18.1 },
      "VH-002": { length: 4.00, width: 1.75, height: 1.90, volume: 13.3 },
      "VH-003": { length: 3.40, width: 1.70, height: 1.75, volume: 10.1 },
      "VH-004": { length: 4.00, width: 1.75, height: 1.90, volume: 13.3 },
      "VH-005": { length: 4.35, width: 2.10, height: 2.15, volume: 19.6 }
    };
    S._billingPatch = true;
    save();
  }
  if (!S._billingPatch) initPatchData();

  const baseRender = render;
  const baseBind = bind;

  function route(row) {
    const r = R(row);
    const details = (S.routeDetails && S.routeDetails[r.id]) || {};
    r.rate = Number(details.rate || 0.35);
    r.systemPrice = Number(r.pay) || 0;
    return r;
  }
  const routes = () => S.routes.map(route);
  const assignedRoutes = charter => routes().filter(r => r.charter === charter);
  const expectedExVat = charter => assignedRoutes(charter).reduce((sum, r) => sum + (Number(r.systemPrice) || 0), 0);
  const inclVat = ex => Math.round(Number(ex || 0) * (1 + VAT) * 100) / 100;
  const allApplications = () => [
    ...(S.routeRequests || []).map(x => ({ id: x[0], route: x[1], charter: x[2], type: "Aanvraag huidige prijs", amount: x[4], status: x[5], note: x[6], date: x[7], source: "request" })),
    ...(S.bids || []).map(x => ({ id: x[0], route: x[1], charter: x[2], type: "Hoger aanbod", amount: x[3], status: x[4], note: x[5], date: x[7], source: "bid" }))
  ];

  function table(head, rows, empty = "Geen gegevens") {
    if (!rows.length) return `<div class="empty">${empty}</div>`;
    return `<div class="table-wrap"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function header(title, text = "", actions = "") {
    return `<section class="page-header"><div><div class="eyebrow">Cargro Charterportaal</div><h1>${title}</h1>${text ? `<p>${text}</p>` : ""}</div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</section>`;
  }
  function field(label, name, value = "", help = "", type = "text", readonly = false) {
    return `<div class="field"><label>${esc(label)}</label><input class="input" type="${type}" name="${name}" value="${esc(value)}" ${readonly ? "readonly" : ""} placeholder="${esc(help)}">${help ? `<small>${esc(help)}</small>` : ""}</div>`;
  }

  function patchedNav() {
    const counts = {
      openRoutes: S.routes.filter(r => r[9] === "open").length,
      applications: allApplications().filter(a => ["pending", "review"].includes(a.status)).length,
      invoices: S.invoices.filter(i => ["pending", "review", "mismatch"].includes(i[5])).length,
      disputes: S.disputes.filter(d => !["Closed", "Rejected"].includes(d[5])).length
    };
    const office = [
      ["dashboard", "Dashboard", ""],
      ["import", "Route import", ""],
      ["market", "Route marktplaats", "openRoutes"],
      ["applications", "Aanvragen & aanbiedingen", "applications"],
      ["invoices", "Factuurcontrole", "invoices"],
      ["disputes", "Disputes", "disputes"],
      ["charters", "Charters", ""],
      ["fleet", "Voertuigen & chauffeurs", ""],
      ["margin", "Marge", ""]
    ];
    const charter = [
      ["dashboard", "Dashboard", ""],
      ["market", "Route marktplaats", "openRoutes"],
      ["myRequests", "Mijn aanvragen", ""],
      ["myRoutes", "Mijn routes", ""],
      ["invoiceSubmit", "Factuur indienen", ""],
      ["invoiceHistory", "Factuurhistorie", ""],
      ["disputes", "Disputes", "disputes"],
      ["fleet", "Voertuigen & chauffeurs", ""]
    ];
    const items = S.role === "office" ? office : charter;
    return `<aside class="sidebar enterprise-sidebar"><div class="sidebar-brand"><div class="logo">CG</div><div><strong>Cargro</strong><span>Charterportaal</span></div></div><button class="btn ghost full" data-logout>Andere login</button>${S.role === "charter" ? `<div class="field compact"><label>Charter</label><select id="charter">${S.charters.map(q => `<option ${q[0] === S.charter ? "selected" : ""}>${esc(q[0])}</option>`).join("")}</select><small>Bekijk de portal als deze charter.</small></div>` : ""}<div class="nav-group-title">Menu</div>${items.map(i => `<button class="nav-btn ${S.view === i[0] ? "active" : ""}" data-view="${i[0]}"><span class="nav-left"><span class="nav-dot"></span>${esc(i[1])}</span>${i[2] && counts[i[2]] ? `<span class="badge-count">${counts[i[2]]}</span>` : ""}</button>`).join("")}<div class="sidebar-note"><strong>Flow</strong><span>Hoger aanbod kan alleen vanuit de route marktplaats en komt onder Mijn aanvragen.</span></div></aside>`;
  }

  function marketplacePage() {
    const openRoutes = routes().filter(r => r.status === "open");
    return `${header("Route marktplaats", "Vraag een route aan voor de huidige prijs of doe direct een hoger aanbod. Een hoger aanbod is geen losse pagina meer.")}
      <div class="grid two">${openRoutes.map(r => {
        const already = allApplications().some(a => a.route === r.id && a.charter === S.charter && ["pending", "review"].includes(a.status));
        return `<article class="route-card"><div class="route-top"><div><div class="route-title">${esc(r.title)}</div><div class="route-meta">${esc(r.id)} · ${esc(r.zone)} · laden ${esc(r.load)}</div></div>${status(r.status)}</div><div class="route-info"><span class="pill blue">${money(r.rate)}/km</span><span class="pill green">${money(r.systemPrice)} excl. btw</span><span class="pill gray">${money(inclVat(r.systemPrice))} incl. btw</span><span class="pill orange">${r.stops} stops</span></div><div class="route-actions">${S.role === "charter" ? `<button class="btn primary small" data-action="requestRoute" data-id="${r.id}" ${already ? "disabled" : ""}>Aanvragen huidige prijs</button><button class="btn ghost small" data-action="higherOffer" data-id="${r.id}" ${already ? "disabled" : ""}>Hoger aanbod doen</button>` : `<button class="btn ghost small" data-view="applications">Aanvragen bekijken</button>`}<button class="btn ghost small" data-action="toggleSpecs" data-id="${r.id}">Specificaties</button></div>${S.expandedSpecs && S.expandedSpecs[r.id] ? `<div class="spec-panel"><strong>Opmerkingen</strong><p>${esc(r.remarks || "Geen opmerkingen")}</p><strong>Specificaties</strong><p>${esc(r.specs || "Geen specificaties")}</p></div>` : ""}</article>`;
      }).join("")}</div>`;
  }

  function applicationsPage() {
    const list = S.role === "office" ? allApplications() : allApplications().filter(a => a.charter === S.charter);
    return `${header(S.role === "office" ? "Aanvragen & aanbiedingen" : "Mijn aanvragen", S.role === "office" ? "Normale aanvragen en hogere aanbiedingen staan samen. Zodra office goedkeurt, verhuist de route naar Mijn routes van de charter." : "Hier staan jouw route-aanvragen én hogere aanbiedingen. Goedgekeurde routes verdwijnen hier en komen onder Mijn routes.")}
      ${table(["ID", "Route", "Charter", "Type", "Bedrag excl. btw", "Bedrag incl. btw", "Status", "Notitie", S.role === "office" ? "Actie" : "Datum"], list.map(a => [a.id, a.route, a.charter, a.type, money(a.amount), money(inclVat(a.amount)), status(a.status), esc(a.note), S.role === "office" ? `<button class="btn primary small" data-action="approveApplication" data-id="${a.source}:${a.id}">Goedkeuren</button> <button class="btn ghost small" data-action="rejectApplication" data-id="${a.source}:${a.id}">Afwijzen</button>` : esc(a.date || "")]), "Geen aanvragen of aanbiedingen")}`;
  }

  function myRoutesPage() {
    const list = assignedRoutes(S.charter);
    return `${header("Mijn routes", "Goedgekeurde aanvragen en aanbiedingen komen hier terecht als toegewezen route.")}
      ${table(["Route", "Naam", "KM", "Tarief/km", "Verwachte betaling excl. btw", "Verwachte betaling incl. btw", "Status"], list.map(r => [r.id, esc(r.title), r.km, money(r.rate), money(r.systemPrice), money(inclVat(r.systemPrice)), status(r.status)]), "Nog geen toegewezen routes")}`;
  }

  function invoiceSubmitPage() {
    const expected = expectedExVat(S.charter);
    return `${header("Factuur indienen", "De verwachte betaling wordt automatisch berekend op basis van toegewezen routes en is niet aanpasbaar. De charter vult alleen het eigen factuurbedrag in.")}
      <div class="grid two"><form class="card form-card" id="patchedInvoiceForm"><div class="card-title">Nieuwe factuur</div><div class="form-grid">${field("Charter", "charter", S.charter, "Automatisch vanuit login", "text", true)}${field("Week", "week", "Week 26", "Bijv. Week 26 of 2026-W26")}${field("Verwachte betaling excl. btw", "expected", expected.toFixed(2), "Vast bedrag op basis van toegewezen routes", "number", true)}${field("Verwachte betaling incl. btw", "expectedIncl", inclVat(expected).toFixed(2), "Automatisch met 21% btw", "number", true)}${field("Jouw factuurbedrag excl. btw", "amount", expected.toFixed(2), "Vul het bedrag van jouw factuur in", "number")}${field("Aantal routes", "routes", assignedRoutes(S.charter).length, "Automatisch aantal toegewezen routes", "number", true)}<div class="field"><label>Factuur upload</label><input class="input" type="file" accept=".pdf,.xlsx,.csv"><small>Upload PDF, Excel of CSV. Demo slaat geen bestanden op.</small></div></div><button class="btn primary" style="margin-top:14px">Factuur indienen</button></form><div class="card"><div class="card-title">Verwachte betaling per route</div>${table(["Route", "Naam", "Excl. btw", "Incl. btw"], assignedRoutes(S.charter).map(r => [r.id, esc(r.title), money(r.systemPrice), money(inclVat(r.systemPrice))]), "Geen toegewezen routes")}</div></div>`;
  }

  function invoiceHistoryPage() {
    const list = S.role === "office" ? S.invoices : S.invoices.filter(i => i[1] === S.charter);
    return `${header(S.role === "office" ? "Factuurcontrole" : "Factuurhistorie", "Alle bedragen tonen excl. btw en incl. btw. Verschil wordt berekend op basis van verwachte betaling.")}
      ${table(["Factuur", "Charter", "Week", "Verwacht excl.", "Verwacht incl.", "Factuur excl.", "Factuur incl.", "Verschil excl.", "Status"], list.map(i => { const submitted = Number(i[3]) || 0; const expected = Number(i[7]) || 0; return [i[0], i[1], i[2], money(expected), money(inclVat(expected)), money(submitted), money(inclVat(submitted)), money(submitted - expected), status(i[5])]; }), "Geen facturen")}`;
  }

  function fleetPage() {
    const vehicles = S.role === "office" ? S.vehicles : S.vehicles.filter(v => v[1] === S.charter);
    const drivers = S.role === "office" ? S.drivers : S.drivers.filter(d => d[1] === S.charter);
    return `${header("Voertuigen & chauffeurs", S.role === "office" ? "Per charter zie je voertuigtype, status en beladingsruimte." : "Voeg voertuigen toe met beladingsruimte zodat planning beter kan matchen.")}${S.role === "charter" ? `<div class="grid two"><form class="card form-card" id="patchedVehicleForm"><div class="card-title">Voertuig toevoegen</div><div class="form-grid">${field("Voertuigtype", "type", "Bakwagen", "Bijv. L3, L4, Bakwagen")}${field("Kenteken", "plate", "", "Vul kenteken in")}${field("Capaciteit kg", "capacity", "950", "Maximaal laadgewicht", "number")}${field("Lengte beladingsruimte meter", "length", "4.20", "Binnenlengte laadruimte", "number")}${field("Breedte beladingsruimte meter", "width", "2.05", "Binnenbreedte laadruimte", "number")}${field("Hoogte beladingsruimte meter", "height", "2.10", "Binnenhoogte laadruimte", "number")}${field("Laadklep", "tail", "Ja", "Ja/Nee")}${field("Document geldig tot", "valid", "2026-12-31", "Datum verzekering/keuring")}</div><button class="btn primary" style="margin-top:14px">Voertuig toevoegen</button></form><form class="card form-card" id="driverForm"><div class="card-title">Chauffeur toevoegen</div><div class="form-grid">${field("Naam", "name", "", "Voor- en achternaam")}${field("Telefoon", "phone", "", "Bijv. +31 6 ...")}${field("Rijbewijs", "license", "B", "Bijv. B")}${field("Woonplaats", "city", "", "Startplaats chauffeur")}${field("Voertuig ID", "vehicle", "", "Optioneel")}</div><button class="btn primary" style="margin-top:14px">Chauffeur toevoegen</button></form></div>` : ""}
      <div class="section-head"><div><h2>Voertuigen</h2></div></div>${table(["ID", "Charter", "Type", "Kenteken", "Capaciteit", "Beladingsruimte L×B×H", "Volume", "Laadklep", "Status"], vehicles.map(v => { const m = S.vehicleMeasurements[v[0]] || {}; return [v[0], v[1], v[2], v[3], `${v[4]} kg`, m.length ? `${m.length} × ${m.width} × ${m.height} m` : "—", m.volume ? `${m.volume} m³` : "—", v[6] || "", status(v[5])]; }), "Geen voertuigen")}
      <div class="section-head"><div><h2>Chauffeurs</h2></div></div>${table(["ID", "Charter", "Naam", "Telefoon", "Rijbewijs", "Status", "Woonplaats", "Voertuig"], drivers.map(d => [d[0], d[1], d[2], d[3], d[4], status(d[5]), d[6], d[7] || "—"]), "Geen chauffeurs")}`;
  }

  function patchedView() {
    if (S.role === "office") {
      if (S.view === "applications" || S.view === "requests" || S.view === "bids" || S.view === "applicants") return applicationsPage();
      if (S.view === "market") return marketplacePage();
      if (S.view === "invoices") return invoiceHistoryPage();
      if (S.view === "fleet") return fleetPage();
    } else {
      if (S.view === "myBids") S.view = "myRequests";
      if (S.view === "myRequests") return applicationsPage();
      if (S.view === "myRoutes") return myRoutesPage();
      if (S.view === "market") return marketplacePage();
      if (S.view === "invoiceSubmit") return invoiceSubmitPage();
      if (S.view === "invoiceHistory") return invoiceHistoryPage();
      if (S.view === "fleet") return fleetPage();
    }
    return null;
  }

  render = function () {
    if (!S.loggedIn) {
      baseRender();
      return;
    }
    const custom = patchedView();
    if (!custom) {
      baseRender();
      return;
    }
    A.innerHTML = `<div class="app-shell enterprise">${patchedNav()}<main class="main"><div class="topbar"><div class="kicker">${S.role === "office" ? "Cargro planning / kantoor" : esc(S.charter)}</div><div class="demo-note">Prototype · demo data</div></div>${custom}</main></div>`;
    bind();
  };

  bind = function () {
    baseBind();
    document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => { S.view = b.dataset.view; save(); render(); });
    const logout = document.querySelector("[data-logout]");
    if (logout) logout.onclick = () => { S.loggedIn = false; save(); render(); };
    const charterSel = document.getElementById("charter");
    if (charterSel) charterSel.onchange = e => { S.charter = e.target.value; S.view = "dashboard"; save(); render(); };

    const invoiceForm = document.getElementById("patchedInvoiceForm");
    if (invoiceForm) invoiceForm.onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(invoiceForm));
      const expected = expectedExVat(S.charter);
      const amount = Number(f.amount) || 0;
      S.invoices.unshift([`INV-${70 + S.invoices.length}`, S.charter, f.week, amount, assignedRoutes(S.charter).length, amount === expected ? "pending" : "mismatch", today, expected]);
      save(); toast("Factuur ingediend met vaste verwachte betaling"); S.view = "invoiceHistory"; render();
    };

    const vehicleForm = document.getElementById("patchedVehicleForm");
    if (vehicleForm) vehicleForm.onsubmit = e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(vehicleForm));
      const id = `VH-${120 + S.vehicles.length}`;
      const length = Number(f.length) || 0, width = Number(f.width) || 0, height = Number(f.height) || 0;
      S.vehicles.unshift([id, S.charter, f.type, f.plate, Number(f.capacity), "pending", f.tail, f.valid]);
      S.vehicleMeasurements[id] = { length, width, height, volume: Math.round(length * width * height * 10) / 10 };
      save(); toast("Voertuig toegevoegd met beladingsruimte"); render();
    };
  };

  const oldAction = typeof action === "function" ? action : null;
  action = function (a, id) {
    if (a === "higherOffer") {
      const routeRow = S.routes.find(r => r[0] === id);
      const r = route(routeRow);
      const input = prompt(`Hoger aanbod voor ${r.id}. Huidige prijs is ${money(r.systemPrice)} excl. btw. Vul jouw aanbod excl. btw in:`, Math.round(r.systemPrice * 1.08));
      if (input === null) return;
      const amount = Number(input);
      if (!amount || amount <= r.systemPrice) { toast("Hoger aanbod moet boven de huidige prijs liggen"); return; }
      S.bids.unshift([`BID-${360 + S.bids.length}`, id, S.charter, amount, "pending", "Hoger aanbod vanuit route marktplaats", "higher", today]);
      save(); toast("Hoger aanbod staat nu onder Mijn aanvragen"); S.view = "myRequests"; render(); return;
    }
    if (a === "approveApplication") {
      const [source, appId] = id.split(":");
      const app = source === "bid" ? S.bids.find(x => x[0] === appId) : S.routeRequests.find(x => x[0] === appId);
      if (!app) return;
      const routeId = app[1], charter = app[2], amount = source === "bid" ? app[3] : app[4];
      const rr = S.routes.find(r => r[0] === routeId);
      rr[9] = "assigned"; rr[13] = charter; rr[11] = amount;
      S.routeRequests.filter(x => x[1] === routeId).forEach(x => x[5] = source === "request" && x[0] === appId ? "approved" : "rejected");
      S.bids.filter(x => x[1] === routeId).forEach(x => x[4] = source === "bid" && x[0] === appId ? "approved" : "rejected");
      save(); toast("Route toegewezen. Goedgekeurde route staat nu onder Mijn routes."); render(); return;
    }
    if (a === "rejectApplication") {
      const [source, appId] = id.split(":");
      const app = source === "bid" ? S.bids.find(x => x[0] === appId) : S.routeRequests.find(x => x[0] === appId);
      if (app) { if (source === "bid") app[4] = "rejected"; else app[5] = "rejected"; save(); toast("Aanvraag/aanbod afgewezen"); render(); }
      return;
    }
    if (oldAction) return oldAction(a, id);
  };

  render();
})();
