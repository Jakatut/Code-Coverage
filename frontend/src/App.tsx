import React from 'react';
import logo from './logo.svg';
import './App.css';
import Repository from 'pages/repository/Repository';
import { RepositoryProvider } from 'context/providers/RepositoryProvider';

function App() {
  return (
    <RepositoryProvider>
      <Repository name={"test"}/>
    </RepositoryProvider>
  );
}

export default App;
