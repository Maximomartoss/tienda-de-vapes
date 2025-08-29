const video = document.getElementById("smokeVideo");
video.src = "video humo.mp4"; 

const hamburger = document.getElementById("menu-hamburguesa");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById('sidebar-overlay');

hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-hidden");
  sidebar.classList.toggle("sidebar-visible");
  overlay.classList.toggle("sidebar-overlay-hidden");
  overlay.classList.toggle("sidebar-overlay-visible");
});

overlay.addEventListener('click', () => {
  sidebar.classList.add('sidebar-hidden');
  sidebar.classList.remove('sidebar-visible');
  overlay.classList.add('sidebar-overlay-hidden');
  overlay.classList.remove('sidebar-overlay-visible');
});

// Variables globales para productos
let todosLosProductos = [];
let categoriaActual = 'todos';

// --- FUNCIÓN PARA CARGAR PRODUCTOS DESDE JSON ---
async function cargarProductos() {
  try {
    const response = await fetch('productos.json');
    const data = await response.json();
    todosLosProductos = data.productos;
    console.log('✅ Productos cargados:', todosLosProductos.length);
    mostrarProductos(categoriaActual);
  } catch (error) {
    console.error('❌ Error cargando productos:', error);
    todosLosProductos = [];
    mostrarProductos(categoriaActual);
  }
}

// --- FUNCIÓN PARA MOSTRAR PRODUCTOS ---
function mostrarProductos(categoria = 'todos') {
  const grid = document.getElementById("productos-grid");
  const titulo = document.getElementById("titulo-categoria");
  
  if (!grid) return;
  
  // Limpiar grid
  grid.innerHTML = '';
  
  // Filtrar productos por categoría
  let productosFiltrados = todosLosProductos;
  
  if (categoria !== 'todos') {
    productosFiltrados = todosLosProductos.filter(producto => 
      producto.categoria === categoria
    );
  }
  
  // Actualizar título
  if (titulo) {
    titulo.textContent = categoria === 'todos' ? 'PRODUCTOS' : categoria.toUpperCase();
  }
  
  // Mostrar mensaje si no hay productos
  if (productosFiltrados.length === 0) {
    grid.innerHTML = `
      <div style="color: #fff; text-align: center; padding: 40px 20px;">
        <h3>No hay productos en esta categoría</h3>
        <p>Selecciona otra categoría del menú</p>
      </div>
    `;
    return;
  }
  
  // Los estilos del grid ya están en CSS, no los sobrescribimos
  
  // Mostrar cada producto
  productosFiltrados.forEach((producto) => {
    const card = document.createElement("div");
    card.className = "producto-card";
    
    // Crear galería de imágenes si hay múltiples fotos
    let galeriaHTML = '';
    if (producto.fotos && producto.fotos.length > 1) {
      galeriaHTML = `
        <div class="galeria-container">
          <img src="${producto.fotos[0]}" alt="${producto.nombre}" class="producto-img" 
               onerror="this.src='LOGO/images-removebg-preview.png'">
          <button class="galeria-btn prev" onclick="cambiarImagen(this, -1)">‹</button>
          <button class="galeria-btn next" onclick="cambiarImagen(this, 1)">›</button>
        </div>
      `;
    } else {
      // Imagen única
      const foto = producto.fotos ? producto.fotos[0] : (producto.foto || 'LOGO/images-removebg-preview.png');
      galeriaHTML = `
        <img src="${foto}" alt="${producto.nombre}" class="producto-img" 
             onerror="this.src='LOGO/images-removebg-preview.png'">
      `;
    }
    
    card.innerHTML = `
      ${galeriaHTML}
      <div class="producto-info">
        <div class="producto-nombre">${producto.nombre}</div>
        <div class="producto-descripcion">${producto.descripcion || ''}</div>
        ${producto.puffs ? `<div class="producto-puffs">${producto.puffs}</div>` : ''}
        <button class="btn-consultar" onclick="consultarProducto('${producto.nombre}')">
          <i class="whatsapp-icon">📱</i> Consultar
        </button>
      </div>
    `;
    
    // Agregar datos de las fotos al card para la navegación
    if (producto.fotos && producto.fotos.length > 1) {
      card.dataset.fotos = JSON.stringify(producto.fotos);
      card.dataset.imagenActual = 0;
    }
    
    grid.appendChild(card);
  });
}

// --- FUNCIÓN PARA EL SUBMENÚ ---
function inicializarSubmenu() {
  const menuItem = document.querySelector('.menu-item-with-submenu');
  const submenuToggle = document.querySelector('.submenu-toggle');
  const submenu = document.querySelector('.submenu');
  
  // Toggle del submenú
  menuItem.addEventListener('click', (e) => {
    if (e.target.classList.contains('submenu-toggle') || e.target.classList.contains('menu-item-text')) {
      submenu.classList.toggle('active');
      submenuToggle.classList.toggle('active');
    }
  });
  
  // Eventos para las categorías del submenú
  const submenuItems = document.querySelectorAll('.submenu li');
  submenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const categoria = item.getAttribute('data-categoria');
      categoriaActual = categoria;
      
      // Mostrar productos de la categoría seleccionada
      mostrarProductos(categoria);
      
      // Cerrar el sidebar en móviles
      if (window.innerWidth <= 600) {
        sidebar.classList.add('sidebar-hidden');
        sidebar.classList.remove('sidebar-visible');
        overlay.classList.add('sidebar-overlay-hidden');
        overlay.classList.remove('sidebar-overlay-visible');
      }
      
      // Agregar feedback visual
      item.style.background = '#4caf50';
      item.style.color = '#fff';
      setTimeout(() => {
        item.style.background = '';
        item.style.color = '';
      }, 300);
    });
    
    // Mejorar experiencia táctil en móviles
    if ('ontouchstart' in window) {
      item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      item.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    }
  });
  
  // Mejorar el toggle del submenú en móviles
  if ('ontouchstart' in window) {
    submenuToggle.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.9)';
    });
    
    submenuToggle.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  }
}

// --- FUNCIÓN PARA CONSULTAR PRODUCTO VÍA WHATSAPP ---
function consultarProducto(nombreProducto) {
  const mensaje = encodeURIComponent(`Hola! Me interesa el producto: ${nombreProducto}`);
  const numeroWhatsApp = '5491112345678'; // Cambia este número por el tuyo
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
  window.open(urlWhatsApp, '_blank');
}

// --- FUNCIÓN PARA CAMBIAR IMAGEN EN LA GALERÍA ---
function cambiarImagen(boton, direccion) {
  const galeriaContainer = boton.closest('.galeria-container');
  const card = galeriaContainer.closest('.producto-card');
  const fotos = JSON.parse(card.dataset.fotos);
  let imagenActual = parseInt(card.dataset.imagenActual);
  
  // Calcular nueva posición
  imagenActual += direccion;
  
  // Manejar bucle (si llega al final, vuelve al principio y viceversa)
  if (imagenActual >= fotos.length) {
    imagenActual = 0;
  } else if (imagenActual < 0) {
    imagenActual = fotos.length - 1;
  }
  
  // Actualizar imagen
  const img = galeriaContainer.querySelector('.producto-img');
  img.src = fotos[imagenActual];
  
  // Actualizar datos del card
  card.dataset.imagenActual = imagenActual;
  
  // Agregar efecto de transición
  img.style.opacity = '0';
  setTimeout(() => {
    img.style.opacity = '1';
  }, 100);
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', function() {
  inicializarSubmenu();
  
  // Cargar productos al iniciar
  cargarProductos();
});
