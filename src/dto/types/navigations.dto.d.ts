export type NavItem = {
    label: string
    to?: string
    match?: MatchType
    icon?: ElementType
    children?: NavItem[]
}