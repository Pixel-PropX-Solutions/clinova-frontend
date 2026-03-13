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
} from "@mui/material";
import { DateRangePicker } from "react-date-range"; // Import DateRangePicker
import { startOfMonth, endOfMonth } from "date-fns"; // Use date-fns for date manipulation
import "react-date-range/dist/styles.css"; // Import its styles
import "react-date-range/dist/theme/default.css"; // Import its theme
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
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<any>({
    startDate: startOfMonth(new Date()), // Set start date to the 1st of the current month
    endDate: endOfMonth(new Date()), // Set end date to the last of the current month
    key: "selection",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Popover anchor state

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
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const formatValue = (value: any, defaultValue: string = "N/A") => {
    if (value == null) return defaultValue;
    return typeof value === "number" ? value.toFixed(2) : value;
  };

  const colors = ["#3f51b5", "#f50057", "#ffc658", "#ff7300"];

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

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        sx={{ marginBottom: 4 }}
      >
        Clinic Dashboard
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <Button
          variant="contained"
          onClick={handlePopoverOpen}
        >
          Select Date Range
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setDateRange({
              startDate: startOfMonth(new Date()), // Reset to the current month's start date
              endDate: endOfMonth(new Date()), // Reset to the current month's end date
              key: "selection",
            });
          }}
        >
          Reset
        </Button>
      </Stack>

      {/* Popover for Date Range Picker */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(item: any) => setDateRange(item.selection)}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            showMonthAndYearPickers={true}
            dateDisplayFormat="yyyy/MM/dd"
          />
        </Box>
      </Popover>

      <Grid  container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardHeader
              title="Total Revenue"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography variant="h4" color="primary">
                ₹{formatValue(data?.topPatientsByFees[0]?.totalRevenue || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardHeader
              title="Total Patients"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography variant="h4" color="secondary">
                {formatValue(data?.topPatientsByFees[0]?.totalPatients || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardHeader
              title="Average Fees"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography variant="h4" color="error">
              ₹{formatValue(data?.topPatientsByFees[0]?.avgFees || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0}>
            <CardHeader
              title="Average Age"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {formatValue(data?.topPatientsByFees[0]?.avgAge || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="Monthly Revenue"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    data?.monthlyRevenue?.length > 0
                      ? data.monthlyRevenue
                      : [
                          {
                            _id: { year: "N/A", month: "N/A" },
                            totalRevenue: 0,
                          },
                        ]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id.month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="totalRevenue" fill={colors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="Age Group Distribution"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    data?.ageGroupDistribution?.length > 0
                      ? data.ageGroupDistribution
                      : [{ _id: "Unknown", count: 0 }]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="count" fill={colors[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="New Patients Per Month"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={
                    data?.newPatientsPerMonth?.length > 0
                      ? data.newPatientsPerMonth
                      : [{ _id: "N/A", newPatients: 0 }]
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="newPatients" fill={colors[2]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardHeader
              title="Gender Distribution"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
