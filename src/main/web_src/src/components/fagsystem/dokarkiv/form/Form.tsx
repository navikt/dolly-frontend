import React, { useState } from 'react'
import * as Yup from 'yup'
import { ifPresent, requiredString } from '~/utils/YupValidations'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import Panel from '~/components/ui/panel/Panel'
import { erForste, panelError } from '~/components/ui/form/formUtils'
import { FormikProps } from 'formik'
import FileUpload from 'filopplasting'

interface DokarkivForm {
	formikBag: FormikProps<{}>
}

type Skjema = {
	data: string
	label: string
	lowercaseLabel: string
	value: string
}

enum Kodeverk {
	TEMA = 'Tema',
	NAVSKJEMA = 'NAVSkjema'
}

const dokarkivAttributt = 'dokarkiv'

export const DokarkivForm = ({ formikBag }: DokarkivForm) => {
	const handleSkjemaChange = (skjema: Skjema) => {
		formikBag.setFieldValue('dokarkiv.tittel', skjema.data)
		formikBag.setFieldValue('dokarkiv.dokumenter[0].tittel', skjema.data)
		console.log(imageValue) // TODO: slett meg!
	}
	const [imageValue, setImageValue] = useState()
	return (
		// @ts-ignore
		<Vis attributt={dokarkivAttributt}>
			<Panel
				heading="Dokumenter"
				hasErrors={panelError(formikBag, dokarkivAttributt)}
				iconType="dokarkiv"
				// @ts-ignore
				startOpen={() => erForste(formikBag.values, [dokarkivAttributt])}
			>
				<Kategori title="Oppretting av skannet dokument" vis={dokarkivAttributt}>
					<div className="flexbox--full-width">
						<FormikSelect
							name="dokarkiv.dokumenter[0].brevkode"
							label="Skjema"
							afterChange={handleSkjemaChange}
							kodeverk={Kodeverk.NAVSKJEMA}
							size="grow"
							optionHeight={50}
							isClearable={false}
						/>
					</div>
					<FormikSelect
						name="dokarkiv.tema"
						label="Tema"
						kodeverk={Kodeverk.TEMA}
						size="xlarge"
						isClearable={false}
					/>
					<FormikTextInput name="dokarkiv.journalfoerendeEnhet" label="Journalførende enhet" />
					<FileUpload
						className={'flexbox--full-width'}
						// onFilesChanged={files => {
						// 	console.log(files)
						// }}
					/>
				</Kategori>
			</Panel>
		</Vis>
	)
}

DokarkivForm.validation = {
	dokarkiv: ifPresent(
		'$dokarkiv',
		Yup.object({
			tittel: requiredString,
			tema: requiredString,
			journalfoerendeEnhet: Yup.string(),
			dokumenter: Yup.array().of(
				Yup.object({
					tittel: requiredString,
					brevkode: requiredString
				})
			)
		})
	)
}
