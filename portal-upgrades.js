(function () {
  if (typeof S === "undefined") return;

  const VERSION = "enterprise-workflow-v1";
  const today = "2026-06-26";

  function seedEnterpriseData() {
    S.loggedIn = false;
    S.role = "office";
    S.view = "dashboard";
    S.charter = "LuxeLine Transport";
    S.routes = [
      ["RT-101", "Zwolle + Beek-Ubbergen", "Oost", "06:15", "Bakwagen", 17, 727, 13.8, 640, "open", "published", 842, 192, "", "MendriX"],
      ["RT-102", "Randstad speelgoedroute", "Randstad", "07:00", "L4", 23, 318, 8.5, 520, "open", "published", 681, 176, "", "MendriX"],
      ["RT-103", "Noord zware stops", "Noord", "06:35", "Bakwagen laadklep", 14, 455, 10.2, 970, "open", "published", 746, 138, "", "MendriX"],
      ["RT-104", "Zuid correctieronde", "Zuid", "07:30", "L3", 12, 226, 6.4, 310, "assigned", "published", 417, 113, "Zuid Logistics Partner", "Planning manual"],
      ["RT-105", "Midden fulfilment pickup", "Midden", "15:30", "Bakwagen", 9, 188, 5.7, 790, "assigned", "published", 389, 96, "Duiven Express", "CSV import"]
    ];
    S.routeRequests = [
      ["REQ-201", "RT-102", "Randstad Koeriers", "current", 681, "pending", "Route past goed in mijn Randstad planning.", today],
      ["REQ-202", "RT-101", "LuxeLine Transport", "current", 842, "approved", "Bakwagen beschikbaar vanaf 06:00.", "2026-06-25"]
    ];
    S.bids = [
      ["BID-301", "RT-103", "Noord Carrier Network", 795, "pending", "Hoger bod vanwege laadklep, zware stops en lange afstand.", "higher", today],
      ["BID-302", "RT-102", "Randstad Koeriers", 715, "review", "Hoger bod vanwege verwachte wachttijd bij laadadres.", "higher", today]
    ];
    S.invoices = [
      ["INV-044", "LuxeLine Transport", "Week 26", 1998, 3, "approved", "2026-06-25", 1998],
      ["INV-045", "Randstad Koeriers", "Week 26", 2795, 4, "mismatch", today, 2715],
      ["INV-046", "Duiven Express", "Week 26", 462, 1, "pending", today, 462]
    ];
    S.disputes = [
      ["DSP-031", "RT-101", "LuxeLine Transport", "Gewicht incorrect", "high", "to handle", "Stop stond als 4 kg maar was veel zwaarder.", 35, "Nog beoordelen"],
      ["DSP-032", "RT-103", "Noord Carrier Network", "Wachttijd", "medium", "open", "Extra wachttijd bij magazijn verwacht.", 22, "Nog beoordelen"]
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
    S._workflowVersion = VERSION;
    save();
  }

  if (S._workflowVersion !== VERSION) seedEnterpriseData();

  const fmt = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
  const nr = v => new Intl.NumberFormat("nl-NL").format(Number(v) || 0);
  const esc = v => String(v ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const status = s => `<span class="status ${slug(s)}">${esc(s)}</span>`;
  const pill = (s, c = "blue") => `<span class="pill ${c}">${esc(s)}</span>`;
  const field = (label, name, value = "", help = "", type = "text", options = null) => {
    const body = options
      ? `<select name="${name}">${options.map(o => `<option ${o === value ? "selected" : ""}>${esc(o)}</option>`).join("")}</select>`
      : `<input class="input" type="${type}" name="${name}" value="${esc(value)}" placeholder="${esc(help)}">`;
    return `<div class="field"><label>${esc(label)}</label>${body}${help ? `<small>${esc(help)}</small>` : ""}</div>`;
  };
  const route = row => {
    const r = R(row);
    r.systemPrice = Number(r.pay) || 0;
    r.customerRevenue = r.systemPrice + (Number(r.margin) || 0);
    r.heavyStops = r.kg > 900 ? 5 : r.kg > 700 ? 2 : r.kg > 500 ? 1 : 0;
    r.equipment = r.veh.includes("laadklep") ? "Laadklep, pompwagen, spanbanden" : r.veh === "Bakwagen" ? "Steekwagen, spanbanden" : "Steekwagen";
    r.perHour = r.hrs ? r.systemPrice / r.hrs : 0;
    r.perKm = r.km ? r.systemPrice / r.km : 0;
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
      disputes: S.disputes.filter(d => ["to handle", "open"].includes(d[5])).length
    };
  }

  function loginScreen() {
    return `<main class="login-screen"><section class="login-panel">
      <div class="login-card login-intro"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">enterprise workflow prototype</div></div></div><h1>Planning, charters en facturen in één controlelaag.</h1><p>Routes uit MendriX zijn direct gepubliceerd. Charters uploaden geen routes; zij vragen routes aan vanuit de marketplace of dienen een hoger bod in.</p><div class="trust-row"><span>MendriX import</span><span>Route requests</span><span>Bid control</span><span>Invoice matching</span></div></div>
      <div class="login-card"><div class="eyebrow">Demo login</div><h2>Kies je omgeving</h2><p>Later wordt dit Supabase Auth met echte rollen en rechten.</p><div class="login-options"><button class="login-option" data-login="office"><strong>Cargro Office / Planning</strong><span>Uploaden, publiceren, aanvragen goedkeuren, biedingen en facturen controleren</span></button><button class="login-option" data-login="charter"><strong>Charter login</strong><span>Routes aanvragen, hoger bod doen, factuur indienen, voertuigen/chauffeurs beheren</span></button></div>${field("Demo charter", "loginCharter", S.charter, "Kies welke charteromgeving je wilt bekijken", "text", S.charters.map(c => c[0]))}</div>
    </section></main>`;
  }

  nav = function () {
    const c = counts();
    const office = [["dashboard", "Dashboard", ""], ["import", "Route import", ""], ["market", "Marketplace", "openRoutes"], ["requests", "Route aanvragen", "requests"], ["bids", "Hogere biedingen", "bids"], ["invoices", "Factuur controle", "invoices"], ["disputes", "Disputes", "disputes"], ["charters", "Charters", ""], ["fleet", "Voertuigen & chauffeurs", ""], ["margin", "Marge", ""]];
    const charter = [["dashboard", "Dashboard", ""], ["market", "Marketplace", "openRoutes"], ["myRoutes", "Mijn routes", ""], ["myRequests", "Mijn aanvragen", ""], ["myBids", "Mijn hogere biedingen", ""], ["invoiceSubmit", "Factuur indienen", ""], ["invoiceHistory", "Factuurhistorie", ""], ["disputes", "Disputes", "disputes"], ["fleet", "Voertuigen & chauffeurs", ""]];
    const items = S.role === "office" ? office : charter;
    return `<aside class="sidebar enterprise-sidebar"><div class="sidebar-brand"><div class="logo">CG</div><div><strong>Cargro</strong><span>Charterportaal</span></div></div><button class="btn ghost full" data-logout>Andere login</button>${S.role === "charter" ? `<div class="field compact"><label>Charter</label><select id="charter">${S.charters.map(q => `<option ${q[0] === S.charter ? "selected" : ""}>${q[0]}</option>`).join("")}</select><small>Bekijk de portal als deze charter.</small></div>` : ""}<div class="nav-group-title">Menu</div>${items.map(i => `<button class="nav-btn ${S.view === i[0] ? "active" : ""}" data-view="${i[0]}"><span class="nav-left"><span class="nav-dot"></span>${i[1]}</span>${i[2] && c[i[2]] ? `<span class="badge-count">${c[i[2]]}</span>` : ""}</button>`).join("")}<div class="sidebar-note"><strong>Workflow rule</strong><span>MendriX import = direct gepubliceerd. Charter = alleen aanvragen of hoger bod.</span></div></aside>`;
  };

  function officeDashboard() {
    const c = counts();
    const payout = routes().reduce((a, r) => a + r.systemPrice, 0);
    const marginTotal = routes().reduce((a, r) => a + r.margin, 0);
    return `${header("Office dashboard", "Dagelijks controlepaneel voor planning: routes importeren, marketplace sturen, aanvragen/biedingen/facturen/disputes afhandelen.", `<button class="btn primary" data-view="import">Routes importeren</button><button class="btn ghost" data-view="requests">Aanvragen bekijken</button>`)}<section class="grid four"><div class="card metric"><div><div class="metric-label">Open marketplace</div><div class="metric-value">${c.openRoutes}</div></div><span class="metric-trend">direct uit MendriX</span></div><div class="card metric"><div><div class="metric-label">Route aanvragen</div><div class="metric-value">${c.requests}</div></div><span class="metric-trend warn">approval nodig</span></div><div class="card metric"><div><div class="metric-label">Hogere biedingen</div><div class="metric-value">${c.bids}</div></div><span class="metric-trend warn">apart controleren</span></div><div class="card metric"><div><div class="metric-label">Factuur checks</div><div class="metric-value">${c.invoices}</div></div><span class="metric-trend ${c.invoices ? "warn" : ""}">mismatch monitor</span></div></section><section class="grid two" style="margin-top:18px"><div class="card"><div class="card-title">Operationele flow</div>${operationBoard()}</div><div class="card"><div class="card-title">Financieel overzicht</div><div class="price-strip"><div class="price-cell"><strong>${fmt(payout)}</strong><span>Charter payout</span></div><div class="price-cell"><strong>${fmt(marginTotal)}</strong><span>Interne marge</span></div><div class="price-cell"><strong>${S.invoices.length}</strong><span>Facturen</span></div><div class="price-cell"><strong>${c.disputes}</strong><span>Disputes open</span></div></div><p class="muted">Charters zien nooit marge of klantomzet.</p></div></section><div class="section-head"><div><h2>Vandaag afhandelen</h2><p>Alle actiepunten voor planning en administratie.</p></div></div>${actionTables()}`;
  }
  function charterDashboard() {
    const assigned = routes().filter(r => r.charter === S.charter);
    const req = S.routeRequests.filter(r => r[2] === S.charter);
    const bids = S.bids.filter(b => b[2] === S.charter);
    const inv = S.invoices.filter(i => i[1] === S.charter);
    return `${header("Charter dashboard", "Snel overzicht van jouw routes, aanvragen, biedingen, facturen en documenten.", `<button class="btn primary" data-view="market">Routes bekijken</button><button class="btn ghost" data-view="invoiceSubmit">Factuur indienen</button>`)}<section class="grid four"><div class="card metric"><div><div class="metric-label">Mijn routes</div><div class="metric-value">${assigned.length}</div></div></div><div class="card metric"><div><div class="metric-label">Aanvragen</div><div class="metric-value">${req.filter(x => x[5] === "pending").length}</div></div><span class="metric-trend warn">wacht op office</span></div><div class="card metric"><div><div class="metric-label">Hogere biedingen</div><div class="metric-value">${bids.filter(x => ["pending", "review"].includes(x[4])).length}</div></div></div><div class="card metric"><div><div class="metric-label">Facturen</div><div class="metric-value">${inv.length}</div></div></div></section><div class="section-head"><div><h2>Mijn toegewezen routes</h2></div></div>${routeTable(assigned, false)}`;
  }

  function operationBoard() {
    const lanes = [["Open", S.routes.filter(r => r[9] === "open"), "route"], ["Aanvragen", S.routeRequests.filter(r => r[5] === "pending"), "request"], ["Biedingen", S.bids.filter(b => ["pending", "review"].includes(b[4])), "bid"], ["Assigned", S.routes.filter(r => r[9] === "assigned"), "route"], ["Facturen", S.invoices.filter(i => ["pending", "mismatch", "review"].includes(i[5])), "invoice"], ["Disputes", S.disputes.filter(d => ["to handle", "open"].includes(d[5])), "dispute"]];
    return `<div class="operation-board compact-board">${lanes.map(([title, items, type]) => `<div class="lane"><div class="lane-head"><strong>${title}</strong><span>${items.length}</span></div><div class="lane-items">${items.slice(0, 4).map(i => boardItem(type, i)).join("") || `<div class="lane-empty">Geen items</div>`}</div></div>`).join("")}</div>`;
  }
  function boardItem(type, item) {
    if (type === "request") return `<div class="board-item"><strong>${esc(item[1])}</strong><span>${esc(item[2])}</span><em>${fmt(item[4])}</em></div>`;
    if (type === "bid") { const base = routeById(item[1]); return `<div class="board-item"><strong>${esc(item[1])}</strong><span>${esc(item[2])}</span><em>${fmt(item[3])} · +${fmt(item[3] - base.systemPrice)}</em></div>`; }
    if (type === "invoice") { const diff = item[3] - item[7]; return `<div class="board-item"><strong>${esc(item[0])}</strong><span>${esc(item[1])}</span><em>${diff ? "Verschil " + fmt(diff) : "Match"}</em></div>`; }
    if (type === "dispute") return `<div class="board-item"><strong>${esc(item[0])}</strong><span>${esc(item[3])}</span><em>${fmt(item[7] || 0)}</em></div>`;
    const r = route(item); return `<div class="board-item"><strong>${esc(r.id)}</strong><span>${esc(r.title)}</span><em>${fmt(r.systemPrice)}</em></div>`;
  }
  function actionTables() {
    return `<div class="grid two"><div>${routeRequestTable(S.routeRequests.filter(r => r[5] === "pending"), true)}</div><div>${bidTable(S.bids.filter(b => ["pending", "review"].includes(b[4])), true)}</div></div>`;
  }

  function importPage() {
    if (S.role !== "office") return marketPage();
    return `${header("Route import", "Alleen Cargro Office / Planning kan routes uploaden of handmatig aanmaken. Routes uit MendriX zijn al goedgekeurd en gaan direct naar de marketplace.", `<button class="btn ghost" data-view="market">Marketplace bekijken</button>`)}<div class="grid two"><form class="card" id="routeImportForm"><div class="card-title">Nieuwe route publiceren</div><p class="muted">Gebruik dit voor MendriX export, CSV/Excel of een handmatige planningroute. Geen extra approval nodig, want planning publiceert zelf.</p><div class="form-grid">${field("Bron", "source", "MendriX", "Kies waar de route vandaan komt", "text", ["MendriX", "CSV import", "Excel import", "Planning manual"])}${field("Routenaam", "title", "Nieuwe MendriX route", "Bijv. Zwolle + Beek-Ubbergen")}${field("Zone", "zone", "Oost", "Kies routegebied", "text", ["Oost", "Midden", "Zuid", "Noord", "West", "Randstad"])}${field("Laadtijd", "load", "06:45", "Bijv. 06:45")}${field("Voertuig", "veh", "Bakwagen", "Benodigd voertuigtype", "text", ["L3", "L4", "Bakwagen", "Bakwagen laadklep"])}${field("Stops", "stops", "16", "Aantal afleverstops", "number")}${field("Kilometers", "km", "340", "Geschatte routekilometers", "number")}${field("Uren", "hrs", "9.5", "Geschatte route-uren", "number")}${field("Gewicht kg", "kg", "620", "Totaal geschat gewicht", "number")}${field("Payout", "pay", "720", "Huidige portaalprijs voor charter", "number")}</div><button class="btn primary full" style="margin-top:14px">Publiceer direct in marketplace</button></form><div class="card"><div class="card-title">Importregels</div>${["MendriX routes zijn door planning al gecontroleerd.", "Charters kunnen geen routes uploaden of aanmaken.", "Charters vragen routes aan vanuit de marketplace.", "Hogere biedingen komen niet bij route-aanvragen, maar in een aparte bid-sectie."].map((x, i) => `<div class="step"><div class="step-num">${i + 1}</div><div><strong>${x}</strong><span>Zo blijft Cargro in controle over planning en prijs.</span></div></div>`).join("")}</div></div><div class="section-head"><div><h2>Gepubliceerde routes</h2></div></div>${routeTable(routes(), true)}`;
  }

  function routeCard(r) {
    const requested = S.routeRequests.some(x => x[1] === r.id && x[2] === S.charter && x[5] === "pending");
    const bidPending = S.bids.some(x => x[1] === r.id && x[2] === S.charter && ["pending", "review"].includes(x[4]));
    return `<article class="route-card"><div class="route-top"><div><div class="route-title">${esc(r.title)}</div><div class="route-meta">${esc(r.id)} · ${esc(r.source)} · laden ${esc(r.load)}</div></div>${status(r.status)}</div><div class="route-info">${pill(r.zone, "blue")}${pill(r.veh, "gray")}${pill(`${r.stops} stops`, "green")}${pill(`${nr(r.kg)} kg`, r.heavyStops ? "orange" : "gray")}${r.heavyStops ? pill(`${r.heavyStops} zware stops`, "red") : ""}</div><div class="price-strip"><div class="price-cell"><strong>${fmt(r.systemPrice)}</strong><span>Huidige portaalprijs</span></div><div class="price-cell"><strong>${fmt(r.perHour)}</strong><span>Verdienste / uur</span></div><div class="price-cell"><strong>${fmt(r.perKm)}</strong><span>Verdienste / km</span></div><div class="price-cell"><strong>${esc(r.equipment)}</strong><span>Benodigd</span></div></div>${S.role === "charter" && r.status === "open" ? `<div class="route-actions"><button class="btn primary small" data-action="requestRoute" data-id="${r.id}" ${requested ? "disabled" : ""}>${requested ? "Aangevraagd" : "Aanvragen voor huidige prijs"}</button><button class="btn ghost small" data-action="prepareBid" data-id="${r.id}" ${bidPending ? "disabled" : ""}>${bidPending ? "Bod ingediend" : "Hoger bod doen"}</button></div>` : ""}</article>`;
  }
  function marketPage() {
    const list = visibleRoutes().filter(r => r.status === "open");
    return `${header("Marketplace", S.role === "office" ? "Routes die door planning zijn gepubliceerd en beschikbaar zijn voor charters." : "Vraag een route aan tegen de huidige portaalprijs of doe een hoger bod via jouw biedingenscherm.", S.role === "office" ? `<button class="btn primary" data-view="import">Route importeren</button>` : `<button class="btn ghost" data-view="myBids">Hoger bod formulier</button>`)}<div class="filters"><select id="zf"><option value="all">Alle zones</option><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>West</option><option>Randstad</option></select><select id="vf"><option value="all">Alle voertuigen</option><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select><span class="filter-note">Charters uploaden geen routes; zij vragen hier routes aan.</span></div><div class="grid two">${list.map(routeCard).join("") || `<div class="empty">Geen open routes.</div>`}</div>`;
  }
  function routeTable(list, office) {
    return table(["Route", "Zone", "Voertuig", "Stops", "KM", "Uren", "Payout", "Bron", "Status", office ? "Charter" : ""].filter(Boolean), list.map(r => [
      `${esc(r.id)}<br><strong>${esc(r.title)}</strong>`, esc(r.zone), esc(r.veh), r.stops, nr(r.km), nr(r.hrs), fmt(r.systemPrice), esc(r.source), status(r.status), office ? esc(r.charter || "Nog vrij") : ""
    ].filter((_, i) => office || i !== 9)), "Geen routes gevonden");
  }

  function requestsPage() {
    const list = S.role === "office" ? S.routeRequests : S.routeRequests.filter(r => r[2] === S.charter);
    return `${header(S.role === "office" ? "Route aanvragen" : "Mijn route aanvragen", S.role === "office" ? "Aanvragen tegen de huidige portaalprijs. Dit is geen hoger bod." : "Hier zie je routes die jij voor de huidige prijs hebt aangevraagd.")}${routeRequestTable(list, S.role === "office")}`;
  }
  function routeRequestTable(list, office) {
    return table(["Aanvraag", "Route", "Charter", "Prijs", "Status", "Notitie", office ? "Actie" : "Datum"], list.map(x => [x[0], x[1], x[2], fmt(x[4]), status(x[5]), esc(x[6]), office ? `<button class="btn primary small" data-action="approveRequest" data-id="${x[0]}">Goedkeuren</button> <button class="btn ghost small" data-action="rejectRequest" data-id="${x[0]}">Afwijzen</button>` : esc(x[7])]), "Geen route aanvragen");
  }

  function bidsPage() {
    const list = S.role === "office" ? S.bids : S.bids.filter(b => b[2] === S.charter);
    const form = S.role === "charter" ? higherBidForm() : "";
    return `${header(S.role === "office" ? "Hogere biedingen" : "Mijn hogere biedingen", "Alleen biedingen boven de huidige portaalprijs staan hier. Normale route-aanvragen staan in een aparte sectie.")}${form}${bidTable(list, S.role === "office")}`;
  }
  function higherBidForm() {
    const open = routes().filter(r => r.status === "open");
    return `<form class="card form-card" id="higherBidForm"><div class="card-title">Hoger bod indienen</div><div class="form-grid">${field("Route", "route", S.selectedBidRoute || open[0]?.id || "", "Kies de route waarvoor je meer wilt vragen", "text", open.map(r => r.id))}${field("Gevraagd bedrag", "amount", "", "Moet hoger zijn dan de huidige portaalprijs", "number")}${field("Reden", "reason", "Route te zwaar", "Bijv. zware stops, wachttijd, extra kilometers", "text", ["Route te zwaar", "Wachttijd verwacht", "Extra kilometers", "Urgente laadtijd", "Laadklep nodig", "Anders"])}${field("Notitie", "note", "", "Korte uitleg voor planning")}</div><button class="btn primary" style="margin-top:14px">Hoger bod versturen</button></form>`;
  }
  function bidTable(list, office) {
    return table(["Bid", "Route", "Charter", "System price", "Hoger bod", "Verschil", "Status", "Reden", office ? "Actie" : "Datum"], list.map(b => { const r = routeById(b[1]); const diff = b[3] - r.systemPrice; return [b[0], b[1], b[2], fmt(r.systemPrice), fmt(b[3]), diff > 0 ? fmt(diff) : "—", status(b[4]), esc(b[5]), office ? `<button class="btn primary small" data-action="approveBid" data-id="${b[0]}">Goedkeuren</button> <button class="btn ghost small" data-action="rejectBid" data-id="${b[0]}">Afwijzen</button>` : esc(b[7] || "")]; }), "Geen hogere biedingen");
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
    return table(["Factuur", "Charter", "Week", "Expected", "Submitted", "Verschil", "Routes", "Status", S.role === "office" ? "Actie" : "Datum"], list.map(i => { const diff = i[3] - i[7]; return [i[0], i[1], i[2], fmt(i[7]), fmt(i[3]), diff ? `<strong class="${diff > 0 ? "bad" : "warn"}">${fmt(diff)}</strong>` : `<span class="good">Match</span>`, i[4], status(i[5]), S.role === "office" ? `<button class="btn primary small" data-action="approveInvoice" data-id="${i[0]}">Goedkeuren</button>` : esc(i[6])]; }), "Geen facturen");
  }

  function disputesPage() {
    const list = S.role === "office" ? S.disputes : S.disputes.filter(d => d[2] === S.charter);
    return `${header("Disputes", S.role === "office" ? "Afhandeling van route-, betaling- en uitvoeringdisputes." : "Maak een dispute aan vanuit je eigen routes en volg de beslissing.")}${S.role === "charter" ? disputeForm() : ""}${table(["Dispute", "Route", "Charter", "Categorie", "Prioriteit", "Correctie", "Status", "Beslissing", S.role === "office" ? "Actie" : ""].filter(Boolean), list.map(d => [d[0], d[1], d[2], d[3], pill(d[4], d[4] === "high" ? "red" : "orange"), fmt(d[7] || 0), status(d[5]), esc(d[8] || "Nog beoordelen"), S.role === "office" ? `<button class="btn primary small" data-action="closeDispute" data-id="${d[0]}">Oplossen</button>` : ""].filter((_, i) => S.role === "office" || i !== 8)), "Geen disputes")}`;
  }
  function disputeForm() {
    const assigned = routes().filter(r => r.charter === S.charter);
    return `<form class="card form-card" id="disputeForm"><div class="card-title">Dispute aanmaken</div><div class="form-grid">${field("Route", "route", assigned[0]?.id || "", "Kies de route waarop de dispute gaat", "text", assigned.map(r => r.id))}${field("Categorie", "type", "Gewicht incorrect", "Kies wat er niet klopt", "text", ["Gewicht incorrect", "Wachttijd", "Klant niet thuis", "Route te vol", "Extra kilometers", "Schade / missend item", "Betalingscorrectie"])}${field("Prioriteit", "prio", "medium", "Laag, medium of hoog", "text", ["low", "medium", "high"])}${field("Correctiebedrag", "correction", "25", "Bedrag dat je vraagt als correctie", "number")}${field("Uitleg", "msg", "", "Korte uitleg voor Cargro")}</div><button class="btn primary" style="margin-top:14px">Dispute indienen</button></form>`;
  }

  function fleetPage() {
    const vehicles = S.role === "office" ? S.vehicles : S.vehicles.filter(v => v[1] === S.charter);
    const drivers = S.role === "office" ? S.drivers : S.drivers.filter(d => d[1] === S.charter);
    return `${header("Voertuigen & chauffeurs", S.role === "office" ? "Per charter inzicht in voertuigen, chauffeurs en documentstatus." : "Voeg je eigen voertuigen en chauffeurs toe. Planning kan deze later goedkeuren.")}${S.role === "charter" ? `<div class="grid two">${vehicleForm()}${driverForm()}</div>` : ""}<div class="section-head"><div><h2>Voertuigen</h2></div></div>${vehicleTable(vehicles)}<div class="section-head"><div><h2>Chauffeurs</h2></div></div>${driverTable(drivers)}`;
  }
  function vehicleForm() {
    return `<form class="card form-card" id="vehicleForm"><div class="card-title">Voertuig toevoegen</div><div class="form-grid">${field("Voertuigtype", "type", "Bakwagen", "Bijv. L3, L4, Bakwagen", "text", ["L3", "L4", "Bakwagen", "Bakwagen laadklep"])}${field("Kenteken", "plate", "", "Vul het kenteken in")}${field("Capaciteit kg", "capacity", "950", "Maximaal laadgewicht", "number")}${field("Laadklep", "tail", "Ja", "Heeft het voertuig laadklep?", "text", ["Ja", "Nee"])}${field("Document geldig tot", "valid", "2026-12-31", "Datum verzekering/keuring")}</div><button class="btn primary" style="margin-top:14px">Voertuig toevoegen</button></form>`;
  }
  function driverForm() {
    return `<form class="card form-card" id="driverForm"><div class="card-title">Chauffeur toevoegen</div><div class="form-grid">${field("Naam", "name", "", "Voor- en achternaam chauffeur")}${field("Telefoon", "phone", "", "Bijv. +31 6 ...")}${field("Rijbewijs", "license", "B", "Bijv. B")}${field("Woonplaats", "city", "", "Plaats waar chauffeur start")}${field("Voertuig ID", "vehicle", "", "Optioneel: koppel aan voertuig")}</div><button class="btn primary" style="margin-top:14px">Chauffeur toevoegen</button></form>`;
  }
  function vehicleTable(list) {
    return table(["ID", "Charter", "Type", "Kenteken", "Capaciteit", "Laadklep", "Geldig tot", "Status"], list.map(v => [v[0], v[1], v[2], v[3], `${v[4]} kg`, v[6] || "", v[7] || "", status(v[5])]), "Geen voertuigen");
  }
  function driverTable(list) {
    return table(["ID", "Charter", "Naam", "Telefoon", "Rijbewijs", "Status", "Woonplaats", "Voertuig"], list.map(d => [d[0], d[1], d[2], d[3], d[4], status(d[5]), d[6], d[7] || "—"]), "Geen chauffeurs");
  }

  function chartersPage() {
    return `${header("Charter management", "Bedrijfsgegevens, documentstatus, zones en performance per charter.")}${table(["Charter", "Contact", "City", "KVK", "BTW", "Zones", "Docs", "Status", "Rating", "Priority"], S.charters.map(c => [c[0], c[7], c[1], c[8], c[9], c[10], c[3], status(c[2]), c[4], c[5]]), "Geen charters")}`;
  }
  function marginPage() {
    const data = routes();
    return `${header("Marge", "Alleen intern: klantomzet, charter payout en Cargro marge. Niet zichtbaar voor charters.")}${table(["Route", "Customer revenue", "Charter payout", "Marge", "Marge %", "Status"], data.map(r => [r.id, fmt(r.customerRevenue), fmt(r.systemPrice), fmt(r.margin), `${Math.round((r.margin / r.customerRevenue) * 100)}%`, status(r.status)]), "Geen margegegevens")}`;
  }

  function renderView() {
    if (S.role === "office") {
      return { dashboard: officeDashboard, import: importPage, market: marketPage, requests: requestsPage, bids: bidsPage, invoices: () => invoicesPage("history"), disputes: disputesPage, charters: chartersPage, fleet: fleetPage, margin: marginPage }[S.view]?.() || officeDashboard();
    }
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
    if (importForm) importForm.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(importForm)); const pay = Number(f.pay) || 0; S.routes.unshift([`RT-${200 + S.routes.length}`, f.title, f.zone, f.load, f.veh, Number(f.stops), Number(f.km), Number(f.hrs), Number(f.kg), "open", "published", pay, Math.round(pay * 0.22), "", f.source]); save(); toast("Route is direct gepubliceerd in de marketplace"); S.view = "market"; render(); };

    const invoiceFormEl = document.getElementById("invoiceForm");
    if (invoiceFormEl) invoiceFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(invoiceFormEl)); const amount = Number(f.amount), expected = Number(f.expected); const state = Math.abs(amount - expected) > 0 ? "mismatch" : "pending"; S.invoices.unshift([`INV-${60 + S.invoices.length}`, f.charter, f.week, amount, Number(f.routes), state, today, expected]); save(); toast("Factuur ingediend"); S.view = "invoiceHistory"; render(); };

    const bidForm = document.getElementById("higherBidForm");
    if (bidForm) bidForm.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(bidForm)); const r = routeById(f.route); const amount = Number(f.amount); if (!amount || amount <= r.systemPrice) { toast("Hoger bod moet boven de huidige portaalprijs liggen"); return; } S.bids.unshift([`BID-${330 + S.bids.length}`, f.route, S.charter, amount, "pending", `${f.reason}: ${f.note || "geen extra notitie"}`, "higher", today]); S.selectedBidRoute = ""; save(); toast("Hoger bod verstuurd naar planning"); render(); };

    const disputeFormEl = document.getElementById("disputeForm");
    if (disputeFormEl) disputeFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(disputeFormEl)); S.disputes.unshift([`DSP-${50 + S.disputes.length}`, f.route, S.charter, f.type, f.prio, "to handle", f.msg, Number(f.correction), "Nog beoordelen"]); save(); toast("Dispute ingediend"); render(); };

    const vehicleFormEl = document.getElementById("vehicleForm");
    if (vehicleFormEl) vehicleFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(vehicleFormEl)); S.vehicles.unshift([`VH-${100 + S.vehicles.length}`, S.charter, f.type, f.plate, Number(f.capacity), "pending", f.tail, f.valid]); save(); toast("Voertuig toegevoegd ter controle"); render(); };

    const driverFormEl = document.getElementById("driverForm");
    if (driverFormEl) driverFormEl.onsubmit = e => { e.preventDefault(); const f = Object.fromEntries(new FormData(driverFormEl)); S.drivers.unshift([`DR-${100 + S.drivers.length}`, S.charter, f.name, f.phone, f.license, "pending", f.city, f.vehicle || "—"]); save(); toast("Chauffeur toegevoegd ter controle"); render(); };

    document.querySelectorAll("[data-action]").forEach(b => b.onclick = () => action(b.dataset.action, b.dataset.id));
    const z = document.getElementById("zf"), v = document.getElementById("vf");
    if (z && v) { const fl = () => document.querySelectorAll(".route-card").forEach(card => { const rz = card.querySelector(".pill.blue")?.textContent || ""; const rv = card.querySelector(".pill.gray")?.textContent || ""; card.style.display = (z.value === "all" || rz.includes(z.value)) && (v.value === "all" || rv.includes(v.value)) ? "" : "none"; }); z.onchange = fl; v.onchange = fl; }
  };

  function action(a, id) {
    if (a === "requestRoute") { const r = routeById(id); S.routeRequests.unshift([`REQ-${250 + S.routeRequests.length}`, id, S.charter, "current", r.systemPrice, "pending", "Aanvraag tegen huidige portaalprijs", today]); save(); toast("Route aanvraag verstuurd naar office/planning"); render(); return; }
    if (a === "prepareBid") { S.selectedBidRoute = id; S.view = "myBids"; save(); render(); return; }
    if (a === "approveRequest") { const req = S.routeRequests.find(x => x[0] === id), rr = req && routeRow(req[1]); if (req && rr) { req[5] = "approved"; rr[9] = "assigned"; rr[13] = req[2]; rr[11] = req[4]; save(); toast("Route aanvraag goedgekeurd en assigned"); render(); } return; }
    if (a === "rejectRequest") { const req = S.routeRequests.find(x => x[0] === id); if (req) { req[5] = "rejected"; save(); toast("Route aanvraag afgewezen"); render(); } return; }
    if (a === "approveBid") { const bid = S.bids.find(x => x[0] === id), rr = bid && routeRow(bid[1]); if (bid && rr) { bid[4] = "approved"; rr[9] = "assigned"; rr[13] = bid[2]; rr[11] = bid[3]; rr[12] = Math.max(0, route(rr).customerRevenue - bid[3]); save(); toast("Hoger bod goedgekeurd en route assigned"); render(); } return; }
    if (a === "rejectBid") { const bid = S.bids.find(x => x[0] === id); if (bid) { bid[4] = "rejected"; save(); toast("Hoger bod afgewezen"); render(); } return; }
    if (a === "approveInvoice") { const inv = S.invoices.find(x => x[0] === id); if (inv) { inv[5] = "approved"; save(); toast("Factuur goedgekeurd"); render(); } return; }
    if (a === "closeDispute") { const d = S.disputes.find(x => x[0] === id); if (d) { d[5] = "closed"; d[8] = `Correctie ${fmt(d[7] || 0)} verwerkt`; save(); toast("Dispute opgelost"); render(); } }
  }

  render();
})();
