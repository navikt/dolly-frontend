import React from 'react'
import _get from 'lodash/get'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { initialPermittering } from '../initialValues'
import { FormikProps } from 'formik'

type Permittering = {
	path: string
	arbeidsforholdIndex: boolean
	formikBag: FormikProps<{}>
	erLenket: boolean
}

const infotekst = 'Start- og sluttdato må være innenfor perioden til arbeidsforholdet'

export const PermitteringForm = ({
	path,
	arbeidsforholdIndex,
	formikBag,
	erLenket
}: Permittering) => {
	const maaneder = _get(formikBag.values, 'aareg[0].amelding')
	const ameldingIndex = path.charAt(18)

	const handleNewEntry = () => {
		maaneder.forEach((maaned, idMaaned) => {
			if (!erLenket && idMaaned != ameldingIndex) return
			const currPermittering = _get(
				formikBag.values,
				`aareg[0].amelding[${idMaaned}].arbeidsforhold[${arbeidsforholdIndex}].permittering`
			)
			formikBag.setFieldValue(
				`aareg[0].amelding[${idMaaned}].arbeidsforhold[${arbeidsforholdIndex}].permittering`,
				currPermittering ? [...currPermittering, initialPermittering] : [initialPermittering]
			)
		})
	}

	const handleRemoveEntry = idPermittering => {
		maaneder.forEach((maaned, idMaaned) => {
			if (!erLenket && idMaaned != ameldingIndex) return
			const currPermittering = _get(
				formikBag.values,
				`aareg[0].amelding[${idMaaned}].arbeidsforhold[${arbeidsforholdIndex}].permittering`
			)
			currPermittering.splice(idPermittering, 1)
			formikBag.setFieldValue(
				`aareg[0].amelding[${idMaaned}].arbeidsforhold[${arbeidsforholdIndex}].permittering`,
				currPermittering
			)
		})
	}

	return (
		<FormikDollyFieldArray
			name={path}
			header="Permittering"
			hjelpetekst={infotekst}
			newEntry={initialPermittering}
			nested
			handleNewEntry={handleNewEntry}
			handleRemoveEntry={handleRemoveEntry}
		>
			{(path, idx) => (
				<React.Fragment key={idx}>
					<FormikDatepicker name={`${path}.permitteringsPeriode.fom`} label="Permittering fra" />
					<FormikDatepicker name={`${path}.permitteringsPeriode.tom`} label="Permittering til" />
					<FormikTextInput
						name={`${path}.permitteringsprosent`}
						label="Permitteringsprosent"
						type="number"
					/>
				</React.Fragment>
			)}
		</FormikDollyFieldArray>
	)
}
