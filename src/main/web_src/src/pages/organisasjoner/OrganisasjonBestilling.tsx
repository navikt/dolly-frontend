import React from 'react'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import DollyTable from '~/components/ui/dollyTable/DollyTable'
import { OrganisasjonItem } from '~/components/ui/icon/IconItem'

export default function OrganisasjonBestilling({ orgListe }) {
	if (!orgListe) {
		return null
	}
	console.log(orgListe)
	const columns = [
		{
			text: 'ID.',
			width: '10',
			dataField: 'id',
			unique: true
		},
		{
			text: 'Antall',
			width: '10',
			dataField: 'antallLevert'
		},
		{
			text: 'Sist oppdatert',
			width: '20',
			dataField: 'sistOppdatert'
		},
		{
			text: 'Miljø',
			width: '15',
			dataField: 'environments'
		},
		{
			text: 'Orgnr.',
			width: '15',
			dataField: 'status[0].organisasjonsnummer',
			unique: true
		},
		{
			text: 'Status',
			width: '10',
			dataField: 'status[0].organisasjonsforvalterStatus'
		}
	]

	return (
		<ErrorBoundary>
			<DollyTable
				data={orgListe}
				columns={columns}
				pagination
				iconItem={<OrganisasjonItem />}
				onExpand={null}
			/>
		</ErrorBoundary>
	)
}
