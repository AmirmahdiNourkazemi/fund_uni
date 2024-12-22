import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Typography,
} from "@mui/material";
import { Close, WarningAmberRounded } from "@mui/icons-material";
import { Certificate } from "@phosphor-icons/react";
const colors = [
    "#0754ab",
    "#0860c4",
    "#096cdc",
      "#0a78f5",
      "#2385f6",
    "#3b93f7",

   

  
   
  
    
  ];
export default function WarrantyDialog({ open, onClose, warranties }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex" , justifyContent:'space-between'}}>
        <Typography sx={{fontSize:'18px'}}>ضمانت نامه ها</Typography>
        <IconButton onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <List>
          {warranties.map((warranty , index) => (
            <ListItem key={warranty.id}>
              <ListItemIcon>
              <Certificate size={32} style={{ color: colors[ index ] }} /> {/* Assign color based on index */}
              </ListItemIcon>
              <ListItemText
                primary={warranty.title}
                secondary={warranty.description}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
