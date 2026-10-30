/* BIOPATH MOTION LAYER */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function(){

    /* 1. Hero title: words rise out of a mask */
    var t = document.querySelector('.hero-title');
    if (t && !t.children.length && !reduce) {
      var words = t.textContent.trim().split(/\s+/);
      t.setAttribute('aria-label', words.join(' '));
      t.innerHTML = words.map(function(w,i){
        return '<span class="w" aria-hidden="true"><span style="--i:'+i+'">'+w+'</span></span>';
      }).join(' ');
    }

    /* 2. Scroll progress line */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    /* 3. Scroll reveals, staggered within each group */
    var sel = '.section-header,.block-title,.block-intro,.section-intro,.about-card,.stat-card,.degree-filter-bar,'+
      '.tab-buttons,.career-card,.program-card,.org-card,.compare-card,.sector-column,.job-card,.selection-card,'+
      '.notice-callout,.page-description,.controls-bar,.footer-content,.photo-frame';
    var els = document.querySelectorAll(sel);
    var counts = new Map();
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          var el = e.target; io.unobserve(el);
          el.classList.add('in');
          setTimeout(function(){ el.classList.remove('reveal','in'); el.style.removeProperty('--d'); }, 2300);
        });
      }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
      els.forEach(function(el){
        var p = el.parentElement, n = counts.get(p) || 0; counts.set(p, n+1);
        el.style.setProperty('--d', (n % 4) * 0.09 + 's');
        el.classList.add('reveal'); io.observe(el);
      });
    }

    /* 4. Count-up numbers (e.g. "18+") */
    var nums = document.querySelectorAll('.stat-number');
    if (!reduce && 'IntersectionObserver' in window) {
      var co = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          var el = e.target; co.unobserve(el);
          var m = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/);
          if (!m) return;
          var end = +m[2], start = performance.now(), dur = 1400;
          (function tick(now){
            var p = Math.min((now-start)/dur, 1), v = Math.round(end*(1-Math.pow(1-p,4)));
            el.textContent = m[1]+v+m[3];
            if (p < 1) requestAnimationFrame(tick);
          })(start);
        });
      }, {threshold:.6});
      nums.forEach(function(n){ co.observe(n); });
    }

    /* 5. Scroll-linked: progress bar + gentle image parallax */
    var imgs = document.querySelectorAll('.photo-frame img'), ticking = false;
    function onScroll(){
      var h = document.documentElement, max = h.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? scrollY/max : 0) + ')';
      if (!reduce) imgs.forEach(function(img){
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var k = (r.top + r.height/2 - innerHeight/2) / innerHeight;
        img.style.transform = 'scale(1.14) translateY(' + (k * -28) + 'px)';
      });
      ticking = false;
    }
    addEventListener('scroll', function(){ if (!ticking){ ticking = true; requestAnimationFrame(onScroll); } }, {passive:true});
    onScroll();

    /* 6. Fade out before navigating to another BioPath page */
    document.addEventListener('click', function(e){
      var a = e.target.closest('a[href]');
      if (!a || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      var u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname === location.pathname || !/\.html$/.test(u.pathname)) return;
      e.preventDefault();
      document.body.classList.add('leaving');
      setTimeout(function(){ location.href = a.href; }, 260);
    });
    addEventListener('pageshow', function(){ document.body.classList.remove('leaving'); });
  });
})();
