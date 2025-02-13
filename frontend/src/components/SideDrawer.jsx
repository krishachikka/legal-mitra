import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
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

export default function SideDrawer({open, toggleDrawer}) {
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to handle item click, including navigation
    const handleItemClick = (item) => {
        console.log(`${item} clicked!`);

        // Navigating to different routes based on the item clicked
        switch (item) {
            case 'Legal Advice':
                navigate('/legal-advice');
                break;
            case 'Legal Chat':
                navigate('/legal-chat');
                break;
            default:
                console.log(`No navigation for ${item}`);
                break;
        }
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" >
            {/* Logo */}
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <h2>LegalMitra</h2>
            </Box>
            <Divider />
            <List>
                {['Legal Advice', 'Legal Documents', 'Case Studies', 'Lawyers Directory', 'Legal Chat'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handleItemClick(text)}>
                            <ListItemIcon>
                                {index === 0 ? <GavelIcon /> :
                                    index === 1 ? <DocumentScannerIcon /> :
                                        index === 2 ? <ListAltIcon /> :
                                            index === 3 ? <PeopleIcon /> : index === 4 ? <HelpIcon /> : null}
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
                                    index === 1 ? <HelpIcon /> :
                                        index === 2 ? <MailIcon /> : null}
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
