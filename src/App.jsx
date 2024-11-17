import React from 'react';
import ReportPage from './ReportPage.jsx';
import './App.css';

function App() {
  const clientId = 1; // Example client ID

  return (
    <div className="App">
      <ReportPage clientId={clientId} />
    </div>
  );
}

export default App;
