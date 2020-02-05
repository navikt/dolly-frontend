import config from '~/config'
import Request from '~/service/services/Request'
import ConfigService from '~/service/Config'

const getKrrBaseUrl = () => ConfigService.getDatesourceUrl('krr')
const getKrrUrl = () => `${getKrrBaseUrl()}/api/v1`

export default {
	getPerson(ident) {
		const endpoint = `${getKrrUrl()}/person/kontaktinformasjon`
		return Request.getWithoutCredentials(endpoint, {
			headers: {
				'Nav-Personident': ident,
				'Nav-Call-Id': 'dolly',
				'Nav-Consumer-Id': 'dolly-frontend'
			}
		})
	},

	updatePerson(krrstubId, data) {
		const endpoint = `${getKrrUrl()}/kontaktinformasjon/${krrstubId}`
		return Request.putWithoutCredentials(endpoint, data, {
			headers: {
				'Nav-Call-Id': 'dolly',
				'Nav-Consumer-Id': 'dolly-frontend'
			}
		})
	}
}
