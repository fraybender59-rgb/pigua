// Catálogo mapeado por áreas operativas reales
let itemsCatalogo = [
  { id: 101, name: "Salmón Infusionado", area: "cocina", description: "A las finas hierbas, con arroz y verduras.", cost: 300.00, imageUrl: "imagenes/salmon.jpg" },
  { id: 102, name: "Rib Eye Americano", area: "cocina", description: "350gr con puré de papa y verduras.", cost: 400.00, imageUrl: "imagenes/corte2.jpg" },
  { id: 103, name: "Piñada Fría", area: "barra", description: "Bebida cremosa de piña y coco.", cost: 35.00, imageUrl: "imagenes/piñada.jpg" },
  { id: 104, name: "Enchiladas de la Casa", area: "cocina", description: "Con crema y queso fresco.", cost: 85.00, imageUrl: "imagenes/enchiladas.jpg" },
  { id: 105, name: "Gin Tonic", area: "barra", description: "Trago largo clásico con ginebra.", cost: 95.00, imageUrl: "imagenes/gintonic.jpg" },
  { id: 106, name: "Hotcakes Clásicos", area: "cocina", description: "Esponjosos con mantequilla y miel.", cost: 60.00, imageUrl: "imagenes/hotcakes.jpg" },
  { id: 107, name: "Mojito Cubano", area: "barra", description: "Ron, menta fresca y limón.", cost: 80.00, imageUrl: "imagenes/mojito.jpg" },
  { id: 108, name: "Pechuga de Pollo", area: "cocina", description: "A la plancha con guarnición.", cost: 110.00, imageUrl: "imagenes/pechuga.jpg" },
  { id: 109, name: "Paquete / Set Completo", area: "cocina", description: "Combinación ideal para compartir.", cost: 450.00, imageUrl: "imagenes/set.jpg" }
];

let comandaActiva = [];

document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('menu-items-grid');
  const orderListContainer = document.getElementById('order-items-list');
  const totalAmountLabel = document.getElementById('order-total-amount');
  const ticketPrintArea = document.getElementById('ticket-print-area');
  const btnSendProduction = document.getElementById('btn-send-production');
  const btnGenerateCheck = document.getElementById('btn-generate-check');

  function renderMenu() {
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    itemsCatalogo.forEach(item => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="product-image" onerror="this.src='https://via.placeholder.com/150x100?text=${item.name}'">
        <div class="product-info">
          <h3 class="product-name">${item.name} <span style="font-size:0.7rem; color:#aaa;">(${item.area.toUpperCase()})</span></h3>
          <p class="product-description">${item.description}</p>
          <p class="product-price">$${item.cost.toFixed(2)}</p>
          <button class="btn-add">＋ Ordenar</button>
        </div>
      `;
      card.querySelector('.btn-add').addEventListener('click', () => agregarAComanda(item.id));
      gridContainer.appendChild(card);
    });
  }

  function agregarAComanda(id) {
    const producto = itemsCatalogo.find(p => p.id === id);
    const existe = comandaActiva.find(item => item.id === id);
    if (existe) { existe.cantidad++; } else { comandaActiva.push({ ...producto, cantidad: 1, nota: "" }); }
    if (ticketPrintArea) ticketPrintArea.style.display = 'none';
    actualizarVistaComanda();
  }

  function eliminarDeComanda(id) {
    const existe = comandaActiva.find(item => item.id === id);
    if (!existe) return;
    if (existe.cantidad > 1) { existe.cantidad--; } else { comandaActiva = comandaActiva.filter(item => item.id !== id); }
    if (ticketPrintArea) ticketPrintArea.style.display = 'none';
    actualizarVistaComanda();
  }

  function actualizarVistaComanda() {
    if(!orderListContainer || !totalAmountLabel) return;
    if (comandaActiva.length === 0) {
      orderListContainer.innerHTML = '<p class="empty-msg">No hay productos en la comanda.</p>';
      totalAmountLabel.innerText = "$0.00";
      return;
    }
    orderListContainer.innerHTML = '';
    let totalAcumulado = 0;
    comandaActiva.forEach(item => {
      const subtotal = item.cost * item.cantidad;
      totalAcumulado += subtotal;
      const itemBox = document.createElement('div');
      itemBox.className = 'order-item-container';
      itemBox.innerHTML = `
        <div class="order-item-row">
          <span><strong>${item.cantidad}x</strong> ${item.name}</span>
          <div>
            <span style="margin-right:5px;">$${subtotal.toFixed(2)}</span>
            <button class="btn-delete">❌</button>
          </div>
        </div>
        <input type="text" class="order-item-note" placeholder="Notas (sin cebolla, término, etc)..." value="${item.nota}">
      `;
      itemBox.querySelector('.btn-delete').addEventListener('click', () => eliminarDeComanda(item.id));
      itemBox.querySelector('.order-item-note').addEventListener('input', (e) => { item.nota = e.target.value; });
      orderListContainer.appendChild(itemBox);
    });
    totalAmountLabel.innerText = `$${totalAcumulado.toFixed(2)}`;
  }

  // LÓGICA 1: ENVIAR SOLO LO CORRESPONDIENTE A CADA ÁREA (Sin Precios, es para elaborar)
  if (btnSendProduction) {
    btnSendProduction.addEventListener('click', () => {
      if (comandaActiva.length === 0) { alert("¡Comanda vacía!"); return; }
      const mesaNum = document.getElementById('table-number').value || "1";
      const fechaActual = new Date().toLocaleTimeString();
      
      let finalHTML = "";

      // Filtrar para Cocina
      const itemsCocina = comandaActiva.filter(i => i.area === "cocina");
      if(itemsCocina.length > 0) {
        finalHTML += `<div class="ticket-box prod-cocina">
          <div class="ticket-header"><strong>🔥 ORDEN DE COCINA 🔥</strong><br>Mesa: ${mesaNum} | Hora: ${fechaActual}</div>`;
        itemsCocina.forEach(i => {
          finalHTML += `<div class="ticket-row"><span>🟢 ${i.cantidad}x ${i.name}</span></div>`;
          if(i.nota) finalHTML += `<div class="ticket-row-note">>> OBJ: ${i.nota.toUpperCase()}</div>`;
        });
        finalHTML += `</div>`;
      }

      // Filtrar para Barra
      const itemsBarra = comandaActiva.filter(i => i.area === "barra");
      if(itemsBarra.length > 0) {
        finalHTML += `<div class="ticket-box prod-barra">
          <div class="ticket-header"><strong>🍺 ORDEN DE BARRA 🍺</strong><br>Mesa: ${mesaNum} | Hora: ${fechaActual}</div>`;
        itemsBarra.forEach(i => {
          finalHTML += `<div class="ticket-row"><span>🔵 ${i.cantidad}x ${i.name}</span></div>`;
          if(i.nota) finalHTML += `<div class="ticket-row-note">>> OBJ: ${i.nota.toUpperCase()}</div>`;
        });
        finalHTML += `</div>`;
      }

      ticketPrintArea.innerHTML = finalHTML;
      ticketPrintArea.style.display = 'block';
    });
  }

  // LÓGICA 2: TICKET DE CUENTA COMPLETA PARA EL CLIENTE (Con costos)
  if (btnGenerateCheck) {
    btnGenerateCheck.addEventListener('click', () => {
      if (comandaActiva.length === 0) { alert("¡Comanda vacía!"); return; }
      const mesaNum = document.getElementById('table-number').value || "1";
      let totalAcumulado = 0;
      let ticketHTML = `<div class="ticket-box"><div class="ticket-header"><strong>*** TICKET DE CUENTA ***</strong><br>Mesa: ${mesaNum}</div>`;
      
      comandaActiva.forEach(item => {
        const subtotal = item.cost * item.cantidad;
        totalAcumulado += subtotal;
        ticketHTML += `<div class="ticket-row"><span>${item.cantidad} x ${item.name}</span><span>$${subtotal.toFixed(2)}</span></div>`;
      });

      ticketHTML += `<div class="ticket-total"><span>TOTAL A COBRAR:</span><span>$${totalAcumulado.toFixed(2)}</span></div></div>`;
      ticketPrintArea.innerHTML = ticketHTML;
      ticketPrintArea.style.display = 'block';
    });
  }

  renderMenu();
});
