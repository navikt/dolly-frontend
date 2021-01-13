import React from 'react'
import { AdresseKodeverk } from '~/config/kodeverk'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'

const Statsborgerskap = ({ statsborgerskap }) => (
	<div className="person-visning_content">
		<TitleValue
			title="Statsborgerskap"
			kodeverk={AdresseKodeverk.StatsborgerskapLand}
			value={statsborgerskap.land}
		/>
		<TitleValue
			title="Statsborgerskap fra"
			value={Formatters.formatDate(statsborgerskap.gyldigFraOgMed)}
		/>
	</div>
)

export const PdlNasjonalitet = ({ data, visTittel = true }) => {
	const { statsborgerskap, innflyttingTilNorge } = data

	return (
		<div>
			{visTittel && <SubOverskrift label="Nasjonalitet" iconKind="nasjonalitet" />}
			<div className="person-visning_content">
				{statsborgerskap && statsborgerskap.length > 1 ? (
					<ErrorBoundary>
						<DollyFieldArray data={statsborgerskap} header="Statsborgerskap" nested>
							{(statsborgerskap, idx) => <Statsborgerskap statsborgerskap={statsborgerskap} />}
						</DollyFieldArray>
					</ErrorBoundary>
				) : (
					<Statsborgerskap statsborgerskap={statsborgerskap[0]} />
				)}
			</div>

			{innflyttingTilNorge && innflyttingTilNorge.length > 0 && (
				<ErrorBoundary>
					<DollyFieldArray data={innflyttingTilNorge} header={'Innvandret/utvandret'} nested>
						{(id, idx) => (
							<React.Fragment>
								<>
									<TitleValue
										title="Fraflyttingsland"
										value={innflyttingTilNorge[idx].fraflyttingsland}
									/>
								</>
							</React.Fragment>
						)}
					</DollyFieldArray>
				</ErrorBoundary>
			)}
		</div>
	)
}
