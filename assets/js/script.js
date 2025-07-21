// Only non-sidebar/topbar JS remains in this file.
// ... keep Choices.js and other unrelated logic ...

// Initialize Choices.js on all select fields after dynamic content is loaded
function setupChoicesSelects() {
  if (window.Choices) {
    document.querySelectorAll('select').forEach(function(select) {
      if (!select.classList.contains('choices-initialized')) {
        new Choices(select, {
          searchEnabled: false,
          itemSelectText: '',
          shouldSort: false,
          position: 'auto',
          classNames: {
            containerOuter: 'choices custom-choices',
          }
        });
        select.classList.add('choices-initialized');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Load sidebar
  fetch('/project/assets/partials/backoffice-sidebar.html')
    .then(res => res.text())
    .then(html => {
      const sidebar = document.getElementById('sidebar-container');
      if (sidebar) sidebar.innerHTML = html;
    });
  // Load topbar
  fetch('/project/assets/partials/topbar.html')
    .then(res => res.text())
    .then(html => {
      const topbar = document.getElementById('topbar-container');
      if (topbar) topbar.innerHTML = html;
    });
  setupChoicesSelects();
});
