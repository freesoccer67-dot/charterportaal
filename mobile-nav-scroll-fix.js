(function(){
  function isMobile(){ return window.matchMedia('(max-width: 900px)').matches; }
  function scrollToContent(){
    if(!isMobile()) return;
    window.setTimeout(function(){
      var main = document.querySelector('.main') || document.querySelector('main') || document.getElementById('app');
      if(!main) return;
      var top = main.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 80);
  }
  document.addEventListener('click', function(e){
    var target = e.target.closest('[data-view]');
    if(!target) return;
    scrollToContent();
  }, true);
  var oldGa = window.ga;
  if(typeof oldGa === 'function' && !oldGa._mobileScrollFix){
    window.ga = function(v){
      oldGa(v);
      scrollToContent();
    };
    window.ga._mobileScrollFix = true;
  }
})();
