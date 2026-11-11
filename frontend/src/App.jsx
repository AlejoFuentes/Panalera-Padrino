// Agregamos useLocation al import
import { Routes, Route, Navigate, useLocation } from 'react-router';
import Header from './components/estructura/Header.jsx';
import Footer from './components/estructura/Footer.jsx';
import Pañalera from './components/contenido/Pañalera.jsx';
import Categoria from './components/contenido/Categoria.jsx';
import SobreNosotros from './components/contenido/SobreNosotros.jsx';
import Login from './components/panel/Login.jsx';
import AbmProductos from './components/panel/AbmProductos.jsx';
import RutaProtegida from './components/panel/RutaProtegida.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <Route path='/admin/productos' element={<RutaProtegida><AbmProductos/></RutaProtegida>} />

        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
      {!esAdmin && <Footer />}

      {/* Los toasts solo se muestran en el panel administrativo */}
      {esAdmin && <ToastContainer position="top-right" autoClose={3000} />}
    </>
  )
}

export default App;