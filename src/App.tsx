import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/cv/Navbar';
import CvPage from './pages/CvPage';
import AdminPage from './pages/AdminPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ProjectsPage from './pages/ProjectsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<CvPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
