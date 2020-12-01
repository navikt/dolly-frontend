import React, { useState } from 'react'
import Hjelpetekst from '~/components/hjelpetekst'
import NavButton from '~/components/ui/button/NavButton/NavButton'
import { ToggleGruppe, ToggleKnapp } from '~/components/ui/toggle/Toggle'
import Icon from '~/components/ui/icon/Icon'
import { SearchField } from '~/components/searchField/SearchField'
import OrganisasjonListe from './OrganisasjonListe'
import ContentContainer from '~/components/ui/contentContainer/ContentContainer'

import { useAsync } from 'react-use'
import Api from '~/api'
import config from '~/config'

const VISNING_ORGANISASJONER = 'organisasjoner'
const VISNING_BESTILLINGER = 'bestillinger'

export default function Organisasjoner() {
	const [visning, setVisning] = useState(VISNING_ORGANISASJONER)

	const byttVisning = event => setVisning(event.target.value)

	const searchfieldPlaceholderSelector = () => {
		if (visning === VISNING_BESTILLINGER) return 'Søk i bestillinger'
		return 'Søk i organisasjoner'
	}

	//! Henter midlertidig inn faste org for å kunne lage oppsettet - byttes ut når organisasjonsforvalter er klar
	const uri = `${config.services.dollyBackend}`
	const tempOrg = useAsync(async () => {
		const response = await Api.fetchJson(`${uri}/orgnummer`, { method: 'GET' })
		return response
	}, [])

	const antallOrg = !tempOrg.loading ? tempOrg.value.liste.length : 0
	const antallBest = 0

	return (
		<div className="oversikt-container">
			<div className="toolbar">
				<div className="page-header flexbox--align-center">
					<h1>Testorganisasjoner</h1>
					{/* // TODO: Skriv en ordentlig tekst! */}
					<Hjelpetekst hjelpetekstFor="Testorganisasjoner" type="under">
						Dette er oversikten over dine egne testorganisasjoner. Du kan opprette nye ved å trykke
						på knappen under.
					</Hjelpetekst>
				</div>
			</div>

			{/* // TODO: StatusListeConnector for bestillinger */}

			<div className="toolbar">
				<NavButton type="hoved" onClick={null}>
					Opprett organisasjon
				</NavButton>

				<ToggleGruppe onChange={byttVisning} name="toggler">
					<ToggleKnapp value={VISNING_ORGANISASJONER} checked={visning === VISNING_ORGANISASJONER}>
						<Icon
							size={13}
							kind={visning === VISNING_ORGANISASJONER ? 'organisasjonLight' : 'organisasjon'}
						/>
						{`Organisasjoner (${antallOrg})`}
					</ToggleKnapp>
					<ToggleKnapp value={VISNING_BESTILLINGER} checked={visning === VISNING_BESTILLINGER}>
						<Icon
							size={13}
							kind={visning === VISNING_BESTILLINGER ? 'bestillingLight' : 'bestilling'}
						/>
						{`Bestillinger (${antallBest})`}
					</ToggleKnapp>
				</ToggleGruppe>

				<SearchField placeholder={searchfieldPlaceholderSelector()} />
			</div>

			{!tempOrg.loading &&
				visning === VISNING_ORGANISASJONER &&
				(antallOrg > 0 ? (
					<OrganisasjonListe orgListe={tempOrg.value.liste} />
				) : (
					<ContentContainer>
						<p>
							Du har for øyeblikket ingen testorganisasjoner. Trykk på knappen under for å opprette
							en testorganisasjon med standard oppsett.
						</p>
						<NavButton type="standard" onClick={null} style={{ marginTop: '10px' }}>
							Opprett standard organisasjon
						</NavButton>
					</ContentContainer>
				))}
			{visning === VISNING_BESTILLINGER && null}
		</div>
	)
}
