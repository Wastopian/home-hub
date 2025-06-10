import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Thermostat,
  WaterDrop,
  Wifi,
  Settings,
  Schedule,
  Sensors,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  AccessTime,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHomeStore, useDashboardData } from '../stores/homeStore';
import { format } from 'date-fns';
import { TemperatureReading, ClimateSchedule } from '../types';

const MotionCard = motion(Card);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div hidden={value !== index} style={{ paddingTop: '24px' }}>
    {value === index && children}
  </div>
);

export const ClimateControl: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [networkDialogOpen, setNetworkDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('Living Room');
  const [targetTemp, setTargetTemp] = useState(72);
  const [scheduleForm, setScheduleForm] = useState({
    roomName: '',
    startTime: '',
    endTime: '',
    temperature: 72,
    days: [] as string[],
    isActive: true,
  });
  const [networkConfig, setNetworkConfig] = useState({
    thermostatType: 'manual',
    ipAddress: '',
    apiKey: '',
    deviceId: '',
    networkScan: false,
  });

  const { temperatureReadings, climateSchedules, addTemperatureReading, addClimateSchedule, updateClimateSchedule, deleteClimateSchedule } = useHomeStore();
  const dashboardData = useDashboardData();

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Basement'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleTemperatureChange = (room: string, newTemp: number) => {
    addTemperatureReading({
      roomName: room,
      temperature: newTemp,
      humidity: temperatureReadings.find(r => r.roomName === room)?.humidity || 45,
      timestamp: new Date(),
      isManual: true,
    });
  };

  const handleSaveSchedule = () => {
    const newSchedule: Omit<ClimateSchedule, 'id'> = {
      ...scheduleForm,
    };
    addClimateSchedule(newSchedule);
    setScheduleDialogOpen(false);
    setScheduleForm({
      roomName: '',
      startTime: '',
      endTime: '',
      temperature: 72,
      days: [],
      isActive: true,
    });
  };

  const getCurrentReading = (room: string) => {
    return temperatureReadings.find(r => r.roomName === room) || {
      id: '',
      roomName: room,
      temperature: 70,
      humidity: 40,
      timestamp: new Date(),
      isManual: false,
    };
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Climate Control
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and control your home's temperature and humidity
        </Typography>
      </Box>

      {/* Temperature Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {climateSchedules.map((schedule) => (
          <Card 
            key={schedule.id}
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
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Thermostat sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {schedule.roomName}
                </Typography>
              </Box>
              
              <Typography variant="h3" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                {schedule.temperature}°F
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {schedule.startTime} - {schedule.endTime}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => {
                    setScheduleForm({
                      roomName: schedule.roomName,
                      startTime: schedule.startTime,
                      endTime: schedule.endTime,
                      temperature: schedule.temperature,
                      days: schedule.days,
                      isActive: schedule.isActive,
                    });
                    setScheduleDialogOpen(true);
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this schedule?')) {
                      deleteClimateSchedule(schedule.id);
                    }
                  }}
                  sx={{ borderRadius: '8px' }}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
        
        {/* Add Schedule Card */}
        <Card 
          sx={{ 
            flex: '1 1 280px', 
            minWidth: 280, 
            maxWidth: 400,
            background: 'rgba(139, 115, 85, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '2px dashed rgba(139, 115, 85, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': {
              background: 'rgba(139, 115, 85, 0.1)',
              borderColor: 'rgba(139, 115, 85, 0.5)',
            },
          }}
          onClick={() => setScheduleDialogOpen(true)}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Add sx={{ fontSize: 48, color: 'rgba(139, 115, 85, 0.6)', mb: 1 }} />
            <Typography variant="h6" color="text.secondary">
              Add Schedule
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Schedule Management */}
      <Card 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 115, 85, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Scheduled Climate Changes
          </Typography>
          
          {climateSchedules.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {climateSchedules.map((schedule) => (
                <Box 
                  key={schedule.id}
                  sx={{ 
                    p: 2, 
                    borderRadius: '8px', 
                    backgroundColor: 'rgba(139, 115, 85, 0.05)',
                    border: '1px solid rgba(139, 115, 85, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {schedule.roomName} - {schedule.temperature}°F
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {schedule.startTime} - {schedule.endTime} • {schedule.days.join(', ')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setScheduleForm({
                          roomName: schedule.roomName,
                          startTime: schedule.startTime,
                          endTime: schedule.endTime,
                          temperature: schedule.temperature,
                          days: schedule.days,
                          isActive: schedule.isActive,
                        });
                        setScheduleDialogOpen(true);
                      }}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this schedule?')) {
                          deleteClimateSchedule(schedule.id);
                        }
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                No climate schedules configured
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {scheduleForm.roomName ? 'Edit Schedule' : 'Add New Schedule'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Room Name"
              value={scheduleForm.roomName}
              onChange={(e) => setScheduleForm({ ...scheduleForm, roomName: e.target.value })}
            />
            
            <TextField
              fullWidth
              label="Target Temperature"
              type="number"
              value={scheduleForm.temperature}
              onChange={(e) => setScheduleForm({ ...scheduleForm, temperature: parseInt(e.target.value) })}
              InputProps={{ endAdornment: '°F' }}
            />
            
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={scheduleForm.startTime}
              onChange={(e) => setScheduleForm({ 
                ...scheduleForm, 
                startTime: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={scheduleForm.endTime}
              onChange={(e) => setScheduleForm({ 
                ...scheduleForm, 
                endTime: e.target.value
              })}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSchedule}>
            {scheduleForm.roomName ? 'Update' : 'Add'} Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 