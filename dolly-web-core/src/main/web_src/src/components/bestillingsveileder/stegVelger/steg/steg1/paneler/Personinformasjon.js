import React from 'react'
import Panel from '~/components/ui/panel/Panel'
import { useLocation } from 'react-use'
import _has from 'lodash/has'
import { Attributt, AttributtKategori } from '../Attributt'
import Formatters from '~/utils/DataFormatter'

export const PersoninformasjonPanel = ({ stateModifier, eksisterende }) => {
	const sm = stateModifier(PersoninformasjonPanel.initialValues)
	const opprettFraEksisterende = _has(useLocation(), 'state.state.opprettFraIdenter')
	const leggTil = _has(useLocation(), 'state.state.leggTilPaaFnr')

	//Noen egenskaper kan ikke endres når personen opprettes fra eksisterende
	if (leggTil && eksisterende) {
		const innvandretEllerUtvandret = eksisterende.innvandretUtvandret[0].innutvandret

		return (
			// Panel som innholder attributer som er støttet i Legg til
			<>
				<Panel
					heading={PersoninformasjonPanel.heading}
					startOpen
					checkAttributeArray={sm.batchAdd}
					uncheckAttributeArray={sm.batchRemove}
					iconType={'personinformasjon'}
				>
					<AttributtKategori title="Nasjonalitet">
						<Attributt
							attr={sm.attrs.innvandretFraLand}
							vis={innvandretEllerUtvandret == 'UTVANDRET'}
						/>
						<Attributt
							attr={sm.attrs.utvandretTilLand}
							vis={innvandretEllerUtvandret == 'INNVANDRET'}
						/>
					</AttributtKategori>
				</Panel>
			</>
		)
	} else if (!leggTil) {
		return (
			<Panel
				heading={PersoninformasjonPanel.heading}
				startOpen
				checkAttributeArray={sm.batchAdd}
				uncheckAttributeArray={sm.batchRemove}
				iconType={'personinformasjon'}
			>
				<AttributtKategori title="Alder">
					<Attributt attr={sm.attrs.alder} vis={!opprettFraEksisterende} />
					<Attributt attr={sm.attrs.doedsdato} />
				</AttributtKategori>

				<AttributtKategori title="Nasjonalitet">
					<Attributt attr={sm.attrs.statsborgerskap} />
					<Attributt attr={sm.attrs.innvandretFraLand} />
					<Attributt attr={sm.attrs.utvandretTilLand} />
				</AttributtKategori>

<<<<<<< HEAD
				<AttributtKategori title="Diverse">
					<Attributt attr={sm.attrs.identHistorikk} />
					<Attributt attr={sm.attrs.kjonn} vis={!opprettFraEksisterende} />
					<Attributt attr={sm.attrs.harMellomnavn} />
					<Attributt attr={sm.attrs.sprakKode} />
					<Attributt attr={sm.attrs.egenAnsattDatoFom} />
					<Attributt attr={sm.attrs.spesreg} />
					<Attributt attr={sm.attrs.erForsvunnet} />
				</AttributtKategori>
			</Panel>
		)
	}
=======
			<AttributtKategori title="Diverse">
				<Attributt attr={sm.attrs.identHistorikk} />
				<Attributt attr={sm.attrs.kjonn} vis={!opprettFraEksisterende} />
				<Attributt attr={sm.attrs.harMellomnavn} />
				<Attributt attr={sm.attrs.sprakKode} />
				<Attributt attr={sm.attrs.egenAnsattDatoFom} />
				<Attributt attr={sm.attrs.erForsvunnet} />
				<Attributt attr={sm.attrs.harBankkontonr} />
				<Attributt attr={sm.attrs.spesreg} />
			</AttributtKategori>
		</Panel>
	)
>>>>>>> 90e173c6c138f233fcf16a7dcd2d0fd08601a667
}

PersoninformasjonPanel.heading = 'Personinformasjon'

PersoninformasjonPanel.initialValues = ({ set, setMulti, del, has }) => ({
	alder: {
		label: 'Alder',
		checked: has('tpsf.alder') || has('tpsf.foedtEtter') || has('tpsf.foedtFoer'),
		add: () => set('tpsf.alder', Formatters.randomIntInRange(30, 60)),
		remove: () => del(['tpsf.alder', 'tpsf.foedtEtter', 'tpsf.foedtFoer'])
	},
	doedsdato: {
		label: 'Dødsdato',
		checked: has('tpsf.doedsdato'),
		add: () => set('tpsf.doedsdato', null),
		remove: () => del('tpsf.doedsdato')
	},
	statsborgerskap: {
		label: 'Statsborgerskap',
		checked: has('tpsf.statsborgerskap'),
		add() {
			setMulti(['tpsf.statsborgerskap', ''], ['tpsf.statsborgerskapRegdato', null])
		},
		remove() {
			del(['tpsf.statsborgerskap', 'tpsf.statsborgerskapRegdato'])
		}
	},
	innvandretFraLand: {
		label: 'Innvandret fra',
		checked: has('tpsf.innvandretFraLand'),
		add() {
			setMulti(['tpsf.innvandretFraLand', ''], ['tpsf.innvandretFraLandFlyttedato', null])
		},
		remove() {
			del(['tpsf.innvandretFraLand', 'tpsf.innvandretFraLandFlyttedato'])
		}
	},
	utvandretTilLand: {
		label: 'Utvandret til',
		checked: has('tpsf.utvandretTilLand'),
		add() {
			setMulti(['tpsf.utvandretTilLand', ''], ['tpsf.utvandretTilLandFlyttedato', null])
		},
		remove() {
			del(['tpsf.utvandretTilLand', 'tpsf.utvandretTilLandFlyttedato'])
		}
	},
	identHistorikk: {
		label: 'Identhistorikk',
		checked: has('tpsf.identHistorikk'),
		add: () =>
			set('tpsf.identHistorikk', [
				{
					foedtEtter: null,
					foedtFoer: null,
					identtype: null,
					kjonn: null,
					regdato: null
				}
			]),
		remove: () => del('tpsf.identHistorikk')
	},
	kjonn: {
		label: 'Kjønn',
		checked: has('tpsf.kjonn'),
		add: () => set('tpsf.kjonn', ''),
		remove: () => del('tpsf.kjonn')
	},
	harMellomnavn: {
		label: 'Har mellomnavn',
		checked: has('tpsf.harMellomnavn'),
		add: () => set('tpsf.harMellomnavn', true),
		remove: () => del('tpsf.harMellomnavn')
	},
	sprakKode: {
		label: 'Språk',
		checked: has('tpsf.sprakKode'),
		add: () => set('tpsf.sprakKode', ''),
		remove: () => del('tpsf.sprakKode')
	},
	egenAnsattDatoFom: {
		label: 'Egenansatt',
		checked: has('tpsf.egenAnsattDatoFom'),
		add: () => set('tpsf.egenAnsattDatoFom', new Date()),
		remove: () => del('tpsf.egenAnsattDatoFom')
	},
	erForsvunnet: {
		label: 'Forsvunnet',
		checked: has('tpsf.erForsvunnet'),
		add() {
			setMulti(['tpsf.erForsvunnet', true], ['tpsf.forsvunnetDato', null])
		},
		remove() {
			del(['tpsf.erForsvunnet', 'tpsf.forsvunnetDato'])
		}
	},
	harBankkontonr: {
		label: 'Bankkontonummer',
		checked: has('tpsf.harBankkontonr'),
		add() {
			setMulti(['tpsf.harBankkontonr', true], ['tpsf.bankkontonrRegdato', null])
		},
		remove() {
			del(['tpsf.harBankkontonr', 'tpsf.bankkontonrRegdato'])
		}
	},
	spesreg: {
		label: 'Diskresjonskode',
		checked: has('tpsf.spesreg'),
		add() {
			setMulti(['tpsf.spesreg', ''], ['tpsf.utenFastBopel', false])
		},
		remove() {
			del(['tpsf.spesreg', 'tpsf.utenFastBopel'])
		}
	}
})
