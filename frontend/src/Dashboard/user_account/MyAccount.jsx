import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
import Loading from '../../components/Loader/Loading';
import MyServiceCard from '../../components/Services/MyServiceCard.jsx';
import { authContext } from '../../context/AuthContext.jsx';
import useFetchData from '../../hooks/useFetchData.jsx';


const MyBookings = () => {
    const { user } = useContext(authContext);
    const { data: appointments, loading, error } = useFetchData(`${BASE_URL}/users/myAppointments`, {
        headers: {
            Authorization: `Bearer ${user?.token}`
        }
    });


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p className='text-center mt-16 text-red-500'>Brak dostępu</p>;
    }

    if (!appointments || appointments.length === 0) {
        return <h2 className='mt-5 text-center leading-7 text-[20px] text-[#be9b29] '>Nie masz jeszcze żadnych zarezerwowanych wizyt</h2>;
    }


    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {appointments.map((booking, index) => (
                <MyServiceCard booking={booking} key={`${booking._id}-${index}`} />
            ))}
        </div>
    );
};

const MyAccount = () => {
    const { user, dispatch, token } = useContext(authContext);
    const [tab, setTab] = useState('bookings');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user._id) {
            toast.error('Brak ID użytkownika lub tokena');
            navigate('/login');
        }
    }, [user, navigate]);

    // Obsługa żądania danych użytkownika na profil
    const { data: userData, loading, error } = useFetchData(
        user && user._id ? `${BASE_URL}/users/profile/${user._id}` : null,
        {
            headers: {
                Authorization: `Bearer ${user?.token}`
            }
        }
    );

    // Obsługa usunięcia konta
    const handleDeleteAccount = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
            try {
                const res = await fetch(`${BASE_URL}/users/${user._id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { message } = await res.json();
                if (!res.ok) {
                    throw new Error(message);
                }
                toast.success('Konto zostało usunięte');
                dispatch({ type: 'LOGOUT' });
                navigate('/login');
            } catch (err) {
                toast.error('Błąd podczas usuwania konta');
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p className='text-center mt-16 text-red-500'>Brak dostępu</p>;
    }

    return (
        <section>
            <div className='max-w-[1170px] px-5 mx-auto'>
                <div className='grid md:grid-cols-3 gap-10'>
                    <div className='pb-[50px] px-[30px] rounded-md'>
                        <div className='flex flex-col items-center justify-center'>
                            <div className='w-[100px] h-[100px] rounded-full flex items-center justify-center text-[40px] bg-[#5f5f5f] text-white'>
                                {userData && `${userData.name[0].toUpperCase()}${userData.lastName[0].toUpperCase()}`}
                            </div>
                            <div className='text-center mt-4'>
                                <h3 className='text-[18px] leading-[30px] text-black font-bold'>{userData?.name} {userData?.lastName}</h3>
                                <p className='text-sm text-[#5f5f5f]'>{userData?.email}</p>
                            </div>
                            <button onClick={handleDeleteAccount} className='w-full bg-[#d53535] text-white p-3 mt-2 leading-[28px] text-[16px] font-bold rounded-md'>
                                Usuń Konto
                            </button>
                        </div>
                    </div>

                    <div className='col-span-2 pb-[50px] px-[30px]'>
                        <div className='flex gap-x-6 border-b border-[#d4af37]'>
                            <button className={`pb-2 uppercase ${tab === 'bookings' && 'text-[#d4af37] border-b-2 border-[#d4af37]'}`} onClick={() => setTab('bookings')}>
                                Moje Rezerwacje
                            </button>
                        </div>
                        {tab === 'bookings' ? <MyBookings /> : <Profile user={userData} />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyAccount;