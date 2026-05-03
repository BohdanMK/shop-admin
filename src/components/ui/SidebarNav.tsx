import { Fragment, useState } from 'react'
import type { NavItem } from '@/dto/types/navigations.dto'
import { useHasActiveChild } from '@/hooks/useHasActiveChild'
import { NavLink, useMatch } from 'react-router-dom'
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'

export type MatchType = 'exact' | 'prefix'



type SidebarNavProps = {
    items: NavItem[]
}

type SidebarNavLinkItemProps = {
    item: NavItem
    depth: number
}

function SidebarNavLinkItem({ item, depth }: SidebarNavLinkItemProps) {
    if (!item.to) {
        return null
    }

    const Icon = item.icon

    const exactMatch = Boolean(useMatch({ path: item.to, end: true }))
    const nestedMatch = item.to === '/'
        ? false
        : Boolean(useMatch({ path: `${item.to}/*`, end: false }))

    const isSelected = item.match === 'exact' ? exactMatch : exactMatch || nestedMatch

    return (
        <ListItemButton
            component={NavLink}
            to={item.to}
            selected={isSelected}
            sx={{ pl: 2 + depth * 2 }}
        >
            {Icon && (
                <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon fontSize="small" />
                </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
        </ListItemButton>
    )
}

type SidebarNavItemProps = {
    item: NavItem
    depth: number
}

function SidebarNavItem({ item, depth }: SidebarNavItemProps) {
    const hasActiveChild = useHasActiveChild(item.children || [])
    const [open, setOpen] = useState(hasActiveChild)
    const Icon = item.icon

    if (item.children?.length) {
        return (
            <Fragment>
                <ListItemButton
                    onClick={() => setOpen((prev) => !prev)}
                    sx={{ pl: 2 + depth * 2 }}
                >
                    {Icon && (
                        <ListItemIcon sx={{ minWidth: 36 }}>
                            <Icon fontSize="small" />
                        </ListItemIcon>
                    )}
                    <ListItemText primary={item.label} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        {item.children.map((child) => (
                            <SidebarNavItem key={`${item.label}-${child.label}`} item={child} depth={depth + 1} />
                        ))}
                    </List>
                </Collapse>
            </Fragment>
        )
    }

    if (!item.to) {
        return null
    }

    return <SidebarNavLinkItem item={item} depth={depth} />
}

export default function SidebarNav({ items }: SidebarNavProps) {
    return (
        <List>
            {items.map((item) => (
                <SidebarNavItem key={item.label} item={item} depth={0} />
            ))}
        </List>
    )
}
