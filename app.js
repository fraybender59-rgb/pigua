const productos = [
    { id: 101, nombre: "Hamburguesa", area: "Cocina", description: "Hamburguesa con jitomate, cebollas, chiles y aderezos", cost: 70.00, imageUrl: "imagenes/hambur.jpeg" },
    { id: 102, nombre: "Hot Dogs", area: "Cocina", description: "Clasico, con queso por $7 mas", cost: 25.00, imageUrl: "imagenes/hot.jpeg" },
    { id: 103, nombre: "Orden de Hot Dogs", area: "Cocina", description: "3pz clasicas, con queso por $15 mas", cost: 65.00, imageUrl: "imagenes/Hotdogs-1.jpg" },
    { id: 104, nombre: "Sincronizadas Mexa", area: "Cocina", description: "Con frijoles refritos y guacamole", cost: 85.00, imageUrl: "imagenes/sincromexa.jpeg" },
    { id: 105, nombre: "Sincronizadas Pizza", area: "Cocina", description: "Sincronizadas estilo pizza.", cost: 95.00, imageUrl: "imagenes/sincornizadadepizza.webp" },
    { id: 106, nombre: "Club Sandwich", area: "Cocina", description: "Jamon, Pollo, Queso Americano, jitomate, cebolla, aderezos", cost: 75.00, imageUrl: "imagenes/club.jpg" },
    { id: 107, nombre: "Enchiladas", area: "Cocina", description: "Clasicas rojas o verdes, con verdura y lacteos", cost: 65.00, imageUrl: "imagenes/enchiladas.jpeg" },
    { id: 108, name: "Chilaquiles", area: "Cocina", description: "Clasicos rojos o verdes con verdura y lacteos", cost: 75.00, imageUrl: "imagenes/chilaquiles.jpg" },
    { id: 109, nombre: "Variantes de Enchiladas", area: "Cocina", description: "Escoje una de nuestras exquisitas variantes", cost: 90.00, imageUrl: "imagenes/mexaincha.jpeg" },
    { id: 110, nombre: "chimichangas", area: "Cocina", description: "Chimichangas con salchichas, chipotle y queso", cost: 40.00, imageUrl: "imagenes/pool.jpeg" },
    { id: 111, nombre: "chimichangas2", area: "Cocina", description: "Chimichangas prácticamente burritos fritos", cost: 40.00, imageUrl: "imagenes/dead.webp" },
    { id: 112, nombre: "hotcakes", area: "Cocina", description: "clasicos con toque de chocolate", cost: 75.00, imageUrl: "imagenes/hotcakes.jpg" }
];

let carrito = [];

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const rol = params.get('rol');

    if (rol === 'admin') {
        const vistaCliente = document.getElementById('vista-cliente');
        const vistaAdmin = document.getElementById('vista-admin');
        const appTitulo = document.getElementById('app-titulo');
        
        if (vistaCliente) vistaCliente.style.display = 'none';
        if (vistaAdmin) vistaAdmin.style.display = 'block';
        if (appTitulo) {
            appTitulo.innerText = "📊 PANEL CENTRAL DE CONTROL (Caja y Cocina)";
            appTitulo.style.backgroundColor = "#4b0082";
        }
        renderAdmin();
        setInterval(renderAdmin, 4000);
    } else {
        renderMenu();
    }
};

function renderMenu() {
    const grid = document.getElementById('menu-items-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    productos.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.nombre}" onerror="this.src='imagenes/set.jpg'" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${item.nombre}</h3>
                <p class="product-description">${item.description}</p>
                <div class="product-price">$${item.cost.toFixed(2)}</div>
                <input type="text" id="notas-prod-${item.id}" class="order-item-note" placeholder="Instrucciones especiales...">
                <button class="btn-add" onclick="agregarAlCarrito(${item.id})">Seleccionar</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function agregarAlCarrito(id) {
    const pBase = productos.find(p => p.id === id);
    if (!pBase) return;
    const inputNota = document.getElementById(`notas-prod-${id}`);
    const item = { ...pBase, nota: inputNota ? inputNota.value.trim() : "" };
    carrito.push(item);
    if (inputNota) inputNota.value = '';
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('lista-pedido');
    const totalSpan = document.getElementById('total-pago');
    if (!lista || !totalSpan) return;
    
    if (carrito.length === 0) {
        lista.innerHTML = '<p class="empty-msg">No hay productos.</p>';
        totalSpan.innerText = '$0.00';
        return;
    }
    
    lista.innerHTML = '';
    let total = 0;
    
    carrito.forEach((item, index) => {
        total += item.cost;
        const textoNota = item.nota ? `<br><small style="color: #ffaa00;">📝 ${item.nota}</small>` : '';
        const div = document.createElement('div');
        div.className = 'order-item-container';
        div.innerHTML = `
            <div class="order-item-row">
                <div><span><strong>${item.nombre}</strong></span>${textoNota}</div>
                <button onclick="eliminarDelCarrito(${index})" class="btn-delete">X</button>
            </div>
        `;
        lista.appendChild(div);
    });
    totalSpan.innerText = `$${total.toFixed(2)}`;
}

function enviarPedidoACaja() {
    if (carrito.length === 0) return alert("Carrito vacío");
    const mesaInput = document.getElementById('num-mesa');
    const telInput = document.getElementById('tel-cliente');
    const pagoInput = document.getElementById('forma-pago');
    
    const mesa = mesaInput ? mesaInput.value : "1";
    const telefono = (telInput && telInput.value) ? telInput.value : "Sin Tel";
    const pago = pagoInput ? pagoInput.value : "Efectivo";

    let total = 0;
    const platillos = carrito.map(i => { 
        total += i.cost; 
        return `${i.nombre}${i.nota ? ' ('+i.nota+')':''}`; 
    });

    const nuevoPedido = {
        id: Date.now(),
        mesa: mesa,
        telefono: telefono,
        productos: platillos.join(', '),
        total: total.toFixed(2),
        pago: pago,
        estado: 'cocina'
    };

    let pedidos_actuales = JSON.parse(localStorage.getItem('pedidos_restaurante')) || [];
    pedidos_actuales.push(nuevoPedido);
    localStorage.setItem('pedidos_restaurante', JSON.stringify(pedidos_actuales));

    alert("🚀 ¡Pedido mandado a cocina de inmediato!");
    carrito = [];
    actualizarCarrito();
}

function renderAdmin() {
    const listaCocina = document.getElementById('lista-cocina');
    const listaCaja = document.getElementById('lista-caja');
    if (!listaCocina || !listaCaja) return;

    const pedidos = JSON.parse(localStorage.getItem('pedidos_restaurante')) || [];
    listaCocina.innerHTML = '';
    listaCaja.innerHTML = '';

    if (pedidos.length === 0) {
        listaCocina.innerHTML = '<p style="color:#666; text-align:center;">No hay órdenes pendientes.</p>';
        listaCaja.innerHTML = '<p style="color:#666; text-align:center;">No hay cuentas pendientes.</p>';
        return;
    }

    pedidos.forEach(p => {
        const ticket = document.createElement('div');
        ticket.className = 'ticket-box';
        ticket.innerHTML = `
            <button class="btn-delete" onclick="eliminarTicket(${p.id})" style="float:right;">X</button>
            <strong>Mesa: ${p.mesa}</strong> | <small>Tel: ${p.telefono}</small><br>
            <p style="margin: 5px 0;">${p.productos}</p>
            <strong>Total: $${p.total}</strong> | Método: <span style="color:#ffb74d;">${p.pago}</span><br>
        `;

        if (p.estado === 'cocina') {
            ticket.className += ' prod-cocina';
            ticket.innerHTML += `<button class="btn-warning" onclick="cambiarEstado(${p.id}, 'caja')" style="margin-top:10px;">👨‍🍳 Listo -> Pasar a Caja</button>`;
            listaCocina.appendChild(ticket);
        } else if (p.estado === 'caja') {
            ticket.className += ' prod-barra';
            ticket.innerHTML += `<button class="btn-success" onclick="cambiarEstado(${p.id}, 'completado')" style="margin-top:10px;">💰 Cobrar y Archivar</button>`;
            listaCaja.appendChild(ticket);
        }
    });
}

function cambiarEstado(id, nuevoEstado) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos_restaurante')) || [];
    pedidos = pedidos.map(p => {
        if (p.id === id) p.estado = nuevoEstado;
        return p;
    });

    // Filtra las que ya se completaron (se archivan/eliminan del flujo activo)
    const pedidosFiltrados = pedidos.filter(p => p.estado !== 'completado');
    localStorage.setItem('pedidos_restaurante', JSON.stringify(pedidosFiltrados));
    renderAdmin();
}

function eliminarTicket(id) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos_restaurante')) || [];
    pedidos = pedidos.filter(p => p.id !== id);
    localStorage.setItem('pedidos_restaurante', JSON.stringify(pedidos));
    renderAdmin();
}
