#!/bin/bash

# Proyecto #hamburguesas - Script de Configuración Maestra PWA
echo "=== Limpiando y configurando entorno para #hamburguesas ==="

# 1. Crear directorios necesarios
mkdir -p imagenes

# 2. CREAR EL MANIFEST.JSON (Identidad de tu PWA)
cat << 'EOF' > manifest.json
{
  "short_name": "Burgers",
  "name": "Hamburguesas PWA",
  "icons": [
    {
      "src": "imagenes/icono.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "theme_color": "#FF5733"
}
EOF

# 3. CREAR EL SERVICE WORKER (sw.js - Control Offline)
cat << 'EOF' > sw.js
const CACHE_NAME = 'burgers-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalar el Service Worker y guardar en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Responder desde el caché si está offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
EOF

# 4. CREAR EL INDEX.HTML (Base con registro de PWA)
cat << 'EOF' > index.html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hamburguesas PWA</title>
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#FF5733">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; background: #f4f4f4; padding: 50px; }
        h1 { color: #FF5733; }
    </style>
</head>
<body>
    <h1>¡Bienvenidos a #hamburguesas! 🍔</h1>
    <p>Si estás en localhost o HTTPS, deberías ver la opción de instalar esta PWA.</p>

    <script>
        // Registro del Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('¡Service Worker registrado con éxito!', reg))
                    .catch(err => console.error('Error al registrar el SW:', err));
            });
        }
    </script>
</body>
</html>
EOF

# 5. Mover todo a la carpeta de Apache y aplicar permisos correctos
echo "Moviendo archivos a /var/www/html/..."
sudo cp -r * /var/www/html/

echo "Asignando permisos para Apache..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# 6. Reiniciar Apache para asegurar cambios
sudo a2enmod rewrite > /dev/null 2>&1
sudo systemctl restart apache2

echo "------------------------------------------------"
echo "¡Todo listo, carnal! Entorno PWA reconstruido."
echo "Archivos generados: index.html, manifest.json, sw.js"
echo "Permisos de Apache aplicados correctamente."
echo "------------------------------------------------"
