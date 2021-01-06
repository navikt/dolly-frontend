import Request from '~/service/services/Request'

const miljoeUrl = '/api/testnorge-miljoer-service/miljoer'

export default {
	getAktiveMiljoer() {
		return Request.get(miljoeUrl)
	}
}
