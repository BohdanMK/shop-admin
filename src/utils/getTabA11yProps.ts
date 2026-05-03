export const getTabA11yProps = (index: number) => ({
    id: `product-tab-${index}`,
    "aria-controls": `product-tabpanel-${index}`,
});