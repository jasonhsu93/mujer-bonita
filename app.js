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
grid.innerHTML = looks.map(look => `<article class="collection-card" data-category="${look.category}"><div class="card-photo"><div class="look-crop" style="background-position:${look.position} ${look.vertical}" role="img" aria-label="${look.name}"></div><a href="${look.url}" target="_blank" rel="noopener" aria-label="Descubrir ${look.name}"></a><button class="save-button" data-save="${look.id}" aria-pressed="false" aria-label="Guardar ${look.name}">${heart}</button></div><div class="card-caption"><div><h3><a href="${look.url}" target="_blank" rel="noopener">${look.name}</a></h3><p>${look.description}</p></div><span aria-hidden="true">↗</span></div></article>`).join('');

const resultMarkup = (look, removable = false) => `<div class="result-row"><div class="result-thumb"><div class="look-crop" style="background-position:${look.position} ${look.vertical}" role="img" aria-label="${look.name}"></div></div><div><h3>${look.name}</h3><p>${look.category}</p><a class="text-link" href="${look.url}" target="_blank" rel="noopener">VER COLECCIÓN ↗</a></div>${removable ? `<button class="remove-favorite" data-remove="${look.id}" aria-label="Quitar ${look.name} de favoritos">×</button>` : ''}</div>`;
function renderFavorites() {
  document.querySelector('.favorite-count').textContent = favorites.size;
  document.querySelector('.favorites-trigger').setAttribute('aria-label', `Ver favoritos (${favorites.size})`);
  document.querySelectorAll('[data-save]').forEach(button => { const saved = favorites.has(button.dataset.save); button.setAttribute('aria-pressed', saved); button.setAttribute('aria-label', `${saved ? 'Quitar de favoritos:' : 'Guardar'} ${looks.find(look => look.id === button.dataset.save).name}`); });
  document.querySelector('#favorite-results').innerHTML = favorites.size ? looks.filter(look => favorites.has(look.id)).map(look => resultMarkup(look, true)).join('') : '<p class="empty-favorites">Tu historia empieza aquí. Guarda las prendas que te gustan con el corazón y vuelve a descubrirlas cuando quieras.</p><a class="text-link" href="#seleccion" data-close-link>EXPLORAR LA COLECCIÓN ↗</a>';
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
document.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
  const slide = slides[Number(button.dataset.slide)];
  const image = document.querySelector('#hero-image'); image.src = `assets/mujerbonita/banners/${encodeURIComponent(slide.image)}`; image.alt = slide.alt;
  document.querySelector('#hero-title').textContent = slide.title; document.querySelector('#hero-kicker').textContent = slide.kicker;
  document.querySelectorAll('[data-slide]').forEach(control => control.setAttribute('aria-pressed', control === button));
}));
document.querySelector('#year').textContent = new Date().getFullYear();
renderFavorites(); search();
