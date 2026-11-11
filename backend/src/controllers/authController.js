import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';

const opcionesCookie = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
};

class AuthController {

  constructor(pool) {
    this.pool = pool;
  }

  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const consulta = await this.pool.query('SELECT * FROM usuarios WHERE email = $1', [email.trim()]);
      const usuario = consulta.rows[0];

      if (!usuario) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

      res.cookie('token', token, { ...opcionesCookie, maxAge: 12 * 60 * 60 * 1000 });

      res.json({ mensaje: 'Login exitoso', usuario: { id: usuario.id, email: usuario.email } });
    } catch (error) {
      console.error('Error en el login:', error);
      res.status(500).json({ error: 'Hubo un problema al procesar el login.' });
    }
  };

  verificarSesion = async (req, res) => {
    try {
      const consulta = await this.pool.query('SELECT id, email FROM usuarios WHERE id = $1', [req.usuario.id]);

      if (consulta.rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado en el sistema.' });
      }

      res.json({ usuario: consulta.rows[0] });
    } catch (error) {
      console.error('Error al verificar la sesión:', error);
      res.status(500).json({ error: 'Hubo un problema al verificar la sesión.' });
    }
  };

}

export default AuthController;
