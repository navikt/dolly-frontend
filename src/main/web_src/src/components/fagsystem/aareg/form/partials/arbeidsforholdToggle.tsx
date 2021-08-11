import React, { ReactElement, ReactFragment, useState } from 'react'
import _get from 'lodash/get'
import styled from 'styled-components'
import { ToggleGruppe, ToggleKnapp } from '~/components/ui/toggle/Toggle'
import { AmeldingForm } from './ameldingForm'
import { ArbeidsforholdForm } from './arbeidsforholdForm'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import {
	initialValues,
	initialAaregOrg,
	initialArbeidsforholdOrg,
	initialArbeidsforholdPers,
	initialAaregPers
} from '../initialValues'
import { ArbeidsgiverTyper } from '~/components/fagsystem/aareg/AaregTypes'
import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { FormikProps } from 'formik'
import { AaregListe } from '~/components/fagsystem/aareg/AaregTypes'

interface ArbeidsforholdToggle {
	formikBag: FormikProps<{ aareg: AaregListe }>
}

const ToggleArbeidsgiver = styled(ToggleGruppe)`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`

// Har hardkodet liste over felles Dolly-arbeidsgivere, fordi det tar for lang tid å hente ut fra API
const fellesOrg = [
	'972674818',
	'896929119',
	'839942907',
	'967170232',
	'805824352',
	'907670201',
	'947064649'
]

export const ArbeidsforholdToggle = ({ formikBag }: ArbeidsforholdToggle): ReactElement => {
	const getArbeidsgiverType =
		_get(formikBag.values, 'aareg[0].amelding') || _get(formikBag.values, 'aareg[0].arbeidsforhold')
			? ArbeidsgiverTyper.egen
			: _get(formikBag.values, 'aareg[0].arbeidsgiver.aktoertype') === 'PERS'
			? ArbeidsgiverTyper.privat
			: fellesOrg.some(org => org === _get(formikBag.values, 'aareg[0].arbeidsgiver.orgnummer'))
			? ArbeidsgiverTyper.felles
			: ArbeidsgiverTyper.fritekst

	const [typeArbeidsgiver, setTypeArbeidsgiver] = useState(getArbeidsgiverType)

	const toggleValues = [
		{
			value: ArbeidsgiverTyper.egen,
			label: 'Egen organisasjon'
		},
		{
			value: ArbeidsgiverTyper.felles,
			label: 'Felles organisasjoner'
		},
		{
			value: ArbeidsgiverTyper.fritekst,
			label: 'Skriv inn org.nr.'
		},
		{
			value: ArbeidsgiverTyper.privat,
			label: 'Privat arbeidsgiver'
		}
	]

	const handleToggleChange = (value: ArbeidsgiverTyper) => {
		setTypeArbeidsgiver(value)
		if (value === ArbeidsgiverTyper.privat) {
			formikBag.setFieldValue('aareg', [initialAaregPers])
		} else if (value === ArbeidsgiverTyper.felles || value === ArbeidsgiverTyper.fritekst) {
			formikBag.setFieldValue('aareg', [initialAaregOrg])
		} else if (value === ArbeidsgiverTyper.egen) {
			formikBag.setFieldValue('aareg', [initialValues])
		}
	}

	return (
		<div className="toggle--wrapper">
			<ToggleArbeidsgiver
				onChange={event => handleToggleChange(event.target.value)}
				name={'arbeidsforhold'}
			>
				{toggleValues.map(type => (
					<ToggleKnapp
						key={type.value}
						value={type.value}
						checked={type.value === typeArbeidsgiver}
					>
						{type.label}
					</ToggleKnapp>
				))}
			</ToggleArbeidsgiver>
			{typeArbeidsgiver === ArbeidsgiverTyper.egen ? (
				<AmeldingForm formikBag={formikBag} />
			) : (
				<>
					<AlertStripeInfo>
						For denne typen arbeidsgiver er det ikke mulig å registrere nye attributter som
						sluttårsak, ansettelsesform, endringsdato lønn og fartøy. For å bestille testbrukere med
						disse attributtene må du bruke egen organisasjon for å oppr ette A-meldinger.
					</AlertStripeInfo>
					<FormikDollyFieldArray
						name="aareg"
						header="Arbeidsforhold"
						newEntry={
							typeArbeidsgiver === ArbeidsgiverTyper.privat
								? initialArbeidsforholdPers
								: initialArbeidsforholdOrg
						}
						canBeEmpty={false}
					>
						{(path: string, idx: number) => (
							<ArbeidsforholdForm
								path={path}
								key={idx}
								arbeidsforholdIndex={idx}
								formikBag={formikBag}
								erLenket={null}
								arbeidsgiverType={typeArbeidsgiver}
							/>
						)}
					</FormikDollyFieldArray>
				</>
			)}
		</div>
	)
}
