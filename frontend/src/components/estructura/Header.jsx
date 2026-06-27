import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from "react-router";
import { obtenerCategorias } from '../../services/Apis'; 
import './Header.css';

const Header = () => {

  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
      obtenerCategorias()
          .then(response => {
              const categoriasOrdenadas = response.data.sort((a, b) => a.orden - b.orden);
              setCategorias(categoriasOrdenadas);
          })
          .catch(error => console.error('Error al cargar categorías en el Header:', error));
  }, []);

    return (
      <>
        <div className="Header-Pañalera row justify-content-between m-0">
            <div className='col-2 imagen-logoPañalera'>
                <img src='/images/logo-distulin.png' className='h-100 w-100' alt="Logo Distribuidora Tulin" />
            </div>
            <div className='col-7 d-flex align-items-center'>
                <nav className="navbar navbar-expand-lg" id="inicio">
                    <div className="container-fluid">
                      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                      </button>
                      <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-5">
                          
                          <li className="nav-item">
                            <button className="nav-link text-light" onClick={() => navigate('/')}>Productos</button>
                          </li>

                          <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle text-light" 
                                id="navbarDropdown" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                Categorías
                            </button>
                            <ul className="dropdown-menu shadow-sm" aria-labelledby="navbarDropdown">
                                <li>
                                    <button className="dropdown-item" onClick={() => navigate('/')}>
                                        Todas las categorías
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                
                                {categorias.map(cat => (
                                    <li key={cat.id}>
                                        <button className="dropdown-item" onClick={() => navigate(`/categorias/${cat.nombre}`)}>
                                            {cat.nombre}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                          </li>

                          <li className="nav-item">
                            <button className="nav-link text-light" onClick={() => navigate('/sobre-nosotros')}>Sobre nosotros</button>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link text-light" href="#contacto">Contacto</a>
                          </li>
                          
                        </ul>
                      </div>
                    </div>
                </nav>
            </div>
          </div>
        </>
    )
}

export default Header;