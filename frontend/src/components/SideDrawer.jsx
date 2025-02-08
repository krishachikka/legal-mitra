import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'; // for Legal Documents
import GavelIcon from '@mui/icons-material/Gavel'; // for Legal Advice
import ListAltIcon from '@mui/icons-material/ListAlt'; // for Case Studies
import PeopleIcon from '@mui/icons-material/People'; // for Lawyers Directory
import ArticleIcon from '@mui/icons-material/Article'; // for Legal News
import HelpIcon from '@mui/icons-material/Help'; // for FAQ
import MenuIcon from '@mui/icons-material/Menu'; // Menu icon for opening the drawer
import CloseIcon from '@mui/icons-material/Close'; // Close icon for closing the drawer

export default function SideDrawer() {
    const [open, setOpen] = React.useState(false);

    // Toggles the open state of the drawer
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    // Function to handle item click
    const handleItemClick = (item) => {
        console.log(`${item} clicked!`); // Replace with your desired action, e.g., navigation or state update
        alert(`${item} clicked!`);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            {/* Logo */}
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <h2>LegalMitra</h2>
            </Box>
            <Divider />
            <List>
                {['Legal Advice', 'Legal Documents', 'Case Studies', 'Lawyers Directory'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handleItemClick(text)}>
                            <ListItemIcon>
                                {index === 0 ? <GavelIcon /> :
                                    index === 1 ? <DocumentScannerIcon /> :
                                        index === 2 ? <ListAltIcon /> : <PeopleIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Legal News', 'FAQ', 'Contact Us'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handleItemClick(text)}>
                            <ListItemIcon>
                                {index === 0 ? <ArticleIcon /> :
                                    index === 1 ? <HelpIcon /> : null}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <div>
            {/* Drawer with Logo and List */}
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>

            {/* Icon to open or close drawer */}
            <IconButton
                sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1201 }}
                onClick={toggleDrawer(!open)} // Toggles the drawer state
            >
                {open ? <CloseIcon /> : <MenuIcon />} {/* Changes icon based on state */}
            </IconButton>
        </div>
    );
}
 