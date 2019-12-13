import React from 'react'
import ReactDatepicker, { registerLocale } from 'react-datepicker'
import { useField } from 'formik'
import { subYears, addYears } from 'date-fns'
import locale_nb from 'date-fns/locale/nb'
import { TextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { Label } from '~/components/ui/form/inputs/label/Label'
import { InputWrapper } from '~/components/ui/form/inputWrapper/InputWrapper'
import { Vis } from '~/components/bestillingsveileder/VisAttributt'
import { fieldError, SyntEvent } from '~/components/ui/form/formUtils'
registerLocale('nb', locale_nb)

import 'react-datepicker/dist/react-datepicker.css'
import './Datepicker.less'

export const Datepicker = ({
	name,
	value,
	placeholder = 'Ikke spesifisert',
	onChange,
	onBlur,
	disabled = false,
	feil
}) => {
	return (
		<ReactDatepicker
			locale="nb"
			dateFormat="dd.MM.yyyy"
			placeholderText={placeholder}
			selected={(value && new Date(value)) || null}
			onChange={onChange}
			showMonthDropdown
			showYearDropdown
			minDate={subYears(new Date(), 100)}
			maxDate={addYears(new Date(), 5)}
			dropdownMode="select"
			disabled={disabled}
			onBlur={onBlur}
			name={name}
			id={name}
			autoComplete="off"
			customInput={<TextInput icon="calendar" feil={feil} />}
		/>
	)
}

export const DollyDatepicker = props => (
	<InputWrapper {...props}>
		<Label name={props.name} label={props.label} feil={props.feil}>
			<Datepicker {...props} />
		</Label>
	</InputWrapper>
)

const P_FormikDatepicker = props => {
	const [field, meta] = useField(props)

	const handleChange = date => field.onChange(SyntEvent(field.name, date))
	const handleBlur = () => field.onBlur(SyntEvent(field.name, field.value))

	return (
		<DollyDatepicker
			value={field.value}
			onChange={handleChange}
			onBlur={handleBlur}
			feil={fieldError(meta)}
			{...props}
		/>
	)
}

export const FormikDatepicker = ({ visHvisAvhuket = true, ...props }) => {
	const component = <P_FormikDatepicker {...props} />
	return visHvisAvhuket ? <Vis attributt={props.name}>{component}</Vis> : component
}
