import { AttributtGruppe, AttributtGruppeHovedKategori, Attributt } from './Types'
import * as yup from 'yup'
import { FormikValues } from 'formik'
import AttributtListe from './Attributter'
import { groupList, groupListByHovedKategori } from './GroupList'
import _set from 'lodash/set'
import _get from 'lodash/get'

export default class AttributtManager {
	listSelected(selectedIds: string[]): Attributt[] {
		return AttributtListe.filter(f => selectedIds.includes(f.id))
	}

	searchList(list: Attributt[], searchTerm: string): Attributt[] {
		return searchTerm
			? list.filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase()))
			: list
	}

	listAllByGroup(searchTerm: string): AttributtGruppe[] {
		const list = this.searchList(AttributtListe, searchTerm)
		return groupList(list)
	}

	listSelectedByGroup(selectedIds: string[], searchTerm: string): AttributtGruppe[] {
		let list = this.searchList(AttributtListe, searchTerm)
		if (selectedIds.length > 0) list = list.filter(f => selectedIds.includes(f.id))
		return groupList(list)
	}

	listSelectedByHovedKategori(selectedIds: string[]): AttributtGruppeHovedKategori[] {
		return groupListByHovedKategori(this.listSelected(selectedIds))
	}

	listEditable(): AttributtGruppe[] {
		return groupList(AttributtListe.filter(attr => attr.kanRedigeres))
	}

	getInitialValuesForEditableItems(values: Object): Object {
		const editableAttributes = AttributtListe.filter(attr => attr.kanRedigeres)

		return editableAttributes.reduce((prev, item) => {
			return _set(prev, item.id, _get(values, item.id))
		}, {})
	}

	getValidations(selectedIds: string[]): yup.MixedSchema {
		// Get all selected attributes that has validations
		const list = this.listSelected(selectedIds).filter(s => s.validation)

		// Reduce to item.id and validation to create a validation object
		const validationObject = list.reduce((prev, currentObject) => {
			if (currentObject.inputType === 'multifield') {
				const nestedValidation = currentObject.items.reduce((prevNestedItem, nestedItem) => {
					if (nestedItem.validation)
						return _set(prevNestedItem, nestedItem.id.split('.')[1], nestedItem.validation)

					return prevNestedItem
				}, {})

				return { ...prev, [currentObject.id]: yup.object(nestedValidation) }
			}
			return {
				...prev,
				[currentObject.id]: currentObject.validation
			}
		}, {})

		return yup.object(validationObject)
	}

	getInitialValues(selectedIds: string[], values: object): FormikValues {
		const list = this.listSelected(selectedIds)

		const setInitialValue = (currentObject, itemId) => {
			let initialValue = ''
			const fromState = _get(values, itemId)
			if (fromState) initialValue = fromState

			return _set(currentObject, itemId, initialValue)
		}

		// Setter alle id'er til default value empty string
		// Formik krever at form'et har initialValues
		return list.reduce((prev, item) => {
			if (item.inputType === 'multifield') {
				const nestedInitialValues = item.items.reduce((prevNestedItem, nestedItem) => {
					return setInitialValue(prevNestedItem, nestedItem.id)
				}, {})

				return {
					...prev,
					...nestedInitialValues
				}
			}

			return setInitialValue(prev, item.id)
		}, {})
	}
}
