// Logotipo do ZupLoop: grade 2×2 em verde com o quadrado dourado no centro (padrão §3.2).
import styles from "./Logo.module.css";

export interface LogoProps {
  /** Nome do produto, vindo dos arquivos de idioma. */
  name: string;
}

export function Logo({ name }: LogoProps) {
  return (
    <span className={styles.logo}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect className={styles.tile} x="0" y="0" width="15" height="15" rx="4" />
        <rect className={styles.tile} x="17" y="0" width="15" height="15" rx="4" />
        <rect className={styles.tile} x="0" y="17" width="15" height="15" rx="4" />
        <rect className={styles.tile} x="17" y="17" width="15" height="15" rx="4" />
        <rect className={styles.center} x="10" y="10" width="12" height="12" rx="2" />
      </svg>
      <span className={styles.name}>{name}</span>
    </span>
  );
}
