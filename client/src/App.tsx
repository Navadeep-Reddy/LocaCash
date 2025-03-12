import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from '@/pages/Home'
import AnalysisToolPage from '@/pages/AnalysisTool'
import DataInsights from '@/pages/DataInsights'
import About from '@/pages/About'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<AnalysisToolPage />} />
        <Route path="/data" element={<DataInsights />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App