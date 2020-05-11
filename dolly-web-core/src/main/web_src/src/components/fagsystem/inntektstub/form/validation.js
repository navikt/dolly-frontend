import * as Yup from 'yup'
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import { areIntervalsOverlapping, subMonths, addDays } from 'date-fns'
import { requiredDate, requiredString, requiredNumber, messages } from '~/utils/YupValidations'

const unikOrgMndTest = validation => {
	const errorMsg = 'Kombinasjonen av år, måned og virksomhet er ikke unik'
	return validation.test('unikhet', errorMsg, function isUniqueCombination(orgnr) {
		if (!orgnr) return true

		const values = this.options.context
		const path = this.options.path
		console.log('this.options :>> ', this.options)
		const currInntektsinformasjonPath = path.split('.', 2).join('.')
		const inntektsinformasjonPath = currInntektsinformasjonPath.split('[')[0]

		const alleInntekter = _get(values, inntektsinformasjonPath)
		const currInntektsinformasjon = _get(values, currInntektsinformasjonPath)
		if (!currInntektsinformasjon.sisteAarMaaned) return true

		if (tidligereInntekterOverlapperMedNy(values.personFoerLeggTil, currInntektsinformasjon)) {
			return this.createError({
				message: `Det finnes allerede inntekter for denne organisasjonen i dette tidsrommet fra en tidligere bestilling.`,
				path: this.options.path
			})
		}
		return !nyeInntekterOverlapper(alleInntekter, currInntektsinformasjon)
	})
}

const nyeInntekterOverlapper = (alleInntekter, currInntektsinformasjon) => {
	const virksomheter = alleInntekter.map(inntektinfo => inntektinfo.virksomhet)
	const maaneder = alleInntekter.map(inntektinfo => ({
		sisteAarMaaned: inntektinfo.sisteAarMaaned,
		antallMaaneder: inntektinfo.antallMaaneder
	}))

	const likeOrgnrIndex = indexOfLikeOrgnr(virksomheter, currInntektsinformasjon.virksomhet)
	//Hvis ingen orgnr er like trenger vi ikke sjekke datoer. Hvis orgnr er like -> finn måneder
	if (likeOrgnrIndex.length < 2) return false

	const tidsrom = finnTidsrom(maaneder)
	return finnesOverlappendeDato(tidsrom, likeOrgnrIndex)
}

const tidligereInntekterOverlapperMedNy = (personFoerLeggTil, currInntektsinformasjon) => {
	const tidligereInntekter = _get(personFoerLeggTil, 'inntektstub')
	if (!tidligereInntekter) return false

	const likeVirksomheter = tidligereInntekter.filter(
		inntekt => inntekt.virksomhet === currInntektsinformasjon.virksomhet
	)

	return likeVirksomheter.some(inntekt => {
		const tidligereDato = dato(inntekt.aarMaaned)
		return areIntervalsOverlapping(
			{ start: tidligereDato, end: addDays(tidligereDato, 1) },
			getInterval(currInntektsinformasjon)
		)
	})
}

const indexOfLikeOrgnr = (virksomheter, orgnr) => {
	const index = []
	virksomheter.forEach((virksomhet, idx) => virksomhet === orgnr && index.push(idx))
	return index
}

const dato = aarMaaned => {
	const year = aarMaaned.split('-')[0]
	const month = aarMaaned.split('-')[1]
	return new Date(year, month - 1)
}

const finnTidsrom = maaneder => maaneder.map(maaned => getInterval(maaned))

const getInterval = inntektsinformasjon => {
	const currDato = dato(inntektsinformasjon.sisteAarMaaned)
	return inntektsinformasjon.antallMaaneder
		? {
				start: subMonths(currDato, inntektsinformasjon.antallMaaneder),
				end: currDato
		  }
		: {
				start: currDato,
				end: addDays(currDato, 1)
		  }
}

const finnesOverlappendeDato = (tidsrom, index) => {
	const tidsromSomIkkeKanOverlappe = index.map(idx => tidsrom[idx])
	const firstInterval = tidsromSomIkkeKanOverlappe[0]

	return tidsromSomIkkeKanOverlappe.some((tidsrom, idx) => {
		if (idx === 0) return //Tester mot første tidsrom
		return areIntervalsOverlapping(
			{ start: firstInterval.start, end: firstInterval.end },
			{ start: tidsrom.start, end: tidsrom.end }
		)
	})
}

const inntektsliste = Yup.array().of(
	Yup.object({
		beloep: requiredNumber.typeError(messages.required),
		startOpptjeningsperiode: Yup.string(),
		sluttOpptjeningsperiode: Yup.string()
	})
)

const fradragsliste = Yup.array().of(
	Yup.object({
		beloep: requiredNumber.typeError(messages.required),
		beskrivelse: requiredString
	})
)

const forskuddstrekksliste = Yup.array().of(
	Yup.object({
		beloep: requiredNumber.typeError(messages.required),
		beskrivelse: Yup.string()
	})
)

const arbeidsforholdsliste = Yup.array().of(
	Yup.object({
		arbeidsforholdstype: requiredString,
		startdato: Yup.mixed().when('sluttdato', {
			is: val => val !== undefined,
			then: requiredDate
		}),
		sluttdato: Yup.string().nullable(),
		antallTimerPerUkeSomEnFullStillingTilsvarer: Yup.number()
			.transform((i, j) => (j === '' ? null : i))
			.nullable(),
		avloenningstype: Yup.string().nullable(),
		yrke: Yup.string().nullable(),
		arbeidstidsordning: Yup.string().nullable(),
		stillingsprosent: Yup.number()
			.transform((i, j) => (j === '' ? null : i))
			.nullable(),
		sisteLoennsendringsdato: Yup.string().nullable(),
		sisteDatoForStillingsprosentendring: Yup.string().nullable()
	})
)

export const validation = {
	inntektstub: Yup.object({
		inntektsinformasjon: Yup.array().of(
			Yup.object({
				sisteAarMaaned: requiredString,
				antallMaaneder: Yup.number()
					.integer('Kan ikke være et desimaltall')
					.transform((i, j) => (j === '' ? null : i))
					.nullable(),
				virksomhet: unikOrgMndTest(requiredString.typeError(messages.required)),
				// virksomhet: requiredString.typeError(messages.required),
				opplysningspliktig: requiredString,
				inntektsliste: inntektsliste,
				fradragsliste: fradragsliste,
				forskuddstrekksliste: forskuddstrekksliste,
				arbeidsforholdsliste: arbeidsforholdsliste
			})
		)
	})
}
