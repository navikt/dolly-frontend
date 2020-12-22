import React from 'react'
import * as Yup from 'yup'
import { requiredString, ifPresent } from '~/utils/YupValidations'
import { Detaljer } from './Detaljer'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { organisasjonPaths, kontaktPaths, adressePaths } from './paths'
import Panel from '~/components/ui/panel/Panel'
import { erForste, panelError } from '~/components/ui/form/formUtils'

const detaljerPaths = [organisasjonPaths, kontaktPaths, adressePaths].flat()

export const OrganisasjonForm = ({ formikBag }) => {
	return (
		<>
			<Vis attributt={detaljerPaths}>
				<Panel
					heading="Detaljer"
					hasErrors={panelError(formikBag, detaljerPaths)}
					iconType={'personinformasjon'}
					startOpen={() => erForste(formikBag.values, detaljerPaths)}
				>
					<Detaljer formikBag={formikBag} path="organisasjoner" level={0} />
				</Panel>
			</Vis>
			{/* Flere kategorier legges inn her */}
		</>
	)
}

const adresse = Yup.object({
	adresselinje: Yup.array().of(Yup.string()),
	postnr: Yup.string()
		.when('landkode', {
			is: 'NOR',
			then: Yup.string().when('kommunenr', {
				is: val => val === '' || val === null,
				then: requiredString
			})
		})
		.nullable(),
	kommunenr: Yup.string()
		.when('landkode', {
			is: 'NOR',
			then: Yup.string().when('postnr', {
				is: val => val === '' || val === null,
				then: requiredString
			})
		})
		.nullable(),
	landkode: requiredString,
	poststed: Yup.string()
})

OrganisasjonForm.validation = {
	organisasjoner: ifPresent(
		'$organisasjoner',
		Yup.object({
			enhetstype: requiredString,
			naeringskode: ifPresent('$organisasjoner.naeringskode', requiredString),
			formaal: ifPresent('$organisasjoner.formaal', requiredString),
			telefon: ifPresent('$organisasjoner.telefon', requiredString),
			epost: ifPresent('$organisasjoner.epost', requiredString),
			nettadresse: ifPresent('$organisasjoner.nettadresse', requiredString),
			forretningsadresse: ifPresent('$organisasjoner.forretningsadresse', adresse),
			postadresse: ifPresent('$organisasjoner.postadresse', adresse)
		})
	)
}
