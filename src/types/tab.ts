import type { ReactNode } from "react";

export interface TabKeyItem {
    key: string;
}

export interface TabConfig extends TabKeyItem {
    label: string;
    content: ReactNode;
    enabled?: boolean;
}