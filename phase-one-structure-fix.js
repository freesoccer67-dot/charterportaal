(function () {
  const PHASE_VERSION = "phase-one-structure-2026-06-27";
  const escPhase = value => String(value ?? "").replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const routeStatusForReview = route => ["te publiceren", "concept", "wacht op publicatie"].includes(String(route.status || "").toLowerCase()) || route.aanvraagStatus === "te publiceren";
  const publishedRoute = route => ["open", "toegewezen", "afgerond"].includes(String(route.status || "").toLowerCase());

  function ensurePhaseState() {
    state.tariefregels = state.tariefregels || {
      stopTarief: 4,
      kmPrijs: 0.42,
      uurPrijs: 24,
      regioToeslag: { Oost: 25, Midden: 20, Zuid: 22, Noord: 30, Randstad: 35, West: 28 }
    };
    state.officeRol = state.officeRol || "Planner";
    state.routes.forEach(route => {
      if (!route.faseBron) route.faseBron = route.bron || "Portal";
      if (route.status === "wacht op goedkeuring" && route.bron !== "Charter aanvraag") {
        route.aanvraagStatus = route.aanvraagStatus || "te publiceren";
      }
    });
  }

  function berekenVerwacht(route) {
    ensurePhaseState();
    const regels = state.tariefregels;
    const regio = regels.regioToeslag?.[route.zone] || 0;
    const totaal = (Number(route.km) || 0) * (Number(regels.kmPrijs) || 0) +
      (Number(route.uren) || 0) * (Number(regels.uurPrijs) || 0) +
      (Number(route.stops) || 0) * (Number(regels.stopTarief) || 0) + regio;
    return Math.round(totaal * 100) / 100;
  }

  function routeNaarReview(route) {
    const prijs = Number(route.verwachtEx) || berekenVerwacht(route);
    return {
      ...route,
      verwachtEx: prijs,
      omzetEx: Number(route.omzetEx) || Math.round(prijs * 1.18 * 100) / 100,
      status: "te publiceren",
      aanvraagStatus: "te publiceren",
      toegewezenAan: "",
      factuurStatus: "niet toegewezen",
      uitvoering: "wacht op publicatie",
      zichtbaarheid: "niet gepubliceerd",
      bron: route.bron || "Upload",
      notitie: route.notitie || "Geimporteerd en klaar voor review."
    };
  }

  function scrollNaarLoginKeuze() {
    const target = document.querySelector("#login-keuze, [data-login-choice]");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("login-choice-highlight");
      setTimeout(() => target.classList.remove("login-choice-highlight"), 1400);
    }
  }

  const vorigeLanding = landing;
  landing = function () {
    ensurePhaseState();
    const html = vorigeLanding().replace('data-act="openLogin" data-role="office">Inloggen', 'data-act="scrollLogin">Inloggen');
    const keuze = `<section id="login-keuze" class="landing-section login-choice-section" data-login-choice>
      <div class="section-head"><div><h2>Inloggen</h2><p>Kies eerst of je als Cargro office of als charter wilt werken.</p></div></div>
      <div class="grid two">
        <article class="card soft-blue login-choice-card"><div class="card-title">Office inloggen</div><p>Voor CEO, planning, financiele administratie en office/admin.</p><div class="hero-actions"><button class="btn primary" data-act="openLogin" data-role="office">Office inloggen</button></div></article>
        <article class="card soft-green login-choice-card"><div class="card-title">Charter inloggen</div><p>Voor routes aanvragen, hogere biedingen, facturen, disputes en wagenpark.</p><div class="hero-actions"><button class="btn orange" data-act="openLogin" data-role="charter">Charter inloggen</button></div></article>
      </div>
    </section>`;
    return html.replace('<section id="rollen"', `${keuze}<section id="rollen"`);
  };

  login = function () {
    const office = state.role === "office";
    return `<main class="landing-shell login-shell"><nav class="landing-nav"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">${office ? "Office toegang" : "Charter toegang"}</div></div></div><button class="btn ghost" data-act="home">Terug</button></nav><section class="login-card-wrap"><form class="card login-card" id="loginForm"><div class="card-title">${office ? "Office login" : "Charter login"}</div><p class="muted">Testlogin voor de eerste validatie. Later vervangen door Supabase Auth met rollen.</p>${office ? `<div class="field"><label>Office rol</label><select id="officeRol" name="officeRol"><option>Planner</option><option>CEO</option><option>Financiele administratie</option><option>Office/admin</option></select></div>` : `<div class="field"><label>Test charter</label><select id="loginCharter">${state.charters.map(c => `<option ${c.bedrijf === huidigeCharter() ? "selected" : ""}>${escPhase(c.bedrijf)}</option>`).join("")}</select></div>`}<div class="field"><label>Email</label><input class="input" value="${office ? "planning@cargro.nl" : "charter@example.com"}"></div><div class="field"><label>Wachtwoord</label><input class="input" type="password" value="demo123"></div><button class="btn ${office ? "primary" : "orange"} full">Naar ${office ? "Office" : "Charter"} portaal</button></form></section></main>`;
  };

  const oudeNavigatie = navigatie;
  navigatie = function () {
    ensurePhaseState();
    let html = oudeNavigatie();
    if (state.role === "office") {
      html = html.replace("</aside>", `<div class="sidebar-note"><strong>Rol</strong><span>${escPhase(state.officeRol)}</span></div></aside>`);
    }
    return html;
  };

  function editorRoute(route) {
    return `<form class="card route-editor" data-route-editor="${escPhase(route.id)}">
      <div class="route-top"><div><div class="card-title">${escPhase(route.id)} - ${escPhase(route.titel)}</div><p class="muted">${escPhase(route.start)} naar ${escPhase(route.laatsteStop)} - ${escPhase(route.zone)}</p></div>${status(route.status)}</div>
      <div class="form-grid">
        <input class="input" name="titel" value="${escPhase(route.titel)}" placeholder="Routenaam" />
        <input class="input" name="zone" value="${escPhase(route.zone)}" placeholder="Regio" />
        <input class="input" name="km" type="number" step="0.1" value="${Number(route.km) || 0}" placeholder="Kilometers" />
        <input class="input" name="uren" type="number" step="0.1" value="${Number(route.uren) || 0}" placeholder="Uren" />
        <input class="input" name="stops" type="number" value="${Number(route.stops) || 0}" placeholder="Stops" />
        <input class="input" name="verwachtEx" type="number" step="0.01" value="${Number(route.verwachtEx) || berekenVerwacht(route)}" placeholder="Verwachte betaling" />
      </div>
      <p class="muted">Automatische berekening nu: km + uren + stops + regio toeslag. Office kan de verwachte betaling hier handmatig aanpassen voor publicatie.</p>
      <div class="hero-actions"><button class="btn ghost small" type="button" data-act="recalcRoute" data-id="${escPhase(route.id)}">Herberekenen</button><button class="btn primary small" type="button" data-act="saveRoute" data-id="${escPhase(route.id)}">Opslaan</button><button class="btn green small" type="button" data-act="publishRoute" data-id="${escPhase(route.id)}">Publiceren</button><button class="btn red small" type="button" data-act="deleteRoute" data-id="${escPhase(route.id)}">Verwijderen</button></div>
    </form>`;
  }

  function tePublicerenRoutes() {
    const concepten = state.routes.filter(routeStatusForReview);
    return hero("Route review / Te publiceren routes", "Nieuwe uploadroutes komen eerst hier terecht. Office controleert tarief, regio en verwachte betaling voordat de route naar de marketplace gaat.", `<button class="btn primary" data-view="upload">Routes uploaden</button>`) +
      `<div class="grid two">${concepten.map(editorRoute).join("") || `<div class="empty">Geen routes wachten op publicatie.</div>`}</div>`;
  }

  routeKaart = function (route) {
    const openVoorCharter = state.role === "charter" && route.status === "open";
    const officeActies = state.role === "office" ? `<div class="hero-actions"><button class="btn ghost small" data-view="approval">Aanvragen bekijken</button>${route.status === "open" ? `<button class="btn ghost small" data-act="unpublishRoute" data-id="${escPhase(route.id)}">Depubliceren</button>` : ""}<button class="btn red small" data-act="deleteRoute" data-id="${escPhase(route.id)}">Verwijderen</button></div>` : "";
    return `<article class="route-card"><div class="route-top"><div><div class="route-title">${escPhase(route.titel)}</div><div class="route-meta">${escPhase(route.id)} - ${escPhase(route.bron)} - ${escPhase(route.start)} naar ${escPhase(route.laatsteStop)} - laden ${escPhase(route.laden)}</div></div>${status(route.status)}</div><div class="route-info">${pill(route.zone, "blue")}${pill(route.voertuig, "purple")}${pill(`${route.stops} stops`, "green")}${pill(`${getal(route.kg)} kg`, "orange")}${pill(`Verwacht: ${euro(route.verwachtEx)}`, "gray")}</div><p class="muted">${escPhase(route.notitie)}</p><div class="price-strip"><div class="price-cell"><strong>${getal(route.km)}</strong><span>KM</span></div><div class="price-cell"><strong>${getal(route.uren)}</strong><span>uren</span></div><div class="price-cell"><strong>${euro(route.verwachtEx)}</strong><span>verwacht excl.</span></div><div class="price-cell"><strong>${euro(incl(route.verwachtEx))}</strong><span>incl. btw</span></div></div><div class="hero-actions">${openVoorCharter ? `<button class="btn primary small" data-act="requestRoute" data-id="${escPhase(route.id)}">Route aanvragen</button><button class="btn orange small" data-act="higherOffer" data-id="${escPhase(route.id)}">Hoger aanbod</button>` : ""}<button class="btn dark small" data-act="execution" data-id="${escPhase(route.id)}">Uitvoering</button></div>${officeActies}</article>`;
  };

  routes = function () {
    const zichtbaarRoutes = state.routes.filter(zichtbaar).filter(route => state.role === "office" ? publishedRoute(route) : route.status === "open" || route.toegewezenAan === huidigeCharter());
    return hero("Marketplace", state.role === "office" ? "Gepubliceerde routes met controls voor de office: aanvragen bekijken, depubliceren of verwijderen." : "Beschikbare routes om aan te vragen of een hoger aanbod op te doen.", state.role === "office" ? `<button class="btn primary" data-view="routeReview">Te publiceren routes</button>` : "") + `<div class="grid two">${zichtbaarRoutes.map(routeKaart).join("") || `<div class="empty">Geen routes zichtbaar.</div>`}</div>`;
  };

  approval = function () {
    const aanvragen = state.aanvragen.filter(x => x.status === "te beoordelen");
    const perRoute = state.routes.filter(r => aanvragen.some(a => a.routeId === r.id));
    return hero("Aanvragen & biedingen", "Office ziet meerdere applicants/bids per route en kan precies een charter goedkeuren.") +
      `${perRoute.map(route => {
        const rows = aanvragen.filter(a => a.routeId === route.id);
        return `<section class="module-section"><div class="section-head"><div><h2>${escPhase(route.titel)}</h2><p>${escPhase(route.id)} - verwachte betaling ${euro(route.verwachtEx)}</p></div></div><div class="grid two">${rows.map(a => `<div class="card soft-orange"><div class="card-title">${escPhase(a.type)} ${status(a.status)}</div><p><strong>${escPhase(a.charter)}</strong> - ${euro(a.bedragEx)} excl. btw</p><p class="muted">${escPhase(a.notitie)}</p><div class="hero-actions"><button class="btn green" data-act="approveRequest" data-id="${escPhase(a.id)}">Goedkeuren</button><button class="btn red" data-act="rejectRequest" data-id="${escPhase(a.id)}">Afwijzen</button></div></div>`).join("")}</div></section>`;
      }).join("") || `<div class="empty">Geen aanvragen of biedingen om te beoordelen.</div>`}`;
  };

  invoices = function () {
    const list = state.role === "office" ? state.facturen : state.facturen.filter(x => x.charter === huidigeCharter());
    const assignedRoutes = state.routes.filter(r => r.toegewezenAan === huidigeCharter());
    const expected = assignedRoutes.reduce((a, r) => a + Number(r.verwachtEx || 0), 0);
    const form = state.role === "charter" ? `<form class="card soft-green" id="invoiceForm" style="margin-bottom:18px"><div class="card-title">Factuur indienen</div><p>Verwachte betaling is vast en read-only. Vul alleen het factuurbedrag en optioneel een documentnaam in.</p><div class="form-grid"><input class="input" name="factuur" value="FAC-${Date.now().toString().slice(-5)}"><input class="input" name="bedrag" type="number" value="${expected.toFixed(2)}"><input class="input" readonly value="Verwacht excl.: ${euro(expected)}"><input class="input" name="document" placeholder="Factuurdocument.pdf"></div><textarea name="notitie" style="margin-top:12px">Factuur ingediend voor toegewezen routes.</textarea><button class="btn green full" style="margin-top:12px">Factuur versturen</button></form>` : "";
    return hero("Facturen", "Charter dient een bedrag in; office/financiele administratie keurt goed of wijst af.") + form +
      tabel(["Factuur", "Charter", "Week", "Routes", "Verwacht excl.", "Factuur excl.", "Verschil", "Status", state.role === "office" ? "Actie" : "Document"], list.map(x => [x.id, x.charter, x.week, x.routes, euro(x.verwachtEx), euro(x.factuurEx), euro(x.factuurEx - x.verwachtEx), status(x.status), state.role === "office" ? `<button class="btn green small" data-act="approveInvoice" data-id="${escPhase(x.id)}">Goedkeuren</button> <button class="btn red small" data-act="rejectInvoice" data-id="${escPhase(x.id)}">Afwijzen</button>` : escPhase(x.document || x.notitie || "-") ]));
  };

  disputes = function () {
    const list = state.role === "office" ? state.disputes : state.disputes.filter(x => x.charter === huidigeCharter());
    const routeOptions = state.routes.filter(r => state.role === "office" || r.toegewezenAan === huidigeCharter()).map(r => `<option value="${escPhase(r.id)}">${escPhase(r.id)} - ${escPhase(r.titel)}</option>`).join("");
    const form = state.role === "charter" ? `<form class="card soft-orange" id="disputeForm" style="margin-bottom:18px"><div class="card-title">Dispute aanmaken</div><div class="form-grid"><select name="routeId">${routeOptions}</select><input class="input" name="reden" placeholder="Reden"><input class="input" name="bedrag" type="number" value="0"><select name="prioriteit"><option>laag</option><option>middel</option><option>hoog</option></select></div><textarea name="notitie" style="margin-top:12px" placeholder="Toelichting"></textarea><button class="btn orange full" style="margin-top:12px">Dispute indienen</button></form>` : "";
    return hero("Disputes te behandelen", "Disputes zijn echte routegekoppelde dossiers met office-acties.") + form +
      tabel(["Dispute", "Route", "Charter", "Reden", "Bedrag", "Prioriteit", "Status", "Notitie", state.role === "office" ? "Actie" : ""], list.map(x => [x.id, x.routeId, x.charter, x.reden, euro(x.bedragEx), x.prioriteit, status(x.status), escPhase(x.notitie), state.role === "office" ? `<button class="btn green small" data-act="resolveDispute" data-id="${escPhase(x.id)}">Oplossen</button> <button class="btn red small" data-act="rejectDispute" data-id="${escPhase(x.id)}">Afwijzen</button>` : ""]));
  };

  const vorigeRenderMain = renderMain;
  renderMain = function () {
    ensurePhaseState();
    if (state.view === "routeReview") return tePublicerenRoutes();
    if (state.view === "routes") return routes();
    if (state.view === "approval") return approval();
    if (state.view === "invoices") return invoices();
    if (state.view === "disputes") return disputes();
    return vorigeRenderMain();
  };

  if (typeof importeerRoutesUitRijen === "function") {
    importeerRoutesUitRijen = function (rijen) {
      const nieuw = rijen.map((rij, index) => routeNaarReview(maakRouteVanRij(rij, index)));
      nieuw.forEach(route => {
        const bestaand = state.routes.findIndex(r => r.id === route.id);
        if (bestaand >= 0) state.routes[bestaand] = route;
        else state.routes.push(route);
        log("Office", "Route geimporteerd naar review", "Route", route.id, "Route wacht op publicatie");
      });
      opslaan();
      notify(`${nieuw.length} route(s) klaar voor review.`);
      ga("routeReview");
    };
  }

  function leesRouteForm(id) {
    const form = document.querySelector(`[data-route-editor="${CSS.escape(id)}"]`);
    if (!form) return null;
    return Object.fromEntries(new FormData(form));
  }

  const vorigeActie = actie;
  actie = function (event, act, id, role) {
    if (event && event.preventDefault) event.preventDefault();
    ensurePhaseState();
    if (act === "scrollLogin") { scrollNaarLoginKeuze(); return; }
    if (act === "saveRoute" || act === "recalcRoute" || act === "publishRoute") {
      const route = state.routes.find(r => r.id === id);
      if (!route) return;
      const data = leesRouteForm(id);
      if (data) {
        route.titel = data.titel || route.titel;
        route.zone = data.zone || route.zone;
        route.km = Number(data.km) || 0;
        route.uren = Number(data.uren) || 0;
        route.stops = Number(data.stops) || 0;
        route.verwachtEx = act === "recalcRoute" ? berekenVerwacht(route) : (Number(data.verwachtEx) || berekenVerwacht(route));
      }
      if (act === "publishRoute") {
        route.status = "open";
        route.aanvraagStatus = "gepubliceerd";
        route.uitvoering = "open voor aanvragen";
        route.zichtbaarheid = "open marketplace";
        log("Office", "Route gepubliceerd", "Route", route.id, "Route staat in de marketplace");
        notify("Route gepubliceerd naar marketplace.");
        opslaan();
        ga("routes");
        return;
      }
      log("Office", act === "recalcRoute" ? "Route herberekend" : "Route opgeslagen", "Route", route.id, "Reviewgegevens bijgewerkt");
      opslaan();
      notify(act === "recalcRoute" ? "Verwachte betaling herberekend." : "Route opgeslagen.");
      render();
      return;
    }
    if (act === "unpublishRoute") {
      const route = state.routes.find(r => r.id === id);
      if (route) {
        route.status = "te publiceren";
        route.aanvraagStatus = "te publiceren";
        route.zichtbaarheid = "niet gepubliceerd";
        route.uitvoering = "wacht op publicatie";
        log("Office", "Route gedepubliceerd", "Route", route.id, "Terug naar review");
        opslaan();
        notify("Route teruggezet naar review.");
        ga("routeReview");
      }
      return;
    }
    if (act === "deleteRoute") {
      state.routes = state.routes.filter(r => r.id !== id);
      state.aanvragen = state.aanvragen.filter(a => a.routeId !== id);
      state.events = state.events.filter(e => e.routeId !== id);
      log("Office", "Route verwijderd", "Route", id, "Route en gekoppelde aanvragen verwijderd");
      opslaan();
      notify("Route verwijderd.");
      render();
      return;
    }
    if (act === "approveInvoice" || act === "rejectInvoice") {
      const factuur = state.facturen.find(f => f.id === id);
      if (factuur) {
        factuur.status = act === "approveInvoice" ? "goedgekeurd" : "afgewezen";
        factuur.notitie = act === "approveInvoice" ? "Goedgekeurd door office." : "Afgewezen door office.";
        log("Financiele administratie", factuur.status === "goedgekeurd" ? "Factuur goedgekeurd" : "Factuur afgewezen", "Factuur", id, factuur.notitie);
        opslaan();
        notify(`Factuur ${factuur.status}.`);
        render();
      }
      return;
    }
    if (act === "resolveDispute" || act === "rejectDispute") {
      const dispute = state.disputes.find(d => d.id === id);
      if (dispute) {
        dispute.status = act === "resolveDispute" ? "afgerond" : "afgewezen";
        dispute.notitie = `${dispute.notitie} | Office: ${dispute.status}.`;
        log("Office", act === "resolveDispute" ? "Dispute opgelost" : "Dispute afgewezen", "Dispute", id, dispute.notitie);
        opslaan();
        notify(`Dispute ${dispute.status}.`);
        render();
      }
      return;
    }
    vorigeActie(event, act, id, role);
  };

  const vorigeBind = bind;
  bind = function () {
    vorigeBind();
    const form = document.getElementById("loginForm");
    if (form && !form.dataset.phaseBound) {
      form.dataset.phaseBound = "true";
      form.addEventListener("submit", event => {
        const rol = document.getElementById("officeRol");
        if (rol) state.officeRol = rol.value;
      }, true);
    }
    const disputeForm = document.getElementById("disputeForm");
    if (disputeForm && !disputeForm.dataset.phaseBound) {
      disputeForm.dataset.phaseBound = "true";
      disputeForm.addEventListener("submit", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const data = Object.fromEntries(new FormData(disputeForm));
        state.disputes.unshift({ id: `DIS-${Date.now().toString().slice(-5)}`, routeId: data.routeId, charter: huidigeCharter(), reden: data.reden || "Routeafwijking", bedragEx: Number(data.bedrag) || 0, status: "te behandelen", prioriteit: data.prioriteit || "middel", notitie: data.notitie || "Ingediend door charter." });
        log(huidigeCharter(), "Dispute aangemaakt", "Route", data.routeId, data.reden || "Routeafwijking");
        opslaan();
        notify("Dispute naar office gestuurd.");
        render();
      }, true);
    }
    const manual = document.getElementById("manualRouteForm");
    if (manual && !manual.dataset.phaseReviewBound) {
      manual.dataset.phaseReviewBound = "true";
      manual.addEventListener("submit", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        const data = Object.fromEntries(new FormData(manual));
        const voertuig = String(data.voertuig || "Bakwagen");
        const route = routeNaarReview({
          id: `MAN-${Date.now().toString().slice(-6)}`,
          titel: data.titel || "Nieuwe route",
          datum: data.datum || new Date().toISOString().slice(0, 10),
          zone: data.zone || "Midden",
          start: data.start || "Wijchen",
          eersteStop: data.eersteStop || "Eerste stop",
          laatsteStop: data.laatsteStop || "Laatste stop",
          laden: data.laden || "07:00",
          venster: `${data.laden || "07:00"} - later`,
          voertuig,
          laadruimte: voertuig.toLowerCase().includes("bakwagen") ? "420 x 210 x 220 cm" : "370 x 178 x 190 cm",
          laadklep: voertuig.toLowerCase().includes("laadklep") ? "Ja" : "Nee",
          stops: Number(data.stops) || 0,
          km: Number(data.km) || 0,
          uren: Number(data.uren) || 0,
          kg: Number(data.kg) || 0,
          verwachtEx: Number(data.verwachtEx) || 0,
          omzetEx: Number(data.omzetEx) || 0,
          bron: "Handmatig",
          notitie: data.notitie || "Handmatig aangemaakt via route upload."
        });
        state.routes.push(route);
        log("Office", "Route handmatig toegevoegd naar review", "Route", route.id, "Route wacht op publicatie");
        opslaan();
        notify("Route staat klaar voor review.");
        ga("routeReview");
      }, true);
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .login-choice-section { scroll-margin-top: 40px; }
    .login-choice-card { min-height: 190px; display: flex; flex-direction: column; justify-content: space-between; }
    .route-editor .form-grid { margin-top: 14px; }
    .route-editor .route-top { align-items: flex-start; }
    .sidebar-note span { display: block; color: var(--muted); margin-top: 4px; }
  `;
  document.head.appendChild(style);

  ensurePhaseState();
  state._phaseVersion = PHASE_VERSION;
  render();
})();
