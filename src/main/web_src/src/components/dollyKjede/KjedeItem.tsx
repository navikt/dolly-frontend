import React from 'react'
import styled from 'styled-components'
import './DollyKjede.less'

export interface KjedeItemProps {
	index: number
	selected: boolean
	disabled: boolean
	text: string
	onClick: (page: number) => void
}

const Button = styled.button`
	background: transparent;
	text-decoration: underline;
	cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
	border: none;
	font-size: 15px;
	padding: 0 9px 0 9px;
`

const SelectedButton = styled.button`
	background: transparent;
	color: black;
	border: none;
	font-size: 15px;
	padding: 0 9px 0 9px;
`

export default ({ index, selected, disabled, text, onClick }: KjedeItemProps) => {
	if (selected) {
		return (
			<SelectedButton disabled={disabled} onClick={() => onClick(index)}>
				{text}
			</SelectedButton>
		)
	} else {
		return (
			<Button
				disabled={disabled}
				onClick={() => onClick(index)}
				className={disabled ? 'color-grey' : 'color-lightblue'}
			>
				{text}
			</Button>
		)
	}
}