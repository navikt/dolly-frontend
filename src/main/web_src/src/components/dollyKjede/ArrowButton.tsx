import React from 'react'
import styled from 'styled-components'
import Icon from '~/components/ui/icon/Icon'

export interface Props {
	left: boolean
	disabled: boolean
	onClick: (page: number) => void
}

const ArrowButton = styled.button`
	background: transparent;
	color: ${p => (p.disabled ? 'grey' : 'black')};
	cursor: ${p => (p.disabled ? 'auto' : 'pointer')};
	border: none;
`

export default ({ left, disabled, onClick }: Props) => {
	const paginationValue = left ? -1 : 1

	return (
		<ArrowButton disabled={disabled} onClick={() => onClick(paginationValue)}>
			{left && (
				<Icon
					size={11}
					kind={'arrow-left'}
					style={disabled ? { fill: 'grey' } : { fill: 'black' }}
				/>
			)}
			{!left && (
				<Icon
					size={11}
					kind={'arrow-right'}
					style={disabled ? { fill: 'grey' } : { fill: 'black' }}
				/>
			)}
		</ArrowButton>
	)
}
