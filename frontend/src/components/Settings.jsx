import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Slider,
  Button,
  Grid,
  Divider,
  Chip,
  Fade,
  Slide,
  Grow,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField
} from '@mui/material';
import { 
  Brightness4, 
  Notifications, 
  Security,
  Speed,
  Palette,
  VolumeUp,
  VolumeOff,
  Save,
  Restore
} from '@mui/icons-material';

const Settings = () => {
  const [settings, setSettings] = useState({
    // Theme Settings
    darkMode: true,
    autoTheme: false,
    accentColor: 'cyan',
    
    // Notification Settings
    priceAlerts: true,
    marketEvents: true,
    tradeConfirmations: true,
    emailNotifications: false,
    pushNotifications: true,
    notificationVolume: 70,
    
    // Trading Settings
    autoConfirmTrades: false,
    defaultOrderType: 'market',
    riskLevel: 'moderate',
    maxTradeAmount: 1000,
    
    // Performance Settings
    realTimeUpdates: true,
    chartAnimations: true,
    dataRefreshRate: 10
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically save settings to backend/localStorage
    setAlertMessage('Settings saved successfully!');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleResetSettings = () => {
    setSettings({
      darkMode: true,
      autoTheme: false,
      accentColor: 'cyan',
      priceAlerts: true,
      marketEvents: true,
      tradeConfirmations: true,
      emailNotifications: false,
      pushNotifications: true,
      notificationVolume: 70,
      autoConfirmTrades: false,
      defaultOrderType: 'market',
      riskLevel: 'moderate',
      maxTradeAmount: 1000,
      realTimeUpdates: true,
      chartAnimations: true,
      dataRefreshRate: 10
    });
    setAlertMessage('Settings reset to defaults');
    setAlertType('info');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const accentColors = [
    { name: 'Cyan', value: 'cyan', color: '#00d4ff' },
    { name: 'Pink', value: 'pink', color: '#ff00ff' },
    { name: 'Green', value: 'green', color: '#00ff88' },
    { name: 'Orange', value: 'orange', color: '#ffa726' },
    { name: 'Purple', value: 'purple', color: '#ab47bc' }
  ];

  const riskLevels = [
    { value: 'conservative', label: 'Conservative', color: '#00ff88' },
    { value: 'moderate', label: 'Moderate', color: '#ffa726' },
    { value: 'aggressive', label: 'Aggressive', color: '#ff4757' }
  ];

  const orderTypes = [
    { value: 'market', label: 'Market Order' },
    { value: 'limit', label: 'Limit Order' },
    { value: 'stop', label: 'Stop Order' }
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
            ⚙️ Settings
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Restore />}
              onClick={handleResetSettings}
              sx={{
                borderColor: '#ffa726',
                color: '#ffa726',
                '&:hover': {
                  borderColor: '#ffb74d',
                  color: '#ffb74d',
                  background: 'rgba(255, 167, 38, 0.1)'
                }
              }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveSettings}
              sx={{
                background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                }
              }}
            >
              Save Settings
            </Button>
          </Box>
        </Box>

        {showAlert && (
          <Slide direction="down" in={showAlert}>
            <Alert 
              severity={alertType}
              sx={{ 
                mb: 3, 
                background: alertType === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 212, 255, 0.1)',
                border: alertType === 'success' ? '1px solid #00ff88' : '1px solid #00d4ff'
              }}
            >
              {alertMessage}
            </Alert>
          </Slide>
        )}

        <Grid container spacing={3}>
          {/* Theme Settings */}
          <Grid xs={12} md={6}>
            <Slide direction="up" in={true} timeout={1000}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Palette sx={{ color: '#00d4ff' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Theme & Appearance
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4ff',
                          },
                        }}
                      />
                    }
                    label="Dark Mode"
                    sx={{ color: '#fff' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoTheme}
                        onChange={(e) => handleSettingChange('autoTheme', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4ff',
                          },
                        }}
                      />
                    }
                    label="Auto Theme (Follow System)"
                    sx={{ color: '#fff' }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Accent Color
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {accentColors.map((color) => (
                        <Chip
                          key={color.value}
                          label={color.name}
                          onClick={() => handleSettingChange('accentColor', color.value)}
                          sx={{
                            background: settings.accentColor === color.value ? color.color : 'rgba(255, 255, 255, 0.1)',
                            color: settings.accentColor === color.value ? '#000' : '#fff',
                            border: `2px solid ${color.color}`,
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              background: color.color,
                              color: '#000',
                              transform: 'scale(1.05)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.chartAnimations}
                        onChange={(e) => handleSettingChange('chartAnimations', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00d4ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00d4ff',
                          },
                        }}
                      />
                    }
                    label="Chart Animations"
                    sx={{ color: '#fff' }}
                  />
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Notification Settings */}
          <Grid xs={12} md={6}>
            <Slide direction="up" in={true} timeout={1200}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Notifications sx={{ color: '#ff00ff' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Notifications
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.priceAlerts}
                        onChange={(e) => handleSettingChange('priceAlerts', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#ff00ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#ff00ff',
                          },
                        }}
                      />
                    }
                    label="Price Alerts"
                    sx={{ color: '#fff' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.marketEvents}
                        onChange={(e) => handleSettingChange('marketEvents', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#ff00ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#ff00ff',
                          },
                        }}
                      />
                    }
                    label="Market Events"
                    sx={{ color: '#fff' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.tradeConfirmations}
                        onChange={(e) => handleSettingChange('tradeConfirmations', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#ff00ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#ff00ff',
                          },
                        }}
                      />
                    }
                    label="Trade Confirmations"
                    sx={{ color: '#fff' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#ff00ff',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#ff00ff',
                          },
                        }}
                      />
                    }
                    label="Push Notifications"
                    sx={{ color: '#fff' }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Notification Volume
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VolumeOff sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      <Slider
                        value={settings.notificationVolume}
                        onChange={(e, value) => handleSettingChange('notificationVolume', value)}
                        sx={{
                          color: '#ff00ff',
                          '& .MuiSlider-thumb': {
                            background: '#ff00ff',
                          },
                          '& .MuiSlider-track': {
                            background: '#ff00ff',
                          },
                        }}
                      />
                      <VolumeUp sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {settings.notificationVolume}%
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Trading Settings */}
          <Grid xs={12} md={6}>
            <Slide direction="up" in={true} timeout={1400}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Security sx={{ color: '#00ff88' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Trading Preferences
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoConfirmTrades}
                        onChange={(e) => handleSettingChange('autoConfirmTrades', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#00ff88',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#00ff88',
                          },
                        }}
                      />
                    }
                    label="Auto-Confirm Trades"
                    sx={{ color: '#fff' }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Default Order Type
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        value={settings.defaultOrderType}
                        onChange={(e) => handleSettingChange('defaultOrderType', e.target.value)}
                        sx={{
                          color: '#fff',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00ff88',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00ff88',
                          },
                        }}
                      >
                        {orderTypes.map((type) => (
                          <MenuItem key={type.value} value={type.value} sx={{ color: '#000' }}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Risk Level
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {riskLevels.map((level) => (
                        <Chip
                          key={level.value}
                          label={level.label}
                          onClick={() => handleSettingChange('riskLevel', level.value)}
                          sx={{
                            background: settings.riskLevel === level.value ? level.color : 'rgba(255, 255, 255, 0.1)',
                            color: settings.riskLevel === level.value ? '#000' : '#fff',
                            border: `2px solid ${level.color}`,
                            fontWeight: 600,
                            cursor: 'pointer',
                            '&:hover': {
                              background: level.color,
                              color: '#000',
                              transform: 'scale(1.05)',
                              transition: 'all 0.3s ease'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Max Trade Amount ($)
                    </Typography>
                    <TextField
                      type="number"
                      value={settings.maxTradeAmount}
                      onChange={(e) => handleSettingChange('maxTradeAmount', Number(e.target.value))}
                      fullWidth
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#00ff88',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#00ff88',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Performance Settings */}
          <Grid xs={12} md={6}>
            <Slide direction="up" in={true} timeout={1600}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  height: 'fit-content'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Speed sx={{ color: '#ffa726' }} />
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    Performance
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.realTimeUpdates}
                        onChange={(e) => handleSettingChange('realTimeUpdates', e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#ffa726',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#ffa726',
                          },
                        }}
                      />
                    }
                    label="Real-time Updates"
                    sx={{ color: '#fff' }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Data Refresh Rate (seconds)
                    </Typography>
                    <Slider
                      value={settings.dataRefreshRate}
                      onChange={(e, value) => handleSettingChange('dataRefreshRate', value)}
                      min={5}
                      max={30}
                      step={5}
                      marks={[
                        { value: 5, label: '5s' },
                        { value: 10, label: '10s' },
                        { value: 15, label: '15s' },
                        { value: 20, label: '20s' },
                        { value: 25, label: '25s' },
                        { value: 30, label: '30s' }
                      ]}
                      sx={{
                        color: '#ffa726',
                        '& .MuiSlider-thumb': {
                          background: '#ffa726',
                        },
                        '& .MuiSlider-track': {
                          background: '#ffa726',
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Current: {settings.dataRefreshRate} seconds
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Settings; 