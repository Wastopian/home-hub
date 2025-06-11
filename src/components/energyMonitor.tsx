import React, { useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import mqtt from 'mqtt/dist/mqtt';
import { useEnergyReadings, useEnergyAlerts, useHomeStore } from '../stores/homeStore';

const MQTT_URL = 'ws://localhost:1884';
const MQTT_TOPIC = 'home/energy';

export const EnergyMonitor: React.FC = () => {
  const energyReadings = useEnergyReadings();
  const energyAlerts = useEnergyAlerts();
  const addEnergyReading = useHomeStore(state => state.addEnergyReading);
  const clearEnergyAlerts = useHomeStore(state => state.clearEnergyAlerts);

  useEffect(() => {
    const client = mqtt.connect(MQTT_URL);
    client.on('connect', () => {
      client.subscribe(MQTT_TOPIC);
    });
    client.on('message', (_topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        addEnergyReading({ device: data.device, power: data.power, timestamp: new Date() });
      } catch {
        // ignore malformed messages
      }
    });
    return () => {
      client.end(true);
    };
  }, [addEnergyReading]);

  const chartData = energyReadings.slice(-50).map(r => ({
    time: r.timestamp.toLocaleTimeString(),
    power: r.power,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Energy Usage
      </Typography>
      {energyAlerts.map(alert => (
        <Alert key={alert.id} severity="warning" onClose={clearEnergyAlerts} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      ))}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis unit="W" />
          <Tooltip />
          <Line type="monotone" dataKey="power" stroke="#8884d8" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
