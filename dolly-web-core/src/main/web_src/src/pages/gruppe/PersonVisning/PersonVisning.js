import React from 'react'
import { useMount } from 'react-use'
import { TidligereBestillinger } from './TidligereBestillinger/TidligereBestillinger'
import { TpsfVisning } from '~/components/fagsystem/tpsf/visning/Visning'
import { KrrVisning } from '~/components/fagsystem/krrstub/visning/KrrVisning'
import Beskrivelse from '~/components/beskrivelse/BeskrivelseConnector'
import Button from '~/components/ui/button/Button'

import './PersonVisning.less'

export const PersonVisning = ({
	getDataFraFagsystemer,
	data,
	testIdent,
	bestilling,
	loading,
	gruppeId
}) => {
	useMount(getDataFraFagsystemer)

	return (
		<div className="person-visning">
			<TpsfVisning data={TpsfVisning.filterValues(data.tpsf, bestilling.tpsfKriterier)} />
			{/* <PdlfVisning data={data.pdlforvalter} loading={loading.pdlforvalter} /> */}
			{/* <SigrunVisning /> */}
			<KrrVisning data={data.krrstub} loading={loading.krrstub} />
			{/* <AaregVisning /> */}
			{/* <InstVisning /> */}
			{/* <ArenaVisning /> */}
			{/* <UdiVisning /> */}
			<TidligereBestillinger ids={testIdent.bestillingId} />
			<Beskrivelse ident={testIdent.ident} gruppeId={gruppeId} />
			<div className="flexbox--align-center--justify-end">
				<Button className="flexbox--align-center" kind="details">
					BESTILLINGSDETALJER
				</Button>
				<Button className="flexbox--align-center" kind="edit">
					REDIGER
				</Button>

				{/* Slett kan være modal med egen komponent */}
				<Button className="flexbox--align-center" kind="trashcan">
					SLETT
				</Button>
			</div>
		</div>
	)
}
