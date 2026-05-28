#!/bin/bash

# Configuración
FECHA=$(date +%Y%m%d_%H%M%S)
RUTA_PROYECTO="/home/kaibaman2/proyectos/sistema-restaurante/backend"
RESPALDO_NOM="restaurante_bak_$FECHA.tar.gz"
IP_CELULAR="100.xx.xx.xx" # <-- AQUÍ PONES LA IP DE TAILSCALE DE TU GALAXY M11
PUERTO_TERMUX="8022"      # Puerto por defecto de SSH en Termux

echo "📦 Comprimiendo base de datos del restaurante..."
tar -czf /tmp/$RESPALDO_NOM -C $RUTA_PROYECTO restaurante.db

echo "🚀 Enviando respaldo al Galaxy M11 vía Tailscale..."
scp -P $PUERTO_TERMUX /tmp/$RESPALDO_NOM termux@$IP_CELULAR:~/backups/

# Limpiar archivo temporal en la PC para no llenar la USB
rm /tmp/$RESPALDO_NOM

echo "✅ ¡Respaldo completado con éxito en el celular!"
