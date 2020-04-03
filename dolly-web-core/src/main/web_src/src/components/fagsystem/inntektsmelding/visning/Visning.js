import React from 'react'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import Loading from '~/components/ui/loading/Loading'

export const InntektsmeldingVisning = ({ bestilling, loading }) => {
	// export const InntektsmeldingVisning = ({ data, loading }) => {
	// if (loading) return <Loading label="laster inntektsmelding data" />
	// if (!data) return false

	// Midlertidig løsning der vi viser bestilte verdier istedenfor å lese tilbake fra kilde.
	// Data hentes egentlig som prop. Husk å fjerne at bestilling sendes fra PersonVisning.js også

	if (!bestilling.inntektsmelding) return false
	const data = bestilling.inntektsmelding
	return (
		<div>
			<SubOverskrift label="Inntektsmelding (fra Altinn)" iconKind="inntektsmelding" />
			<DollyFieldArray data={data.inntekter} nested>
				{(inntekt, idx) => (
					<div className="person-visning_content" key={idx}>
						<TitleValue title="Beløp" value={inntekt.beloep} />
						<TitleValue
							title="Innsendingstidspunkt"
							value={Formatters.formatStringDates(inntekt.dato)}
						/>
						<TitleValue title="Virksomhet" value={inntekt.orgnummer} />
						<TitleValue title="Opplysningspliktig virksomhet" value={inntekt.virksomhetsnummer} />
					</div>
				)}
			</DollyFieldArray>
		</div>
	)
}
