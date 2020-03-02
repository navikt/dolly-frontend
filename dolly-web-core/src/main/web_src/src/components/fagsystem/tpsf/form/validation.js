import * as Yup from 'yup'
import _get from 'lodash/get'
import { isAfter, addDays } from 'date-fns'
import Dataformatter from '~/utils/DataFormatter'
import { requiredString, ifPresent, ifKeyHasValue, messages } from '~/utils/YupValidations'

const boadresse = Yup.object({
	gateadresse: ifKeyHasValue(
		'$tpsf.boadresse.adressetype',
		['GATE'],
		ifKeyHasValue(
			'$tpsf.adresseNrInfo',
			[null],
			Yup.string().required(
				'Bruk adressevelgeren over for å hente gyldige adresser og velge et av forslagene'
			)
		)
	),
	gardsnr: Yup.string().when('adressetype', {
		is: 'MATR',
		then: Yup.string()
			.required(messages.required)
			.max(5, 'Gårdsnummeret må være under 99999')
	}),
	bruksnr: Yup.string().when('adressetype', {
		is: 'MATR',
		then: Yup.string()
			.required(messages.required)
			.max(4, 'Bruksnummeret må være under 9999')
	}),
	festnr: Yup.string().max(4, 'Festenummer må være under 9999'),
	undernr: Yup.string().max(3, 'Undernummer må være under 999'),
	postnr: Yup.string().when('adressetype', { is: 'MATR', then: requiredString }),
	kommunenr: Yup.string()
		.when('adressetype', { is: 'MATR', then: requiredString })
		.nullable()
})

const adresseNrInfo = Yup.object({
	nummer: Yup.string().when('nummertype', {
		is: v => v,
		then: requiredString
	})
}).nullable()

export const sivilstander = Yup.array().of(
	Yup.object({
		sivilstand: Yup.string().required(messages.required),
		sivilstandRegdato: Yup.string()
			.test(
				'is-after-last',
				'Dato må være etter tidligere forhold (eldste forhold settes først)',
				function validDate(dato) {
					if (!dato) return true
					const values = this.options.context
					const path = this.options.path

					// Finn index av current partner og sivilstand
					// Ex path: tpsf.relasjoner.partnere[0].sivilstander[0].sivilstandRegdato
					const partnerIdx = parseInt(path.match(/partnere\[(.*?)\].sivilstander/i)[1])
					const sivilstandIdx = parseInt(path.match(/sivilstander\[(.*?)\].sivilstandRegdato/i)[1])

					// Da vi skal validere mot "forrige forhold" trenger vi ikke sjekke første
					if (partnerIdx === 0 && sivilstandIdx === 0) return true

					const getSivilstandRegdato = (pIdx, sIdx) =>
						_get(
							values.tpsf.relasjoner.partnere,
							`[${pIdx}].sivilstander[${sIdx}].sivilstandRegdato`
						)

					let prevDato
					if (sivilstandIdx > 0) {
						prevDato = getSivilstandRegdato(partnerIdx, sivilstandIdx - 1)
					} else {
						const prevPartnerSivilstandArr = _get(
							values.tpsf.relasjoner.partnere,
							`[${partnerIdx - 1}].sivilstander`
						)
						prevDato = getSivilstandRegdato(partnerIdx - 1, prevPartnerSivilstandArr.length - 1)
					}

					// Selve testen
					const dateValid = isAfter(new Date(dato), addDays(new Date(prevDato), 2))
					return (
						dateValid ||
						this.createError({
							message: `Dato må være etter tidligere forhold (${Dataformatter.formatDate(
								prevDato
							)}) og det må minst være 2 dager i mellom`,
							path: path
						})
					)
				}
			)
			.required(messages.required)
	})
)

const partnere = Yup.array()
	.of(
		Yup.object({
			identtype: Yup.string(),
			kjonn: Yup.string().nullable(),
			alder: Yup.number()
				.transform(num => (isNaN(num) ? undefined : num))
				.min(1, 'Alder må være høyere enn 0')
				.max(120, 'Alder kan ikke være høyere enn ${max}'),
			foedtEtter: Yup.date().nullable(),
			foedtFoer: Yup.date().nullable(),
			spesreg: Yup.string()
				.when('utenFastBopel', {
					is: true,
					then: Yup.string().test(
						'is-not-kode6',
						'Kan ikke være "Kode 6" når "Uten fast bopel" er valgt.',
						value => value !== 'SPSF'
					)
				})
				.nullable(),
			utenFastBopel: Yup.boolean(),
			boadresse: Yup.object({
				kommunenr: Yup.string().nullable()
			}),
			sivilstander: ifPresent('$tpsf.relasjoner.partnere[0].sivilstander', sivilstander),
			harFellesAdresse: Yup.boolean()
		})
	)
	.nullable()

const barn = Yup.array()
	.of(
		Yup.object({
			identtype: Yup.string(),
			kjonn: Yup.string().nullable(),
			barnType: requiredString,
			partnerNr: Yup.number().nullable(),
			borHos: requiredString,
			erAdoptert: Yup.boolean(),
			alder: Yup.number()
				.transform(num => (isNaN(num) ? undefined : num))
				.min(1, 'Alder må være høyere enn 0')
				.max(120, 'Alder kan ikke være høyere enn ${max}'),
			spesreg: Yup.string()
				.when('utenFastBopel', {
					is: true,
					then: Yup.string().test(
						'is-not-kode6',
						'Kan ikke være "Kode 6" når "Uten fast bopel" er valgt.',
						value => value !== 'SPSF'
					)
				})
				.nullable(),
			utenFastBopel: Yup.boolean(),
			boadresse: Yup.object({
				kommunenr: Yup.string().nullable()
			})
		})
	)
	.nullable()

export const validation = {
	tpsf: ifPresent(
		'$tpsf',
		Yup.object({
			alder: Yup.number()
				.min(1, 'Alder må være høyere enn 0')
				.max(120, 'Alder kan ikke være høyere enn ${max}')
				.typeError(messages.required),
			foedtEtter: Yup.date().nullable(),
			foedtFoer: Yup.date().nullable(),
			doedsdato: Yup.date().nullable(),
			kjonn: ifPresent('$tpsf.kjonn', requiredString),
			statsborgerskap: ifPresent('$tpsf.statsborgerskap', requiredString),
			statsborgerskapRegdato: Yup.date().nullable(),
			innvandretFraLand: ifPresent('$tpsf.innvandretFraLand', requiredString),
			innvandretFraLandFlyttedato: Yup.date().nullable(),
			utvandretTilLand: ifPresent('$tpsf.utvandretTilLand', requiredString),
			utvandretTilLandFlyttedato: Yup.date().nullable(),
			sprakKode: ifPresent('$tpsf.sprakKode', requiredString),
			spesreg: ifPresent(
				'$tpsf.spesreg',
				Yup.string().when('utenFastBopel', {
					is: true,
					then: Yup.string().test(
						'is-not-kode6',
						'Kan ikke være "Kode 6" når "Uten fast bopel" er valgt.',
						value => value !== 'SPSF'
					)
				})
			).nullable(),
			boadresse: ifPresent('$tpsf.boadresse', boadresse),
			adresseNrInfo: ifPresent('$tpsf.adresseNrInfo', adresseNrInfo),
			postadresse: Yup.array().of(
				Yup.object({
					postLinje3: Yup.string().when('postLand', {
						is: 'NOR',
						then: requiredString
					}),
					postLand: requiredString
				})
			),
			relasjoner: Yup.object({
				partnere: ifPresent('$tpsf.relasjoner.partnere', partnere),
				barn: ifPresent('$tpsf.relasjoner.barn', barn)
			})
		})
	)
}
