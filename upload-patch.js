const origineleNavigatieUploadPatch = navigatie;
const origineleRenderMainUploadPatch = renderMain;
const origineleBindUploadPatch = bind;

function maakRouteVanRij(rij, index) {
  const v = (naam, fallback = "") => rij[naam] ?? rij[naam.toLowerCase()] ?? rij[naam.toUpperCase()] ?? fallback;
  const voertuig = String(v("voertuig", v("vehicle", "Bakwagen")));
  const laadruimte = String(v("laadruimte", voertuig.toLowerCase().includes("bakwagen") ? "420 × 210 × 220 cm" : "370 × 178 × 190 cm"));
  const routeId = String(v("route_id", v("id", `IMP-${Date.now().toString().slice(-5)}-${index + 1}`)));
  const verwacht = Number(String(v("verwacht_ex", v("verwachte_betaling_ex", v("payout_ex", 0)))).replace(",", ".")) || 0;
  const omzet = Number(String(v("omzet_ex", v("klantomzet_ex", verwacht * 1.18))).replace(",", ".")) || verwacht;
  return {
    id: routeId,
    titel: String(v("titel", v("route", `Geïmporteerde route ${index + 1}`))),
    datum: String(v("datum", v("date", new Date().toISOString().slice(0, 10)))),
    zone: String(v("zone", "Midden")),
    start: String(v("start", v("startlocatie", "Wijchen"))),
    eersteStop: String(v("eerste_stop", v("first_stop", "Eerste stop"))),
    laatsteStop: String(v("laatste_stop", v("last_stop", "Laatste stop"))),
    laden: String(v("laden", v("laadtijd", "07:00"))),
    venster: String(v("venster", "07:00 - 07:45")),
    voertuig,
    laadruimte,
    laadklep: String(v("laadklep", voertuig.toLowerCase().includes("laadklep") ? "Ja" : "Nee")),
    stops: Number(v("stops", 0)) || 0,
    km: Number(String(v("km", 0)).replace(",", ".")) || 0,
    uren: Number(String(v("uren", v("hours", 0))).replace(",", ".")) || 0,
    kg: Number(String(v("kg", 0)).replace(",", ".")) || 0,
    vereist: String(v("vereist", v("equipment", "Steekwagen"))),
    verwachtEx: verwacht,
    omzetEx: omzet,
    status: String(v("status", "open")),
    aanvraagStatus: "gepubliceerd",
    toegewezenAan: String(v("charter", "")),
    bron: String(v("bron", "Upload")),
    factuurStatus: "niet toegewezen",
    uitvoering: "open voor aanvragen",
    zichtbaarheid: String(v("zichtbaarheid", "open marketplace")),
    notitie: String(v("notitie", v("notes", "Geïmporteerd via route upload.")))
  };
}

function csvNaarObjecten(tekst) {
  const regels = tekst.trim().split(/\r?\n/).filter(Boolean);
  if (!regels.length) return [];
  const splitter = regels[0].includes(";") ? ";" : ",";
  const koppen = regels[0].split(splitter).map(x => x.trim());
  return regels.slice(1).map(regel => {
    const cols = regel.split(splitter).map(x => x.trim());
    const obj = {};
    koppen.forEach((k, i) => obj[k] = cols[i] || "");
    return obj;
  });
}

function upload() {
  return hero("Route upload", "Upload routes via Excel/CSV of voeg handmatig één route toe. Geüploade routes worden direct opgeslagen in Supabase teststate en verschijnen in de marketplace of approval-flow.", `${btn("Routes bekijken", "routes", "primary")} ${btn("Goedkeuringen", "approval", "orange")}`) + `
    <div class="grid two">
      <div class="card soft-blue">
        <div class="card-title">Bulk upload</div>
        <p>Ondersteunt CSV en Excel. Gebruik de template zodat kolommen correct worden herkend.</p>
        <div class="hero-actions" style="margin-bottom:14px">
          <button class="btn dark" data-act="downloadTemplate">Template downloaden</button>
        </div>
        <input class="input" id="routeUploadFile" type="file" accept=".csv,.xlsx,.xls" />
        <div id="uploadPreview" class="muted" style="margin-top:12px">Nog geen bestand geselecteerd.</div>
        <button class="btn primary full" id="importRoutesBtn" style="margin-top:14px">Routes importeren</button>
      </div>
      <form class="card soft-green" id="manualRouteForm">
        <div class="card-title">Handmatige route</div>
        <p>Voor spoedroutes, correcties of routes die niet uit MendriX/Excel komen.</p>
        <div class="form-grid">
          <input class="input" name="titel" value="Nieuwe testroute" placeholder="Titel" />
          <select name="zone"><option>Oost</option><option>Midden</option><option>Zuid</option><option>Noord</option><option>Randstad</option><option>West</option></select>
          <input class="input" name="datum" type="date" value="2026-06-29" />
          <input class="input" name="laden" value="07:00" placeholder="Laadtijd" />
          <input class="input" name="start" value="Wijchen" placeholder="Startlocatie" />
          <input class="input" name="eersteStop" value="Eerste stop" placeholder="Eerste stop" />
          <input class="input" name="laatsteStop" value="Laatste stop" placeholder="Laatste stop" />
          <select name="voertuig"><option>L3</option><option>L4</option><option>Bakwagen</option><option>Bakwagen laadklep</option></select>
          <input class="input" name="stops" type="number" value="14" placeholder="Stops" />
          <input class="input" name="km" type="number" value="280" placeholder="KM" />
          <input class="input" name="uren" type="number" step="0.1" value="8.2" placeholder="Uren" />
          <input class="input" name="kg" type="number" value="520" placeholder="KG" />
          <input class="input" name="verwachtEx" type="number" value="525" placeholder="Verwachte betaling excl." />
          <input class="input" name="omzetEx" type="number" value="650" placeholder="Klantomzet excl." />
          <select name="status"><option value="open">Open marketplace</option><option value="wacht op goedkeuring">Eerst naar approval</option><option value="toegewezen">Direct toegewezen</option></select>
          <input class="input" name="charter" placeholder="Charter bij direct toegewezen" />
        </div>
        <textarea name="notitie" style="margin-top:12px">Handmatig aangemaakt via route upload.</textarea>
        <button class="btn green full" style="margin-top:14px">Route toevoegen</button>
      </form>
    </div>
    <div class="section-head"><div><h2>Benodigde kolommen</h2><p>Minimaal: route_id, titel, datum, zone, start, eerste_stop, laatste_stop, laden, voertuig, stops, km, uren, kg, verwacht_ex, omzet_ex.</p></div></div>
    ${tabel(["Kolom", "Voorbeeld", "Opmerking"], [
      ["route_id", "MX-260701-001", "Unieke routecode"],
      ["titel", "Zwolle route", "Naam zichtbaar in portal"],
      ["voertuig", "Bakwagen laadklep", "Voor matching met chartervoertuigen"],
      ["verwacht_ex", "650", "Vaste betaling excl. btw"],
      ["status", "open", "open / wacht op goedkeuring / toegewezen"]
    ])}`;
}

navigatie = function() {
  let html = origineleNavigatieUploadPatch();
  if (state.role === "office") {
    const knop = `<button class="nav-btn ${state.view === "upload" ? "active" : ""}" data-view="upload"><span class="nav-left"><span class="nav-code">UP</span>Route upload</span></button>`;
    html = html.replace('<div class="nav-group-title">Navigatie</div>', '<div class="nav-group-title">Navigatie</div>' + knop);
  }
  return html;
};

renderMain = function() {
  if (state.view === "upload") return upload();
  return origineleRenderMainUploadPatch();
};

function importeerRoutesUitRijen(rijen) {
  const nieuw = rijen.map(maakRouteVanRij);
  nieuw.forEach(route => {
    const bestaand = state.routes.findIndex(r => r.id === route.id);
    if (bestaand >= 0) state.routes[bestaand] = route;
    else state.routes.push(route);
    log("Office", "Route geïmporteerd", "Route", route.id, "Toegevoegd via route upload");
  });
  opslaan();
  notify(`${nieuw.length} route(s) geïmporteerd.`);
  ga("routes");
}

function downloadTemplate() {
  const headers = ["route_id","titel","datum","zone","start","eerste_stop","laatste_stop","laden","voertuig","laadklep","stops","km","uren","kg","verwacht_ex","omzet_ex","status","zichtbaarheid","notitie"];
  const rows = [
    ["MX-260701-001","Nieuwe route Oost","2026-07-01","Oost","Wijchen","Zwolle","Nijmegen","06:15","Bakwagen","Ja","17","420","10.5","780","650","790","open","open marketplace","Template voorbeeld"],
    ["MX-260701-002","Laadklep route Noord","2026-07-01","Noord","Wijchen","Assen","Groningen","06:30","Bakwagen laadklep","Ja","14","455","10.2","970","746","884","wacht op goedkeuring","geselecteerde charters","Zware route"]
  ];
  const csv = [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cargro-route-upload-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

bind = function() {
  origineleBindUploadPatch();
  const manual = document.getElementById("manualRouteForm");
  if (manual && !manual.dataset.bound) {
    manual.dataset.bound = "true";
    manual.addEventListener("submit", e => {
      e.preventDefault();
      const f = new FormData(manual);
      const voertuig = String(f.get("voertuig"));
      const route = {
        id: `MAN-${Date.now().toString().slice(-6)}`,
        titel: String(f.get("titel")),
        datum: String(f.get("datum")),
        zone: String(f.get("zone")),
        start: String(f.get("start")),
        eersteStop: String(f.get("eersteStop")),
        laatsteStop: String(f.get("laatsteStop")),
        laden: String(f.get("laden")),
        venster: `${String(f.get("laden"))} - later`,
        voertuig,
        laadruimte: voertuig.toLowerCase().includes("bakwagen") ? "420 × 210 × 220 cm" : "370 × 178 × 190 cm",
        laadklep: voertuig.toLowerCase().includes("laadklep") ? "Ja" : "Nee",
        stops: Number(f.get("stops")) || 0,
        km: Number(f.get("km")) || 0,
        uren: Number(f.get("uren")) || 0,
        kg: Number(f.get("kg")) || 0,
        vereist: "Steekwagen",
        verwachtEx: Number(f.get("verwachtEx")) || 0,
        omzetEx: Number(f.get("omzetEx")) || 0,
        status: String(f.get("status")),
        aanvraagStatus: String(f.get("status")) === "wacht op goedkeuring" ? "te beoordelen" : "gepubliceerd",
        toegewezenAan: String(f.get("charter")) || "",
        bron: "Handmatig",
        factuurStatus: String(f.get("status")) === "toegewezen" ? "te factureren" : "niet toegewezen",
        uitvoering: String(f.get("status")) === "toegewezen" ? "route toegewezen" : "open voor aanvragen",
        zichtbaarheid: String(f.get("status")) === "open" ? "open marketplace" : "intern",
        notitie: String(f.get("notitie"))
      };
      state.routes.push(route);
      log("Office", "Route handmatig toegevoegd", "Route", route.id, "Toegevoegd via route upload");
      opslaan();
      notify("Route toegevoegd.");
      ga("routes");
    });
  }
  const file = document.getElementById("routeUploadFile");
  const btn = document.getElementById("importRoutesBtn");
  const preview = document.getElementById("uploadPreview");
  if (file && btn && !btn.dataset.bound) {
    btn.dataset.bound = "true";
    file.addEventListener("change", () => {
      preview.textContent = file.files?.[0] ? `Geselecteerd: ${file.files[0].name}` : "Nog geen bestand geselecteerd.";
    });
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const f = file.files?.[0];
      if (!f) { notify("Kies eerst een CSV of Excel bestand."); return; }
      const naam = f.name.toLowerCase();
      if (naam.endsWith(".csv")) {
        const tekst = await f.text();
        importeerRoutesUitRijen(csvNaarObjecten(tekst));
        return;
      }
      if ((naam.endsWith(".xlsx") || naam.endsWith(".xls")) && window.XLSX) {
        const buffer = await f.arrayBuffer();
        const wb = XLSX.read(buffer, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });
        importeerRoutesUitRijen(rows);
        return;
      }
      notify("Excel parser niet geladen. Gebruik CSV of ververs de pagina.");
    });
  }
};

const origineleActieUploadPatch = actie;
actie = function(e, act, id, role) {
  if (act === "downloadTemplate") { e.preventDefault(); downloadTemplate(); return; }
  origineleActieUploadPatch(e, act, id, role);
};

render();
