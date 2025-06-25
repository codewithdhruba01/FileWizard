// Dark Mode Controller
const DarkMode = {
    // DOM elements
    elements: {
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
        themeIcon: document.querySelector('#theme-toggle-btn i'),
        themeText: document.querySelector('#theme-toggle-btn span')
    },
    
    // Initialize dark mode
    init() {
        // Check for saved theme preference or system preference
        this.checkThemePreference();
        
        // Bind event listeners
        this.bindEvents();
    },
    
    // Check for saved theme preference
    checkThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        } else if (savedTheme === 'light') {
            this.enableLightMode();
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.enableDarkMode();
            } else {
                this.enableLightMode();
            }
        }
    },
    
    // Bind event listeners
    bindEvents() {
        // Theme toggle button
        this.elements.themeToggleBtn.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        this.enableDarkMode(false);
                    } else {
                        this.enableLightMode(false);
                    }
                }
            });
        }
    },
    
    // Toggle between light and dark mode
    toggleTheme() {
        if (document.body.classList.contains('dark-mode')) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    },
    
    // Enable dark mode
    enableDarkMode(savePreference = true) {
        document.body.classList.add('dark-mode');
        this.elements.themeIcon.className = 'fas fa-sun';
        this.elements.themeText.textContent = 'Light Mode';
        
        if (savePreference) {
            localStorage.setItem('theme', 'dark');
        }
        
        // Add smooth transition animation
        this.animateThemeChange();
    },
    
    // Enable light mode
    enableLightMode(savePreference = true) {
        document.body.classList.remove('dark-mode');
        this.elements.themeIcon.className = 'fas fa-moon';
        this.elements.themeText.textContent = 'Dark Mode';
        
        if (savePreference) {
            localStorage.setItem('theme', 'light');
        }
        
        // Add smooth transition animation
        this.animateThemeChange();
    },
    
    // Animate theme change
    animateThemeChange() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(overlay);
        
        // Trigger animation
        setTimeout(() => {
            overlay.style.opacity = '0.2';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }, 200);
        }, 0);
    }
};