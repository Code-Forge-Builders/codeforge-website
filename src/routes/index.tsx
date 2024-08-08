import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'
import { lazy, Suspense } from 'react'
import PageLoading from '@/components/PageLoading'

const Home = lazy(() => import('@/pages/Home'))

function MainRouter() {
  return (
    <Router>
      <Suspense fallback={<PageLoading />}>
        <MainLayout>
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path="*" element={'Página não encontrada'} />
          </Routes>
        </MainLayout>
      </Suspense>
    </Router>
  )
}

export default MainRouter
