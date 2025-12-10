const constellationPhrases = [
  "Tu inteligencia ilumina cada conversación, como un faro en la oscuridad.",
  "La forma en que tu mente conecta ideas me deja sin aliento.",
  "Tu creatividad es un universo infinito que nunca dejo de explorar.",
  "Tus gustos musicales son la banda sonora perfecta para mis días.",
  "Tu cabello es como un atardecer: único, cálido y lleno de matices.",
  "Admiro cómo persigues tus metas con una determinación que inspira.",
  "Esa pasión que pones en todo lo que haces, incluso en los detalles más pequeños.",
  "Tu capacidad de soñar en grande y hacer que lo imposible parezca alcanzable.",
  "La manera en que transformas lo cotidiano en algo mágico.",
  "Tu voz, tu risa, esos pequeños momentos que hacen que todo valga la pena.",
  "La forma en que desafías lo convencional y creas tu propio camino.",
  "Esa esencia tuya que convierte lo simple en extraordinario.",
  "Tu curiosidad por aprender y descubrir cosas nuevas cada día.",
  "La forma en que escuchas, no solo con los oídos, sino con el corazón.",
  "Tu capacidad de encontrar belleza en los lugares más inesperados.",
  "Esa chispa de rebeldía que te hace única y auténtica.",
  "Tu forma de ver el mundo, siempre con esperanza y optimismo.",
  "La manera en que inspiras a otros sin siquiera darte cuenta.",
  "Tu habilidad para convertir los sueños en planes y los planes en realidad.",
  "Esa magia que tienes para hacer que hasta los días grises brillen.",
  "Tu valentía al enfrentar los desafíos y salir adelante.",
  "La forma en que equilibras fuerza y ternura, como un baile perfecto.",
  "Tu amor por la música, que parece entenderte mejor que nadie.",
  "Esa sonrisa que ilumina todo a tu alrededor."
];

/* Coordenadas para formar la letra P con estrellas */
const pShapeCoordinates = [
  // Línea vertical izquierda (de arriba hacia abajo)
  { x: 30, y: 10 },
  { x: 30, y: 20 },
  { x: 30, y: 30 },
  { x: 30, y: 40 },
  { x: 30, y: 50 },
  { x: 30, y: 60 },
  { x: 30, y: 70 },
  { x: 30, y: 80 },
  { x: 30, y: 90 },

  // Curva superior de la P
  { x: 40, y: 10 },
  { x: 50, y: 10 },
  { x: 60, y: 12 },
  { x: 68, y: 18 },
  { x: 72, y: 28 },
  { x: 70, y: 38 },
  { x: 65, y: 45 },
  { x: 55, y: 50 },
  { x: 45, y: 50 },
  { x: 35, y: 50 },
]

/* Generar constelación en forma de P */
const constellationContainer = document.getElementById("constellation-p")
if (constellationContainer) {
  pShapeCoordinates.forEach((coord, index) => {
    const star = document.createElement("div")
    star.className = "star-p"
    star.style.left = `${coord.x}%`
    star.style.top = `${coord.y}%`
    star.dataset.text = constellationPhrases[index % constellationPhrases.length]
    star.style.animationDelay = `${index * 0.15}s`
    star.addEventListener("click", openModalFromStar)
    constellationContainer.appendChild(star)
  })
}

/* Modal */
const modal = document.getElementById("modal")
const modalText = document.getElementById("modalText")
const closeBtn = document.getElementById("closeModal")

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal)
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal()
  })
}

function openModalFromStar(e) {
  const text = e.currentTarget.dataset.text || "..."
  if (modalText) {
    modalText.textContent = text
  }
  if (modal) {
    modal.style.display = "flex"
    modal.setAttribute("aria-hidden", "false")
  }
}

function closeModal() {
  if (modal) {
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
  }
}


const backToTopBtn = document.getElementById("backToTop")
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

;(function starfield() {
  const canvas = document.getElementById("starfield")
  if (!canvas) return

  const ctx = canvas.getContext("2d")

  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  }

  resize()
  window.addEventListener("resize", resize)

  const stars = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    r: Math.random() * 1.5 + 0.5,
    tw: Math.random() * 1.2 + 0.5,
    t: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.003 + 0.001, 
  }))

  // Algunas estrellas doradas especiales
  const goldenStars = Array.from({ length: 20 }).map(() => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    r: Math.random() * 2 + 1,
    tw: Math.random() * 0.8 + 0.3,
    t: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.002 + 0.0005,
    color: "gold",
  }))

  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // Estrellas blancas normales
    for (const s of stars) {
      s.t += s.speed
      s.y -= 0.05 

      // Reset cuando sale de la pantalla
      if (s.y < -10) {
        s.y = canvas.clientHeight + 10
        s.x = Math.random() * canvas.clientWidth
      }

      const alpha = 0.2 + 0.4 * Math.abs(Math.sin(s.t * s.tw))

      ctx.beginPath()
      ctx.fillStyle = `rgba(249, 243, 234, ${alpha})`
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()

      // Pequeño brillo
      if (alpha > 0.5) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(249, 243, 234, ${alpha * 0.3})`
        ctx.arc(s.x, s.y, s.r * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Estrellas doradas especiales
    for (const s of goldenStars) {
      s.t += s.speed
      s.y -= 0.03 // aún más lento

      if (s.y < -10) {
        s.y = canvas.clientHeight + 10
        s.x = Math.random() * canvas.clientWidth
      }

      const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.t * s.tw))

      ctx.beginPath()
      ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fill()

      // Brillo dorado
      if (alpha > 0.6) {
        ctx.beginPath()
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.2})`
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    requestAnimationFrame(draw)
  }

  draw()
})()

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const starfield = document.getElementById("starfield")
  if (starfield) {
    starfield.style.transform = `translateY(${scrolled * 0.3}px)`
  }
})


const tabsNav = document.getElementById('tabsNav');
let lastScrollPosition = 0;


window.addEventListener('scroll', () => {
  const currentScrollPosition = window.scrollY;

  if (currentScrollPosition > lastScrollPosition) {
    tabsNav.classList.add('hidden');
  } else {
    tabsNav.classList.remove('hidden');
  }

  lastScrollPosition = currentScrollPosition;
});

document.querySelectorAll('.tab-link[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });

    document.querySelectorAll('.tab-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
