(function () {
  if (typeof S === "undefined") return;

  const VERSION = "enterprise-workflow-v2";
  const today = "2026-06-26";
  const KM_RATES = { "L3": 0.25, "L4": 0.35, "Bakwagen": 0.45, "Bakwagen laadklep": 0.50 };

  function calcPayout(km, vehicle, manual) {
    const rate = KM_RATES[vehicle] || 0.35;
    return manual !== "" && manual != null && !Number.isNaN(Number(manual)) ? Number(manual) : Math.round(Number(km || 0) * rate * 100) / 100;
  }

  function seedEnterpriseData() {
    S.loggedIn = false;
    S.role = "office";
    S.view = "dashboard";
    S.charter = "LuxeLine Transport";
    S.routes = [
      ["RT-101", "Zwolle + Beek-Ubbergen", "Oost", "06:15", "Bakwagen", 17, 727, 13.8, 640, "open", "published", calcPayout(727, "Bakwagen"), 192, "", "MendriX"],
      ["RT-102", "Randstad speelgoedroute", "Randstad", "07:00", "L4", 23, 318, 8.5, 520, "open", "published", calcPayout(318, "L4"), 176, "", "MendriX"],
      ["RT-103", "Noord zware stops", "Noord", "06:35", "Bakwagen laadklep", 14, 455, 10.2, 970, "open", "published", calcPayout(455, "Bakwagen laadklep"), 138, "", "MendriX"],
      ["RT-104", "Zuid correctieronde", "Zuid", "07:30", "L3", 12, 226, 6.4, 310, "assigned", "published", calcPayout(226, "L3"), 113, "Zuid Logistics Partner", "Planning manual"],
      ["RT-105", "Midden fulfilment pickup", "Midden", "15:30", "Bakwagen", 9, 188, 5.7, 790, "assigned", "published", calcPayout(188, "Bakwagen"), 96, "Duiven Express", "CSV import"]
    ];
    S.routeDetails = {
      "RT-101": { rate: KM_RATES["Bakwagen"], remarks: "Start vroeg, route heeft lange afstand vanaf Nijmegen.", specs: "Bakwagen nodig. Let op: route eindigt dicht bij Nijmegen. Bel klant 30 min vooraf bij zware artikelen." },
      "RT-102": { rate: KM_RATES["L4"], remarks: "Speelgoedroute met veel kleine pakketten.", specs: "L4 voldoende. Geen laadklep nodig. Let op smalle straten in Randstad." },
      "RT-103": { rate: KM_RATES["Bakwagen laadklep"], remarks: "Zware stops, alleen geschikt met laadklep.", specs: "Laadklep verplicht. Pompwagen aanbevolen. Extra spanbanden meenemen." },
      "RT-104": { rate: KM_RATES["L3"], remarks: "Correctieronde, al toegewezen.", specs: "Geen bijzonderheden." },
      "RT-105": { rate: KM_RATES["Bakwagen"], remarks: "Namiddag pickup bij fulfilment.", specs: "Bakwagen gewenst, laadklep niet verplicht." }
    };
    S.routeRequests = [
      ["REQ-201", "RT-102", "Randstad Koeriers", "current", routePrice("RT-102"), "pending", "Route past goed in mijn Randstad planning.", today],
      ["REQ-202", "RT-101", "LuxeLine Transport", "current", routePrice("RT-101"), "pending", "Bakwagen beschikbaar vanaf 06:00.", today],
      ["REQ-203", "RT-101", "Duiven Express", "current", routePrice("RT-101"), "pending", "Kan route rijden met vaste chauffeur.", today]
    ];
    S.bids = [
      ["BID-301", "RT-103", "Noord Carrier Network", routePrice("RT-103") + 80, "pending", "Hoger bod vanwege laadklep, zware stops en lange afstand.", "higher", today],
      ["BID-302", "RT-102", "Randstad Koeriers", routePrice("RT-102") + 40, "review", "Hoger bod vanwege verwachte wachttijd bij laadadres.", "higher", today]
    ];
    S.invoices = [
      ["INV-044", "LuxeLine Transport", "Week 26", 1998, 3, "approved", "2026-06-25", 1998],
      ["INV-045", "Randstad Koeriers", "Week 26", 2795, 4, "mismatch", today, 2715],
      ["INV-046", "Duiven Express", "Week 26", 462, 1, "pending", today, 462]
    ];
    S.disputes = [
      ["DSP-031", "RT-101", "LuxeLine Transport", "Gewicht incorrect", "high", "Open", "Stop stond als 4 kg maar was veel zwaarder.", 35, "Nog beoordelen", []],
      ["DSP-032", "RT-103", "Noord Carrier Network", "Wachttijd", "medium", "Under review", "Extra wachttijd bij magazijn verwacht.", 22, "Planning controleert laadmoment.", []]
    ];
    S.charters = [
      ["LuxeLine Transport", "Nijmegen", "active", "complete", 4.8, 68, 1998, "Daya", "KVK 90000001", "BTW NL001", "Oost, Midden, Zuid"],
      ["Duiven Express", "Duiven", "trial", "NIWO pending", 4.3, 86, 462, "Ravi", "KVK 90000002", "BTW NL002", "Oost"],
      ["Randstad Koeriers", "Utrecht", "active", "complete", 4.6, 51, 2715, "Ahmed", "KVK 90000003", "BTW NL003", "Randstad, West"],
      ["Noord Carrier Network", "Groningen", "active", "insurance review", 4.4, 91, 695, "Jeroen", "KVK 90000004", "BTW NL004", "Noord"],
      ["Zuid Logistics Partner", "Eindhoven", "active", "complete", 4.1, 95, 0, "Sem", "KVK 90000005", "BTW NL005", "Zuid, Midden"]
    ];
    S.vehicles = [
      ["VH-001", "LuxeLine Transport", "Bakwagen", "V-123-AB", 950, "approved", "Ja", "2026-12-31"],
      ["VH-002", "LuxeLine Transport", "L4", "V-222-LL", 750, "pending", "Nee", "2026-10-01"],
      ["VH-003", "Duiven Express", "L3", "V-456-CD", 650, "approved", "Nee", "2027-01-15"],
      ["VH-004", "Randstad Koeriers", "L4", "V-789-EF", 780, "approved", "Nee", "2027-04-20"],
      ["VH-005", "Noord Carrier Network", "Bakwagen laadklep", "V-333-GH", 1200, "approved", "Ja", "2026-11-05"]
    ];
    S.drivers = [
      ["DR-001", "LuxeLine Transport", "Daya", "+31 6 0000 0001", "B", "active", "Nijmegen", "VH-001"],
      ["DR-002", "LuxeLine Transport", "Sukh", "+31 6 0000 0002", "B", "active", "Nijmegen", "VH-002"],
      ["DR-003", "Duiven Express", "Ravi", "+31 6 0000 0003", "B", "active", "Duiven", "VH-003"],
      ["DR-004", "Randstad Koeriers", "Ahmed", "+31 6 0000 0004", "B", "active", "Utrecht", "VH-004"],
      ["DR-005", "Noord Carrier Network", "Jeroen", "+31 6 0000 0005", "B", "active", "Groningen", "VH-005"]
    ];
    S.bulkPreview = [];
    S.expandedSpecs = {};
    S._workflowVersion = VERSION;
    save();
  }

  function routePrice(id) {
    const row = (S.routes || []).find(r => r[0] === id);
    return row ? Number(row[11]) || 0 : 0;
  }

  if (S._workflowVersion !== VERSION) seedEnterpriseData();

  const fmt = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
  const nr = v => new Intl.NumberFormat("nl-NL").format(Number(v) || 0);
  const esc = v => String(v ?? "").replace(/[&<>\"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '\"': "&quot;" }[m]));
  const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const status = s => `<span class="status ${slug(s)}">${esc(s)}</span>`;
  const pill = (s, c = "blue") => `<span class="pill ${c}">${esc(s)}</span>`;
  const details = id => (S.routeDetails && S.routeDetails[id]) || { rate: 0, remarks: "", specs: "" };
  const route = row => {
    const r = R(row);
    const d = details(r.id);
    r.rate = Number(d.rate || KM_RATES[r.veh] || 0.35);
    r.systemPrice = Number(r.pay) || Math.round(r.km * r.rate * 100) / 100;
    r.customerRevenue = r.systemPrice + (Number(r.margin) || 0);
    r.heavyStops = r.kg > 900 ? 5 : r.kg > 700 ? 2 : r.kg > 500 ? 1 : 0;
    r.equipment = r.veh.includes("laadklep") ? "Laadklep / pompwagen" : r.veh === "Bakwagen" ? "Bakwagen / steekwagen" : "Standaard bus";
    r.remarks = d.remarks || "";
    r.specs = d.specs || "";
    return r;
  };
  const routes = () => S.routes.map(route);
  const routeRow = id => S.routes.find(r => r[0] === id);
  const routeById = id => route(routeRow(id));
  const visibleRoutes = () => routes().filter(r => S.role === "office" || !r.charter || r.charter === S.charter || r.status === "open");

  function table(head, rows, empty = "Geen gegevens") {
    if (!rows.length) return `<div class="empty">${empty}</div>`;
    return `<div class="table-wrap"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }
  function field(label, name, value = "", help = "", type = "text", options = null) {
    const body = options
      ? `<select name="${name}">${options.map(o => `<option ${String(o) === String(value) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
      : `<input class="input" type="${type}" name="${name}" value="${esc(value)}" placeholder="${esc(help)}">`;
    return `<div class="field"><label>${esc(label)}</label>${body}${help ? `<small>${esc(help)}</small>` : ""}</div>`;
  }
  function header(title, text = "", actions = "") {
    return `<section class="page-header"><div><div class="eyebrow">Cargro Charterportaal</div><h1>${title}</h1>${text ? `<p>${text}</p>` : ""}</div>${actions ? `<div class="page-actions">${actions}</div>` : ""}</section>`;
  }
  function counts() {
    return {
      openRoutes: S.routes.filter(r => r[9] === "open").length,
      assigned: S.routes.filter(r => r[9] === "assigned").length,
      requests: S.routeRequests.filter(r => r[5] === "pending").length,
      bids: S.bids.filter(b => ["pending", "review"].includes(b[4])).length,
      invoices: S.invoices.filter(i => ["pending", "review", "mismatch"].includes(i[5])).length,
      disputes: S.disputes.filter(d => !["Closed", "Rejected"].includes(d[5])).length
    };
  }

  function loginScreen() {
    return `<main class="login-screen premium-login">
      <section class="premium-shell">
        <div class="premium-left">
          <div class="login-brand-row"><div class="logo">CG</div><div><strong>Cargro Charterportaal</strong><span>Enterprise workflow prototype</span></div></div>
          <h1>Charterplanning zonder losse Excel, WhatsApp en factuurdiscussies.</h1>
          <p>Planning publiceert routes vanuit MendriX/CSV/Excel. Charters vragen routes aan of dienen een hoger bod in. Office kiest de juiste partner en controleert facturen en disputes.</p>
          <div class="capability-grid">
            <div><strong>MendriX / CSV import</strong><span>Routes direct publiceren</span></div>
            <div><strong>Marketplace</strong><span>Meerdere charters per route</span></div>
            <div><strong>Invoice matching</strong><span>Expected vs submitted</span></div>
            <div><strong>Dispute control</strong><span>Acties aan beide kanten</span></div>
          </div>
        </div>
        <div class="premium-card">
          <div class="eyebrow">Demo login</div>
          <h2>Kies je omgeving</h2>
          <p>Voor de echte versie wordt dit Supabase Auth met rollen voor planning, office, charter en administratie.</p>
          <div class="login-options">
            <button class="login-option" data-login="office"><strong>Cargro Office / Planning</strong><span>Route import, applicants kiezen, hogere biedingen, financiële controle</span></button>
            <button class="login-option" data-login="charter"><strong>Charter login</strong><span>Routes aanvragen, hoger bod doen, factuur indienen, voertuigen/chauffeurs beheren</span></button>
          </div>
          ${field("Demo charter", "loginCharter", S.charter, "Kies welke charteromgeving je wilt bekijken", "text", S.charters.map(c => c[0]))}
        </div>
      </section>
    </main>`;
  }

  nav = function () {
    const c = counts();
    const office = [["dashboard", "Dashboard", ""], ["import", "Route import", ""], ["market", "Marketplace", "openRoutes"], ["requests", "Route aanvragen", "requests"], ["bids", "Hogere biedingen", "bids"], ["applicants", "Applicants per route", ""], ["invoices", "Factuur controle", "invoices"], ["disputes", "Disputes", "disputes"], ["charters", "Charters", ""], ["fleet", "Voertuigen & chauffeurs", ""], ["margin", "Marge", ""]];
    const charter = [["dashboard", "Dashboard", ""], ["market", "Marketplace", "openRoutes"], ["myRoutes", "Mijn routes", ""], ["myRequests", "Mijn aanvragen", ""], ["myBids", "Mijn hogere biedingen", ""], ["invoiceSubmit", "Factuur indienen", ""], ["invoiceHistory", "Factuurhistorie", ""], ["disputes", "Disputes", "disputes"], ["fleet", "Voertuigen & chauffeurs", ""]];
    const items = S.role === "office" ? office : charter;
    return `<aside class="sidebar enterprise-sidebar"><div class="sidebar-brand"><div class="logo">CG</div><div><strong>Cargro</strong><span>Charterportaal</span></div></div><button class="btn ghost full" data-logout>Andere login</button>${S.role === "charter" ? `<div class="field compact"><label>Charter</label><select id="charter">${S.charters.map(q => `<option ${q[0] === S.charter ? "selected" : ""}>${esc(q[0])}</option>`).join("")}</select><small>Bekijk de portal als deze charter.</small></div>` : ""}<div class="nav-group-title">Menu</div>${items.map(i => `<button class="nav-btn ${S.view === i[0] ? "active" : ""}" data-view="${i[0]}"><span class="nav-left"><span class="nav-dot"></span>${esc(i[1])}</span>${i[2] && c[i[2]] ? `<span class="badge-count">${c[i[2]]}</span>` : ""}</button>`).join("")}<div class="sidebar-note"><strong>Workflow rule</strong><span>MendriX/CSV/Excel routes = direct open. Charter = aanvraag of hoger bod.</span></div></aside>`;
  };

  function officeDashboard() {
    const c = counts();
    const expected = routes().reduce((a, r) => a + r.systemPrice, 0);
    const submitted = S.invoices.reduce((a, i) => a + (Number(i[3]) || 0), 0);
    const mismatch = S.invoices.reduce((a, i) => a + Math.abs((Number(i[3]) || 0) - (Number(i[7]) || 0)), 0);
    const marginTotal = routes().reduce((a, r) => a + (Number(r.margin) || 0), 0);
    const disputeExposure = S.disputes.filter(d => !["Closed", "Rejected"].includes(d[5])).reduce((a, d) => a + (Number(d[7]) || 0), 0);
    const totalKm = routes().reduce((a, r) => a + (Number(r.km) || 0), 0);
    return `${header("Office dashboard", "Actiegericht overzicht voor planning en administratie. Focus op open routes, applicants, hogere biedingen, factuurverschillen en disputes.", `<button class="btn primary" data-view="import">Bulk routes importeren</button><button class="btn ghost" data-view="applicants">Applicants kiezen</button>`)}
      <section class="grid four kpi-grid">
        ${metric("Open routes", c.openRoutes, "marketplace")}
        ${metric("Route aanvragen", c.requests, "approval nodig", "warn")}
        ${metric("Hogere biedingen", c.bids, "apart behandelen", "warn")}
        ${metric("Factuur checks", c.invoices, "mismatch monitor", c.invoices ? "warn" : "")}
      </section>
      <section class="grid two" style="margin-top:18px">
        <div class="card flow-card"><div class="card-title">Operationele flow</div>${workflowBoard()}</div>
        <div class="card finance-card"><div class="card-title">Financieel overzicht</div><div class="finance-grid">
          ${financeCell("Expected payout", fmt(expected))}
          ${financeCell("Submitted invoices", fmt(submitted))}
          ${financeCell("Mismatch bedrag", fmt(mismatch), mismatch ? "bad" : "good")}
          ${financeCell("Interne marge", fmt(marginTotal))}
          ${financeCell("Dispute exposure", fmt(disputeExposure), disputeExposure ? "warn" : "good")}
          ${financeCell("Gem. payout/km", fmt(totalKm ? expected / totalKm : 0))}
        </div></div>
      </section>
      <div class="section-head"><div><h2>Per charter financieel</h2><p>Expected payout, submitted invoices, verschillen en open disputes per charter.</p></div></div>${charterFinanceTable()}
      <div class="section-head"><div><h2>Per zone</h2><p>Routevolume, kilometers en payout per regio.</p></div></div>${zoneFinanceTable()}`;
  }
  function metric(label, value, trend, tone = "") { return `<div class="card metric"><div><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div><span class="metric-trend ${tone}">${trend}</span></div>`; }
  function financeCell(label, value, tone = "") { return `<div class="finance-cell"><span>${label}</span><strong class="${tone}">${value}</strong></div>`; }

  function workflowBoard() {
    const lanes = [
      ["Gepubliceerd", S.routes.filter(r => r[9] === "open").length, "Routes door planning gepubliceerd"],
      ["Aanvragen huidige prijs", S.routeRequests.filter(r => r[5] === "pending").length, "Charters willen route voor portaalprijs"],
      ["Hogere biedingen", S.bids.filter(b => ["pending", "review"].includes(b[4])).length, "Charters vragen extra bedrag"],
      ["Toegewezen", S.routes.filter(r => r[9] === "assigned").length, "Route heeft winnende charter"],
      ["Factuurcontrole", counts().invoices, "Expected vs submitted"],
      ["Disputes", counts().disputes, "Open acties"]
    ];
    return `<div class="workflow-board">${lanes.map((l, i) => `<div class="workflow-step"><div class="workflow-num">${i + 1}</div><div><strong>${l[0]}</strong><span>${l[2]}</span></div><em>${l[1]}</em></div>`).join("")}</div>`;
  }
  function charterFinanceTable() {
    const rows = S.charters.map(c => {
      const name = c[0];
      const assigned = routes().filter(r => r.charter === name);
      const expected = assigned.reduce((a, r) => a + r.systemPrice, 0);
      const submitted = S.invoices.filter(i => i[1] === name).reduce((a, i) => a + (Number(i[3]) || 0), 0);
      const diff = submitted - expected;
      const disputes = S.disputes.filter(d => d[2] === name && !["Closed", "Rejected"].includes(d[5])).length;
      return [name, assigned.length, fmt(expected), fmt(submitted), diff ? `<strong class="${diff > 0 ? "bad" : "warn"}">${fmt(diff)}</strong>` : `<span class="good">Match</span>`, disputes, status(c[2])];
    });
    return table(["Charter", "Assigned routes", "Expected payout", "Submitted invoice", "Difference", "Open disputes", "Status"], rows);
  }
  function zoneFinanceTable() {
    const zones = [...new Set(routes().map(r => r.zone))];
    return table(["Zone", "Routes", "KM", "Expected payout", "Marge"], zones.map(z => {
      const rs = routes().filter(r => r.zone === z);
      return [z, rs.length, nr(rs.reduce((a, r) => a + r.km, 0)), fmt(rs.reduce((a, r) => a + r.systemPrice, 0)), fmt(rs.reduce((a, r) => a + (Number(r.margin) || 0), 0))];
    }));
  }

  function charterDashboard() {
    const assigned = routes().filter(r => r.charter === S.charter);
    const req = S.routeRequests.filter(r => r[2] === S.charter);
    const bids = S.bids.filter(b => b[2] === S.charter);
    const inv = S.invoices.filter(i => i[1] === S.charter);
    return `${header("Charter dashboard", "Snel overzicht van jouw routes, aanvragen, hogere biedingen, facturen en disputes.", `<button class="btn primary" data-view="market">Marketplace bekijken</button><button class="btn ghost" data-view="invoiceSubmit">Factuur indienen</button>`)}
      <section class="grid four">${metric("Mijn routes", assigned.length, "assigned")}${metric("Aanvragen", req.filter(x => x[5] === "pending").length, "wacht op office", "warn")}${metric("Hogere biedingen", bids.filter(x => ["pending", "review"].includes(x[4])).length, "pending")}${metric("Facturen", inv.length, "historie")}</section>
      <div class="section-head"><div><h2>Mijn toegewezen routes</h2></div></div>${routeTable(assigned, false)}`;
  }

  function importPage() {
    if (S.role !== "office") return marketPage();
    return `${header("Route import", "Planning kan routes bulk uploaden via CSV/Excel, handmatig publiceren of later direct koppelen met MendriX. Alles wat planning publiceert is direct approved/open.", `<button class="btn ghost" data-action="mendrixImport">Directe MendriX integratie later</button>`)}
      <div class="grid two">
        <form class="card form-card" id="bulkImportForm"><div class="card-title">Bulk upload CSV / Excel</div><p class="muted">CSV kan in deze demo worden ingelezen. Excel-upload staat klaar als workflow placeholder; echte XLSX parsing komt later met backend/library.</p>
          <div class="form-grid">${field("Bron", "source", "CSV import", "Kies CSV, Excel of MendriX export", "text", ["CSV import", "Excel import", "MendriX export"])}<div class="field"><label>Bestand</label><input class="input" name="file" type="file" accept=".csv,.xlsx,.xls"><small>Kolommen: route_name, zone, load_time, vehicle_type, stops, km, kg, rate_per_km, opmerkingen, specificaties</small></div></div>
          <div class="import-template"><strong>Required columns</strong><span>route_name · zone · load_time · vehicle_type · stops · km · kg · rate_per_km · opmerkingen · specificaties</span></div>
          <div class="route-actions"><button class="btn ghost" type="button" data-action="sampleBulk">Laad voorbeeld preview</button><button class="btn primary">Publiceer preview routes</button></div>
        </form>
        <form class="card form-card" id="routeImportForm"><div class="card-title">Handmatige route</div><div class="form-grid">
          ${field("Routenaam", "title", "Nieuwe route", "Bijv. Zwolle + Beek-Ubbergen")}
          ${field("Zone", "zone", "Oost", "Kies routegebied", "text", ["Oost", "Midden", "Zuid", "Noord", "West", "Randstad"])}
          ${field("Laadtijd", "load", "06:45", "Bijv. 06:45")}
          ${field("Voertuig", "veh", "Bakwagen", "Benodigd voertuigtype", "text", ["L3", "L4", "Bakwagen", "Bakwagen laadklep"])}
          ${field("Stops", "stops", "16", "Aantal afleverstops", "number")}
          ${field("Kilometers", "km", "340", "Geschatte routekilometers", "number")}
          ${field("Gewicht kg", "kg", "620", "Totaal geschat gewicht", "number")}
          ${field("Tarief per km", "rate", "0.45", "Per-km tarief voor dit voertuig", "number")}
          ${field("Opmerkingen", "remarks", "", "Korte planner-opmerking")}
          ${field("Specificaties", "specs", "", "Details die pas zichtbaar zijn na klikken op specificaties")}
        </div><button class="btn primary" style="margin-top:14px">Publiceer direct in marketplace</button></form>
      </div>
      <div class="section-head"><div><h2>Import preview</h2><p>Hier zie je bulkregels voordat ze gepubliceerd worden.</p></div></div>${bulkPreviewTable()}
      <div class="section-head"><div><h2>Gepubliceerde routes</h2></div></div>${routeTable(routes(), true)}`;
  }
  function bulkPreviewTable() {
    return table(["Route", "Zone", "Laadtijd", "Voertuig", "Stops", "KM", "KG", "Tarief/km", "Payout", "Opmerkingen"], (S.bulkPreview || []).map(r => [r.title, r.zone, r.load, r.veh, r.stops, r.km, r.kg, fmt(r.rate), fmt(r.pay), esc(r.remarks || "")]), "Nog geen bulk preview geladen");
  }

  function marketPage() {
    const list = visibleRoutes().filter(r => r.status === "open");
    return `${header("Marketplace", S.role === "office" ? "Routes die door planning zijn gepubliceerd. Meerdere charters kunnen op dezelfde route aanvragen of hoger bieden." : "Vraag een route aan tegen de huidige prijs of dien een hoger bod in. Specificaties zijn verborgen tot je ze opent.", S.role === "office" ? `<button class="btn primary" data-view="import">Routes importeren</button>` : `<button class="btn ghost" data-view="myBids">Mijn hogere biedingen</button>`)}
      <div class="filters"><select id="zf"><option value="all">Alle zones</option><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>West</option><option>Randstad</option></select><select id="vf"><option value="all">Alle voertuigen</option><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select><span class="filter-note">Geen uurbedrag; routes tonen tarief per km en totaal payout.</span></div>
      <div class="grid two">${list.map(routeCard).join("") || `<div class="empty">Geen open routes.</div>`}</div>`;
  }
  function routeCard(r) {
    const requested = S.routeRequests.some(x => x[1] === r.id && x[2] === S.charter && x[5] === "pending");
    const bidPending = S.bids.some(x => x[1] === r.id && x[2] === S.charter && ["pending", "review"].includes(x[4]));
    const isOpen = S.role === "charter" && r.status === "open";
    const openSpecs = S.expandedSpecs && S.expandedSpecs[r.id];
    const applicants = S.routeRequests.filter(x => x[1] === r.id).length + S.bids.filter(x => x[1] === r.id).length;
    return `<article class="route-card" data-zone="${esc(r.zone)}" data-vehicle="${esc(r.veh)}"><div class="route-top"><div><div class="route-title">${esc(r.title)}</div><div class="route-meta">${esc(r.id)} · ${esc(r.source)} · laden ${esc(r.load)}</div></div>${status(r.status)}</div>
      <div class="route-info">${pill(r.zone, "blue")}${pill(r.veh, "gray")}${pill(`${r.stops} stops`, "green")}${pill(`${nr(r.km)} km`, "gray")}${pill(`${nr(r.kg)} kg`, r.heavyStops ? "orange" : "gray")}${S.role === "office" ? pill(`${applicants} applicants`, applicants ? "orange" : "gray") : ""}</div>
      <div class="price-strip"><div class="price-cell"><strong>${fmt(r.rate)}</strong><span>Tarief per km</span></div><div class="price-cell"><strong>${fmt(r.systemPrice)}</strong><span>Totale payout</span></div><div class="price-cell"><strong>${r.equipment}</strong><span>Benodigd</span></div><div class="price-cell"><strong>${r.load}</strong><span>Laadtijd</span></div></div>
      <div class="route-actions"><button class="btn ghost small" data-action="toggleSpecs" data-id="${r.id}">${openSpecs ? "Verberg specificaties" : "Bekijk specificaties"}</button>${isOpen ? `<button class="btn primary small" data-action="requestRoute" data-id="${r.id}" ${requested ? "disabled" : ""}>${requested ? "Aangevraagd" : "Aanvragen huidige prijs"}</button><button class="btn ghost small" data-action="prepareBid" data-id="${r.id}" ${bidPending ? "disabled" : ""}>${bidPending ? "Bod ingediend" : "Hoger bod"}</button>` : ""}${S.role === "office" ? `<button class="btn ghost small" data-view="applicants">Applicants bekijken</button>` : ""}</div>
      ${openSpecs ? `<div class="spec-panel"><strong>Opmerkingen</strong><p>${esc(r.remarks || "Geen opmerkingen")}</p><strong>Specificaties</strong><p>${esc(r.specs || "Geen specificaties")}</p></div>` : ""}</article>`;
  }
  function routeTable(list, office) {
    return table(["Route", "Zone", "Voertuig", "Stops", "KM", "Tarief/km", "Payout", "Bron", "Status", office ? "Charter" : ""].filter(Boolean), list.map(r => [`${esc(r.id)}<br><strong>${esc(r.title)}</strong>`, esc(r.zone), esc(r.veh), r.stops, nr(r.km), fmt(r.rate), fmt(r.systemPrice), esc(r.source), status(r.status), office ? esc(r.charter || "Nog vrij") : ""].filter((_, i) => office || i !== 9)), "Geen routes gevonden");
  }

  function requestsPage() {
    const list = S.role === "office" ? S.routeRequests : S.routeRequests.filter(r => r[2] === S.charter);
    return `${header(S.role === "office" ? "Route aanvragen" : "Mijn route aanvragen", S.role === "office" ? "Aanvragen tegen huidige portaalprijs. Je kunt per route één charter kiezen en de rest afwijzen." : "Routes die jij voor de huidige prijs hebt aangevraagd.")}${routeRequestTable(list, S.role === "office")}`;
  }
  function routeRequestTable(list, office) {
    return table(["Aanvraag", "Route", "Charter", "Prijs", "Status", "Notitie", office ? "Actie" : "Datum"], list.map(x => [x[0], x[1], x[2], fmt(x[4]), status(x[5]), esc(x[6]), office ? `<button class="btn primary small" data-action="approveRequest" data-id="${x[0]}">Kies charter</button> <button class="btn ghost small" data-action="rejectRequest" data-id="${x[0]}">Afwijzen</button>` : esc(x[7])]), "Geen route aanvragen");
  }

  function applicantsPage() {
    const rows = [];
    routes().forEach(r => {
      const req = S.routeRequests.filter(x => x[1] === r.id);
      const bids = S.bids.filter(x => x[1] === r.id);
      [...req.map(x => ({ type: "Huidige prijs", id: x[0], route: x[1], charter: x[2], amount: x[4], status: x[5], note: x[6], source: "request" })), ...bids.map(x => ({ type: "Hoger bod", id: x[0], route: x[1], charter: x[2], amount: x[3], status: x[4], note: x[5], source: "bid" }))].forEach(a => rows.push([r.id, r.title, a.charter, a.type, fmt(r.systemPrice), fmt(a.amount), status(a.status), esc(a.note), `<button class="btn primary small" data-action="${a.source === "bid" ? "approveBid" : "approveRequest"}" data-id="${a.id}">Assign</button> <button class="btn ghost small" data-action="${a.source === "bid" ? "rejectBid" : "rejectRequest"}" data-id="${a.id}">Reject</button>`]));
    });
    return `${header("Applicants per route", "Meerdere charters kunnen op dezelfde route reageren. Planning kiest de winnaar; andere aanvragen/biedingen voor die route worden afgewezen.")}${table(["Route", "Naam", "Charter", "Type", "System price", "Requested", "Status", "Note", "Actie"], rows, "Nog geen applicants")}`;
  }

  function bidsPage() {
    const list = S.role === "office" ? S.bids : S.bids.filter(b => b[2] === S.charter);
    const form = S.role === "charter" ? higherBidForm() : "";
    return `${header(S.role === "office" ? "Hogere biedingen" : "Mijn hogere biedingen", "Hogere biedingen staan los van normale route-aanvragen. Gebruik dit alleen als de huidige portaalprijs niet past.")}${form}${bidTable(list, S.role === "office")}`;
  }
  function higherBidForm() {
    const open = routes().filter(r => r.status === "open");
    return `<form class="card form-card" id="higherBidForm"><div class="card-title">Hoger bod indienen</div><div class="form-grid">${field("Route", "route", S.selectedBidRoute || open[0]?.id || "", "Kies de route waarvoor je meer wilt vragen", "text", open.map(r => r.id))}${field("Gevraagd bedrag", "amount", "", "Moet hoger zijn dan de huidige portaalprijs", "number")}${field("Reden", "reason", "Route te zwaar", "Waarom vraag je een hoger bedrag?", "text", ["Route te zwaar", "Wachttijd verwacht", "Extra kilometers", "Urgente laadtijd", "Laadklep nodig", "Anders"])}${field("Notitie", "note", "", "Korte uitleg voor planning")}</div><button class="btn primary" style="margin-top:14px">Hoger bod versturen</button></form>`;
  }
  function bidTable(list, office) {
    return table(["Bid", "Route", "Charter", "System price", "Hoger bod", "Verschil", "Status", "Reden", office ? "Actie" : "Datum"], list.map(b => { const r = routeById(b[1]); const diff = b[3] - r.systemPrice; return [b[0], b[1], b[2], fmt(r.systemPrice), fmt(b[3]), diff > 0 ? fmt(diff) : "—", status(b[4]), esc(b[5]), office ? `<button class="btn primary small" data-action="approveBid" data-id="${b[0]}">Assign</button> <button class="btn ghost small" data-action="rejectBid" data-id="${b[0]}">Reject</button>` : esc(b[7] || "")]; }), "Geen hogere biedingen");
  }

  function invoicesPage(mode = "both") {
    const list = S.role === "office" ? S.invoices : S.invoices.filter(i => i[1] === S.charter);
    const submit = (S.role === "charter" && mode !== "history") ? invoiceForm() : "";
    const history = mode !== "submit" ? `<div class="section-head"><div><h2>Factuurhistorie</h2><p>Expected payout wordt vergeleken met het ingediende bedrag.</p></div></div>${invoiceTable(list)}` : "";
    return `${header(S.role === "office" ? "Factuur controle" : (mode === "history" ? "Factuurhistorie" : "Factuur indienen"), S.role === "office" ? "Controleer facturen op mismatch voordat ze betaalbaar worden." : "Dien je wekelijkse factuur in en volg de status in de historie.")}${submit}${history}`;
  }
  function invoiceForm() {
    const expected = routes().filter(r => r.charter === S.charter).reduce((a, r) => a + r.systemPrice, 0);
    return `<form class="card form-card" id="invoiceForm"><div class="card-title">Nieuwe factuur indienen</div><div class="form-grid">${field("Charter", "charter", S.charter, "Wordt later automatisch gevuld vanuit login")}${field("Week", "week", "Week 26", "Bijv. Week 26 of 2026-W26")}${field("Expected payout", "expected", Math.round(expected || 750), "Bedrag dat het systeem verwacht", "number")}${field("Factuurbedrag", "amount", Math.round(expected || 750), "Bedrag op jouw factuur", "number")}${field("Aantal routes", "routes", routes().filter(r => r.charter === S.charter).length || 1, "Aantal routes op deze factuur", "number")}<div class="field"><label>Factuur upload</label><input class="input" type="file" accept=".pdf,.xlsx,.csv"><small>Upload later PDF, Excel of CSV. Demo slaat geen bestanden op.</small></div></div><button class="btn primary" style="margin-top:14px">Factuur indienen</button></form>`;
  }
  function invoiceTable(list) {
    return table(["Factuur", "Charter", "Week", "Expected", "Submitted", "Verschil", "Routes", "Status", S.role === "office" ? "Actie" : "Datum"], list.map(i => { const diff = (Number(i[3]) || 0) - (Number(i[7]) || 0); return [i[0], i[1], i[2], fmt(i[7]), fmt(i[3]), diff ? `<strong class="${diff > 0 ? "bad" : "warn"}">${fmt(diff)}</strong>` : `<span class="good">Match</span>`, i[4], status(i[5]), S.role === "office" ? `<button class="btn primary small" data-action="approveInvoice" data-id="${i[0]}">Goedkeuren</button>` : esc(i[6])]; }), "Geen facturen");
  }

  function disputesPage() {
    const list = S.role === "office" ? S.disputes : S.disputes.filter(d => d[2] === S.charter);
    return `${header("Disputes", S.role === "office" ? "Office kan bewijs vragen, correctie goedkeuren, gedeeltelijk goedkeuren, afwijzen of sluiten." : "Charter kan dispute melden, reply toevoegen en sluiten als opgelost.", S.role === "charter" ? `<button class="btn ghost" data-action="replyDispute">Reply toevoegen</button>` : "")}${S.role === "charter" ? disputeForm() : ""}${disputeTable(list)}`;
  }
  function disputeForm() {
    const assigned = routes().filter(r => r.charter === S.charter);
    return `<form class="card form-card" id="disputeForm"><div class="card-title">Dispute aanmaken</div><div class="form-grid">${field("Route", "route", assigned[0]?.id || "", "Kies de route waarop de dispute gaat", "text", assigned.map(r => r.id))}${field("Categorie", "type", "Gewicht incorrect", "Kies wat er niet klopt", "text", ["Gewicht incorrect", "Wachttijd", "Klant niet thuis", "Route te vol", "Extra kilometers", "Schade / missend item", "Betalingscorrectie"])}${field("Prioriteit", "prio", "medium", "Laag, medium of hoog", "text", ["low", "medium", "high"])}${field("Correctiebedrag", "correction", "25", "Bedrag dat je vraagt als correctie", "number")}<div class="field"><label>Proof upload</label><input class="input" type="file" accept=".jpg,.png,.pdf"><small>Demo placeholder voor bewijsfoto/PDF.</small></div>${field("Uitleg", "msg", "", "Korte uitleg voor Cargro")}</div><button class="btn primary" style="margin-top:14px">Dispute indienen</button></form>`;
  }
  function disputeTable(list) {
    return table(["Dispute", "Route", "Charter", "Categorie", "Correctie", "Status", "Beslissing", "Acties"], list.map(d => {
      const officeActions = `<button class="btn ghost small" data-action="evidenceDispute" data-id="${d[0]}">Bewijs vragen</button> <button class="btn primary small" data-action="approveDispute" data-id="${d[0]}">Approve</button> <button class="btn ghost small" data-action="partialDispute" data-id="${d[0]}">Partial</button> <button class="btn ghost small" data-action="rejectDispute" data-id="${d[0]}">Reject</button> <button class="btn ghost small" data-action="closeDispute" data-id="${d[0]}">Close</button>`;
      const charterActions = `<button class="btn ghost small" data-action="replyDispute" data-id="${d[0]}">Reply</button> <button class="btn ghost small" data-action="charterCloseDispute" data-id="${d[0]}">Close if solved</button>`;
      return [d[0], d[1], d[2], d[3], fmt(d[7] || 0), status(d[5]), esc(d[8] || "Nog beoordelen"), S.role === "office" ? officeActions : charterActions];
    }), "Geen disputes");
  }

  function fleetPage() {
    const vehicles = S.role === "office" ? S.vehicles : S.vehicles.filter(v => v[1] === S.charter);
    const drivers = S.role === "office" ? S.drivers : S.drivers.filter(d => d[1] === S.charter);
    return `${header("Voertuigen & chauffeurs", S.role === "office" ? "Per charter inzicht in voertuigen, chauffeurs en documentstatus." : "Voeg je eigen voertuigen en chauffeurs toe. Planning kan deze later goedkeuren.")}${S.role === "charter" ? `<div class="grid two">${vehicleForm()}${driverForm()}</div>` : ""}<div class="section-head"><div><h2>Voertuigen</h2></div></div>${vehicleTable(vehicles)}<div class="section-head"><div><h2>Chauffeurs</h2></div></div>${driverTable(drivers)}`;
  }
  function vehicleForm() { return `<form class="card form-card" id="vehicleForm"><div class="card-title">Voertuig toevoegen</div><div class="form-grid">${field("Voertuigtype", "type", "Bakwagen", "Bijv. L3, L4, Bakwagen", "text", ["L3", "L4", "Bakwagen", "Bakwagen laadklep"])}${field("Kenteken", "plate", "", "Vul het kenteken in")}${field("Capaciteit kg", "capacity", "950", "Maximaal laadgewicht", "number")}${field("Laadklep", "tail", "Ja", "Heeft het voertuig laadklep?", "text", ["Ja", "Nee"])}${field("Document geldig tot", "valid", "2026-12-31", "Datum verzekering/keuring")}</div><button class="btn primary" style="margin-top:14px">Voertuig toevoegen</button></form>`; }
  function driverForm() { return `<form class="card form-card" id="driverForm"><div class="card-title">Chauffeur toevoegen</div><div class="form-grid">${field("Naam", "name", "", "Voor- en achternaam chauffeur")}${field("Telefoon", "phone", "", "Bijv. +31 6 ...")}${field("Rijbewijs", "license", "B", "Bijv. B")}${field("Woonplaats", "city", "", "Plaats waar chauffeur start")}${field("Voertuig ID", "vehicle", "", "Optioneel: koppel aan voertuig")}</div><button class="btn primary" style="margin-top:14px">Chauffeur toevoegen</button></form>`; }
  function vehicleTable(list) { return table(["ID", "Charter", "Type", "Kenteken", "Capaciteit", "Laadklep", "Geldig tot", "Status"], list.map(v => [v[0], v[1], v[2], v[3], `${v[4]} kg`, v[6] || "", v[7] || "", status(v[5])]), "Geen voertuigen"); }
  function driverTable(list) { return table(["ID", "Charter", "Naam", "Telefoon", "Rijbewijs", "Status", "Woonplaats", "Voertuig"], list.map(d => [d[0], d[1], d[2], d[3], d[4], status(d[5]), d[6], d[7] || "—"]), "Geen chauffeurs"); }
  function chartersPage() { return `${header("Charter management", "Bedrijfsgegevens, documentstatus, zones en performance per charter.")}${table(["Charter", "Contact", "City", "KVK", "BTW", "Zones", "Docs", "Status", "Rating", "Priority"], S.charters.map(c => [c[0], c[7], c[1], c[8], c[9], c[10], c[3], status(c[2]), c[4], c[5]]), "Geen charters")}`; }
  function marginPage() { return `${header("Marge", "Alleen intern: klantomzet, charter payout en Cargro marge. Niet zichtbaar voor charters.")}${table(["Route", "Customer revenue", "Charter payout", "Marge", "Marge %", "Status"], routes().map(r => [r.id, fmt(r.customerRevenue), fmt(r.systemPrice), fmt(r.margin), `${Math.round((r.margin / r.customerRevenue) * 100)}%`, status(r.status)]), "Geen margegegevens")}`; }

  function renderView() {
    if (S.role === "office") return { dashboard: officeDashboard, import: importPage, market: marketPage, requests: requestsPage, bids: bidsPage, applicants: applicantsPage, invoices: () => invoicesPage("history"), disputes: disputesPage, charters: chartersPage, fleet: fleetPage, margin: marginPage }[S.view]?.() || officeDashboard();
    return { dashboard: charterDashboard, market: marketPage, myRoutes: () => `${header("Mijn routes", "Routes die door Cargro aan jou zijn toegewezen.")}${routeTable(routes().filter(r => r.charter === S.charter), false)}`, myRequests: requestsPage, myBids: bidsPage, invoiceSubmit: () => invoicesPage("submit"), invoiceHistory: () => invoicesPage("history"), disputes: disputesPage, fleet: fleetPage }[S.view]?.() || charterDashboard();
  }

  render = function () {
    if (!S.loggedIn) { A.innerHTML = loginScreen(); bind(); return; }
    A.innerHTML = `<div class="app-shell enterprise">${nav()}<main class="main"><div class="topbar"><div class="kicker">${S.role === "office" ? "Cargro Office / Planning" : esc(S.charter)}</div><div class="demo-note">Prototype · demo data</div></div>${renderView()}</main></div>`;
    bind();
  };

  bind = function () {
    document.querySelectorAll("[data-view]").forEach(b => b.onclick = () => { S.view = b.dataset.view; save(); render(); });
    document.querySelectorAll("[data-login]").forEach(b => b.onclick = () => { S.role = b.dataset.login; S.loggedIn = true; S.view = "dashboard"; const c = document.querySelector('[name="loginCharter"]'); if (c) S.charter = c.value; save(); render(); });
    const logout = document.querySelector("[data-logout]"); if (logout) logout.onclick = () => { S.loggedIn = false; save(); render(); };
    const charterSel = document.getElementById("charter"); if (charterSel) charterSel.onchange = e => { S.charter = e.target.value; S.view = "dashboard"; save(); render(); };

    const importForm = document.getElementById("routeImportForm");
    if (importForm) importForm.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(importForm)); const rate = Number(f.rate || KM_RATES[f.veh] || 0.35); const pay = Math.round(Number(f.km || 0) * rate * 100) / 100; const id = `RT-${200 + S.routes.length}`; S.routes.unshift([id, f.title, f.zone, f.load, f.veh, Number(f.stops), Number(f.km), 0, Number(f.kg), "open", "published", pay, Math.round(pay * 0.22), "", "Planning manual"]); S.routeDetails[id] = { rate, remarks: f.remarks, specs: f.specs }; save(); toast("Route is direct gepubliceerd in de marketplace"); S.view = "market"; render(); };

    const bulkForm = document.getElementById("bulkImportForm");
    if (bulkForm) bulkForm.onsubmit = e => { e.preventDefault(); if (!S.bulkPreview?.length) { toast("Laad eerst een CSV/voorbeeld preview"); return; } S.bulkPreview.forEach(f => { const id = `RT-${200 + S.routes.length}`; S.routes.unshift([id, f.title, f.zone, f.load, f.veh, Number(f.stops), Number(f.km), 0, Number(f.kg), "open", "published", f.pay, Math.round(f.pay * 0.22), "", f.source || "Bulk import"]); S.routeDetails[id] = { rate: Number(f.rate), remarks: f.remarks, specs: f.specs }; }); S.bulkPreview = []; save(); toast("Bulk routes gepubliceerd in marketplace"); S.view = "market"; render(); };

    const fileInput = document.querySelector('#bulkImportForm input[type="file"]');
    if (fileInput) fileInput.onchange = e => {
      const file = e.target.files?.[0]; if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) { toast("Excel-upload staat klaar als workflow placeholder; gebruik nu CSV of voorbeeld preview"); return; }
      const reader = new FileReader();
      reader.onload = () => { S.bulkPreview = parseCSV(String(reader.result || "")); save(); toast("CSV preview geladen"); render(); };
      reader.readAsText(file);
    };

    const invoiceFormEl = document.getElementById("invoiceForm");
    if (invoiceFormEl) invoiceFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(invoiceFormEl)); const amount = Number(f.amount), expected = Number(f.expected); const state = Math.abs(amount - expected) > 0 ? "mismatch" : "pending"; S.invoices.unshift([`INV-${60 + S.invoices.length}`, f.charter, f.week, amount, Number(f.routes), state, today, expected]); save(); toast("Factuur ingediend"); S.view = "invoiceHistory"; render(); };

    const bidForm = document.getElementById("higherBidForm");
    if (bidForm) bidForm.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(bidForm)); const r = routeById(f.route); const amount = Number(f.amount); if (!amount || amount <= r.systemPrice) { toast("Hoger bod moet boven de huidige portaalprijs liggen"); return; } S.bids.unshift([`BID-${330 + S.bids.length}`, f.route, S.charter, amount, "pending", `${f.reason}: ${f.note || "geen extra notitie"}`, "higher", today]); S.selectedBidRoute = ""; save(); toast("Hoger bod verstuurd naar planning"); render(); };

    const disputeFormEl = document.getElementById("disputeForm");
    if (disputeFormEl) disputeFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(disputeFormEl)); S.disputes.unshift([`DSP-${50 + S.disputes.length}`, f.route, S.charter, f.type, f.prio, "Open", f.msg, Number(f.correction), "Nog beoordelen", []]); save(); toast("Dispute ingediend"); render(); };

    const vehicleFormEl = document.getElementById("vehicleForm");
    if (vehicleFormEl) vehicleFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(vehicleFormEl)); S.vehicles.unshift([`VH-${100 + S.vehicles.length}`, S.charter, f.type, f.plate, Number(f.capacity), "pending", f.tail, f.valid]); save(); toast("Voertuig toegevoegd ter controle"); render(); };

    const driverFormEl = document.getElementById("driverForm");
    if (driverFormEl) driverFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(driverFormEl)); S.drivers.unshift([`DR-${100 + S.drivers.length}`, S.charter, f.name, f.phone, f.license, "pending", f.city, f.vehicle || "—"]); save(); toast("Chauffeur toegevoegd ter controle"); render(); };

    document.querySelectorAll("[data-action]").forEach(b => b.onclick = () => action(b.dataset.action, b.dataset.id));
    const z = document.getElementById("zf"), v = document.getElementById("vf");
    if (z && v) { const fl = () => document.querySelectorAll(".route-card").forEach(card => { const rz = card.dataset.zone || ""; const rv = card.dataset.vehicle || ""; card.style.display = (z.value === "all" || rz === z.value) && (v.value === "all" || rv === v.value) ? "" : "none"; }); z.onchange = fl; v.onchange = fl; }
  };

  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const cols = line.split(",").map(c => c.trim());
      const obj = Object.fromEntries(headers.map((h, i) => [h, cols[i] || ""]));
      const veh = obj.vehicle_type || "Bakwagen";
      const rate = Number(obj.rate_per_km || KM_RATES[veh] || 0.35);
      const km = Number(obj.km || 0);
      return { title: obj.route_name || "Bulk route", zone: obj.zone || "Oost", load: obj.load_time || "07:00", veh, stops: Number(obj.stops || 0), km, kg: Number(obj.kg || 0), rate, pay: Math.round(km * rate * 100) / 100, remarks: obj.opmerkingen || "", specs: obj.specificaties || "", source: "CSV import" };
    });
  }

  function action(a, id) {
    if (a === "sampleBulk") { S.bulkPreview = [
      { title: "Bulk route Apeldoorn", zone: "Oost", load: "06:50", veh: "Bakwagen", stops: 15, km: 285, kg: 610, rate: 0.45, pay: 128.25, remarks: "MendriX export voorbeeld", specs: "Steekwagen meenemen", source: "CSV import" },
      { title: "Bulk route Breda", zone: "Zuid", load: "07:20", veh: "L4", stops: 19, km: 240, kg: 480, rate: 0.35, pay: 84, remarks: "Veel kleine stops", specs: "Geen laadklep nodig", source: "Excel import" }
    ]; save(); toast("Voorbeeld preview geladen"); render(); return; }
    if (a === "mendrixImport") { toast("Directe MendriX integratie kan later via API of vaste export-map. Nu: CSV/Excel export uploaden."); return; }
    if (a === "toggleSpecs") { S.expandedSpecs = S.expandedSpecs || {}; S.expandedSpecs[id] = !S.expandedSpecs[id]; save(); render(); return; }
    if (a === "requestRoute") { const r = routeById(id); S.routeRequests.unshift([`REQ-${250 + S.routeRequests.length}`, id, S.charter, "current", r.systemPrice, "pending", "Aanvraag tegen huidige portaalprijs", today]); save(); toast("Route aanvraag verstuurd naar office/planning"); render(); return; }
    if (a === "prepareBid") { S.selectedBidRoute = id; S.view = "myBids"; save(); render(); return; }
    if (a === "approveRequest") { const req = S.routeRequests.find(x => x[0] === id), rr = req && routeRow(req[1]); if (req && rr) assignRoute(req[1], req[2], req[4], "request", id); return; }
    if (a === "rejectRequest") { const req = S.routeRequests.find(x => x[0] === id); if (req) { req[5] = "rejected"; save(); toast("Route aanvraag afgewezen"); render(); } return; }
    if (a === "approveBid") { const bid = S.bids.find(x => x[0] === id); if (bid) assignRoute(bid[1], bid[2], bid[3], "bid", id); return; }
    if (a === "rejectBid") { const bid = S.bids.find(x => x[0] === id); if (bid) { bid[4] = "rejected"; save(); toast("Hoger bod afgewezen"); render(); } return; }
    if (a === "approveInvoice") { const inv = S.invoices.find(x => x[0] === id); if (inv) { inv[5] = "approved"; save(); toast("Factuur goedgekeurd"); render(); } return; }
    if (a === "evidenceDispute") updateDispute(id, "Evidence requested", "Office vraagt extra bewijs op.");
    if (a === "approveDispute") updateDispute(id, "Correction approved", "Correctie volledig goedgekeurd.");
    if (a === "partialDispute") updateDispute(id, "Partially approved", "Correctie gedeeltelijk goedgekeurd.");
    if (a === "rejectDispute") updateDispute(id, "Rejected", "Dispute afgewezen.");
    if (a === "closeDispute") updateDispute(id, "Closed", "Dispute gesloten door office.");
    if (a === "replyDispute") updateDispute(id || S.disputes.find(d => d[2] === S.charter)?.[0], "Under review", "Charter reply toegevoegd.");
    if (a === "charterCloseDispute") updateDispute(id, "Closed", "Charter heeft dispute gesloten als opgelost.");
  }
  function assignRoute(routeId, charter, amount, source, id) {
    const rr = routeRow(routeId); if (!rr) return;
    rr[9] = "assigned"; rr[13] = charter; rr[11] = amount;
    S.routeRequests.filter(x => x[1] === routeId).forEach(x => x[5] = (source === "request" && x[0] === id) ? "approved" : "rejected");
    S.bids.filter(x => x[1] === routeId).forEach(x => x[4] = (source === "bid" && x[0] === id) ? "approved" : "rejected");
    save(); toast(`Route assigned aan ${charter}; andere applicants afgewezen`); render();
  }
  function updateDispute(id, state, decision) {
    const d = S.disputes.find(x => x[0] === id); if (!d) return;
    d[5] = state; d[8] = decision; d[9] = d[9] || []; d[9].push([today, decision]);
    save(); toast(decision); render();
  }

  render();
})();
