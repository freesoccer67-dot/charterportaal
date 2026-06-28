(function () {
  const replacements = [
    [/Finance & disputes/g, "Facturen & disputes"],
    [/Mijn transporten/g, "Mijn routes"],
    [/read-only/g, "vast"],
    [/completed/g, "afgerond"],
    [/route performance/gi, "routeprestaties"],
    [/charter performance/gi, "charterprestaties"],
    [/profitability/gi, "rendement"],
    [/finance/g, "financieel"],
    [/Marketplace/g, "Marktplaats"]
  ];

  function dutch(html) {
    return replacements.reduce((text, [pattern, value]) => String(text).replace(pattern, value), html);
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
