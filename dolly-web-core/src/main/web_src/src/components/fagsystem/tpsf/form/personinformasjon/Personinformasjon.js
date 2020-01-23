import React from 'react'
import Panel from '~/components/ui/panel/Panel'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { panelError } from '~/components/ui/form/formUtils'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { Diverse } from './partials/Diverse'
import { Alder } from './partials/alder/Alder'

const alderPaths = ['tpsf.alder', 'tpsf.foedtEtter', 'tpsf.foedtFoer', 'tpsf.doedsdato']

const nasjonalitetPaths = [
	'tpsf.statsborgerskap',
	'tpsf.innvandretFraLand',
	'tpsf.utvandretTilLand'
]
const diversePaths = [
	'tpsf.kjonn',
	'tpsf.harMellomnavn',
	'tpsf.sivilstand',
	'tpsf.sprakKode',
	'tpsf.egenAnsattDatoFom',
	'tpsf.spesreg',
	'tpsf.erForsvunnet'
]

const panelPaths = [alderPaths, nasjonalitetPaths, diversePaths].flat()

export const Personinformasjon = ({ formikBag }) => (
	<Vis attributt={panelPaths}>
		<Panel
			heading="Personinformasjon"
			hasErrors={panelError(formikBag, panelPaths)}
			iconType={'personinformasjon'}
			startOpen
		>
			<Kategori title="Alder" vis={alderPaths}>
				<Alder basePath="tpsf" formikBag={formikBag} />
			</Kategori>

			<Kategori title="Nasjonalitet" vis={nasjonalitetPaths}>
				<Vis attributt="tpsf.statsborgerskap">
					<FormikSelect
						name="tpsf.statsborgerskap"
						label="Statsborgerskap"
						kodeverk="Landkoder"
						size="large"
					/>
					<FormikDatepicker name="tpsf.statsborgerskapRegdato" label="Statsborgerskap fra" />
				</Vis>

				<Vis attributt="tpsf.innvandretFraLand">
					<FormikSelect
						name="tpsf.innvandretFraLand"
						label="Innvandret"
						kodeverk="Landkoder"
						size="large"
					/>
					<FormikDatepicker name="tpsf.innvandretFraLandFlyttedato" label="Innvandret dato" />
				</Vis>

				<Vis attributt="tpsf.utvandretTilLand">
					<FormikSelect
						name="tpsf.utvandretTilLand"
						label="Utvandret"
						kodeverk="Landkoder"
						size="large"
					/>
					<FormikDatepicker name="tpsf.utvandretTilLandFlyttedato" label="Utvandret dato" />
				</Vis>
			</Kategori>

			<Kategori title="Diverse" vis={diversePaths}>
				<Diverse formikBag={formikBag} />
			</Kategori>
		</Panel>
	</Vis>
)
