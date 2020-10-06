import Request from '~/service/services/Request'

const varslingerlUrl = 'api/testnorge-varslinger-api/v1/varslinger'

export default {
	getVarslinger() {
		return Request.get(varslingerlUrl)
	},

	getVarslingerBruker() {
		const endpoint = `${varslingerlUrl}/person/ids`
		return Request.get(endpoint)
	},

	updateVarslingerBruker(varslingId: string) {
		const endpoint = `${varslingerlUrl}/person/ids/${varslingId}`
		return Request.put(endpoint)
	}
}
