// Índice dos mapas do site, gerado no build.
import { sitemapIndexXml, xmlResponse } from "@/seo/sitemap";

export const dynamic = "force-static";

export function GET(): Response {
  return xmlResponse(sitemapIndexXml());
}
