import React from 'react'
import styled from 'styled-components'
import Icon from '~/components/ui/icon/Icon'

export interface KjedeIconProps {
	locked: boolean
	onClick: () => void
}

const KjedeIcon = styled.div`
	border-radius: 2px;
	display: block;
	background: blue;
	margin: 2px 2px 2px 6px;
	padding: 4px 4px 2px 4px;
	cursor: pointer;
`

export default ({ locked, onClick }: KjedeIconProps) => {
	return (
		<KjedeIcon onClick={() => onClick()}>
			<Icon size={22} kind={locked ? 'link' : 'linkBroken'} style={{ fill: 'white' }} />
		</KjedeIcon>
	)
}
