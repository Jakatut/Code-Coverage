import React from 'react';
import './App.css';
import Repository from 'pages/repository/Repository';
import { RepositoryProvider } from 'context/providers/RepositoryProvider';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import CodeCoverage from 'pages/coverage/coverage';

function App() {
  return (
    <React.StrictMode>
      <RepositoryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Repository/>}/>
            <Route path="/coverage" element={<CodeCoverage/>}/>
          </Routes>
        </BrowserRouter>
      </RepositoryProvider>
    </React.StrictMode>
  );
}

export default App;
