import { TpsfApi, SigrunApi, KrrApi } from '~/service/Api'
import { LOCATION_CHANGE } from 'connected-react-router'
import { createAction } from 'redux-actions'
import success from '~/utils/SuccessAction'
import { DataSource } from '~/service/kodeverk/AttributtManager/Types'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _merge from 'lodash/merge'
import { mapIdentAndEnvironementForTps, mapValuesFromDataSource } from './utils'

const initialState = {
	items: {
		tpsf: null,
		sigrunstub: null,
		krrstub: null
	}
}

const actionTypes = {
	UPDATE_TESTBRUKER_REQUEST: 'UPDATE_TESTBRUKER_REQUEST',
	UPDATE_TESTBRUKER_SUCCESS: 'UPDATE_TESTBRUKER_SUCCESS',
	UPDATE_TESTBRUKER_ERROR: 'UPDATE_TESTBRUKER_ERROR'
}

const updateTestbrukerRequest = () => ({ type: actionTypes.UPDATE_TESTBRUKER_REQUEST })
const updateTestbrukerSuccess = () => ({ type: actionTypes.UPDATE_TESTBRUKER_SUCCESS })
const updateTestbrukerError = () => ({ type: actionTypes.UPDATE_TESTBRUKER_ERROR })

export const GET_TPSF_TESTBRUKERE = createAction('GET_TPSF_TESTBRUKERE', identArray => {
	return TpsfApi.getTestbrukere(identArray)
})

export const GET_SIGRUN_TESTBRUKER = createAction(
	'GET_SIGRUN_TESTBRUKER',
	ident => {
		return SigrunApi.getTestbruker(ident)
	},
	ident => ({
		ident
	})
)

export const GET_KRR_TESTBRUKER = createAction(
	'GET_KRR_TESTBRUKER',
	async ident => {
		try {
			const res = await KrrApi.getTestbruker(ident)
			return res
		} catch (err) {
			if (err.response && err.response.status === 404) {
				console.log(err.response.data.melding)
				//ERROR 404 betyr at det ikke finnes data for identen, fake opp datastruktur slik at reducer blir consistent
				return { data: [null] }
			}
			return err
		}
	},
	ident => ({
		ident
	})
)

export default function testbrukerReducer(state = initialState, action) {
	switch (action.type) {
		case LOCATION_CHANGE:
			return initialState
		case success(GET_TPSF_TESTBRUKERE):
			return { ...state, items: { ...state.items, tpsf: action.payload.data } }
		case success(GET_SIGRUN_TESTBRUKER):
			return {
				...state,
				items: {
					...state.items,
					sigrunstub: {
						...state.items.sigrunstub,
						[action.meta.ident]: action.payload && action.payload.data
					}
				}
			}
		case success(GET_KRR_TESTBRUKER):
			return {
				...state,
				items: {
					...state.items,
					krrstub: {
						...state.items.krrstub,
						[action.meta.ident]: action.payload && action.payload.data[0]
					}
				}
			}
		case actionTypes.UPDATE_TESTBRUKER_SUCCESS:
			return state
		default:
			return state
	}
}

// Thunk
export const updateTestbruker = (values, attributtListe, ident) => async (dispatch, getState) => {
	try {
		dispatch(updateTestbrukerRequest())
		const state = getState()
		const { testbruker } = state

		//TPSF
		const tpsfBody = mapValuesFromDataSource(values, attributtListe, DataSource.TPSF)
		const tpsfCurrentValues = testbruker.items.tpsf[0]
		const sendToTpsBody = mapIdentAndEnvironementForTps(state, ident)

		const tpsfRequest = async () => {
			const tpsfRes = await TpsfApi.updateTestbruker(_merge(tpsfCurrentValues, tpsfBody))
			if (tpsfRes.status === 200) {
				const sendToTpsRes = await TpsfApi.sendToTps(sendToTpsBody)
			}
			return tpsfRes
		}

		const promiseList = [tpsfRequest()]

		//KRR-STUB
		const krrstubPreviousValues = testbruker.items.krrstub[ident]
		if (krrstubPreviousValues) {
			const krrstubBody = mapValuesFromDataSource(values, attributtListe, DataSource.KRR)
			const krrStubRequest = KrrApi.updateTestbruker(
				krrstubPreviousValues.id,
				_merge(krrstubPreviousValues, krrstubBody)
			)
			promiseList.push(krrStubRequest)
		}

		//SIGRUN-STUB - multiple values
		const sigrunstubAtributtListe = attributtListe.filter(
			item => item.dataSource === DataSource.SIGRUN
		)
		if (sigrunstubAtributtListe.length > 0) {
			const sigrunstubRequest = sigrunstubAtributtListe.map(attribute => {
				const currentValues = values[attribute.id]
				const items = attribute.items
				const promises = currentValues.map(valueObject => {
					const headerObject = items.reduce(
						(prev, curr) => {
							return _set(prev, curr.editPath || curr.path || curr.id, valueObject[curr.id])
						},
						{ personidentifikator: ident }
					)
					return SigrunApi.updateTestbruker(headerObject)
				})
				return Promise.all(promises)
			})
			promiseList.push(sigrunstubRequest)
		}

		const updateRes = await Promise.all([promiseList])

		dispatch(updateTestbrukerSuccess())
	} catch (error) {
		console.log(error)
		dispatch(updateTestbrukerError())
	}
}

// Selectors
export const sokSelector = (items, searchStr) => {
	if (!items) return null
	if (!searchStr) return items

	const query = searchStr.toLowerCase()
	return items.filter(item => {
		return item.some(v => v.toLowerCase().includes(query))
	})
}
