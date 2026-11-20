/**
 * Proxy de Google Drive para el emulador multijuego.
 *
 * Expone dos acciones:
 *   action=list&pack=1            -> { ok:true, roms:[{name,size}, ...] }
 *   action=rom&pack=1&name=X.gbc  -> { ok:true, name, data:"<base64>" }
 *
 * Se usa JSONP (callback=...) en vez de CORS: Google Drive no manda
 * Access-Control-Allow-Origin, pero un <script src> entre dominios sí
 * funciona siempre.
 *
 * ---------------------------------------------------------------
 * CONFIGURACIÓN
 * ---------------------------------------------------------------
 * Para el pack 1 podés usar:
 *   - folderId: ID de la carpeta "1" (la que contiene 1.zip), o
 *   - zipId:    ID directo del archivo 1.zip.
 * Si folderId está vacío se usa zipId. El link que pasaste ya está
 * cargado como zipId.
 */

var PACKS = {
  1: {
    label: 'GBC',
    folderId: '',
    zipId: '1fCZ6Sc38pv9Q-U_Namdz1pRuh5pKST6Q'
  }
  // 2: { label: 'GB', folderId: '...', zipId: '' }
};

// Cache en memoria del ZIP ya descomprimido (por instancia del script).
var _entries = {};


function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  var cb = String(p.callback || 'callback').replace(/[^A-Za-z0-9_$.]/g, '');
  var data;

  try {
    var action = p.action || 'list';
    var pack = parseInt(p.pack, 10) || 1;

    if (action === 'list') {
      data = { ok: true, pack: pack, roms: listRoms(pack) };
    } else if (action === 'rom') {
      var name = String(p.name || '');
      data = { ok: true, pack: pack, name: name, data: getRom(pack, name) };
    } else {
      throw new Error('Acción desconocida: ' + action);
    }
  } catch (err) {
    data = { ok: false, error: String(err && err.message ? err.message : err) };
  }

  return ContentService
    .createTextOutput(cb + '(' + JSON.stringify(data) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}


function getZipBlob(pack) {
  var cfg = PACKS[pack];
  if (!cfg) throw new Error('Pack ' + pack + ' no configurado en el script');

  if (cfg.folderId) {
    var files = DriveApp.getFolderById(cfg.folderId).getFiles();
    while (files.hasNext()) {
      var f = files.next();
      if (/\.zip$/i.test(f.getName())) return f.getBlob();
    }
    throw new Error('No hay ningún .zip en la carpeta del pack ' + pack);
  }

  if (!cfg.zipId) throw new Error('El pack ' + pack + ' no tiene folderId ni zipId');
  return DriveApp.getFileById(cfg.zipId).getBlob();
}


function getEntries(pack) {
  if (!_entries[pack]) {
    var blobs = Utilities.unzip(getZipBlob(pack));
    var out = [];
    for (var i = 0; i < blobs.length; i++) {
      var n = blobs[i].getName();
      if (/\.(gb|gbc)$/i.test(n)) {
        out.push({ name: n, bytes: blobs[i].getBytes() });
      }
    }
    if (!out.length) throw new Error('El ZIP del pack ' + pack + ' no tiene ROMs .gb/.gbc');
    _entries[pack] = out;
  }
  return _entries[pack];
}


function listRoms(pack) {
  return getEntries(pack).map(function (e) {
    return { name: e.name, size: e.bytes.length };
  });
}


function getRom(pack, name) {
  var arr = getEntries(pack);
  var wanted = String(name).toLowerCase();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name.toLowerCase() === wanted) {
      return Utilities.base64Encode(arr[i].bytes);
    }
  }
  throw new Error('ROM no encontrada en el pack ' + pack + ': ' + name);
}


// Prueba rápida: ejecutar desde el editor para ver el listado del pack 1.
function testList() {
  Logger.log(JSON.stringify(listRoms(1), null, 2));
}
