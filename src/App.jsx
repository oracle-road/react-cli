import React, { Suspense, lazy } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
// import Home from './pages/home';
// import About from './pages/about';
// 路由懒加载, 并命名
const Home = lazy(() =>  import(/* webpackChunkName: 'home' */ './pages/home'))
const About = lazy(() =>  import(/* webpackChunkName: 'about' */ './pages/About'))

const App = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <div>
        <Suspense fallbak={<div>loading...</div>}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;