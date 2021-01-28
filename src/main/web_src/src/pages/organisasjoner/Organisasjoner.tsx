import React, { useState, useEffect } from 'react'
import Hjelpetekst from '~/components/hjelpetekst'
import NavButton from '~/components/ui/button/NavButton/NavButton'
import { ToggleGruppe, ToggleKnapp } from '~/components/ui/toggle/Toggle'
import Icon from '~/components/ui/icon/Icon'
import { SearchField } from '~/components/searchField/SearchField'
import OrganisasjonListe from './OrganisasjonListe'
import ContentContainer from '~/components/ui/contentContainer/ContentContainer'
import Loading from '~/components/ui/loading/Loading'
import { History } from 'history'
import { useAsync } from 'react-use'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import OrganisasjonBestilling from '~/pages/organisasjoner/OrganisasjonBestilling'
import StatusListeConnector from '~/components/bestilling/statusListe/StatusListeConnector'

type Organisasjoner = {
	history: History
	isFetching: boolean
	brukerId: string
	getOrganisasjonBestilling: Function
	getOrganisasjoner: Function
}

type OrganisasjonResponse = {
	value: {
		data: OrganisasjonInfo[]
	}
}

type OrganisasjonInfo = {
	adresser: string[]
	enhetstype: string
	naeringskode: string
	sektorkode: string
	organisasjonsnavn: string
	organisasjonsnummer: string
	status: Array<Status>
	underenheter: OrganisasjonInfo[]
	id: number
}

type Status = {
	organisasjonsnummer: string
}

enum BestillingType {
	NY = 'NY',
	STANDARD = 'STANDARD'
}

const VISNING_ORGANISASJONER = 'organisasjoner'
const VISNING_BESTILLINGER = 'bestillinger'

export default function Organisasjoner({
	history,
	isFetching,
	brukerId,
	getOrganisasjonBestilling,
	getOrganisasjoner
}: Organisasjoner) {
	const [visning, setVisning] = useState(VISNING_ORGANISASJONER)
	const [organisasjonliste, setOrganisasjonliste] = useState(null)

	const byttVisning = (event: React.ChangeEvent<any>) => setVisning(event.target.value)

	useEffect(() => {
		getOrganisasjonBestilling(brukerId)
	}, [])

	const searchfieldPlaceholderSelector = () => {
		if (visning === VISNING_BESTILLINGER) return 'Søk i bestillinger'
		return 'Søk i organisasjoner'
	}

	function getBestillingIdFromOrgnummer(
		organisasjoner: OrganisasjonInfo[],
		organisasjonsnummer: string
	) {
		return organisasjoner
			.filter((org: OrganisasjonInfo) => org.status[0].organisasjonsnummer === organisasjonsnummer)
			.map((org: OrganisasjonInfo) => org.id)[0]
	}

	const organisasjonerInfo = useAsync(async () => {
		const response = await getOrganisasjonBestilling(brukerId)
		setOrganisasjonliste(response.value.data)
		let orgNumre: string[] = []
		response.value.data.forEach((org: any) => {
			if (org.ferdig && org.organisasjonNummer !== 'NA')
				return orgNumre.push(org.status[0].organisasjonsnummer)
		})

		return getOrganisasjoner(orgNumre).then((orgInfo: OrganisasjonResponse) => {
			return orgInfo.value.data.map(orgElement => ({
				...orgElement,
				status: 'Ferdig',
				bestillingId: getBestillingIdFromOrgnummer(
					response.value.data,
					orgElement.organisasjonsnummer
				)
			}))
		})
	}, [])

	const antallOrg = organisasjonerInfo.value ? organisasjonerInfo.value.length : 0
	const antallBest = organisasjonliste ? organisasjonliste.length : 0

	const startBestilling = (type: string) => {
		history.push('/organisasjoner/bestilling', { opprettOrganisasjon: type })
	}

	const dollySlack = (
		<a href="https://nav-it.slack.com/archives/CA3P9NGA2" target="_blank">
			#dolly
		</a>
	)

	const tomOrgListe = () => (
		<ContentContainer>
			<p>
				Du har for øyeblikket ingen testorganisasjoner. Trykk på knappen under for å opprette en
				testorganisasjon med standard oppsett.
			</p>
			<NavButton
				type="standard"
				onClick={() => startBestilling(BestillingType.STANDARD)}
				style={{ marginTop: '10px' }}
			>
				Opprett standard organisasjon
			</NavButton>
		</ContentContainer>
	)

	return (
		<ErrorBoundary>
			<div className="oversikt-container">
				<div className="toolbar">
					<div className="page-header flexbox--align-center">
						<h1>Testorganisasjoner</h1>
						{/* @ts-ignore */}
						<Hjelpetekst hjelpetekstFor="Testorganisasjoner" type="under">
							Organisasjoner i Dolly er en del av NAVs syntetiske testpopulasjon og dekker behov for
							testdata knyttet til bedrifter/virksomheter (EREG). Løsningen er under utvikling, og
							det legges til ny funksjonalitet fortløpende.
							<br />
							På denne siden finner du en oversikt over dine egne testorganisasjoner. Du kan
							opprette nye organisasjoner ved å trykke på knappen under.
							<br />
							Kontakt oss gjerne på {dollySlack} dersom du har spørsmål eller innspill
						</Hjelpetekst>
					</div>
				</div>

				<StatusListeConnector brukerId={brukerId} />

				<div className="toolbar">
					<NavButton type="hoved" onClick={() => startBestilling(BestillingType.NY)}>
						Opprett organisasjon
					</NavButton>

					<ToggleGruppe onChange={byttVisning} name="toggler">
						<ToggleKnapp
							value={VISNING_ORGANISASJONER}
							checked={visning === VISNING_ORGANISASJONER}
						>
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

				{visning === VISNING_ORGANISASJONER &&
					(organisasjonerInfo.loading ? (
						<Loading label="laster organisasjoner" panel />
					) : antallOrg > 0 ? (
						<OrganisasjonListe
							orgListe={organisasjonerInfo && organisasjonerInfo.value}
							bestillinger={organisasjonliste}
						/>
					) : (
						tomOrgListe()
					))}
				{visning === VISNING_BESTILLINGER &&
					(isFetching ? (
						<Loading label="laster bestillinger" panel />
					) : antallOrg > 0 ? (
						<OrganisasjonBestilling orgListe={organisasjonliste} />
					) : (
						tomOrgListe()
					))}
			</div>
		</ErrorBoundary>
	)
}
