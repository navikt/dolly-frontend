import React from 'react'
import Overskrift from '~/components/ui/overskrift/Overskrift'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
	TpsfForm,
	initialValues as tpsfInit,
	validation as tpsfValidation
} from '~/components/fagsystem/tpsf/form/Form'
import {
	KrrstubForm,
	initialValues as krrstubInit,
	validation as krrstubValidation
} from '~/components/fagsystem/krrstub/form/Form'
import {
	SigrunstubForm,
	initialValues as sigrunstubInit,
	validation as sigrunstubValidation
} from '~/components/fagsystem/sigrunstub/form/Form'
import DisplayFormikState from '~/utils/DisplayFormikState'

export const Steg2 = props => {
	const handleSubmit = () => {
		console.log('submit values')
	}

	const initialValues = Object.assign({}, { ...tpsfInit, ...krrstubInit, ...sigrunstubInit })

	const validationListe = Yup.object({
		...tpsfValidation,
		...krrstubValidation
		// ...sigrunstubValidation
	})

	return (
		<div>
			<Overskrift label="Velg verdier" />

			<Formik
				onSubmit={handleSubmit}
				initialValues={initialValues}
				validationSchema={validationListe}
			>
				{formikProps => (
					<div>
						<TpsfForm formikProps={formikProps} />
						<KrrstubForm formikProps={formikProps} />
						<SigrunstubForm formikProps={formikProps} />
						<DisplayFormikState {...formikProps} />
					</div>
				)}
			</Formik>
		</div>
	)
}
