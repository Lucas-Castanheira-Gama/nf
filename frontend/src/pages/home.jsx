import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export default function Home(){
    return(
        <div>
            <h1>MEU SITE ESTA<strong>ONLINE</strong></h1>
            <h2>Va para <Link to={'/login'}>login</Link></h2>
        </div>
    )
}