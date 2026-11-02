document.addEventListener('DOMContentLoaded', function() {
  // scroll active site nav item into view if it's not visible
  const siteNav = document.getElementById('site-nav');
  const active = siteNav.querySelector('.nav-list-link.active');
  if (active) {
    if (active.getBoundingClientRect().bottom > siteNav.getBoundingClientRect().bottom) {
      active.scrollIntoView();
    }
  }
});

// Alloverse 2 notice, same as on alloverse.com
document.addEventListener('DOMContentLoaded', function() {
  var host = document.getElementById('main-content');
  if (host) host.insertAdjacentHTML('afterbegin', '<aside class="allo2-notice allo2-card" role="note"><h2 class="allo2-title">Alloverse 1 is retired</h2><p>Alloverse 1 is no longer maintained. Its public places went offline in June 2023, when we <a href="https://alloverse.com/2023/06/08/commercial-operations-taking-a-break/">paused commercial operations</a>.</p><p>Alloverse 2 is in active development. You can try it from source in <a href="https://github.com/alloverse/allonet2">allonet2 on GitHub</a>, but it isn\'t supported yet. (It\'s what <a href="https://koja.works">koja.works</a> is built on, by the way.)</p></aside>');
});
