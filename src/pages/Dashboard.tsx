import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { useDashboardStore } from '@/store/dashboard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import OrdersChart from '@/components/dashboard/OrdersChart';

export const Dashboard = () => {
    const { t } = useTranslation(['dashboard'])
    const chartOrdersPerDayData = useDashboardStore((state) => state.chartOrdersPerDayData)
    const totals = useDashboardStore((state) => state.totals)
    const fetchStats = useDashboardStore((state) => state.fetchStats)


    useEffect(() => {
        void fetchStats()
    }, [fetchStats])

    return (
        <div>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">{t('dashboard:totalOrders', { count: totals?.totalOrders ?? 0 })}</Typography>

                        <Typography gutterBottom variant="h5" component="div">{t('dashboard:monthOrders', { count: totals?.monthOrders ?? 0 })}</Typography>

                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">{t('dashboard:totalProducts', { count: totals?.totalProducts ?? 0 })}</Typography>
                        <Typography gutterBottom variant="h5" component="div">{t('dashboard:totalCategories', { count: totals?.totalCategories ?? 0 })}</Typography>
                    </CardContent>
                </Card>
            </Box>
            <OrdersChart
                chartData={chartOrdersPerDayData}
                totalOrders={totals?.monthOrders}
            />
        </div>
    );
}

export default Dashboard