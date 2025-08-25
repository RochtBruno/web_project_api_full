const baseUrl = import.meta.env.VITE_API_URL

export const register = async ({email,password}) => {
	return fetch(`${baseUrl}/signup`,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({email,password})
	})
}

export const authorize = async ({email,password}) => {
	return fetch(`${baseUrl}/signin`,{
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({email,password})
	})
}

export const checkToken = async ({token}) => {
	return fetch(`${baseUrl}/users/me`,{
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"Authorization" : `Bearer ${token}`
		},
	})
}