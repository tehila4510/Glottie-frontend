import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export default function GameOverDialog({ open, onConfirm }) {
  return (
    <Dialog 
      open={open} 
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onConfirm();
        }
      }}
    >
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent>You have run out of hearts. Let's see your results!</DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" fullWidth>
          View Results
        </Button>
      </DialogActions>
    </Dialog>
  );
}