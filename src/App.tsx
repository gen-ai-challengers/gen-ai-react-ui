import React from 'react';
import logo from './logo.svg';
import './App.css';
import MediaPipe from "./components/mediaPipe";
import '@mantine/core/styles.css';
import { createTheme, MantineProvider,Container } from '@mantine/core';
import AppRoutes from './routes/AppRoutes';
const theme = createTheme({
  /** Put your mantine theme override here */
});
function App() {
  const demoProps = {
    h: 50,
    mt: 'md',
  };
  return (
    <MantineProvider theme={theme}>
    <div className="App">
      <div className='App-body'>
      <Container  size="xs" {...demoProps}>
      <AppRoutes/>
      </Container>
      </div>
    </div>
    </MantineProvider>
  );
}

export default App;
