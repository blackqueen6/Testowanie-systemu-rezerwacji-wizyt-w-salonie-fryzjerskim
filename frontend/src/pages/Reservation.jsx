import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config';

const isLoggedIn = () => {
    const token = sessionStorage.getItem('token');
    return token !== null;
};

const getUserRole = () => {
    const role = sessionStorage.getItem('role');
    return role;
};

const Reservation = () => {
    const [openCategory, setOpenCategory] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        setToken(storedToken);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${BASE_URL}/services`);
                const data = await res.json();
                if (res.ok) {
                    setServices(data);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                toast.error('Błąd podczas pobierania usług');
            }
        };

        fetchServices();
    }, []);

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    const handleAppointmentClick = () => {
        const role = getUserRole();
        if (role === 'fryzjer') {
            toast.error('Fryzjer nie może się umówić');
            return;
        }
        if (isLoggedIn()) {
            navigate('/calendar');
        } else {
            navigate('/login');
        }
    };

    const renderServices = (category) => {
        return services
            .filter(service => service.category === category)
            .map(service => (
                <div key={service.name} className="bg-[#fafae7] py-2 px-4 rounded-lg w-full text-left flex justify-between items-center">
                    <div>
                        {service.name} : {service.price} zł - {service.maxPrice} zł
                    </div>
                    <button
                        className="bg-[#d4af37] hover:bg-[#c9a42b] text-white py-1 px-3 rounded-lg"
                        onClick={handleAppointmentClick}
                    >
                        Umów
                    </button>
                </div>
            ));
    };

    return (
        <div className="container mx-auto py-8 px-4 lg:px-24">
            <h1 className="text-4xl font-libre text-gradient-gold mt-8 font-bold mb-8 text-center">Rezerwacja wizyty</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-10">
                <div className="col-span-1 flex justify-center items-center">
                    <img
                        src="../src/assets/images/salon.jpg"
                        alt="Salon"
                        className="w-full h-100 object-cover rounded-lg shadow-md"
                    />
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <img
                        src="../src/assets/images/home.jpg"
                        alt="Home"
                        className="w-full h-100 object-cover rounded-lg shadow-md"
                    />
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <img
                        src="../src/assets/images/salon2.jpg"
                        alt="Salon 2"
                        className="w-full h-100 object-cover rounded-lg shadow-md"
                    />
                </div>
            </div>
            {/* Sekcja usług */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold font-libre mb-4">Usługi</h2>
                <div className="bg-[#d4af37] rounded-lg p-4">
                    {['Koloryzacja', 'Modelowanie i czesanie', 'Pielęgnacja', 'Strzyżenie damskie', 'Strzyżenie męskie'].map(category => (
                        <div key={category} className="border-b border-gray-300 pb-2 mb-2">
                            <h3
                                className="text-xl font-semibold mb-2 cursor-pointer flex justify-between items-center"
                                onClick={() => toggleCategory(category)}
                            >
                                {category}
                                <span>{openCategory === category ? '▲' : '▼'}</span>
                            </h3>
                            {openCategory === category && (
                                <div className="grid grid-cols-1 gap-2">
                                    {renderServices(category)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Sekcja informacji kontaktowych i godzin otwarcia */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Informacje ogólne</h3>
                    <p className="text-lg mb-2">Numer telefonu: <a href="tel:+48530787553" className="text-orange-600 font-bold">+48 530 787 553</a></p>
                    <p className="text-lg mb-2">Adres e-mail: fryzglam@gmail.com</p>
                    <p className="text-lg mb-2 font-bold"> Zadzwoń lub napisz do nas, aby umówić wizytę lub zapytać o szczegóły.</p>
                </div>

                {/* Godziny otwarcia */}
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Godziny otwarcia</h3>
                    <p>Poniedziałek: <span className="font-bold">11:00 - 19:00</span></p>
                    <p>Wtorek: <span className="font-bold">11:00 - 19:00</span></p>
                    <p>Środa: <span className="font-bold">11:00 - 19:00</span></p>
                    <p>Czwartek: <span className="font-bold">11:00 - 19:00</span></p>
                    <p>Piątek: <span className="font-bold">11:00 - 19:00</span></p>
                    <p>Sobota: <span className="font-bold">08:00 - 16:00</span></p>
                    <p>Niedziela: <span className="font-bold">nieczynne</span></p>
                </div>
            </div>

            {/* Sekcja zespołu */}
            <div className="mb-8">
                <h2 className="text-3xl font-semibold mb-4">Zespół</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <img
                            src="../src/assets/images/1.png"
                            alt="Anna"
                            className="w-24 h-24 mx-auto rounded-full mb-2"
                        />
                        <p className="text-lg font-semibold">Anna</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="../src/assets/images/2.png"
                            alt="Ewa"
                            className="w-24 h-24 mx-auto rounded-full mb-2"
                        />
                        <p className="text-lg font-semibold">Ewa</p>
                    </div>
                    <div className="text-center">
                        <img
                            src="../src/assets/images/3.png"
                            alt="Janusz"
                            className="w-24 h-24 mx-auto rounded-full mb-2"
                        />
                        <p className="text-lg font-semibold">Janusz</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reservation;