import { useEffect, useRef, useContext } from 'react';
import logo from '../../assets/images/logo.svg';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import { authContext } from '../../context/AuthContext.jsx';

const navLinks = [
    {
        path: '/reservation',
        display: 'REZERWACJA'
    }
];

const Header = () => {
    const menuRef = useRef(null);
    const { user, role, dispatch } = useContext(authContext);
    const navigate = useNavigate();

    const toggleMenu = (event) => {
        event.stopPropagation();
        menuRef.current.classList.toggle('show__menu');
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    const getInitials = (name, lastName) => {
        const firstInitial = name ? name[0].toUpperCase() : '';
        const lastInitial = lastName ? lastName[0].toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                menuRef.current.classList.remove('show__menu');
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="header flex items-center sticky__header">
                <div className="container flex items-center justify-between relative">
                    {/* Logo */}
                    <div className="logo-container absolute -left-10 flex items-center">
                        <img src={logo} alt="Fryz Glam Logo" className="h-full object-contain" />
                    </div>

                    {/* Navigation Menu */}
                    <div className="navigation flex-1 flex justify-center" ref={menuRef}>
                        <ul className="menu flex items-center gap-[1rem] md:gap-[2.7rem]">
                            {navLinks.map((link, index) => (
                                <li key={index}>
                                    <NavLink
                                        to={link.path}
                                        className={(navClass) =>
                                            navClass.isActive
                                                ? 'text-gradient-gold text-[14px] md:text-[16px] leading-7 font-[600]'
                                                : 'text-white text-[14px] md:text-[16px] leading-7 font-[500] hover:text-gradient-gold'
                                        }
                                        onClick={() => menuRef.current.classList.remove('show__menu')}
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Login/Logout Button */}
                    <div className="flex items-center gap-4 absolute right-0">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Link to={`${role === 'fryzjer' ? `/hairdressers/profile/${user._id}` : `/users/profile/${user._id}`}`}>
                                        <div className="avatar bg-[#5f5f5f] text-white hover:bg-[#4d4c4c] rounded-full w-10 h-10 flex items-center justify-center">
                                            {getInitials(user.name, user.lastName)}
                                        </div>
                                    </Link>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-[#d4af37] hover:bg-[#be9b29] py-2 px-4 md:px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                                >
                                    Wyloguj
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button className="bg-[#d4af37] hover:bg-[#be9b29] py-2 px-4 md:px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                                    Zaloguj
                                </button>
                            </Link>
                        )}
                        {/* BiMenu Icon */}
                        <span className="custom-lg:hidden" onClick={toggleMenu}>
                            <BiMenu className="w-6 h-6 cursor-pointer" />
                        </span>
                    </div>
                </div>
            </header>
            <main className="main-content">
            </main>
        </>
    );
};

export default Header;