import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config';

const MyServiceCard2 = ({ booking }) => {
    const [serviceDetails, setServiceDetails] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTime, setEditedTime] = useState(booking.time);
    const [editedDate, setEditedDate] = useState(booking.appointmentDate);
    const [hairdressers, setHairdressers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedHairdresser, setSelectedHairdresser] = useState(booking.hairdresser._id);
    const [selectedServices, setSelectedServices] = useState(booking.services);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            try {
                const serviceIds = booking.services;
                const response = await fetch(`${BASE_URL}/services/getServicesByIds`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ ids: serviceIds })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setServiceDetails(data);
            } catch (error) {
                console.error('Error fetching service details:', error);
            }
        };

        const fetchHairdressers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/hairdressers`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setHairdressers(data.data);
            } catch (error) {
                console.error('Error fetching hairdressers:', error);
            }
        };

        const fetchServices = async () => {
            try {
                const response = await fetch(`${BASE_URL}/services`, {
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setServices(data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        if (booking && booking.services && Array.isArray(booking.services)) {
            fetchServiceDetails();
        }
        fetchHairdressers();
        fetchServices();
    }, [booking]);

    if (!booking || !booking.hairdresser || !booking.services || !Array.isArray(booking.services)) {
        return <p className='text-center mt-16 text-red-500'>Błąd w danych wizyty</p>;
    }

    const { user, appointmentDate, time } = booking;
    const { name, lastName, email, phone } = user;

    const cancelAppointment = async () => {
        const confirmed = window.confirm('Czy na pewno chcesz odwołać wizytę?');
        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/reservations/bookings/${booking._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                alert('Wizyta została odwołana');
                window.location.reload();
            } else {
                alert('Błąd podczas odwoływania wizyty');
            }
        } catch (error) {
            console.error('Error canceling the appointment:', error);
            alert('Błąd połączenia');
        }
    };

    const editAppointment = async () => {
        try {
            const response = await fetch(`${BASE_URL}/reservations/bookings/${booking._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    appointmentDate: editedDate,
                    time: editedTime,
                    hairdresser: selectedHairdresser,
                    services: selectedServices
                })
            });

            if (response.ok) {
                alert('Wizyta została zaktualizowana');
                window.location.reload();
            } else {
                alert('Błąd podczas aktualizacji wizyty');
            }
        } catch (error) {
            console.error('Error updating the appointment:', error);
            alert('Błąd połączenia');
        }
    };

    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDateTime = new Date(appointmentDate);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();

    const oneDayBefore = new Date(appointmentDateTime);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    oneDayBefore.setHours(23, 59, 59, 999);

    const isPastAppointment = now >= appointmentDateTime;
    const canCancel = now <= oneDayBefore && !isPastAppointment;

    return (
        <div className="mt-4 border p-4 rounded shadow-md max-w-md mx-auto">
            {serviceDetails.map((service, index) => (
                <h3 key={`${service._id}-${index}`} className="text-lg mb-2">
                    {service.name}
                </h3>
            ))}
            <p className="text-gray-600">ul. Kokosowa 1, Tarnów</p>

            <div className="flex items-center mt-4 mb-2">
                <i className="far fa-calendar-alt mr-2 text-sm"></i>
                <p className="text-gray-600">{new Date(appointmentDate).toLocaleDateString()}</p>
                <i className="far fa-clock ml-4 mr-2 text-sm"></i>
                <p className="text-gray-600">{time}</p>
            </div>

            <p className="text-gray-600 mb-1">Użytkownik: {name} {lastName}</p>
            <p className="text-gray-600">Email użytkownika: {email}</p>
            <p className="text-gray-600">Telefon użytkownika: {phone}</p>

            {isPastAppointment ? (
                <p className="text-green-500 mt-4">Wizyta zrealizowana</p>
            ) : (
                <>
                    {canCancel ? (
                        <button
                            className="bg-[#d4af37] text-white py-2 px-4 rounded mt-4 hover:bg-orange-700 w-full"
                            onClick={cancelAppointment}
                        >
                            Odwołaj wizytę
                        </button>
                    ) : (
                        <p className="text-red-500 mt-4">Można odwołać wizytę maksymalnie dzień wcześniej</p>
                    )}
                    <button
                        className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700 w-full"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Anuluj edycję' : 'Edytuj wizytę'}
                    </button>
                    {isEditing && (
                        <div className="mt-4">
                            <label className="block text-gray-700">Data wizyty:</label>
                            <input
                                type="date"
                                value={editedDate}
                                onChange={(e) => setEditedDate(e.target.value)}
                                className="border rounded py-2 px-3 text-gray-700 w-full"
                            />
                            <label className="block text-gray-700 mt-2">Godzina wizyty:</label>
                            <input
                                type="time"
                                value={editedTime}
                                onChange={(e) => setEditedTime(e.target.value)}
                                className="border rounded py-2 px-3 text-gray-700 w-full"
                            />
                            <label className="block text-gray-700 mt-2">Fryzjer:</label>
                            <select
                                value={selectedHairdresser}
                                onChange={(e) => setSelectedHairdresser(e.target.value)}
                                className="border rounded py-2 px-3 text-gray-700 w-full"
                            >
                                {Array.isArray(hairdressers) && hairdressers.map((hairdresser) => (
                                    <option key={hairdresser._id} value={hairdresser._id}>
                                        {hairdresser.name} {hairdresser.lastName}
                                    </option>
                                ))}
                            </select>
                            <label className="block text-gray-700 mt-2">Usługi:</label>
                            <select
                                multiple
                                value={selectedServices}
                                onChange={(e) => setSelectedServices(Array.from(e.target.selectedOptions, option => option.value))}
                                className="border rounded py-2 px-3 text-gray-700 w-full"
                            >
                                {Array.isArray(services) && services.map((service) => (
                                    <option key={service._id} value={service._id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded mt-4 hover:bg-green-700 w-full"
                                onClick={editAppointment}
                            >
                                Zapisz zmiany
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyServiceCard2;