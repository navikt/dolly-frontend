import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import Loading from '~/components/ui/loading/Loading'
import Formatters from '~/utils/DataFormatter'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { Arbeidsavtaler } from './partials/Arbeidsavtaler'
import { Arbeidsgiver } from './partials/Arbeidsgiver'
import { PermisjonPermitteringer } from './partials/PermisjonPermitteringer'
import { AntallTimerForTimeloennet } from './partials/AntallTimerForTimeloennet'
import { Utenlandsopphold } from './partials/Utenlandsopphold'

export const AaregVisning = ({ data, loading }) => {
	if (loading) return <Loading label="Laster Aareg-data" />
	if (!data) return false

	return (
		<div>
			<SubOverskrift label="Arbeidsforhold" iconKind="arbeid" />
			<DollyFieldArray title="Arbeidsforhold" data={data}>
				{(id, idx) => (
					<React.Fragment>
						<div className="person-visning_content">
							{id.ansettelsesperiode && (
								<TitleValue
									title="Arbeidsforhold type"
									value={id.type}
									kodeverk="Arbeidsforholdstyper"
								/>
							)}

							{id.ansettelsesperiode && id.ansettelsesperiode.periode && (
								<TitleValue
									title="Startdato"
									value={Formatters.formatStringDates(id.ansettelsesperiode.periode.fom)}
								/>
							)}
							{id.ansettelsesperiode && id.ansettelsesperiode.periode && (
								<TitleValue
									title="Sluttdato"
									value={Formatters.formatStringDates(id.ansettelsesperiode.periode.tom)}
								/>
							)}
						</div>

						<AntallTimerForTimeloennet data={id.antallTimerForTimeloennet} />

						<Arbeidsavtaler data={id.arbeidsavtaler} />

						<Arbeidsgiver data={id.arbeidsgiver} />

						<PermisjonPermitteringer data={id.permisjonPermitteringer} />

						<Utenlandsopphold data={id.utenlandsopphold} />
					</React.Fragment>
				)}
			</DollyFieldArray>
		</div>
	)
}