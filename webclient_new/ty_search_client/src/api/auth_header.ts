import { TOKEN_STORAGE_KEY } from '../store/constant'

export default function authHeader(): any {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY)
	// const user = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY))
	// if (user && user.accessToken) {
	//     return { Authorization: 'Bearer ' + user.accessToken } // for Spring Boot back-end
	//     // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
	// }
	if (token) {
		return { Authorization: 'JWT ' + token }
	} else {
		return {}
	}
}
