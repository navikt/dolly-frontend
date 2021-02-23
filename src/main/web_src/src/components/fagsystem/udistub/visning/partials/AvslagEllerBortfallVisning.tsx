import React from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'

export type AvslagEllerBortfall = {
	avslagEllerBortfall: {
		avgjorelsesDato: string
		avslagGrunnlagOverig: string
		avslagGrunnlagTillatelseGrunnlagEOS: string
		avslagOppholdsrettBehandlet: string
		avslagOppholdstillatelseBehandletGrunnlagEOS: string
	}
}

export const AvslagEllerBortfallVisning = ({ avslagEllerBortfall }: AvslagEllerBortfall) =>
	avslagEllerBortfall && Object.values(avslagEllerBortfall).some(item => item !== null) ? (
		<>
			<h4>Avslag eller bortfall</h4>
			<div className="person-visning_content">
				<TitleValue
					title="Avgjørelsesdato"
					value={Formatters.formatDate(avslagEllerBortfall.avgjorelsesDato)}
				/>
				<TitleValue
					title="Avslag grunnlag øvrig"
					value={Formatters.showLabel(
						'avslagGrunnlagOverig',
						avslagEllerBortfall.avslagGrunnlagOverig
					)}
				/>
				<TitleValue
					title="Avslag tillatelsesgrunnlag"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						avslagEllerBortfall.avslagGrunnlagTillatelseGrunnlagEOS
					)}
				/>
				<TitleValue
					title="Avslag Oppholdsrett"
					value={Formatters.showLabel(
						'avslagOppholdsrettBehandlet',
						avslagEllerBortfall.avslagOppholdsrettBehandlet
					)}
				/>
				<TitleValue
					title="Avslag grunnlag EØS"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagEOS
					)}
				/>
			</div>
		</>
	) : null
