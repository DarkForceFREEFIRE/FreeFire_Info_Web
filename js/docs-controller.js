document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.docs-content .docs-card');
    const navLinks = document.querySelectorAll('.doc-side-link');
    const toast = document.getElementById('status-toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    function updateActiveSidebarLink() {
        let currentSectionId = '';
        const scrollOffset = window.scrollY + 140;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollOffset >= sectionTop && scrollOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (window.scrollY < 100) {
            currentSectionId = 'doc-overview';
        }

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    const copyButtons = document.querySelectorAll('.docs-code-copy-btn[data-copy]');
    copyButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        showToast('Copied to clipboard!');
                        
                        btn.classList.add('copied');
                        const originalTitle = btn.getAttribute('title');
                        btn.setAttribute('title', 'Copied!');
                        
                        setTimeout(() => {
                            btn.classList.remove('copied');
                            btn.setAttribute('title', originalTitle || 'Copy code');
                        }, 1800);
                    })
                    .catch(() => showToast('Copy command blocked or unsupported.'));
            }
        });
    });

    window.addEventListener('scroll', updateActiveSidebarLink);
    window.addEventListener('resize', updateActiveSidebarLink);
    
    updateActiveSidebarLink();
});