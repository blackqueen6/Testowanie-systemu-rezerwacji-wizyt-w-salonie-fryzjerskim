import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl } from 'date-fns/locale';
import { BASE_URL } from '../config';
import HashLoader from 'react-spinners/HashLoader';

// Rejestracja lokalizacji polskiej
registerLocale('pl', pl);

const getOpeningHoursForDay = (date, hairdresserSchedule) => {
    // Mapowanie dni z języka polskiego na angielski
    const daysMap = {
        'poniedziałek': 'monday',
        'wtorek': 'tuesday',
        'środa': 'wednesday',
        'czwartek': 'thursday',
        'piątek': 'friday',
        'sobota': 'saturday',
        'niedziela': 'sunday'
    };

    // Konwersja nazwy dnia tygodnia
    const dayOfWeekPolish = date.toLocaleDateString('pl-PL', { weekday: 'long' }).toLowerCase();
    const dayOfWeekEnglish = daysMap[dayOfWeekPolish];

    const dayEntry = hairdresserSchedule.find(entry => entry.day === dayOfWeekEnglish);

    // Sprawdzenie, czy dane są poprawne
    if (!dayEntry || !dayEntry.start || !dayEntry.end || dayEntry.start === '' || dayEntry.end === '') {
        return 'nieczynne';
    }
    return `${dayEntry.start} – ${dayEntry.end}`;
};

const generateTimeSlots = (hours, selectedDate, reservations, services, selectedServices) => {
    if (hours === 'nieczynne') return [];

    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
        selectedDate = new Date(selectedDate);
    }

    if (isNaN(selectedDate)) {
        console.error('Invalid selectedDate:', selectedDate);
        return [];
    }

    const [start, end] = hours.split(' – ').map(time => time.split(':').map(Number));
    const startTime = new Date(selectedDate);
    startTime.setHours(start[0], start[1], 0, 0);
    const endTime = new Date(selectedDate);
    endTime.setHours(end[0], end[1], 0, 0);


    let slots = [];
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    const totalServiceTime = selectedServices.reduce((total, service) => {
        return total + (service ? service.time : 0);
    }, 0); // Całkowity czas wybranych usług w minutach

    while (startTime < endTime) {
        const potentialEndTime = new Date(startTime.getTime() + totalServiceTime * 60000);

        if (!isToday || startTime > now) {
            if (potentialEndTime <= endTime) {
                slots.push(startTime.toTimeString().slice(0, 5));
            }
        }
        startTime.setMinutes(startTime.getMinutes() + 30);
    }


    // Filtruje dostępne sloty na podstawie rezerwacji
    reservations.forEach(reservation => {
        const reservationStartTime = new Date(selectedDate);
        const [reservedHour, reservedMinute] = reservation.time.split(':').map(Number);
        reservationStartTime.setHours(reservedHour, reservedMinute, 0, 0);

        if (!Array.isArray(reservation.services) || reservation.services.length === 0) {
            console.warn('Skipping reservation with no services:', reservation);
            return;
        }

        const reservationTotalServiceTime = reservation.services.reduce((total, service) => {
            return total + (service ? service.time : 0);
        }, 0);

        const endReservationTime = new Date(reservationStartTime.getTime() + reservationTotalServiceTime * 60000);

        slots = slots.filter(slot => {
            const slotTime = new Date(selectedDate);
            const [slotHour, slotMinute] = slot.split(':').map(Number);
            slotTime.setHours(slotHour, slotMinute, 0, 0);

            return slotTime < reservationStartTime || slotTime >= endReservationTime;
        });
    });

    return slots;
};

const CalendarPage = () => {
    const [openCategory, setOpenCategory] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHairdresser, setSelectedHairdresser] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hairdressers, setHairdressers] = useState([]);
    const [services, setServices] = useState([]);
    const [openingHours, setOpeningHours] = useState([]);
    const [reservations, setReservations] = useState([]);

    const toggleCategory = (category) => {
        setOpenCategory(openCategory === category ? null : category);
    };

    useEffect(() => {
        if (selectedHairdresser) {
            const fetchHairdresserSchedule = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/hairdressers/${selectedHairdresser._id}/timeSlots`, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setOpeningHours(data.timeSlots || []);
                } catch (error) {
                    console.error('Error fetching hairdresser schedule:', error);
                }
            };

            fetchHairdresserSchedule();
        }
    }, [selectedHairdresser]);

    useEffect(() => {
        if (selectedDate && selectedHairdresser) {
            const fetchReservations = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/reservations/${selectedHairdresser._id}/${selectedDate.toISOString()}`, {
                        headers: {
                            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setReservations(data);
                } catch (error) {
                    console.error('Error fetching reservations:', error);
                }
            };

            fetchReservations();
        }
    }, [selectedDate, selectedHairdresser]);

    useEffect(() => {
        if (selectedDate && selectedServices.length > 0 && openingHours.length > 0) {

            const hours = getOpeningHoursForDay(selectedDate, openingHours);

            const times = generateTimeSlots(hours, selectedDate, reservations, services, selectedServices);
            setAvailableTimes(times);
        } else {
            setAvailableTimes([]);
        }
    }, [selectedDate, openingHours, reservations, services, selectedServices]);

    useEffect(() => {
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

                const hairdressersArray = Array.isArray(data) ? data : data.data;
                const availableHairdressers = hairdressersArray.filter(hairdresser => hairdresser.status !== 'na urlopie');

                setHairdressers(availableHairdressers);
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
                setServices(data.data || data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchHairdressers();
        fetchServices();
    }, []);


    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000); // Ukrywa komunikat po 5 sekundach

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleHairdresserChange = (hairdresser) => {
        setSelectedHairdresser(hairdresser);
        setSelectedTime(null); // Resetowanie wybranej godziny po zmianie fryzjera
    };

    const handleServiceChange = (service) => {
        setSelectedServices(prevServices => {
            const isServiceSelected = prevServices.some(s => s._id === service._id);
            const updatedServices = isServiceSelected
                ? prevServices.filter(s => s._id !== service._id)
                : [...prevServices, service];

            return updatedServices;
        });
    };

    const handleServiceRemove = (service) => {
        setSelectedServices(prevServices => prevServices.filter(s => s._id !== service._id));
    };

    const handleTimeChange = (time) => {
        setSelectedTime(prevTime => (prevTime === time ? null : time)); // Odznaczanie godziny po ponownym kliknięciu
    };

    const handleReservationConfirm = async () => {
        setErrorMessage('');
        if (!selectedDate) {
            setErrorMessage('Proszę wybrać datę.');
            return;
        }
        if (!selectedHairdresser) {
            setErrorMessage('Proszę wybrać fryzjera.');
            return;
        }
        if (!selectedServices || selectedServices.length === 0) {
            setErrorMessage('Proszę wybrać usługi.');
            return;
        }
        if (!selectedTime) {
            setErrorMessage('Proszę wybrać godzinę.');
            return;
        }

        // Sprawdzenie czy użytkownik ma już rezerwację w tym samym terminie
        const existingReservation = reservations.find(reservation => {
            const reservationDate = new Date(reservation.appointmentDate);
            const [reservedHour, reservedMinute] = reservation.time.split(':').map(Number);
            reservationDate.setHours(reservedHour, reservedMinute, 0, 0);

            const selectedDateTime = new Date(selectedDate);
            const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);
            selectedDateTime.setHours(selectedHour, selectedMinute, 0, 0);

            return reservationDate.getTime() === selectedDateTime.getTime() && reservation.hairdresser !== selectedHairdresser._id;
        });

        if (existingReservation) {
            setErrorMessage('Nie można zrobić rezerwacji, ponieważ już masz w tym terminie rezerwację u innego fryzjera. Wybierz inny termin.');
            return;
        }

        // Konwersja daty na UTC
        const appointmentDateUTC = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);

        const reservationData = {
            appointmentDate: appointmentDateUTC.toISOString(),
            time: selectedTime,
            hairdresser: selectedHairdresser._id,
            services: selectedServices.map(service => service._id),
        };

        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(reservationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Sprawdź, czy komunikat błędu dotyczy istniejącej rezerwacji
                if (response.status === 400 && errorData.message === 'Klient ma już rezerwację w tym terminie') {
                    setErrorMessage('Nie można zrobić rezerwacji, ponieważ już masz w tym terminie rezerwację u innego fryzjera. Wybierz inny termin.');
                } else {
                    throw new Error('Network response was not ok');
                }
                return; // Zatrzymaj wykonywanie w przypadku błędu
            }

            const data = await response.json();
            setSuccessMessage('Zarezerwowano wizytę, dziękujemy!');

            // Resetowanie stanu
            setSelectedDate(null);
            setSelectedHairdresser(null);
            setSelectedTime(null);
            setSelectedServices([]);
            setAvailableTimes([]);
        } catch (error) {
            console.error('Wystąpił błąd:', error);
            alert('Wystąpił błąd podczas potwierdzania rezerwacji.');
        } finally {
            setLoading(false);
        }
    };

    const renderServices = (category, handleServiceChange) => {
        if (!services || services.length === 0) {
            return <p>Ładowanie usług...</p>;
        }

        return services
            .filter(service => service.category === category)
            .map(service => (
                <div key={service._id} className="bg-[#fafae7] py-2 px-4 rounded-lg w-full text-left flex justify-between items-center">
                    <div>
                        {service.name} : {service.price} zł - {service.maxPrice} zł
                    </div>
                    <button
                        className="bg-[#d4af37] hover:bg-[#c9a42b] text-white py-1 px-3 rounded-lg"
                        onClick={() => handleServiceChange(service)}
                    >
                        Dodaj
                    </button>
                </div>
            ));
    };

    return (
        <div className="container mx-auto py-8 px-4 lg:px-24">
            <h1 className="text-4xl font-bold mb-8 mt-10 font-libre text-gradient-gold">Zarezerwuj wizytę online</h1>

            {/* Wybór daty */}
            <h2 className="text-2xl font-semibold mb-4">Wybierz datę</h2>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                locale="pl"
                className="py-2 px-4 rounded-lg bg-gray-200"
                minDate={new Date()} // Ustawienie minimalnej daty na dzisiejszą datę
            />

            {/* Wybór fryzjera */}
            <h2 className="text-2xl font-semibold mb-4 mt-8">Wybierz fryzjera</h2>
            <div className="flex space-x-4 mb-8">
                {hairdressers.map((hairdresser) => (
                    <button
                        key={hairdresser._id}
                        onClick={() => handleHairdresserChange(hairdresser)}
                        className={`py-2 px-4 rounded-lg ${selectedHairdresser === hairdresser ? 'bg-[#d4af37]' : 'bg-gray-200'} flex items-center`}
                    >
                        <img src={hairdresser.photo} alt={`${hairdresser.name} ${hairdresser.lastName}`} className="w-10 h-10 rounded-full mr-2" />
                        {hairdresser.name} {hairdresser.lastName}
                    </button>
                ))}
            </div>

            {/* Wybór usługi */}
            <h2 className="text-2xl font-semibold mb-4">Wybierz usługę</h2>
            <div className="mb-8">
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
                                    {renderServices(category, handleServiceChange)}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Wybrane usługi */}
            {selectedServices.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Wybrane usługi</h2>
                    <div className="bg-[#fafae7] rounded-lg p-4">
                        {selectedServices.map((service, index) => (
                            <div
                                key={service._id}
                                className={`flex justify-between items-center ${index !== selectedServices.length - 1 ? 'border-b border-gray-300' : ''} py-2`}
                            >
                                <div>{service.name} ({service.time} min)</div>
                                <div className="flex items-center">
                                    <div>{service.price} zł - {service.maxPrice} zł</div>
                                    <button
                                        className="ml-4 text-red-500 hover:text-red-700"
                                        onClick={() => handleServiceRemove(service)}
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Wybór godziny */}
            {selectedHairdresser && selectedDate && selectedServices.length > 0 ? (
                availableTimes.length > 0 ? (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Wybierz godzinę</h2>
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeChange(time)}
                                    className={`py-2 px-4 rounded-lg ${selectedTime === time ? 'bg-[#d4af37]' : 'bg-gray-200'}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    (() => {
                        // Sprawdzenie, czy salon jest nieczynny w danym dniu
                        const isClosed = openingHours.some(day => {
                            const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // Ustawienie języka na angielski
                            return (
                                day.day.toLowerCase() === selectedDay &&
                                day.start === '' &&
                                day.end === ''
                            );
                        });
                        return isClosed ? (
                            <p className="text-red-500">Nieczynne</p>
                        ) : (
                            <p className="text-red-500">Brak wolnych terminów</p>
                        );
                    })()
                )
            ) : null}

            {/* Potwierdzenie rezerwacji */}
            <button
                className="bg-[#d4af37] text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleReservationConfirm}
                disabled={loading}
            >
                {loading ? <HashLoader size={24} color={"#fff"} /> : 'Potwierdź rezerwację'}
            </button>

            {/* Komunikat o błędzie */}
            {errorMessage && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    {errorMessage}
                </div>
            )}

            {/* Komunikat o sukcesie */}
            {successMessage && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default CalendarPage;

