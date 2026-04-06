import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { Pool } = pg;
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || ''),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on('connect', (client) => {
  client.query('SET SESSION CHARACTERISTICS AS TRANSACTION READ WRITE');
});

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students ORDER BY package DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get placement statistics
app.get('/api/placement-stats', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_students,
        COUNT(CASE WHEN company IS NOT NULL THEN 1 END) as placed_students,
        AVG(package) as avg_package,
        MAX(package) as max_package,
        MIN(package) as min_package
      FROM students
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    console.log('POST /api/students - Body:', req.body);
    const { name, register_id, department, degree, year, dob, gender, mobile, email, address, package: pkg, company } = req.body;
    const result = await pool.query(
      'INSERT INTO students (name, register_id, department, degree, year, dob, gender, mobile, email, address, package, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [name, register_id, department, degree, year, dob, gender, mobile, email, address, pkg, company]
    );
    console.log('Inserted student:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('POST /api/students error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { name, register_id, department, degree, year, dob, gender, mobile, email, address, package: pkg, company } = req.body;
    const result = await pool.query(
      'UPDATE students SET name=$1, register_id=$2, department=$3, degree=$4, year=$5, dob=$6, gender=$7, mobile=$8, email=$9, address=$10, package=$11, company=$12 WHERE id=$13 RETURNING *',
      [name, register_id, department, degree, year, dob, gender, mobile, email, address, pkg, company, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Departments
app.get('/api/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.departments ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET Departments error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/departments', async (req, res) => {
  try {
    console.log('POST /api/departments - Body:', req.body);
    const { name, code } = req.body;
    const result = await pool.query('INSERT INTO public.departments (name, code) VALUES ($1, $2) RETURNING *', [name, code]);
    console.log('Inserted department:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Department error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/departments/:id', async (req, res) => {
  try {
    const { name, code } = req.body;
    const result = await pool.query('UPDATE public.departments SET name = $1, code = $2 WHERE id = $3 RETURNING *', [name, code, req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM public.departments WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Degrees
app.get('/api/degrees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.degrees ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET Degrees error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/degrees', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO public.degrees (name, code, duration_years) VALUES ($1, $2, $3) RETURNING *', [name, name.substring(0, 10).toUpperCase(), 4]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Degree error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/degrees/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('UPDATE public.degrees SET name = $1 WHERE id = $2 RETURNING *', [name, req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/degrees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM public.degrees WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Companies
app.get('/api/companies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.companies ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('GET Companies error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('INSERT INTO public.companies (name, industry, location) VALUES ($1, $2, $3) RETURNING *', [name, 'Technology', 'India']);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Company error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/companies/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query('UPDATE public.companies SET name = $1 WHERE id = $2 RETURNING *', [name, req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM public.companies WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Forgot Password
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [email]);
    if (result.rows.length > 0) {
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await pool.query('UPDATE users SET reset_token = $1 WHERE username = $2', [resetToken, email]);
      
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset - EduMetric',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Reset Your Password</h2>
            <p>You requested to reset your password for your EduMetric account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #6B7280; word-break: break-all;">${resetLink}</p>
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
            <p style="color: #6B7280; font-size: 14px;">This link will expire in 1 hour.</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      res.json({ success: true, message: 'Reset instructions sent' });
    } else {
      res.status(404).json({ success: false, message: 'Email not found' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reset Password
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const result = await pool.query('UPDATE users SET password = $1, reset_token = NULL WHERE reset_token = $2 RETURNING *', [password, token]);
    if (result.rows.length > 0) {
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add user
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const result = await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *', [username, password, role]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { username, role, password } = req.body;
    let query, params;
    if (password) {
      query = 'UPDATE users SET username = $1, role = $2, password = $3 WHERE id = $4 RETURNING *';
      params = [username, role, password, req.params.id];
    } else {
      query = 'UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING *';
      params = [username, role, req.params.id];
    }
    const result = await pool.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Master Key
app.get('/api/master-key', async (req, res) => {
  try {
    const result = await pool.query('SELECT key_value FROM master_key ORDER BY id DESC LIMIT 1');
    res.json(result.rows[0] || { key_value: '123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/master-key', async (req, res) => {
  try {
    const { key_value } = req.body;
    await pool.query('DELETE FROM master_key');
    const result = await pool.query('INSERT INTO master_key (key_value) VALUES ($1) RETURNING *', [key_value]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Formula Config
app.get('/api/formula-config', async (req, res) => {
  try {
    const result = await pool.query('SELECT formula_name, formula_value FROM formula_config');
    const config = {};
    result.rows.forEach(row => {
      config[row.formula_name] = JSON.parse(row.formula_value);
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/formula-config', async (req, res) => {
  try {
    const config = req.body;
    await pool.query('DELETE FROM formula_config');
    for (const [key, value] of Object.entries(config)) {
      await pool.query('INSERT INTO formula_config (formula_name, formula_value) VALUES ($1, $2)', [key, JSON.stringify(value)]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

pool.query('SELECT current_database(), current_user, version(), inet_server_addr(), inet_server_port()').then(result => {
  console.log('Database:', result.rows[0].current_database);
  console.log('User:', result.rows[0].current_user);
  console.log('Version:', result.rows[0].version);
  console.log('Server:', result.rows[0].inet_server_addr, ':', result.rows[0].inet_server_port);
  return pool.query("SELECT tablename FROM pg_tables WHERE schemaname = 'public'");
}).then(result => {
  console.log('Tables in public schema:', result.rows.map(r => r.tablename));
}).catch(err => console.error('DB connection error:', err));

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
