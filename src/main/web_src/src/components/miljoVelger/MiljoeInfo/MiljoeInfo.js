import React from 'react'
import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { InstApi } from '~/service/Api'
import { ArenaApi } from '~/service/Api'
import { PensjonApi } from '~/service/Api'
import TilgjengeligeMiljoer from './TilgjengeligeMiljoer'

export const MiljoeInfo = ({ bestillingsdata, dollyEnvironments }) => {
	const { instdata, pdlforvalter, arenaforvalter, pensjonforvalter } = bestillingsdata
	if (!instdata && !pdlforvalter && !arenaforvalter && !pensjonforvalter) return null

	return (
		<AlertStripeInfo>
			Du har valgt egenskaper som ikke blir distribuert til alle miljøer. For hver av følgende
			egenskaper må derfor ett eller flere av miljøene under velges:
			<ul>
				{instdata && (
					<li>
						Institusjonsopphold:&nbsp;
						<TilgjengeligeMiljoer
							endepunkt={InstApi.getTilgjengeligeMiljoer}
							dollyEnvironments={dollyEnvironments}
						/>
					</li>
				)}

				{pdlforvalter && pdlforvalter.falskIdentitet && <li>Falsk identitet: Q2</li>}
				{pdlforvalter && pdlforvalter.utenlandskIdentifikasjonsnummer && (
					<li>Utenlandsk identifikasjonsnummer: Q2</li>
				)}
				{pdlforvalter && pdlforvalter.kontaktinformasjonForDoedsbo && (
					<li>Kontaktinformasjon for dødsbo: Q2</li>
				)}

				{arenaforvalter && (
					<li>
						Arena:&nbsp;
						<TilgjengeligeMiljoer
							endepunkt={ArenaApi.getTilgjengeligeMiljoer}
							dollyEnvironments={dollyEnvironments}
						/>
					</li>
				)}

				{pensjonforvalter && (
					<li>
						POPP:&nbsp;
						<TilgjengeligeMiljoer
							endepunkt={PensjonApi.getTilgjengeligeMiljoer}
							dollyEnvironments={dollyEnvironments}
						/>
					</li>
				)}
			</ul>
		</AlertStripeInfo>
	)
}