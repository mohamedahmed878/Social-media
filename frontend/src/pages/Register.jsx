import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <h1 className="brand-title">
          انضم لـ جيرة<span className="accent">.</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 0, marginBottom: 26 }}>
          اعمل حساب جديد وابدأ تتعرف على ناس جدد
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            className="input"
            placeholder="الاسم"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input"
            type="email"
            placeholder="البريد الإلكتروني"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input"
            type="password"
            placeholder="كلمة المرور (6 أحرف على الأقل)"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <p style={{ color: 'var(--danger)', fontSize: 13, margin: 0 }}>{error}</p>}
          <button className="btn btn-primary" disabled={loading} type="submit">
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
          عندك حساب؟ <Link to="/login" style={{ color: 'var(--accent-2)', fontWeight: 700 }}>سجل دخولك</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
