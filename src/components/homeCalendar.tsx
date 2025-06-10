import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Today,
  ViewWeek,
  ViewDay,
  CalendarMonth,
  Event,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useHomeStore, useCalendarEvents } from '../stores/homeStore';
import { format } from 'date-fns';
import { CalendarEvent, EventType } from '../types';

const MotionCard = motion(Card);

export const HomeCalendar: React.FC = () => {
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'Personal' as EventType,
    allDay: false,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    location: '',
    recurring: false,
  });

  const calendarEvents = useCalendarEvents();
  const { addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useHomeStore();

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'Contractor': return '#8B7355';
      case 'Cleaning': return '#7A8471';
      case 'Maintenance': return '#A89682';
      case 'Personal': return '#9BA192';
      case 'HOA': return '#C7C3BA';
      default: return '#8B7355';
    }
  };

  // Transform events for FullCalendar
  const fullCalendarEvents = calendarEvents.map(event => ({
    id: event.id,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    allDay: event.allDay,
    backgroundColor: getEventTypeColor(event.type),
    borderColor: getEventTypeColor(event.type),
    textColor: '#fff',
    extendedProps: {
      description: event.description,
      type: event.type,
      location: event.location,
      recurring: event.recurring,
    }
  }));

  const handleSaveEvent = () => {
    const eventData = {
      ...eventForm,
      startDate: eventForm.allDay 
        ? new Date(eventForm.startDate)
        : new Date(`${eventForm.startDate}T${eventForm.startTime}`),
      endDate: eventForm.allDay 
        ? new Date(eventForm.endDate || eventForm.startDate)
        : new Date(`${eventForm.endDate || eventForm.startDate}T${eventForm.endTime}`),
    };

    if (editingEvent) {
      updateCalendarEvent(editingEvent.id, eventData);
    } else {
      addCalendarEvent(eventData);
    }

    setEventDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      type: 'Personal',
      allDay: false,
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '10:00',
      location: '',
      recurring: false,
    });
    setEditingEvent(null);
    setSelectedEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
        setEventForm({
      title: event.title,
      description: event.description || '',
      type: event.type,
      allDay: event.allDay,
      startDate: format(new Date(event.startDate), 'yyyy-MM-dd'),
      startTime: event.allDay ? '09:00' : format(new Date(event.startDate), 'HH:mm'),
      endDate: event.endDate ? format(new Date(event.endDate), 'yyyy-MM-dd') : '',
      endTime: event.allDay || !event.endDate ? '10:00' : format(new Date(event.endDate), 'HH:mm'),
      location: event.location || '',
      recurring: event.recurring || false,
    });
    setEventDialogOpen(true);
  };

  // FullCalendar event handlers
  const handleDateClick = useCallback((selectInfo: any) => {
    setEventForm(prev => ({
      ...prev,
      startDate: format(new Date(selectInfo.date), 'yyyy-MM-dd'),
      endDate: format(new Date(selectInfo.date), 'yyyy-MM-dd'),
      allDay: selectInfo.allDay,
    }));
    setEventDialogOpen(true);
  }, []);

  const handleEventClick = useCallback((clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const event = calendarEvents.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
    }
  }, [calendarEvents]);

  const handleEventDrop = useCallback((dropInfo: any) => {
    const eventId = dropInfo.event.id;
    const event = calendarEvents.find(e => e.id === eventId);
    if (event) {
      updateCalendarEvent(eventId, {
        startDate: dropInfo.event.start,
        endDate: dropInfo.event.end,
      });
    }
  }, [calendarEvents, updateCalendarEvent]);

  const handleEventResize = useCallback((resizeInfo: any) => {
    const eventId = resizeInfo.event.id;
    updateCalendarEvent(eventId, {
      startDate: resizeInfo.event.start,
      endDate: resizeInfo.event.end,
    });
  }, [updateCalendarEvent]);

  // Get upcoming events (ensure dates are Date objects)
  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 3, 
          height: { xs: 'auto', lg: 'calc(100vh - 100px)' },
        }}
      >
        {/* Main Calendar */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Card 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 115, 85, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              height: '100%',
              minHeight: { xs: '500px', lg: '600px' },
            }}
          >
            <CardContent sx={{ height: '100%', p: 3 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}
                events={fullCalendarEvents}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                businessHours={{
                  startTime: '06:00',
                  endTime: '23:00',
                  daysOfWeek: [1, 2, 3, 4, 5]
                }}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                eventResize={handleEventResize}
                height="100%"
                eventClassNames={(info) => {
                  const eventTypeClass = `event-${info.event.extendedProps.type}`;
                  return [eventTypeClass];
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ 
          width: { xs: '100%', lg: '300px' }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}>
          {/* Quick Stats */}
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
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Quick Stats
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    This Month
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#8B7355' }}>
                    {calendarEvents.filter(e => {
                      const now = new Date();
                      const eventDate = new Date(e.startDate);
                      return eventDate.getMonth() === now.getMonth() && 
                             eventDate.getFullYear() === now.getFullYear();
                    }).length}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    This Week
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#7A8471' }}>
                    {calendarEvents.filter(e => {
                      const now = new Date();
                      const eventDate = new Date(e.startDate);
                      const startOfWeek = new Date(now);
                      startOfWeek.setDate(now.getDate() - now.getDay());
                      return eventDate >= startOfWeek && eventDate < new Date(startOfWeek.setDate(startOfWeek.getDate() + 7));
                    }).length}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Today
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#A89682' }}>
                    {calendarEvents.filter(e => {
                      const now = new Date();
                      const eventDate = new Date(e.startDate);
                      return eventDate.toDateString() === now.toDateString();
                    }).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Event Types Legend */}
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
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Event Types
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(['Contractor', 'Cleaning', 'Maintenance', 'Personal', 'HOA'] as EventType[]).map((type) => (
                  <Box key={type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        borderRadius: '50%', 
                        backgroundColor: getEventTypeColor(type),
                      }} 
                    />
                    <Typography variant="body2">
                      {type}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card 
            sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 115, 85, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              flex: 1,
              minHeight: '200px',
            }}
          >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upcoming Events
              </Typography>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {upcomingEvents.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {upcomingEvents.slice(0, 5).map((event, index) => (
                      <Box key={index} sx={{ 
                        p: 1.5, 
                        borderRadius: '8px', 
                        backgroundColor: 'rgba(139, 115, 85, 0.05)',
                        border: '1px solid rgba(139, 115, 85, 0.1)',
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                          {event.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                          {format(new Date(event.startDate), 'MMM dd, yyyy')} at {format(new Date(event.startDate), 'h:mm a')}
                        </Typography>
                        <Chip 
                          label={event.type} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem',
                            backgroundColor: getEventTypeColor(event.type),
                            color: 'white',
                          }} 
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No upcoming events
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Event Dialog */}
      <Dialog 
        open={eventDialogOpen} 
        onClose={() => setEventDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Event Title"
              fullWidth
              value={eventForm.title}
              onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={eventForm.type}
                label="Event Type"
                onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as EventType }))}
                sx={{ borderRadius: '12px' }}
              >
                <MenuItem value="Contractor">Contractor Visit</MenuItem>
                <MenuItem value="Cleaning">Cleaning</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
                <MenuItem value="HOA">HOA Meeting</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              fullWidth
              value={eventForm.startDate}
              onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            
            <TextField
              label="End Date & Time"
              type="datetime-local"
              fullWidth
              value={eventForm.endDate}
              onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
            
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              value={eventForm.description}
              onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {editingEvent && (
            <Button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this event?')) {
                  deleteCalendarEvent(editingEvent.id);
                  setEventDialogOpen(false);
                  resetForm();
                }
              }}
              sx={{ 
                color: '#d32f2f',
                borderColor: '#d32f2f',
                '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.05)' },
                mr: 'auto',
              }}
            >
              Delete
            </Button>
          )}
          <Button 
            onClick={() => setEventDialogOpen(false)}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEvent}
            variant="contained"
            sx={{ 
              backgroundColor: '#8B7355',
              '&:hover': { backgroundColor: '#7A6449' },
              borderRadius: '12px',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 