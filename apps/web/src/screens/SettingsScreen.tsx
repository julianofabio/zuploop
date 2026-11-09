// Tela "settings". O conteúdo completo chega nas tarefas seguintes da 001.
import { getTranslations } from "next-intl/server";

export async function SettingsScreen() {
  const t = await getTranslations("settings");
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
