import React from 'react'
import { useMount } from 'react-use'
import DollyTable from '~/components/ui/dollyTable/DollyTable'
import Loading from '~/components/ui/loading/Loading'
import ContentContainer from '~/components/ui/contentContainer/ContentContainer'
import PersonIBrukButtonConnector from '~/components/ui/button/PersonIBrukButton/PersonIBrukButtonConnector'
import PersonVisningConnector from '../PersonVisning/PersonVisningConnector'

export default function PersonListe({ isFetching, personListe, searchActive, fetchTpsfPersoner }) {
	useMount(fetchTpsfPersoner)

	if (isFetching) return <Loading label="laster personer" panel />

	if (!personListe || personListe.length === 0)
		return (
			<ContentContainer>
				Trykk på opprett personer-knappen for å starte en bestilling.
			</ContentContainer>
		)

	if (personListe.length <= 0 && searchActive) {
		return <ContentContainer>Søket gav ingen resultater.</ContentContainer>
	}
	const columns = [
		{
			text: 'Ident',
			width: '15',
			dataField: 'ident.ident',
			unique: true
		},
		{
			text: 'Type',
			width: '15',
			dataField: 'identtype'
		},
		{
			text: 'Navn',
			width: '30',
			dataField: 'navn'
		},
		{
			text: 'Kjønn',
			width: '20',
			dataField: 'kjonn'
		},
		{
			text: 'Alder',
			width: '10',
			dataField: 'alder'
		},
		{
			text: 'Bestilling-ID',
			width: '10',
			dataField: 'ident.bestillingId'
		},
		{
			text: 'I bruk',
			width: '10',
			dataField: 'ibruk',
			formatter: (cell, row) => <PersonIBrukButtonConnector ident={row.ident} />
		}
	]

	return (
		<DollyTable
			data={personListe}
			columns={columns}
			pagination
			onExpand={bruker => (
				<PersonVisningConnector
					personId={bruker.ident.ident}
					bestillingId={bruker.ident.bestillingId}
					gruppeId={bruker.ident.gruppeId}
				/>
			)}
		/>
	)
}
