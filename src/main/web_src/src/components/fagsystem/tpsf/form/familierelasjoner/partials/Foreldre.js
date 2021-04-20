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

const initialValues = {
	identtype: 'FNR',
	kjonn: '',
	foreldreType: '',
	harFellesAdresse: false,
	alder: Formatters.randomIntInRange(50, 80),
	doedsdato: null,
	spesreg: '',
	utenFastBopel: false,
	statsborgerskap: '',
	statsborgerskapRegdato: '',
	statsborgerskapTildato: ''
}

export const Foreldre = ({ formikBag, personFoerLeggTil }) => {
	const handleIdenttypeChange = (path, ident) => {
		formikBag.setFieldValue(`${path}`, initialValues)
		formikBag.setFieldValue(`${path}.identtype`, ident.value)
	}

	const handleFoedselsdatoChange = (path, dato) => {
		formikBag.setFieldValue(`${path}.foedselsdato`, dato)
		formikBag.setFieldValue(`${path}.doedsdato`, dato)
		formikBag.setFieldValue(`${path}.foedtEtter`, dato)
		formikBag.setFieldValue(`${path}.foedtFoer`, dato)
	}

	return (
		<FormikDollyFieldArray
			name="tpsf.relasjoner.foreldre"
			header="Foreldre"
			newEntry={initialValues}
		>
			{(path, idx) => {
				const eksisterendeForelder = _get(formikBag.values, `${path}.ident`)
				const aktuellRelasjon =
					personFoerLeggTil &&
					eksisterendeForelder &&
					_get(personFoerLeggTil, 'tpsf.relasjoner').filter(
						relasjon => relasjon.personRelasjonMed.ident === eksisterendeForelder
					)
				const fornavn = aktuellRelasjon && aktuellRelasjon[0].personRelasjonMed.fornavn
				const etternavn = aktuellRelasjon && aktuellRelasjon[0].personRelasjonMed.etternavn

				return !eksisterendeForelder ? (
					<React.Fragment key={idx}>
						<FormikSelect
							name={`${path}.identtype`}
							label="Identtype"
							options={Options('identtype')}
							onChange={ident => handleIdenttypeChange(path, ident)}
							isClearable={false}
						/>
						<FormikSelect
							name={`${path}.kjonn`}
							label="Kjønn"
							kodeverk={PersoninformasjonKodeverk.Kjoennstyper}
						/>
						<FormikSelect
							name={`${path}.foreldreType`}
							label="Foreldre"
							options={Options('barnType')}
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
						<Alder basePath={path} formikBag={formikBag} title="Alder" />
						<FormikDatepicker
							name={`${path}.foedselsdato`}
							label="Dato født"
							onChange={dato => handleFoedselsdatoChange(path, dato)}
						/>
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
