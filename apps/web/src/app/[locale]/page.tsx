// Página inicial de cada idioma. O conteúdo completo (jogos a partir dos manifestos) chega na T023.
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("intro")}</p>
    </div>
  );
}
