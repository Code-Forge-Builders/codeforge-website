import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import MainLayout from '../layout/MainLayout'

function MainRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/home`} element={<Home />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default MainRouter
