import React from 'react';
import './App.css';
import Repository from 'pages/repository/Repository';
import { RepositoryProvider } from 'context/providers/RepositoryProvider';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Coverage from 'pages/coverage/coverage';

function App() {
  return (
    <React.StrictMode>
      <RepositoryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Repository/>}/>
            <Route path="/coverage" element={<Coverage/>}/>
          </Routes>
        </BrowserRouter>
      </RepositoryProvider>
    </React.StrictMode>
  );
}

export default App;
