import {
	AttributtGruppe,
	AttributtGruppeHovedKategori,
	Attributt,
	Kategori,
	AttributtType
} from './Types'
import * as yup from 'yup'
import { FormikValues } from 'formik'
import AttributtListe from './Attributter'
import { groupList, groupListByHovedKategori } from './GroupList'
import DataFormatter from '~/utils/DataFormatter'
import DataSourceMapper from '~/utils/DataSourceMapper'
import BestillingMapper from '~/utils/BestillingMapper'
import _set from 'lodash/set'
import _get from 'lodash/get'
import _has from 'lodash/has'
import { isAttributtEditable, DependencyTree } from './AttributtHelpers'

export default class AttributtManager {
	// BASE FUNCTIONS
	listAllSelected(selectedIds: string[]): Attributt[] {
		console.log(
			'this.listAllSelectFilterItems(selectedIds, AttributtListe) :',
			this.listAllSelectFilterItems(selectedIds, AttributtListe)
		)
		return this.listAllSelectFilterItems(selectedIds, AttributtListe)
	}

	listAllSelectFilterItems(selectedIds: string[], attributter: Attributt[]): Attributt[] {
		// console.log('attributter :', attributter)
		// console.log('selectedIds :', selectedIds)
		// attributter.map(attr => {
		// 	console.log('attr :', attr)
		// })

		return attributter
			.filter(
				attr =>
					selectedIds.includes(attr.parent || attr.id) &&
					(!attr.includeIf || attr.includeIf.every(e => selectedIds.includes(e.id)))
				//  || attr.includeIf[0].id === 'utvandret'
			)
			.map(attr => {
				// TODO: Ikke bærekraftig løsning. Refactor
				// console.log('attr :', attr)
				if (attr.items) {
					if (
						attr.dataSource === 'SIGRUN' ||
						attr.dataSource === 'AAREG' ||
						attr.dataSource === 'KRR' ||
						attr.dataSource === 'PDLF' ||
						attr.dataSource === 'ARENA' ||
						(attr.dataSource === 'TPSF' && attr.id === 'utvandret') ||
						(attr.dataSource === 'TPSF' && attr.id === 'partner_utvandret') ||
						(attr.dataSource === 'TPSF' && attr.id === 'barn_utvandret')
					) {
						// console.log('attr items 1:', attr)
						return attr
					}
					// else if (attr.id === 'barn_utvandret' && attr.items[7].items){
					// 	// console.log('attr :', attr)
					// 	return Object.assign(Object.assign({}, attr), {
					// 		items: this.listAllSelectFilterItems(selectedIds, attr.items[7].items)
					// 	})
					// }
					// else if (attr.id === 'barn_utvandret') {
					// }
					else {
						// console.log('attr items 2:', attr)
						// console.log('Object.assign({}, attr) :', Object.assign({}, attr))
						// console.log('selectedIds :', selectedIds)
						// Eks: Barn som attributt må bli behandlet annerledes
						return Object.assign(Object.assign({}, attr), {
							items: this.listAllSelectFilterItems(selectedIds, attr.items)
						})
					}
				} else {
					// console.log('attr siste:', attr)
					return attr
				}
			})
	}

	listAllExcludingChildren(): Attributt[] {
		return AttributtListe.filter(f => !f.parent)
	}

	listAllExcludingChildrenAndEksisterendeIdentAttr(): Attributt[] {
		return AttributtListe.filter(f => {
			return !f.parent && !f.sattForEksisterendeIdent
		})
	}

	listSelectedExcludingChildren(selectedIds: string[]): Attributt[] {
		return AttributtListe.filter(f => !f.parent && selectedIds.includes(f.id))
	}

	//STEP 1
	listSelectableAttributes(searchTerm: string, identOpprettesFra: string): AttributtGruppe[] {
		let list
		identOpprettesFra === BestillingMapper('EKSIDENT')
			? (list = this.listAllExcludingChildrenAndEksisterendeIdentAttr())
			: (list = this.listAllExcludingChildren())

		return groupList(
			searchTerm ? list.filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase())) : list
		)
	}

	listUtvalg(selectedIds: string[]): AttributtGruppeHovedKategori[] {
		return groupListByHovedKategori(this.listSelectedExcludingChildren(selectedIds))
	}

	//STEP 2 + 3
	listSelectedAttributesForValueSelection(selectedIds: string[]): AttributtGruppe[] {
		return groupList(this.listAllSelected(selectedIds))
	}

	getValidations(selectedIds: string[]): yup.MixedSchema {
		// Get all selected attributes that has validations
		const list = this.listAllSelected(selectedIds).filter(s => s.validation)
		return this._createValidationObject(list)
	}

	getInitialValues(selectedIds: string[], values: object): FormikValues {
		let listallselected = this.listAllSelected(selectedIds)
		// console.log('listallselected :', listallselected)
		return this._getListOfInitialValues(this.listAllSelected(selectedIds), values)
	}

	//Edit attributes
	listEditableFlat(values: object, ident: string, dataSources: string[]): Attributt[] {
		// console.log('AttributtListe :', AttributtListe)

		// AttributtListe.map(i => {
		// 	if (i.id === 'utvandret') {
		// 		AttributtListe.push(i.items[0])
		// 		AttributtListe.push(i.items[1])
		// 	}
		// })
		return AttributtListe.filter(attr => {
			// if (attr.id === 'utvandret') {
			// 	return attr.items.filter(i => {
			// 		if (!isAttributtEditable(attr)) return false
			// 		const { dataSource, path, id, editPath } = i
			// 		if (!dataSources.includes(dataSource)) return false
			// 		const dataSourceValues =
			// 			values[DataSourceMapper(dataSource)][0] || values[DataSourceMapper(dataSource)][ident]
			// 		if (!dataSourceValues) return false
			// 		let dataPath = editPath || path || id
			// 		if (_get(dataSourceValues, dataPath)) {
			// 			return _get(dataSourceValues, dataPath)
			// 		}
			// 	})
			// }
			// console.log('attr :', attr)
			// return early if attribute is not editable
			if (!isAttributtEditable(attr)) return false

			const { dataSource, path, id, editPath } = attr
			// check for datasource
			if (!dataSources.includes(dataSource)) return false

			const dataSourceValues =
				values[DataSourceMapper(dataSource)][0] || values[DataSourceMapper(dataSource)][ident]
			// console.log('dataSourceValues :', dataSourceValues)
			// check for values
			if (!dataSourceValues) return false

			const dataPath = editPath || path || id
			// if (dataPath === 'utvandret') {
			// 	dataPath = 'utvandretTilLand'
			// }
			// console.log('dataPath :', dataPath)
			// check if value exists (not NULL)
			if (_get(dataSourceValues, dataPath)) {
				return _get(dataSourceValues, dataPath)
			}
		})
	}

	listEditable(values: object, ident: string, dataSources: string[]): AttributtGruppe[] {
		// console.log('values :', values)
		// console.log('ident :', ident)
		// console.log('dataSources :', dataSources)
		// const listEdit = this.listEditableFlat(values, ident, dataSources)
		// console.log('listEdit :', listEdit)
		return groupList(this.listEditableFlat(values, ident, dataSources))
	}

	getValidationsForEdit(values: object, ident: string, dataSources: string[]): yup.MixedSchema {
		// editable attributter, som kun er read skal ikke ha validering.
		const list = this.listEditableFlat(values, ident, dataSources)
		return this._createValidationObject(list, true)
	}

	//Liste med attributter som er redigerbare, men uten verdi (kan legges til)
	listEditableWithoutValueFlat(values: object, ident: string, dataSources: string[]): Attributt[] {
		return AttributtListe.filter(attr => {
			//fjern ikke-redigerbare attributt
			if (!isAttributtEditable(attr)) return false

			const { dataSource, path, id, editPath } = attr
			// sjekk datasource
			if (!dataSources.includes(dataSource)) return false

			const dataSourceValues =
				values[DataSourceMapper(dataSource)][0] || values[DataSourceMapper(dataSource)][ident]
			// sjekk om liste av verdier finnes
			if (!dataSourceValues) return false

			const dataPath = editPath || path || id
			// fjern attributt som allerede har en verdi
			if (_get(dataSourceValues, dataPath)) {
				return !_get(dataSourceValues, dataPath)
			}
			return true
		})
	}

	listEditableWithoutValue(
		values: object,
		ident: string,
		dataSources: string[]
	): AttributtGruppe[] {
		return groupList(this.listEditableWithoutValueFlat(values, ident, dataSources))
	}

	//TODO: Se om vi dette kan gjøres ryddigere, litt rotete pga tpsf er array mens andre registre er object
	getInitialValuesForEditableItems(
		values: object,
		ident: string,
		dataSources: string[]
	): FormikValues {
		const editableAttributes = this.listEditableFlat(values, ident, dataSources)
		return editableAttributes.reduce((prev, item) => {
			const dataSource = DataSourceMapper(item.dataSource)
			const sourceValues =
				dataSource === 'tpsf'
					? values[dataSource][0]
					: values[dataSource] && values[dataSource][ident]

			// console.log('item :', item)
			// console.log('sourceValues :', sourceValues)
			if (item.items) {
				return this._setInitialArrayValuesFromServer(prev, item, sourceValues)
			}
			// if (item.fields) {
			// 	return this._setInitialArrayValuesFromServer(prev, item, sourceValues)
			// }

			return this._setInitialValueFromServer(prev, item, sourceValues)
		}, {})
	}

	getAttributtListByHovedkategori(hovedkategori: Kategori): string[] {
		return AttributtListe.filter(attr => attr.hovedKategori.id === hovedkategori.id).map(
			attr => attr.id
		)
	}

	getParentAttributtListByHovedkategori(hovedkategori: Kategori): string[] {
		return AttributtListe.filter(
			attr => attr.hovedKategori.id === hovedkategori.id && !attr.parent
		).map(attr => attr.id)
	}

	getAttributtById(attributtId: string): Attributt {
		return AttributtListe.find(attr => attr.id === attributtId)
	}

	_createValidationObject(list: Attributt[], editMode = false): yup.MixedSchema {
		// Reduce to item.id and validation to create a validation object
		const validationObject = list.reduce((accumulator, currentObject) => {
			if (currentObject.items) {
				let itemsToValidate = currentObject.items
				if (editMode)
					itemsToValidate = itemsToValidate.filter(
						attr => attr.attributtType !== AttributtType.SelectAndRead
					)
				const mapItemsToObject = this._mapArrayToObjectWithValidation(itemsToValidate)

				return {
					...accumulator,
					[currentObject.id]: yup.array().of(yup.object().shape(mapItemsToObject))
				}
			}
			return _set(accumulator, currentObject.id, currentObject.validation)
		}, {})
		return yup.object().shape(validationObject)
	}

	_getListOfInitialValues(list, values) {
		// console.log('list :', list)
		// console.log('values :', values)
		return list.reduce((prev, item) => {
			// console.log('prev :', prev)
			// console.log('____item :', item)
			// Array
			if (item.items) {
				const mapItemsToObject = this._mapArrayToObjectWithEmptyValues(item.items)
				// console.log('________mapItemsToObject :', mapItemsToObject)
				// if (item.id =)
				return this._setInitialArrayValue(prev, item.id, values, [mapItemsToObject])
			}
			// if (item.fields) {
			// 	const mapItemsToObject = this._mapArrayToObjectWithEmptyValues(item.fields)
			// 	return this._setInitialArrayValue(prev, item.id, values, [mapItemsToObject])
			// }
			// Flattened object -> Ignore parent that has no inputType
			if (!item.inputType) return prev

			// Initvalue based on key-value
			return this._setInitialValueFromState(prev, item, values)
		}, {})
	}

	_setInitialValueFromState(currentObject, item, stateValues) {
		let initialValue = this.initValueSelector(item)
		const fromState = _get(stateValues, item.id)
		if (fromState || fromState === false) initialValue = fromState

		return _set(currentObject, item.id, initialValue)
	}

	_setInitialValueFromServer(currentObject, item, serverValues) {
		let initialValue = this.initValueSelector(item)
		const fromState = _get(serverValues, item.path || item.id)
		if (fromState || fromState === false) initialValue = fromState

		if (item.inputType === 'date') initialValue = DataFormatter.formatDate(initialValue)

		// TODO: Hvis det dukker opp flere slike tilfelle, vurder å expande AttributeSystem
		// KUN FOR egen ansatt - spesielt tilfelle
		if (item.id === 'egenAnsattDatoFom') initialValue = true

		return _set(currentObject, item.id, initialValue)
	}

	_setInitialArrayValuesFromServer(currentObject, item, serverValues) {
		// kanskje alle skal kunne redigeres
		const itemArray = item.items
		// const itemArray = item.items || item.fields
		// console.log('serverValues :', serverValues)
		const editableAttributes = itemArray.filter(item => isAttributtEditable(item))
		// console.log('editableAttributes :', editableAttributes)
		const arrayValues = Object.keys(serverValues).map(valueObj => {
			return editableAttributes.reduce((prev, curr) => {
				const currentPath = curr.editPath || curr.path
				return _set(prev, curr.id, valueObj[currentPath])
			}, {})
		})
		return _set(currentObject, item.id, arrayValues)
	}

	_setInitialArrayValue(currentObject, itemId, stateValues, array) {
		let initialValue = array
		// console.log('initialValue :', initialValue)
		// console.log('stateValues :', stateValues)
		// console.log('itemId :', itemId)
		const fromState = _get(stateValues, itemId)
		// console.log('fromState :', fromState)
		if (fromState || fromState === false) initialValue = fromState

		return _set(currentObject, itemId, initialValue)
	}

	_mapArrayToObjectWithEmptyValues = list => {
		// console.log('xxx list :', list)
		return list.reduce((accumulator, item) => {
			// console.log('xxx accumulator :', accumulator)
			// console.log('xxx item :', item)
			if (item.items) {
				// let test = { barn_utvandret: [{ utvandretTilLand: '', utvandretTilLandFlyttedato: '' }] }
				// return test
				// console.log('item.items item :', item)
				// return this._mapArrayToObjectWithEmptyValues(item.items)
				return _set(accumulator, item.id, [this._mapArrayToObjectWithEmptyValues(item.items)])
			}
			return _set(accumulator, item.id, this.initValueSelector(item))
		}, {})
	}

	_mapArrayToObjectWithValidation = list => {
		return list.reduce((accumulator, item) => {
			return _set(accumulator, item.id, item.validation)
		}, {})
	}

	initValueSelector = item => {
		switch (item.inputType) {
			case 'date':
				if (item.defaultValue) {
					return DataFormatter.formatDate(item.defaultValue)
				}
				return ''
			case 'number':
				if (item.defaultValue) {
					return item.defaultValue
				}
				return 0
			default:
				if (item.defaultValue) return item.defaultValue
				return ''
		}
	}

	listDependencies = selectedIds =>
		selectedIds
			.filter(id => DependencyTree[id])
			.map(id =>
				Object.values(DependencyTree[id]).reduce((res, val) => ({ ...res, [val.id]: val }), {})
			)
			.reduce((res, acc) => ({ ...res, ...acc }), {})
}
