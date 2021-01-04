import React from 'react'
import ApiFeilmelding from '~/components/ui/apiFeilmelding/ApiFeilmelding'
import Icon from '~/components/ui/icon/Icon'

import './SystemStatus.less'

export default function SystemStatus({ statusrapport }) {
	if (statusrapport.length <= 0) return false

	const getIconType = melding =>
		melding.includes('OK') ? 'feedback-check-circle' : 'report-problem-triangle'

	return (
		<table className="fagsystemstatus">
			<thead>
				<tr>
					<td>Status</td>
					<td>Miljø</td>
				</tr>
			</thead>
			<tbody>
				{statusrapport.melding.split(',').map((fullStatus, idx) => {
					const [miljo, statuskode] = fullStatus.split(':')
					return (
						<tr key={idx}>
							<td>
								<div className="flexbox">
									<Icon size={16} kind={getIconType(statuskode)} />
									<div>
										<h5>Organisasjon Forvalter</h5>
										<ApiFeilmelding feilmelding={statuskode} />
									</div>
								</div>
							</td>
							<td>{miljo.toUpperCase() || <i>Ikke relevant</i>}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}
