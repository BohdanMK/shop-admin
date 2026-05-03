import { type SyntheticEvent, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getSafeTabValue } from "@/utils/getSafeTabValue";
import type { TabKeyItem } from "@/types/tab";

export const useUrlTabs = (tabs: TabKeyItem[], paramName = "tab") => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = getSafeTabValue(searchParams.get(paramName), tabs);

    const handleTabChange = useCallback(
        (_event: SyntheticEvent, newValue: number) => {
            const tabKey = tabs[newValue]?.key ?? tabs[0].key;
            const next = new URLSearchParams(searchParams);
            next.set(paramName, tabKey);
            setSearchParams(next, { replace: true });
        },
        [paramName, searchParams, setSearchParams, tabs]
    );

    return { activeTab, handleTabChange };
};