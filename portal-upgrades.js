(function () {
  if (typeof S === "undefined") return;

  if (!S._v2) {
    S.loggedIn = false;
    if (S.bids?.[0]) S.bids[0][6] = "current";
    if (S.bids?.[1]) { S.bids[1][3] = 795; S.bids[1][5] = "Hoger bod vanwege laadklep + zware stops"; S.bids[1][6] = "higher"; }
    if (S.bids?.[2]) S.bids[2][6] = "higher";
    if (S.invoices?.[1]) { S.invoices[1][7] = 2715; S.invoices[1][3] = 2795; S.invoices[1][5] = "mismatch"; }
    S.disputes = (S.disputes || []).map((d, i) => [...d, d[7] || (i === 0 ? 35 : 22), d[8] || "Nog beoordelen"]);
    S._v2 = true;
    save();
  }

  const fmt = v => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v || 0);
  const nr = v => new Intl.NumberFormat("nl-NL").format(v || 0);
  const esc = v => String(v ?? "").replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m]));
  const stat = x => `<span class="status ${st(x)}">${x}</span>`;
  const pl = (x, c = "blue") => `<span class="pill ${c}">${x}</span>`;
  const route = row => {
    const r = R(row);
    r.systemPrice = r.pay;
    r.customerRevenue = r.pay + r.margin;
    r.heavyStops = r.kg > 900 ? 5 : r.kg > 700 ? 2 : r.kg > 500 ? 1 : 0;
    r.urgency = r.load < "07:00" ? "Vroeg" : r.load >= "15:00" ? "Namiddag" : "Normaal";
    r.equipment = r.veh.includes("laadklep") ? "Laadklep, pompwagen, spanbanden" : r.veh === "Bakwagen" ? "Steekwagen, spanbanden" : "Steekwagen";
    r.perHour = r.hrs ? r.pay / r.hrs : 0;
    r.perKm = r.km ? r.pay / r.km : 0;
    return r;
  };
  const rows = () => S.routes.map(route);
  const routeRow = id => S.routes.find(r => r[0] === id);
  const count = () => ({
    ap: S.routes.filter(r => r[10] === "to approve").length,
    bid: S.bids.filter(b => ["pending", "review"].includes(b[4])).length,
    inv: S.invoices.filter(i => ["pending", "review", "mismatch"].includes(i[5])).length,
    dis: S.disputes.filter(d => ["to handle", "open"].includes(d[5])).length,
    open: S.routes.filter(r => r[9] === "open").length,
    assigned: S.routes.filter(r => r[9] === "assigned").length
  });
  const canSee = r => S.role === "office" || !r.charter || r.charter === S.charter || r.status === "open";

  function loginScreen() {
    return `<main class="login-screen"><section class="login-panel">
      <div class="brand-card login-brand"><div><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">Routes · Biedingen · Facturen · Disputes</div></div></div><p>Een professioneel portaal voor route-uitgifte, charter aanvragen, approval, factuurcontrole en dispute-afhandeling.</p></div><div>${pl("MendriX blijft backbone", "blue")} ${pl("Supabase later", "orange")}</div></div>
      <div class="login-card"><div class="kicker">Demo toegang</div><h1>Kies je omgeving</h1><p>Voor presentatie ziet dit eruit als login. Later vervangen door Supabase Auth met echte rollen.</p><div class="login-options"><button class="login-option" data-login="office"><strong>Cargro Office</strong><span>Planning, approvals, marge en payables</span></button><button class="login-option" data-login="charter"><strong>Charter Login</strong><span>Routes aanvragen, huidige prijs accepteren, hoger bieden, facturen en disputes</span></button></div><div class="field"><label>Demo charter</label><select id="loginCharter">${S.charters.map(c => `<option ${c[0] === S.charter ? "selected" : ""}>${c[0]}</option>`).join("")}</select></div></div>
    </section></main>`;
  }

  nav = function () {
    const x = count();
    const items = S.role === "office"
      ? [["dashboard", "🏠", "Dashboard"], ["operations", "📌", "Operations board", "ap"], ["upload", "⬆️", "Routes uploaden"], ["market", "🛣️", "Beschikbare routes", "open"], ["approval", "✅", "Routes ter goedkeuring", "ap"], ["bids", "🤝", "Bod goedkeuring", "bid"], ["invoices", "🧾", "Facturen & payables", "inv"], ["disputes", "⚠️", "Disputes afhandelen", "dis"], ["charters", "🚚", "Charters / voertuigen"], ["margin", "📊", "Marge & allocatie"]]
      : [["dashboard", "🏠", "Mijn dashboard"], ["operations", "📌", "Mijn route flow"], ["market", "🛣️", "Beschikbare routes", "open"], ["upload", "➕", "Route aanvragen"], ["invoices", "🧾", "Factuur indienen", "inv"], ["disputes", "⚠️", "Dispute aanmaken", "dis"], ["charters", "🚚", "Mijn voertuigen"]];
    return `<aside class="sidebar"><div class="brand-card"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">Professionele demo</div></div></div><p>MendriX blijft de backbone. Dit portaal maakt samenwerking met charters strak en controleerbaar.</p></div><button class="btn ghost full" style="margin-top:14px" data-logout>Andere login</button>${S.role === "charter" ? `<div class="field" style="margin:14px 0"><label>Demo charter</label><select id="charter">${S.charters.map(q => `<option ${q[0] === S.charter ? "selected" : ""}>${q[0]}</option>`).join("")}</select></div>` : ""}<div class="nav-group-title">Navigatie</div>${items.map(i => `<button class="nav-btn ${S.view === i[0] ? "active" : ""}" data-view="${i[0]}"><span class="nav-left"><span class="nav-icon">${i[1]}</span>${i[2]}</span>${i[3] && x[i[3]] ? `<span class="badge-count">${x[i[3]]}</span>` : ""}</button>`).join("")}<div class="card soft-blue" style="margin-top:18px;padding:16px"><div class="card-title" style="font-size:15px">Real version</div><p style="margin:0;font-size:13px">Volgende stap: Supabase login, database, storage en row-level security per charter.</p></div></aside>`;
  };

  function boardItem(type, item) {
    if (type === "invoice") { const expected = item[7] || item[3], diff = item[3] - expected; return `<div class="board-item"><strong>${item[0]}</strong><span>${item[1]}</span><em>${fmt(item[3])} · verschil ${fmt(diff)}</em></div>`; }
    if (type === "dispute") return `<div class="board-item"><strong>${item[0]}</strong><span>${item[3]}</span><em>${item[1]} · correctie ${fmt(item[7] || 0)}</em></div>`;
    if (type === "bid") { const rr = route(routeRow(item[1])); return `<div class="board-item"><strong>${item[1]} · ${item[2]}</strong><span>${item[6] === "higher" ? "Hoger bod" : "Huidige prijs"}</span><em>${fmt(item[3])} ${item[3] > rr.pay ? `(+${fmt(item[3] - rr.pay)})` : ""}</em></div>`; }
    const r = route(item); return `<div class="board-item"><strong>${r.id}</strong><span>${r.title}</span><em>${r.zone} · ${fmt(r.pay)}</em></div>`;
  }

  function operationsBoard() {
    const lanes = [
      ["To be approved", "Nieuwe routes / aanvragen", S.routes.filter(r => r[10] === "to approve"), "route"],
      ["Open routes", "Beschikbaar voor charters", S.routes.filter(r => r[9] === "open"), "route"],
      ["Bids received", "Huidige prijs of hoger bod", S.bids.filter(b => ["pending", "review"].includes(b[4])), "bid"],
      ["Assigned", "Uitbesteed / gepland", S.routes.filter(r => r[9] === "assigned"), "route"],
      ["Invoice check", "Mismatch of review", S.invoices.filter(i => ["pending", "review", "mismatch"].includes(i[5])), "invoice"],
      ["Disputes", "Af te handelen", S.disputes.filter(d => ["to handle", "open"].includes(d[5])), "dispute"]
    ];
    return `<div class="operation-board">${lanes.map(l => `<div class="lane"><div class="lane-head"><strong>${l[0]}</strong><span>${l[2].length}</span></div><p>${l[1]}</p><div class="lane-items">${l[2].map(i => boardItem(l[3], i)).join("") || `<div class="lane-empty">Geen items</div>`}</div></div>`).join("")}</div>`;
  }

  operations = function () { return `${h("Operations board.", "De hele charterflow in één bord: goedkeuren, open routes, biedingen, facturen en disputes.", `<button class="btn primary" data-view="upload">Nieuwe route</button><button class="btn orange" data-view="bids">Biedingen</button>`)}${operationsBoard()}`; };

  dash = function () {
    const rs = S.role === "office" ? rows() : rows().filter(r => r.charter === S.charter);
    const total = rs.reduce((a, r) => a + r.pay, 0), margin = rows().reduce((a, r) => a + r.margin, 0), x = count();
    return `${h(S.role === "office" ? "Cargro control tower voor charter routes." : "Jouw charter omgeving.", S.role === "office" ? "Van route upload tot approval, bod, factuurcontrole en dispute-afhandeling in één flow." : "Vraag routes aan, accepteer de huidige portaalprijs of doe een hoger bod, en houd facturen/disputes bij.", `<button class="btn primary" data-view="operations">Operations board</button><button class="btn orange" data-view="market">Beschikbare routes</button>`)}<section class="grid four"><div class="card metric soft-blue"><div><div class="metric-label">Routes</div><div class="metric-value">${rs.length}</div></div><span class="metric-trend">week 26</span></div><div class="card metric soft-orange"><div><div class="metric-label">Open routes</div><div class="metric-value">${x.open}</div></div><span class="metric-trend warn">biedingen mogelijk</span></div><div class="card metric soft-green"><div><div class="metric-label">Payout volume</div><div class="metric-value">${fmt(total)}</div></div><span class="metric-trend">demo</span></div><div class="card metric"><div><div class="metric-label">${S.role === "office" ? "Interne marge" : "Open disputes"}</div><div class="metric-value">${S.role === "office" ? fmt(margin) : x.dis}</div></div><span class="metric-trend ${S.role === "office" ? "" : "warn"}">${S.role === "office" ? "office only" : "actie nodig"}</span></div></section><div class="grid two" style="margin-top:18px"><div class="card"><div class="card-title">Route lifecycle</div>${["Route geïmporteerd", "Route ter goedkeuring", "Gepubliceerd", "Bod ontvangen", "Bod goedgekeurd", "Assigned", "Factuurcontrole", "Betaald / dispute"].map((s, i) => `<div class="step"><div class="step-num">${i + 1}</div><div><strong>${s}</strong><span>Stap ${i + 1} in de Cargro charterflow.</span></div></div>`).join("")}</div><div class="card soft-blue"><div class="card-title">Aandacht vandaag</div>${[[`${x.ap} routes ter goedkeuring`, "Nieuwe aanvragen moeten door Cargro worden gecontroleerd."], [`${x.bid} biedingen wachten`, "Charter kan huidige prijs aanvragen of hoger bieden."], [`${x.inv} facturen in controle`, "Mismatch wordt zichtbaar."], [`${x.dis} disputes afhandelen`, "Met categorie en correctiebedrag."]].map((it, i) => `<div class="step"><div class="step-num">${i + 1}</div><div><strong>${it[0]}</strong><span>${it[1]}</span></div></div>`).join("")}</div></div><div class="section-head"><div><h2>Operations board</h2><p>De complete flow in één beeld.</p></div></div>${operationsBoard()}`;
  };

  function routeCard2(r) {
    const canBid = S.role === "charter" && r.status === "open";
    return `<article class="route-card" data-zone="${r.zone}" data-vehicle="${r.veh}"><div class="route-top"><div><div class="route-title">${r.title}</div><div class="route-meta">${r.id} · ${r.source} · laden ${r.load}</div></div>${stat(r.status)}</div><div class="route-info">${pl(`📍 ${r.zone}`, "blue")}${pl(`🚚 ${r.veh}`, "purple")}${pl(`📦 ${r.stops} stops`, "green")}${pl(`⚖️ ${nr(r.kg)} kg`, "orange")}${r.heavyStops ? pl(`🏋️ ${r.heavyStops} zware stops`, "red") : pl("licht", "gray")}${pl(`⏱️ ${r.urgency}`, r.urgency === "Urgent" ? "red" : "gray")}</div><div class="price-strip"><div class="price-cell"><strong>${fmt(r.pay)}</strong><span>Huidige portaalprijs</span></div><div class="price-cell"><strong>${fmt(r.perHour)}</strong><span>Verdienste / uur</span></div><div class="price-cell"><strong>${fmt(r.perKm)}</strong><span>Verdienste / km</span></div><div class="price-cell"><strong>${S.role === "office" ? fmt(r.margin) : "Verborgen"}</strong><span>${S.role === "office" ? "Interne marge" : "Cargro intern"}</span></div></div><p class="muted"><strong>Benodigd:</strong> ${r.equipment}.</p>${canBid ? `<div class="bid-options"><div><strong>Charter keuze</strong><span>Vraag aan tegen huidige prijs of doe een hoger bod.</span></div><div class="bid-actions"><button class="btn green small" data-act="requestCurrent" data-id="${r.id}">Aanvragen voor ${fmt(r.pay)}</button><button class="btn orange small" data-act="higherBid" data-id="${r.id}">Hoger bod</button></div></div>` : ""}${S.role === "office" && r.approval === "to approve" ? `<div class="hero-actions"><button class="btn green small" data-act="approveRoute" data-id="${r.id}">Goedkeuren</button><button class="btn red small" data-act="rejectRoute" data-id="${r.id}">Afwijzen</button></div>` : ""}</article>`;
  }

  market = function () { const rs = rows().filter(canSee).filter(r => ["open", "assigned", "pending"].includes(r.status)); return `${h("Beschikbare routes.", "Charters kunnen een route aanvragen tegen de huidige portaalprijs of een hoger bod indienen als de route zwaarder/complexer is.", `<button class="btn primary" data-view="bids">Bod goedkeuring</button><button class="btn orange" data-view="disputes">Disputes afhandelen</button>`)}<div class="filters"><select id="zf"><option value="all">Alle zones</option><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>West</option><option>Randstad</option></select><select id="vf"><option value="all">Alle voertuigen</option><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select>${pl("Disputes staan als eigen werkbak", "orange")}</div><div class="grid two">${rs.map(routeCard2).join("") || `<div class="empty">Geen routes beschikbaar.</div>`}</div>`; };

  approval = function () { const p = rows().filter(r => r.approval === "to approve"); return `${h("Routes ter goedkeuring.", "Nieuwe charter-aanvragen en handmatige routes komen hier binnen. Cargro controleert prijs, timing en toewijzing eerst.", `<button class="btn primary" data-view="upload">Nieuwe route</button>`)}<div class="grid two">${p.map(r => `<div class="card soft-orange"><div class="card-title">${r.title}${stat("to approve")}</div><p>${r.id} · ${r.zone} · ${r.veh} · ${r.stops} stops · aangevraagd door ${r.charter || "Cargro Office"}</p><div class="price-strip"><div class="price-cell"><strong>${fmt(r.pay)}</strong><span>Cargro berekend</span></div><div class="price-cell"><strong>${fmt(r.perHour)}</strong><span>€/uur</span></div><div class="price-cell"><strong>${fmt(r.margin)}</strong><span>Interne marge</span></div><div class="price-cell"><strong>${r.heavyStops >= 4 || r.kg > 900 ? "Hoog" : r.heavyStops >= 2 ? "Middel" : "Laag"}</strong><span>Risico</span></div></div><div class="field" style="margin-top:12px"><label>Interne notitie</label><input class="input" value="Controleer capaciteit, laadtijd en zone-fit."></div><div class="hero-actions"><button class="btn green" data-act="approveRoute" data-id="${r.id}">Goedkeuren</button><button class="btn red" data-act="rejectRoute" data-id="${r.id}">Afwijzen</button></div></div>`).join("") || `<div class="empty">Geen routes wachten op goedkeuring.</div>`}</div>`; };

  bids = function () { return `${h("Bod goedkeuring.", "Charters kunnen kiezen: huidige portaalprijs aanvragen of hoger bieden. Cargro beslist op prijs, kwaliteit, marge en zone-fit.")}${T(["Bid", "Route", "Charter", "Type", "Bedrag", "Verschil", "Status", "Notitie", "Actie"], S.bids.map(b => { const rr = route(routeRow(b[1])); const diff = b[3] - rr.pay; return [b[0], b[1], b[2], b[6] === "higher" ? pl("Hoger bod", "orange") : pl("Huidige prijs", "green"), fmt(b[3]), diff > 0 ? fmt(diff) : "—", stat(b[4]), b[5], `<button class="btn green small" data-act="approveBid" data-id="${b[0]}">Goedkeuren</button> <button class="btn red small" data-act="rejectBid" data-id="${b[0]}">Afwijzen</button>`]; }))}`; };

  invoices = function () { const list = S.role === "charter" ? S.invoices.filter(i => i[1] === S.charter) : S.invoices; return `${h(S.role === "office" ? "Facturen & payables." : "Factuur indienen.", "Het systeem vergelijkt de ingediende factuur met het verwachte routebedrag. Verschillen worden direct zichtbaar.")}<div class="grid two"><form class="card soft-green" id="invoiceForm"><div class="card-title">Factuur indienen</div><div class="form-grid"><input class="input" name="charter" value="${esc(S.charter)}"><input class="input" name="week" value="Week 26"><input class="input" name="expected" type="number" value="750"><input class="input" name="amount" type="number" value="750"><input class="input" name="routes" type="number" value="2"><input class="input" type="file" accept=".pdf,.xlsx,.csv"></div><button class="btn green full" style="margin-top:14px">Factuur indienen</button></form><div class="card dark"><div class="card-title">Matching logic</div><p>Als factuurbedrag hoger/lager is dan expected payout, komt de factuur automatisch in mismatch review.</p></div></div><div class="section-head"><div><h2>Factuurhistorie</h2></div></div>${T(["Factuur", "Charter", "Week", "Expected", "Submitted", "Verschil", "Routes", "Status", "Actie"], list.map(i => { const expected = i[7] || i[3], diff = i[3] - expected; return [i[0], i[1], i[2], fmt(expected), fmt(i[3]), diff ? `<strong class="${diff > 0 ? "bad" : "warn"}">${fmt(diff)}</strong>` : `<span class="good">Match</span>`, i[4], stat(i[5]), S.role === "office" ? `<button class="btn green small" data-act="approveInv" data-id="${i[0]}">Goedkeuren</button>` : `<button class="btn ghost small" data-view="disputes">Dispute</button>`]; }))}`; };

  disputes = function () { const list = S.role === "charter" ? S.disputes.filter(d => d[2] === S.charter) : S.disputes; return `${h("Disputes afhandelen.", "Disputes hebben categorie, correctiebedrag en een Cargro beslissing. Dit is een echte werkbak, geen filter.")}<div class="grid two"><form class="card soft-orange" id="disputeForm"><div class="card-title">Dispute aanmaken</div><div class="form-grid"><select name="route">${rows().filter(canSee).map(r => `<option>${r.id}</option>`).join("")}</select><select name="type"><option>Gewicht incorrect</option><option>Wachttijd</option><option>Klant niet thuis</option><option>Route te vol</option><option>Extra kilometers</option><option>Schade / missend item</option><option>Betalingscorrectie</option></select><select name="prio"><option>medium</option><option>high</option><option>low</option></select><input class="input" name="correction" type="number" value="25"></div><textarea style="margin-top:12px" name="msg">Leg kort uit wat er niet klopt.</textarea><button class="btn orange full" style="margin-top:14px">Dispute aanmaken</button></form><div class="card soft-blue"><div class="card-title">Afhandeling</div>${["Categorie kiezen", "Correctiebedrag toevoegen", "Cargro beslissing", "Koppelen aan factuur"].map((x, i) => `<div class="step"><div class="step-num">${i + 1}</div><div><strong>${x}</strong><span>Strakker dan losse WhatsApp-discussies.</span></div></div>`).join("")}</div></div><div class="section-head"><div><h2>Dispute werkbak</h2></div></div>${T(["Dispute", "Route", "Charter", "Categorie", "Prioriteit", "Correctie", "Status", "Beslissing", "Actie"], list.map(d => [d[0], d[1], d[2], d[3], pl(d[4], d[4] === "high" ? "red" : "orange"), fmt(d[7] || 0), stat(d[5]), d[8] || "Nog beoordelen", S.role === "office" ? `<button class="btn green small" data-act="closeDis" data-id="${d[0]}">Oplossen</button>` : "Open"]))}`; };

  render = function () { if (!S.loggedIn) { A.innerHTML = loginScreen(); bind(); return; } const V = { dashboard: dash, operations, upload, market, approval, bids, invoices, disputes, charters, margin }[S.view] || dash; A.innerHTML = `<div class="app-shell">${nav()}<main class="main"><div class="topbar"><div class="kicker">⚡ ${S.role === "office" ? "Cargro Office" : S.charter}</div><div class="demo-note">Demo prototype · geen echte klantdata</div></div>${V()}</main></div>`; bind(); };

  const oldBind = bind;
  bind = function () {
    oldBind();
    document.querySelectorAll("[data-login]").forEach(b => b.onclick = () => { S.role = b.dataset.login; S.loggedIn = true; S.view = "dashboard"; const c = document.getElementById("loginCharter"); if (c) S.charter = c.value; save(); render(); });
    const c = document.getElementById("loginCharter"); if (c) c.onchange = e => { S.charter = e.target.value; save(); };
    const l = document.querySelector("[data-logout]"); if (l) l.onclick = () => { S.loggedIn = false; save(); render(); };
  };

  const oldAct = act;
  act = function (a, id) {
    if (a === "requestCurrent") { const r = route(routeRow(id)); S.bids.unshift([`BID-${130 + S.bids.length}`, id, S.charter, r.pay, "pending", "Aanvraag tegen huidige portaalprijs", "current"]); save(); toast("Aanvraag tegen huidige prijs verstuurd"); render(); return; }
    if (a === "higherBid") { const r = route(routeRow(id)); const val = prompt(`Hoger bod voor ${id}. Huidige prijs is ${fmt(r.pay)}. Vul je bod in:`, Math.round(r.pay * 1.08)); const amount = Number(val); if (amount && amount > r.pay) { S.bids.unshift([`BID-${130 + S.bids.length}`, id, S.charter, amount, "pending", "Hoger bod vanuit charter portal", "higher"]); save(); toast("Hoger bod verstuurd"); render(); } else if (val !== null) toast("Hoger bod moet boven huidige prijs liggen"); return; }
    if (a === "approveBid") { const b = S.bids.find(x => x[0] === id), rr = b && routeRow(b[1]); if (b && rr) { b[4] = "approved"; rr[13] = b[2]; rr[9] = "assigned"; rr[10] = "approved"; rr[11] = b[3]; rr[12] = Math.max(0, route(rr).customerRevenue - b[3]); save(); toast("Bod goedgekeurd"); render(); return; } }
    if (a === "closeDis") { const d = S.disputes.find(x => x[0] === id); if (d) { d[5] = "closed"; d[8] = `Correctie ${fmt(d[7] || 0)} verwerkt`; save(); toast("Dispute opgelost"); render(); return; } }
    if (a === "bulk") { oldAct(a, id); S.routes[0][10] = "to approve"; save(); return; }
    oldAct(a, id);
  };

  render();
})();
