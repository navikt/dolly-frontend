import * as React from 'react'
import './Enhetstre.less'

type EnhetProps = {
	name: string
	hasChildren: boolean
	isSelected: boolean
}

export const Node = (props: EnhetProps) => {
	if (props.hasChildren) {
		return (
			<div className={props.isSelected ? 'rectangle-corner-selected' : 'rectangle-corner'}>
				{props.name}
			</div>
		)
	} else {
		return <div className={props.isSelected ? 'rectangle-selected' : 'rectangle'}>{props.name}</div>
	}
}
