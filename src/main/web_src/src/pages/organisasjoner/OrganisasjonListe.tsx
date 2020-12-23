import React from 'react'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import DollyTable from '~/components/ui/dollyTable/DollyTable'
import { OrganisasjonItem } from '~/components/ui/icon/IconItem'
import Icon from '~/components/ui/icon/Icon'

export default function OrganisasjonListe({ orgListe }) {
	if (!orgListe) {
		return null
	}
	console.log(orgListe)
	const columns = [
		{
			text: 'Orgnr.',
			width: '20',
			dataField: 'organisasjonsnummer',
			unique: true,

			formatter: (cell, row) => (
				<div className="identnummer-cell">
					{row.organisasjonsnummer}
					<CopyToClipboard text={row.organisasjonsnummer}>
						<Tooltip
							overlay={'Kopier'}
							placement="top"
							destroyTooltipOnHide={true}
							mouseEnterDelay={0}
							mouseLeaveDelay={0.1}
							arrowContent={<div className="rc-tooltip-arrow-inner"> </div>}
							align={{
								offset: ['0', '-10']
							}}
						>
							<div
								className="icon"
								onClick={event => {
									event.stopPropagation()
								}}
							>
								<Icon kind="copy" size={15} />
							</div>
						</Tooltip>
					</CopyToClipboard>
				</div>
			)
		},
		{
			text: 'Navn',
			width: '30',
			dataField: 'organisasjonsnavn'
		},
		{
			text: 'Enhetstype',
			width: '15',
			dataField: 'enhetstype'
		},
		{
			text: 'Bestilling-ID',
			width: '20',
			dataField: 'bestillingId'
		},
		{
			text: 'Orgforvalter-ID',
			width: '20',
			dataField: 'id'
		},
		{
			text: 'Status',
			width: '10',
			dataField: 'status'
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
