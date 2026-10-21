import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'
import AIAssistant from './components/assistant/AIAssistant'
const App = () => {
  return (
    <div className='main-h-screen bg-black'>
    <Navbar/>

    <main>
      
      <Hero/>
      <About />
      <Skills />
      <Projects/>
      <Contact/>
    </main>
    <Footer/>
    <AIAssistant />

    </div>
  )
}

export default App
