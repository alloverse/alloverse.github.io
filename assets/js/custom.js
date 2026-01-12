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
