import { useFormikContext } from 'formik'
import _isNil from 'lodash/isNil'
import _has from 'lodash/has'
export { pathAttrs } from '~/service/attributter/Attributter'

export const Vis = ({ attributt, children }) => {
	const { initialValues } = useFormikContext()

	const isChecked = (initial, attributtPath) => {
		// Ignore if values ikke er satt
		if (_isNil(attributtPath)) return false

		// Strings er akseptert, men konverter til Array
		if (!_isNil(attributtPath) && !Array.isArray(attributtPath)) attributtPath = [attributtPath]

		return attributtPath.some(v => _has(initial, v))
	}

	return isChecked(initialValues, attributt) && children
}
