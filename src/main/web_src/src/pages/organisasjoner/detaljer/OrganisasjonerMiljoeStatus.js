import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import ApiFeilmelding from '~/components/ui/apiFeilmelding/ApiFeilmelding'
import antallOrganisasjonerOpprettet from '~/components/bestilling/utils/antallIdenterOpprettet'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import SystemStatus from '~/pages/organisasjoner/detaljer/systemStatus/SystemStatus'

const mapStatusrapport = bestillingstatus => {
	return bestillingstatus.reduce((acc, curr) => {
		return {
			organisasjonsnummer: curr.organisasjonsnummer,
			melding: curr.organisasjonsforvalterStatus !== 'OK' ? curr.organisasjonsforvalterStatus : null
		}
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
