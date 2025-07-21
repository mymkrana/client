// RedCloud Affiliate Management System - Main JavaScript File

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
                    // Set active class on sidebar links
                    var currentPage = window.location.pathname.split('/').pop();
                    document.querySelectorAll('.sidebar-nav .nav-link').forEach(function(link) {
                        link.classList.remove('active');
                        if (link.getAttribute('href') && link.getAttribute('href').indexOf(currentPage) !== -1) {
                            link.classList.add('active');
                            // If it's a submenu link, also open its parent submenu
                            var submenu = link.closest('.sidebar-submenu');
                            if (submenu) {
                                submenu.classList.add('open');
                                var group = submenu.closest('.sidebar-group');
                                if (group) {
                                    var arrow = group.querySelector('.sidebar-group-arrow');
                                    if (arrow) arrow.classList.add('open');
                                }
                            }
                        }
                    });
                    // Hamburger/overlay logic for both mobile and desktop
                    const sidebarToggle = document.getElementById('sidebar-toggle');
                    const sidebar = document.getElementById('sidebar');
                    const mainContainer = document.querySelector('.main-container');
                    const sidebarOverlay = document.querySelector('.sidebar-overlay');
                    if (sidebarToggle && sidebar && mainContainer) {
                        sidebarToggle.onclick = null;
                        sidebarToggle.addEventListener('click', function(e) {
                            e.preventDefault();
                            // Desktop: toggle sidebar-collapsed
                            mainContainer.classList.toggle('sidebar-collapsed');
                            // Mobile: toggle .open and overlay
                            if (window.innerWidth < 768) {
                                sidebar.classList.toggle('open');
                                if (sidebar.classList.contains('open')) {
                                    document.body.classList.add('sidebar-mobile-open');
                                } else {
                                    document.body.classList.remove('sidebar-mobile-open');
                                }
                            }
                        });
                    }
                    // Overlay click closes sidebar on mobile
                    if (sidebarOverlay && sidebar) {
                        sidebarOverlay.onclick = function() {
                            if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
                                sidebar.classList.remove('open');
                                document.body.classList.remove('sidebar-mobile-open');
                            }
                        };
                    }
                }
                // User profile dropdown after topbar is loaded
                if (id === 'topbar-container') {
                    const profileBtn = document.getElementById('user-profile-btn');
                    const dropdownMenu = document.getElementById('user-dropdown-menu');
                    if (profileBtn && dropdownMenu) {
                        function closeDropdown(e) {
                            if (!dropdownMenu.contains(e.target) && e.target !== profileBtn) {
                                dropdownMenu.classList.add('hidden');
                                document.removeEventListener('click', closeDropdown);
                            }
                        }
                        profileBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            dropdownMenu.classList.toggle('hidden');
                            if (!dropdownMenu.classList.contains('hidden')) {
                                setTimeout(() => {
                                    document.addEventListener('click', closeDropdown);
                                }, 0);
                            }
                        });
                    }
                }
            });
    }
}

// ===== FORM VALIDATION =====
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    // Email validation
    const emailInputs = formElement.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (input.value && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        }
    });

    // Phone number validation (Nigerian format)
    const phoneInputs = formElement.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value && !isValidPhone(input.value)) {
            showError(input, 'Please enter a valid phone number');
            isValid = false;
        }
    });

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Nigerian phone number validation
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showError(input, message) {
    clearError(input);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#dc2626';
}

function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '#d1d5db';
}

// ===== FILE UPLOAD HANDLING =====
function handleFileUpload(input, previewElement) {
    const file = input.files[0];
    if (file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG)');
            input.value = '';
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            input.value = '';
            return;
        }

        // Show preview
        if (previewElement) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }

        // Enable submit button if it was disabled
        const submitBtn = input.closest('form').querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.disabled) {
            submitBtn.disabled = false;
        }
    }
}

// ===== SEARCH AND FILTER FUNCTIONALITY =====
function initializeSearchAndFilter() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    const statusFilter = document.querySelector('select');
    const tableBody = document.querySelector('tbody');

    if (searchInput && tableBody) {
        searchInput.addEventListener('input', filterTable);
    }

    if (statusFilter && tableBody) {
        statusFilter.addEventListener('change', filterTable);
    }
}

function filterTable() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    const statusFilter = document.querySelector('select');
    const tableBody = document.querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const statusTerm = statusFilter ? statusFilter.value.toLowerCase() : '';

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusCell = row.querySelector('.status-badge');
        const status = statusCell ? statusCell.textContent.toLowerCase() : '';

        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const matchesStatus = !statusTerm || statusTerm === 'all statuses' || status.includes(statusTerm);

        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

// ===== TABLE SORTING =====
function initializeTableSorting() {
    const tableHeaders = document.querySelectorAll('th[data-sortable]');
    
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            const direction = header.dataset.direction === 'asc' ? 'desc' : 'asc';
            
            // Update all headers
            tableHeaders.forEach(h => h.dataset.direction = '');
            header.dataset.direction = direction;
            
            sortTable(column, direction);
        });
    });
}

function sortTable(column, direction) {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td[data-column="${column}"]`).textContent;
        const bValue = b.querySelector(`td[data-column="${column}"]`).textContent;
        
        if (direction === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
}

// ===== MODAL FUNCTIONALITY =====
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        hideModal(e.target.id);
    }
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '0.5rem';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.maxWidth = '300px';
    notification.style.wordWrap = 'break-word';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// ===== FORM SUBMISSION HANDLING =====
function handleFormSubmission(formElement, successMessage = 'Form submitted successfully!') {
    if (validateForm(formElement)) {
        // Show loading state
        const submitBtn = formElement.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification(successMessage, 'success');
            formElement.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 2000);
    }
}

// ===== DROPDOWN FUNCTIONALITY =====
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('show');
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.remove('show');
            }
        });
    });
}

// ===== CHART INITIALIZATION (if using charts) =====
function initializeCharts() {
    // This would be used if you add chart libraries like Chart.js
    // Placeholder for chart initialization
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount, currency = '₦') {
    return `${currency}${parseFloat(amount).toLocaleString()}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG');
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PAGE SPECIFIC INITIALIZATION =====
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'Login.html':
            initializeLoginPage();
            break;
        case 'AffiliateRegistration.html':
            initializeRegistrationPage();
            break;
        case 'AdminAllUsers.html':
        case 'BackofficeAllUsers.html':
            initializeUserManagementPage();
            break;
        case 'AdminOrdersManagement.html':
            initializeOrderManagementPage();
            break;
        case 'AdminReports.html':
        case 'BackofficeReports.html':
            initializeReportsPage();
            break;
        default:
            // Initialize common functionality
            initializeCommonFeatures();
    }
}

function initializeLoginPage() {
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(loginForm, 'Login successful!');
        });
    }
}

function initializeRegistrationPage() {
    const registrationForm = document.querySelector('form');
    const selfieUpload = document.getElementById('selfie-upload');
    const sendOtpBtn = document.querySelector('.send-otp-btn');
    const otpContainer = document.getElementById('otp-container');
    const otpInput = document.getElementById('otp-input');
    const otpSuccess = document.getElementById('otp-success');
    const otpError = document.getElementById('otp-error');
    const otpTimer = document.getElementById('otp-timer');
    const otpResend = document.getElementById('otp-resend');

    let otpMock = '1234'; // Demo OTP
    let timerInterval = null;
    let timerSeconds = 30;

    function startOtpTimer() {
        timerSeconds = 30;
        otpTimer.style.display = 'inline';
        otpResend.style.display = 'none';
        otpTimer.textContent = `Resend in ${timerSeconds}s`;
        timerInterval = setInterval(() => {
            timerSeconds--;
            otpTimer.textContent = `Resend in ${timerSeconds}s`;
            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                otpTimer.style.display = 'none';
                otpResend.style.display = 'inline';
            }
        }, 1000);
    }

    function resetOtpUI() {
        otpInput.value = '';
        otpInput.disabled = false;
        otpSuccess.style.display = 'none';
        otpError.style.display = 'none';
        otpInput.style.borderColor = '';
    }

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(registrationForm, 'Registration submitted successfully!');
        });
    }

    if (selfieUpload) {
        selfieUpload.addEventListener('change', (e) => {
            handleFileUpload(e.target, null);
        });
    }

    if (sendOtpBtn && otpContainer && otpInput) {
        sendOtpBtn.addEventListener('click', function() {
            otpContainer.style.display = 'block';
            resetOtpUI();
            otpInput.focus();
            startOtpTimer();
        });
    }

    if (otpInput) {
        otpInput.addEventListener('input', function() {
            otpSuccess.style.display = 'none';
            otpError.style.display = 'none';
            otpInput.style.borderColor = '';
            if (otpInput.value.length === 4) {
                otpInput.disabled = true;
                setTimeout(() => {
                    if (otpInput.value === otpMock) {
                        otpSuccess.style.display = 'block';
                        otpError.style.display = 'none';
                        otpInput.style.borderColor = '#16a34a';
                    } else {
                        otpSuccess.style.display = 'none';
                        otpError.style.display = 'block';
                        otpInput.style.borderColor = '#dc2626';
                        otpInput.disabled = false;
                        otpInput.focus();
                    }
                }, 400);
            }
        });
    }

    if (otpResend) {
        otpResend.addEventListener('click', function(e) {
            e.preventDefault();
            resetOtpUI();
            startOtpTimer();
            otpInput.focus();
        });
    }
}

function initializeUserManagementPage() {
    initializeSearchAndFilter();
    initializeTableSorting();
}

function initializeOrderManagementPage() {
    initializeTableSorting();
}

function initializeReportsPage() {
    const reportForm = document.querySelector('form');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Report generated successfully!', 'success');
        });
    }
}

function initializeCommonFeatures() {
    initializeDropdowns();
    initializeCharts();
}

// ===== INITIALIZE WHEN DOM IS LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('sidebar-container', '/project/assets/partials/sidebar.html');
    loadComponent('topbar-container', '/project/assets/partials/topbar.html');
    initializePage();
    
    // Add any additional initialization here
    console.log('RedCloud Affiliate Management System initialized');
});

// === GUARANTEED OVERLAY CLICK HANDLER (with MutationObserver) ===
function attachSidebarOverlayHandler() {
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
attachSidebarOverlayHandler();

// Observe DOM changes to re-attach overlay handler if needed
const observer = new MutationObserver(attachSidebarOverlayHandler);
observer.observe(document.body, { childList: true, subtree: true });

// Also re-attach on window resize (in case of mobile/desktop switch)
window.addEventListener('resize', attachSidebarOverlayHandler);

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.RedCloud = {
    showNotification,
    validateForm,
    handleFormSubmission,
    formatCurrency,
    formatDate,
    showModal,
    hideModal
}; 