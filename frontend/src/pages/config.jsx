import Navbar from "../components/navbar";
import api from "../services/api"
import { useState } from "react";
import { useEffect } from "react";
import { FaUserCog } from "react-icons/fa";

export default function Config(){

    // const token = localStorage.getItem('token');
    // const userID = localStorage.getItem('userID');
    // const [ dados, setDados ] = useState([])

    // try{

    //     useEffect(() => {
    //         const fetchData = async () => {
    //             try {
    //                 const response = await api.get('/visualizar', {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`,
    //                         user: userID,
    //                     },
    //                 });
    
    //                 console.log(response.data[0].id)
    //                 setDados(response.data);
    //             } catch (error) {
    //                 const invalidToken = error.response.data.message
    //                 // console.error('Erro ao buscar dados:', );
    //                 if (invalidToken === 'invalid token') {
    //                     navigate('/login')
    //                 }
    //             }
    //         };
    
    //         fetchData();
    //     }, [token, userID]);

    // }catch(e){
    //     console.log(e)
    // }

    
    return(
        <div>
            <Navbar />
            <div>
                {
                    dados.map((e) => (
                        <h1>{e.numeroNf}</h1>
                    ))
                    }
            </div>

        </div>
    )
}