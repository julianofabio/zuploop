// Página não encontrada do idioma (FDD 001 §7): o que houve e para onde ir.
import { AlertIcon } from "@zuploop/ui";
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import styles from "./NotFoundScreen.module.css";

export function NotFoundScreen() {
  const t = useTranslations("errors");
  return (
    <div className={styles.page}>
      <span className={styles.icon} aria-hidden="true">
        <AlertIcon size="lg" />
      </span>
      <h1 className={styles.title}>{t("notFoundTitle")}</h1>
      <p className={styles.text}>{t("notFoundText")}</p>
      <ul className={styles.links}>
        <li>
          <LocalizedLink page="home">{t("goHome")}</LocalizedLink>
        </li>
        <li>
          <LocalizedLink page="catalog">{t("goGames")}</LocalizedLink>
        </li>
      </ul>
    </div>
  );
}
