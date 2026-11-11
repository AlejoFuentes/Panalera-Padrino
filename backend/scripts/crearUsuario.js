// Crea un usuario administrador (o le cambia la contraseña si ya existe).
// Uso: npm run crear-usuario
import 'dotenv/config';
import bcrypt from 'bcrypt';
import readline from 'readline/promises';
import pool from '../db.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

try {
    const email = (await rl.question('Email del usuario: ')).trim();
    const password = await rl.question('Contraseña (mínimo 8 caracteres): ');

    if (!email || password.length < 8) {
        console.error('❌ El email es obligatorio y la contraseña debe tener al menos 8 caracteres.');
        process.exit(1);
    }

    const saltRounds = parseInt(process.env.saltRounds) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const existente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);

    if (existente.rows.length > 0) {
        await pool.query('UPDATE usuarios SET password = $1 WHERE email = $2', [hashedPassword, email]);
        console.log(`✅ Se actualizó la contraseña de ${email}`);
    } else {
        await pool.query('INSERT INTO usuarios (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        console.log(`✅ Usuario ${email} creado correctamente`);
    }
} catch (error) {
    console.error('❌ Error al crear el usuario:', error.message);
    process.exitCode = 1;
} finally {
    rl.close();
    await pool.end();
}
