import Header from './components/Header'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import Features from './components/Features'
import TrekCategories from './components/TrekCategories'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Testimonials />
        <Features />
        <TrekCategories />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App

