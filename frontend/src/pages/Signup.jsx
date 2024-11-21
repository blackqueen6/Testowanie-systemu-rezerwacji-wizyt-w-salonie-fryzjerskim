import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config.js';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader.js';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        role: 'klient',
        adminCode: '',
        specialization: '',
        description: '',
        photo: '',
        status: 'w_pracy'
    });
    const [errors, setErrors] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        adminCode: '',
        specialization: ''
    });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Sprawdzenie, czy wszystkie wymagane pola są wypełnione
        const requiredFields = ['name', 'lastName', 'email', 'password', 'phone'];
        if (formData.role === 'fryzjer') {
            requiredFields.push('specialization', 'adminCode');
        }
        let allFieldsFilled = true;
        requiredFields.forEach(field => {
            if (!formData[field]) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: 'Wypełnij to pole'
                }));
                allFieldsFilled = false;
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [field]: ''
                }));
            }
        });

        if (!allFieldsFilled) {
            setLoading(false);
            return;
        }

        // Walidacja imienia
        const nameRegex = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/;
        if (!nameRegex.test(formData.name)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: 'Imię może zawierać tylko litery'
            }));
            setLoading(false);
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                name: ''
            }));
        }

        // Walidacja nazwiska
        if (!nameRegex.test(formData.lastName)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                lastName: 'Nazwisko może zawierać tylko litery'
            }));
            setLoading(false);
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                lastName: ''
            }));
        }

        // Walidacja hasła
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Hasło musi zawierać przynajmniej jedną dużą literę, jedną liczbę i mieć minimum 6 znaków'
            }));
            setLoading(false);
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: ''
            }));
        }

        // Walidacja numeru telefonu
        const phoneRegex = /^\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: 'Numer telefonu musi składać się z 9 cyfr'
            }));
            setLoading(false);
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                phone: ''
            }));
        }

        // Walidacja kodu admina
        if (formData.role === 'fryzjer' && formData.adminCode !== 'admin6$') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                adminCode: 'Niepoprawny kod admina'
            }));
            setLoading(false);
            return;
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                adminCode: ''
            }));
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.message.includes('email')) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: 'Konto z tym adresem email już istnieje'
                    }));
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        general: data.message
                    }));
                }
                setLoading(false);
                return;
            }
            setLoading(false);
            toast.success(data.message);
            navigate('/login');
        } catch (err) {
            console.error(err.message);
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: 'Rejestracja nie powiodła się'
            }));
            setLoading(false);
        }
    };

    return (
        <section className="h-full flex items-center justify-center">
            <div className="container max-w-lg mx-auto p-6 bg-white rounded shadow-md flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-6 text-center font-libre text-gradient-gold">Rejestracja</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Imię*</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                            placeholder="Wprowadź imię"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nazwisko*</label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                            placeholder="Wprowadź nazwisko"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adres email*</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                            placeholder="Wprowadź adres email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło*</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                            placeholder="Wprowadź hasło"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Numer telefonu*</label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                            placeholder="Wprowadź numer telefonu"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Płeć</label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                        >
                            <option value="">Wybierz płeć</option>
                            <option value="kobieta">Kobieta</option>
                            <option value="mężczyzna">Mężczyzna</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rola</label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                        >
                            <option value="">Wybierz rolę</option>
                            <option value="klient">Klient</option>
                            <option value="fryzjer">Fryzjer</option>
                        </select>
                    </div>
                    {formData.role === 'fryzjer' && (
                        <>
                            <div>
                                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">Kod admina*</label>
                                <input
                                    type="text"
                                    id="adminCode"
                                    value={formData.adminCode}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                                    placeholder="Wprowadź kod admina"
                                />
                                {errors.adminCode && <p className="text-red-500 text-sm mt-1">{errors.adminCode}</p>}
                            </div>
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specjalizacja*</label>
                                <input
                                    type="text"
                                    id="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                                    placeholder="Wprowadź specjalizację"
                                />
                                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Opis</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                                    placeholder="Wprowadź opis"
                                />
                            </div>
                            <div>
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Zdjęcie</label>
                                <input
                                    type="text"
                                    id="photo"
                                    value={formData.photo}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                                    placeholder="Wprowadź URL zdjęcia"
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm"
                                >
                                    <option value="w_pracy">W pracy</option>
                                    <option value="na_urlopie">Na urlopie</option>
                                </select>
                            </div>
                        </>
                    )}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full py-2 px-4 bg-[#d4af37] text-white font-medium rounded-md shadow-sm hover:bg-[#b38e2c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                    >
                        {loading ? <HashLoader size={35} color="#ffffff" /> : 'Zarejestruj się'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Masz już konto? <Link to='/login' className="text-[#d4af37] hover:underline">Zaloguj się</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Signup;