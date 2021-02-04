import DollyModal from '~/components/ui/modal/DollyModal'
import React, { useState } from 'react'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import ModalActionKnapper from '~/components/ui/modal/ModalActionKnapper'
import { DollyApi } from '~/service/Api'
import { Textarea } from 'nav-frontend-skjema'

export const KommentarModal = ({ id, beskrivelse, closeModal }) => {
	const lagreEndring = () => {
		DollyApi.updateIdentBeskrivelse(id, kommentar).then(() => window.location.reload())
	}

	const [kommentar, setKommentar] = useState(beskrivelse)
	const MAX_LENGTH = 200

	return (
		<ErrorBoundary>
			<DollyModal isOpen closeModal={closeModal} width="40%" overflow="auto">
				<div className="modal">
					<h1>Endre kommentar</h1>
					<br />
					<Textarea
						value={kommentar}
						label={'Kommentar'}
						maxLength={MAX_LENGTH}
						onChange={event => setKommentar(event.target.value)}
						feil={
							kommentar.length > MAX_LENGTH
								? { feilmelding: 'Kommentaren inneholder for mange tegn' }
								: null
						}
					/>
					<ModalActionKnapper
						submitknapp="Lagre kommentar"
						disabled={kommentar === ''}
						onSubmit={lagreEndring}
						onAvbryt={closeModal}
						center
					/>
				</div>
			</DollyModal>
		</ErrorBoundary>
	)
}
