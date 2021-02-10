import Request from '~/service/services/Request'

const getUdiUrl = '/api/udi-stub'

export default {
	getPerson(ident) {
		const endpoint = `${getUdiUrl}/person/${ident}`
		return Request.get(endpoint)
	}
}
