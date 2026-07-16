
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const activeTheme = localStorage.getItem("theme") || "dark";

    document.documentElement.setAttribute("data-theme", activeTheme);
    document.body.setAttribute("data-theme", activeTheme);

    if (themeToggle) {
        themeToggle.setAttribute("aria-checked", activeTheme === "dark" ? "true" : "false");
        
        themeToggle.addEventListener("click", () => {
            const isCurrentlyDark = themeToggle.getAttribute("aria-checked") === "true";
            const targetTheme = isCurrentlyDark ? "light" : "dark";
            
            themeToggle.setAttribute("aria-checked", !isCurrentlyDark ? "true" : "false");
            document.documentElement.setAttribute("data-theme", targetTheme);
            document.body.setAttribute("data-theme", targetTheme);
            localStorage.setItem("theme", targetTheme);
        });
    }

    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (currentPath === linkHref || (currentPath === "" && linkHref === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    window.showPortalToast = function(message, duration = 4000) {
        const toast = document.getElementById("status-toast");
        if (toast) {
            toast.innerText = message;
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("hidden"), duration);
        }
    };
});