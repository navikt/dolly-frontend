import config from '~/config'

const uri = `${config.services.dollyBackend}`

const groupBase = `${uri}/gruppe`
const identBase = `${uri}/ident`
const brukerBase = `${uri}/bruker`
const kodeverkBase = `${uri}/kodeverk`
const bestillingBase = `${uri}/bestilling`
const configBase = `${uri}/config`
const openamBase = `${uri}/openam`
const norg2Base = `${uri}/norg2`
const aaregBase = `${uri}/aareg/arbeidsforhold`
const personoppslagBase = `${uri}/pdlperson`

export default class DollyEndpoints {
	static gruppe() {
		return groupBase
	}

	static gruppeById(gruppeId) {
		return `${groupBase}/${gruppeId}`
	}

	static gruppeByUser(userId) {
		return `${groupBase}?brukerId=${userId}`
	}

	static gruppeBestilling(gruppeId) {
		return `${groupBase}/${gruppeId}/bestilling`
	}

	static gruppeBestillingFraEksisterendeIdenter(gruppeId) {
		return `${groupBase}/${gruppeId}/bestilling/fraidenter`
	}

	static gruppeBestillingStatus(gruppeId) {
		return `${groupBase}/${gruppeId}/bestillingStatus`
	}

	static identBeskrivelse(ident) {
		return `${identBase}/${ident}/beskrivelse`
	}

	static identIbruk(ident, ibruk) {
		return `${identBase}/${ident}/ibruk?iBruk=${ibruk}`
	}

	static bruker() {
		return brukerBase
	}

	static brukerById(brukerId) {
		return `${brukerBase}/brukerId`
	}

	static currentBruker() {
		return `${brukerBase}/current`
	}

	static addFavorite() {
		return `${brukerBase}/leggTilFavoritt`
	}

	static removeFavorite() {
		return `${brukerBase}/fjernFavoritt`
	}

	static kodeverkByNavn(kodeverkNavn) {
		return `${kodeverkBase}/${kodeverkNavn}`
	}

	static bestillinger(gruppeId) {
		return `${bestillingBase}/gruppe/${gruppeId}`
	}

	static bestillingStatus(bestillingId) {
		return `${bestillingBase}/${bestillingId}`
	}

	static bestillingMal() {
		return bestillingBase + '/malbestilling'
	}

	static gjenopprettBestilling(bestillingId, envs) {
		return `${bestillingBase}/gjenopprett/${bestillingId}?miljoer=${envs}`
	}

	static config() {
		return configBase
	}

	static openAmBestilling(bestillingId) {
		return `${openamBase}/bestilling/${bestillingId}?bestillingId=${bestillingId}`
	}

	static removeBestilling(bestillingId) {
		return `${bestillingBase}/stop/${bestillingId}`
	}

	static slettPerson(gruppeId, identId) {
		return `${groupBase}/${gruppeId}/slettTestident?ident=${identId}`
	}

	static aareg() {
		return aaregBase
	}

	static arbeidsforholdByIdent(ident, env) {
		return `${aaregBase}?ident=${ident}&miljoe=${env}`
	}

	static personoppslag(ident) {
		return `${personoppslagBase}/ident/${ident}`
	}
}
