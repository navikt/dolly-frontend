import React from 'react'
import { Vis, pathAttrs } from '~/components/bestillingsveileder/VisAttributt'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'

export const Diverse = ({ formikBag }) => (
	<Kategori title="Diverse" vis={pathAttrs.kategori.diverse}>
		<FormikSelect name="tpsf.kjonn" label="Kjønn" kodeverk="Kjønnstyper" visHvisAvhuket />

		<FormikSelect
			name="tpsf.harMellomnavn"
			label="Mellomnavn"
			options={Options('boolean')}
			visHvisAvhuket
		/>

		<FormikSelect
			name="tpsf.sivilstand"
			label="Sivilstand"
			kodeverk="Sivilstander"
			visHvisAvhuket
		/>

		<FormikSelect name="tpsf.sprakKode" label="Språk" kodeverk="Språk" visHvisAvhuket />

		<FormikDatepicker name="tpsf.egenAnsattDatoFom" label="Egenansatt fra" visHvisAvhuket />

		<FormikSelect
			name="tpsf.spesreg"
			label="Diskresjonskode"
			kodeverk="Diskresjonskoder"
			visHvisAvhuket
		/>

		<Vis attributt="tpsf.erForsvunnet">
			<FormikSelect name="tpsf.erForsvunnet" label="Er forsvunnet" options={Options('boolean')} />

			<FormikDatepicker
				name="tpsf.forsvunnetDato"
				label="Forsvunnet dato"
				disabled={!formikBag.values.tpsf.erForsvunnet}
			/>
		</Vis>
	</Kategori>
)
