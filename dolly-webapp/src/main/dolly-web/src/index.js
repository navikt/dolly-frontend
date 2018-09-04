import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import history from './history'
import configureStore from './Store'
import { ConnectedRouter } from 'connected-react-router'
import AppConnector from './app/AppConnector'

import './styles/main.less'

const appReduxStore = configureStore(history)

render(
	<Provider store={appReduxStore}>
		<ConnectedRouter history={history}>
			<AppConnector />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)
