// ===== DYNAMICALLY LOAD SIDEBAR AND TOPBAR =====
function loadComponent(id, url) {
    const container = document.getElementById(id);
    if (container) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                container.innerHTML = html;

                // Sidebar submenu toggle after sidebar is loaded
                if (id === 'sidebar-container') {
                    // Always close all submenus by default
                    document.querySelectorAll('.sidebar-submenu').forEach(function(submenu) {
                        submenu.classList.remove('open');
                    });

                    // Mark active menu item based on current page
                    markActiveMenuItem();

                    // Event delegation for submenu toggle
                    const sidebarNav = document.querySelector('#sidebar nav');
                    if (sidebarNav) {
                        sidebarNav.addEventListener('click', function(e) {
                            const toggle = e.target.closest('.sidebar-group-toggle');
                            if (toggle) {
                                const group = toggle.closest('.sidebar-group');
                                const submenu = group.querySelector('.sidebar-submenu');
                                const arrow = toggle.querySelector('.sidebar-group-arrow');
                                if (submenu) submenu.classList.toggle('open');
                                if (arrow) arrow.classList.toggle('open');
                            }
                        });
                    }

                    // Overlay click closes sidebar on mobile
                    const sidebarOverlay = document.querySelector('.sidebar-overlay');
                    const sidebar = document.getElementById('sidebar');
                    if (sidebarOverlay && sidebar) {
                        sidebarOverlay.onclick = function() {
                            if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
                                sidebar.classList.remove('open');
                                document.body.classList.remove('sidebar-mobile-open');
                            }
                        };
                    }
                }

                // Setup user dropdown after topbar is loaded
                if (id === 'topbar-container') {
                    setupUserDropdownMenu();
                }
            });
    }
}

// ===== INITIALIZE WHEN DOM IS LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    // Determine which sidebar to load based on current page
    const currentPage = window.location.pathname.split('/').pop();
    let sidebarPath = '/project/assets/partials/sidebar.html'; // Default admin sidebar
    if (currentPage && currentPage.startsWith('Affiliate')) {
        sidebarPath = '/project/assets/partials/affiliate-sidebar.html';
    } else if (currentPage && currentPage.startsWith('Backoffice')) {
        sidebarPath = '/project/assets/partials/backoffice-sidebar.html';
    }
    loadComponent('sidebar-container', sidebarPath);
    loadComponent('topbar-container', '/project/assets/partials/topbar.html');
});

// FINAL FALLBACK: Ensure hamburger event always attaches
// (in case of dynamic loading/timing issues)
document.addEventListener('DOMContentLoaded', function() {
    function attachHamburger() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('sidebar');
        const mainContainer = document.querySelector('.main-container');
        if (sidebarToggle && sidebar && mainContainer) {
            sidebarToggle.onclick = null;
            sidebarToggle.addEventListener('click', function(e) {
                e.preventDefault();
                mainContainer.classList.toggle('sidebar-collapsed');
                if (window.innerWidth < 768) {
                    sidebar.classList.toggle('open');
                    if (sidebar.classList.contains('open')) {
                        document.body.classList.add('sidebar-mobile-open');
                    } else {
                        document.body.classList.remove('sidebar-mobile-open');
                    }
                }
            });
        } else {
            setTimeout(attachHamburger, 200);
        }
    }
    attachHamburger();
});

// ===== MARK ACTIVE MENU ITEM =====
function markActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    // Remove all active classes first
    document.querySelectorAll('#sidebar nav a, #sidebar nav button').forEach(item => {
        item.classList.remove('active');
    });
    // Map current page to menu items (all keys lowercase)
    const pageMenuMap = {
        // Admin pages (current file names)
        'dashboard.html': 'a[href="dashboard.html"]',
        'allusers.html': 'a[href="allusers.html"]',
        'createusers.html': 'a[href="createusers.html"]',
        'ordersmanagement.html': 'a[href="ordersmanagement.html"]',
        'reports.html': 'a[href="reports.html"]',
        'masterdatauploadcommission.html': 'a[href="masterdatauploadcommission.html"]',
        // Affiliate pages
        'affiliatedashboard.html': 'a[href="AffiliateDashboard.html"]',
        'affiliateorders.html': 'a[href="AffiliateOrders.html"]',
        'affiliateprofile.html': 'a[href="AffiliateProfile.html"]',
        'affiliateregistration.html': 'a[href="AffiliateRegistration.html"]',
        'affiliateretailers.html': 'a[href="AffiliateRetailers.html"]',
        // Backoffice pages
        'backofficeallusers.html': 'a[href="BackofficeAllUsers.html"]',
        'backofficecreateusers.html': 'a[href="BackofficeCreateUsers.html"]',
        'backofficedashboard.html': 'a[href="BackofficeDashboard.html"]',
        'backofficereports.html': 'a[href="BackofficeReports.html"]',
    };
    // Find and mark the active menu item
    const activeSelector = pageMenuMap[currentPage];
    if (activeSelector) {
        const activeItem = document.querySelector(`#sidebar nav ${activeSelector}`);
        if (activeItem) {
            activeItem.classList.add('active');
            // If it's a submenu item, open the parent submenu
            const parentSubmenu = activeItem.closest('.sidebar-submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('open');
                const arrow = parentSubmenu.previousElementSibling?.querySelector('.sidebar-group-arrow');
                if (arrow) arrow.classList.add('open');
            }
        }
    }
}

// User profile dropdown toggle
function setupUserDropdownMenu() {
  const profileBtn = document.getElementById('user-profile-btn');
  const dropdown = document.getElementById('user-dropdown-menu');
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setupUserDropdownMenu();
}); 