import React from 'react'
import useBoolean from '~/utils/hooks/useBoolean'
import DollyModal from '~/components/ui/modal/DollyModal'
import Button from '~/components/ui/button/Button'
import BestillingSammendrag from '~/components/bestilling/sammendrag/Sammendrag'

export const BestillingSammendragModal = ({ bestilling }) => {
	const [modalIsOpen, openModal, closeModal] = useBoolean(false)

	return (
		<div className="flexbox--align-center--justify-end">
			<Button onClick={openModal} className="flexbox--align-center" kind="details">
				BESTILLINGSDETALJER
			</Button>
			<DollyModal isOpen={modalIsOpen} closeModal={closeModal} width="60%">
				<h1>Bestilling #{bestilling.id}</h1>
				<BestillingSammendrag bestilling={bestilling} modal />
			</DollyModal>
		</div>
	)
}
