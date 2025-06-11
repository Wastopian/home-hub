import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Thermostat,
  Construction,
  Build,
  Receipt,
  CalendarMonth,
  Home,
  ColorLens,
} from '@mui/icons-material';
import { useCurrentView, useHomeStore } from '../stores/homeStore';
import { AppState } from '../types';

const drawerWidth = 280;

const menuItems = [
  { 
    key: 'dashboard' as AppState['currentView'], 
    label: 'Dashboard', 
    icon: <Dashboard /> 
  },
  { 
    key: 'climate' as AppState['currentView'], 
    label: 'Climate Control', 
    icon: <Thermostat /> 
  },
  { 
    key: 'projects' as AppState['currentView'], 
    label: 'Projects', 
    icon: <Construction /> 
  },
  { 
    key: 'maintenance' as AppState['currentView'], 
    label: 'Maintenance', 
    icon: <Build /> 
  },
  { 
    key: 'bills' as AppState['currentView'], 
    label: 'Bills & Finances', 
    icon: <Receipt /> 
  },
  {
    key: 'calendar' as AppState['currentView'],
    label: 'Calendar',
    icon: <CalendarMonth />
  },
  {
    key: 'scenes' as AppState['currentView'],
    label: 'Mood Scenes',
    icon: <ColorLens />
  },
];

interface NavigationProps {
  open: boolean;
  onClose: () => void;
}

export const Navigation: React.FC<NavigationProps> = React.memo(({ open, onClose }) => {
  const currentView = useCurrentView();
  const setCurrentView = useHomeStore(state => state.setCurrentView);

  const handleMenuItemClick = React.useCallback((view: AppState['currentView']) => {
    setCurrentView(view);
    onClose();
  }, [setCurrentView, onClose]);

  const drawer = React.useMemo(() => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Home sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Home Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Claire & Warren
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ mx: 2, opacity: 0.3 }} />
      
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentView === item.key}
              onClick={() => handleMenuItemClick(item.key)}
              sx={{
                borderRadius: 2,
                minHeight: 48,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(139, 115, 85, 0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 115, 85, 0.25)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(139, 115, 85, 0.08)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: currentView === item.key ? 'primary.main' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: currentView === item.key ? 600 : 400,
                  color: currentView === item.key ? 'primary.main' : 'text.primary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Home Hub v1.0
        </Typography>
      </Box>
    </Box>
  ), [currentView, handleMenuItemClick]);

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: 'none',
            borderRight: '1px solid rgba(139, 115, 85, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}); 