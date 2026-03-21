"use client"

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Stack,
  Button,
  Popover,
  IconButton,
} from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { startOfMonth, endOfMonth, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  Clock, 
  RefreshCcw,
  Download,
} from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<any>({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: "selection",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (dateRange.startDate && dateRange.endDate) {
        params.append("startDate", dateRange.startDate.toISOString());
        params.append("endDate", dateRange.endDate.toISOString());
      }

      try {
        const response = await axios.get(`/api/analytics?${params.toString()}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatValue = (value: any, defaultValue: string = "0") => {
    if (value == null) return defaultValue;
    return typeof value === "number" ? Math.round(value).toLocaleString() : value;
  };

  const colors = ["#2F5FA5", "#5CC6C4", "#7DE3E0", "#64748B"];

  const genderData = [
    { name: "Male", value: data?.topPatientsByFees[0]?.malePatients || 0 },
    { name: "Female", value: data?.topPatientsByFees[0]?.femalePatients || 0 },
    { name: "Other", value: data?.topPatientsByFees[0]?.otherPatients || 0 },
  ];

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)' }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: `${color}10`, 
            color: color,
            display: 'flex'
          }}>
            {icon}
          </Box>
          {trend && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              color: 'success.main', 
              bgcolor: 'success.light', 
              px: 1, 
              py: 0.5, 
              borderRadius: '20px',
              opacity: 0.8
            }}>
              <TrendingUp size={12} />
              <Typography variant="caption" fontWeight="600">{trend}</Typography>
            </Box>
          )}
        </Box>
        <Typography variant="body2" color="textSecondary" fontWeight="500">
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="700" sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="primary">
            Clinic Overview
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={handlePopoverOpen}
            startIcon={<CalendarIcon size={18} />}
            sx={{ bgcolor: 'white' }}
          >
            Range
          </Button>
          <IconButton sx={{ bgcolor: 'white', border: '1px solid #E3EEF7', borderRadius: '10px' }}>
            <RefreshCcw size={18} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Download size={18} />}
          >
            Report
          </Button>
        </Stack>
      </Box>

      {/* Popover for Date Range Picker */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', mt: 1 } }}
      >
        <Box sx={{ p: 1 }}>
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(item: any) => setDateRange(item.selection)}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            showMonthAndYearPickers={true}
          />
        </Box>
      </Popover>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Revenue" 
            value={`₹${formatValue(data?.topPatientsByFees[0]?.totalRevenue)}`}
            icon={<IndianRupee size={24} />}
            color="#2F5FA5"
            trend="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Patients" 
            value={formatValue(data?.topPatientsByFees[0]?.totalPatients)}
            icon={<Users size={24} />}
            color="#5CC6C4"
            trend="+5%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Avg. Consultation" 
            value={`₹${formatValue(data?.topPatientsByFees[0]?.avgFees)}`}
            icon={<Clock size={24} />}
            color="#EF4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Average Age" 
            value={formatValue(data?.topPatientsByFees[0]?.avgAge)}
            icon={<Users size={24} />}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Revenue Analytics"
              titleTypographyProps={{ variant: "h6", fontWeight: "700" }}
              subheader="Monthly performance breakdown"
            />
            <CardContent>
              <Box sx={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart
                    data={data?.monthlyRevenue?.length > 0 ? data.monthlyRevenue : [{ _id: { month: "N/A" }, totalRevenue: 0 }]}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2F5FA5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2F5FA5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EEF7" />
                    <XAxis dataKey="_id.month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="totalRevenue" stroke="#2F5FA5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Patient Demographics"
              titleTypographyProps={{ variant: "h6", fontWeight: "700" }}
              subheader="Gender distribution"
            />
            <CardContent>
              <Box sx={{ height: 350, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Age Distribution"
              titleTypographyProps={{ variant: "h6", fontWeight: "700" }}
            />
            <CardContent>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart
                    data={data?.ageGroupDistribution?.length > 0 ? data.ageGroupDistribution : [{ _id: "Unknown", count: 0 }]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EEF7" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#5CC6C4" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Growth Analysis"
              titleTypographyProps={{ variant: "h6", fontWeight: "700" }}
            />
            <CardContent>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart
                    data={data?.newPatientsPerMonth?.length > 0 ? data.newPatientsPerMonth : [{ _id: "N/A", newPatients: 0 }]}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3EEF7" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="newPatients" fill="#2F5FA5" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
