import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import configureStore from './Store'
import './styles/main.less'
import { ConnectedRouter } from 'connected-react-router'
import AppConnector from './app/AppConnector'

const history = createHistory()
const appReduxStore = configureStore(history)

render(
	<Provider store={appReduxStore}>
		<ConnectedRouter history={history}>
			<AppConnector />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)
