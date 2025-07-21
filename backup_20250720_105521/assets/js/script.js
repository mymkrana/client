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
                    if (sidebarOverlay && sidebar) {
                        sidebarOverlay.onclick = function() {
                            if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
                                sidebar.classList.remove('open');
                                document.body.classList.remove('sidebar-mobile-open');
                            }
                        };
                    }
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
                console.log('Hamburger clicked! (fallback)');
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
    const currentPage = window.location.pathname.split('/').pop();
    
    // Remove all active classes first
    document.querySelectorAll('#sidebar nav a, #sidebar nav button').forEach(item => {
        item.classList.remove('active');
    });
    
    // Map current page to menu items
    const pageMenuMap = {
        // Admin pages
        'AdminDashboard.html': 'a[href="AdminDashboard.html"]',
        'AdminAllUsers.html': 'a[href="AdminAllUsers.html"]',
        'AdminCreateUsers.html': 'a[href="AdminCreateUsers.html"]',
        'AdminOrdersManagement.html': 'a[href="AdminOrdersManagement.html"]',
        'AdminReports.html': 'a[href="AdminReports.html"]',
        'AdminMasterDataUploadCommission.html': 'a[href="AdminMasterDataUploadCommission.html"]',
        
        // Affiliate pages
        'AffiliateDashboard.html': 'a[href="AffiliateDashboard.html"]',
        'AffiliateOrders.html': 'a[href="AffiliateOrders.html"]',
        'AffiliateProfile.html': 'a[href="AffiliateProfile.html"]',
        'AffiliateRegistration.html': 'a[href="AffiliateRegistration.html"]',
        'AffiliateRetailers.html': 'a[href="AffiliateRetailers.html"]',
        
        // Backoffice pages
        'BackofficeAllUsers.html': 'a[href="BackofficeAllUsers.html"]',
        'BackofficeCreateUsers.html': 'a[href="BackofficeCreateUsers.html"]',
        'BackofficeDashboard.html': 'a[href="BackofficeDashboard.html"]',
        'BackofficeReports.html': 'a[href="BackofficeReports.html"]'
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
