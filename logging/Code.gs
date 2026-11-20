/**
 * Registro de accesos -> Google Sheets.
 * Pegar en un proyecto nuevo de https://script.google.com
 * Deploy -> New deployment -> Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Después pegar la URL /exec en LOG_URL del index.html.
 *
 * La primera visita crea sola la planilla "Registro de accesos GB" en tu
 * Drive y te manda la URL por correo. No hace falta crearla antes.
 */

var SHEET_NAME = 'Registro de accesos GB';
var HEADERS = [
  'Fecha', 'Evento', 'Pack', 'ROM', 'URL', 'Referer', 'IP',
  'Ciudad', 'Pais', 'Dispositivo', 'Navegador', 'Sistema',
  'Idioma', 'Zona horaria', 'Pantalla', 'Viewport', 'User-Agent'
];


function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  try {
    var sh = getSheet().getSheets()[0];
    if (sh.getLastRow() === 0 || sh.getRange('A1').getValue() === '') {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sh.setColumnWidth(1, 180);
      sh.setColumnWidth(4, 140);
      sh.setColumnWidth(7, 130);
      sh.setColumnWidth(17, 320);
    }
    sh.appendRow(HEADERS.map(function (_, i) {
      var keys = ['ts','event','pack','rom','page','ref','ip','city','country',
                  'device','browser','os','lang','tz','screen','viewport','ua'];
      return p[keys[i]] || '';
    }));
    return ContentService.createTextOutput('ok')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}


function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  var ss = SpreadsheetApp.create(SHEET_NAME);
  props.setProperty('SHEET_ID', ss.getId());
  try {
    MailApp.sendEmail(
      Session.getActiveUser().getEmail(),
      'Planilla de accesos Game Boy',
      'Se creó la planilla de registros: ' + ss.getUrl()
    );
  } catch (e) {}
  return ss;
}


// Prueba rápida desde el editor: ejecutar y verificar que se creó la planilla.
function testRegistro() {
  var ss = getSheet();
  Logger.log(ss.getUrl());
}
