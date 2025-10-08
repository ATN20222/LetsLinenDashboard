document.addEventListener('DOMContentLoaded', function handleMobileMenuSetup() {
    var barsIcon = document.querySelector('.bars-icon');
    var trigger = barsIcon ? (barsIcon.closest('a') || barsIcon) : null;
    if (!trigger) return;

    var body = document.body;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';

    // Create drawer
    var drawer = document.createElement('aside');
    drawer.className = 'side-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');

    // Drawer header with logo and close
    var header = document.createElement('div');
    header.className = 'side-drawer-header';

    var logoInNav = document.querySelector('nav img');
    var headerLogo = document.createElement('img');
    if (logoInNav && logoInNav.getAttribute('src')) {
        headerLogo.src = logoInNav.getAttribute('src');
        headerLogo.alt = logoInNav.getAttribute('alt') || 'logo';
    }

    var closeButton = document.createElement('button');
    closeButton.className = 'drawer-close';
    closeButton.setAttribute('aria-label', 'Close menu');
    closeButton.innerHTML = '&times;';

    header.appendChild(headerLogo);
    header.appendChild(closeButton);

    // Links list cloned from existing nav links
    var linksSource = document.querySelector('.nav-links');
    var linksList = document.createElement('ul');
    linksList.className = 'drawer-links';
    if (linksSource) {
        linksList.innerHTML = linksSource.innerHTML;
    }

    // Footer icons (clone from header icons without the bars icon)
    

    drawer.appendChild(header);
    drawer.appendChild(linksList);

    body.appendChild(overlay);
    body.appendChild(drawer);

    var lastFocusedElement = null;
    var focusableSelectors = 'a[href], button:not([disabled])';

    function openDrawer() {
        lastFocusedElement = document.activeElement;
        body.classList.add('menu-open');
        overlay.classList.add('open');
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        var firstLink = drawer.querySelector('a');
        if (firstLink) firstLink.focus();
        document.addEventListener('keydown', handleKeydown);
    }

    function closeDrawer() {
        body.classList.remove('menu-open');
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', handleKeydown);
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') {
            closeDrawer();
            return;
        }
        if (e.key === 'Tab') {
            var focusable = Array.prototype.slice.call(drawer.querySelectorAll(focusableSelectors));
            if (focusable.length === 0) return;
            var first = focusable[0];
            var last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);
    closeButton.addEventListener('click', closeDrawer);
    linksList.addEventListener('click', function (e) {
        var target = e.target;
        if (target && target.tagName === 'A') {
            closeDrawer();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 990) {
            closeDrawer();
        }
    });
});


