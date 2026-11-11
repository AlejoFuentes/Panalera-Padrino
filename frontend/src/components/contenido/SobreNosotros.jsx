import { useNavigate } from 'react-router';
import './SobreNosotros.css';
import { NUMERO_WHATSAPP } from '../../services/utils';

const SobreNosotros = () => {
    const navigate = useNavigate();

    const mensajeWa = '¡Hola! Me gustaría hacer una consulta.';
    const linkWhatsapp = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensajeWa)}`;

    return(
        // Usamos la misma clase de fondo que en tus otras pantallas para mantener el diseño
        <div className='contenedor-panalera pt-5 pb-5 min-vh-100 d-flex align-items-center'>
            <div className='container bg-white p-5 rounded-4 shadow'>
                <div className='row align-items-center'>
                    
                    {/* Columna Izquierda: Título y texto principal */}
                    <div className='col-md-6 mb-5 mb-md-0 px-md-4'>
                        <h6 className='text-muted fw-bold mb-3' style={{ letterSpacing: '2px' }}>
                            QUIÉNES SOMOS
                        </h6>
                        <h1 className='fw-bold mb-4' style={{ color: "#10198f", fontSize: "3.5rem" }}>
                            Distribuidora Tulin
                        </h1>
                        <p className='fs-5 text-secondary mb-4 lh-base'>
                            Somos una distribuidora mayorista y minorista, dedicada a la comercialización y provisión de productos de higiene, descartables, artículos hospitalarios e insumos de uso diario. Trabajamos con primeras marcas, garantizando calidad, variedad y los mejores precios del mercado.
                        </p>
                        <button 
                            className='btn btn-lg text-white rounded-pill px-5 py-2 fw-bold shadow-sm' 
                            style={{ backgroundColor: "#10198f" }}
                            onClick={() => navigate('/')}
                        >
                            NUESTROS PRODUCTOS
                        </button>
                    </div>

                    {/* Columna Derecha: Logo y datos extra de logística */}
                    <div className='col-md-6 text-center px-md-4 border-start border-2 border-light'>
                        <div>
                            {/* Usamos el logo que ya tenés en tu carpeta public */}
                            <img 
                                src='/images/logo-distulin.png' 
                                alt='Logo Distribuidora Tulin' 
                                className='img-fluid mb-3'
                                style={{ maxWidth: '280px' }}
                            />
                        </div>
                        <p className='text-secondary mb-2 fs-6 px-3'>
                            Realizamos entregas diarias en Capital Federal, Gran Buenos Aires y el Interior del país.
                        </p>
                        <p className='text-secondary mb-4 fs-6 px-3'>
                            Brindamos un servicio ágil y confiable, con asesoramiento personalizado para comercios, instituciones y empresas.
                        </p>
                        <a 
                            href={linkWhatsapp}
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='btn btn-lg btn-success rounded-pill px-5 py-2 fw-bold shadow-sm'
                            style={{ color: "white" }}
                        >
                            COMUNICATE CON NOSOTROS
                        </a>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SobreNosotros;