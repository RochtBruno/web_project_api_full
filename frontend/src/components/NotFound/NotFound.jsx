import { useNavigate } from 'react-router-dom'

function NotFound(){

	const navigate = useNavigate()
	return(
		<>
			<h1 className="notfound__title"> 404 - Página não encontrada</h1>
			<button onClick={() => navigate('/')}>Voltar para página inicial</button>
		</>
	)
}

export default NotFound;