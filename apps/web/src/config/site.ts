// Endereço público do site: a única configuração definida no build, porque entra no HTML
// (canonical, hreflang, mapa do site). Vale https://zuploop.com também no teste local (FDD 001 §6.6).
export const SITE_URL = process.env.SITE_URL ?? "https://zuploop.com";
