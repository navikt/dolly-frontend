import React from 'react'
import * as Yup from 'yup'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { panelError } from '~/components/ui/form/formUtils'
import { erForste } from '~/components/ui/form/formUtils'
import Panel from '~/components/ui/panel/Panel'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { requiredDate, requiredString, requiredNumber, messages } from '~/utils/YupValidations'
import InntektsmeldingOrgnummerSelect from './partials/inntektsmeldingOrgnummerSelect'

const initialValues = {
	arbeidsgiver: {
		virksomhetsnummer: ''
	},
	arbeidsforhold: {
		beregnetInntekt: {
			beloep: ''
		}
	},
	avsendersystem: {
		innsendingstidspunkt: new Date()
	}
}
const inntektsmeldingAttributt = 'inntektsmelding'
const informasjonstekst = 'Personen må ha et arbeidsforhold knyttet til den valgte virksomheten.'

export const InntektsmeldingForm = ({ formikBag }) => {
	return (
		<Vis attributt={inntektsmeldingAttributt}>
			<Panel
				heading="Inntektsmelding (fra Altinn)"
				hasErrors={panelError(formikBag, inntektsmeldingAttributt)}
				iconType="inntektsmelding"
				informasjonstekst={informasjonstekst}
				startOpen={() => erForste(formikBag.values, [inntektsmeldingAttributt])}
			>
				<FormikDollyFieldArray
					name="inntektsmelding.inntekter"
					header="Inntekt"
					newEntry={initialValues}
				>
					{(path, idx) => (
						<>
							<FormikTextInput
								name={`${path}.arbeidsforhold.beregnetInntekt.beloep`}
								label="Beløp"
								type="number"
							/>
							<FormikDatepicker
								name={`${path}.avsendersystem.innsendingstidspunkt`}
								label="Innsendingstidspunkt"
								type="month"
							/>
							<InntektsmeldingOrgnummerSelect path={`${path}.arbeidsgiver`} formikBag={formikBag} />
						</>
					)}
				</FormikDollyFieldArray>
			</Panel>
		</Vis>
	)
}

InntektsmeldingForm.validation = {
	inntektsmelding: Yup.object({
		inntekter: Yup.array().of(
			Yup.object({
				arbeidsgiver: Yup.object({
					virksomhetsnummer: requiredString
				}),
				arbeidsforhold: Yup.object({
					beregnetInntekt: Yup.object({
						beloep: requiredNumber.typeError(messages.required)
					})
				}),
				avsendersystem: Yup.object({
					innsendingstidspunkt: requiredDate
				})
			})
		)
	})
}
