import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Pañalera from './components/Pañalera.jsx';
import Categoria from './components/Categoria.jsx';
import SobreNosotros from './components/SobreNosotros.jsx';
import { Routes, Route, Navigate } from 'react-router';

const App = () => {

  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Pañalera/>} />
        <Route path='/categorías/todas' element={<Categoria/>} />
        <Route path='/sobre-nosotros' element={<SobreNosotros/>} />
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
      <Footer/>
    </>
  )

}
export default App;
