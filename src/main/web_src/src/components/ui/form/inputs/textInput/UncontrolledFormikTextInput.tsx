import _get from 'lodash/get'
import { fieldError } from '~/components/ui/form/formUtils'
import React from 'react'
import { DollyTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { useFormikContext } from 'formik'

type Props = {
	name: string
}

export default ({ name, ...props }: Props) => {
	const { errors, touched, setFieldTouched, setFieldValue } = useFormikContext()
	return (
		<DollyTextInput
			onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
				if (!_get(touched, name)) {
					setFieldTouched(name, true)
				}
				if (_get(touched, name) !== event.target.value) {
					setFieldValue(name, event.target.value, true)
				}
			}}
			name={name}
			feil={fieldError({
				touched: _get(touched, name),
				error: _get(errors, name)
			})}
			{...props}
		/>
	)
}
