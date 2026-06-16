// public/js/navbar.js
function renderNavbar() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let links = [];
    if (!token) {
        // Non loggato
        links = [
            { href: 'index.html', key: 'home' },
            { href: 'login.html', key: 'login' },
            { href: 'support.html', key: 'support' },
            { href: 'tabellone.html', key: 'tabellone' },
            { href: 'train-status.html', key: 'status' }
        ];
    } else {
        // Loggato
        if (role === 'administrator') {
            links = [
                { href: 'admin.html', key: 'admin' },
                { href: 'notifications.html', key: 'notifications' },
                { href: '#', key: 'logout', action: 'logout' }
            ];
        } else if (role === 'inspector') {
            links = [
                { href: 'inspector.html', key: 'inspector' },
                { href: 'notifications.html', key: 'notifications' },
                { href: '#', key: 'logout', action: 'logout' }
            ];
        } else {
            // Utente normale (passeggero)
            links = [
                { href: 'index.html', key: 'home' },
                { href: 'dashboard.html', key: 'dashboard' },
                { href: 'purchase.html', key: 'purchase' },
                { href: 'subscription.html', key: 'subscription' },
                { href: 'train-status.html', key: 'status' },
                { href: 'tabellone.html', key: 'tabellone' },
                { href: 'notifications.html', key: 'notifications' },
                { href: 'support.html', key: 'support' },
                { href: '#', key: 'logout', action: 'logout' }
            ];
        }
    }

    let html = '<nav style="display: flex; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid #ddd; padding-bottom: 12px; flex-wrap: wrap; align-items: center;">';
    for (const link of links) {
        if (link.action === 'logout') {
            html += `<a href="#" onclick="logout()" data-i18n="${link.key}">${link.key}</a>`;
        } else {
            html += `<a href="${link.href}" data-i18n="${link.key}">${link.key}</a>`;
        }
    }
    html += `
        <div class="lang-selector" style="margin-left: auto;">
            <select id="langSelect">
                <option value="it">🇮🇹 IT</option>
                <option value="en">🇬🇧 EN</option>
                <option value="de">🇩🇪 DE</option>
            </select>
        </div>
    </nav>`;
    nav.innerHTML = html;

    // Inizializza il selettore lingua
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const currentLang = localStorage.getItem('lang') || 'it';
        langSelect.value = currentLang;
        langSelect.addEventListener('change', function(e) {
            const lang = e.target.value;
            localStorage.setItem('lang', lang);
            if (typeof setLanguage === 'function') {
                setLanguage(lang);
            } else {
                location.reload();
            }
        });
    }

    // Applica le traduzioni ai nuovi elementi
    if (typeof setLanguage === 'function') {
        setLanguage(localStorage.getItem('lang') || 'it');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).catch(() => {});
    window.location.href = 'index.html';
}