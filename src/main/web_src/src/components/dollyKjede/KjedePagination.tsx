import React from 'react'
import styled from 'styled-components'
import KjedeItem from '~/components/dollyKjede/KjedeItem'
import ArrowButton from '~/components/dollyKjede/ArrowButton'

export interface Props {
	selectedIndex: number
	objectList: string[]
	centerIndices: number[]
	disabled: boolean
	handlePagination: (page: number) => void
	handleClick: (page: number) => void
}

const PaginationContainer = styled.div``

const PaginationWrapper = styled.div`
	display: flex;
	justify-content: center;
`

const Separator = styled.div`
	width: 1rem;
	margin: 0 0.25rem;
`

export default ({
	selectedIndex,
	objectList,
	centerIndices,
	disabled,
	handlePagination,
	handleClick
}: Props) => {
	return (
		<PaginationContainer>
			<PaginationWrapper>
				<ArrowButton
					left={true}
					disabled={disabled || centerIndices.length == 0 || centerIndices[0] == 1}
					onClick={handlePagination}
				/>
				{objectList.length > 0 && (
					<KjedeItem
						index={0}
						selected={selectedIndex === 0}
						disabled={false}
						text={objectList[0]}
						onClick={handleClick}
					/>
				)}
				{centerIndices.length != 0 && centerIndices[0] != 1 && <Separator>...</Separator>}
				{centerIndices.length > 0 && (
					<KjedeItem
						index={centerIndices[0]}
						selected={selectedIndex == centerIndices[0]}
						disabled={disabled}
						text={objectList[centerIndices[0]]}
						onClick={handleClick}
					/>
				)}
				{centerIndices.length > 1 && (
					<KjedeItem
						index={centerIndices[1]}
						selected={selectedIndex == centerIndices[1]}
						disabled={disabled}
						text={objectList[centerIndices[1]]}
						onClick={handleClick}
					/>
				)}
				{centerIndices.length > 2 && (
					<KjedeItem
						index={centerIndices[2]}
						selected={selectedIndex == centerIndices[2]}
						disabled={disabled}
						text={objectList[centerIndices[2]]}
						onClick={handleClick}
					/>
				)}
				{centerIndices.length > 3 && (
					<KjedeItem
						index={centerIndices[3]}
						selected={selectedIndex == centerIndices[3]}
						disabled={disabled}
						text={objectList[centerIndices[3]]}
						onClick={handleClick}
					/>
				)}
				{centerIndices.length != 0 &&
					centerIndices[centerIndices.length - 1] != objectList.length - 2 && (
						<Separator>...</Separator>
					)}
				{objectList.length > 1 && (
					<KjedeItem
						index={objectList.length - 1}
						selected={selectedIndex == objectList.length - 1}
						disabled={disabled}
						text={objectList[objectList.length - 1]}
						onClick={handleClick}
					/>
				)}
				<ArrowButton
					left={false}
					disabled={
						disabled ||
						centerIndices.length == 0 ||
						centerIndices[centerIndices.length - 1] == objectList.length - 2
					}
					onClick={handlePagination}
				/>
			</PaginationWrapper>
		</PaginationContainer>
	)
}
