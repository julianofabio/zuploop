// Tela "catalog". O conteúdo completo chega nas tarefas seguintes da 001.
import { getTranslations } from "next-intl/server";

export async function CatalogScreen() {
  const t = await getTranslations("catalog");
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
