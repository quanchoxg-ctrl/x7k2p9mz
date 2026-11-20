# Registro de accesos

Cada vez que se abre la web (y cada vez que se cambia de ROM) se agrega una
fila a una planilla de Google con: fecha, pack, ROM, URL, referer, IP,
ciudad, país, dispositivo, navegador, sistema, idioma, zona horaria,
pantalla, viewport y User-Agent.

## Armarlo (una sola vez)

1. Entrá a **https://script.google.com** y creá un **proyecto nuevo**.
2. Borra lo que viene en `Code.gs` y pegá el contenido de este archivo
   `logging/Code.gs`. Guardá con **Ctrl+S**.
3. Arriba a la derecha: **Implementar → Nueva implementación**.
4. Tipo: **Aplicación web**. Completá:
   - Descripción: `registro-accesos`
   - **Ejecutar como: Yo**
   - **Quién tiene acceso: Cualquiera**
5. **Implementar**. Si sale "esta app no está verificada":
   *Configuración avanzada → Ir a registro-accesos (no seguro) → Permitir*.
6. Copiá la URL que termina en **/exec** y pasamela: yo la pongo en
   `LOG_URL` dentro del `index.html` y hago push.

## Dónde verlo

La primera visita crea automáticamente una planilla llamada
**"Registro de accesos GB"** en tu Google Drive, y te envía el link por correo.
También la podés buscar por ese nombre en Drive.

Si querés probar antes sin esperar una visita: en el editor de Apps Script
ejecutá `testRegistro` y mirá el log; te muestra la URL de la planilla.
