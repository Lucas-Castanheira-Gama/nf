import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Swal from 'sweetalert2';

const people = [
    { id: 1, name: 'Pago' },
    { id: 2, name: 'Nao Pago' }
];

const autoriza = [
    { id: 1, name: 'Autorizado' },
    { id: 2, name: 'Nao autorizado' }
];

function Listar() {
    // const [data, setData] = useState([]);
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    const navigate = useNavigate();
    const [selected, setSelected] = useState(people[0]);
    const [autorizado, setAutorizado] = useState(autoriza[0]);


    // const [numeroNfRef, setNumeroNfRef] = useState('')

    const pdfRef = useRef();
    // const numeroNfRef = useRef();
    const optionStatusRef = useRef();
    // const dateRef = useRef();
    const optionAutRef = useRef();
    const numeroPedRef = useRef();
    // const valorRef = useRef()

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



    const salvarNf = async () => {
        const pdf = pdfRef.current.files[0];
        const optionStatus = selected.name;
        const optionAut = autorizado.name;
        const numeroPed = numeroPedRef.current.value;

        try {
            const formData = new FormData();
            formData.append('pdf', pdf);
            formData.append('optionStatus', optionStatus);
            formData.append('optionAut', optionAut);
            formData.append('numeroPed', numeroPed);

            const response = await api.post('/listar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    user: userID,
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Verificar se a resposta possui a propriedade 'data'
            if (response && response.data) {
                console.log('Dados enviados com sucesso:', response.data);
                if (response.data.numeroNf) {
                    Swal.fire({
                        title: 'Sucesso!',
                        text: `Nota fiscal ${response.data.numeroNf} salva com sucesso!`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6'
                    }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
                 }
                // else {
                //     Swal.fire({
                //         title: 'Sucesso!',
                //         text: 'Nota fiscal salva com sucesso, mas o número da NF não foi retornado.',
                //         icon: 'info',
                //         confirmButtonText: 'OK',
                //         confirmButtonColor: '#3085d6'
                //     });
                // }
            }
        } catch (error) {
            // Verificar se o erro possui a propriedade 'response'
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Erro ao enviar os dados:', error.response.data.message);

                // Verificar se a mensagem de erro é sobre token
                if (error.response.data.message === 'Access denied. No token provided.') {
                    navigate('/login');
                }
            } else {
                console.error('Erro inesperado ao enviar os dados:', error);
            }
        }
    };


    return (
        <div >
            <Navbar />
            <div className="min-h-screen bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-3xl font-bold text-white mb-6 text-center">Formulário de Lançamento</h1>
                        <input required ref={pdfRef} type="file" className="mb-4 bg-gray-900 text-white rounded-lg p-3 w-full" />
                        {/* <input ref={numeroNfRef} type="text" placeholder="Número da NF: " className="mb-4 bg-gray-900 text-white rounded-lg p-3 w-full" /> */}
                        <Listbox value={selected} onChange={setSelected}>
                            <Listbox.Label className="block text-sm font-medium leading-6 text-white">Status</Listbox.Label>
                            <div className="relative mt-2">
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center">
                                        <span className="ml-3 block truncate">{selected.name}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {people.map((person) => (
                                        <Listbox.Option
                                            key={person.id}
                                            value={person}
                                            className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                            {person.name}
                                                        </span>
                                                    </div>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                        {/* <label className="my-2 block text-sm font-medium leading-6 text-white" htmlFor="">Data de vencimento:</label> */}
                        {/* <input ref={dateRef} type="date" className="mb-4 bg-gray-900 text-white rounded-lg p-3 w-full" /> */}
                        <Listbox value={autorizado} onChange={setAutorizado}>
                            <Listbox.Label className="block text-sm font-medium leading-6 text-white mt-3">Autorizaçao</Listbox.Label>
                            <div className="relative mt-2">
                                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                    <span className="flex items-center">
                                        <span className="ml-3 block truncate">{autorizado.name}</span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                        <ChevronUpDownIcon aria-hidden="true" className="h-5 w-5 text-gray-400" />
                                    </span>
                                </Listbox.Button>
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {autoriza.map((person) => (
                                        <Listbox.Option
                                            key={person.id}
                                            value={person}
                                            className={({ active }) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <span className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                            {person.name}
                                                        </span>
                                                    </div>
                                                    {selected && (
                                                        <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-indigo-600'}`}>
                                                            <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                        <input ref={numeroPedRef} type="text" placeholder="Número do pedido (opcional)" className="mb-4 bg-gray-900 text-white rounded-lg p-3 w-full" />
                        {/* <input ref={valorRef} type="text" placeholder='Valor total R$' className="mb-4 bg-gray-900 text-white rounded-lg p-3 w-full " /> */}
                        <div className="flex justify-center">
                            {/* <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300">Limpar Campos</button> */}
                            <button onClick={salvarNf} className=" bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-300">Salvar</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Listar;
