import React from 'react'
import '~/pages/gruppe/PersonVisning/PersonMiljoeinfo/DataVisning.less'
// @ts-ignore
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import { Detaljer } from '~/components/fagsystem/organisasjoner/visning/Detaljer'

type OrganisasjonData = {
	data: Array<Data>
}

type Data = {
	0: Array<Record<string, any>>
}

export const OrganisasjonDataVisning = ({ data }: OrganisasjonData) => {
	if (!data) return null
	const sortedData = { ...data }
	console.log(sortedData)
	const environments = Object.keys(sortedData).sort() //TODO: må fikse!
	const organisasjoner = Object.values(sortedData)

	const getOrganisasjonInfo = miljoe => {
		return (
			<div className="boks">
				<Detaljer data={[organisasjoner[environments.indexOf(miljoe)]]} />
			</div>
		)
	}

	return (
		<div className="flexbox--flex-wrap">
			{environments.map((miljoe, idx) => {
				return (
					<Tooltip
						overlay={getOrganisasjonInfo(miljoe)}
						placement="top"
						align={{
							offset: ['0', '-10']
						}}
						mouseEnterDelay={0.1}
						mouseLeaveDelay={0.1}
						arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
						key={idx}
						overlayStyle={{ opacity: 1 }}
					>
						<div className="miljoe-knapp">{miljoe.toUpperCase()}</div>
					</Tooltip>
				)
			})}
		</div>
	)
}
