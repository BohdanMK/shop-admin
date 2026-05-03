import type { ReactNode } from "react";
import { Box } from "@mui/material";

interface TabPanelProps {
    children?: ReactNode;
    value: number;
    index: number;
    dataTestId?: string;
}

const TabPanel = ({ children, value, index, dataTestId }: TabPanelProps) => (
    <Box
        role="tabpanel"
        hidden={value !== index}
        id={`product-tabpanel-${index}`}
        aria-labelledby={`product-tab-${index}`}
        data-testid={dataTestId}
    >
        {value === index ? children : null}
    </Box>
);

export default TabPanel;