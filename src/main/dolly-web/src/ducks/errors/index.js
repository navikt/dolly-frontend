import { createAction } from 'redux-actions'
import { createSelector } from 'reselect'
import _filter from 'lodash/filter'
import failure from '~/utils/FailureAction'

import { actions as teamsActions } from '~/ducks/teams'
import { createTeam as gruppeCreateTeam } from '~/ducks/gruppe'

export const clearAllErrors = createAction('ERRORS/CLEAR_ALL_ERRORS')

// SELECTORS
export const createErrorMessageSelector = actions => state => {
	const errors = actions.map(action => state.errors[action])
	if (errors && errors[0]) {
		return errors[0]
	}
	return ''
}

// Pick any error
export const applicationErrorSelector = createSelector(
	state => state.errors,
	errors => {
		const filtered = _filter(errors, val => val !== '')
		return filtered[Object.keys(filtered)[0]]
	}
)

const initialState = {}
export default function errorReducer(state = initialState, action) {
	const { type, payload } = action
	const matches = /(.*)_(REQUEST|FAILURE)/.exec(type)

	if (type === clearAllErrors.toString()) return initialState

	// not a *_REQUEST / *_FAILURE actions, so we ignore them
	if (!matches) return state

	const [requestNameFull, requestName, requestState] = matches
	if (requestNameFull === failure(teamsActions.api.create) || requestNameFull === failure(gruppeCreateTeam)) {
		if (payload.response.status === 500) {
			payload.customMessage = 'Kan ikke opprette team. Teamnavn er allerede i bruk.'
		}
	}
	return {
		...state,
		// Store errorMessage
		// e.g. stores errorMessage when receiving GET_TODOS_FAILURE
		//      else clear errorMessage when receiving GET_TODOS_REQUEST
		[requestName]: requestState === 'FAILURE' ? payload.customMessage || payload.message : ''
	}
}
