import './Header.css';
import { Outlet, useNavigate } from "react-router";

const Header = () => {

  const navigate = useNavigate();

    return (
      <>
        <div className="Header-Pañalera row justify-content-between m-0">
            <div className='col-2 imagen-logoPañalera'>
                <img src='/images/logo-distulin.png' className='h-100 w-100'></img>
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
                          <li className="nav-item">
                            <button className="nav-link text-light" onClick={() => navigate('/categorías/todas')}>Categorías</button>
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