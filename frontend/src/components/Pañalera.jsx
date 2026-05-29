import './Pañalera.css';

const Pañalera = () => {
    return (
        <div className='h-100 bg-danger'>
            <div className="contenedor-flotantes">
            
            {/* <-- BOTÓN FLOTANTE DE WHATSAPP --> */}
                <a 
                  href="https://wa.me/5491126177502?text=Hola!%20Tengo%20una%20consulta%20sobre%20un%20producto" 
                  className="btn-wsp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Consultar por WhatsApp"
                >
                  <i className="bi bi-whatsapp"></i>
                </a>
            {/* <!-- BOTÓN FLOTANTE DE WHATSAPP --> */}
            
            </div>
        </div>
    )
}

export default Pañalera;