import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
    title: string;
    path?: string;
    type: 'link' | 'label';
}

interface BreadcrumbsListProps {
    list: BreadcrumbItem[];
}

const BasicBreadcrumbs = ({list}: BreadcrumbsListProps) => {
    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
            {list.map((item, index) => {
                // like link
                if (item.type === 'link' && item.path) {
                    return (
                        <Link
                            key={index}
                            underline="hover"
                            color="inherit"
                            component={RouterLink}
                            to={item.path}
                        >
                            {item.title}
                        </Link>
                    );
                }
                // like label
                return (<Typography key={index} sx={{ color: 'text.primary' }}>{item.title}</Typography>
                );
            })}
        </Breadcrumbs>
    );
}

export default BasicBreadcrumbs;