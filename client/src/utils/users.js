export const USER_LIST = ["Alan", "Bob", "Carol", "Dean", "Elin"];

const USER_PALETTES = {
  Alan: {
    avatarBg: "bg-emerald-600",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-800",
    mentionBg: "bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-800/80"
  },
  Bob: {
    avatarBg: "bg-blue-600",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200 dark:border-blue-800",
    mentionBg: "bg-blue-100/90 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300/70 dark:border-blue-800/80"
  },
  Carol: {
    avatarBg: "bg-rose-600",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200 dark:border-rose-800",
    mentionBg: "bg-rose-100/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300/70 dark:border-rose-800/80"
  },
  Dean: {
    avatarBg: "bg-amber-600",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-800",
    mentionBg: "bg-amber-100/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300/70 dark:border-amber-800/80"
  },
  Elin: {
    avatarBg: "bg-purple-600",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200 dark:border-purple-800",
    mentionBg: "bg-purple-100/90 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300/70 dark:border-purple-800/80"
  }
};

const DEFAULT_PALETTE = {
  avatarBg: "bg-slate-600",
  badgeBg: "bg-slate-50 dark:bg-slate-800",
  badgeText: "text-slate-700 dark:text-slate-200",
  badgeBorder: "border-slate-200 dark:border-slate-700",
  mentionBg: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
};

export function getRandomUser() {
  const index = Math.floor(Math.random() * USER_LIST.length);
  return USER_LIST[index];
}

export function getUserPalette(user) {
  return USER_PALETTES[user] || DEFAULT_PALETTE;
}

export function getUserInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
