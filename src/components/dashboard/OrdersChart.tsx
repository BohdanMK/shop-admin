import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next'
import { BarChart } from '@mui/x-charts/BarChart';

interface OrdersChartProps {
    chartData: {
        days: number[]
        orders: number[]
        revenue: number[]
    },
    totalOrders?: number
}

const OrdersChart = ({ chartData, totalOrders }: OrdersChartProps) => {
    const { t } = useTranslation(['dashboard'])
    const isEmpty = totalOrders === 0;
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {t('dashboard:monthOrdersChart', { count: totalOrders ?? 0 })}
                </Typography>
                {isEmpty ? (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height={300}
                    >
                        <Typography color="text.secondary">
                            {t('dashboard:monthOrdersEmpty')}
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%' }}>
                        <BarChart
                            xAxis={[{ data: chartData.days }]}
                            series={[{ data: chartData.orders }]}
                            width={undefined}
                            height={300}
                            sx={{ width: '100%' }}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default OrdersChart