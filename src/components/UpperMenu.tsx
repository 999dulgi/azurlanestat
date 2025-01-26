import * as React from 'react';
import { alpha, styled } from '@mui/material';
import { useState } from 'react';
import { AppBar, Toolbar, InputBase } from '@mui/material';
import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { Drawer } from '@mui/material';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import AnalyticsIcon from '@mui/icons-material/Analytics';


export default function UpperMenu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen: boolean) => {
    setOpen(isOpen);
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem key={'ship'} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DirectionsBoatIcon />
            </ListItemIcon>
            <ListItemText primary="함선" />
          </ListItemButton>
        </ListItem>
        <ListItem key={'analysis'} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="통계" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box >
      <AppBar position="static" sx={{ backgroundColor: '#222' }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={() => { toggleDrawer(true) }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            벽람항로 스탯 기록기
          </Typography>
        </Toolbar>
      </AppBar>
      {/* <Drawer open={open} onClose={() => { toggleDrawer(false) }}>
        {DrawerList}
      </Drawer> */}
    </Box>
  );
}