// Public Website Interactions & Auto-suggest Search (2026 Edition)
document.addEventListener('DOMContentLoaded', function() {
    // 1. Sticky Navbar Elevation on Scroll
    const mainNavbar = document.getElementById('mainNavbar');
    if (mainNavbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 40) {
                mainNavbar.classList.add('scrolled');
            } else {
                mainNavbar.classList.remove('scrolled');
            }
        });
    }

    // 2. Auto-suggest Search Bar
    const searchInput = document.getElementById('publicSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');

    if (searchInput && searchDropdown) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length < 2) {
                searchDropdown.style.display = 'none';
                return;
            }

            fetch(BASE_URL + 'api/search_services.php?q=' + encodeURIComponent(query))
                .then(res => res.json())
                .then(res => {
                    if (res.status && res.data.length > 0) {
                        let html = '';
                        res.data.forEach(item => {
                            html += `
                                <div class="search-item" onclick="window.location.href='${item.url}'">
                                    <div>
                                        <div class="fw-bold">${item.name}</div>
                                        <small class="text-muted">${item.category}</small>
                                    </div>
                                    <span class="badge bg-primary rounded-pill px-3 py-1">${item.price}</span>
                                </div>
                            `;
                        });
                        searchDropdown.innerHTML = html;
                        searchDropdown.style.display = 'block';
                    } else {
                        searchDropdown.innerHTML = '<div class="p-3 text-center text-muted">No matching services found</div>';
                        searchDropdown.style.display = 'block';
                    }
                })
                .catch(err => {
                    console.error('Search error:', err);
                });
        });

        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }
});

// 3. Command Card Tab Switcher
function switchCommandTab(tabName) {
    const btnServices = document.getElementById('cmdBtnServices');
    const btnLoans = document.getElementById('cmdBtnLoans');
    const paneServices = document.getElementById('cmdPaneServices');
    const paneLoans = document.getElementById('cmdPaneLoans');

    if (tabName === 'services') {
        btnServices.classList.add('active');
        btnLoans.classList.remove('active');
        paneServices.classList.add('active');
        paneLoans.classList.remove('active');
    } else {
        btnLoans.classList.add('active');
        btnServices.classList.remove('active');
        paneLoans.classList.add('active');
        paneServices.classList.remove('active');
    }
}

// 4. Custom Accordion Toggle Function
function toggleDusAccordion(id) {
    const body = document.getElementById('faqBody' + id);
    const icon = document.getElementById('faqIcon' + id);
    if (body) {
        if (body.style.display === 'block') {
            body.style.display = 'none';
            if (icon) icon.className = 'bi bi-chevron-down';
        } else {
            body.style.display = 'block';
            if (icon) icon.className = 'bi bi-chevron-up';
        }
    }
}
