'use client';

import React, { useState } from 'react';
import {
   Box,
   Typography,
   Grid,
   CircularProgress,
   Button,
   Popover,
   Stack,
   Card,
   Chip,
} from '@mui/material';
import {
   TrendingUp,
   Users,
   IndianRupee,
   Calendar,
   Wallet,
   CreditCard,
   Download,
   ChevronDown,
   Clock,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/api/useDashboard';
import {
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
   PieChart,
   Pie,
   Cell,
   Legend,
   LineChart,
   Line,
   Area,
   BarChart,
   Bar,
   AreaChart,
} from 'recharts';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import { format, startOfMonth, endOfMonth, startOfToday, endOfToday } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

export default function DashboardPage() {
   const [dateRange, setDateRange] = useState({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
   });
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

   const { data, isLoading } = useDashboardStats(
      dateRange.startDate.toISOString(),
      dateRange.endDate.toISOString()
   );

   const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handlePopoverClose = () => {
      setAnchorEl(null);
   };

   const handleRangeChange = (ranges: RangeKeyDict) => {
      setDateRange(ranges.selection as any);
   };

   const open = Boolean(anchorEl);

   if (isLoading) {
      return (
         <Box display='flex' justifyContent='center' alignItems='center' height='80vh'>
            <CircularProgress thickness={4} />
         </Box>
      );
   }

   const summary = data?.summary || {};
   const totalRevenue = Number(summary.total_revenue || 0);
   const totalVisits = Number(summary.total_visits || 0);
   const averageConsultation = totalVisits > 0 ? Math.round(totalRevenue / totalVisits) : 0;
   const paymentBreakdown = data?.payment_breakdown || {};
   const genderBreakdown = data?.demographics?.gender || {};
   const rawAgeData = (data?.demographics?.age_distribution || data?.demographics?.age || []) as Array<{
      range?: string;
      group?: string;
      count?: number;
   }>;
   const ageData = rawAgeData.map((item) => ({
      range: item.range || item.group || 'N/A',
      count: Number(item.count || 0),
   }));
   const genderData = [
      {
         name: 'Male',
         value: Number(genderBreakdown.male || genderBreakdown.Male || 0),
      },
      {
         name: 'Female',
         value: Number(genderBreakdown.female || genderBreakdown.Female || 0),
      },
      {
         name: 'Other',
         value: Number(genderBreakdown.other || genderBreakdown.Other || 0),
      },
   ];
   const pieData = Object.entries(paymentBreakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(value || 0),
   }));
   const dailyRevenueData = (data?.daily_revenue || []).map((entry: { day: string; revenue: number }) => ({
      ...entry,
      revenue: Number(entry.revenue || 0),
   }));
   const monthlyRevenueData = (data?.monthly_revenue || []).map((entry: { month: string; revenue: number }) => ({
      ...entry,
      revenue: Number(entry.revenue || 0),
      monthLabel: entry.month ? format(new Date(`${entry.month}-01`), 'MMM yyyy') : 'N/A',
   }));

   const stats = [
      {
         title: 'Total Patients',
         value: summary.total_patients || 0,
         subtitle: `${summary.new_patients || 0} New Registrations`,
         icon: <Users size={24} />,
         color: '#2F5FA5',
         bgcolor: '#F0F7FF',
      },
      {
         title: 'Total Revenue',
         value: formatCurrency(totalRevenue),
         subtitle: 'Gross revenue in range',
         icon: <IndianRupee size={24} />,
         color: '#22C55E',
         bgcolor: '#F0FDF4',
      },
      {
         title: 'Cash Revenue',
         value: formatCurrency(Number(summary.cash_revenue || 0)),
         subtitle: 'Physical payments',
         icon: <Wallet size={24} />,
         color: '#F59E0B',
         bgcolor: '#FFFBEB',
      },
      {
         title: 'Digital Revenue',
         value: formatCurrency(Number(summary.online_revenue || 0)),
         subtitle: 'UPI & Card transactions',
         icon: <CreditCard size={24} />,
         color: '#06B6D4',
         bgcolor: '#ECFEFF',
      },
      {
         title: 'Avg. Consultation',
         value: formatCurrency(averageConsultation),
         subtitle: `${totalVisits} Total Visits`,
         icon: <Clock size={24} />,
         color: '#EF4444',
         bgcolor: '#FEF2F2',
      },
      // {
      //    title: 'Average Age',
      //    value: `${summary.avg_age || 0} Yrs`,
      //    subtitle: 'Patient demographic',
      //    icon: <Users size={24} />,
      //    color: '#6366F1',
      //    bgcolor: '#EEF2FF',
      // },
   ];

   const COLORS = ['#2F5FA5', '#5CC6C4', '#F59E0B', '#EF4444'];

   return (
      <Box maxWidth="xl" mx="auto">
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={2}>
            <Box>
               <Typography variant='h4' fontWeight='800' color="primary" gutterBottom>
                  Clinic Insights
               </Typography>
               <Typography variant='body1' color='text.secondary'>
                  Real-time monitoring of your clinic&apos;s performance and patient growth.
               </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
               <Button
                  variant='outlined'
                  startIcon={<Calendar size={18} />}
                  endIcon={<ChevronDown size={14} />}
                  onClick={handlePopoverOpen}
                  sx={{
                     borderRadius: '12px',
                     px: 2.5,
                     height: 48,
                     bgcolor: 'white',
                     borderColor: '#E3EEF7',
                     color: '#475569',
                     '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                  }}
               >
                  {format(dateRange.startDate, 'MMM dd')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
               </Button>
               <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', mt: 1, border: '1px solid #E3EEF7' } }}
               >
                  <Box p={1}>
                     <DateRangePicker
                        ranges={[dateRange]}
                        onChange={handleRangeChange}
                        moveRangeOnFirstSelection={false}
                        rangeColors={['#2F5FA5']}
                     />
                  </Box>
               </Popover>
               <Button
                  variant="outlined"
                  onClick={() => setDateRange({
                     startDate: startOfToday(),
                     endDate: endOfToday(),
                     key: 'selection'
                  })}
                  sx={{ borderRadius: '12px', height: 48, px: 3, borderColor: '#E3EEF7', color: '#475569' }}
               >
                  Today
               </Button>

               <Button
                  variant='contained'
                  startIcon={<Download size={18} />}
                  onClick={() => {
                     const start = dateRange.startDate.toISOString();
                     const end = dateRange.endDate.toISOString();
                     window.open(`${process.env.NEXT_PUBLIC_API_URL}/export/bills?format=xlsx&start_date=${start}&end_date=${end}`, '_blank');
                  }}
                  sx={{ borderRadius: '12px', height: 48, px: 3 }}
               >
                  Export Reports
               </Button>
            </Stack>
         </Box>

         <Grid container spacing={1} mb={5}>
            {stats.map((stat, i) => (
               <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                  <Card
                     elevation={0}
                     sx={{
                        p: 3,
                        borderRadius: '24px',
                        border: '1px solid #E3EEF7',
                        background: 'white',
                        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.02)',
                        transition: 'transform 0.2s',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)' }
                     }}>
                     <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ bgcolor: stat.bgcolor, color: stat.color, p: 2, borderRadius: '16px', display: 'flex' }}>
                           {stat.icon}
                        </Box>
                        <Box>
                           <Typography variant='caption' color='text.secondary' fontWeight='700' sx={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                              {stat.title}
                           </Typography>
                           <Typography variant='h5' fontWeight='800' color="#0F172A" sx={{ mt: 0.2 }}>
                              {stat.value}
                           </Typography>
                        </Box>
                     </Stack>
                     <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                        <Typography variant='caption' color='text.secondary' display="flex" alignItems="center" gap={0.5}>
                           <TrendingUp size={12} color="#22C55E" />
                           <span style={{ fontWeight: 600 }}>{stat.subtitle}</span>
                        </Typography>
                     </Box>
                  </Card>
               </Grid>
            ))}
         </Grid>

         <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
               <Card
                  elevation={0}
                  sx={{
                     p: 4,
                     borderRadius: '24px',
                     border: '1px solid #E3EEF7',
                     height: 500,
                  }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                     <Typography variant='h6' fontWeight='800' color="#0F172A">
                        Revenue Intelligence
                     </Typography>
                     <Chip label="Daily View" size="small" sx={{ fontWeight: 700, bgcolor: '#F1F5F9' }} />
                  </Box>
                  <ResponsiveContainer width='100%' height='85%'>
                     <AreaChart data={dailyRevenueData}>
                        <defs>
                           <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2F5FA5" stopOpacity={0.1} />
                              <stop offset="95%" stopColor="#2F5FA5" stopOpacity={0} />
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                           dataKey='day'
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                           tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                           dy={10}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                           tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                           formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Area
                           type="monotone"
                           dataKey='revenue'
                           stroke="#2F5FA5"
                           strokeWidth={3}
                           fillOpacity={1}
                           fill="url(#colorRevenue)"
                        />
                     </AreaChart>
                  </ResponsiveContainer>
               </Card>
            </Grid>

            <Grid item xs={12} md={4}>
               <Card
                  elevation={0}
                  sx={{
                     p: 4,
                     borderRadius: '24px',
                     border: '1px solid #E3EEF7',
                     height: 500,
                     display: 'flex',
                     flexDirection: 'column'
                  }}>
                  <Typography variant='h6' fontWeight='800' color="#0F172A" mb={4}>
                     Payment Acquisition
                  </Typography>
                  <ResponsiveContainer width='100%' height='100%'>
                     <PieChart>
                        <Pie
                           data={pieData}
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={4} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="circle" />
                     </PieChart>
                  </ResponsiveContainer>
               </Card>
            </Grid>

            <Grid item xs={12} md={6}>
               <Card
                  elevation={0}
                  sx={{
                     p: 4,
                     borderRadius: '24px',
                     border: '1px solid #E3EEF7',
                     height: 450,
                  }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                     <Typography variant='h6' fontWeight='800' color="#0F172A">
                        Age Distribution
                     </Typography>
                     <Chip label="Patient Demographics" size="small" sx={{ fontWeight: 700, bgcolor: '#F1F5F9' }} />
                  </Box>
                  <ResponsiveContainer width='100%' height='85%'>
                     <BarChart data={ageData.length > 0 ? ageData : [{ range: 'N/A', count: 0 }]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis
                           dataKey="range"
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                           dy={10}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                        />
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                        />
                        <Bar
                           dataKey="count"
                           fill="#5CC6C4"
                           radius={[6, 6, 0, 0]}
                           barSize={30}
                        />
                     </BarChart>
                  </ResponsiveContainer>
               </Card>
            </Grid>

            <Grid item xs={12} md={6}>
               <Card
                  elevation={0}
                  sx={{
                     p: 4,
                     borderRadius: '24px',
                     border: '1px solid #E3EEF7',
                     height: 450,
                     display: 'flex',
                     flexDirection: 'column'
                  }}>
                  <Typography variant='h6' fontWeight='800' color="#0F172A" mb={4}>
                     Gender Breakdown
                  </Typography>
                  <ResponsiveContainer width='100%' height='100%'>
                     <PieChart>
                        <Pie
                           data={genderData}
                           innerRadius={70}
                           outerRadius={100}
                           paddingAngle={8}
                           dataKey="value"
                        >
                           {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} radius={4} />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                        />
                        <Legend verticalAlign="bottom" iconType="circle" />
                     </PieChart>
                  </ResponsiveContainer>
               </Card>
            </Grid>

            <Grid item xs={12}>
               <Card
                  elevation={0}
                  sx={{
                     p: 4,
                     borderRadius: '24px',
                     border: '1px solid #E3EEF7',
                     height: 450,
                  }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                     <Typography variant='h6' fontWeight='800' color="#0F172A">
                        Growth Trajectory (Monthly)
                     </Typography>
                     <Stack direction="row" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#5CC6C4', alignSelf: 'center' }} />
                        <Typography variant="caption" fontWeight="700" color="textSecondary">Trend Line</Typography>
                     </Stack>
                  </Box>
                  <ResponsiveContainer width='100%' height='85%'>
                     <LineChart data={monthlyRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                           dataKey='monthLabel'
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                           dy={10}
                        />
                        <YAxis
                           axisLine={false}
                           tickLine={false}
                           tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                           tickFormatter={(value) => `₹${value}`}
                        />
                        <Tooltip
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                        />
                        <Line
                           type="monotone"
                           dataKey="revenue"
                           stroke="#5CC6C4"
                           strokeWidth={4}
                           dot={{ r: 6, fill: '#5CC6C4', strokeWidth: 2, stroke: 'white' }}
                           activeDot={{ r: 8, strokeWidth: 0 }}
                        />
                     </LineChart>
                  </ResponsiveContainer>
               </Card>
            </Grid>
         </Grid>
      </Box>
   );
}
