
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';

const basePath = import.meta.env.VITE_BASE_PATH || ''

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path={`${basePath}`} element={<Home/>} />
        <Route path={`${basePath}/home`} element={<Home/>} />
        <Route path={`${basePath}/login`} element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
