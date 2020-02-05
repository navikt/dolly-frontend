import React from 'react'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import Loading from '~/components/ui/loading/Loading'

export const InstVisning = ({ data, loading }) => {
	if (loading) return <Loading label="laster inst data" />
	if (!data) return false

	return (
		<div>
			<SubOverskrift label="Institusjonsopphold" iconKind="institusjon" />
			<DollyFieldArray data={data} nested>
				{(opphold, idx) => (
					<div className="person-visning_content" key={idx}>
						<TitleValue
							title="Institusjonstype"
							value={Formatters.showLabel('institusjonstype', opphold.institusjonstype)}
						/>
						<TitleValue title="Startdato" value={Formatters.formatStringDates(opphold.startdato)} />
						<TitleValue
							title="Sluttdato"
							value={Formatters.formatStringDates(opphold.faktiskSluttdato)}
						/>
					</div>
				)}
			</DollyFieldArray>
		</div>
	)
}