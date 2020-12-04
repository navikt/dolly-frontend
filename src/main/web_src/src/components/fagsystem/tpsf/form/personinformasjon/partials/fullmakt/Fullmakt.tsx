import * as React from 'react'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { SelectOptionsOppslag } from '~/service/SelectOptionsOppslag'

export const Fullmakt = () => {
	const paths = {
		kilde: 'tpsf.fullmakt.kilde',
		omraader: 'tpsf.fullmakt.omraader',
		gyldigFom: 'tpsf.fullmakt.gyldigFom',
		gyldigTom: 'tpsf.fullmakt.gyldigTom',
		identType: 'tpsf.fullmakt.identType',
		harMellomnavn: 'tpsf.fullmakt.harMellomnavn'
	}

	return (
		<Vis attributt={Object.values(paths)} formik>
			<div className="flexbox--flex-wrap">
				<FormikTextInput name="tpsf.fullmakt.kilde" label="Kilde" size="xlarge" visHvisAvhuket />
				<FormikSelect
					name="tpsf.fullmakt.omraader"
					label="Områder"
					options={SelectOptionsOppslag.hentTemaOmraader()}
					size="xlarge"
					optionHeight={50}
					isMulti={true}
					isClearable={true}
					fastfield={false}
					visHvisAvhuket
				/>
				<FormikDatepicker name="tpsf.fullmakt.gyldigFom" label="Gyldig fra og med" visHvisAvhuket />
				<FormikDatepicker name="tpsf.fullmakt.gyldigTom" label="Gyldig til og med" visHvisAvhuket />
				<FormikSelect
					name="tpsf.fullmakt.identType"
					label="Fullmektig identtype"
					options={Options('identtype')}
					visHvisAvhuket
				/>
				<FormikSelect
					name="tpsf.fullmakt.harMellomnavn"
					label="Fullmektig har mellomnavn"
					options={Options('boolean')}
					visHvisAvhuket
				/>
			</div>
		</Vis>
	)
}
