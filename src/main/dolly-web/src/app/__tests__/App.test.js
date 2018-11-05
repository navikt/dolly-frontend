import React from 'react'
import { shallow } from 'enzyme'
import App from '../App'

import Header from '~/components/header/Header'
import Loading from '~/components/loading/Loading'
import Breadcrumb from '~/components/breadcrumb/BreadcrumbWithHoc'

describe('App.js', () => {
	const fetchConfig = jest.fn()
	const getCurrentBruker = jest.fn()

	it('should call fetchConfig and getCurrentBruker on mount', () => {
		const wrapper = shallow(<App fetchConfig={fetchConfig} getCurrentBruker={getCurrentBruker} />)
		expect(fetchConfig).toBeCalled()
		expect(getCurrentBruker).toBeCalled()
	})

	it('should render null when no config', () => {
		const wrapper = shallow(<App fetchConfig={fetchConfig} getCurrentBruker={getCurrentBruker} />)
		expect(wrapper.children()).toHaveLength(0)
	})

	it('should render loading component', () => {
		const wrapper = shallow(
			<App fetchConfig={fetchConfig} getCurrentBruker={getCurrentBruker} configReady={true} />
		)

		expect(wrapper.find(Loading).exists()).toBeTruthy()
	})

	it('should render main components', () => {
		const testbrukerData = { id: 'test' }
		const wrapper = shallow(
			<App
				fetchConfig={fetchConfig}
				getCurrentBruker={getCurrentBruker}
				configReady={true}
				brukerData={testbrukerData}
			/>
		)

		expect(wrapper.find(Header).exists()).toBeTruthy()
		expect(wrapper.find(Breadcrumb).exists()).toBeTruthy()
	})
})
