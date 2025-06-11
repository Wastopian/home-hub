import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import { useHomeStore, useThreatSummaries } from '../stores/homeStore';

export const ThreatMonitor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const summaries = useThreatSummaries();
  const fetchThreatSummary = useHomeStore(state => state.fetchThreatSummary);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchThreatSummary({ lat: 39.95, lon: -75.16 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Threat Monitor
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Localized weather, outage and crime alerts
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </Box>

      {summaries.map(summary => (
        <Card key={summary.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {summary.date.toLocaleString()} - {summary.level}
            </Typography>
            <List>
              {summary.weatherAlerts.map((a, i) => (
                <ListItem key={`w-${i}`}>
                  <ListItemText primary={a} secondary="Weather" />
                </ListItem>
              ))}
              {summary.powerOutages.map((a, i) => (
                <ListItem key={`p-${i}`}>
                  <ListItemText primary={a} secondary="Power" />
                </ListItem>
              ))}
              {summary.crimeReports.map((a, i) => (
                <ListItem key={`c-${i}`}>
                  <ListItemText primary={a} secondary="Crime" />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};
