const baseNav = navigatie;
const baseMain = renderMain;
const baseAction = actie;
const baseRender = render;
const baseLanding = landing;

function zonderHero(html){
  if(!html || !html.startsWith('<section class="hero"')) return html || '';
  const einde = html.indexOf('</section>');
  return einde >= 0 ? html.slice(einde + 10) : html;
}
function sectie(titel, tekst, inhoud){
  return `<section class="module-section"><div class="section-head"><div><h2>${titel}</h2><p>${tekst}</p></div></div>${inhoud}</section>`;
}
function navKnop(view, code, label, count){
  return `<button class="nav-btn ${state.view===view?'active':''}" data-view="${view}"><span class="nav-left"><span class="nav-code">${code}</span>${label}</span>${count?`<span class="badge-count">${count}</span>`:''}</button>`;
}

navigatie = function(){
  const approvals = state.aanvragen.filter(a=>a.status==='te beoordelen').length;
  const disputesOpen = state.disputes.filter(d=>d.status!=='afgerond').length;
  const docsOpen = state.documenten.filter(d=>d.status!=='goedgekeurd').length;
  const unread = state.meldingen.filter(m=>m.status==='ongelezen' && (state.role==='office'?m.doelgroep==='office':m.charter===huidigeCharter())).length;
  const office = [['dashboard','DB','Dashboard'],['routebeheer','RB','Routebeheer',approvals],['operatie','OP','Operatie'],['netwerk','NW','Charters & documenten',docsOpen],['finance','FN','Finance & disputes',disputesOpen],['analyse','AN','Analyse & audit',unread]];
  const charter = [['dashboard','DB','Dashboard'],['chartermarkt','MK','Marketplace',approvals],['mijntransporten','TR','Mijn transporten'],['charterprofiel','PR','Profiel & documenten',docsOpen],['charterfinance','FN','Finance & disputes',disputesOpen],['analyse','AN','Meldingen & test',unread]];
  const lijst = state.role==='office'?office:charter;
  return `<aside class="sidebar"><div class="brand-card"><div class="brand-row"><div class="logo">CG</div><div><div class="brand-title">Cargro Charterportaal</div><div class="brand-sub">${state.source==='supabase'?'Supabase testdata':'Lokale testdata'}</div></div></div><p>Gecombineerde modules voor routebeheer, operatie, netwerk, finance en analyse.</p></div><button class="btn ghost full" data-act="logout" style="margin-top:14px">Terug naar voorpagina</button>${state.role==='charter'?`<div class="field" style="margin:14px 0"><label>Charter</label><select id="charterSelect">${state.charters.map(c=>`<option ${c.bedrijf===huidigeCharter()?'selected':''}>${c.bedrijf}</option>`).join('')}</select></div>`:''}<div class="nav-group-title">Modules</div>${lijst.map(i=>navKnop(i[0],i[1],i[2],i[3])).join('')}</aside>`;
};

function mendrixPanel(){
  return `<div class="card soft-blue"><div class="card-title">MendriX statuskoppeling</div><p>POD blijft in MendriX. Deze portal hoeft dus geen aparte POD-upload te hebben. De gewenste flow: zodra een rit in MendriX wordt beëindigd, wordt de route hier automatisch <strong>afgerond</strong>.</p>${tabel(['MendriX event','Portal actie','Status'],[['Rit gestart','Route naar onderweg',status('concept')],['Rit beëindigd','Route naar afgerond',status('klaar voor API')],['POD in MendriX','Alleen referentie tonen',status('geen upload nodig')]])}</div>`;
}

function routebeheer(){
  return hero('Routebeheer','Upload routes, beheer marketplace-routes en beoordeel aanvragen in één hoofdmodule.',`${btn('Routes bekijken','routes','primary')} ${btn('Goedkeuring','approval','orange')}`)+
    sectie('Route upload','CSV/Excel import of handmatig één route aanmaken.', typeof upload==='function'?zonderHero(upload()):'<div class="empty">Uploadmodule niet beschikbaar.</div>')+
    sectie('Marketplace & routes','Open, toegewezen en te beoordelen routes.',`<div class="grid two">${state.routes.filter(zichtbaar).map(routeKaart).join('')}</div>`)+
    sectie('Aanvragen en hogere aanbiedingen','Aanvragen blijven gekoppeld aan de originele route.',zonderHero(approval()));
}
function operatie(){
  const ritten = state.role==='office'?state.routes:state.routes.filter(r=>r.toegewezenAan===huidigeCharter());
  const kaarten = ritten.map(r=>`<div class="card"><div class="card-title">${r.id} · ${r.titel} ${status(r.uitvoering)}</div><p>${r.start} → ${r.eersteStop} → ${r.laatsteStop}</p>${tabel(['Stap','Status','Actor','Tijd','Notitie'],state.events.filter(e=>e.routeId===r.id).map(e=>[e.stap,status(e.status),e.actor,e.tijd,e.notitie]))}<div class="hero-actions"><button class="btn primary small" data-act="markLoaded" data-id="${r.id}">Laden bevestigd</button><button class="btn green small" data-act="mendrixComplete" data-id="${r.id}">MendriX rit afgerond</button></div></div>`).join('');
  return hero('Operatie','Uitvoering, laadplanning en MendriX-statussync gecombineerd in één module.',`${btn('Routebeheer','routebeheer','primary')} ${btn('Finance','finance','orange')}`)+
    `<div class="grid two">${mendrixPanel()}<div class="card soft-green"><div class="card-title">Operationele flow</div>${stappen([['Route toegewezen','Planning of marketplace wijst route toe.'],['Laden bevestigd','Warehouse of charter bevestigt laden.'],['Onderweg','Later mogelijk vanuit MendriX status.'],['Afgerond','Automatisch wanneer MendriX-rit eindigt.']])}</div></div>`+
    sectie('Transporten','Status per toegewezen rit.',`<div class="grid two">${kaarten}</div>`)+
    sectie('Laadplanning','Tijdslots per dock, voertuigtype, route en status.',zonderHero(loading()));
}
function netwerk(){
  return hero('Charters & documenten','Charterbeheer, voertuiggegevens en documentcontrole gecombineerd.',`${btn('Routebeheer','routebeheer','primary')} ${btn('Analyse','analyse','orange')}`)+
    sectie('Charters','Status, zones, rating, documenten en weekwaarde.',zonderHero(charters()))+
    sectie('Document center','NIWO, verzekering, voertuigdocumenten en vervaldatum.',zonderHero(documents()));
}
function finance(){
  return hero('Finance & disputes','Weekstaten, factuurcontrole en disputes gecombineerd.',`${btn('Routebeheer','routebeheer','primary')} ${btn('Analyse','analyse','orange')}`)+
    sectie('Facturen','Verwachte betaling versus factuurbedrag, excl. en incl. btw.',zonderHero(invoices()))+
    sectie('Disputes','Gewicht, wachttijd, schade, routeafwijking en factuurverschillen.',zonderHero(disputes()));
}
function analyse(){
  return hero(state.role==='office'?'Analyse & audit':'Meldingen & test','Meldingen, testplan, performance en auditlog samengebracht.')+
    sectie('Meldingen','Belangrijke acties en signalen.',zonderHero(notifications()))+
    (state.role==='office'?sectie('Performance','Betrouwbaarheid en score per charter.',zonderHero(performance())):'')+
    (state.role==='office'?sectie('Auditlog','Wie deed wat, wanneer en waarom.',zonderHero(audit())):'')+
    sectie('Testplan','Workflow voor eerste validatie.',zonderHero(testing()));
}
function chartermarkt(){ return hero('Marketplace','Beschikbare routes en mijn aanvragen gecombineerd.')+sectie('Beschikbare routes','Routes aanvragen of hoger aanbod doen.',`<div class="grid two">${state.routes.filter(zichtbaar).filter(r=>r.status==='open').map(routeKaart).join('')||'<div class="empty">Geen open routes.</div>'}</div>`)+sectie('Mijn aanvragen','Aanvragen en hogere aanbiedingen.',zonderHero(requests())); }
function mijntransporten(){ return hero('Mijn transporten','Toegewezen routes en uitvoering. POD blijft in MendriX.')+sectie('Mijn routes','Toegewezen routes met vaste verwachte betaling.',zonderHero(assigned()))+sectie('Uitvoering','Laden bevestigen en MendriX rit einde simuleren.',zonderHero(operatie())); }
function charterprofiel(){ return hero('Profiel & documenten','Voertuigen en documenten in één profiel.')+sectie('Mijn voertuigen','Voertuigmaten, laadvermogen en laadklep.',zonderHero(vehicles()))+sectie('Mijn documenten','Documentstatus en vervaldatum.',zonderHero(documents())); }
function charterfinance(){ return hero('Finance & disputes','Facturen en disputes gecombineerd.')+sectie('Facturen','Factuurbedrag vergelijken met vaste verwachte betaling.',zonderHero(invoices()))+sectie('Disputes','Route- of factuurafwijkingen.',zonderHero(disputes())); }

renderMain = function(){
  const grouped = {routebeheer,operatie,netwerk,finance,analyse,chartermarkt,mijntransporten,charterprofiel,charterfinance};
  if(grouped[state.view]) return grouped[state.view]();
  if(['routes','upload','approval'].includes(state.view)) return routebeheer();
  if(['execution','loading'].includes(state.view)) return operatie();
  if(['charters','documents','vehicles'].includes(state.view)) return state.role==='office'?netwerk():charterprofiel();
  if(['invoices','disputes'].includes(state.view)) return state.role==='office'?finance():charterfinance();
  if(['performance','notifications','audit','testing'].includes(state.view)) return analyse();
  return baseMain();
};

landing = function(){ return baseLanding().replaceAll('POD','MendriX status'); };
actie = function(e,act,id,role){
  if(act==='pod') act='mendrixComplete';
  if(act==='mendrixComplete'){
    e.preventDefault();
    const r=state.routes.find(x=>x.id===id);
    if(r){ r.status='afgerond'; r.uitvoering='afgerond via MendriX'; state.events.push({id:`EV-${Date.now().toString().slice(-5)}`,routeId:id,stap:'MendriX rit afgerond',status:'afgerond',actor:'MendriX sync',zichtbaar:true,tijd:new Date().toLocaleString('nl-NL'),notitie:'Gesimuleerd webhook-event: rit beëindigd in MendriX.'}); log('MendriX sync','Rit afgerond','Route',id,'Route automatisch bijgewerkt vanuit MendriX status'); opslaan(); notify('Route afgerond via MendriX status.'); render(); }
    return;
  }
  baseAction(e,act,id,role);
};

render = function(){
  const old = document.querySelector('.sidebar')?.scrollTop || window.__cargroSidebarScroll || 0;
  baseRender();
  setTimeout(()=>{ const s=document.querySelector('.sidebar'); if(s) s.scrollTop=old; },0);
};
document.addEventListener('scroll',()=>{ const s=document.querySelector('.sidebar'); if(s) window.__cargroSidebarScroll=s.scrollTop; },true);
render();
