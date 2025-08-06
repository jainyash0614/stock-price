import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  TextField, 
  Grid,
  Chip,
  Divider,
  IconButton,
  Fade,
  Slide,
  Grow,
  Alert
} from '@mui/material';
import { 
  Edit, 
  Save, 
  Cancel, 
  Person,
  Email,
  CalendarToday,
  TrendingUp,
  AccountBalance,
  Star
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || 'Passionate trader focused on long-term growth and strategic investments.'
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here you would typically make an API call to update the user profile
    setShowAlert(true);
    setIsEditing(false);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleCancel = () => {
    setEditData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || 'Passionate trader focused on long-term growth and strategic investments.'
    });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = [
    { label: 'Total Trades', value: '127', icon: TrendingUp, color: '#00ff88' },
    { label: 'Win Rate', value: '68%', icon: Star, color: '#ffd700' },
    { label: 'Portfolio Value', value: '$45,230', icon: AccountBalance, color: '#00d4ff' },
    { label: 'Member Since', value: 'Dec 2023', icon: CalendarToday, color: '#ff00ff' }
  ];

  return (
    <Fade in={true} timeout={800}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, color: '#fff', fontWeight: 700 }}>
          👤 User Profile
        </Typography>

        {showAlert && (
          <Slide direction="down" in={showAlert}>
            <Alert 
              severity="success" 
              sx={{ mb: 3, background: 'rgba(0, 255, 136, 0.1)', border: '1px solid #00ff88' }}
            >
              Profile updated successfully!
            </Alert>
          </Slide>
        )}

        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid xs={12}>
            <Slide direction="up" in={true} timeout={1000}>
              <Paper 
                sx={{ 
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #00d4ff, #ff00ff, #00ff88)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'linear-gradient(135deg, #00d4ff, #ff00ff)',
                      fontSize: '2rem',
                      border: '3px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      }
                    }}
                  >
                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                      {user?.username || 'User'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {user?.email || 'user@example.com'}
                    </Typography>
                    <Chip 
                      label="Premium Member" 
                      sx={{ 
                        background: 'linear-gradient(135deg, #ffd700, #ffa500)',
                        color: '#000',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Box>
                    {!isEditing ? (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        sx={{
                          borderColor: '#00d4ff',
                          color: '#00d4ff',
                          '&:hover': {
                            borderColor: '#00ff88',
                            color: '#00ff88',
                            background: 'rgba(0, 255, 136, 0.1)'
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          onClick={handleSave}
                          sx={{
                            background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #00d4ff, #00ff88)',
                            }
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: '#ff4757',
                            color: '#ff4757',
                            '&:hover': {
                              borderColor: '#ff6b7a',
                              color: '#ff6b7a',
                              background: 'rgba(255, 71, 87, 0.1)'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 3 }} />

                {/* Stats Grid */}
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid xs={12} sm={6} md={3} key={stat.label}>
                      <Grow in={true} timeout={1200 + index * 200}>
                        <Paper
                          sx={{
                            p: 2,
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2), 0 0 20px ${stat.color}20`
                            }
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              background: `${stat.color}20`,
                              border: `2px solid ${stat.color}40`,
                              mb: 1,
                              mx: 'auto'
                            }}
                          >
                            <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
                          </Box>
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {stat.label}
                          </Typography>
                        </Paper>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Slide>
          </Grid>

          {/* Profile Details */}
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
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                  Personal Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Username
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00d4ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {user?.username || 'Username'}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Email
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00d4ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {user?.email || 'user@example.com'}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Bio
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#fff',
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.3)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00d4ff',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00d4ff',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Typography variant="body1" sx={{ color: '#fff' }}>
                        {editData.bio}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Trading Preferences */}
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
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 2 }}>
                  Trading Preferences
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Risk Tolerance
                    </Typography>
                    <Chip 
                      label="Moderate" 
                      sx={{ 
                        background: 'rgba(255, 166, 38, 0.2)',
                        color: '#ffa726',
                        border: '1px solid #ffa726'
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Preferred Sectors
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label="Technology" size="small" sx={{ background: 'rgba(0, 212, 255, 0.2)', color: '#00d4ff' }} />
                      <Chip label="Healthcare" size="small" sx={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88' }} />
                      <Chip label="Finance" size="small" sx={{ background: 'rgba(255, 0, 255, 0.2)', color: '#ff00ff' }} />
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      Trading Style
                    </Typography>
                    <Chip 
                      label="Swing Trading" 
                      sx={{ 
                        background: 'rgba(0, 255, 136, 0.2)',
                        color: '#00ff88',
                        border: '1px solid #00ff88'
                      }}
                    />
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

export default UserProfile; 