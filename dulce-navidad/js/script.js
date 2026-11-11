/* Dulce Navidad: interacción de pedidos.
   Sustituye el valor vacío por el número autorizado, solo dígitos: 519XXXXXXXX.
   Mientras esté vacío, nunca se abre una conversación con terceros. */
const WHATSAPP_NEGOCIO = '';

document.addEventListener('DOMContentLoaded', () => {
  const dialogo = document.getElementById('pedido-dialogo');
  const texto = document.getElementById('pedido-texto');
  const copiar = document.getElementById('pedido-copiar');
  const enviar = document.getElementById('pedido-enviar');
  const cerrar = document.getElementById('pedido-cerrar');
  if (!dialogo || !texto || !copiar || !enviar || !cerrar) return;

  document.querySelectorAll('.boton-pedido-demo').forEach(boton => {
    boton.addEventListener('click', () => {
      const promocion = boton.dataset.tipo === 'promocion';
      const nombre = boton.dataset.producto;
      const detalle = boton.dataset.detalle ? `\nIncluye: ${boton.dataset.detalle}` : '';
      const precio = boton.dataset.precio;
      const mensaje = `Hola, quiero realizar un pedido en Dulce Navidad. 🎄\n${promocion ? 'Promoción' : 'Producto'}: ${nombre}${detalle}\n${promocion ? 'Precio de la promoción' : 'Precio por unidad'}: S/ ${precio}\n¿Podrían confirmarme la disponibilidad?`;
      texto.value = mensaje;
      copiar.textContent = 'Copiar mensaje';
      const numeroValido = /^51\d{9}$/.test(WHATSAPP_NEGOCIO);
      enviar.hidden = !numeroValido;
      if (numeroValido) enviar.href = `https://wa.me/${WHATSAPP_NEGOCIO}?text=${encodeURIComponent(mensaje)}`;
      dialogo.showModal();
    });
  });
  copiar.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(texto.value);
      copiar.textContent = '¡Mensaje copiado!';
    } catch (_) {
      texto.focus(); texto.select();
      copiar.textContent = 'Selecciona y copia el texto';
    }
  });
  cerrar.addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', event => { if (event.target === dialogo) dialogo.close(); });
});

// Animación de entrada al desplazarse; si no hay soporte, todo queda visible.
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bloques = document.querySelectorAll('.pagina-inicio .inicio-seccion-titulo, .pagina-inicio .inicio-galeria article, .pagina-inicio .inicio-pasos article, .pagina-inicio .inicio-contacto, .pagina-catalogo .tarjeta-producto, .pagina-catalogo .tarjeta-promocion');
  if (!bloques.length) return;
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('dulce-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -25px 0px'});
  bloques.forEach(bloque => { bloque.classList.add('dulce-revelar'); observador.observe(bloque); });
  document.documentElement.classList.add('dulce-js');
})();
