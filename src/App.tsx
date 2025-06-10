import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { theme } from './theme';
import { Navigation } from './components/navigation';
import { DashboardOverview } from './components/dashboardOverview';
import { ClimateControl } from './components/climateControl';
import { ProjectTracker } from './components/projectTracker';
import { MaintenanceSchedule } from './components/maintenanceSchedule';
import { BillsFinances } from './components/billsFinances';
import { HomeCalendar } from './components/homeCalendar';
import { useCurrentView } from './stores/homeStore';

const drawerWidth = 280;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentView = useCurrentView();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'climate':
        return <ClimateControl />;
      case 'projects':
        return <ProjectTracker />;
      case 'maintenance':
        return <MaintenanceSchedule />;
      case 'bills':
        return <BillsFinances />;
      case 'calendar':
        return <HomeCalendar />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Mobile AppBar */}
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              display: { xs: 'block', md: 'none' },
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              color: 'text.primary',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
              borderBottom: '1px solid rgba(139, 115, 85, 0.1)',
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                Home Hub
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        {/* Navigation Drawer */}
        <Navigation open={mobileOpen} onClose={handleDrawerToggle} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: `${drawerWidth}px` },
            mt: { xs: '64px', md: 0 }, // Account for mobile AppBar
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F7F5F3 0%, #FAFAF9 50%, #F5F4F2 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(600px circle at 20% 30%, rgba(139, 115, 85, 0.05) 0%, transparent 50%),
                radial-gradient(800px circle at 80% 70%, rgba(122, 132, 113, 0.03) 0%, transparent 50%),
                radial-gradient(400px circle at 40% 80%, rgba(139, 115, 85, 0.02) 0%, transparent 50%)
              `,
              pointerEvents: 'none',
            },
          }}
        >
          <Box 
            sx={{ 
              position: 'relative', 
              zIndex: 1, 
              width: '100%',
              px: { xs: 2, sm: 3, md: 4, lg: 5 }, // More reasonable padding
              py: { xs: 2, sm: 3 }, // Vertical padding
            }}
          >
            {renderCurrentView()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
