import React from 'react'
import cn from 'classnames'
import Row from './TableRow'
import Column from './TableColumn'
import _get from 'lodash/get'
import _isFunction from 'lodash/isFunction'
import _isNil from 'lodash/isNil'

import './Table.less'

const getColumnValue = (row, column) => {
	let value = _get(row, `${column.dataField}`, '')
	value = _isNil(value) ? '' : value.toString()
	return column.formatter ? column.formatter(value, row) : value
}

// Setter rowKey til en verdi dersom datasett har et unikt felt
// Fallback til row index
const getRowKey = (row, columns) => {
	const hasUnique = columns.find(c => c.unique)
	return hasUnique && _get(row, `${hasUnique.dataField}`).toString()
}

const getIconType = (iconItem, row) => {
	if (!iconItem) return null
	return _isFunction(iconItem) ? iconItem(row) : iconItem
}

export default function Table({ data, iconItem, columns, onRowClick, onExpand }) {
	return (
		<div className="dot">
			<div className="dot-header">
				{iconItem && <Column className="dot-icon" />}
				{columns.map((cell, idx) => (
					<Column key={idx} width={cell.width} value={cell.text} />
				))}
				{onExpand && <Column />}
			</div>
			{data.map((row, rowIdx) => {
				const navLink = onRowClick ? onRowClick(row) : null
				const expandComponent = onExpand ? onExpand(row) : null
				const iconType = getIconType(iconItem, row)
				const rowKey = getRowKey(row, columns) || rowIdx
				return (
					<Row key={rowKey} icon={iconType} navLink={navLink} expandComponent={expandComponent}>
						{columns.map((columnCell, idx) => (
							<Column key={idx} width={columnCell.width} value={getColumnValue(row, columnCell)} />
						))}
					</Row>
				)
			})}
		</div>
	)
}
