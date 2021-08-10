import config from '~/config'
import Request from '~/service/services/Request'

const getInstUrl = () => `${config.services.proxyBackend}/inst/v1`

export default {
	getPerson(ident, env) {
		const endpoint = `${getInstUrl()}/institusjonsopphold/person?environments=${env}`
		return Request.get(endpoint, { norskident: ident })
	},

	getTilgjengeligeMiljoer() {
		const endpoint = `${getInstUrl()}/environment`
		return Request.get(endpoint)
	}
}
