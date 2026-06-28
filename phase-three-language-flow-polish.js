(function () {
  const replacements = [
    [/Finance & disputes/g, "Facturen & disputes"],
    [/Finance/g, "Financien"],
    [/\bfinance\b/g, "financieel"],
    [/Mijn transporten/g, "Mijn routes"],
    [/read-only/g, "vast"],
    [/completed/g, "afgerond"],
    [/route performance/gi, "routeprestaties"],
    [/charter performance/gi, "charterprestaties"],
    [/profitability/gi, "rendement"],
    [/Marketplace/g, "Marktplaats"],
    [/\bmarketplace\b/g, "marktplaats"],
    [/GEM\. PAYOUT/g, "GEM. BETALING"],
    [/PAYOUT/g, "BETALING"],
    [/RATING/g, "SCORE"]
  ];

  const protectedAttrs = [
    ["data-view=\"finance\"", "__VIEW_FINANCE__"],
    ["data-view=\"charterfinance\"", "__VIEW_CHARTER_FINANCE__"],
    ["data-view=\"chartermarkt\"", "__VIEW_CHARTER_MARKT__"]
  ];

  function dutch(html) {
    let text = String(html);
    protectedAttrs.forEach(([original, token]) => {
      text = text.replaceAll(original, token);
    });
    text = replacements.reduce((current, [pattern, value]) => current.replace(pattern, value), text);
    protectedAttrs.forEach(([original, token]) => {
      text = text.replaceAll(token, original);
    });
    return text;
  }

  if (typeof navigatie === "function") {
    const navBeforeLanguagePolish = navigatie;
    navigatie = function () {
      return dutch(navBeforeLanguagePolish());
    };
  }

  if (typeof renderMain === "function") {
    const renderBeforeLanguagePolish = renderMain;
    renderMain = function () {
      if (state.view === "charterfinance") {
        return dutch(invoices() + disputes());
      }
      if (state.view === "finance") {
        return dutch(invoices() + disputes());
      }
      if (state.view === "chartermarkt") {
        state.view = "routes";
        const html = renderBeforeLanguagePolish();
        state.view = "chartermarkt";
        return dutch(html);
      }
      if (state.view === "mijntransporten") {
        state.view = "assigned";
        const html = renderBeforeLanguagePolish();
        state.view = "mijntransporten";
        return dutch(html);
      }
      return dutch(renderBeforeLanguagePolish());
    };
  }

  if (typeof render === "function") render();
})();
