import config from '~/config'

const uri = `${config.services.dollyBackend}`

const groupBase = `${uri}/gruppe`
const identBase = `${uri}/ident`
const brukerBase = `${uri}/bruker`
const kodeverkBase = `${uri}/kodeverk`
const bestillingBase = `${uri}/bestilling`
const configBase = `${uri}/config`
const openamBase = `${uri}/openam`
const aaregBase = `${uri}/aareg/arbeidsforhold`
const personoppslagBase = `${uri}/pdlperson`
const poppBase = `${uri}/popp`
const inntektstubBase = `${uri}/inntektstub`
const fasteOrgnummerBase = `${uri}/orgnummer`
const arenaBase = `${uri}/arena`
const instBase = `${uri}/instdata`
const krrBase = `${uri}/krrstub`
const sigrunBase = `${uri}/sigrunstub`
const udiBase = `${uri}/udistub`
const tpsfBase = `${uri}/tpsf`

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

	static bruker() {
		return brukerBase
	}

	static brukerById(brukerId) {
		return `${brukerBase}/${brukerId}`
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
		return `${bestillingBase}/malbestilling`
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

	static aareg() {
		return aaregBase
	}

	static arbeidsforholdByIdent(ident, env) {
		return `${aaregBase}?ident=${ident}&miljoe=${env}`
	}

	static personoppslag(ident) {
		return `${personoppslagBase}/ident/${ident}`
	}

	static inntekterByIdent(ident) {
		return `${inntektstubBase}/${ident}`
	}

	static fasteOrgnummer() {
		return fasteOrgnummerBase
	}

	//TESTPERSON-CONTROLLER
	static slettPerson(ident) {
		return `${identBase}/${ident}`
	}

	static identBeskrivelse(ident) {
		return `${identBase}/${ident}/beskrivelse`
	}

	static leggTilPaaPerson(ident) {
		return `${identBase}/${ident}/leggtilpaaperson`
	}

	static identIbruk(ident, ibruk) {
		return `${identBase}/${ident}/ibruk?iBruk=${ibruk}`
	}

	static kobleIdenter(ident) {
		return `${identBase}/${ident}/relasjon`
	}

	static poppInntekt(ident, env){
		return `${poppBase}/inntekt/${ident}/${env}`
	}

	static poppMiljoe(){
		return `${poppBase}/miljoe`
	}

	static getPersonFraArena(ident){
		return `${arenaBase}/ident/${ident}`
	}

	static arenaMiljoe(){
		return `${arenaBase}/miljoe`
	}

	static getPersonInst(ident, env){
		return `${instBase}/ident/${ident}/${env}`
	}

	static instMiljoe(){
		return `${instBase}/miljoe`
	}

	static getPersonKrr(ident){
		return `${krrBase}/ident/${ident}`
	}

	static getPersonSigrun(ident){
		return `${sigrunBase}/ident/${ident}`
	}

	static getSekvensnrSigrun(ident){
		return `${sigrunBase}/sekvensnummer/${ident}`
	}

	static getPersonUdi(ident){
		return `${udiBase}/ident/${ident}`
	}

	static getPersonerTpsf(){
		return `${udiBase}/hentPersoner`
	}

	static checkPersonerTpsf(){
		return `${udiBase}/checkPersoner`
	}
}
