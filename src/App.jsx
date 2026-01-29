import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import TreksPage from './pages/TreksPage'
import TrekDetail from './pages/TrekDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/treks" element={<TreksPage />} />
          <Route path="/trek/:slug" element={<TrekDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
