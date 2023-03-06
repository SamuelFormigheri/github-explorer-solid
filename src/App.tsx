import { Route, Router, Routes } from '@solidjs/router';
import GlobalStyle from './styles/global';
import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={Dashboard} />
        <Route path="/repository/:owner/:repository" component={Repository} />
      </Routes>
      <GlobalStyle />
    </Router>
  );
};

export default App;
