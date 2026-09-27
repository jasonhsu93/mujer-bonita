const looks = [
  { id: 'chaleco-cacao', name: 'Chaleco en tono cacao', category: 'Chalecos', description: 'Sastrería con personalidad', position: '11.4%', vertical: 'top', url: 'https://www.mujerbonita.pe/categorias-prendas-2' },
  { id: 'vestido-rojo', name: 'Vestido rojo', category: 'Vestidos', description: 'Una declaración de estilo', position: '31.1%', vertical: 'center', url: 'https://www.mujerbonita.pe/categorias-prendas-3' },
  { id: 'chaleco-crema', name: 'Chaleco en tono crema', category: 'Chalecos', description: 'La elegancia de lo simple', position: '50.1%', vertical: 'top', url: 'https://www.mujerbonita.pe/categorias-prendas-2' },
  { id: 'pantalon-blanco', name: 'Pantalón blanco', category: 'Pantalones', description: 'Tu nuevo esencial', position: '90.1%', vertical: 'bottom', url: 'https://www.mujerbonita.pe/categorias-prendas-1' },
];
let favorites;
try { const stored = JSON.parse(localStorage.getItem('mb-favorites') || '[]'); favorites = new Set(Array.isArray(stored) ? stored.filter(id => looks.some(look => look.id === id)) : []); } catch { favorites = new Set(); }
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/></svg>';
const grid = document.querySelector('#collection-grid');
grid.innerHTML = looks.map(look => `<article class="collection-card" data-category="${look.category}"><div class="card-photo"><div class="look-crop" style="background-position:${look.position} ${look.vertical}" role="img" aria-label="${look.name}"></div><a href="${look.url}" target="_blank" rel="noopener" aria-label="Descubrir ${look.name}"></a><button class="save-button" data-save="${look.id}" aria-pressed="false" aria-label="Guardar ${look.name}">${heart}</button></div><div class="card-caption"><div><h3><a href="${look.url}" target="_blank" rel="noopener">${look.name}</a></h3><p>${look.description}</p></div><svg class="link-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></div></article>`).join('');

const resultMarkup = (look, removable = false) => `<div class="result-row"><div class="result-thumb"><div class="look-crop" style="background-position:${look.position} ${look.vertical}" role="img" aria-label="${look.name}"></div></div><div><h3>${look.name}</h3><p>${look.category}</p><a class="text-link" href="${look.url}" target="_blank" rel="noopener">VER COLECCIÓN <svg class="link-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></a></div>${removable ? `<button class="remove-favorite" data-remove="${look.id}" aria-label="Quitar ${look.name} de favoritos">×</button>` : ''}</div>`;
function renderFavorites() {
  document.querySelector('.favorite-count').textContent = favorites.size;
  document.querySelector('.favorites-trigger').setAttribute('aria-label', `Ver favoritos (${favorites.size})`);
  document.querySelectorAll('[data-save]').forEach(button => { const saved = favorites.has(button.dataset.save); button.setAttribute('aria-pressed', saved); button.setAttribute('aria-label', `${saved ? 'Quitar de favoritos:' : 'Guardar'} ${looks.find(look => look.id === button.dataset.save).name}`); });
  document.querySelector('#favorite-results').innerHTML = favorites.size ? looks.filter(look => favorites.has(look.id)).map(look => resultMarkup(look, true)).join('') : '<p class="empty-favorites">Tu historia empieza aquí. Guarda las prendas que te gustan con el corazón y vuelve a descubrirlas cuando quieras.</p><a class="text-link" href="#seleccion" data-close-link>EXPLORAR LA COLECCIÓN <svg class="link-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18 18 6M6 6h12v12"/></svg></a>';
}
let toastTimer;
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  try { localStorage.setItem('mb-favorites', JSON.stringify([...favorites])); } catch { /* Favorites remain usable for this visit when storage is unavailable. */ }
  renderFavorites();
  const toast = document.querySelector('.toast');
  toast.textContent = favorites.has(id) ? 'Guardado en tus favoritos.' : 'Prenda eliminada de tus favoritos.';
  toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
}
document.addEventListener('click', event => {
  const save = event.target.closest('[data-save], [data-remove]');
  if (save) toggleFavorite(save.dataset.save || save.dataset.remove);
});
function filter(category) {
  let count = 0;
  document.querySelectorAll('.collection-card').forEach(card => { card.hidden = category !== 'Todas' && card.dataset.category !== category; if (!card.hidden) count++; });
  document.querySelectorAll('[data-filter]').forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('selected', active); button.setAttribute('aria-pressed', active); });
  document.querySelector('#collection-status').textContent = `${count} prendas en ${category.toLowerCase()}.`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
document.querySelectorAll('[data-category]').forEach(link => link.addEventListener('click', () => filter(link.dataset.category)));
function syncDialogScroll() { document.body.style.overflow = document.querySelector('dialog[open]') ? 'hidden' : ''; }
function closeModal(dialog) { dialog.close(); syncDialogScroll(); }
document.querySelectorAll('.menu-trigger,.search-trigger,.favorites-trigger').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('dialog[open]').forEach(dialog => closeModal(dialog)); document.querySelector(`#${button.getAttribute('aria-controls')}`).showModal(); document.body.style.overflow = 'hidden'; }));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => closeModal(dialog));
  dialog.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); closeModal(dialog); } });
  dialog.addEventListener('close', syncDialogScroll);
  dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal(dialog); } if (event.target.closest('a[href^="#"]')) closeModal(dialog); });
});
const normalize = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function search() {
  const term = normalize(document.querySelector('#search-input').value.trim());
  const matches = looks.filter(look => normalize(`${look.name} ${look.category} ${look.description}`).includes(term));
  document.querySelector('#search-status').textContent = term ? (matches.length ? `${matches.length} resultados para tu búsqueda.` : 'No encontramos esa prenda. Prueba con chalecos, vestidos o pantalones.') : 'Explora la selección de la colección.';
  document.querySelector('#search-results').innerHTML = matches.map(look => resultMarkup(look)).join('');
}
document.querySelector('#search-input').addEventListener('input', search);
const slides = [
  { image: 'image copy 2.png', alt: 'Dos mujeres lucen chalecos en tonos crema con detalles negros', title: 'Esencia en cada detalle.', kicker: 'NUEVA COLECCIÓN' },
  { image: 'image copy 3.png', alt: 'Dos mujeres lucen prendas en blanco y negro', title: 'El contraste perfecto.', kicker: 'THE EVERYDAY EDIT' },
  { image: 'image.png', alt: 'Selección de chalecos, vestidos rojos y pantalones blancos Mujer Bonita', title: 'Cada versión de ti.', kicker: 'DESCUBRE TU ESTILO' },
];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('#hero-image');
const transitionImage = heroImage.cloneNode();
transitionImage.removeAttribute('id');
transitionImage.removeAttribute('fetchpriority');
transitionImage.className = 'hero-transition';
transitionImage.alt = '';
transitionImage.setAttribute('aria-hidden', 'true');
heroImage.after(transitionImage);
const autoplayToggle = document.querySelector('.autoplay-toggle');
const slideButtons = [...document.querySelectorAll('[data-slide]')];
let currentSlide = 0;
let slideRequest = 0;
let slideAnimation;
let rotationTimer;
let manuallyPaused = motionPreference.matches;
let hovered = false;
let focused = false;
let heroVisible = true;

// Cache the campaign images so transitions never reveal an unloaded image.
const campaignImages = slides.map(slide => {
  const image = new Image();
  image.src = `assets/mujerbonita/banners/${encodeURIComponent(slide.image)}`;
  return image;
});
function canRotate() {
  return !manuallyPaused && !motionPreference.matches && !hovered && !focused &&
    !document.hidden && heroVisible && !document.querySelector('dialog[open]');
}
function restartRotation() {
  clearTimeout(rotationTimer);
  if (canRotate()) rotationTimer = setTimeout(async () => {
    await showSlide((currentSlide + 1) % slides.length);
    restartRotation();
  }, 6000);
}
function updateAutoplayControl() {
  const paused = manuallyPaused || motionPreference.matches;
  autoplayToggle.setAttribute('aria-pressed', paused);
  autoplayToggle.setAttribute('aria-label', motionPreference.matches ? 'Rotación automática desactivada por preferencia de movimiento reducido' : paused ? 'Reanudar rotación automática' : 'Pausar rotación automática');
  autoplayToggle.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
  autoplayToggle.disabled = motionPreference.matches;
}
async function showSlide(index) {
  if (index === currentSlide) return;
  const request = ++slideRequest;
  const nextImage = campaignImages[index];
  try { await nextImage.decode(); } catch { return; }
  if (request !== slideRequest) return;
  slideAnimation?.cancel();
  currentSlide = index;
  const slide = slides[index];
  document.querySelector('#hero-title').textContent = slide.title;
  document.querySelector('#hero-kicker').textContent = slide.kicker;
  slideButtons.forEach(button => button.setAttribute('aria-pressed', Number(button.dataset.slide) === index));
  if (!motionPreference.matches) {
    transitionImage.src = nextImage.src;
    slideAnimation = transitionImage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
    const copy = document.querySelector('.hero-copy');
    copy.getAnimations().forEach(animation => animation.cancel());
    copy.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, easing: 'ease-out' });
    try { await slideAnimation.finished; } catch { return; }
  }
  if (request !== slideRequest) return;
  heroImage.src = nextImage.src;
  heroImage.alt = slide.alt;
  slideAnimation?.cancel();
}
slideButtons.forEach(button => button.addEventListener('click', async () => {
  clearTimeout(rotationTimer);
  await showSlide(Number(button.dataset.slide));
  restartRotation();
}));
autoplayToggle.addEventListener('click', () => {
  manuallyPaused = !manuallyPaused;
  updateAutoplayControl(); restartRotation();
});
hero.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; restartRotation(); } });
hero.addEventListener('pointerleave', () => { hovered = false; restartRotation(); });
hero.addEventListener('focusin', () => { focused = true; restartRotation(); });
hero.addEventListener('focusout', event => { focused = hero.contains(event.relatedTarget); restartRotation(); });
document.addEventListener('visibilitychange', restartRotation);
document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(restartRotation).observe(dialog, { attributes: true, attributeFilter: ['open'] }));
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; restartRotation(); }, { threshold: 0.15 }).observe(hero);
}
const revealTargets = [...document.querySelectorAll('.intro, .section-heading, .collection-card, .editorial-photo, .editorial-copy, .sale > *, .contact > *, .footer-top')];
let revealObserver;
function configureMotion() {
  revealObserver?.disconnect();
  revealTargets.forEach(element => element.classList.remove('reveal-pending'));
  if (motionPreference.matches) {
    manuallyPaused = true;
    hero.getAnimations({ subtree: true }).forEach(animation => animation.finish());
  } else if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealTargets.forEach((element, index) => {
      if (element.getBoundingClientRect().bottom > window.innerHeight) {
        element.style.setProperty('--reveal-delay', `${element.matches('.collection-card') ? (index % 4) * 60 : 0}ms`);
        element.classList.add('reveal-pending');
        revealObserver.observe(element);
      }
    });
  }
  updateAutoplayControl(); restartRotation();
}
motionPreference.addEventListener('change', configureMotion);
configureMotion();
document.querySelector('#year').textContent = new Date().getFullYear();
renderFavorites(); search();
