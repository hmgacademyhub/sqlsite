/**
 * SQL Workflow v6 - Global Core Logic
 * Brand Identity: HMG Ecosystem (Concepts, Technologies, Academy, Media, Gospel)
 * Visioner: Adewale Samson Adeagbo
 */
const HMG_CORE = {
    brand: {
        name: "HMG SQL Intelligence",
        visioner: "Adewale Samson Adeagbo",
        links: {
            concepts: "https://hmgconcepts.pages.dev",
            technologies: "https://hmgtechnologies.pages.dev",
            academy: "https://hmgacademy.pages.dev",
            media: "https://hmgmedia.pages.dev",
            gospel: "https://hmggospel.pages.dev",
            persona: "https://cssadewale.pages.dev"
        }
    },

    initTheme: () => {
        const theme = localStorage.getItem('hmg_theme_v6') || 'dark';
        document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
        
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.onclick = () => {
                const current = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
                localStorage.setItem('hmg_theme_v6', current);
                document.body.className = current === 'light' ? 'light-theme' : 'dark-theme';
            };
        }
    },

    updateStatus: (elId, text, isError = false) => {
        const el = document.getElementById(elId);
        if (!el) return;
        el.textContent = text;
        el.style.color = isError ? 'var(--danger)' : '';
    }
};

window.addEventListener('DOMContentLoaded', HMG_CORE.initTheme);
