import Request from '~/service/services/Request'

const miljoeUrl = '/api/testnav-miljoer-service'

export default {
	getAktiveMiljoer() {
		// return ['q1', 'q2', 'q4', 'q5', 'qx', 't0', 't1', 't13', 't2', 't3', 't4', 't5', 't6', 'u5']
		const endpoint = miljoeUrl + '/miljoer'
		return Request.get(endpoint)
	}
}
