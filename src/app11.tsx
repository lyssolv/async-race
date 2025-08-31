import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/header/header11';
import Garage from '@/pages/garage11';
import Winners from '@/pages/winners11';
import './app11.css';

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
