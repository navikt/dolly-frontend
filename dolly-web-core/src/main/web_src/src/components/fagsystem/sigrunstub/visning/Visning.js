import React from 'react'
import _get from 'lodash/get'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import Formatters from '~/utils/DataFormatter'
import Loading from '~/components/ui/loading/Loading'

export const SigrunstubVisning = ({ data, loading, visTittel = true }) => {
	if (loading) return <Loading label="laster sigrunstub-data" />
	if (!data || data.length === 0) return false
	const grunnlag = data[0].grunnlag.length > 0
	const svalbardGrunnlag = data[0].svalbardGrunnlag.length > 0

	return (
		<div>
			{visTittel && <SubOverskrift label="Inntekt" iconKind="sigrun" />}
			<div className="person-visning_content">
				{grunnlag && (
					<DollyFieldArray title="Fastlands-Norge" data={data[0].grunnlag} nested>
						{(inntekt, idx) => (
							<React.Fragment key={idx}>
								<TitleValue title="Inntektsår" value={inntekt.inntektsaar} />
								<TitleValue title="Tjeneste" value={inntekt.tjeneste} />
								<TitleValue
									title="Type inntekt"
									value={inntekt.grunnlag}
									kodeverk={inntekt.tjeneste}
								/>
								<TitleValue title="Beløp" value={inntekt.verdi} />
							</React.Fragment>
						)}
					</DollyFieldArray>
				)}
				{svalbardGrunnlag && (
					<DollyFieldArray title="Svalbard" data={data[0].svalbardGrunnlag} nested>
						{(inntekt, idx) => (
							<React.Fragment key={idx}>
								<TitleValue title="Inntektsår" value={inntekt.inntektsaar} />
								<TitleValue title="Tjeneste" value={inntekt.tjeneste} />
								<TitleValue
									title="Type inntekt"
									value={inntekt.grunnlag}
									kodeverk={inntekt.tjeneste}
								/>
								<TitleValue title="Beløp" value={inntekt.verdi} />
							</React.Fragment>
						)}
					</DollyFieldArray>
				)}
			</div>
		</div>
	)
}
