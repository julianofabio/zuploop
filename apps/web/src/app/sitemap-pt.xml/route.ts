// Mapa do site em pt, gerado no build.
import { sitemapXml, xmlResponse } from "@/seo/sitemap";

export const dynamic = "force-static";

export function GET(): Response {
  return xmlResponse(sitemapXml("pt"));
}
