const BotonFlotanteWSP = () => {
    return(
        <div className="contenedor-flotantes">
            
            {/* <-- BOTÓN FLOTANTE DE WHATSAPP --> */}
                <a 
                  href="https://wa.me/5491126177502?text=Hola!%20Tengo%20una%20consulta%20sobre%20un%20producto" 
                  className="btn-wsp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Consultar por WhatsApp"
                >
                  <i className="bi bi-whatsapp mb-1"></i>
                </a>
            {/* <!-- BOTÓN FLOTANTE DE WHATSAPP --> */}
            
        </div>
    )
}

export default BotonFlotanteWSP;
