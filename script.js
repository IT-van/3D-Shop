const BIN_ID = '688c55b9ae596e708fbf3471';
const API_KEY = '$2a$10$yPmfYr5C/ehRIuUuohHKs.jrYcVuoIxN3hRugD06gr1WPj1htsqgS';
const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let products = [];
let deleteMode = false;
let showAll = false;

const panel = document.getElementById('add-panel');
const closePanelBtn = document.getElementById('close-panel');
const submitBtn = document.getElementById('submit-product');
const productContainer = document.getElementById('product-container');
const activateDeleteBtn = document.getElementById('activate-delete');
const showMoreBtn = document.getElementById('show-more');

// --- Модальное окно ---
const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
modalOverlay.innerHTML = `
  <div class="modal-content">
    <button class="modal-close" title="Закрыть">&times;</button>
    <img src="" alt="Увеличенное изображение" />
  </div>
`;
document.body.appendChild(modalOverlay);
const modalImage = modalOverlay.querySelector('img');
const modalCloseBtn = modalOverlay.querySelector('.modal-close');
modalCloseBtn.onclick = () => {
  modalOverlay.classList.remove('active');
  modalImage.src = '';
};
function openModal(imageSrc) {
  modalImage.src = imageSrc;
  modalOverlay.classList.add('active');
}

// --- Открытие панели клавишей N ---
document.addEventListener('keydown', (e) => {
  if (e.key?.toLowerCase() === 'n') {
    if (!panel.classList.contains('slide-in')) {
      panel.classList.remove('hidden');
      panel.classList.add('slide-in');
    }
  }
});

// --- Закрытие панели ---
function closePanel() {
  panel.classList.remove('slide-in');
  panel.classList.add('slide-out');
  setTimeout(() => {
    panel.classList.add('hidden');
    panel.classList.remove('slide-out');
  }, 350);
}

// --- Кнопки панели ---
closePanelBtn.addEventListener('click', () => {
  closePanel();
  deleteMode = false;
  refreshProducts();
});

activateDeleteBtn.addEventListener('click', () => {
  deleteMode = true;
  closePanel();
  refreshProducts();
});

// --- Отправка нового товара ---
submitBtn.addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const price = document.getElementById('price').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const imageUrl = document.getElementById('imageUrl').value.trim();

  if (!title || !description || !price || !contact || !imageUrl) {
    alert('Пожалуйста, заполните все поля.');
    return;
  }

  const newProduct = { title, description, price, contact, imageUrl };
  products.push(newProduct);
  await saveProducts();
  refreshProducts();
  closePanel();

  // Очистка формы
  ['title', 'description', 'price', 'contact', 'imageUrl'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

// --- Загрузка товаров ---
async function fetchProducts() {
  try {
    const res = await fetch(API_URL, {
      headers: { 'X-Master-Key': API_KEY }
    });
    const data = await res.json();
    products = data.record || [];
  } catch (err) {
    console.error('Ошибка загрузки товаров:', err);
  }
}

// --- Сохранение товаров ---
async function saveProducts() {
  try {
    await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(products)
    });
  } catch (err) {
    console.error('Ошибка сохранения:', err);
  }
}

// --- Обновление карточек товаров ---
function refreshProducts() {
  productContainer.innerHTML = '';
  const visibleProducts = showAll ? products : products.slice(0, 3);

  visibleProducts.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product';

    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.title;
    img.title = 'Нажмите, чтобы увеличить или удалить';

    const title = document.createElement('h3');
    title.textContent = product.title;

    const desc = document.createElement('p');
    desc.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `Цена: ${product.price}`;

    const contact = document.createElement('p');
    contact.textContent = `Контакт: ${product.contact}`;

    card.append(img, title, desc, price, contact);

    if (deleteMode) {
      card.classList.add('deletable');

      card.addEventListener('click', () => {
        if (confirm('Удалить этот товар?')) {
          const index = products.indexOf(product);
          if (index !== -1) {
            products.splice(index, 1);
            saveProducts().then(refreshProducts);
          }
        }
      });

      img.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Удалить этот товар?')) {
          const index = products.indexOf(product);
          if (index !== -1) {
            products.splice(index, 1);
            saveProducts().then(refreshProducts);
          }
        }
      });
    } else {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(product.imageUrl);
      });
    }

    productContainer.appendChild(card);
  });

  showMoreBtn.style.display = (!showAll && products.length > 3) ? 'inline-block' : 'none';
}

// --- Показать все товары ---
showMoreBtn.addEventListener('click', () => {
  showAll = true;
  productContainer.classList.add('show-all');
  refreshProducts();
});

// --- Инициализация ---
fetchProducts().then(refreshProducts);
//3d animation 
const canvas = document.getElementById('cube-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;

const darkShades = ['#0b0b0b', '#141414', '#1d1d1d', '#262626', '#2f2f2f', '#383838'];

const materials = [];
for (let i = 0; i < 6; i++) {
  const canvasFace = document.createElement('canvas');
  canvasFace.width = 256;
  canvasFace.height = 256;
  const ctx = canvasFace.getContext('2d');

  ctx.fillStyle = darkShades[i];
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#00ffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('3D/Shop', 128, 128);

  const texture = new THREE.CanvasTexture(canvasFace);
  materials.push(new THREE.MeshBasicMaterial({ map: texture }));
}

const geometry = new THREE.BoxGeometry(2, 2, 2);
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

// Resize обработка
window.addEventListener('resize', () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
