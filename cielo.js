document.addEventListener("DOMContentLoaded", () => {
    const planets = document.querySelectorAll(".planet");
    const tooltip = document.getElementById("tooltip");
    const starsContainer = createStars(140);
    document.body.appendChild(starsContainer);
    
    const piropoContainer = document.getElementById("piropoContainer");
    const planetaNombre = document.getElementById("planetaNombre");
    const piropoTexto = document.getElementById("piropoTexto");
    const piropoAutor = document.getElementById("piropoAutor");

    planets.forEach(planet => {
        planet.addEventListener("click", (e) => {
            const texto = planet.dataset.piropo || planet.dataset.nombre || "…";
            const nombre = planet.dataset.nombre || "Planeta";
            const autor = planet.dataset.autor || "Autor desconocido";
            
    
            showTooltip(texto, planet);
            showPiropoContainer(nombre, texto, autor);
            
            planet.animate([
                { transform: 'translate(-50%,-50%) scale(1.1)' }, 
                { transform: 'translate(-50%,-50%) scale(1)' }
            ], { duration: 300, easing: 'ease-out' });
        });

        planet.addEventListener("mouseenter", () => {
            const texto = planet.dataset.piropo || planet.dataset.nombre || "…";
            showTooltip(texto, planet, { autoHide: true, delay: 2200 });
        });

        planet.addEventListener("mouseleave", () => {
            hideTooltip();
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".planet")) {
            hideTooltip();
            hidePiropoContainer();
        }
    });

    function showTooltip(text, element, options = {}) {
        tooltip.hidden = false;
        tooltip.textContent = text;
        tooltip.style.opacity = "1";

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const offset = 14;
        let left = centerX + offset;
        let top = centerY - rect.height;

        const tw = 300;
        if (left + tw > window.innerWidth - 12) {
            left = centerX - tw - offset;
        }
        if (top < 12) {
            top = centerY + rect.height + offset;
        }

        tooltip.style.left = `${Math.round(left)}px`;
        tooltip.style.top = `${Math.round(top)}px`;
        tooltip.animate([
            { opacity: 0, transform: 'translateY(-6px)' }, 
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 260, easing: 'ease-out' });

        if (options.autoHide) {
            clearTimeout(tooltip._hideTimer);
            tooltip._hideTimer = setTimeout(() => hideTooltip(), options.delay || 1800);
        }
    }

    function hideTooltip() {
        if (tooltip.hidden) return;
        tooltip.animate([
            { opacity: 1, transform: 'translateY(0)' }, 
            { opacity: 0, transform: 'translateY(-6px)' }
        ], { duration: 200, easing: 'ease-in' })
            .onfinish = () => {
                tooltip.hidden = true;
                tooltip.textContent = "";
            };
    }


    function showPiropoContainer(nombre, texto, autor) {
        planetaNombre.textContent = nombre;
        piropoTexto.textContent = `"${texto}"`;
        piropoAutor.textContent = `— ${autor}`;
        
        piropoContainer.hidden = false;
        piropoContainer.style.display = 'block';
        

        piropoContainer.animate([
            { opacity: 0, transform: 'translateX(-50%) translateY(20px)' },
            { opacity: 1, transform: 'translateX(-50%) translateY(0)' }
        ], { duration: 500, easing: 'ease-out' });
    }

    function hidePiropoContainer() {
        if (piropoContainer.hidden) return;
        
        piropoContainer.animate([
            { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
            { opacity: 0, transform: 'translateX(-50%) translateY(20px)' }
        ], { duration: 300, easing: 'ease-in' })
            .onfinish = () => {
                piropoContainer.hidden = true;
                piropoContainer.style.display = 'none';
            };
    }


    function createStars(count = 100) {
        const container = document.createElement("div");
        container.className = "stars";
        for (let i = 0; i < count; i++) {
            const s = document.createElement("div");
            s.className = "star";
            s.style.left = `${Math.random() * 100}%`;
            s.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 2 + 0.2;
            s.style.width = `${size}px`;
            s.style.height = `${size}px`;
            s.style.animationDelay = `${Math.random() * 5}s`;
            s.style.opacity = Math.random() * 0.9;
            container.appendChild(s);
        }
        return container;
    }


    const orbits = document.querySelectorAll(".orbit");
    orbits.forEach(o => {
        const speed = parseFloat(o.dataset.speed) || 20;
        const seconds = Math.max(6, speed);
        o.style.animationDuration = `${seconds}s`;
    });

 
    planets.forEach(p => {
        p.setAttribute('tabindex', '0');
        p.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                p.click();
            } else if (ev.key === "Escape") {
                hideTooltip();
                hidePiropoContainer();
            }
        });
    });


    const centro = document.getElementById('centro');
    document.addEventListener('mousemove', (e) => {
        const rect = centro.getBoundingClientRect();
        const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
        const photo = document.getElementById('foto-ella');
        photo.style.transform = `translateZ(0) rotateY(${dx * 4}deg) rotateX(${ -dy * 4}deg)`;
    });
    document.addEventListener('mouseleave', () => {
        const photo = document.getElementById('foto-ella');
        photo.style.transform = '';
    });
});