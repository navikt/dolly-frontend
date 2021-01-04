import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import Formatters from '~/utils/DataFormatter'
import ApiFeilmelding from '~/components/ui/apiFeilmelding/ApiFeilmelding'
import antallOrganisasjonerOpprettet from '~/components/bestilling/utils/antallIdenterOpprettet'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import SystemStatus from '~/pages/organisasjoner/detaljer/systemStatus/SystemStatus'

const mapStatusrapport = bestillingstatus => {
	return bestillingstatus.reduce((acc, curr) => {
		const feil = {
			organisasjonsnummer: curr.organisasjonsnummer,
			melding: curr.organisasjonsforvalterStatus !== 'OK' ? curr.organisasjonsforvalterStatus : null
		}

		if (status.detaljert) {
			const miljoArray = status.detaljert.map(m => m.miljo).sort()
			const identArray = status.detaljert[0].identer
			feil.miljo = miljoArray[0] ? Formatters.arrayToString(miljoArray) : ''
			feil.identer = identArray
		}

		return feil
	}, [])
}

export default function OrganisasjonerMiljoeStatus({ bestilling }) {
	const statusrapport = mapStatusrapport(bestilling.status)
	const { tekst } = antallOrganisasjonerOpprettet(bestilling)
	return (
		<ErrorBoundary>
			<div>
				<SubOverskrift label="Bestillingsstatus" />
				{bestilling.feil && (
					<div className="feilmelding_generell">
						<p>{tekst}</p>
						<ApiFeilmelding feilmelding={bestilling.feil} container />
					</div>
				)}
			</div>
			<SystemStatus statusrapport={statusrapport} />
		</ErrorBoundary>
	)
}
