import React from 'react';
import Menu from './components/Menu';


//Styles
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#26415f",
      main: "#005571",
      dark: "#72bfb8",
      contrastText: "#fff"
    },
    secondary: {
      light: "#26415f",
      main: "#72bfb8",
      dark: "#26415f",
      contrastText: "#fff"
    },
    default: "#d73939",
    
    typography: {
      useNextVariants: true
    }
  }
});




function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div >
        <Menu/>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
