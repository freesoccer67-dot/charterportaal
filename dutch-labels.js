(function () {
  const replacements = new Map([
    ["Enterprise workflow prototype", "Werkproces prototype"],
    ["enterprise workflow prototype", "werkproces prototype"],
    ["Demo login", "Demo inloggen"],
    ["Charter login", "Charter inloggen"],
    ["Cargro Office / Planning", "Cargro planning / kantoor"],
    ["Office dashboard", "Planning dashboard"],
    ["Marketplace", "Route marktplaats"],
    ["Applicants per route", "Aanmeldingen per route"],
    ["Applicants kiezen", "Aanmeldingen kiezen"],
    ["applicants", "aanmeldingen"],
    ["Private marketplace", "Private route marktplaats"],
    ["Invoice matching", "Factuurcontrole"],
    ["Dispute control", "Disputebeheer"],
    ["Expected payout", "Verwachte uitbetaling"],
    ["Submitted invoices", "Ingediende facturen"],
    ["Dispute exposure", "Open dispute-bedrag"],
    ["Open routes", "Open routes"],
    ["Factuur checks", "Factuurcontrole"],
    ["mismatch monitor", "verschilcontrole"],
    ["approval nodig", "goedkeuring nodig"],
    ["apart behandelen", "apart behandelen"],
    ["Bulk routes importeren", "Routes bulk importeren"],
    ["System price", "Systeemprijs"],
    ["Higher bid", "Hoger bod"],
    ["Current price", "Huidige prijs"],
    ["Assign", "Toewijzen"],
    ["Reject", "Afwijzen"],
    ["Approve", "Goedkeuren"],
    ["Partial", "Gedeeltelijk"],
    ["Evidence", "Bewijs"],
    ["Close", "Sluiten"],
    ["Reply", "Reageren"],
    ["MendriX / CSV import", "MendriX / CSV import"],
    ["Routes direct publiceren", "Routes direct publiceren"],
    ["Meerdere charters per route", "Meerdere charters per route"],
    ["Acties aan beide kanten", "Acties aan beide kanten"]
  ]);

  function translateTextNodes(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      let text = node.nodeValue;
      replacements.forEach((to, from) => {
        text = text.split(from).join(to);
      });
      node.nodeValue = text;
    });
  }

  function applyDutchLabels() {
    translateTextNodes(document.body);
    document.documentElement.lang = "nl";
  }

  const originalRender = window.render;
  if (typeof originalRender === "function") {
    window.render = function () {
      originalRender.apply(this, arguments);
      applyDutchLabels();
    };
  }

  applyDutchLabels();
})();
