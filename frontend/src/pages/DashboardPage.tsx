import React from 'react';
import { Typography, Grid, Paper, Card, CardContent } from '@mui/material';

const DashboardCard = ({ title, value, subtext }: { title: string; value: string; subtext: string }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtext}
      </Typography>
    </CardContent>
  </Card>
);

const DashboardPage: React.FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Active Employees" value="1081" subtext="+5.5% than last week" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Employees" value="2,300" subtext="+3% than last week" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Tasks" value="34" subtext="+5% than yesterday" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Attendance" value="+91" subtext="Just updated" />
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardPage;