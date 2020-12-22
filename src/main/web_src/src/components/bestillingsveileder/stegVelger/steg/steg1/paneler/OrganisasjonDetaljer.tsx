import React from 'react'
import Panel from '~/components/ui/panel/Panel'
import { Attributt, AttributtKategori } from '../Attributt'

export const OrganisasjonDetaljerPanel = ({ stateModifier }: any) => {
	const sm = stateModifier(OrganisasjonDetaljerPanel.initialValues)

	return (
		// @ts-ignore
		<Panel
			heading={OrganisasjonDetaljerPanel.heading}
			startOpen
			checkAttributeArray={sm.batchAdd}
			uncheckAttributeArray={() => sm.batchRemove('enhetstype')}
			iconType="personinformasjon"
		>
			<AttributtKategori title="Enhetstype">
				<Attributt
					attr={sm.attrs.enhetstype}
					disabled={true}
					title="Det er obligatorisk å velge enhetstype for organisasjonen"
				/>
				<Attributt attr={sm.attrs.naeringskode} />
				<Attributt attr={sm.attrs.formaal} />
			</AttributtKategori>
			<AttributtKategori title="Kontaktdata">
				<Attributt attr={sm.attrs.telefon} />
				<Attributt attr={sm.attrs.epost} />
				<Attributt attr={sm.attrs.nettadresse} />
			</AttributtKategori>
			<AttributtKategori title="Adresser">
				<Attributt attr={sm.attrs.forretningsadresse} />
				<Attributt attr={sm.attrs.postadresse} />
			</AttributtKategori>
		</Panel>
	)
}

OrganisasjonDetaljerPanel.heading = 'Detaljer'

OrganisasjonDetaljerPanel.initialValues = ({ set, del, has }: any) => {
	return {
		enhetstype: {
			label: 'Enhetstype',
			checked: has('organisasjoner.enhetstype'),
			add: () => set('organisasjoner.enhetstype', ''),
			remove: () => del('organisasjoner.enhetstype')
		},
		naeringskode: {
			label: 'Næringskode',
			checked: has('organisasjoner.naeringskode'),
			add: () => set('organisasjoner.naeringskode', ''),
			remove: () => del('organisasjoner.naeringskode')
		},
		formaal: {
			label: 'Formål',
			checked: has('organisasjoner.formaal'),
			add: () => set('organisasjoner.formaal', ''),
			remove: () => del('organisasjoner.formaal')
		},
		telefon: {
			label: 'Telefon',
			checked: has('organisasjoner.telefon'),
			add: () => set('organisasjoner.telefon', ''),
			remove: () => del('organisasjoner.telefon')
		},
		epost: {
			label: 'E-postadresse',
			checked: has('organisasjoner.epost'),
			add: () => set('organisasjoner.epost', ''),
			remove: () => del('organisasjoner.epost')
		},
		nettadresse: {
			label: 'Internettadresse',
			checked: has('organisasjoner.nettadresse'),
			add: () => set('organisasjoner.nettadresse', ''),
			remove: () => del('organisasjoner.nettadresse')
		},
		forretningsadresse: {
			label: 'Forretningsadresse',
			checked: has('organisasjoner.forretningsadresse'),
			add: () =>
				set('organisasjoner.forretningsadresse', {
					adresselinjer: ['', '', ''],
					postnr: '',
					kommunenr: '',
					landkode: 'NOR',
					poststed: ''
				}),
			remove: () => del('organisasjoner.forretningsadresse')
		},
		postadresse: {
			label: 'Postadresse',
			checked: has('organisasjoner.postadresse'),
			add: () =>
				set('organisasjoner.postadresse', {
					adresselinjer: ['', '', ''],
					postnr: '',
					kommunenr: '',
					landkode: 'NOR',
					poststed: ''
				}),
			remove: () => del('organisasjoner.postadresse')
		}
	}
}
