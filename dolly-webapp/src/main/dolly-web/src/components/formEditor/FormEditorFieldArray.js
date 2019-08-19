import React, { Fragment } from 'react'
import { FieldArray } from 'formik'
import { DollyApi } from '~/service/Api'
import Button from '~/components/button/Button'
import AttributtManager from '~/service/kodeverk/AttributtManager/AttributtManager'
import ContentTooltip from '~/components/contentTooltip/ContentTooltip'
import cn from 'classnames'

const Attributt = new AttributtManager()

const FormEditorFieldArray = (
	subKategori,
	formikProps,
	renderFieldComponent,
	renderFieldSubItem,
	shouldRenderFieldComponent,
	editMode,
	shouldRenderSubItem
) => {
	const parentId = subKategori.id
	console.log('parentId :', parentId)
	return (
		<div className="subkategori" key={parentId}>
			<FieldArray
				name={parentId}
				render={arrayHelpers => (
					<FieldArrayComponent
						// key={parentId}
						item={subKategori}
						formikProps={formikProps}
						renderFieldComponent={renderFieldComponent}
						renderFieldSubItem={renderFieldSubItem}
						shouldRenderFieldComponent={shouldRenderFieldComponent}
						shouldRenderSubItem={shouldRenderSubItem}
						editMode={editMode}
						arrayHelpers={arrayHelpers}
					/>
				)}
			/>
		</div>
	)
}

export const FieldArrayComponent = ({
	item,
	formikProps,
	renderFieldComponent,
	renderFieldSubItem,
	shouldRenderFieldComponent,
	shouldRenderSubItem,
	editMode,
	arrayHelpers,
	idx
}) => {
	// console.log('FieldArrayComponent item :', item)
	// console.log('formikProps :', formikProps)
	const { subKategori, items, subItems, id } = item
	// console.log('subKategori :', subKategori)
	// console.log('items :', items)
	// console.log('id :', id)
	const parentId = id
	const itemid = idx
	let parentAttributes = items.reduce((prev, curr) => {
		return {
			...prev,
			[curr.id]: Boolean(curr.subItems)
				? [Attributt.initValueSelector(curr)]
				: Attributt.initValueSelector(curr)
		}
	}, {})
	const createDefaultObject = () => {
		// console.log('parentAttributes :', parentAttributes)
		//! gjøres i parentAttributes?
		if ('barn_utvandret' in parentAttributes) {
			// parentAttributes = {
			// 	identtype: 'FNR',
			// 	barn_utvandret: [{ utvandretTilLand: '', utvandretTilLandFlyttedato: '' }]
			// }
			parentAttributes.barn_utvandret = [{ utvandretTilLand: '', utvandretTilLandFlyttedato: '' }]
		}
		arrayHelpers.push({ ...parentAttributes })
		// console.log('arrayHelpers :', arrayHelpers)
	}
	// console.log('arrayHelpers :', arrayHelpers)
	// console.log('parentAttributes :', parentAttributes)
	const createSubItem = (subitem, itemIndex) => {
		// console.log('subitem :', subitem)
		// console.log('itemIndex :', itemIndex)
		let subItemArray = subitem.subItems
		// console.log('subItemArray :', subItemArray)
		const subItemId = subitem.id

		const subItemAttributes = subItemArray.reduce((prev, curr) => {
			return { ...prev, [curr.id]: Attributt.initValueSelector(curr) }
		}, {})
		// console.log('subItemAttributes :', subItemAttributes)
		let valueCopy = JSON.parse(JSON.stringify(formikProps.values[parentId][itemIndex]))
		let subArray = valueCopy[subItemId]

		if (subArray && subArray.length > 0 && subArray[0] != '') {
			subArray.push(subItemAttributes)
		} else {
			subArray = [subItemAttributes]
		}
		arrayHelpers.replace(itemIndex, { ...valueCopy, [subItemId]: subArray })
	}

	const removeSubItem = (itemIndex, subItemIndex, subItem) => {
		const valueCopy = Object.assign(formikProps.values[parentId][itemIndex])
		let subItemArr = valueCopy[subItem]
		subItemArr && subItemArr.splice(subItemIndex, 1)

		arrayHelpers.replace(itemIndex, { ...valueCopy, [subItem]: subItemArr })
	}
	let formikValues = formikProps.values[parentId]
	// console.log('idx :', idx)
	if (item.id === 'barn_utvandret') {
		// console.log('parentId :', parentId)
		// console.log('formikProps :', formikProps)

		formikValues = formikProps.values.barn[idx][parentId]
	}
	// console.log('formikValues :', formikValues)
	let subLabelArray = []
	return (
		<Fragment>
			{formikValues && formikValues.length > 0 ? (
				formikValues.map((faKey, idx) => {
					return (
						<Fragment key={idx}>
							{idx !== 0 && <div className="field-array-line" />}
							<div className="flexbox">
								<div className="subkategori-field-group multi">
									{items.map((item, kdx) => {
										// console.log('_____item :', item)

										// if (item.id === 'barn_utvandret') {
										// 	//item.items?
										// 	item = item.items[0]
										// }
										if (item.items) {
											// console.log('idx :', idx)
											// let test = [item.items]
											// console.log('item :', item)
											// console.log('_______formikProps :', formikProps)
											// console.log('renderFieldComponent :', renderFieldComponent)
											// console.log('renderFieldSubItem :', renderFieldSubItem)
											// console.log('shouldRenderFieldComponent :', shouldRenderFieldComponent)
											// console.log('shouldRenderSubItem :', shouldRenderSubItem)
											// console.log('editMode :', editMode)
											// console.log('arrayHelpers :', arrayHelpers)
											return FieldArrayComponent({
												item,
												formikProps,
												renderFieldComponent,
												renderFieldSubItem,
												shouldRenderFieldComponent,
												shouldRenderSubItem,
												editMode,
												arrayHelpers,
												idx
											})
											// return FormEditorFieldArray(
											// 	item.items,
											// 	formikProps,
											// 	renderFieldComponent,
											// 	renderFieldSubItem,
											// 	shouldRenderFieldComponent,
											// 	editMode,
											// 	shouldRenderSubItem
											// )
										}
										if (
											item.subKategori.id !== subKategori.navn &&
											!subLabelArray.includes(item.subKategori.id)
										) {
											subLabelArray.push(item.subKategori.id)
											var visUnderoverskrift = true
										}
										if (item.subItems && shouldRenderSubItem(item, formikProps, idx))
											// Render array i array. F.eks. permisjon under arbeidsforhold
											return (
												<div key={kdx}>
													{visUnderoverskrift && <h4>{item.subKategori.navn}</h4>}
													{faKey[item.id] &&
														faKey[item.id].map((subRad, jdx) => {
															return renderHeaderSubFieldButton(
																renderFieldSubItem,
																removeSubItem,
																formikProps,
																item,
																subRad,
																parentId,
																editMode,
																idx,
																jdx
															)
														})}
												</div>
											)
										else if (
											shouldRenderFieldComponent(items, item, formikProps, {
												parentId,
												idx
											})
										) {
											// Add subKategori to ID
											const fakeItem = {
												...item,
												id: `${parentId}[${idx}]${item.id}`
											}
											//! gjør litt mer general
											if (fakeItem.id === 'barn_utvandret[0]utvandretTilLand') {
												// fakeItem.id = 'barn[0]barn_utvandret[0]utvandretTilLand'
												fakeItem.id = `barn[${itemid}]barn_utvandret[0]utvandretTilLand`
											}
											if (fakeItem.id === 'barn_utvandret[0]utvandretTilLandFlyttedato') {
												fakeItem.id = `barn[${itemid}]barn_utvandret[0]utvandretTilLandFlyttedato`
											}
											// console.log('itemid :', idx)
											// console.log('fakeItem :', fakeItem)
											// console.log('formikProps.values :', formikProps.values)
											return (
												<div key={kdx} className="flexbox">
													{renderFieldComponent(
														fakeItem,
														formikProps.values,
														{
															parentId,
															idx
														},
														formikProps
													)}
												</div>
											)
										}
									})}
								</div>
								<div>
									{!editMode &&
										item.isMultiple && (
											<Button
												className="field-group-remove"
												kind="remove-circle"
												onClick={e => arrayHelpers.remove(idx)}
												title="Fjern"
												children={subKategori.navn.toUpperCase()}
											/>
										)}
								</div>
							</div>
							{items.map((item, ndx) => {
								// console.log('item :', item)
								// item.subItems && createSubItem(item, idx)
								return (
									item.subItems &&
									addButton(() => createSubItem(item, idx), item.label.toUpperCase(), ndx)
								)
							})}
						</Fragment>
					)
				})
			) : (
				<p className="ingen-verdi-melding">Ingen verdi lagt til</p>
			)}

			{!editMode &&
				item.isMultiple &&
				addButton(createDefaultObject, subKategori.navn.toUpperCase())}
		</Fragment>
	)
}

export const addButton = (onClick, header, key) => {
	// console.log('ADDBUTTON!!!!')
	// console.log('onClick :', onClick)
	// console.log('header :', header)
	// console.log('key :', key)
	return (
		<Button
			className="flexbox--align-center field-group-add"
			kind="add-circle"
			onClick={onClick}
			key={key}
		>
			{header}
		</Button>
	)
}
export const renderHeaderSubFieldButton = (
	renderFieldSubItem,
	removeSubItem,
	formikProps,
	item,
	subRad,
	parentId,
	editMode,
	idx,
	jdx
) => {
	return (
		<div key={jdx} className="subItems">
			{jdx === 0 && (
				<div className="flexbox">
					<h4>{item.label}</h4>
					{item.informasjonstekst && (
						//Fjernes når (/hvis) vi får inn validering av datoer på tvers av items
						<h5 className="infotekst">{item.informasjonstekst}</h5>
					)}
				</div>
			)}
			<div className="subitem-container-button">
				{renderFieldSubItem(formikProps, item, subRad, parentId, idx, jdx)}
				{!editMode && (
					<Button
						className="field-group-remove"
						kind="remove-circle"
						onClick={() => removeSubItem(idx, jdx, item.id)}
						title="Fjern"
						children={item.label.toUpperCase()}
					/>
				)}
			</div>
		</div>
	)
}
export default FormEditorFieldArray
