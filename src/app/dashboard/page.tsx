'use client';

import React, { useState } from 'react';
import {
   Box,
   Typography,
   Grid,
   Paper,
   CircularProgress,
   useTheme,
   Button,
   Popover,
   Stack,
} from '@mui/material';
import {
   TrendingUp,
   PeopleOutline,
   AssignmentTurnedIn,
   AttachMoney,
   CalendarToday,
   CreditCard,
   AccountBalanceWallet,
} from '@mui/icons-material';
import { useDashboardStats } from '@/hooks/api/useDashboard';
import {
   BarChart,
   Bar,
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
} from 'recharts';
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import { format, startOfMonth, endOfMonth, startOfToday, endOfToday } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

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
   
   const theme = useTheme();

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
         <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='80vh'>
            <CircularProgress />
         </Box>
      );
   }

   const summary = data?.summary || {};
   
   const stats = [
      {
         title: 'Total Patients',
         value: summary.total_patients || 0,
         subtitle: `${summary.new_patients || 0} New`,
         icon: <PeopleOutline fontSize='large' color='primary' />,
         color: theme.palette.primary.light,
      },
      {
         title: 'Total Revenue',
         value: `₹${summary.total_revenue?.toLocaleString() || 0}`,
         subtitle: 'In selected range',
         icon: <AttachMoney fontSize='large' color='success' />,
         color: theme.palette.success.light,
      },
      {
         title: 'Cash Revenue',
         value: `₹${summary.cash_revenue?.toLocaleString() || 0}`,
         subtitle: 'Cash payments',
         icon: <AccountBalanceWallet fontSize='large' color='warning' />,
         color: theme.palette.warning.light,
      },
      {
         title: 'Online Revenue',
         value: `₹${summary.online_revenue?.toLocaleString() || 0}`,
         subtitle: 'Digital payments',
         icon: <CreditCard fontSize='large' color='info' />,
         color: theme.palette.info.light,
      },
   ];

   const COLORS = [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.info.main];

   const pieData = Object.entries(data?.payment_breakdown || {}).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value as number,
   }));

   return (
      <Box>
         <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant='h4' fontWeight='bold'>
               Clinic Analytics
            </Typography>
            
            <Stack direction="row" spacing={2}>
               <Button
                  variant='outlined'
                  startIcon={<CalendarToday />}
                  onClick={handlePopoverOpen}
                  sx={{ borderRadius: 2, px: 3 }}
               >
                  {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
               </Button>
               <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
               >
                  <Box p={2}>
                     <DateRangePicker
                        ranges={[dateRange]}
                        onChange={handleRangeChange}
                        moveRangeOnFirstSelection={false}
                     />
                  </Box>
               </Popover>
               <Button 
                  variant="contained" 
                  onClick={() => setDateRange({
                     startDate: startOfToday(),
                     endDate: endOfToday(),
                     key: 'selection'
                  })}
                  sx={{ borderRadius: 2 }}
               >
                  Today
               </Button>

               <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                     const start = dateRange.startDate.toISOString();
                     const end = dateRange.endDate.toISOString();
                     window.open(`${process.env.NEXT_PUBLIC_API_URL}/export/bills?format=xlsx&start_date=${start}&end_date=${end}`, '_blank');
                  }}
                  sx={{ borderRadius: 2 }}
               >
                  Export Bills
               </Button>
               
               <Button
                  variant='outlined'
                  color='primary'
                  onClick={() => {
                     const start = dateRange.startDate.toISOString();
                     const end = dateRange.endDate.toISOString();
                     window.open(`${process.env.NEXT_PUBLIC_API_URL}/export/patients?format=xlsx&start_date=${start}&end_date=${end}`, '_blank');
                  }}
                  sx={{ borderRadius: 2 }}
               >
                  Export Patients
               </Button>
            </Stack>
         </Box>

         <Grid container spacing={3} mb={4}>
            {stats.map((stat, i) => (
               <Grid item xs={12} sm={6} md={3} key={i}>
                  <Paper
                     elevation={0}
                     sx={{
                        p: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                     }}>
                     <Box>
                        <Typography variant='body2' color='text.secondary' fontWeight='medium'>
                           {stat.title}
                        </Typography>
                        <Typography variant='h5' fontWeight='bold' mt={0.5}>
                           {stat.value}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                           {stat.subtitle}
                        </Typography>
                     </Box>
                     <Box sx={{ bgcolor: stat.color + '22', p: 1.5, borderRadius: '50%' }}>
                        {stat.icon}
                     </Box>
                  </Paper>
               </Grid>
            ))}
         </Grid>

         <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
               <Paper
                  elevation={0}
                  sx={{
                     p: 3,
                     borderRadius: 3,
                     border: '1px solid',
                     borderColor: 'divider',
                     height: 450,
                  }}>
                  <Typography variant='h6' fontWeight='bold' mb={3}>
                     Revenue Overview (Daily)
                  </Typography>
                  <ResponsiveContainer width='100%' height='85%'>
                     <BarChart data={data?.daily_revenue || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                           dataKey='day' 
                           axisLine={false} 
                           tickLine={false} 
                           tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                        />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                           formatter={(value) => [`₹${value}`, 'Revenue']}
                        />
                        <Bar dataKey='revenue' fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
               <Paper
                  elevation={0}
                  sx={{
                     p: 3,
                     borderRadius: 3,
                     border: '1px solid',
                     borderColor: 'divider',
                     height: 450,
                     display: 'flex',
                     flexDirection: 'column'
                  }}>
                  <Typography variant='h6' fontWeight='bold' mb={3}>
                     Payment Methods
                  </Typography>
                  <ResponsiveContainer width='100%' height='100%'>
                     <PieChart>
                        <Pie
                           data={pieData}
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                  </ResponsiveContainer>
               </Paper>
            </Grid>

            <Grid item xs={12}>
               <Paper
                  elevation={0}
                  sx={{
                     p: 3,
                     borderRadius: 3,
                     border: '1px solid',
                     borderColor: 'divider',
                     height: 400,
                  }}>
                  <Typography variant='h6' fontWeight='bold' mb={3}>
                     Monthly Revenue Trend (Last 6 Months)
                  </Typography>
                  <ResponsiveContainer width='100%' height='85%'>
                     <LineChart data={data?.monthly_revenue || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey='month' axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                        <Tooltip />
                        <Line 
                           type="monotone" 
                           dataKey="revenue" 
                           stroke={theme.palette.secondary.main} 
                           strokeWidth={3}
                           dot={{ r: 6 }}
                           activeDot={{ r: 8 }}
                        />
                     </LineChart>
                  </ResponsiveContainer>
               </Paper>
            </Grid>

           
         </Grid>
      </Box>
   );
}
