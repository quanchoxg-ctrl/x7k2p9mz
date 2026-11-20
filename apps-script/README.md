# Proxy de Drive (Apps Script)

El navegador **no puede** bajar el ZIP directamente de Drive: `drive.google.com`
no manda cabeceras CORS. Este Web App hace de puente y devuelve los datos
por JSONP (`<script src>`), que sí funciona entre dominios.

## Armarlo (una vez)

1. Entrá a **https://script.google.com** y creá un proyecto nuevo.
2. Pegá el contenido de `Code.gs` en el editor.
3. En `PACKS[1]` ya está cargado el `zipId` del link que pasaste. Si preferís
   usar la carpeta `1` (que contiene `1.zip`), poné su ID en `folderId` y
   dejá `zipId` vacío.
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copiá la URL que termina en `/exec`.

## Conectarlo al proyecto

En `index.html` reemplazá:

```js
var DRIVE_PROXY_URL = '';
```

por:

```js
var DRIVE_PROXY_URL = 'https://script.google.com/macros/s/TU_ID/exec';
```

Hacé commit/push. La URL pública pasa a ser:

```
https://quanchoxg-ctrl.github.io/x7k2p9mz/a/1
```

## Probar el proxy solo

Pegá esto en el navegador (reemplazá la URL):

```
https://script.google.com/macros/s/TU_ID/exec?action=list&pack=1&callback=console.log
```

Debe devolver algo como:

```js
console.log({"ok":true,"pack":1,"roms":[{"name":"Amarillo.gbc","size":1048576}, ...]});
```

## Packs nuevos

Sumá otra entrada en `PACKS` (por ejemplo `2`) con su `folderId` o `zipId`,
y abrí `https://quanchoxg-ctrl.github.io/x7k2p9mz/a/2`. No hace falta tocar
el `index.html`.

> Nota: el núcleo `GameBoyCore.js` es de Game Boy / Game Boy Color. Los `.gba`
> no los puede ejecutar; el proxy lista solo `.gb` y `.gbc`.
