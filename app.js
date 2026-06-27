const STORE_KEY = "cargro-charterportaal-first-test";
const VAT = 0.21;

const seed = {
  role: "office",
  view: "dashboard",
  charter: "LuxeLine Transport",
  routes: [
    { id: "MX-2026-0629-001", title: "Zwolle + Beek-Ubbergen", date: "2026-06-29", zone: "Oost", from: "Wijchen", firstStop: "Zwolle", lastStop: "Beek-Ubbergen", load: "06:15", vehicle: "Bakwagen", laadruimte: "420 × 210 × 220 cm", laadklep: "Ja", stops: 17, km: 727, hours: 13.8, kg: 780, equipment: "Steekwagen, spanbanden", expectedEx: 842.00, customerRevenue: 1034.00, status: "assigned", requestStatus: "approved", assignedTo: "LuxeLine Transport", source: "MendriX", invoiceStatus: "te betalen", dispute: "none", notes: "Long mixed route. Customer calls before arrival." },
    { id: "MX-2026-0629-002", title: "Randstad speelgoedroute", date: "2026-06-29", zone: "Randstad", from: "Wijchen", firstStop: "Rotterdam", lastStop: "Den Haag", load: "07:00", vehicle: "L4", laadruimte: "370 × 178 × 190 cm", laadklep: "Nee", stops: 23, km: 318, hours: 8.5, kg: 520, equipment: "Steekwagen", expectedEx: 681.00, customerRevenue: 857.00, status: "open", requestStatus: "published", assignedTo: "", source: "Excel", invoiceStatus: "niet toegewezen", dispute: "none", notes: "Urban route with parking pressure. Efficient driver preferred." },
    { id: "MX-2026-0629-003", title: "Noord zware stops", date: "2026-06-29", zone: "Noord", from: "Wijchen", firstStop: "Assen", lastStop: "Groningen", load: "06:35", vehicle: "Bakwagen laadklep", laadruimte: "430 × 215 × 220 cm", laadklep: "Ja", stops: 14, km: 455, hours: 10.2, kg: 970, equipment: "Laadklep, pompwagen, steekwagen", expectedEx: 746.00, customerRevenue: 884.00, status: "open", requestStatus: "published", assignedTo: "", source: "MendriX", invoiceStatus: "niet toegewezen", dispute: "none", notes: "Heavy route. Must have laadklep or good explanation." },
    { id: "MX-2026-0629-004", title: "Zuid correctieronde", date: "2026-06-29", zone: "Zuid", from: "Wijchen", firstStop: "Eindhoven", lastStop: "Maastricht", load: "07:30", vehicle: "Bakwagen", laadruimte: "420 × 210 × 220 cm", laadklep: "Aanbevolen", stops: 12, km: 226, hours: 6.4, kg: 310, equipment: "Steekwagen", expectedEx: 417.00, customerRevenue: 530.00, status: "pending", requestStatus: "to approve", assignedTo: "Zuid Logistics Partner", source: "Charter request", invoiceStatus: "wacht op approval", dispute: "none", notes: "Charter asked for route. Planning must approve before route moves to assigned." },
    { id: "MX-2026-0629-005", title: "Midden fulfilment pickup", date: "2026-06-29", zone: "Midden", from: "Wijchen", firstStop: "Amersfoort", lastStop: "Hilversum", load: "15:30", vehicle: "Bakwagen", laadruimte: "420 × 210 × 220 cm", laadklep: "Nee", stops: 9, km: 188, hours: 5.7, kg: 790, equipment: "Spanbanden", expectedEx: 389.00, customerRevenue: 485.00, status: "pending", requestStatus: "to approve", assignedTo: "Duiven Express", source: "Manual", invoiceStatus: "wacht op approval", dispute: "none", notes: "Afternoon pickup. Good route for trial charter." }
  ],
  routeRequests: [
    { id: "REQ-001", routeId: "MX-2026-0629-004", charter: "Zuid Logistics Partner", type: "Route aanvragen", requestedEx: 417.00, vehicle: "Bakwagen · V-918-ZL", driver: "Sem", status: "to approve", note: "Zone fit and available after 07:30." },
    { id: "REQ-002", routeId: "MX-2026-0629-005", charter: "Duiven Express", type: "Route aanvragen", requestedEx: 389.00, vehicle: "L3 · V-456-CD", driver: "Ravi", status: "to approve", note: "Trial route, can load in afternoon." }
  ],
  bids: [
    { id: "BID-118", routeId: "MX-2026-0629-002", charter: "Randstad Koeriers", amountEx: 665.00, vehicle: "L4 · V-789-EF", driver: "Ahmed", status: "pending", note: "Vaste chauffeur beschikbaar. Dicht bij routegebied." },
    { id: "BID-119", routeId: "MX-2026-0629-003", charter: "Noord Carrier Network", amountEx: 735.00, vehicle: "Bakwagen laadklep · V-333-GH", driver: "Jeroen", status: "recommended", note: "Laadklep beschikbaar en lokaal in Noord." }
  ],
  invoices: [
    { id: "INV-044", charter: "LuxeLine Transport", week: "2026-W26", routes: 3, expectedEx: 1998.25, invoiceEx: 1998.25, status: "approved", submitted: "2026-06-25", note: "Akkoord volgens route statement." },
    { id: "INV-045", charter: "Randstad Koeriers", week: "2026-W26", routes: 4, expectedEx: 2715.45, invoiceEx: 2740.45, status: "review", submitted: "2026-06-26", note: "€25 verschil, wachttijd checken." }
  ],
  disputes: [
    { id: "DSP-031", routeId: "MX-2026-0629-001", charter: "LuxeLine Transport", reason: "Gewicht afwijking", amountEx: 35.00, status: "to handle", priority: "high", note: "Stop stond als 4 kg maar was veel zwaarder." },
    { id: "DSP-032", routeId: "MX-2026-0629-003", charter: "Noord Carrier Network", reason: "Wachttijd", amountEx: 20.00, status: "open", priority: "medium", note: "Extra wachttijd bij magazijn." }
  ],
  charters: [
    { company: "LuxeLine Transport", contact: "Daya", city: "Nijmegen", status: "active", documents: "complete", rating: 4.8, zones: "Oost, Midden, Zuid", vehicles: 2, weeklyValue: 1998.25 },
    { company: "Duiven Express", contact: "Ravi", city: "Duiven", status: "trial", documents: "NIWO pending", rating: 4.3, zones: "Oost", vehicles: 1, weeklyValue: 462.00 },
    { company: "Randstad Koeriers", contact: "Ahmed", city: "Utrecht", status: "active", documents: "complete", rating: 4.6, zones: "Randstad, Midden, West", vehicles: 1, weeklyValue: 2715.45 },
    { company: "Noord Carrier Network", contact: "Jeroen", city: "Groningen", status: "active", documents: "insurance review", rating: 4.4, zones: "Noord", vehicles: 1, weeklyValue: 695.20 },
    { company: "Zuid Logistics Partner", contact: "Sem", city: "Eindhoven", status: "active", documents: "complete", rating: 4.1, zones: "Zuid, Midden", vehicles: 1, weeklyValue: 0 }
  ],
  vehicles: [
    { id: "VH-001", charter: "LuxeLine Transport", type: "Bakwagen", plate: "V-123-AB", capacityKg: 950, laadruimte: "420 × 210 × 220 cm", laadklep: "Ja", status: "approved" },
    { id: "VH-002", charter: "LuxeLine Transport", type: "L4", plate: "V-222-LL", capacityKg: 750, laadruimte: "370 × 178 × 190 cm", laadklep: "Nee", status: "pending" },
    { id: "VH-003", charter: "Duiven Express", type: "L3", plate: "V-456-CD", capacityKg: 650, laadruimte: "320 × 170 × 185 cm", laadklep: "Nee", status: "approved" },
    { id: "VH-005", charter: "Noord Carrier Network", type: "Bakwagen laadklep", plate: "V-333-GH", capacityKg: 1200, laadruimte: "430 × 215 × 220 cm", laadklep: "Ja", status: "approved" }
  ]
};

let state;
try {
  state = { ...structuredClone(seed), ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
} catch {
  state = structuredClone(seed);
}

const app = document.getElementById("app");
const euro = value => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(value || 0));
const number = value => new Intl.NumberFormat("nl-NL").format(Number(value || 0));
const cls = value => String(value || "").toLowerCase().replaceAll(" ", "-");
const marginOf = route => Number(route.customerRevenue || 0) - Number(route.expectedEx || 0);
const vat = amount => Number(amount || 0) * (1 + VAT);

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function toast(text) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function go(view) { state.view = view; save(); render(); }
function setRole(role) { state.role = role; state.view = "dashboard"; save(); render(); }
function currentCharter() { return state.charter || state.charters[0].company; }

function counts() {
  return {
    approvals: state.routeRequests.filter(x => x.status === "to approve").length,
    bids: state.bids.filter(x => ["pending", "recommended"].includes(x.status)).length,
    invoices: state.invoices.filter(x => ["pending", "review"].includes(x.status)).length,
    disputes: state.disputes.filter(x => ["to handle", "open"].includes(x.status)).length,
    openRoutes: state.routes.filter(x => x.status === "open").length,
    assigned: state.routes.filter(x => x.status === "assigned").length
  };
}

function hero(title, text, actions = "") {
  return `<section class="hero"><div class="kicker" style="margin-bottom:14px">Eerste testversie · geen echte database</div><h1>${title}</h1><p>${text}</p>${actions ? `<div class="hero-actions">${actions}</div>` : ""}</section>`;
}

function table(headers, rows) {
  if (!rows.length) return `<div class="empty">Geen records gevonden.</div>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

function statusPill(status) { return `<span class="status ${cls(status)}">${status}</span>`; }
function pill(text, color = "blue") { return `<span class="pill ${color}">${text}</span>`; }
function button(label, view, color = "primary") { return `<button class="btn ${color}" data-view="${view}">${label}</button>`; }

function nav() {
  const c = counts();
  const office = [
    ["dashboard", "🏠", "Command center"],
    ["upload", "⬆️", "Route upload"],
    ["market", "🛣️", "Route marketplace"],
    ["approval", "✅", "Routes to be approved", c.approvals],
    ["bids", "🤝", "Bid approval", c.bids],
    ["invoices", "🧾", "Invoices / payables", c.invoices],
    ["disputes", "⚠️", "Disputes to handle", c.disputes],
    ["charters", "🚚", "Charters & voertuigen"],
    ["testing", "🧪", "Test checklist"]
  ];
  const charter = [
    ["dashboard", "🏠", "Mijn dashboard"],
    ["market", "🛣️", "Beschikbare routes"],
    ["requests", "📨", "Mijn aanvragen"],
    ["assigned", "📦", "Mijn routes"],
    ["invoices", "🧾", "Factuur indienen"],
    ["disputes", "⚠️", "Dispute aanmaken", c.disputes],
    ["charters", "🚚", "Mijn voertuigen"],
    ["testing", "🧪", "Test checklist"]
  ];
  const items = state.role === "office" ? office : charter;
  return `<aside class="sidebar">
    <div class="brand-card">
      <div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">First testing · routes · bids · invoices</div></div></div>
      <p>Professionele testomgeving voor planning en charters. Data wordt nu lokaal opgeslagen in de browser; later Supabase.</p>
    </div>
    <div class="role-switch"><button data-role="office" class="${state.role === "office" ? "active" : ""}">Office</button><button data-role="charter" class="${state.role === "charter" ? "active" : ""}">Charter</button></div>
    ${state.role === "charter" ? `<div class="field" style="margin-bottom:14px"><label>Test charter</label><select id="charterSelect">${state.charters.map(c => `<option ${c.company === currentCharter() ? "selected" : ""}>${c.company}</option>`).join("")}</select></div>` : ""}
    <div class="nav-group-title">Navigatie</div>
    ${items.map(i => `<button class="nav-btn ${state.view === i[0] ? "active" : ""}" data-view="${i[0]}"><span class="nav-left"><span class="nav-icon">${i[1]}</span>${i[2]}</span>${i[3] ? `<span class="badge-count">${i[3]}</span>` : ""}</button>`).join("")}
    <div class="card soft-blue" style="margin-top:18px;padding:16px"><div class="card-title" style="font-size:15px">Test login</div><p style="margin:0;font-size:13px">Office knop = interne planning. Charter knop = beperkte charter-view.</p></div>
  </aside>`;
}

function routeVisible(route) {
  if (state.role === "office") return true;
  return route.status === "open" || route.assignedTo === currentCharter();
}

function dashboard() {
  const visibleRoutes = state.routes.filter(routeVisible);
  const payout = visibleRoutes.reduce((a, r) => a + Number(r.expectedEx || 0), 0);
  const margin = state.routes.reduce((a, r) => a + marginOf(r), 0);
  const c = counts();
  const title = state.role === "office" ? "Command center voor routecontrole." : "Jouw charter dashboard.";
  const text = state.role === "office" ? "Plaats routes, keur aanvragen en biedingen goed, controleer facturen en behandel disputes zonder losse WhatsApp/Excel chaos." : "Bekijk open routes, jouw toegewezen routes, verwachte betaling, facturen en disputes in één omgeving.";
  return hero(title, text, `${button("Route upload", "upload", "primary")} ${button("Disputes", "disputes", "orange")}`) +
  `<section class="grid four">
    ${metric("Routes", visibleRoutes.length, "zichtbaar", "soft-blue")}
    ${metric("Open marketplace", c.openRoutes, "aanvragen mogelijk", "soft-orange")}
    ${metric(state.role === "office" ? "Payout volume" : "Mijn payout", euro(payout), "excl. btw", "soft-green")}
    ${metric(state.role === "office" ? "Bruto marge" : "Disputes", state.role === "office" ? euro(margin) : c.disputes, state.role === "office" ? "intern" : "open", "")}
  </section>
  <div class="grid two" style="margin-top:18px">
    <div class="card"><div class="card-title">Weekoverzicht</div><div class="chart-bars">${[["Ma",72,""],["Di",88,"orange"],["Wo",62,""],["Do",92,"green"],["Vr",78,""],["Za",44,"orange"]].map(b => `<div class="bar ${b[2]}" style="height:${b[1]}%"><span>${b[1]}</span><small>${b[0]}</small></div>`).join("")}</div></div>
    <div class="card soft-blue"><div class="card-title">Wat moet getest worden?</div>${steps(["Office ziet marge, charter niet", "Route aanvragen komt onder approval", "Hoger aanbod blijft gekoppeld aan route", "Factuurbedrag kan afwijken van verwachte betaling", "Dispute wordt aparte behandelqueue"])}</div>
  </div>
  <div class="section-head"><div><h2>Laatste routes</h2><p>Professionele routekaart met payout excl./incl. btw, voertuigvereisten en status.</p></div></div>${routesTable(visibleRoutes.slice(0, 6))}`;
}

function metric(label, value, trend, klass) {
  return `<div class="card metric ${klass}"><div><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div><span class="metric-trend">${trend}</span></div>`;
}

function steps(items) {
  return `<div class="timeline">${items.map((x, i) => `<div class="step"><div class="step-num">${i + 1}</div><div><strong>${x}</strong><span>Gebruik dit als eerste testscenario met Stan of een charter.</span></div></div>`).join("")}</div>`;
}

function routeCard(route) {
  return `<article class="route-card" data-zone="${route.zone}" data-vehicle="${route.vehicle}">
    <div class="route-top"><div><div class="route-title">${route.title}</div><div class="route-meta">${route.id} · ${route.source} · laden ${route.load} · ${route.from} → ${route.firstStop} → ${route.lastStop}</div></div>${statusPill(route.status)}</div>
    <div class="route-info">${pill(`📍 ${route.zone}`, "blue")}${pill(`🚚 ${route.vehicle}`, "purple")}${pill(`📦 ${route.stops} stops`, "green")}${pill(`⚖️ ${number(route.kg)} kg`, "orange")}${pill(`📐 ${route.laadruimte}`, "gray")}${pill(`Laadklep: ${route.laadklep}`, "dark")}</div>
    <p class="muted">${route.notes}</p>
    <div class="price-strip"><div class="price-cell"><strong>${number(route.km)}</strong><span>KM</span></div><div class="price-cell"><strong>${number(route.hours)}</strong><span>uren</span></div><div class="price-cell"><strong>${euro(route.expectedEx)}</strong><span>verwacht excl. BTW</span></div><div class="price-cell"><strong>${euro(vat(route.expectedEx))}</strong><span>incl. BTW</span></div></div>
    ${state.role === "office" ? `<div class="price-strip"><div class="price-cell"><strong>${euro(route.customerRevenue)}</strong><span>klant omzet</span></div><div class="price-cell"><strong>${euro(marginOf(route))}</strong><span>Cargro marge</span></div><div class="price-cell"><strong>${route.assignedTo || "—"}</strong><span>charter</span></div><div class="price-cell"><strong>${route.invoiceStatus}</strong><span>factuur</span></div></div>` : ""}
    <div class="hero-actions">
      ${state.role === "charter" && route.status === "open" ? `<button class="btn primary small" data-act="requestRoute" data-id="${route.id}">Route aanvragen</button><button class="btn orange small" data-act="higherOffer" data-id="${route.id}">Hoger aanbod doen</button>` : ""}
      ${state.role === "office" && route.requestStatus === "to approve" ? `<button class="btn green small" data-act="approveRoute" data-id="${route.id}">Approve route</button>` : ""}
      <button class="btn dark small" data-act="createDispute" data-id="${route.id}">Dispute</button>
    </div>
  </article>`;
}

function routesTable(routes) {
  return table(["Route", "Zone", "Voertuig", "Stops", "KM", "Payout excl.", "Incl. BTW", "Status", state.role === "office" ? "Marge" : "Charter"], routes.map(r => [
    `<strong>${r.id}</strong><br><span class="muted">${r.title}</span>`, r.zone, r.vehicle, r.stops, r.km, euro(r.expectedEx), euro(vat(r.expectedEx)), statusPill(r.status), state.role === "office" ? euro(marginOf(r)) : (r.assignedTo || "Marketplace")
  ]));
}

function upload() {
  return hero("Route upload voor eerste test.", "Gebruik bulk upload als MendriX/Excel-simulatie of maak één route handmatig. Nieuwe handmatige routes komen eerst in 'Routes to be approved'.", `${button("Simuleer bulk import", "upload", "primary")} ${button("Approvals", "approval", "orange")}`) +
  `<div class="grid two">
    <div class="card soft-blue"><div class="card-title">Bulk upload <span class="pill blue">MendriX / Excel / CSV</span></div><p>Voor de test tonen we alleen de flow. Later wordt dit gekoppeld aan SheetJS + Supabase.</p><input class="input" type="file" accept=".csv,.xlsx,.xls"><button class="btn primary full" style="margin-top:12px" data-act="bulkImport">Demo routes importeren</button></div>
    <form class="card soft-green" id="routeForm"><div class="card-title">Manual single route <span class="pill green">1 by 1</span></div><p>Voor spoedroutes, correcties of losse charter-aanvragen.</p><div class="form-grid">
      <input class="input" name="title" value="Nieuwe route aanvraag"><select name="zone"><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>West</option><option>Randstad</option></select><input class="input" name="load" value="07:00"><select name="vehicle"><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select><input class="input" name="stops" type="number" value="14"><input class="input" name="km" type="number" value="280"><input class="input" name="hours" type="number" step=".1" value="8.2"><input class="input" name="kg" type="number" value="520"><input class="input" name="expectedEx" type="number" value="525"><input class="input" name="customerRevenue" type="number" value="650">
    </div><button class="btn green full" style="margin-top:14px">Route naar approval sturen</button></form>
  </div>`;
}

function market() {
  const routes = state.routes.filter(routeVisible).filter(r => ["open", "assigned", "pending"].includes(r.status));
  return hero("Route marketplace.", "Charters kunnen routes aanvragen of alleen binnen dezelfde route een hoger aanbod doen. Geen losse 'Mijn hogere biedingen' pagina meer.", `${button("Bid approval", "bids", "primary")} ${button("Disputes to handle", "disputes", "orange")}`) +
  `<div class="filters"><select id="zoneFilter"><option value="all">Alle zones</option><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>West</option><option>Randstad</option></select><select id="vehicleFilter"><option value="all">Alle voertuigen</option><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select>${pill("Disputes staan apart, niet als filter", "orange")}</div><div class="grid two" id="routeGrid">${routes.map(routeCard).join("")}</div>`;
}

function approval() {
  const pending = state.routeRequests.filter(x => x.status === "to approve");
  return hero("Routes to be approved.", "Nieuwe charter-aanvragen en handmatige routes komen eerst hier. Planning beslist wie de route krijgt en tegen welke vaste verwachte betaling.", `${button("Route upload", "upload", "primary")}`) +
  `<div class="grid two">${pending.length ? pending.map(req => {
    const route = state.routes.find(r => r.id === req.routeId);
    return `<div class="card soft-orange"><div class="card-title">${req.type} ${statusPill(req.status)}</div><p><strong>${req.charter}</strong> vraagt ${route?.title || req.routeId} aan.</p><div class="price-strip"><div class="price-cell"><strong>${euro(req.requestedEx)}</strong><span>aangevraagd excl.</span></div><div class="price-cell"><strong>${euro(vat(req.requestedEx))}</strong><span>incl. BTW</span></div><div class="price-cell"><strong>${req.vehicle}</strong><span>voertuig</span></div><div class="price-cell"><strong>${req.driver}</strong><span>chauffeur</span></div></div><p class="muted">${req.note}</p><div class="hero-actions"><button class="btn green" data-act="approveRequest" data-id="${req.id}">Goedkeuren</button><button class="btn red" data-act="rejectRequest" data-id="${req.id}">Afwijzen</button></div></div>`;
  }).join("") : `<div class="empty">Geen route-aanvragen om goed te keuren.</div>`}</div>`;
}

function requests() {
  const mine = state.routeRequests.filter(x => x.charter === currentCharter());
  return hero("Mijn aanvragen.", "Hier staan jouw route-aanvragen en hogere aanbiedingen. Ze blijven gekoppeld aan de route waar je op reageerde.") + table(["Aanvraag", "Route", "Type", "Voertuig", "Bedrag excl.", "Status", "Notitie"], mine.map(r => [r.id, r.routeId, r.type, r.vehicle, euro(r.requestedEx), statusPill(r.status), r.note]));
}

function assigned() {
  const mine = state.routes.filter(r => r.assignedTo === currentCharter());
  return hero("Mijn routes.", "Alleen toegewezen routes staan hier. De verwachte betaling is vast en niet bewerkbaar voor de charter.") + `<div class="grid two">${mine.length ? mine.map(routeCard).join("") : `<div class="empty">Nog geen toegewezen routes.</div>`}</div>`;
}

function bids() {
  return hero("Bid approval.", "Hogere aanbiedingen worden alleen binnen de route goedgekeurd of afgewezen. Planning ziet prijs, voertuig, chauffeur en motivatie.") + table(["Bid", "Route", "Charter", "Bedrag excl.", "Voertuig", "Status", "Actie"], state.bids.map(b => [b.id, b.routeId, b.charter, euro(b.amountEx), b.vehicle, statusPill(b.status), `<button class="btn green small" data-act="approveBid" data-id="${b.id}">Approve</button>`]));
}

function invoices() {
  const roleCharter = state.role === "charter";
  const rows = state.invoices.filter(x => !roleCharter || x.charter === currentCharter());
  const assignedRoutes = state.routes.filter(r => r.assignedTo === currentCharter());
  const expected = assignedRoutes.reduce((a, r) => a + r.expectedEx, 0);
  const form = roleCharter ? `<form class="card soft-green" id="invoiceForm" style="margin-bottom:18px"><div class="card-title">Factuur indienen</div><p>Verwachte betaling is vast per route. Charter mag eigen factuurbedrag invullen; office controleert verschil.</p><div class="form-grid"><input class="input" name="invoice" value="INV-${currentCharter().slice(0,3).toUpperCase()}-20260629"><input class="input" name="amount" type="number" value="${expected.toFixed(2)}"><input class="input" disabled value="Verwacht excl. BTW: ${euro(expected)}"><input class="input" disabled value="Verwacht incl. BTW: ${euro(vat(expected))}"></div><textarea name="note" style="margin-top:12px">Factuur ingediend voor toegewezen routes.</textarea><button class="btn green full" style="margin-top:12px">Factuur versturen</button></form>` : "";
  return hero(roleCharter ? "Mijn facturen." : "Invoices / payables.", roleCharter ? "Dien je factuur in en vergelijk met de vaste verwachte betaling." : "Controleer verwachte betaling versus factuurbedrag, excl. en incl. btw.") + form + table(["Factuur", "Charter", "Week", "Routes", "Verwacht excl.", "Factuur excl.", "Verschil", "Status"], rows.map(inv => [inv.id, inv.charter, inv.week, inv.routes, euro(inv.expectedEx), euro(inv.invoiceEx), euro(inv.invoiceEx - inv.expectedEx), statusPill(inv.status)]));
}

function disputes() {
  const rows = state.disputes.filter(x => state.role === "office" || x.charter === currentCharter());
  const routeOptions = state.routes.filter(r => state.role === "office" || r.assignedTo === currentCharter());
  const form = `<form class="card soft-orange" id="disputeForm" style="margin-bottom:18px"><div class="card-title">Nieuwe dispute aanmaken</div><p>Dispute is een behandelqueue, geen filter in marketplace.</p><div class="form-grid"><select name="routeId">${routeOptions.map(r => `<option>${r.id}</option>`).join("")}</select><input class="input" name="reason" value="Wachttijd / gewicht / schade"><input class="input" name="amount" type="number" value="0"><select name="priority"><option>medium</option><option>high</option><option>low</option></select></div><textarea name="note" style="margin-top:12px">Leg kort uit wat er gecorrigeerd moet worden.</textarea><button class="btn orange full" style="margin-top:12px">Dispute versturen</button></form>`;
  return hero("Disputes to handle.", "Alle route- en factuurdisputes worden hier behandeld, zodat de marketplace schoon blijft.") + form + table(["Dispute", "Route", "Charter", "Reden", "Bedrag", "Prioriteit", "Status", "Notitie"], rows.map(d => [d.id, d.routeId, d.charter, d.reason, euro(d.amountEx), d.priority, statusPill(d.status), d.note]));
}

function charters() {
  if (state.role === "charter") {
    const vehicles = state.vehicles.filter(v => v.charter === currentCharter());
    return hero("Mijn voertuigen.", "Voertuigmaten zijn belangrijk voor route-matching: beladingsruimte, laadvermogen en laadklep.") + table(["Voertuig", "Type", "Kenteken", "Laadvermogen", "Beladingsruimte", "Laadklep", "Status"], vehicles.map(v => [v.id, v.type, v.plate, `${number(v.capacityKg)} kg`, v.laadruimte, v.laadklep, statusPill(v.status)]));
  }
  return hero("Charters & voertuigen.", "Office ziet documenten, status, rating, zones en voertuigcapaciteit. Dit is de basis voor route approval.") + `<div class="section-head"><div><h2>Charters</h2></div></div>` + table(["Charter", "Contact", "Plaats", "Status", "Documenten", "Rating", "Zones", "Weekwaarde"], state.charters.map(c => [c.company, c.contact, c.city, statusPill(c.status), c.documents, c.rating, c.zones, euro(c.weeklyValue)])) + `<div class="section-head"><div><h2>Voertuigen</h2></div></div>` + table(["Voertuig", "Charter", "Type", "Kenteken", "Laadvermogen", "Beladingsruimte", "Laadklep", "Status"], state.vehicles.map(v => [v.id, v.charter, v.type, v.plate, `${number(v.capacityKg)} kg`, v.laadruimte, v.laadklep, statusPill(v.status)]));
}

function testing() {
  return hero("Eerste test checklist.", "Gebruik deze versie om met Stan of één charter te testen of de portal-logica klopt vóór Supabase en echte login worden gebouwd.") +
  `<div class="grid two"><div class="card soft-green"><div class="card-title">Wat werkt nu</div>${steps(["Office/charter view switch", "Marketplace met vaste routeprijs", "Route aanvragen en hoger aanbod", "Approval queue", "Factuurbedrag versus verwachte betaling", "Dispute queue", "Voertuigmaten en beladingsruimte"] )}</div><div class="card soft-orange"><div class="card-title">Nog niet productie-klaar</div>${steps(["Geen echte database, alleen browser localStorage", "Geen echte Supabase login", "Geen file upload opslag", "Geen MendriX API-sync", "Geen automatische e-mails/notificaties"] )}<button class="btn red full" data-act="resetDemo" style="margin-top:14px">Reset testdata</button></div></div>`;
}

function renderMain() {
  const views = { dashboard, upload, market, approval, requests, assigned, bids, invoices, disputes, charters, testing };
  return (views[state.view] || dashboard)();
}

function render() {
  app.innerHTML = `<div class="app-shell">${nav()}<main class="main"><div class="topbar"><div class="kicker">${state.role === "office" ? "🔒 Office view" : "🌟 Charter view"}</div><div class="demo-note">Eerste testversie · lokaal opgeslagen · later Supabase</div></div>${renderMain()}</main></div>`;
  bind();
}

function bind() {
  document.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", () => go(el.dataset.view)));
  document.querySelectorAll("[data-role]").forEach(el => el.addEventListener("click", () => setRole(el.dataset.role)));
  const charterSelect = document.getElementById("charterSelect");
  if (charterSelect) charterSelect.addEventListener("change", e => { state.charter = e.target.value; save(); render(); });

  const zoneFilter = document.getElementById("zoneFilter");
  const vehicleFilter = document.getElementById("vehicleFilter");
  if (zoneFilter && vehicleFilter) {
    const apply = () => {
      document.querySelectorAll(".route-card").forEach(card => {
        const z = zoneFilter.value === "all" || card.dataset.zone === zoneFilter.value;
        const v = vehicleFilter.value === "all" || card.dataset.vehicle === vehicleFilter.value;
        card.style.display = z && v ? "block" : "none";
      });
    };
    zoneFilter.addEventListener("change", apply);
    vehicleFilter.addEventListener("change", apply);
  }

  document.querySelectorAll("[data-act]").forEach(el => el.addEventListener("click", e => handleAction(e, el.dataset.act, el.dataset.id)));

  const routeForm = document.getElementById("routeForm");
  if (routeForm) routeForm.addEventListener("submit", event => {
    event.preventDefault();
    const f = new FormData(routeForm);
    const id = `MX-2026-TEST-${String(state.routes.length + 1).padStart(3, "0")}`;
    state.routes.push({ id, title: f.get("title"), date: "2026-06-29", zone: f.get("zone"), from: "Wijchen", firstStop: "Demo eerste stop", lastStop: "Demo laatste stop", load: f.get("load"), vehicle: f.get("vehicle"), laadruimte: f.get("vehicle")?.includes("Bakwagen") ? "420 × 210 × 220 cm" : "370 × 178 × 190 cm", laadklep: f.get("vehicle")?.includes("laadklep") ? "Ja" : "Nee", stops: Number(f.get("stops")), km: Number(f.get("km")), hours: Number(f.get("hours")), kg: Number(f.get("kg")), equipment: "Steekwagen", expectedEx: Number(f.get("expectedEx")), customerRevenue: Number(f.get("customerRevenue")), status: "pending", requestStatus: "to approve", assignedTo: state.role === "charter" ? currentCharter() : "", source: state.role === "charter" ? "Charter request" : "Manual", invoiceStatus: "wacht op approval", dispute: "none", notes: "Handmatig toegevoegd voor test." });
    state.routeRequests.push({ id: `REQ-${String(state.routeRequests.length + 1).padStart(3, "0")}`, routeId: id, charter: state.role === "charter" ? currentCharter() : "Planning", type: "Manual route", requestedEx: Number(f.get("expectedEx")), vehicle: f.get("vehicle"), driver: "Nog te kiezen", status: "to approve", note: "Aangemaakt via testformulier." });
    save(); toast("Route toegevoegd aan approval queue."); go("approval");
  });

  const invoiceForm = document.getElementById("invoiceForm");
  if (invoiceForm) invoiceForm.addEventListener("submit", event => {
    event.preventDefault();
    const f = new FormData(invoiceForm);
    const assigned = state.routes.filter(r => r.assignedTo === currentCharter());
    const expected = assigned.reduce((a, r) => a + r.expectedEx, 0);
    state.invoices.push({ id: String(f.get("invoice")), charter: currentCharter(), week: "2026-W26", routes: assigned.length, expectedEx: expected, invoiceEx: Number(f.get("amount")), status: Number(f.get("amount")) === expected ? "pending" : "review", submitted: "2026-06-29", note: f.get("note") });
    save(); toast("Factuur verstuurd naar office review."); render();
  });

  const disputeForm = document.getElementById("disputeForm");
  if (disputeForm) disputeForm.addEventListener("submit", event => {
    event.preventDefault();
    const f = new FormData(disputeForm);
    state.disputes.push({ id: `DSP-${String(state.disputes.length + 1).padStart(3, "0")}`, routeId: f.get("routeId"), charter: state.role === "charter" ? currentCharter() : "Office", reason: f.get("reason"), amountEx: Number(f.get("amount")), status: "to handle", priority: f.get("priority"), note: f.get("note") });
    save(); toast("Dispute aangemaakt."); render();
  });
}

function handleAction(event, action, id) {
  event.preventDefault();
  if (action === "resetDemo") { localStorage.removeItem(STORE_KEY); state = structuredClone(seed); toast("Testdata gereset."); render(); return; }
  if (action === "bulkImport") {
    const id = `MX-2026-BULK-${String(state.routes.length + 1).padStart(3, "0")}`;
    state.routes.push({ ...structuredClone(seed.routes[1]), id, title: "Bulk import testroute", status: "open", requestStatus: "published", assignedTo: "", source: "Excel import" });
    save(); toast("Bulk import gesimuleerd: 1 route toegevoegd."); go("market"); return;
  }
  if (action === "requestRoute" || action === "higherOffer") {
    const route = state.routes.find(r => r.id === id);
    const amount = action === "higherOffer" ? route.expectedEx + 25 : route.expectedEx;
    state.routeRequests.push({ id: `REQ-${String(state.routeRequests.length + 1).padStart(3, "0")}`, routeId: id, charter: currentCharter(), type: action === "higherOffer" ? "Hoger aanbod" : "Route aanvragen", requestedEx: amount, vehicle: route.vehicle, driver: "Test chauffeur", status: "to approve", note: action === "higherOffer" ? "Hoger aanbod binnen route marketplace." : "Route aangevraagd via charter portal." });
    save(); toast("Aanvraag naar planning gestuurd."); go("requests"); return;
  }
  if (action === "approveRequest") {
    const req = state.routeRequests.find(r => r.id === id);
    if (!req) return;
    req.status = "approved";
    const route = state.routes.find(r => r.id === req.routeId);
    if (route) { route.status = "assigned"; route.requestStatus = "approved"; route.assignedTo = req.charter; route.expectedEx = req.requestedEx; route.invoiceStatus = "te betalen"; }
    save(); toast("Route-aanvraag goedgekeurd en toegewezen."); render(); return;
  }
  if (action === "rejectRequest") {
    const req = state.routeRequests.find(r => r.id === id); if (req) req.status = "rejected";
    save(); toast("Aanvraag afgewezen."); render(); return;
  }
  if (action === "approveRoute") {
    const route = state.routes.find(r => r.id === id); if (route) { route.status = "assigned"; route.requestStatus = "approved"; route.assignedTo = route.assignedTo || "Planning assigned"; route.invoiceStatus = "te betalen"; }
    save(); toast("Route goedgekeurd."); render(); return;
  }
  if (action === "approveBid") {
    const bid = state.bids.find(b => b.id === id); if (!bid) return;
    bid.status = "approved";
    const route = state.routes.find(r => r.id === bid.routeId); if (route) { route.status = "assigned"; route.assignedTo = bid.charter; route.expectedEx = bid.amountEx; route.requestStatus = "approved"; }
    save(); toast("Bid goedgekeurd en route toegewezen."); render(); return;
  }
  if (action === "createDispute") {
    state.view = "disputes"; save(); render(); toast("Kies route en verstuur dispute."); return;
  }
}

render();
