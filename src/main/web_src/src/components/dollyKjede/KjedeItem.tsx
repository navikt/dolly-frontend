import React from 'react'
import styled from 'styled-components'

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
	color: ${p => (p.disabled ? 'grey' : 'blue')};
	cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
	border: none;
`

const SelectedButton = styled.button`
	background: transparent;
	color: ${p => (p.disabled ? 'grey' : 'black')};
	border: none;
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
			<Button disabled={disabled} onClick={() => onClick(index)}>
				{text}
			</Button>
		)
	}
}
