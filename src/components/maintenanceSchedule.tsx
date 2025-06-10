import React, { useState, useMemo } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Badge,
} from '@mui/material';
import {
  Build,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  Warning,
  Notifications,
  Home,
  AccessTime,
  Category,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHomeStore, useMaintenanceTasks } from '../stores/homeStore';
import { format, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { MaintenanceTask, TaskFrequency, TaskStatus, RoomType } from '../types';

const MotionCard = motion(Card);

export const MaintenanceSchedule: React.FC = () => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [selectedView, setSelectedView] = useState<'list' | 'calendar'>('list');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    frequency: 'Monthly' as TaskFrequency,
    nextDueDate: '',
    category: '',
    estimatedDuration: 30,
    isRecurring: true,
    room: undefined as RoomType | undefined,
  });

  const maintenanceTasks = useMaintenanceTasks();
  const { addMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask, completeMaintenanceTask } = useHomeStore();

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Done': return 'success';
      case 'Overdue': return 'error';
      default: return 'warning';
    }
  };

  const calculateNextDueDate = (frequency: TaskFrequency, fromDate = new Date()) => {
    switch (frequency) {
      case 'Weekly':
        return addWeeks(fromDate, 1);
      case 'Monthly':
        return addMonths(fromDate, 1);
      case 'Quarterly':
        return addMonths(fromDate, 3);
      case 'Annually':
        return addYears(fromDate, 1);
      default:
        return addMonths(fromDate, 1);
    }
  };

  const updateTaskStatus = () => {
    const now = new Date();
    return maintenanceTasks.map(task => {
      // Ensure nextDueDate is a Date object
      const dueDate = task.nextDueDate instanceof Date ? task.nextDueDate : new Date(task.nextDueDate);
      let status: TaskStatus;
      if (dueDate < now) {
        status = 'Overdue';
      } else {
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        status = daysUntilDue <= 7 ? 'Upcoming' : 'Upcoming';
      }
      return { ...task, status, nextDueDate: dueDate };
    });
  };

  const tasksWithStatus = updateTaskStatus();

  const handleSaveTask = () => {
    const taskData = {
      ...taskForm,
      nextDueDate: new Date(taskForm.nextDueDate),
      status: 'Upcoming' as TaskStatus,
    };

    if (editingTask) {
      updateMaintenanceTask(editingTask.id, taskData);
    } else {
      addMaintenanceTask(taskData);
    }

    setTaskDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      frequency: 'Monthly',
      nextDueDate: '',
      category: '',
      estimatedDuration: 30,
      isRecurring: true,
      room: undefined,
    });
    setEditingTask(null);
  };

  const handleCompleteTask = (taskId: string) => {
    completeMaintenanceTask(taskId);
  };

  const tasksByStatus = {
    'Overdue': tasksWithStatus.filter(t => t.status === 'Overdue'),
    'Upcoming': tasksWithStatus.filter(t => t.status === 'Upcoming'),
    'Done': tasksWithStatus.filter(t => t.status === 'Done'),
  };

  const categories = Array.from(new Set(maintenanceTasks.map(t => t.category)));

  // Calculate summary stats
  const totalTasks = maintenanceTasks.length;
  const upcomingTasks = maintenanceTasks.filter(task => task.status === 'Upcoming').length;
  const overdueTasks = maintenanceTasks.filter(task => task.status === 'Overdue').length;

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Maintenance Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your home maintenance tasks
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setTaskDialogOpen(true)}
          sx={{ borderRadius: '12px' }}
        >
          Add Task
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Build sx={{ fontSize: 48, color: '#8B7355', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B7355' }}>
              {totalTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tasks
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: '#7A8471', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#7A8471' }}>
              {upcomingTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upcoming Tasks
            </Typography>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            flex: '1 1 250px', 
            minWidth: 250,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 115, 85, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <Warning sx={{ fontSize: 48, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f' }}>
              {overdueTasks}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Tasks
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tasks List */}
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
            All Maintenance Tasks
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tasksWithStatus.map((task) => (
              <Box 
                key={task.id}
                sx={{ 
                  p: 3, 
                  borderRadius: '12px', 
                  backgroundColor: task.status === 'Overdue' ? 'rgba(211, 47, 47, 0.05)' : 'rgba(139, 115, 85, 0.05)',
                  border: '1px solid',
                  borderColor: task.status === 'Overdue' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(139, 115, 85, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.status}
                      size="small"
                      color={
                        task.status === 'Done' ? 'success' :
                        task.status === 'Overdue' ? 'error' : 'warning'
                      }
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {task.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Due: {format(task.nextDueDate instanceof Date ? task.nextDueDate : new Date(task.nextDueDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {task.estimatedDuration} minutes
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Category sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {task.category}
                      </Typography>
                    </Box>
                    
                    <Chip label={task.frequency} size="small" variant="outlined" />
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  {task.status !== 'Done' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleCompleteTask(task.id)}
                      sx={{ borderRadius: '8px' }}
                    >
                      Complete
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingTask(task);
                      setTaskForm({
                        title: task.title,
                        description: task.description,
                        frequency: task.frequency,
                        nextDueDate: format(task.nextDueDate instanceof Date ? task.nextDueDate : new Date(task.nextDueDate), 'yyyy-MM-dd'),
                        category: task.category,
                        estimatedDuration: task.estimatedDuration,
                        isRecurring: task.isRecurring,
                        room: task.room,
                      });
                      setTaskDialogOpen(true);
                    }}
                    sx={{ color: 'primary.main' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        deleteMaintenanceTask(task.id);
                      }
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
            
            {tasksWithStatus.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  No maintenance tasks scheduled
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onClose={() => setTaskDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              value={taskForm.title}
              onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={taskForm.description}
              onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={taskForm.category}
                label="Category"
                onChange={(e) => setTaskForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="HVAC">HVAC</MenuItem>
                <MenuItem value="Plumbing">Plumbing</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Exterior">Exterior</MenuItem>
                <MenuItem value="Interior">Interior</MenuItem>
                <MenuItem value="Appliances">Appliances</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={taskForm.frequency}
                label="Frequency"
                onChange={(e) => setTaskForm(prev => ({ ...prev, frequency: e.target.value as TaskFrequency }))}
              >
                <MenuItem value="Weekly">Weekly</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quarterly">Quarterly</MenuItem>
                <MenuItem value="Annually">Annually</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Next Due Date"
              type="date"
              value={taskForm.nextDueDate}
              onChange={(e) => setTaskForm(prev => ({ ...prev, nextDueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Estimated Duration (minutes)"
              type="number"
              value={taskForm.estimatedDuration}
              onChange={(e) => setTaskForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 0 }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTask}>
            {editingTask ? 'Update' : 'Add'} Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 