// Patch: landing login scroll + mobile menu/content scroll behavior.
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

  function scrollToMainContent(){
    if(!window.matchMedia || !window.matchMedia('(max-width: 900px)').matches) return;
    setTimeout(() => {
      const target = document.querySelector('.main') || document.querySelector('main') || document.getElementById('app');
      if(!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - 6;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }, 160);
  }

  document.addEventListener('click', function(e){
    if(e.target.closest('[data-view]')) scrollToMainContent();

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
    @media (max-width: 900px) {
      .sidebar { padding-bottom: 12px !important; }
      .sidebar .brand-card p,
      .sidebar .control-room-context,
      .sidebar .sidebar-note { display: none !important; }
      .sidebar .brand-card { padding: 12px !important; }
      .sidebar .brand-row { align-items: center !important; }
      .sidebar .logo { width: 42px !important; height: 42px !important; }
      .sidebar .nav-group-title { margin: 14px 4px 8px !important; }
      .sidebar .nav-btn {
        min-height: 48px !important;
        padding: 9px 10px !important;
      }
      .sidebar .nav-left { gap: 8px !important; }
      .sidebar .nav-code {
        width: 34px !important;
        min-width: 34px !important;
        height: 34px !important;
        font-size: 13px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();