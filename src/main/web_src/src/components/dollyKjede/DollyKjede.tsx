import React, { useState } from 'react'
import styled from 'styled-components'

import KjedePagination from '~/components/dollyKjede/KjedePagination'
import KjedeIcon from '~/components/dollyKjede/KjedeIcon'

export interface DollyKjedeProps {
	objectList: string[]
	itemLimit: number
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

const getCenterIndices = (index: number, antallItems: number, itemLimit: number) => {
	itemLimit = itemLimit > 10 ? 10 : itemLimit < 5 ? 5 : itemLimit
	if (antallItems < 3) {
		return []
	}

	let indices = [index - 1, index, index + 1]

	while (
		indices.length < itemLimit - 3 &&
		!indices.includes(1) &&
		!(indices.length == itemLimit - 4 && indices[indices.length - 1] != antallItems - 2)
	) {
		indices.unshift(indices[0] - 1)
	}

	while (
		indices.length < itemLimit - 3 &&
		!indices.includes(antallItems - 2) &&
		!(indices.length == itemLimit - 4 && indices[0] != 1)
	) {
		indices.push(indices[indices.length - 1] + 1)
	}

	if (indices.includes(0)) {
		indices = indices.slice(1)
	}
	if (indices.includes(antallItems - 1)) {
		indices = indices.slice(0, indices.length - 1)
	}

	return indices
}

export default ({ objectList, itemLimit }: DollyKjedeProps) => {
	const antallItems = objectList.length

	const [selectedIndex, setSelectedIndex] = useState(0)
	const handleClick = (index: number) => setSelectedIndex(index)

	const [paginationIndex, setPaginationIndex] = useState(antallItems > 6 ? 5 : antallItems - 2)
	const [centerIndices, setCenterIndices] = useState(
		getCenterIndices(paginationIndex, antallItems, itemLimit)
	)
	const [locked, setLocked] = useState(true)

	const handlePagination = (addValue: number) => {
		if (centerIndices.length == 4 || centerIndices.length < 3) {
			if (addValue < 0) {
				addValue -= 1
			} else {
				addValue += 1
			}
		}
		setCenterIndices(getCenterIndices(paginationIndex + addValue, antallItems, itemLimit))
		setPaginationIndex(paginationIndex + addValue)
	}

	const handleLocked = () => {
		setLocked(!locked)
	}

	return (
		<Container>
			<KjedePagination
				selectedIndex={selectedIndex}
				objectList={objectList}
				centerIndices={centerIndices}
				disabled={locked}
				handlePagination={handlePagination}
				handleClick={handleClick}
			/>
			<KjedeIcon locked={locked} onClick={handleLocked} />
		</Container>
	)
}
