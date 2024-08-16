import { Link, useNavigate } from "react-router-dom"
import { useRef } from "react"
import api from '../services/api'

function cadastro(){

    const nomeRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await api.post('/cadastro', {
                name: nomeRef.current.value,
                email: emailRef.current.value.toLowerCase(),
                password: passwordRef.current.value
            });

            alert('Usuário cadastrado com sucesso');
            navigate('/login')
        } catch (err) {
            alert('Erro ao cadastrar usuário: ' + err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-700 to-purple-800">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Cadastro</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        required minLength={6}

                        ref={nomeRef}
                        type="text"
                        placeholder="Nome"
                        className="p-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        required minLength={6}

                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        className="p-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        required minLength={6}
                        ref={passwordRef}
                        type="password"
                        placeholder="Senha"
                        className="p-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        
                        className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                    >
                        Cadastrar
                    </button>
                </form>
                <p className="text-center text-gray-300">
                        Ja tem conta?{" "}
                        <Link to="/login" className="text-blue-400 hover:underline">
                            Login
                        </Link>
                    </p>
            </div>
        </div>
    );

}

export default cadastro