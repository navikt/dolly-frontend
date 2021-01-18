import React, { useState } from 'react'
import { FormikProps } from 'formik'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { InntektstubVirksomhetToggle } from './inntektstubVirksomhetToggle'
import InntektsinformasjonLister from './inntektsinformasjonLister/inntektsinformasjonLister'
import InntektsendringForm from './inntektsendringForm'
import ReactDatepicker from 'react-datepicker'
import { Label } from '~/components/ui/form/inputs/label/Label'

interface InntektsinformasjonForm {
	path: string
	formikBag: FormikProps<{}>
}

export default ({ path, formikBag }: InntektsinformasjonForm) => {
	const [date, setDate] = useState(null)

	const handleDateChange = (selectedDate: Date) => {
		setDate(selectedDate)
		formikBag.setFieldValue(`${path}.sisteAarMaaned`, selectedDate.toISOString().substr(0, 7))
	}

	return (
		<div key={path}>
			<div className="flexbox--flex-wrap">
				<Label name={'År/måned'} label={'År/måned'}>
					<ReactDatepicker
						locale="nb"
						dateFormat="yyyy-MM"
						selected={date}
						onChange={handleDateChange}
						placeholderText={'yyyy-MM'}
						showMonthYearPicker
						dropdownMode="select"
						autoComplete="off"
					/>
				</Label>
			</div>
			<FormikTextInput
				name={`${path}.antallMaaneder`}
				label="Generer antall måneder"
				type="number"
			/>
			<InntektstubVirksomhetToggle path={path} formikBag={formikBag} />
			<InntektsinformasjonLister formikBag={formikBag} path={path} />
			<InntektsendringForm formikBag={formikBag} path={path} />
		</div>
	)
}
