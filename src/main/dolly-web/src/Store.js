import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import { connectRouter, routerMiddleware, LOCATION_CHANGE } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import bestillingReducer from './ducks/bestilling'
import gruppeReducer from './ducks/gruppe'
import teamsReducer from './ducks/teams'
import brukerReducer from './ducks/bruker'
import testbrukerReducer from './ducks/testBruker'
import searchReducer from './ducks/search'
import sortReducer from './ducks/sort'
import loadingReducer from './ducks/loading'
import errorsReducer from './ducks/errors'
import commonReducer from './ducks/common'
import configReducer from './ducks/config'
import history from './history'

const locationMiddleware = store => next => action => {
	if (action.type === LOCATION_CHANGE) {
		const prevPath = store.getState().router.location.pathname
		const nextPath = action.payload.location.pathname
		if (prevPath === nextPath) {
			console.log('cancel location change - same path')
			return false
		}
	}
	return next(action)
}

const configureReduxStore = history => {
	const allMiddleware = [
		locationMiddleware,
		thunkMiddleware,
		promiseMiddleware({ promiseTypeSuffixes: ['REQUEST', 'SUCCESS', 'FAILURE'] }),
		routerMiddleware(history)
	]

	// Add redux logger if not in production
	if (process.env.NODE_ENV !== `production`) {
		const createLogger = require(`redux-logger`).createLogger
		const logger = createLogger({ collapsed: true })
		allMiddleware.push(logger)
	}

	const rootReducer = combineReducers({
		bestilling: bestillingReducer,
		gruppe: gruppeReducer,
		teams: teamsReducer,
		bruker: brukerReducer,
		testbruker: testbrukerReducer,
		search: searchReducer,
		sort: sortReducer,
		loading: loadingReducer,
		errors: errorsReducer,
		common: commonReducer,
		config: configReducer
	})

	return createStore(
		connectRouter(history)(rootReducer),
		composeWithDevTools(applyMiddleware(...allMiddleware))
	)
}

export default configureReduxStore(history)