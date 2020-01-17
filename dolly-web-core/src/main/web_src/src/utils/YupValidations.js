import * as Yup from 'yup'
import _isUndefined from 'lodash/isUndefined'
import { yupToFormErrors } from 'formik'
import { isDate } from 'date-fns'

/*
For custom validation der vi kan bruke f.eks. context.
*/
export const validate = async (values, schema) => {
	if (!schema) return
	try {
		await schema.validate(values, { abortEarly: false, context: values })
		return {}
	} catch (err) {
		if (err.name === 'ValidationError') {
			return yupToFormErrors(err)
		} else {
			console.info('Validation error')
			throw err
		}
	}
}

/**
 * Valideringsmeldinger
 */
export const messages = {
	required: 'Feltet er påkrevd'
}

export const requiredDate = Yup.mixed().test('reqDate', messages.required, value => isDate(value))
export const requiredString = Yup.string().required(messages.required)
export const requiredBoolean = Yup.boolean().required(messages.required)
export const requiredNumber = Yup.number().required(messages.required)

export const ifPresent = (key, schema) =>
	Yup.mixed().when(key, {
		is: v => !_isUndefined(v),
		then: schema,
		otherwise: Yup.mixed().notRequired()
	})

export const ifKeyHasValue = (key, values, schema) =>
	Yup.mixed().when(key, {
		is: v => values.includes(v),
		then: schema,
		otherwise: Yup.mixed().notRequired()
	})
