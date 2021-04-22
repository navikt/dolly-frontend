import React from 'react'
import { AdresseKodeverk, PersoninformasjonKodeverk } from '~/config/kodeverk'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { Alder } from '~/components/fagsystem/tpsf/form/personinformasjon/partials/alder/Alder'
import { Diskresjonskoder } from '~/components/fagsystem/tpsf/form/personinformasjon/partials/diskresjonskoder/Diskresjonskoder'
import Formatters from '~/utils/DataFormatter'
import _get from 'lodash/get'
import { FormikProps } from 'formik'
import { FormikCheckbox } from '~/components/ui/form/inputs/checbox/Checkbox'

type Relasjon = {
	personRelasjonMed: {
		ident: string
	}
}

type Ident = {
	label: string
	lowercaseLabel: string
	value: string
}

type Foreldre = {
	formikBag: FormikProps<{
		tpsf: {
			relasjoner: {
				foreldre: Array<Relasjon>
			}
		}
	}>
	personFoerLeggTil: {}
}

const initialValues = {
	identtype: 'FNR',
	kjonn: '',
	foreldreType: '',
	sivilstander: [{ sivilstand: '', sivilstandRegdato: '' }],
	harFellesAdresse: true,
	alder: Formatters.randomIntInRange(65, 100),
	spesreg: '',
	utenFastBopel: false,
	statsborgerskap: '',
	statsborgerskapRegdato: '',
	statsborgerskapTildato: ''
}

export const Foreldre = ({ formikBag, personFoerLeggTil }: Foreldre) => {
	const handleIdenttypeChange = (path: string, ident: Ident) => {
		formikBag.setFieldValue(`${path}`, initialValues)
		formikBag.setFieldValue(`${path}.identtype`, ident.value)
	}

	return (
		// @ts-ignore
		<FormikDollyFieldArray
			name="tpsf.relasjoner.foreldre"
			header="Forelder"
			newEntry={initialValues}
			disabled={formikBag.values.tpsf?.relasjoner?.foreldre?.length === 2}
		>
			{(path: string, idx: number) => {
				const eksisterendeForelder = _get(formikBag.values, `${path}.ident`)
				const aktuellRelasjon =
					personFoerLeggTil &&
					eksisterendeForelder &&
					_get(personFoerLeggTil, 'tpsf.relasjoner').filter(
						(relasjon: Relasjon) => relasjon.personRelasjonMed.ident === eksisterendeForelder
					)
				const fornavn = aktuellRelasjon && aktuellRelasjon[0]?.personRelasjonMed?.fornavn
				const etternavn = aktuellRelasjon && aktuellRelasjon[0]?.personRelasjonMed?.etternavn

				return !eksisterendeForelder ? (
					<React.Fragment key={idx}>
						<FormikSelect
							name={`${path}.identtype`}
							label="Identtype"
							options={Options('identtype')}
							onChange={(ident: Ident) => handleIdenttypeChange(path, ident)}
							isClearable={false}
						/>
						<FormikSelect
							name={`${path}.kjonn`}
							label="Kjønn"
							kodeverk={PersoninformasjonKodeverk.Kjoennstyper}
						/>
						<FormikCheckbox
							name={`${path}.harFellesAdresse`}
							label="Har felles adresse"
							checkboxMargin
						/>
						<FormikSelect
							name={`${path}.foreldreType`}
							label="ForeldreType"
							options={Options('foreldreType')}
							isClearable={false}
						/>
						<FormikSelect
							name={`${path}.statsborgerskap`}
							label="Statsborgerskap"
							kodeverk={AdresseKodeverk.StatsborgerskapLand}
						/>
						<FormikDatepicker name={`${path}.statsborgerskapRegdato`} label="Statsborgerskap fra" />
						<FormikDatepicker name={`${path}.statsborgerskapTildato`} label="Statsborgerskap til" />
						<Diskresjonskoder basePath={path} formikBag={formikBag} />
						<Alder basePath={path} formikBag={formikBag} title="Alder" handleDoed={null} />
					</React.Fragment>
				) : (
					<>
						<h4>
							{fornavn} {etternavn} ({eksisterendeForelder})
						</h4>
						<div className="alder-component">
							<FormikDatepicker name={`${path}.doedsdato`} label="Dødsdato" />
						</div>
					</>
				)
			}}
		</FormikDollyFieldArray>
	)
}
