import React from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import _get from 'lodash/get'

export const AvslagEllerBortfall = ({ oppholdsstatus }) =>
	oppholdsstatus?.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum?.avslagEllerBortfall ? (
		<>
			<h4>Avslag eller bortfall</h4>
			<div className="person-visning_content">
				<TitleValue
					title="Avgjørelsesdato"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avgjorelsesDato'
						)
					)}
				/>
				<TitleValue
					title="Avslag grunnlag øvrig"
					value={Formatters.showLabel(
						'avslagGrunnlagOverig',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagGrunnlagOverig'
						)
					)}
				/>
				<TitleValue
					title="Tillatelsesgrunnlag"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagGrunnlagTillatelseGrunnlagEOS'
						)
					)}
				/>
				<TitleValue
					title="Oppholdsrett behandlet"
					value={Formatters.showLabel(
						'avslagOppholdsrettBehandlet',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdsrettBehandlet'
						)
					)}
				/>
				<TitleValue
					title="Oppholdsrett grunnlag"
					value={Formatters.showLabel(
						'avslagGrunnlagTillatelseGrunnlagEOS',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagEOS'
						)
					)}
				/>
				<TitleValue
					title="Behandlet utreisefrist"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseBehandletUtreiseFrist'
						)
					)}
				/>
				<TitleValue
					title="Utreisefrist"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseUtreiseFrist'
						)
					)}
				/>
				<TitleValue
					title="Bortfallsdato"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.bortfallAvPOellerBOSDato'
						)
					)}
				/>
				<TitleValue
					title="Tilbakekall utreisefrist"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.tilbakeKallUtreiseFrist'
						)
					)}
				/>
				<TitleValue
					title="Vedtak utreisefrist"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.formeltVedtakUtreiseFrist'
						)
					)}
				/>
				<TitleValue
					title="Tilbakekall virkningsdato"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.tilbakeKallVirkningsDato'
						)
					)}
				/>
			</div>
		</>
	) : null
