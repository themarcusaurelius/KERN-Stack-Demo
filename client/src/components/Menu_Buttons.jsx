import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
// import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import NavigationIcon from '@material-ui/icons/Navigation';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
    elevation: 23
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FloatingActionButtons() {
  const classes = useStyles();

  return (
    <div>
      <Fab
        elevation={20}
        variant="extended" 
        color="secondary" 
        size="small" 
        aria-label="delete" 
        className={classes.fab}
        href="https://vizion.ai/forum/"
      >
        Developer Forum
      </Fab>
      <Fab
        elevation={20} 
        variant="extended" 
        color="secondary" 
        size="small" 
        aria-label="delete" 
        className={classes.fab}
        href="https://pnap.vizion.ai/elasticsearch/dashboard"
      >
        Manage Stacks
      </Fab>
    </div>
  );
}
