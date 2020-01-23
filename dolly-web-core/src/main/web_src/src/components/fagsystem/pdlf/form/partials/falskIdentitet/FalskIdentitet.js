import React from 'react'
import _get from 'lodash'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'

export const FalskIdentitet = ({ formikBag }) => {
	const falskIdPath = 'pdlforvalter.falskIdentitet.rettIdentitet'
	const falskIdObj = formikBag.values.pdlforvalter.falskIdentitet.rettIdentitet

	const settIdentitetType = e => {
		if (e.value === 'UKJENT') {
			formikBag.setFieldValue(falskIdPath, { identitetType: e.value, rettIdentitetErUkjent: true })
		} else if (e.value === 'ENTYDIG') {
			formikBag.setFieldValue(falskIdPath, {
				identitetType: e.value,
				rettIdentitetVedIdentifikasjonsnummer: ''
			})
		} else {
			formikBag.setFieldValue(falskIdPath, {
				identitetType: e.value,
				foedselsdato: '',
				kjoenn: '',
				personnavn: { fornavn: '', mellomnavn: '', etternavn: '' },
				statsborgerskap: ''
			})
		}
		return e.value
	}

	return (
		<div>
			<FormikSelect
				name={`${falskIdPath}.identitetType`}
				label="Opplysninger om rett identitet"
				options={Options('identitetType')}
				value={falskIdObj.identitetType}
				onChange={settIdentitetType}
				isClearable={false}
				size="medium"
			/>

			{falskIdObj.identitetType === 'ENTYDIG' && (
				<FormikTextInput
					name={`${falskIdPath}.rettIdentitetVedIdentifikasjonsnummer`}
					label="Identifikasjonsnummer"
					type="number"
				/>
			)}
			{falskIdObj.identitetType === 'OMTRENTLIG' && (
				<div>
					<FormikTextInput name={`${falskIdPath}.personnavn.fornavn`} label="Fornavn" />
					<FormikTextInput name={`${falskIdPath}.personnavn.mellomnavn`} label="Mellomnavn" />
					<FormikTextInput name={`${falskIdPath}.personnavn.etternavn`} label="Etternavn" />
					<FormikDatepicker name={`${falskIdPath}.foedselsdato`} label="Fødselsdato" />
					<FormikSelect
						name={`${falskIdPath}.kjoenn`}
						label="Kjønn"
						options={Options('kjoennFalskIdentitet')}
						isClearable={false}
					/>
					<FormikSelect
						name={`${falskIdPath}.statsborgerskap`}
						label="Statsborgerskap"
						kodeverk="Landkoder"
						isClearable={false}
						isMulti={true}
						size="large"
					/>
				</div>
			)}
		</div>
	)
}
