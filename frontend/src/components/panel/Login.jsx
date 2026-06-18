import './Login.css'
import { useNavigate } from 'react-router';
const Login = () => {

    const navigate = useNavigate();
    
    const loggear = (e) => {
        e.preventDefault();
        navigate('/admin/productos')
        console.log('Usuario loggeado')
    }
    return (
        <div className='h-100 d-flex justify-content-center align-items-center'>
            <div className='contenedor-login'>
                <img className='h-100 col-5 ms-5' src="/images/Baby-pana.svg"/>
                <div className='col-7 d-flex flex-column align-items-center mt-5 h-100'>
                    <img className='logo-tulin-login' src="/images/logo-distulin.png"/>
                    <h1 className='fw-bold mb-4'>¡Bienvenido/a!</h1>
                    <h5>Ingresá tus datos para acceder</h5>
                    <form className='d-flex flex-column gap-3 w-50 mt-4' onSubmit={loggear}>
                        <div className='contenedor-input'>
                            <i className='bi bi-person-fill fs-3 text-secondary me-2'></i>
                            <input 
                                className='input-formulario' 
                                type="email"
                                placeholder='Usuario' 
                            />
                        </div>
                        <div className='contenedor-input'>
                            <i className='bi bi-lock-fill fs-3 text-secondary me-2'></i>
                            <input 
                                className='input-formulario' 
                                type="password"
                                placeholder='Contraseña' 
                            />
                        </div>
                        <button className='btn boton-accion' type='submit'>Iniciar sesión</button>
                    </form>
                    {/* <button className='btn boton-recuperacion'>¿Olvidaste tu contraseña?</button> */}
                </div>
            </div>
        </div>
    )
}
export default Login;