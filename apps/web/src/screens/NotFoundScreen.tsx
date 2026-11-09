// Tela "errors". O conteúdo completo chega nas tarefas seguintes da 001.
import { getTranslations } from "next-intl/server";

export async function NotFoundScreen() {
  const t = await getTranslations("errors");
  return (
    <main>
      <h1>{t("notFoundTitle")}</h1>
    </main>
  );
}
