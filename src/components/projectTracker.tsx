import React, { useState } from 'react';
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
  LinearProgress,
  Slider,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Construction,
  Add,
  Edit,
  Delete,
  PhotoCamera,
  Receipt,
  Timeline,
  AttachMoney,
  CalendarToday,
  Notes,
  CheckCircle,
  PlayArrow,
  Pause,
  Stop,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHomeStore, useProjects } from '../stores/homeStore';
import { format } from 'date-fns';
import { Project, ProjectStatus, RoomType } from '../types';

const MotionCard = motion(Card);

export const ProjectTracker: React.FC = () => {
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    status: 'Planned' as ProjectStatus,
    room: 'Living Room' as RoomType,
    budget: 0,
    actualCost: 0,
    startDate: '',
    endDate: '',
    notes: [] as string[],
    progress: 0,
  });
  const [newNote, setNewNote] = useState('');

  const projects = useProjects();
  const { addProject, updateProject, deleteProject } = useHomeStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Paused': return 'warning';
      default: return 'default';
    }
  };

  const handleSaveProject = () => {
    const projectData = {
      ...projectForm,
      startDate: new Date(projectForm.startDate),
      endDate: projectForm.endDate ? new Date(projectForm.endDate) : undefined,
      photos: [],
      receipts: [],
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }

    setProjectDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setProjectForm({
      title: '',
      description: '',
      status: 'Planned',
      room: 'Living Room',
      budget: 0,
      actualCost: 0,
      startDate: '',
      endDate: '',
      notes: [],
      progress: 0,
    });
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      room: project.room,
      budget: project.budget,
      actualCost: project.actualCost,
      startDate: format(project.startDate, 'yyyy-MM-dd'),
      endDate: project.endDate ? format(project.endDate, 'yyyy-MM-dd') : '',
      notes: project.notes,
      progress: project.progress,
    });
    setProjectDialogOpen(true);
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProject(projectId, { status: newStatus });
  };

  const handleProgressChange = (projectId: string, newProgress: number) => {
    updateProject(projectId, { progress: newProgress });
  };

  const addNoteToProject = (projectId: string) => {
    if (newNote.trim()) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        updateProject(projectId, {
          notes: [...project.notes, `${format(new Date(), 'MMM dd, yyyy')}: ${newNote.trim()}`]
        });
        setNewNote('');
      }
    }
  };

  const projectsByStatus = {
    'Planned': projects.filter(p => p.status === 'Planned'),
    'In Progress': projects.filter(p => p.status === 'In Progress'),
    'Paused': projects.filter(p => p.status === 'Paused'),
    'Completed': projects.filter(p => p.status === 'Completed'),
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Project Tracker
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your home improvement and renovation projects
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setProjectDialogOpen(true)}
          sx={{ borderRadius: '12px' }}
        >
          Add Project
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
            <Construction sx={{ fontSize: 48, color: '#8B7355', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B7355' }}>
              {projects.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Projects
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
            <TrendingUp sx={{ fontSize: 48, color: '#7A8471', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#7A8471' }}>
              {projectsByStatus['In Progress'].length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Projects
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
            <AttachMoney sx={{ fontSize: 48, color: '#A89682', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#A89682' }}>
              ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Budget
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Projects Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {projects.map((project) => (
          <Card 
            key={project.id}
            sx={{ 
              flex: '1 1 400px', 
              minWidth: 400,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(139, 115, 85, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={project.status}
                      size="small"
                      color={
                        project.status === 'Completed' ? 'success' :
                        project.status === 'In Progress' ? 'primary' : 
                        project.status === 'Paused' ? 'warning' : 'default'
                      }
                    />
                    <Chip label={project.room} size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleEditProject(project)}
                    sx={{ color: 'primary.main' }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => deleteProject(project.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {project.description}
              </Typography>
              
              {/* Progress Bar */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {project.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={project.progress} 
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(139, 115, 85, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#8B7355',
                    },
                  }}
                />
              </Box>
              
              {/* Budget Info */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Budget
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ${project.budget.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary">
                    Spent
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ${project.actualCost.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              {/* Dates */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Started: {format(new Date(project.startDate), 'MMM dd, yyyy')}
                  </Typography>
                </Box>
                {project.endDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Ended: {format(new Date(project.endDate), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Notes */}
              {project.notes.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Latest Note:
                  </Typography>
                  <Typography variant="body2">
                    {project.notes[project.notes.length - 1]}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
        
        {projects.length === 0 && (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            py: 8,
            background: 'rgba(139, 115, 85, 0.05)',
            borderRadius: '16px',
            border: '2px dashed rgba(139, 115, 85, 0.3)',
          }}>
            <Construction sx={{ fontSize: 64, color: 'rgba(139, 115, 85, 0.4)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Projects Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start tracking your home improvement projects
            </Typography>
          </Box>
        )}
      </Box>

      {/* Project Dialog */}
      <Dialog open={projectDialogOpen} onClose={() => setProjectDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Project Title"
              value={projectForm.title}
              onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={projectForm.description}
              onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Room</InputLabel>
                <Select
                  value={projectForm.room}
                  label="Room"
                  onChange={(e) => setProjectForm(prev => ({ ...prev, room: e.target.value as any }))}
                >
                  <MenuItem value="Kitchen">Kitchen</MenuItem>
                  <MenuItem value="Living Room">Living Room</MenuItem>
                  <MenuItem value="Bedroom">Bedroom</MenuItem>
                  <MenuItem value="Bathroom">Bathroom</MenuItem>
                  <MenuItem value="Yard">Yard</MenuItem>
                  <MenuItem value="Garage">Garage</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={projectForm.status}
                  label="Status"
                  onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <MenuItem value="Planned">Planned</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Budget"
                type="number"
                value={projectForm.budget}
                onChange={(e) => setProjectForm(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                InputProps={{ startAdornment: '$' }}
              />
              
              <TextField
                sx={{ flex: 1 }}
                label="Actual Cost"
                type="number"
                value={projectForm.actualCost}
                onChange={(e) => setProjectForm(prev => ({ ...prev, actualCost: parseFloat(e.target.value) || 0 }))}
                InputProps={{ startAdornment: '$' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                sx={{ flex: 1 }}
                label="Start Date"
                type="date"
                value={projectForm.startDate}
                onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              
              {projectForm.status === 'Completed' && (
                <TextField
                  sx={{ flex: 1 }}
                  label="End Date"
                  type="date"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
            
            <TextField
              fullWidth
              label="Progress (%)"
              type="number"
              value={projectForm.progress}
              onChange={(e) => setProjectForm(prev => ({ ...prev, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProject}>
            {editingProject ? 'Update' : 'Add'} Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 