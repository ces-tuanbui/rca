import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WhiteboardList from './components/WhiteboardList';
import Whiteboard from './components/Whiteboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="app-nav bg-black h-10 text-white flex items-center px-4">
          <Link to="/" className="text-white hover:text-gray-300 hover:bg-neutral-700 rounded-md px-2 py-1">Home</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<WhiteboardList />} />
          <Route path="/whiteboard/:id" element={<Whiteboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
