import type { TabKeyItem } from "@/types/tab";

export const getSafeTabValue = (raw: string | null, tabs: TabKeyItem[]) => {
    if (!raw) return 0;

    const keyIndex = tabs.findIndex((tab) => tab.key === raw);
    if (keyIndex >= 0) return keyIndex;

    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n < tabs.length ? n : 0;
};