import config from '~/config'

export const api = {
	hentMaler: () =>
		fetch(`${config.services.dollyBackend}/bestilling/malbestilling`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText)
				}
				return response
			})
			.then(response => response.json())
			.catch(error => {
				console.error(error)
				throw error
			}),
	slettMal: malId =>
		fetch(`${config.services.dollyBackend}/bestilling/malbestilling/${malId}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText)
				}
				return response
			})
			.catch(error => {
				console.error(error)
				throw error
			}),
	endreMalNavn: (malId, malNavn) =>
		fetch(`${config.services.dollyBackend}/bestilling/malbestilling/${malId}`, {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify({ malNavn }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				if (!response.ok) {
					throw new Error(response.statusText)
				}
				return response
			})
			.catch(error => {
				console.error(error)
				throw error
			})
}
