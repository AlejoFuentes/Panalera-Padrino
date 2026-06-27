// Agregamos useLocation al import
import { Routes, Route, Navigate, useLocation } from 'react-router';
import Header from './components/estructura/Header.jsx';
import Footer from './components/estructura/Footer.jsx';
import Pañalera from './components/contenido/Pañalera.jsx';
import Categoria from './components/contenido/Categoria.jsx';
import SobreNosotros from './components/contenido/SobreNosotros.jsx';
import Login from './components/panel/login.jsx';
import AbmProductos from './components/panel/AbmProductos.jsx';

const App = () => {

  const location = useLocation();
  const esAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {!esAdmin && <Header />}
      
      <Routes>
        <Route path='/' element={<Pañalera/>} />
        <Route path='/categorias/:nombre' element={<Categoria/>} />
        <Route path='/sobre-nosotros' element={<SobreNosotros/>} />
        <Route path='/admin' element={<Login/>} />
        <Route path='/admin/productos' element={<AbmProductos/>} />

        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
      {!esAdmin && <Footer />}
    </>
  )
}

export default App;