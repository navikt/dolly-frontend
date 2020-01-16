import React from 'react'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'

export const Aliaser = ({ aliaser }) => {
	if (!aliaser || aliaser.length === 0) return null

	return (
		<div>
			<h4>Aliaser</h4>
			<DollyFieldArray data={aliaser}>
				{(alias, idx) => (
					<div key={idx} className="person-visning_content">
						<TitleValue title="FNR/DNR" value={alias.fnr} />
						<TitleValue title="Fornavn" value={alias.navn.fornavn} />
						<TitleValue title="Mellomnavn" value={alias.navn.mellomnavn} />
						<TitleValue title="Etternavn" value={alias.navn.etternavn} />
					</div>
				)}
			</DollyFieldArray>
		</div>
	)
}
