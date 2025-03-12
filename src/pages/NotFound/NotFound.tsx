import { useNavigate } from "react-router-dom";
import "./NotFound.css"

export default function NotFound() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    }
    return (
        <div className='not-found'>
            <button className="not-found-button" onClick={handleGoHome}>
                Regresar al inicio
            </button>
        </div>
    );
}