import React from 'react'
import styled from 'styled-components'
import Icon from '~/components/ui/icon/Icon'
import './DollyKjede.less'

export interface KjedeIconProps {
	locked: boolean
	onClick: () => void
}

const KjedeIcon = styled.div`
	border-radius: 2px;
	display: block;
	margin: 2px 2px 2px 6px;
	padding: 4px 4px 2px 4px;
	cursor: pointer;
	fill: white;
`

export default ({ locked, onClick }: KjedeIconProps) => {
	return (
		<KjedeIcon onClick={() => onClick()} className={'background-color-lightblue'}>
			<Icon size={22} kind={locked ? 'link' : 'linkBroken'} />
		</KjedeIcon>
	)
}
