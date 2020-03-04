import React, { useState } from 'react'
import { api } from './api'
import Button from '~/components/ui/button/Button'
import { TextInput } from '~/components/ui/form/inputs/textInput/TextInput'

export const EndreMalnavn = ({ malInfo, setMaler, avbrytRedigering }) => {
	const { malNavn, id } = malInfo
	const [nyttMalnavn, setMalnavn] = useState(malNavn)

	return (
		<div className="endreMalnavn">
			<TextInput
				name="malnavn"
				value={nyttMalnavn}
				onChange={e => setMalnavn(e.target.value)}
				className="navnInput"
			/>
			<Button onClick={() => lagreEndring(nyttMalnavn, setMaler, id, avbrytRedigering)}>
				LAGRE
			</Button>
		</div>
	)
}

const lagreEndring = (nyttMalnavn, setMaler, id, avbrytRedigering) => {
	api
		.endreMalNavn(id, nyttMalnavn)
		.then(() =>
			setMaler(maler =>
				maler.map(mal => ({ ...mal, malNavn: mal.id === id ? nyttMalnavn : mal.malNavn }))
			)
		)
		.then(avbrytRedigering(id))
}
