import React from 'react'

import './OrganisasjonDetaljer.less'
import OrganisasjonerMiljoeStatus from '~/pages/organisasjoner/detaljer/OrganisasjonerMiljoeStatus'

export default function OrganisasjonDetaljer({ bestilling }) {
	return (
		<div className="bestilling-detaljer">
			<OrganisasjonerMiljoeStatus bestilling={bestilling} />
		</div>
	)
}
