import React from 'react'
import Panel from '~/components/ui/panel/Panel'
import { Attributt, AttributtKategori } from '../Attributt'

export const ArenaPanel = ({ stateModifier }) => {
	const sm = stateModifier(ArenaPanel.initialValues)

	return (
		<Panel
			heading={ArenaPanel.heading}
			checkAttributeArray={sm.batchAdd}
			uncheckAttributeArray={sm.batchRemove}
			iconType="arena"
		>
			<AttributtKategori title={'Aktiv bruker'}>
				<Attributt disabled={sm.attrs.ikkeServicebehov.checked} attr={sm.attrs.aap115} />
				<Attributt disabled={sm.attrs.ikkeServicebehov.checked} attr={sm.attrs.aap} />
				<Attributt disabled={sm.attrs.ikkeServicebehov.checked} attr={sm.attrs.dagpenger} />
			</AttributtKategori>

			<AttributtKategori title={'Inaktiv bruker'}>
				<Attributt
					disabled={sm.attrs.aap.checked || sm.attrs.aap115.checked || sm.attrs.dagpenger.checked}
					attr={sm.attrs.ikkeServicebehov}
				/>
			</AttributtKategori>
		</Panel>
	)
}

ArenaPanel.heading = 'Arbeidsytelser'

ArenaPanel.initialValues = ({ setMulti, del, has }) => ({
	aap115: {
		label: '11.5-vedtak',
		checked: has('arenaforvalter.aap115'),
		add() {
			setMulti(
				[
					'arenaforvalter.aap115[0]',
					{
						fraDato: null,
						tilDato: null
					}
				],
				['arenaforvalter.arenaBrukertype', 'MED_SERVICEBEHOV']
			)
		},
		remove() {
			del('arenaforvalter.aap115')
		}
	},

	aap: {
		label: 'AAP-vedtak',
		checked: has('arenaforvalter.aap'),
		add() {
			setMulti(
				[
					'arenaforvalter.aap[0]',
					{
						fraDato: null,
						tilDato: null
					}
				],
				['arenaforvalter.arenaBrukertype', 'MED_SERVICEBEHOV']
			)
		},
		remove() {
			del('arenaforvalter.aap')
		}
	},

	dagpenger: {
		label: 'Dagpengevedtak',
		checked: has('arenaforvalter.dagpenger'),
		add() {
			setMulti(
				[
					'arenaforvalter.dagpenger[0]',
					{
						vedtakstype: 'O',
						rettighetKode: '',
						fraDato: null,
						tilDato: null,
						mottattDato: null
					}
				],
				['arenaforvalter.arenaBrukertype', 'MED_SERVICEBEHOV']
			)
		},
		remove() {
			del('arenaforvalter.dagpenger')
		}
	},

	ikkeServicebehov: {
		label: 'Har ikke servicebehov',
		checked: has('arenaforvalter.inaktiveringDato'),
		add() {
			setMulti(
				['arenaforvalter.arenaBrukertype', 'UTEN_SERVICEBEHOV'],
				['arenaforvalter.inaktiveringDato', null]
			)
		},
		remove() {
			del(['arenaforvalter.arenaBrukertype', 'arenaforvalter.inaktiveringDato'])
		}
	}
})
