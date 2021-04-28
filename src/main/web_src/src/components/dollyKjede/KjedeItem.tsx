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
	cursor: ${p => p.style.cursor};
	border: none;
	font-size: 15px;
	padding: 0 9px 0 9px;
`

export default ({ index, selected, disabled, text, onClick }: KjedeItemProps) => {
	const style = {
		cursor: selected || disabled ? 'auto' : 'pointer',
		className: selected ? 'color-black' : disabled ? 'color-grey' : 'color-lightblue'
	}

	return (
		<Button
			disabled={disabled}
			onClick={() => onClick(index)}
			style={style}
			className={style['className']}
		>
			{text}
		</Button>
	)
}
