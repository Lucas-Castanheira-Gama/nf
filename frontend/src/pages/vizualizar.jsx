import { useState, useEffect, useRef } from 'react';
import api from '../services/api.js';
import { AiOutlineSearch } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineFilePdf } from "react-icons/ai";
import { AiOutlineSend } from "react-icons/ai";
import Swal from 'sweetalert2';

export default function VisualizarNotas() {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');
    const [formularios, setFormularios] = useState([]);
    const [activeTab, setActiveTab] = useState('notasNaoPagas');
    const [procurando, setProcurando] = useState('');
    const [data, setData] = useState('')
    const [dataConvertida, setDataConvertida] = useState([])
    const [iD, setID] = useState('')
    const navigate = useNavigate()
    const buscaRef = useRef()

    useEffect(() => {
        if (!token) {
            console.log('token vazio')
            navigate('/login')

        }


    }, [])

    function abrirNf(pdfBuffer) {
        // alert(pdfBuffer)
        try {
            if (pdfBuffer && pdfBuffer.type === 'Buffer' && Array.isArray(pdfBuffer.data)) {
                const byteArray = new Uint8Array(pdfBuffer.data);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                window.open(url);
            } else {
                console.error('PDF não está no formato correto:', pdfBuffer);
            }
        } catch (error) {
            console.error('Erro ao abrir o PDF:', error);
        }
    }

    function formatarDataBR(dataISO) {
        if (!dataISO) return ''; // Caso a data seja nula ou indefinida
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/visualizar', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        user: userID,
                    },
                });

                // console.log(response.data[0].id)
                setFormularios(response.data);
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
        };

        fetchData();
    }, [token, userID]);


    // const formData = {
    //     optionStatus: 'entregue',
    // };
    async function entreguarNf(docId) {
        try {
            const response = await api.post('/entreguar', {
                optionStatus: 'entregue',
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    user: userID,
                    documentid: docId,
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.data) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Nota fiscal entregue com sucesso!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })

                
            }
    
        } catch (error) {
            Swal.fire({
                title: 'Erro!',
                text: 'Houve um erro ao tentar entregar a nota fiscal.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33'
            });
        }
    }
    

    function buscando() {
        setActiveTab('buscados')
        const buscado = buscaRef.current.value.toLowerCase(); // Converter para minúsculas para busca case-insensitive
        if (buscado === '') {
            setActiveTab('notasNaoPagas')
            setProcurando(formularios); // Se o campo de busca estiver vazio, mostrar todos
        } else {
            const filtrados = formularios.filter((formulario) =>
                formulario.numeroNf.toLowerCase().includes(buscado) ||
                (formulario.numeroPed && formulario.numeroPed.toLowerCase().includes(buscado)) ||
                (formulario.valor && formulario.valor.toLowerCase().includes(buscado))
            );
            setProcurando(filtrados); // Atualizar o estado com os formulários filtrados
        }
    }

    async function excluirNf(docid) {
        try {
            const resultado = await Swal.fire({
                title: 'Tem certeza?',
                text: 'Deseja deletar essa nota fiscal?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, deletar!',
                cancelButtonText: 'Cancelar'
                
            });
        
            if (resultado.isConfirmed) {
                // Coloque aqui o código para deletar a NF
                console.log('Nota fiscal deletada.');
                Swal.fire(
                    'Deletada!',
                    'A nota fiscal foi deletada com sucesso.',
                    'success'
                ).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                })
                
            } else {
                console.log('Ação de deletar foi cancelada.');
                return
            }
            const response = await api.delete('/deletar', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Se precisar enviar userID, descomente a linha abaixo
                    user: userID,
                    documentid: docid,
                }
            })

            console.log(response.data)

        } catch (err) {
            console.log(err)
        }
    }

    function converterData(data) {
        try {
            return JSON.parse(data); // Converta a string JSON para um array
        } catch (error) {
            console.error('Erro ao converter JSON:', error);
            return [];
        }
    }



    const notasPagas = formularios.filter(formulario => formulario.optionStatus === 'Pago');
    const notasNaoPagas = formularios.filter(formulario => formulario.optionStatus == 'Nao Pago');
    const notasEntregues = formularios.filter(formulario => formulario.optionStatus === 'entregue');

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500 text-white p-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-black">Notas Fiscais</h1>
                <div className="flex justify-center space-x-6 mb-8">
                    <button
                        className={`px-4 py-2 rounded-lg shadow ${activeTab === 'notasNaoPagas' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-blue-600'}`}
                        onClick={() => setActiveTab('notasNaoPagas')}
                    >
                        Notas Não Pagas
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg shadow ${activeTab === 'notasPagas' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-blue-600'}`}
                        onClick={() => setActiveTab('notasPagas')}
                    >
                        Notas Pagas
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg shadow ${activeTab === 'notasEntregues' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-blue-600'}`}
                        onClick={() => setActiveTab('notasEntregues')}
                    >
                        Notas Entregues
                    </button>
                    <div className="relative flex items-center">
                        <AiOutlineSearch className="absolute left-3 text-gray-500" />
                        <input
                            ref={buscaRef}
                            onChange={buscando}
                            type="search"
                            placeholder="Busque nf, pedido, valor"
                            className="pl-10 text-black p-2 border-none rounded-md bg-slate-50 w-full"
                        />
                    </div>
                </div>

                {activeTab === 'notasNaoPagas' && (
                    <div>
                        {notasNaoPagas.length > 0 ? (
                            notasNaoPagas.map((formulario, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4">
                                    <div className="flex items-center mb-4 space-x-3">
                                        <button
                                            onClick={() => abrirNf(formulario.pdf)}
                                            className="bg-amber-50 hover:bg-amber-100 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineFilePdf />
                                            Abrir
                                        </button>
                                        <button
                                            onClick={() => entreguarNf(formulario.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineSend />
                                            Entregue
                                        </button>
                                        <button
                                            onClick={() => excluirNf(formulario.id)}
                                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center "
                                        >
                                            <AiOutlineDelete className="text-lg" />
                                            <span>Deletar</span>
                                        </button>

                                    </div>


                                    <p className="text-lg"><strong>Número da NF:</strong> {formulario.numeroNf}</p>
                                    <p className="text-lg"><strong>Fornecedor:</strong> {formulario.fornecedor}</p>

                                    {formulario.date ? (
                                        converterData(formulario.date).map((parcela, i) => (
                                            <div key={i} className="mb-4 p-4 border rounded-lg">
                                                <p className="text-base"><strong>Parcela:</strong> {parcela["Número da Parcela"]}</p>
                                                <p className="text-base"><strong>Data de Vencimento:</strong> {parcela["Data de Vencimento"]}</p>
                                                <p className="text-base"><strong>R$:</strong> {parcela["Valor"]}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Sem dados para exibir.</p>
                                    )}
                                    <p className="text-lg"><strong>Status:</strong> {formulario.optionStatus}</p>
                                    <p className="text-lg"><strong>Autorização:</strong> {formulario.optionAut}</p>
                                    <p className="text-lg"><strong>Número do Pedido:</strong> {formulario.numeroPed}</p>
                                    <p className="text-lg"><strong>Valor Total R$:</strong> {formulario.valor}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-black">Nenhuma nota fiscal não paga encontrada.</p>
                        )}
                    </div>
                )}

                {activeTab === 'notasPagas' && (
                    <div>
                        {notasPagas.length > 0 ? (
                            notasPagas.map((formulario, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4">
                                    <div className="flex items-center mb-4 space-x-3">
                                        <button
                                            onClick={() => abrirNf(formulario.pdf)}
                                            className="bg-amber-50 hover:bg-amber-100 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineFilePdf />
                                            Abrir
                                        </button>
                                        <button
                                            onClick={() => entreguarNf(formulario.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineSend />
                                            Entregue
                                        </button>
                                        <button
                                            onClick={() => excluirNf(formulario.id)}
                                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center "
                                        >
                                            <AiOutlineDelete className="text-lg" />
                                            <span>Deletar</span>
                                        </button>

                                    </div>
                                    <p className="text-lg"><strong>Número da NF:</strong> {formulario.numeroNf}</p>
                                    <p className="text-lg"><strong>Fornecedor:</strong> {formulario.fornecedor}</p>

                                    {formulario.date ? (
                                        converterData(formulario.date).map((parcela, i) => (
                                            <div key={i} className="mb-4 p-4 border rounded-lg">
                                                <p className="text-base"><strong>Parcela:</strong> {parcela["Número da Parcela"]}</p>
                                                <p className="text-base"><strong>Data de Vencimento:</strong> {parcela["Data de Vencimento"]}</p>
                                                <p className="text-base"><strong>R$:</strong> {parcela["Valor"]}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Sem dados para exibir.</p>
                                    )}
                                    <p className="text-lg"><strong>Status:</strong> {formulario.optionStatus}</p>
                                    <p className="text-lg"><strong>Autorização:</strong> {formulario.optionAut}</p>
                                    <p className="text-lg"><strong>Número do Pedido:</strong> {formulario.numeroPed}</p>
                                    <p className="text-lg"><strong>Valor Total R$:</strong> {formulario.valor}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-black">Nenhuma nota fiscal paga encontrada.</p>
                        )}
                    </div>
                )}

                {activeTab === 'notasEntregues' && (
                    <div>
                        {notasEntregues.length > 0 ? (
                            notasEntregues.map((formulario, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4">
                                    <div className="flex items-center mb-4 space-x-3">
                                        <button
                                            onClick={() => abrirNf(formulario.pdf)}
                                            className="bg-amber-50 hover:bg-amber-100 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineFilePdf />
                                            Abrir
                                        </button>
                                        <button
                                            onClick={() => excluirNf(formulario.id)}
                                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center "
                                        >
                                            <AiOutlineDelete className="text-lg" />
                                            <span>Deletar</span>
                                        </button>

                                    </div>

                                    <p className="text-lg"><strong>Número da NF:</strong> {formulario.numeroNf}</p>
                                    <p className="text-lg"><strong>Fornecedor:</strong> {formulario.fornecedor}</p>

                                    {formulario.date ? (
                                        converterData(formulario.date).map((parcela, i) => (
                                            <div key={i} className="mb-4 p-4 border rounded-lg">
                                                <p className="text-base"><strong>Parcela:</strong> {parcela["Número da Parcela"]}</p>
                                                <p className="text-base"><strong>Data de Vencimento:</strong> {parcela["Data de Vencimento"]}</p>
                                                <p className="text-base"><strong>R$:</strong> {parcela["Valor"]}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Sem dados para exibir.</p>
                                    )}
                                    <p className="text-lg"><strong>Status:</strong> {formulario.optionStatus}</p>
                                    <p className="text-lg"><strong>Autorização:</strong> {formulario.optionAut}</p>
                                    <p className="text-lg"><strong>Número do Pedido:</strong> {formulario.numeroPed}</p>
                                    <p className="text-lg"><strong>Valor Total R$:</strong> {formulario.valor}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-black">Nenhuma nota fiscal não paga encontrada.</p>
                        )}
                    </div>
                )}

                {activeTab === 'buscados' && (
                    <div>
                        {procurando.length > 0 ? (
                            procurando.map((formulario, index) => (
                                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow mb-4">
                                    <div className="flex items-center mb-4 space-x-3">
                                        <button
                                            onClick={() => abrirNf(formulario.pdf)}
                                            className="bg-amber-50 hover:bg-amber-100 text-black px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineFilePdf />
                                            Abrir
                                        </button>
                                        <button
                                            onClick={() => entreguarNf(formulario.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                                        >
                                            <AiOutlineSend />
                                            Entregue
                                        </button>
                                        <button
                                            onClick={() => excluirNf(formulario.id)}
                                            className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded-lg flex items-center "
                                        >
                                            <AiOutlineDelete className="text-lg" />
                                            <span>Deletar</span>
                                        </button>

                                    </div>
                                    <p className="text-lg"><strong>Número da NF:</strong> {formulario.numeroNf}</p>
                                    <p className="text-lg"><strong>Fornecedor:</strong> {formulario.fornecedor}</p>
                                    {formulario.date ? (
                                        converterData(formulario.date).map((parcela, i) => (
                                            <div key={i} className="mb-4 p-4 border rounded-lg">
                                                <p className="text-base"><strong>Parcela:</strong> {parcela["Número da Parcela"]}</p>
                                                <p className="text-base"><strong>Data de Vencimento:</strong> {parcela["Data de Vencimento"]}</p>
                                                <p className="text-base"><strong>R$:</strong> {parcela["Valor"]}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Sem dados para exibir.</p>
                                    )}
                                    <p className="text-lg"><strong>Status:</strong> {formulario.optionStatus}</p>
                                    <p className="text-lg"><strong>Autorização:</strong> {formulario.optionAut}</p>
                                    <p className="text-lg"><strong>Número do Pedido:</strong> {formulario.numeroPed}</p>
                                    <p className="text-lg"><strong>Valor Total R$:</strong> {formulario.valor}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-black">Nenhuma nota fiscal encontrada.</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
