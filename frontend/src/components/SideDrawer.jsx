import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
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
import MailIcon from '@mui/icons-material/Mail'; // for Contact Us
import logo from '../../public/assets/legalmitra_black.png';

export default function SideDrawer({ open, toggleDrawer }) {
    const navigate = useNavigate(); // Initialize useNavigate
    const location = useLocation(); // Track the current route

    // Function to handle item click, including navigation
    const handleItemClick = (item, path) => {
        console.log(`${item} clicked!`);

        // Navigating to different routes based on the item clicked
        navigate(path);
    };

    // Function to check if the current route matches the given path
    const isActive = (path) => location.pathname === path;

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" >
            <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
                <img src={logo} className="w-8 h-8 mr-2" alt="LegalMitra Logo" />
                <h2>LegalMitra</h2>
            </Box>

            <Divider />
            <List>
                {[
                    { text: 'Legal Advice', path: '/legal-advice', icon: <GavelIcon /> },
                    { text: 'Legal Documents', path: '/legal-documents', icon: <DocumentScannerIcon /> },
                    { text: 'Case Studies', path: '/legal-case-studies', icon: <ListAltIcon /> },
                    { text: 'Lawyers Directory', path: '/lawyers-directory', icon: <PeopleIcon /> },
                    { text: 'Legal Chat', path: '/legal-chat', icon: <HelpIcon /> }
                ].map(({ text, path, icon }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            onClick={() => handleItemClick(text, path)}
                            sx={{
                                backgroundColor: isActive(path) ? 'rgba(0, 123, 255, 0.1)' : 'transparent', // Highlight active tab
                                '&:hover': {
                                    backgroundColor: isActive(path) ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.1)',
                                }
                            }}
                        >
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {[
                    { text: 'Legal News', path: '/legal-news', icon: <ArticleIcon /> },
                    { text: 'FAQ', path: '/faq', icon: <HelpIcon /> },
                    { text: 'Contact Us', path: '/contact', icon: <MailIcon /> }
                ].map(({ text, path, icon }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            onClick={() => handleItemClick(text, path)}
                            sx={{
                                backgroundColor: isActive(path) ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                '&:hover': {
                                    backgroundColor: isActive(path) ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.1)',
                                }
                            }}
                        >
                            <ListItemIcon>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
}
