import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, token } from '../config.js';
import { toast } from 'react-toastify';
import { authContext } from '../context/AuthContext.jsx';
import HashLoader from 'react-spinners/HashLoader.js';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetStage, setResetStage] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(authContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleResetEmailChange = (e) => {
        setResetEmail(e.target.value);
    };

    const handleResetCodeChange = (e) => {
        setResetCode(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            dispatch({ type: 'LOGIN_SUCCESS', payload: { user: result.data, role: result.role, token: result.token } });

            setLoading(false);
            toast.success(result.message);
            navigate('/reservation');
        } catch (err) {
            console.error(err.message);
            setLoading(false);
            toast.error('Logowanie nie powiodło się: ' + err.message);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: resetEmail })
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            setLoading(false);
            toast.success('Kod weryfikacyjny został wysłany na email.');
            setResetStage(2);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
            toast.error('Wysłanie kodu weryfikacyjnego nie powiodło się: ' + err.message);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/verify-reset-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: resetEmail, code: resetCode })
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            setLoading(false);
            toast.success('Kod weryfikacyjny został zweryfikowany.');
            setResetStage(3);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
            toast.error('Weryfikacja kodu nie powiodła się: ' + err.message);
        }
    };

    const handleNewPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/auth/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword })
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }

            setLoading(false);
            toast.success('Hasło zostało zmienione.');
            setResetStage(0);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
            toast.error('Zmiana hasła nie powiodła się: ' + err.message);
        }
    };

    return (
        <section className="h-screen flex items-center justify-center">
            <div className="container max-w-lg mx-auto p-6 bg-white rounded shadow-md">
                <h2 className="text-4xl font-bold mb-6 text-center font-libre text-gradient-gold">Logowanie</h2>
                {resetStage === 0 && (
                    <form className="py-4 md:py-0" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adres email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Wprowadź adres email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Wprowadź hasło"
                            />
                        </div>
                        <div className="mb-4 text-right">
                            <button
                                type="button"
                                className="text-sm text-primary hover:underline"
                                onClick={() => setResetStage(1)}
                            >
                                Zapomniałeś hasła?
                            </button>
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-2 px-4 bg-[#d4af37] text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? <HashLoader size={25} color="#fff" /> : 'Zaloguj się'}
                        </button>
                    </form>
                )}
                {resetStage === 1 && (
                    <form className="py-4 md:py-0" onSubmit={handleResetSubmit}>
                        <div className="mb-4">
                            <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">Adres email</label>
                            <input
                                type="email"
                                id="resetEmail"
                                value={resetEmail}
                                onChange={handleResetEmailChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Wprowadź adres email"
                            />
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-2 px-4 bg-[#d4af37] text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? <HashLoader size={25} color="#fff" /> : 'Wyślij kod weryfikacyjny'}
                        </button>
                    </form>
                )}
                {resetStage === 2 && (
                    <form className="py-4 md:py-0" onSubmit={handleCodeSubmit}>
                        <div className="mb-4">
                            <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700">Kod weryfikacyjny</label>
                            <input
                                type="text"
                                id="resetCode"
                                value={resetCode}
                                onChange={handleResetCodeChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Wprowadź kod weryfikacyjny"
                            />
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-2 px-4 bg-[#d4af37] text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? <HashLoader size={25} color="#fff" /> : 'Zweryfikuj kod'}
                        </button>
                    </form>
                )}
                {resetStage === 3 && (
                    <form className="py-4 md:py-0" onSubmit={handleNewPasswordSubmit}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Nowe hasło</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Wprowadź nowe hasło"
                            />
                        </div>
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full py-2 px-4 bg-[#d4af37] text-white font-medium rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            {loading ? <HashLoader size={25} color="#fff" /> : 'Zmień hasło'}
                        </button>
                    </form>
                )}
                {resetStage === 0 && (
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">Nie masz konta? <Link to='/register' className="text-primary hover:underline">Zarejestruj się</Link></p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Login;