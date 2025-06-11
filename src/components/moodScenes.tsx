import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Slider,
  Grid,
  IconButton,
} from '@mui/material';
import { Favorite, Work, Movie, Add, Delete } from '@mui/icons-material';
import { useHomeStore, useLightingScenes } from '../stores/homeStore';

const iconMap: Record<string, JSX.Element> = {
  Romantic: <Favorite color="error" />,
  'Focus Mode': <Work color="primary" />,
  'Movie Night': <Movie color="secondary" />,
};

export const MoodScenes: React.FC = () => {
  const scenes = useLightingScenes();
  const addScene = useHomeStore(s => s.addLightingScene);
  const updateScene = useHomeStore(s => s.updateLightingScene);
  const deleteScene = useHomeStore(s => s.deleteLightingScene);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', color: '#ffffff', brightness: 50, temperature: 72 });

  const handleSave = () => {
    if (form.name.trim()) {
      addScene(form);
      setDialogOpen(false);
      setForm({ name: '', color: '#ffffff', brightness: 50, temperature: 72 });
    }
  };

  const activateScene = async (id: string) => {
    try {
      await fetch(`http://localhost:4000/api/scenes/${id}/activate`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Mood Scenes
      </Typography>
      <Grid container spacing={2}>
        {scenes.map(scene => (
          <Grid item xs={12} sm={6} md={4} key={scene.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {iconMap[scene.name] || <Favorite />} 
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {scene.name}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">Color: {scene.color}</Typography>
                  <Typography variant="body2">Brightness: {scene.brightness}%</Typography>
                  <Typography variant="body2">Temperature: {scene.temperature}°F</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => activateScene(scene.id)}>
                  Activate
                </Button>
                <IconButton size="small" onClick={() => deleteScene(scene.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed rgba(139,115,85,0.3)',
            }}
          >
            <IconButton onClick={() => setDialogOpen(true)}>
              <Add />
            </IconButton>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add Scene</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Color"
              type="color"
              value={form.color}
              onChange={e => setForm({ ...form, color: e.target.value })}
            />
            <Typography gutterBottom>Brightness</Typography>
            <Slider
              value={form.brightness}
              onChange={(_, v) => setForm({ ...form, brightness: v as number })}
              min={0}
              max={100}
            />
            <Typography gutterBottom>Temperature</Typography>
            <Slider
              value={form.temperature}
              onChange={(_, v) => setForm({ ...form, temperature: v as number })}
              min={60}
              max={80}
            />
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

