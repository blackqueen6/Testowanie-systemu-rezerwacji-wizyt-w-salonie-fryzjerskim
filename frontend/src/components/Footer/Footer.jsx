import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 mt-auto">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                <div className="md:flex md:justify-start">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Nasz Salon</h4>
                        <p>Fryz Glam</p>
                        <p>ul. Kokosowa 1</p>
                        <p>33-100 Tarnów</p>
                    </div>
                </div>

                <div className="md:flex md:justify-center">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Kontakt</h4>
                        <p>tel: +48 530 787 553</p>
                        <p>e-mail: fryzglam@gmail.com</p>
                    </div>
                </div>

                <div className="md:flex md:justify-end">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Godziny otwarcia</h4>
                        <p>Pon <strong>11:00 – 19:00</strong></p>
                        <p>Wt <strong>11:00 – 19:00</strong></p>
                        <p>Śr <strong>11:00 – 19:00</strong></p>
                        <p>Czw <strong>11:00 – 19:00</strong></p>
                        <p>Pt <strong>11:00 – 19:00</strong></p>
                        <p>Sob <strong>08:00 – 16:00</strong></p>
                        <p>Nd <strong>nieczynne</strong></p>
                    </div>
                </div>

            </div>

            <div className="container mx-auto text-center mt-8">
                <p className="text-sm">Copyright &copy; {new Date().getFullYear()} Fryz Glam</p>
            </div>
        </footer>
    );
};

export default Footer;
