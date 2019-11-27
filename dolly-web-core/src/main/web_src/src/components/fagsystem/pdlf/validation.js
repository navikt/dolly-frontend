import * as Yup from 'yup'
import { requiredString, requiredDate, ifKeyHasValue } from '~/utils/YupValidations'

const personnavnSchema = Yup.object({
	fornavn: requiredString,
	etternavn: requiredString
})

export const validation = {
	pdlforvalter: Yup.object({
		falskIdentitet: Yup.object({
			rettIdentitet: Yup.object({
				identitetType: requiredString,
				rettIdentitetVedIdentifikasjonsnummer: Yup.string().when('identitetType', {
					is: 'ENTYDIG',
					then: requiredString
				}),
				personnavn: ifKeyHasValue(
					'$pdlforvalter.falskIdentitet.rettIdentitet.identitetType',
					['OMTRENTLIG'],
					personnavnSchema
				),
				foedselsdato: Yup.string().when('identitetType', {
					is: 'OMTRENTLIG',
					then: requiredDate
				}),
				kjoenn: Yup.string().when('identitetType', {
					is: 'OMTRENTLIG',
					then: requiredString
				}),
				statsborgerskap: Yup.string().when('identitetType', {
					is: 'OMTRENTLIG',
					then: requiredString
				})
			})
		}),
		utenlandskIdentifikasjonsnummer: Yup.array().of(
			Yup.object({
				identifikasjonsnummer: requiredString,
				kilde: requiredString,
				opphoert: requiredString,
				utstederland: requiredString
			})
		),
		kontaktinformasjonForDoedsbo: Yup.object({
			adressat: Yup.object({
				adressatType: requiredString,
				kontaktperson: ifKeyHasValue(
					'$pdlforvalter.kontaktinformasjonForDoedsbo.adressat.adressatType',
					['ADVOKAT', 'ORGANISASJON'],
					personnavnSchema
				),
				organisasjonsnavn: Yup.string().when('adressatType', {
					is: 'ORGANISASJON',
					then: requiredString
				}),
				organisasjonsnummer: Yup.string().when('adressatType', {
					is: 'ADVOKAT' || 'ORGANISASJON',
					then: Yup.string().matches(/^[0-9]{9}$/, {
						message: 'Organisasjonsnummeret må være et tall med 9 sifre',
						excludeEmptyString: true
					})
				}),
				idnummer: Yup.string().when('adressatType', {
					is: 'PERSON_MEDID',
					then: requiredString.matches(/^[0-9]{11}$/, {
						message: 'Id-nummeret må være et tall med 11 sifre',
						excludeEmptyString: true
					})
				}),
				navn: ifKeyHasValue(
					'$pdlforvalter.kontaktinformasjonForDoedsbo.adressat.adressatType',
					['PERSON_UTENID'],
					personnavnSchema
				)
			}),
			adresselinje1: requiredString,
			adresselinje2: Yup.string(),
			postnummer: requiredString,
			poststed: requiredString,
			landkode: requiredString,
			skifteform: requiredString,
			utstedtDato: requiredDate
		})
	})
}
