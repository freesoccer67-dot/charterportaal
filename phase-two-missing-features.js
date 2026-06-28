(function () {
  const FEATURE_VERSION = "phase-two-missing-features-2026-06-28";
  const REGIOS = ["Oost", "Midden", "Zuid", "Noord", "Randstad", "West"];
  const esc2 = value => String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

  function parseNumber(value) {
    return Number(String(value ?? "0").replace(",", ".")) || 0;
  }

  function splitLaadruimte(value) {
    const nums = String(value || "").match(/\d+(?:[.,]\d+)?/g) || [];
    const [l, b, h] = nums.map(n => parseNumber(n));
    if (!l && !b && !h) return { lengte: 0, breedte: 0, hoogte: 0 };
    const scale = Math.max(l || 0, b || 0, h || 0) > 20 ? 100 : 1;
    return {
      lengte: Math.round((l || 0) / scale * 100) / 100,
      breedte: Math.round((b || 0) / scale * 100) / 100,
      hoogte: Math.round((h || 0) / scale * 100) / 100
    };
  }

  function laadruimteTekst(v) {
    const lengte = parseNumber(v.lengte || v.beladingsruimteLengte);
    const breedte = parseNumber(v.breedte || v.beladingsruimteBreedte);
    const hoogte = parseNumber(v.hoogte || v.beladingsruimteHoogte);
    if (lengte && breedte && hoogte) return `${lengte} x ${breedte} x ${hoogte} m`;
    return v.laadruimte || "-";
  }

  function ensureFeatureState() {
    state.tariefregels = state.tariefregels || {
      stopTarief: 4,
      kmPrijs: 0.42,
      uurPrijs: 24,
      regioToeslag: { Oost: 25, Midden: 20, Zuid: 22, Noord: 30, Randstad: 35, West: 28 }
    };
    REGIOS.forEach(regio => {
      state.tariefregels.regioToeslag[regio] = Number(state.tariefregels.regioToeslag[regio] ?? 0);
    });
    state.voertuigen.forEach(v => {
      const dims = splitLaadruimte(v.laadruimte);
      v.lengte = Number(v.lengte || dims.lengte || 0);
      v.breedte = Number(v.breedte || dims.breedte || 0);
      v.hoogte = Number(v.hoogte || dims.hoogte || 0);
      v.beschikbaarheid = v.beschikbaarheid || "beschikbaar";
      v.documenten = v.documenten || "verzekering aanwezig";
      v.niwo = v.niwo || "controle nodig";
    });
    state.chauffeurs = state.chauffeurs || [
      { id: "CH-001", charter: "LuxeLine Transport", naam: "Daya", telefoon: "+31 6 0000 0001", email: "daya@luxeline.example", rijbewijs: "B", beschikbaarheid: "beschikbaar", documenten: "rijbewijs gecontroleerd" },
      { id: "CH-002", charter: "Randstad Koeriers", naam: "Ahmed", telefoon: "+31 6 0000 0002", email: "planning@randstadkoeriers.example", rijbewijs: "B", beschikbaarheid: "beschikbaar", documenten: "controle nodig" }
    ];
    state.charters.forEach(c => {
      c.email = c.email || `${c.contact || "planning"}@${String(c.bedrijf || "charter").toLowerCase().replace(/[^a-z0-9]+/g, "")}.example`;
      c.telefoon = c.telefoon || "+31 6 0000 0000";
      c.kvk = c.kvk || "KVK volgt";
      c.niwo = c.niwo || (String(c.documenten || "").toLowerCase().includes("niwo") ? c.documenten : "NIWO controle");
    });
  }

  function berekenPayout(route) {
    ensureFeatureState();
    const regels = state.tariefregels;
    const regio = Number(regels.regioToeslag?.[route.zone] || 0);
    const totaal = parseNumber(route.km) * parseNumber(regels.kmPrijs) +
      parseNumber(route.uren) * parseNumber(regels.uurPrijs) +
      parseNumber(route.stops) * parseNumber(regels.stopTarief) + regio;
    return Math.round(totaal * 100) / 100;
  }

  function routeStatsVoorCharter(charter) {
    const routes = state.routes.filter(r => r.toegewezenAan === charter);
    const facturen = state.facturen.filter(f => f.charter === charter);
    const disputes = state.disputes.filter(d => d.charter === charter);
    const totaalPayout = routes.reduce((sum, r) => sum + Number(r.verwachtEx || 0), 0);
    const afgerond = routes.filter(r => String(r.status).includes("afgerond") || String(r.uitvoering).includes("afgerond")).length;
    return {
      routes,
      facturen,
      disputes,
      totaalPayout,
      afgerond,
      gemiddeld: routes.length ? totaalPayout / routes.length : 0,
      km: routes.reduce((sum, r) => sum + Number(r.km || 0), 0),
      stops: routes.reduce((sum, r) => sum + Number(r.stops || 0), 0),
      uren: routes.reduce((sum, r) => sum + Number(r.uren || 0), 0),
      factuurTotaal: facturen.reduce((sum, f) => sum + Number(f.factuurEx || 0), 0)
    };
  }

  function kpi(label, value, help) {
    return `<div class="card metric soft-blue"><div><div class="metric-label">${esc2(label)}</div><div class="metric-value">${value}</div></div><span class="metric-trend">${esc2(help || "")}</span></div>`;
  }

  const navBeforePhaseTwo = navigatie;
  navigatie = function () {
    ensureFeatureState();
    let html = navBeforePhaseTwo();
    if (state.role === "office") {
      const extra = `<button class="nav-btn ${state.view === "instellingen" ? "active" : ""}" data-view="instellingen"><span class="nav-left"><span class="nav-code">IN</span>Instellingen / Tariefregels</span></button>
        <button class="nav-btn ${state.view === "charterbeheer" ? "active" : ""}" data-view="charterbeheer"><span class="nav-left"><span class="nav-code">CB</span>Charter beheer</span></button>
        <button class="nav-btn ${state.view === "betalingen" ? "active" : ""}" data-view="betalingen"><span class="nav-left"><span class="nav-code">BT</span>Betalingen</span></button>`;
      html = html.replace("</aside>", `${extra}</aside>`);
    } else {
      const extra = `<button class="nav-btn ${state.view === "mijnwagenpark" ? "active" : ""}" data-view="mijnwagenpark"><span class="nav-left"><span class="nav-code">MW</span>Mijn wagenpark</span></button>
        <button class="nav-btn ${state.view === "mijnperformance" ? "active" : ""}" data-view="mijnperformance"><span class="nav-left"><span class="nav-code">MP</span>Mijn performance</span></button>`;
      html = html.replace("</aside>", `${extra}</aside>`);
    }
    return html;
  };

  function instellingen() {
    ensureFeatureState();
    const r = state.tariefregels;
    const voorbeeld = { km: 180, uren: 7.5, stops: 14, zone: "Oost" };
    return hero("Instellingen / Tariefregels", "Office beheert hier de globale regels waarmee verwachte betaling automatisch wordt berekend voor upload en route review.") +
      `<form class="card form-card" id="tariefForm">
        <div class="card-title">Standaard tariefregels</div>
        <div class="form-grid">
          <div class="field"><label>Stop tarief</label><input class="input" name="stopTarief" type="number" step="0.01" value="${r.stopTarief}"></div>
          <div class="field"><label>Kilometer prijs</label><input class="input" name="kmPrijs" type="number" step="0.01" value="${r.kmPrijs}"></div>
          <div class="field"><label>Uur prijs</label><input class="input" name="uurPrijs" type="number" step="0.01" value="${r.uurPrijs}"></div>
          ${REGIOS.map(regio => `<div class="field"><label>Regio toeslag ${regio}</label><input class="input" name="regio_${regio}" type="number" step="0.01" value="${r.regioToeslag[regio] || 0}"></div>`).join("")}
        </div>
        <button class="btn primary" style="margin-top:14px">Tariefregels opslaan</button>
      </form>
      <div class="grid two" style="margin-top:18px">
        <div class="card soft-green"><div class="card-title">Voorbeeldberekening</div>${tabel(["Onderdeel", "Waarde"], [["Kilometers", voorbeeld.km], ["Uren", voorbeeld.uren], ["Stops", voorbeeld.stops], ["Regio", voorbeeld.zone], ["Verwachte betaling", euro(berekenPayout(voorbeeld))]])}</div>
        <div class="card soft-blue"><div class="card-title">Effect op route review</div><p>Bij upload zonder handmatig bedrag gebruikt de portal deze regels. In Route review kan office het bedrag per route nog handmatig corrigeren voordat publicatie plaatsvindt.</p></div>
      </div>`;
  }

  function voertuigForm() {
    return `<form class="card soft-green" id="voertuigForm"><div class="card-title">Voertuig toevoegen</div>
      <div class="form-grid">
        <input class="input" name="type" placeholder="Voertuigtype" value="Bakwagen">
        <input class="input" name="kenteken" placeholder="Kenteken">
        <select name="laadklep"><option>Ja</option><option>Nee</option></select>
        <input class="input" name="laadvermogen" type="number" placeholder="Max gewicht kg" value="950">
        <input class="input" name="lengte" type="number" step="0.01" placeholder="Beladingsruimte lengte" value="4.20">
        <input class="input" name="breedte" type="number" step="0.01" placeholder="Beladingsruimte breedte" value="2.05">
        <input class="input" name="hoogte" type="number" step="0.01" placeholder="Beladingsruimte hoogte" value="2.10">
        <input class="input" name="beschikbaarheid" placeholder="Beschikbaarheid" value="beschikbaar">
        <input class="input" name="documenten" placeholder="Verzekering/documenten upload" value="verzekering.pdf">
        <input class="input" name="niwo" placeholder="NIWO/vervoersvergunning" value="NIWO aanwezig">
      </div><button class="btn green full" style="margin-top:14px">Voertuig opslaan</button></form>`;
  }

  function chauffeurForm() {
    return `<form class="card soft-blue" id="chauffeurForm"><div class="card-title">Chauffeur toevoegen</div>
      <div class="form-grid">
        <input class="input" name="naam" placeholder="Naam">
        <input class="input" name="telefoon" placeholder="Telefoon">
        <input class="input" name="email" placeholder="E-mail">
        <input class="input" name="rijbewijs" placeholder="Rijbewijs" value="B">
        <input class="input" name="beschikbaarheid" placeholder="Beschikbaarheid" value="beschikbaar">
        <input class="input" name="documenten" placeholder="Documenten" value="rijbewijs.pdf">
      </div><button class="btn primary full" style="margin-top:14px">Chauffeur opslaan</button></form>`;
  }

  vehicles = function () {
    ensureFeatureState();
    const voertuigen = state.role === "office" ? state.voertuigen : state.voertuigen.filter(v => v.charter === huidigeCharter());
    const chauffeurs = state.role === "office" ? state.chauffeurs : state.chauffeurs.filter(c => c.charter === huidigeCharter());
    const forms = state.role === "charter" ? `<div class="grid two">${voertuigForm()}${chauffeurForm()}</div>` : "";
    return hero(state.role === "office" ? "Voertuigen & chauffeurs" : "Mijn wagenpark", state.role === "office" ? "Office ziet per charter voertuigtype, beladingsruimte, NIWO en chauffeurs." : "Voeg voertuigen en chauffeurs toe zodat planning beter kan matchen.") +
      forms +
      `<div class="section-head"><div><h2>Voertuigen</h2><p>Beladingsruimte, laadklep, max gewicht en documentstatus.</p></div></div>` +
      tabel(["Voertuig", "Charter", "Type", "Kenteken", "Max gewicht", "Beladingsruimte LxBxH", "Laadklep", "Beschikbaarheid", "Documenten", "NIWO"], voertuigen.map(v => [v.id, v.charter, v.type, v.kenteken, `${getal(v.laadvermogen)} kg`, laadruimteTekst(v), v.laadklep, v.beschikbaarheid, v.documenten, v.niwo])) +
      `<div class="section-head"><div><h2>Chauffeurs</h2><p>Contact, rijbewijs, beschikbaarheid en documenten.</p></div></div>` +
      tabel(["Chauffeur", "Charter", "Naam", "Telefoon", "E-mail", "Rijbewijs", "Beschikbaarheid", "Documenten"], chauffeurs.map(c => [c.id, c.charter, c.naam, c.telefoon, c.email, c.rijbewijs, c.beschikbaarheid, c.documenten]));
  };

  function charterbeheer() {
    ensureFeatureState();
    const gekozen = state.geselecteerdeCharter || "Alle charters";
    const charters = gekozen === "Alle charters" ? state.charters : state.charters.filter(c => c.bedrijf === gekozen);
    return hero("Charter beheer", "Bedrijfsgegevens, documenten, chauffeurs, voertuigen, NIWO status, facturen, disputes en performance in een beheerpagina.") +
      `<div class="card soft-blue"><div class="form-grid"><div class="field"><label>Filter charter</label><select id="charterBeheerFilter"><option>Alle charters</option>${state.charters.map(c => `<option ${c.bedrijf === gekozen ? "selected" : ""}>${esc2(c.bedrijf)}</option>`).join("")}</select></div></div></div>` +
      charters.map(c => {
        const stats = routeStatsVoorCharter(c.bedrijf);
        const voertuigen = state.voertuigen.filter(v => v.charter === c.bedrijf);
        const chauffeurs = state.chauffeurs.filter(d => d.charter === c.bedrijf);
        return `<section class="module-section"><div class="section-head"><div><h2>${esc2(c.bedrijf)}</h2><p>${esc2(c.contact)} - ${esc2(c.plaats)} - ${esc2(c.status)}</p></div></div>
          <section class="grid four">${kpi("Routes gereden", stats.routes.length, "toegewezen")}${kpi("Afgerond", stats.afgerond, "completed")}${kpi("Facturen", euro(stats.factuurTotaal), "ingediend")}${kpi("Disputes", stats.disputes.length, "open/historie")}</section>
          ${tabel(["Onderdeel", "Waarde"], [["Contact", `${c.contact} - ${c.email} - ${c.telefoon}`], ["KVK", c.kvk], ["Documenten", c.documenten], ["NIWO", c.niwo], ["Zones", c.zones], ["Rating", c.rating]])}
          ${tabel(["Voertuig", "Kenteken", "Beladingsruimte", "Laadklep", "Status"], voertuigen.map(v => [v.type, v.kenteken, laadruimteTekst(v), v.laadklep, status(v.status)]))}
          ${tabel(["Chauffeur", "Telefoon", "E-mail", "Rijbewijs", "Beschikbaarheid"], chauffeurs.map(d => [d.naam, d.telefoon, d.email, d.rijbewijs, d.beschikbaarheid]))}
          ${tabel(["Factuur", "Week", "Verwacht", "Factuur", "Status"], stats.facturen.map(f => [f.id, f.week, euro(f.verwachtEx), euro(f.factuurEx), status(f.status)]))}
          ${tabel(["Dispute", "Route", "Reden", "Bedrag", "Status"], stats.disputes.map(d => [d.id, d.routeId, d.reden, euro(d.bedragEx), status(d.status)]))}
        </section>`;
      }).join("");
  }

  performance = function () {
    ensureFeatureState();
    const charterFilter = state.performanceFilterCharter || "Alle charters";
    const statusFilter = state.performanceFilterStatus || "Alle statussen";
    const regioFilter = state.performanceFilterRegio || "Alle regio's";
    const routes = state.routes.filter(r =>
      (charterFilter === "Alle charters" || r.toegewezenAan === charterFilter) &&
      (statusFilter === "Alle statussen" || r.status === statusFilter) &&
      (regioFilter === "Alle regio's" || r.zone === regioFilter)
    );
    const charterRows = state.charters.map(c => {
      const s = routeStatsVoorCharter(c.bedrijf);
      return [c.bedrijf, s.routes.length, s.afgerond, s.disputes.length, euro(s.factuurTotaal), euro(s.gemiddeld), getal(s.km), getal(s.stops), getal(s.uren), c.rating];
    });
    return hero("Performance", "Filter performance per charter, route, regio en status. Focus op routes gereden, facturen, disputes, gemiddelde payout en route profitability.") +
      `<div class="card soft-blue"><div class="form-grid">
        <div class="field"><label>Charter</label><select id="perfCharter"><option>Alle charters</option>${state.charters.map(c => `<option ${c.bedrijf === charterFilter ? "selected" : ""}>${esc2(c.bedrijf)}</option>`).join("")}</select></div>
        <div class="field"><label>Status</label><select id="perfStatus"><option>Alle statussen</option>${[...new Set(state.routes.map(r => r.status))].map(s => `<option ${s === statusFilter ? "selected" : ""}>${esc2(s)}</option>`).join("")}</select></div>
        <div class="field"><label>Regio</label><select id="perfRegio"><option>Alle regio's</option>${REGIOS.map(r => `<option ${r === regioFilter ? "selected" : ""}>${r}</option>`).join("")}</select></div>
      </div></div>
      <section class="grid four">${kpi("Routes in filter", routes.length, "route performance")}${kpi("Payout", euro(routes.reduce((a, r) => a + Number(r.verwachtEx || 0), 0)), "verwacht")}${kpi("Klantomzet", euro(routes.reduce((a, r) => a + Number(r.omzetEx || 0), 0)), "omzet")}${kpi("Profitability", euro(routes.reduce((a, r) => a + marge(r), 0)), "marge")}</section>
      <div class="section-head"><div><h2>Route performance</h2></div></div>
      ${tabel(["Route", "Charter", "Regio", "Status", "KM", "Stops", "Uren", "Payout", "Omzet", "Marge"], routes.map(r => [r.id, r.toegewezenAan || "Marketplace", r.zone, status(r.status), getal(r.km), getal(r.stops), getal(r.uren), euro(r.verwachtEx), euro(r.omzetEx), euro(marge(r))]))}
      <div class="section-head"><div><h2>Charter performance</h2></div></div>
      ${tabel(["Charter", "Routes", "Afgerond", "Disputes", "Facturen", "Gem. payout", "KM", "Stops", "Uren", "Rating"], charterRows)}`;
  };

  function betalingen() {
    ensureFeatureState();
    const rows = state.charters.map(c => {
      const s = routeStatsVoorCharter(c.bedrijf);
      const openFacturen = s.facturen.filter(f => !["goedgekeurd", "afgewezen"].includes(f.status)).length;
      return [c.bedrijf, s.routes.length, euro(s.totaalPayout), euro(s.factuurTotaal), openFacturen, s.disputes.length, s.factuurTotaal >= s.totaalPayout ? status("controle") : status("open")];
    });
    return hero("Betalingen", "Overzicht van verwachte betalingen, factuurstatus, open controles en disputes per charter.") +
      tabel(["Charter", "Routes", "Verwacht", "Gefactureerd", "Open facturen", "Disputes", "Status"], rows);
  }

  invoices = function () {
    ensureFeatureState();
    const list = state.role === "office" ? state.facturen : state.facturen.filter(x => x.charter === huidigeCharter());
    const assignedRoutes = state.routes.filter(r => r.toegewezenAan === huidigeCharter());
    const expected = assignedRoutes.reduce((a, r) => a + Number(r.verwachtEx || 0), 0);
    const form = state.role === "charter" ? `<form class="card soft-green" id="weeklyPayoutForm" style="margin-bottom:18px"><div class="card-title">Wekelijkse payout / factuur aanvragen</div><p>Verwachte betaling is vast en read-only. Vul factuur bedrag en documentnaam in.</p><div class="form-grid"><input class="input" name="week" value="2026-W26"><input class="input" readonly value="Verwacht excl.: ${euro(expected)}"><input class="input" name="factuurEx" type="number" value="${expected.toFixed(2)}" placeholder="Factuur bedrag"><input class="input" name="document" placeholder="Factuur document"></div><button class="btn green full" style="margin-top:12px">Payout aanvragen</button></form>` : "";
    const routeDetails = state.role === "charter" ? `<div class="card"><div class="card-title">Routes in verwachte betaling</div>${tabel(["Route", "Datum", "Stops", "KM", "Uren", "Verwachte betaling"], assignedRoutes.map(r => [r.id, r.datum, r.stops, r.km, r.uren, euro(r.verwachtEx)]))}</div>` : "";
    return hero(state.role === "office" ? "Facturen" : "Mijn facturen", state.role === "office" ? "Financiele administratie keurt facturen goed of wijst ze af." : "Factuurhistorie en wekelijkse payout aanvragen.") + form + routeDetails +
      tabel(["Factuur", "Charter", "Week", "Routes", "Verwacht excl.", "Factuur excl.", "Document", "Status", state.role === "office" ? "Actie" : "Datum"], list.map(f => [f.id, f.charter, f.week, f.routes, euro(f.verwachtEx), euro(f.factuurEx), f.document || "-", status(f.status), state.role === "office" ? `<button class="btn green small" data-act="approveInvoice" data-id="${esc2(f.id)}">Goedkeuren</button> <button class="btn red small" data-act="rejectInvoice" data-id="${esc2(f.id)}">Afwijzen</button>` : (f.ingediend || "-")]));
  };

  dashboard = function () {
    ensureFeatureState();
    const toReview = state.routes.filter(r => r.status === "te publiceren").length;
    const published = state.routes.filter(r => r.status === "open").length;
    const applications = state.aanvragen.filter(a => a.status === "te beoordelen").length;
    const invoicesPending = state.facturen.filter(f => ["ingediend", "controle nodig"].includes(f.status)).length;
    const disputesOpen = state.disputes.filter(d => !["afgerond", "afgewezen"].includes(d.status)).length;
    const activeCharters = state.charters.filter(c => c.status === "actief").length;
    const completed = state.routes.filter(r => String(r.status).includes("afgerond") || String(r.uitvoering).includes("afgerond")).length;
    const payments = state.facturen.reduce((sum, f) => sum + Number(f.factuurEx || 0), 0);
    if (state.role !== "office") {
      const mijnRoutes = state.routes.filter(r => r.toegewezenAan === huidigeCharter());
      return hero("Charter dashboard", "Overzicht van marketplace, aanvragen, goedgekeurde routes, facturen, disputes en documentstatus.", `${btn("Marketplace", "routes", "primary")} ${btn("Mijn wagenpark", "mijnwagenpark", "orange")}`) +
        `<section class="grid four">${kpi("Beschikbare routes", state.routes.filter(r => r.status === "open").length, "marketplace")}${kpi("Mijn aanvragen", state.aanvragen.filter(a => a.charter === huidigeCharter()).length, "aanvragen/biedingen")}${kpi("Goedgekeurde routes", mijnRoutes.length, "mijn routes")}${kpi("Verwachte betaling", euro(mijnRoutes.reduce((a, r) => a + Number(r.verwachtEx || 0), 0)), "read-only")}</section>` +
        `<section class="grid four">${kpi("Facturen", state.facturen.filter(f => f.charter === huidigeCharter()).length, "historie")}${kpi("Disputes", state.disputes.filter(d => d.charter === huidigeCharter()).length, "dossiers")}${kpi("Voertuigen", state.voertuigen.filter(v => v.charter === huidigeCharter()).length, "wagenpark")}${kpi("Documenten", state.documenten.filter(d => d.charter === huidigeCharter() && d.status !== "goedgekeurd").length, "controle")}</section>` +
        routesTabel(mijnRoutes);
    }
    return hero("Office dashboard", "Operationeel overzicht voor planning, finance en management.", `${btn("Routebeheer", "routebeheer", "primary")} ${btn("Instellingen", "instellingen", "orange")}`) +
      `<section class="grid four">${kpi("Te reviewen routes", toReview, "voor publicatie")}${kpi("Gepubliceerde routes", published, "marketplace")}${kpi("Aanvragen & biedingen", applications, "te beoordelen")}${kpi("Facturen open", invoicesPending, "finance")}</section>
       <section class="grid four">${kpi("Disputes", disputesOpen, "te behandelen")}${kpi("Actieve charters", activeCharters, "netwerk")}${kpi("Afgeronde routes", completed, "uitvoering")}${kpi("Betalingen", euro(payments), "factuurbedrag")}</section>` +
      performance();
  };

  const mainBeforePhaseTwo = renderMain;
  renderMain = function () {
    ensureFeatureState();
    if (state.view === "instellingen") return instellingen();
    if (state.view === "charterbeheer") return charterbeheer();
    if (state.view === "betalingen") return betalingen();
    if (state.view === "mijnwagenpark") return vehicles();
    if (state.view === "mijnperformance") return performance();
    if (state.view === "vehicles") return vehicles();
    if (state.view === "charters") return charterbeheer();
    if (state.view === "performance") return performance();
    if (state.view === "invoices") return invoices();
    if (state.view === "dashboard") return dashboard();
    return mainBeforePhaseTwo();
  };

  const actionBeforePhaseTwo = actie;
  actie = function (event, act, id, role) {
    if (event && event.preventDefault) event.preventDefault();
    ensureFeatureState();
    actionBeforePhaseTwo(event, act, id, role);
  };

  const bindBeforePhaseTwo = bind;
  bind = function () {
    bindBeforePhaseTwo();
    const tariefForm = document.getElementById("tariefForm");
    if (tariefForm && !tariefForm.dataset.bound) {
      tariefForm.dataset.bound = "true";
      tariefForm.addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(tariefForm));
        state.tariefregels.stopTarief = parseNumber(data.stopTarief);
        state.tariefregels.kmPrijs = parseNumber(data.kmPrijs);
        state.tariefregels.uurPrijs = parseNumber(data.uurPrijs);
        REGIOS.forEach(regio => state.tariefregels.regioToeslag[regio] = parseNumber(data[`regio_${regio}`]));
        log("Office", "Tariefregels bijgewerkt", "Instellingen", "tariefregels", "Globale tariefregels opgeslagen");
        opslaan();
        notify("Tariefregels opgeslagen.");
        render();
      });
    }
    const voertuigFormEl = document.getElementById("voertuigForm");
    if (voertuigFormEl && !voertuigFormEl.dataset.bound) {
      voertuigFormEl.dataset.bound = "true";
      voertuigFormEl.addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(voertuigFormEl));
        const id = `VH-${Date.now().toString().slice(-5)}`;
        state.voertuigen.push({
          id,
          charter: huidigeCharter(),
          type: data.type || "Voertuig",
          kenteken: data.kenteken || "Onbekend",
          laadvermogen: parseNumber(data.laadvermogen),
          laadruimte: `${data.lengte} x ${data.breedte} x ${data.hoogte} m`,
          lengte: parseNumber(data.lengte),
          breedte: parseNumber(data.breedte),
          hoogte: parseNumber(data.hoogte),
          laadklep: data.laadklep || "Nee",
          status: "te controleren",
          beschikbaarheid: data.beschikbaarheid || "beschikbaar",
          documenten: data.documenten || "-",
          niwo: data.niwo || "-"
        });
        log(huidigeCharter(), "Voertuig toegevoegd", "Voertuig", id, "Wagenpark bijgewerkt");
        opslaan();
        notify("Voertuig toegevoegd.");
        render();
      });
    }
    const chauffeurFormEl = document.getElementById("chauffeurForm");
    if (chauffeurFormEl && !chauffeurFormEl.dataset.bound) {
      chauffeurFormEl.dataset.bound = "true";
      chauffeurFormEl.addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(chauffeurFormEl));
        const id = `CH-${Date.now().toString().slice(-5)}`;
        state.chauffeurs.push({
          id,
          charter: huidigeCharter(),
          naam: data.naam || "Nieuwe chauffeur",
          telefoon: data.telefoon || "-",
          email: data.email || "-",
          rijbewijs: data.rijbewijs || "-",
          beschikbaarheid: data.beschikbaarheid || "beschikbaar",
          documenten: data.documenten || "-"
        });
        log(huidigeCharter(), "Chauffeur toegevoegd", "Chauffeur", id, "Chauffeurgegevens bijgewerkt");
        opslaan();
        notify("Chauffeur toegevoegd.");
        render();
      });
    }
    const payoutForm = document.getElementById("weeklyPayoutForm");
    if (payoutForm && !payoutForm.dataset.bound) {
      payoutForm.dataset.bound = "true";
      payoutForm.addEventListener("submit", event => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(payoutForm));
        const routes = state.routes.filter(r => r.toegewezenAan === huidigeCharter());
        const expected = routes.reduce((sum, r) => sum + Number(r.verwachtEx || 0), 0);
        const factuurEx = parseNumber(data.factuurEx);
        const id = `FAC-${Date.now().toString().slice(-5)}`;
        state.facturen.unshift({
          id,
          charter: huidigeCharter(),
          week: data.week || "2026-W26",
          routes: routes.length,
          verwachtEx: expected,
          factuurEx,
          status: Math.abs(factuurEx - expected) > 0.01 ? "controle nodig" : "ingediend",
          ingediend: new Date().toISOString().slice(0, 10),
          document: data.document || "-",
          notitie: "Wekelijkse payout aangevraagd."
        });
        log(huidigeCharter(), "Wekelijkse payout aangevraagd", "Factuur", id, `${routes.length} routes`);
        opslaan();
        notify("Payout aanvraag verzonden.");
        render();
      });
    }
    const charterFilter = document.getElementById("charterBeheerFilter");
    if (charterFilter && !charterFilter.dataset.bound) {
      charterFilter.dataset.bound = "true";
      charterFilter.addEventListener("change", event => {
        state.geselecteerdeCharter = event.target.value;
        opslaan();
        render();
      });
    }
    [["perfCharter", "performanceFilterCharter"], ["perfStatus", "performanceFilterStatus"], ["perfRegio", "performanceFilterRegio"]].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && !el.dataset.bound) {
        el.dataset.bound = "true";
        el.addEventListener("change", event => {
          state[key] = event.target.value;
          opslaan();
          render();
        });
      }
    });
  };

  const style = document.createElement("style");
  style.textContent = `
    .metric .metric-value { font-size: clamp(24px, 3vw, 34px); }
    .form-card .form-grid, #voertuigForm .form-grid, #chauffeurForm .form-grid { margin-top: 12px; }
    .nav-btn .nav-code { min-width: 28px; }
  `;
  document.head.appendChild(style);

  ensureFeatureState();
  state._featureVersion = FEATURE_VERSION;
  render();
})();
