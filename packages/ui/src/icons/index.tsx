// Conjunto base de ícones (padrão de interface §8), desenhados para o ZupLoop.
import { createIcon } from "./create-icon";

export { createIcon, type IconComponent, type IconProps, type IconSize } from "./create-icon";

export const HomeIcon = createIcon(
  "HomeIcon",
  <path d="M4 10.2 12 3.5l8 6.7V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
);

export const GamesIcon = createIcon(
  "GamesIcon",
  <>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </>,
);

export const ChallengeIcon = createIcon(
  "ChallengeIcon",
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>,
);

export const SettingsIcon = createIcon(
  "SettingsIcon",
  <>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </>,
);

export const BackIcon = createIcon("BackIcon", <path d="M19 12H5M12 19l-7-7 7-7" />);

export const CloseIcon = createIcon("CloseIcon", <path d="M6 6l12 12M18 6 6 18" />);

export const HelpIcon = createIcon(
  "HelpIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01" />
  </>,
);

export const HeartIcon = createIcon(
  "HeartIcon",
  <path d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.9 3.8 4.5 7.3 4.5c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3.5 0 5.7 3.4 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3z" />,
);

export const ShareIcon = createIcon(
  "ShareIcon",
  <>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="18" cy="19" r="2.5" />
    <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" />
  </>,
);

export const PrintIcon = createIcon(
  "PrintIcon",
  <>
    <path d="M7 9V3h10v6" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <rect x="7" y="14" width="10" height="7" rx="1" />
  </>,
);

export const HintIcon = createIcon(
  "HintIcon",
  <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.4.3.6.8.6 1.3V16h6v-.9c0-.5.2-1 .6-1.3A6 6 0 0 0 12 3z" />,
);

export const UndoIcon = createIcon(
  "UndoIcon",
  <path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
);

export const EraseIcon = createIcon(
  "EraseIcon",
  <>
    <path d="M21 5H9l-7 7 7 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    <path d="M17 9l-6 6M11 9l6 6" />
  </>,
);

export const TimeIcon = createIcon(
  "TimeIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);

export const StreakIcon = createIcon(
  "StreakIcon",
  <path d="M12 22c4 0 7-2.8 7-6.8 0-3.6-2.4-5.9-4-8.2-.5 2-1.6 3.2-3 3.7.4-3.2-1-6.3-3.5-7.7.2 3.3-1.5 5.3-3 7.2C4.3 12 5 13.8 5 15.2 5 19.2 8 22 12 22z" />,
);

export const AccountIcon = createIcon(
  "AccountIcon",
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5" />
  </>,
);

export const LanguageIcon = createIcon(
  "LanguageIcon",
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </>,
);

export const LockIcon = createIcon(
  "LockIcon",
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
);

export const CheckIcon = createIcon("CheckIcon", <path d="M5 12.5l4.5 4.5L19 7" />);

export const AlertIcon = createIcon(
  "AlertIcon",
  <>
    <path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
    <path d="M12 10v4M12 17h.01" />
  </>,
);

export const PlusIcon = createIcon("PlusIcon", <path d="M12 5v14M5 12h14" />);
