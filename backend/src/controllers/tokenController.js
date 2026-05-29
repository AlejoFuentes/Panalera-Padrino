import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../constants.js';

class TokenController {
  constructor(service) {
    this.service = service;
  }
  
  generateToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  
  validateToken = (token) => jwt.verify(token, JWT_SECRET);

  checkRole = (role) => {
    return async (req, res, next) => {
      if (role === 'public') {
        next();
        return
      }
      if (role === 'admin' || role === 'user') {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          res.status(401).json({ error: 'Authorization header is required' });
          return;
        }
        try {
          const decoded = this.validateToken(authHeader);
          
          const consulta = await this.service.query('SELECT * FROM usuarios WHERE id = $1', [decoded.userId]);
          
          if (consulta.rows.length === 0) {
             return res.status(401).json({ error: 'Usuario no encontrado en el sistema' });
          }

          req.user = consulta.rows[0];
          next();
        } catch (error) {
          console.log(error);
          res.status(401).json({ error: 'Invalid token' });
        }
      } else {
        throw new Error(`Invalid role: ${role}`);
      }
    }
  }
}

export default TokenController;