// Escolha de idioma na raiz "/" (FDD 001 F1, RF-I18N-02). Roda antes da pintura.
// Ordem: escolha salva > idioma do navegador > inglês. Só a raiz redireciona.
// Sem JavaScript, ou se algo falhar aqui, a página mostra os três links.
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
    var locale = savedChoice() || browserChoice() || "en";
    window.location.replace("/" + locale + "/");
  } catch {
    // Fica na página de escolha.
  }
})();
