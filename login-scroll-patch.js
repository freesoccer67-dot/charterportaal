// Patch: make the landing-page 'Inloggen' button scroll to the login-choice area
// instead of immediately opening the Cargro Office login.
(function(){
  function textOf(el){ return (el && el.textContent ? el.textContent : '').replace(/\s+/g,' ').trim().toLowerCase(); }

  function findLoginChoiceTarget(){
    const preferred = document.querySelector('#login-keuze, #login-choice, [data-login-choice], .login-choice, .role-choice, .login-card-wrap, .login-shell');
    if(preferred) return preferred;

    const candidates = Array.from(document.querySelectorAll('section, div, main, article'));
    const target = candidates.find(el => {
      const txt = textOf(el);
      return txt.includes('cargro office') && txt.includes('charter portal');
    });
    return target || document.body;
  }

  function scrollToLoginChoice(){
    const target = findLoginChoiceTarget();
    if(target === document.body){
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('login-choice-highlight');
    setTimeout(() => target.classList.remove('login-choice-highlight'), 1600);
  }

  document.addEventListener('click', function(e){
    const btn = e.target.closest('button, a');
    if(!btn) return;

    const label = textOf(btn);
    const isLanding = !!document.querySelector('.landing-shell');
    const isActualLoginForm = !!btn.closest('.login-card, .login-card-wrap, .login-shell');
    const isTopLogin = label === 'inloggen' && isLanding && !isActualLoginForm;

    if(isTopLogin){
      e.preventDefault();
      e.stopImmediatePropagation();
      scrollToLoginChoice();
    }
  }, true);

  const style = document.createElement('style');
  style.textContent = `
    .login-choice-highlight {
      outline: 3px solid #2563eb !important;
      box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.12), 0 24px 60px rgba(37, 99, 235, 0.22) !important;
      border-radius: 28px !important;
      transition: box-shadow .25s ease, outline .25s ease;
    }
  `;
  document.head.appendChild(style);
})();
