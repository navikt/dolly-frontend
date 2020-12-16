import * as React from 'react'
import './Enhetstre.less'
import { Enhet } from '~/components/enhetstre/types'

type EnhetProps = {
	enhet: Enhet
	hasChildren: boolean
	isSelected: boolean
	onNodeClick: Function
}

export const Node = (props: EnhetProps) => {
	if (props.hasChildren) {
		return (
			<div
				onClick={() => props.onNodeClick(props.enhet)}
				className={props.isSelected ? 'rectangle-corner-selected' : 'rectangle-corner'}
			>
				{props.enhet.name}
			</div>
		)
	} else {
		return (
			<div
				onClick={() => props.onNodeClick(props.enhet)}
				className={props.isSelected ? 'rectangle-selected' : 'rectangle'}
			>
				{props.enhet.name}
			</div>
		)
	}
}
