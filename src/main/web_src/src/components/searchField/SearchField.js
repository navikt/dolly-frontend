import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchText } from '~/ducks/search'
import { TextInput } from '~/components/ui/form/inputs/textInput/TextInput'

import './SearchField.less'

export const SearchField = ({ placeholder = 'Hva leter du etter?', text, setText }) => {
	const searchText = text ? text : useSelector(state => state.search)
	const dispatch = useDispatch()

	const handleChange = event =>
		setText
			? setText(event.target.value.trim())
			: dispatch(setSearchText(event.target.value.trim()))

	return (
		<div className="searchfield-container skjemaelement">
			<TextInput
				value={searchText}
				id="searchfield-inputfield"
				type="text"
				placeholder={placeholder}
				onChange={handleChange}
				aria-label="Search"
				icon="search"
			/>
		</div>
	)
}
