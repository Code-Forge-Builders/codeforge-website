
import { HashRouter as Router, Route, Routes} from 'react-router-dom';
import Home from '../pages/Home';

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path={`/`} element={<Home/>} />
        <Route path={`/home`} element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
