import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
// import EditIcon from '@material-ui/icons/Edit';
import StopIcon from '@material-ui/icons/Stop';

const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function FloatingActionButtons() {
  const classes = useStyles();

  function updateDatabase() {
    fetch("/api/data/crime_bulk", {
      method: 'GET',
    })
  }

  function stopUpdate() {
    fetch("/api/data/stop", {
      method: 'GET',
    })
  }

  return (
    <div>
      <Fab color="secondary" size="small" aria-label="add" className={classes.fab} onClick={updateDatabase} elevation={20}>
        <AddIcon />
      </Fab>
      <Fab color="default" aria-label="exit" size="small" className={classes.fab} onClick={stopUpdate}>
        <StopIcon />
      </Fab>
    </div>
  );
}