import { useEffect, useState } from 'react';

const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            const token = sessionStorage.getItem('token');


            if (!token) {
                setError('Brak tokena, użytkownik nie jest zalogowany');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message || 'Błąd podczas pobierania danych');
                }

                setData(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);  // Uruchamianie ponownie, jeśli zmieni się url

    return { data, loading, error };
};

export default useFetchData;
