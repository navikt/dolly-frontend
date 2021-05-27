import React, { useEffect } from 'react'
import * as Yup from 'yup'
import _get from 'lodash/get'
import { isAfter } from 'date-fns'
import { ifPresent, messages, requiredDate, requiredString } from '~/utils/YupValidations'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import Panel from '~/components/ui/panel/Panel'
import { erForste, panelError } from '~/components/ui/form/formUtils'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { MedServicebehov } from './partials/MedServicebehov'

const arenaAttributt = 'arenaforvalter'

export const ArenaForm = ({ formikBag }) => {
	const servicebehovAktiv =
		_get(formikBag, 'values.arenaforvalter.arenaBrukertype') === 'MED_SERVICEBEHOV'

	useEffect(() => {
		servicebehovAktiv && formikBag.setFieldValue('arenaforvalter.kvalifiseringsgruppe', null)
	}, [])

	return (
		<Vis attributt={arenaAttributt}>
			<Panel
				heading="Arbeidsytelser"
				hasErrors={panelError(formikBag, arenaAttributt)}
				iconType="arena"
				startOpen={() => erForste(formikBag.values, [arenaAttributt])}
			>
				{!servicebehovAktiv && (
					<FormikDatepicker
						name="arenaforvalter.inaktiveringDato"
						label="Inaktiv fra dato"
						disabled={servicebehovAktiv}
					/>
				)}
				{servicebehovAktiv && <MedServicebehov formikBag={formikBag} />}
			</Panel>
		</Vis>
	)
}

function tilDatoValidation(erDagpenger) {
	return Yup.string()
		.test('etter-fradato', 'Til-dato må være etter fra-dato', function validDate(tildato) {
			const values = this.options.context
			const fradato = erDagpenger
				? values.arenaforvalter.dagpenger[0].fraDato
				: values.arenaforvalter.aap[0].fraDato
			if (!fradato || !tildato) return true
			return isAfter(new Date(tildato), new Date(fradato))
		})
		.nullable()
}

function harGjeldendeVedtakValidation() {
	return Yup.string()
		.test('har-gjeldende-vedtak', 'To vedtak kan ikke overlappe hverandre', function validVedtak(
			tildato
		) {
			const values = this.options.context
			const dagpengerFra = values.arenaforvalter.dagpenger?.[0].fraDato
			const dagpengerTil = values.arenaforvalter.dagpenger?.[0].tilDato
			const aapFra = values.arenaforvalter.aap?.[0].fraDato
			const aap115Fra = values.arenaforvalter.aap115?.[0].fraDato
			const aap115Til = values.arenaforvalter.aap115?.[0].tilDato
			if ((!dagpengerFra && !aapFra) || (!dagpengerFra && !aap115Fra) || (!aapFra && !aap115Fra))
				return true
			return isBefore(new Date(tildato), new Date(fradato))
		})
		.nullable()
}

const validation = Yup.object({
	aap: Yup.array().of(
		Yup.object({
			fraDato: requiredDate,
			tilDato: tilDatoValidation(false)
		})
	),
	aap115: Yup.array().of(
		Yup.object({
			fraDato: requiredDate
		})
	),
	arenaBrukertype: requiredString,
	inaktiveringDato: Yup.mixed()
		.nullable()
		.when('arenaBrukertype', {
			is: 'UTEN_SERVICEBEHOV',
			then: requiredDate
		}),
	kvalifiseringsgruppe: Yup.string()
		.nullable()
		.when('arenaBrukertype', {
			is: 'MED_SERVICEBEHOV',
			then: requiredString
		}),
	dagpenger: Yup.array().of(
		Yup.object({
			rettighetKode: Yup.string().required(messages.required),
			fraDato: requiredDate,
			tilDato: tilDatoValidation(true),
			mottattDato: Yup.date().nullable()
		})
	)
})

ArenaForm.validation = {
	arenaforvalter: ifPresent('$arenaforvalter', validation)
}
