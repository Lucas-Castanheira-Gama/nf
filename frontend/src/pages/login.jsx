import { Link, useNavigate } from "react-router-dom"
import { useRef } from "react"
import api from '../services/api'

function cadastro(){

    const emailRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try{
            const response = await api.post('/login', {
                email: emailRef.current.value.toLowerCase(),
                password: passwordRef.current.value,
            })
            
            const token = response.data.token
            const userID = response.data.userID
            localStorage.setItem('token', token)
            localStorage.setItem('userID', userID)
            navigate('/listar')


        }catch(err){
            console.log(err)
        }
        
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-blue-700 to-purple-800">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        className="p-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Senha"
                        className="p-3 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                    >
                        Entrar
                    </button>
                    <p className="text-center text-gray-300">
                        Nao tem uma conta?{" "}
                        <Link to="/cadastro" className="text-blue-400 hover:underline">
                            Criar conta
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );

}

export default cadastro