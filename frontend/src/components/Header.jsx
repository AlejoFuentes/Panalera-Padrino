import './Header.css';

const Header = () => {
    return (
        <div className="Header-Pañalera row justify-content-between">
            <div className='col-2 imagen-logoPañalera'>
                <img src='/images/logo-pañalera.png' className='h-100 w-100'></img>
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
                            <a className="nav-link text-light" href="#">Productos</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link text-light" href="#">Categorías</a>
                          </li>
                          <li className="nav-item">
                            <a className="nav-link text-light" href="#">Sobre nosotros</a>
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
    )
}

export default Header;