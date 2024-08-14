import Navbar from "../components/navbar"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Contato() {

    const token = localStorage.getItem('token');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                // Se o token não estiver presente, redireciona para login
                navigate('/login');
                return;
            }

            try {
                const response = await api.get('/validar', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log('Token válido:', response.data);
            } catch (error) {
                console.error('Erro ao validar o token:', error);

                if (error.response && error.response.status === 401) {
                    // Se o token for inválido ou expirado, redireciona para login
                    navigate('/login');
                } else {
                    // Caso outro erro ocorra, você pode tratá-lo de outra forma ou exibir uma mensagem
                    console.error('Erro inesperado:', error);
                }
            }
        }

        fetchData();
    }, [token, navigate]);


    return (
        <div>
            <Navbar />
            <div className="bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 min-h-screen flex justify-center items-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                    <h1 className="text-2xl font-semibold mb-6 text-center">Feedback</h1>
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="nome" className="block text-lg font-medium text-gray-700">Nome:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Seu nome"
                            />
                        </div>
                        <div>
                            <label htmlFor="comentario" className="block text-lg font-medium text-gray-700">Deixe algum comentário, reclamação e o que podemos melhorar:</label>
                            <textarea
                                id="comentario"
                                name="comentario"
                                rows="5"
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Seu comentário"
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}   