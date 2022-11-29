import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Main from './containers/Main';
import { borderRadius } from '@mui/system';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff'
    },
    secondary: {
      main: '#CCCCCB'
    },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        root: {
          padding: '8px',
          backgroundColor: '#454A50',
          borderRadius: '10px',
        },
        track: {
          height: '15px',
          backgroundColor: '#CCCBCB'
        },
        rail: {
          backgroundColor: 'transparent'
        },
        thumb: {
          backgroundColor: '#CCCBCB',
          height: '20px',
          width: '20px',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Main />
    </ThemeProvider>
  );
}

export default App;