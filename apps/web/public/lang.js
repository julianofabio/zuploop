// Idioma antes da pintura (FDD 001 F1 e F3, RF-I18N-02 e RF-I18N-04).
// Na raiz "/": escolhe o idioma (escolha salva > navegador > inglês) e redireciona.
// Nas páginas por idioma: nunca redireciona; só marca no <html> o idioma a sugerir,
// para a faixa "Ver em português?" ter o espaço reservado desde a primeira pintura.
// A mesma regra está em src/i18n/detect.ts. Sem JavaScript, a raiz mostra os três links.
(function () {
  "use strict";
  var SUPPORTED = ["pt", "es", "en"];
  var STORAGE_KEY = "zuploop.locale";

  function isSupported(value) {
    return typeof value === "string" && SUPPORTED.indexOf(value) !== -1;
  }

  function savedChoice() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return isSupported(value) ? value : null;
    } catch {
      // localStorage bloqueado: segue sem a escolha salva.
      return null;
    }
  }

  function browserChoice() {
    var list =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    for (var i = 0; i < list.length; i += 1) {
      var tag = typeof list[i] === "string" ? list[i].toLowerCase().split("-")[0] : "";
      if (isSupported(tag)) return tag;
    }
    return null;
  }

  try {
    var preferred = savedChoice() || browserChoice();
    var path = window.location.pathname || "/";
    if (path === "/" || path === "/index.html") {
      window.location.replace("/" + (preferred || "en") + "/");
      return;
    }
    var pageLocale = path.split("/")[1];
    if (isSupported(pageLocale) && preferred && preferred !== pageLocale) {
      document.documentElement.setAttribute("data-lang-suggest", preferred);
    }
  } catch {
    // Fica como está.
  }
})();
