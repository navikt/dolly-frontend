import React from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'

type AvslagEllerBortfall = {
	avslagEllerBortfall: {
		avgjorelsesDato: string
		avslagGrunnlagOverig: string
		avslagGrunnlagTillatelseGrunnlagEOS: string
		avslagOppholdsrettBehandlet: string
		avslagOppholdstillatelseBehandletGrunnlagEOS: string
		avslagOppholdstillatelseBehandletGrunnlagOvrig: string
		avslagOppholdstillatelseBehandletUtreiseFrist: string
		avslagOppholdstillatelseUtreiseFrist: string
		bortfallAvPOellerBOSDato: string
		tilbakeKallUtreiseFrist: string
		formeltVedtakUtreiseFrist: string
		tilbakeKallVirkningsDato: string
	}
}

export const AvslagEllerBortfall = (avslagEllerBortfall: AvslagEllerBortfall) =>
	Object.values(avslagEllerBortfall).some(item => item !== null) && (
		<>
			<h4>Avslag eller bortfall</h4>
			<div className="person-visning_content">
				<TitleValue
					title="Avgjørelsesdato"
					value={Formatters.formatDate(avslagEllerBortfall.avslagEllerBortfall.avgjorelsesDato)}
				/>
				<TitleValue
					title="Avslag grunnlag øvrig"
					value={Formatters.showLabel(
						'avslagGrunnlagOverig',
						avslagEllerBortfall.avslagEllerBortfall.avslagGrunnlagOverig
					)}
				/>
				<TitleValue
					title="Tillatelsesgrunnlag"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						avslagEllerBortfall.avslagEllerBortfall.avslagGrunnlagTillatelseGrunnlagEOS
					)}
				/>
				<TitleValue
					title="Oppholdsrett behandlet"
					value={Formatters.showLabel(
						'avslagOppholdsrettBehandlet',
						avslagEllerBortfall.avslagEllerBortfall.avslagOppholdsrettBehandlet
					)}
				/>
				<TitleValue
					title="Oppholdsrett grunnlag"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						avslagEllerBortfall.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagEOS
					)}
				/>
				<TitleValue
					title="Behandlet utreisefrist"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.avslagOppholdstillatelseBehandletUtreiseFrist
					)}
				/>
				<TitleValue
					title="Utreisefrist"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.avslagOppholdstillatelseUtreiseFrist
					)}
				/>
				<TitleValue
					title="Bortfallsdato"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.bortfallAvPOellerBOSDato
					)}
				/>
				<TitleValue
					title="Tilbakekall utreisefrist"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.tilbakeKallUtreiseFrist
					)}
				/>
				<TitleValue
					title="Vedtak utreisefrist"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.formeltVedtakUtreiseFrist
					)}
				/>
				<TitleValue
					title="Tilbakekall virkningsdato"
					value={Formatters.formatDate(
						avslagEllerBortfall.avslagEllerBortfall.tilbakeKallVirkningsDato
					)}
				/>
			</div>
		</>
	)
