import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Stack,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Event,
  Construction,
  Warning,
  Receipt,
  TrendingUp,
  Refresh,
  Payment,
  Build,
  Add,
  Assignment,
  CalendarToday,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useDashboardData, useHomeStore } from '../stores/homeStore';
import { format } from 'date-fns';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Memoized utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return format(date, 'MMM dd, yyyy');
};

const formatTime = (date: Date) => {
  return format(date, 'h:mm a');
};

export const DashboardOverview: React.FC = () => {
  const { calendarEvents, bills, maintenanceTasks, projects, climateSchedules } = useHomeStore();
  const dashboardData = useDashboardData();
  const refreshDashboard = useHomeStore(state => state.refreshDashboard);

  // Calculate overdue items
  const overdueBills = bills.filter(bill => 
    new Date(bill.dueDate) < new Date() && !bill.isPaid
  ).length;
  
  const overdueMaintenance = maintenanceTasks.filter(task => 
    new Date(task.nextDueDate) < new Date() && !task.isCompleted
  ).length;

  // Mock recent activity data for now
  const recentActivity = [
    { type: 'bill', title: 'Electric Bill Paid', date: '2 days ago' },
    { type: 'maintenance', title: 'HVAC Filter Changed', date: '5 days ago' },
    { type: 'project', title: 'Kitchen Remodel Started', date: '1 week ago' },
  ];

  const handleRefresh = () => {
    refreshDashboard();
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #8B7355, #7A8471)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Home Hub Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your home management overview
        </Typography>
      </Box>

      {/* Quick Stats Cards */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3, 
          mb: 4,
          justifyContent: 'center',
        }}
      >
        {/* Temperature Card */}
        <Card 
          sx={{ 
            flex: '1 1 280px', 
            minWidth: 280, 
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Thermostat sx={{ fontSize: 48, color: '#8B7355', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B7355' }}>
              72°F
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Temperature
            </Typography>
          </CardContent>
        </Card>

        {/* Bills Card */}
        <Card 
          sx={{ 
            flex: '1 1 280px', 
            minWidth: 280, 
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Payment sx={{ fontSize: 48, color: '#7A8471', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#7A8471' }}>
              {overdueBills}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Bills
            </Typography>
          </CardContent>
        </Card>

        {/* Maintenance Card */}
        <Card 
          sx={{ 
            flex: '1 1 280px', 
            minWidth: 280, 
            maxWidth: 400,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Build sx={{ fontSize: 48, color: '#A89682', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#A89682' }}>
              {overdueMaintenance}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Tasks
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 115, 85, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              height: '400px',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Activity
              </Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {recentActivity.length > 0 ? (
                  <List sx={{ py: 0 }}>
                    {recentActivity.map((activity: any, index: number) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {activity.type === 'bill' && <Payment color="primary" />}
                          {activity.type === 'maintenance' && <Build color="secondary" />}
                          {activity.type === 'project' && <Assignment color="info" />}
                          {activity.type === 'calendar' && <CalendarToday color="success" />}
                        </ListItemIcon>
                        <ListItemText 
                          primary={activity.title}
                          secondary={activity.date}
                          primaryTypographyProps={{ fontSize: '0.95rem' }}
                          secondaryTypographyProps={{ fontSize: '0.85rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 115, 85, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              height: '400px',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ 
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: 'rgba(139, 115, 85, 0.3)',
                    color: '#8B7355',
                    '&:hover': {
                      borderColor: '#8B7355',
                      backgroundColor: 'rgba(139, 115, 85, 0.05)',
                    },
                  }}
                >
                  Add Bill
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ 
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: 'rgba(122, 132, 113, 0.3)',
                    color: '#7A8471',
                    '&:hover': {
                      borderColor: '#7A8471',
                      backgroundColor: 'rgba(122, 132, 113, 0.05)',
                    },
                  }}
                >
                  Schedule Maintenance
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  fullWidth
                  sx={{ 
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: 'rgba(168, 150, 130, 0.3)',
                    color: '#A89682',
                    '&:hover': {
                      borderColor: '#A89682',
                      backgroundColor: 'rgba(168, 150, 130, 0.05)',
                    },
                  }}
                >
                  Start Project
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarToday />}
                  fullWidth
                  sx={{ 
                    borderRadius: '12px',
                    textTransform: 'none',
                    borderColor: 'rgba(139, 115, 85, 0.3)',
                    color: '#8B7355',
                    '&:hover': {
                      borderColor: '#8B7355',
                      backgroundColor: 'rgba(139, 115, 85, 0.05)',
                    },
                  }}
                >
                  Add Event
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 