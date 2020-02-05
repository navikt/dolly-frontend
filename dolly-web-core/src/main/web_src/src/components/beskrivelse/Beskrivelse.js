import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import Loading from '~/components/ui/loading/Loading'

import { TextEditor } from '~/components/ui/form/inputs/textEditor/TextEditor'

export const Beskrivelse = ({ ident, updateBeskrivelse, isUpdatingBeskrivelse }) => {
	if (isUpdatingBeskrivelse) return <Loading label="oppdaterer beskrivelse" />

	const handleSubmit = value => updateBeskrivelse(ident.ident, value)

	return (
		<React.Fragment>
			<SubOverskrift label="Kommentarer" iconKind="kommentar" />
			<TextEditor
				text={ident.beskrivelse}
				handleSubmit={handleSubmit}
				placeholder="Skriv inn kommentar"
			/>
		</React.Fragment>
	)
}