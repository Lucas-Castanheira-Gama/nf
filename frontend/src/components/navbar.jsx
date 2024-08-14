import { FaBars, FaTimes, FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { CiLogout } from "react-icons/ci";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useEffect } from 'react';

export default function Navbar() {
    const [navOpen, setNavOpen] = useState(false);
    const [userName, setUserName] = useState('')
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    const navigate = useNavigate()


    const toggleNav = () => {
        setNavOpen(!navOpen);
    };

    function logout(){
        localStorage.setItem('token','')
        localStorage.setItem('userID','')
        console.log(token, userID, 'user id e token')
        // navigate('/login')
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/name', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        user: userID,
                    },
                });

                console.log('Nome obtido:', response.data);
                setUserName(response.data)
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-blue-700 to-purple-800 p-4 font-mono font-semibold">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-2xl font-bold">LOGO</div>
                <div className="md:hidden text-white cursor-pointer" onClick={toggleNav}>
                    {navOpen ? <FaTimes size={28} /> : <FaBars size={20} />}
                </div>
                <ul className={`md:flex md:items-center md:space-x-10 ${navOpen ? 'block' : 'hidden'}`}>
                    <li>
                        <Link to={'/listar'} className="block text-white py-2 md:py-0 border-b-2 border-transparent hover:border-white transition duration-300">
                            Lançar Notas
                        </Link>
                    </li>
                    <li>
                        <Link to={'/visualizar'} className="block text-white py-2 md:py-0 border-b-2 border-transparent hover:border-white transition duration-300">
                            Ver notas salvas
                        </Link>
                    </li>
                    <li>
                        <Link to={'/contato'} className="block text-white py-2 md:py-0 border-b-2 border-transparent hover:border-white transition duration-300">
                            Contato
                        </Link>
                    </li>
                    <li className="relative group">
                        <div className="flex items-center cursor-pointer">
                            <FaUserCog className="text-white mr-2" />
                            <span className="text-white">{userName}</span>
                        </div>
                        <ul className="absolute -left-5 w-43 bg-white text-black rounded-lg shadow-lg hidden group-hover:block group-hover:list-group-hover:block">
                            <li>
                                <Link className="px-4 py-2 hover:bg-gray-200 rounded-lg flex items-center space-x-2">
                                <FaUserEdit />
                                <span>Perfil</span>
                                </Link>
                            </li>
                            <li onClick={logout}>
                                <Link className="px-4 py-2 hover:bg-gray-200 rounded-lg flex items-center space-x-2">
                                    <CiLogout />
                                    <span >Sair</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
