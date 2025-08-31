import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/header/header';
import Garage from '@/pages/garage';
import Winners from '@/pages/winners';
import './App.css';

function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/garage" replace />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="*" element={<Navigate to="/garage" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
