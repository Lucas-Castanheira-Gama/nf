import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/cadastro';
import Login from './pages/login';
import Listar from './pages/listar';
import Visualizar_notas from './pages/vizualizar';
import Contato from './pages/contato';
import Config from './pages/config';
import Home from './pages/home'


function App() {
  return (
    // <div className="flex flex-col min-h-screen">
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listar" element={<Listar />} />
            <Route path="/visualizar" element={<Visualizar_notas />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/config" element={<Config />} />
          </Routes>
      </Router>

  );
}

export default App;
