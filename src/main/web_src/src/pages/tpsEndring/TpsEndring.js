import React, { PureComponent, Fragment } from 'react'
import SendFoedselsmelding from './SendFoedselsmelding'
import SendDoedsmelding from './SendDoedsmelding'
import './TpsEndring.less'

export default class TPSEndring extends PureComponent {
	render() {
		const dollySlack = <a href="https://nav-it.slack.com/archives/CA3P9NGA2">#dolly</a>

		return (
			<Fragment>
				<h1>Send Endringsmelding</h1>
				<p>
					(Denne siden kommer til å bli fjernet. Kontakt oss på {dollySlack} hvis dette er et
					problem for deg.)
				</p>
				<SendFoedselsmelding />
				<SendDoedsmelding />
			</Fragment>
		)
	}
}
