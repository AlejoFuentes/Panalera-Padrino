import { useNavigate } from 'react-router';
import './SobreNosotros.css';

const SobreNosotros = () => {
    const navigate = useNavigate();

    // Reutilizamos el número de WhatsApp que ya tenías en los productos
    const numeroWhatsapp = '5491152484930'; 
    const mensajeWa = '¡Hola! Me gustaría hacer una consulta.';
    const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensajeWa)}`;

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
                            [Lorem ipsum dolor sit, amet consectetur adipisicing elit. Commodi accusantium laboriosam cum corrupti quae modi dolorem nobis laudantium recusandae cumque odio atque tempora sint reprehenderit, fugit eveniet mollitia reiciendis. Quas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta commodi iste architecto quibusdam sequi exercitationem totam itaque doloremque adipisci, animi aperiam natus eaque error ad assumenda illo facere deserunt fugiat. ]
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
                        <p className='text-secondary mb-4 fs-6 px-3'>
                            [Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae ex minima iusto tempora illo. Est officiis, dolorum fugiat asperiores corporis voluptas ea dolores aliquid sunt quae dignissimos doloremque? Facere, fuga. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus repellat placeat, nobis nihil aperiam distinctio iure atque nesciunt quo sequi praesentium! Nihil amet laborum animi, atque commodi fugiat libero dolores. ]
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