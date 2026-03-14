import React, { useState } from 'react';
import { Typography, IconButton, Badge, Tooltip, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { LucideLayers, LucideSearch, LucideBell, LucideMoon, LucideSun, LucideMenu, LucideX, LucideLogOut, LucideUser } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { useThemeControl } from '../../context/ThemeContext';
import '../../styles/Layout.less';

const Layout = ({ children, sidebarContent, analyticsContent, bannerContent }) => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeControl();
  // Use a single state for sidebar visibility across all screen sizes
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  // Profile Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  // Update layout when window resizes to handle responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`insight-layout ${mode === 'dark' ? 'dark-mode' : ''}`}>
      {/* Sticky Header */}
      <header className="site-header animate-fade">
        <div className="header-container">
          <div className="header-left">
            <IconButton 
              className="sidebar-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ mr: 1, color: 'var(--text-color)' }}
            >
              {sidebarOpen ? <LucideX size={24} /> : <LucideMenu size={24} />}
            </IconButton>
            <div className="logo-box">
              <LucideLayers size={24} />
            </div>
            <Typography variant="h1" className="site-title">Smart Filter Hub</Typography>
            <div className="search-bar">
              <LucideSearch className="search-icon" size={18} />
              <input type="text" placeholder="Search across all records..." />
            </div>
          </div>
          
          <div className="header-right">
            <IconButton className="header-action">
              <Badge color="error" variant="dot">
                <LucideBell size={20} />
              </Badge>
            </IconButton>
            <IconButton className="header-action" onClick={toggleTheme}>
              {mode === 'light' ? <LucideMoon size={20} /> : <LucideSun size={20} />}
            </IconButton>
            <div className="header-divider" />
            
            <Tooltip title="Account settings">
              <div 
                className="user-profile" 
                onClick={handleMenuOpen}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div className="user-info">
                  <span className="user-name">{user?.displayName || 'Admin User'}</span>
                  <span className="user-role">Super Admin</span>
                </div>
                <img 
                  src={user?.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuD1FC0J2xp3ZHMQXYgF-VBu8lZKIwrr-GoGvlnc22r3VJU3jhP8nahHjTHeRUY6Jo4Q4vJhn_ALeY61WL7TBGEAz4Wd9AJlBOMGs9f4zCkton_b1piWlFQw3__sDbbKPWWm_HzNMjmIHGY5qzHJ9Fb3ST_5HbRieSVzJ8s5Py6Wg6m_yOm2HXfgYRVc88z31mYRve5nxujxZbY2q5CulzRwJOZwz1F2OPtmZCvJYbGO4sNb8fGGdkSMUAiSxaI8RhHxmj1LPq_Kg_kZ"} 
                  alt="Profile" 
                  className="profile-img"
                />
              </div>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: mode === 'dark' 
                    ? 'drop-shadow(0px 4px 12px rgba(124, 105, 239, 0.4))' // Soft primary color glow
                    : 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  mt: 1.5,
                  backgroundColor: mode === 'dark' ? '#1e293b' : 'var(--background)',
                  color: 'var(--text-color)',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    backgroundColor: mode === 'dark' ? '#1e293b' : 'var(--background)',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <LucideUser size={18} color="var(--text-muted)" />
                </ListItemIcon>
                Profile settings
              </MenuItem>
              <Divider sx={{ borderColor: 'var(--border-color-light)' }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LucideLogOut size={18} color="var(--error-color)" />
                </ListItemIcon>
                <Typography color="var(--error-color)" variant="inherit">Sign out</Typography>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Banner Content (Top) */}
        {bannerContent && (
          <div className="banner-row animate-fade">
            {bannerContent}
          </div>
        )}

        {/* Analytics Row */}
        {analyticsContent && (
          <section className="analytics-grid animate-slide-up">
            {analyticsContent}
          </section>
        )}

        <div className="content-layout-grid">
          {/* Sidebar */}
          <aside className={`sidebar animate-slide-up delay-100 ${sidebarOpen ? 'is-open' : ''}`}>
            {sidebarContent}
          </aside>

          {/* Page Content */}
          <section className="page-content-area animate-slide-up delay-200">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Layout;
