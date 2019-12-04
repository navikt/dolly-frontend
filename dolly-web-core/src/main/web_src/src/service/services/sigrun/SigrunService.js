import config from '~/config'
import Request from '~/service/services/Request'
import ConfigService from '~/service/Config'

const getSigrunBaseUrl = () =>
	ConfigService.getDatesourceUrl('sigrun') || config.services.sigrunStubUrl

export default {
	getPerson(ident) {
		const endpoint = getSigrunBaseUrl() + '/api/v1/lignetinntekt'
		return Request.getWithoutCredentials(endpoint, {
			headers: { personidentifikator: ident }
		})
	},

	getSekvensnummer(ident) {
		const endpoint = getSigrunBaseUrl() + '/api/v1/sekvensnummer/' + ident
		return Request.getWithoutCredentials(endpoint, {
			headers: { personidentifikator: ident }
		})
	},

	updatePerson(data) {
		const endpoint = `${getSigrunBaseUrl()}/testdata/oppdater`
		return Request.postWithoutCredentials(endpoint, null, {
			headers: data
		})
	}
}
