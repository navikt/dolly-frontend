import React from 'react'
import ApiFeilmelding from '~/components/ui/apiFeilmelding/ApiFeilmelding'
import Icon from '~/components/ui/icon/Icon'

import './FagsystemStatus.less'

export default function FagsystemStatus({ statusrapport }) {
	if (statusrapport.length <= 0) return false

	// Feilmeldinger som skal ha gul problem-circle legges inn her
	const problemCircleFeil = ['InnvandringOpprettingsmelding: STATUS: TIDSAVBRUDD']

	const getIconType = melding =>
		melding
			? problemCircleFeil.includes(melding)
				? 'report-problem-circle'
				: 'report-problem-triangle'
			: 'feedback-check-circle'

	return (
		<table className="fagsystemstatus">
			<thead>
				<tr>
					<td>System</td>
					<td>Miljø</td>
					<td>Ident</td>
				</tr>
			</thead>
			<tbody>
				{statusrapport.map((status, idx) => (
					<tr key={idx}>
						<td>
							<div className="flexbox">
								<Icon size={16} kind={getIconType(status.melding)} />
								<div>
									<h5>{status.navn}</h5>
									<ApiFeilmelding feilmelding={status.melding} />
								</div>
							</div>
						</td>
						<td>{status.miljo || <i>(N/A)</i>}</td>
						<td>
							<ul>
								{status.identer.map((ident, idx) => (
									<li key={idx}>{ident}</li>
								))}
							</ul>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
