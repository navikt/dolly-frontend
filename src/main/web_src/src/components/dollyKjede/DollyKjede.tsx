import React, { useState } from 'react'

import KjedePagination from '~/components/dollyKjede/KjedePagination'
import styled from 'styled-components'

export interface DollyKjedeProps {
	objectList: string[]
}

const Container = styled.div``

export default ({ objectList }: DollyKjedeProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const handleClick = (index: number) => setSelectedIndex(index)
	const antallItems = objectList.length

	const [paginationIndex, setPaginationIndex] = useState(antallItems > 3 ? 2 : 1)

	const getCenterIndices = (index: number) => {
		if (antallItems < 3) {
			return []
		}

		let indices = [index - 1, index, index + 1]

		while (
			indices.length < 4 &&
			!indices.includes(1) &&
			!(indices.length == 3 && indices[indices.length - 1] != antallItems - 2)
		) {
			indices.unshift(index - 2)
		}

		while (
			indices.length < 4 &&
			!indices.includes(antallItems - 2) &&
			!(indices.length == 3 && indices[0] != 1)
		) {
			indices.push(index + 2)
		}

		if (indices.includes(0)) {
			indices = indices.slice(1)
		}
		if (indices.includes(antallItems - 1)) {
			indices = indices.slice(0, indices.length - 1)
		}

		return indices
	}

	const [centerIndices, setCenterIndices] = useState(getCenterIndices(paginationIndex))

	const handlePagination = (addValue: number) => {
		if (centerIndices.length == 4 || centerIndices.length < 3) {
			if (addValue < 0) {
				addValue -= 1
			} else {
				addValue += 1
			}
		}
		setCenterIndices(getCenterIndices(paginationIndex + addValue))
		setPaginationIndex(paginationIndex + addValue)
	}

	const locked = false

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
		</Container>
	)
}
