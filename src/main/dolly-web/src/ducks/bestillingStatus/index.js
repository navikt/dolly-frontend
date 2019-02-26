import { DollyApi } from '~/service/Api'
import { createAction, handleActions, combineActions } from 'redux-actions'
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import Formatters from '~/utils/DataFormatter'
import success from '~/utils/SuccessAction'
import { actions as bestillingActions } from '~/ducks/bestilling'

export const getBestillinger = createAction('GET_BESTILLINGER', async gruppeID => {
	let res = await DollyApi.getBestillinger(gruppeID)
	return res
})

export const removeNyBestillingStatus = createAction('REMOVE_NY_BESTILLING_STATUS')

// ny-array holder oversikt over nye bestillinger i en session
const initialState = { ny: [] }

export const cancelBestilling = createAction('CANCEL_BESTILLING', async id => {
	let res = await DollyApi.cancelBestilling(id)
	return res
})

export const gjenopprettBestilling = createAction('GJENOPPRETT_BESTILLING', async (id, envs) => {
	let res = await DollyApi.gjenopprettBestilling(id, envs)
	return res
})

export default handleActions(
	{
		[success(getBestillinger)](state, action) {
			const { data } = action.payload
			return { ...state, data }
		},

		[success(bestillingActions.postBestilling)](state, action) {
			return { ...state, ny: [...state.ny, action.payload.data.id] }
		},

		[success(gjenopprettBestilling)](state, action) {
			return { ...state, ny: [...state.ny, action.payload.data.id] }
		},

		// [success(cancelBestilling)](state, action) {
		// 	return { ...state, ny: state.ny.filter(id => id !== action.payload.id) }
		// }

		[removeNyBestillingStatus](state, action) {
			return { ...state, ny: state.ny.filter(id => id !== action.payload) }
		}
	},
	initialState
)

// Selector + mapper
export const sokSelector = (items, searchStr) => {
	if (!items) return null
	const mappedItems = mapItems(items)

	if (!searchStr) return mappedItems

	const query = searchStr.toLowerCase()
	return mappedItems.filter(item => {
		const searchValues = [
			_get(item, 'id'),
			_get(item, 'antallIdenter'),
			_get(item, 'sistOppdatert'),
			_get(item, 'environments'),
			_get(item, 'ferdig')
		]
			.filter(v => !_isNil(v))
			.map(v => v.toString().toLowerCase())

		return searchValues.some(v => v.includes(query))
	})
}

// Selector
export const miljoStatusSelector = bestilling => {
	if (!bestilling) return null

	const id = bestilling.id
	let envs = bestilling.environments.slice(0) // Clone array for å unngå mutering
	let successEnvs = []
	let failedEnvs = []
	let errorMsgs = []
	let statusmeldingFeil = [] //midlertidig løsning frem til vi vet hvordan vi skal vise andre deler som bruker errorMsgs
		
	//Bestillingsstatus er delt opp i tpsfStatus, krrStatus og sigrunStatus. 
	let bestillingStatus = []
	let stubStatus = []

	const tpsfStatus = bestilling.tpsfStatus
	const krrStubStatus = {navn: 'KRRSTUB', status: bestilling.krrStubStatus}
	const sigrunStubStatus = {navn: 'SIGRUNSTUB', status: bestilling.sigrunStubStatus}
	
	// Legger til feilmeldinger fra krrStub og sigrunStub i et array
	{(krrStubStatus.status && krrStubStatus.status[0].statusMelding !== 'OK') && stubStatus.push(krrStubStatus)}
	{(sigrunStubStatus.status && sigrunStubStatus.status[0].statusMelding !== 'OK') && stubStatus.push(sigrunStubStatus)}
	
	// Bestillingstatus har alle statuser fra tpsf, sigrun og krr. statusmeldingFeil har alle feilmeldinger
	{tpsfStatus && bestillingStatus.push(tpsfStatus)}
	{krrStubStatus.status && bestillingStatus.push(krrStubStatus.status)}
	{sigrunStubStatus.status && bestillingStatus.push(sigrunStubStatus.status)}

	bestillingStatus.map( service => { 
		service.map(feil => {
			if (feil.statusMelding !== 'OK') {
				{!statusmeldingFeil.includes(feil.statusMelding) && statusmeldingFeil.push(feil.statusMelding)}
			}
		})
	})

	// TODO: REG-2921: Denne må bli forbedret.
	// feilmelding for hele bestillingen 
	bestilling.feil && errorMsgs.push(bestilling.feil)

	if (bestilling.bestillingProgress && bestilling.bestillingProgress.length != 0) {
		envs.forEach(env => {
			const lowerCaseEnv = env.toLowerCase()
			bestilling.bestillingProgress.forEach(person => {
				if (!person.tpsfSuccessEnv) {
					// TODO: Bestilling failed 100% fra Tpsf. Implement retry-funksjonalitet når maler er støttet
					failedEnvs = envs
				} else if (!person.tpsfSuccessEnv.includes(lowerCaseEnv)) {
					!failedEnvs.includes(lowerCaseEnv) && failedEnvs.push(lowerCaseEnv)
				}
			})
		})

		envs.forEach(env => {
			const lowerCaseEnv = env.toLowerCase()
			!failedEnvs.includes(lowerCaseEnv) && successEnvs.push(lowerCaseEnv)
		})

		// Registre miljø status
		// Plasseres i egen for-each for visuel plassering og mer lesbar kode
		bestilling.bestillingProgress.forEach(person => {
			if (person.krrstubStatus) {
				person.krrstubStatus == 'OK'
					? !successEnvs.includes('Krr-stub') && successEnvs.push('Krr-stub')
					: !failedEnvs.includes('Krr-stub') && failedEnvs.push('Krr-stub')
			}

			if (person.sigrunstubStatus) {
				person.sigrunstubStatus == 'OK'
					? !successEnvs.includes('Sigrun-stub') && successEnvs.push('Sigrun-stub')
					: !failedEnvs.includes('Sigrun-stub') && failedEnvs.push('Sigrun-stub')
			}

			// Feilmelding fra tps
			person.feil && errorMsgs.push('Ident ' + person.ident + ': ' + person.feil)
		})
	}

	return { id, successEnvs, failedEnvs, errorMsgs, tpsfStatus, stubStatus, statusmeldingFeil }
}

const mapItems = items => {
	if (!items) return null
	return items.map(item => {
		return {
			...item,
			id: item.id.toString(),
			antallIdenter: item.antallIdenter.toString(),
			sistOppdatert: Formatters.formatDate(item.sistOppdatert),
			ferdig: item.stoppet
				? 'Stoppet'
				: harIkkeIdenter(item.status)
					? 'Feilet'
					: avvikStatus(item)
						? 'Avvik'
						: 'Ferdig'
		}
	})
}

const avvikStatus = item => {
	let avvik = false
	if (item.tpsfStatus) {
		item.tpsfStatus.map (status => {
			if (status.statusMelding !== 'OK') avvik = true
		})
	}
	if (item.krrStubStatus) {
		item.krrStubStatus.map(status => {
			if (status.statusMelding !== 'OK') avvik = true 
		})
	}
	if (item.sigrunStubStatus) {
		item.sigrunStubStatus.map(status => {
			if (status.statusMelding !== 'OK') avvik = true
		})
	}
	return avvik
}

const harOkStatuses = status => {
	let ferdig = true
	if (status) {
		status.forEach(line => {
			if (line.statusMelding != 'OK') {
				ferdig = false
			}
		})
	}
	return ferdig
}

const harIkkeIdenter = ident => {
	let feilet = true
	if (ident) {
		ident.forEach(line => {
			if (line.environmentIdents) {
				feilet = false
			}
		})
		return feilet
	}
}
