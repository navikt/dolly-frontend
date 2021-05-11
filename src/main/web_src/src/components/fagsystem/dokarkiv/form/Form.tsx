import React, { useEffect, useState } from 'react'
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
import { Label } from '~/components/ui/form/inputs/label/Label'
import { pdfjs } from 'react-pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface DokarkivForm {
	formikBag: FormikProps<{}>
}

type Skjema = {
	data: string
	label: string
	lowercaseLabel: string
	value: string
}

type Vedlegg = {
	id: string
	name: string
	content: {
		base64: string
	}
}

enum Kodeverk {
	TEMA = 'Tema',
	NAVSKJEMA = 'NAVSkjema'
}

const dokarkivAttributt = 'dokarkiv'

export const DokarkivForm = ({ formikBag }: DokarkivForm) => {
	const [files, setFiles] = useState([])
	const [skjemaValues, setSkjemaValues] = useState(null)

	useEffect(() => {
		handleSkjemaChange(skjemaValues)
	}, [files, skjemaValues])

	const handleSkjemaChange = (skjema: Skjema) => {
		if (!skjema) {
			return
		}
		setSkjemaValues(skjema)
		formikBag.setFieldValue('dokarkiv.tittel', skjema.data)
		formikBag.setFieldValue('dokarkiv.dokumenter[0].tittel', skjema.data)
		const dokumentVarianter = files.map((vedl, index) => ({
			tittel: (index === 0 && skjema.data) || vedl.name,
			brevkode: (index === 0 && skjema?.value) || undefined,
			dokumentvarianter: [
				{
					filtype: 'PDFA',
					fysiskDokument: vedl.content.base64,
					variantformat: 'ARKIV'
				}
			]
		}))
		dokumentVarianter.length > 0 &&
			formikBag.setFieldValue('dokarkiv.dokumenter', dokumentVarianter)
	}

	const handleVedleggChange = (filer: [Vedlegg]) => {
		setFiles(filer)
		// handleSkjemaChange(skjemaValues)
	}

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
					<Label
						label={'Vedlegg'}
						name={'Vedlegg'}
						containerClass={'flexbox--full-width'}
						feil={null}
					>
						<FileUpload
							className={'flexbox--full-width'}
							acceptedMimetypes={['application/pdf']}
							maxFiles={5}
							// @ts-ignore
							onFilesChanged={handleVedleggChange}
						/>
					</Label>
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
					brevkode: Yup.string()
				})
			)
		})
	)
}
