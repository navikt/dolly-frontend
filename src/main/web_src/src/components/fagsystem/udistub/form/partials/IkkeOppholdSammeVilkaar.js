import React from 'react'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'

export const IkkeOppholdSammeVilkaar = () => (
	<div className="flexbox--flex-wrap">
		<div className="input--fullbredde">
			<h5> Avslag eller bortfall </h5>
		</div>

		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avgjorelsesDato'
			}
			label="Avgjørelsesdato"
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagGrunnlagOverig'
			}
			label="Grunnlag for avslag"
			options={Options('avslagGrunnlagOverig')}
			size="large"
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagGrunnlagTillatelseGrunnlagEOS'
			}
			label="Tillatelsesgrunnlag EOS"
			options={Options('avslagGrunnlagTillatelseGrunnlagEOS')}
			size="large"
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdsrettBehandlet'
			}
			label="Oppholdsrett behandlet"
			options={Options('avslagOppholdsrettBehandlet')}
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagEOS'
			}
			label="Behandlet tillatelsesgrunnlag"
			options={Options('avslagGrunnlagTillatelseGrunnlagEOS')}
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagOvrig'
			}
			label="Behandlet grunnlag for avslag"
			options={Options('avslagGrunnlagOverig')}
			size="large"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseUtreiseFrist'
			}
			label="Utreisefrist"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.avslagOppholdstillatelseBehandletUtreiseFrist'
			}
			label="Behandlet utreisefrist"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.bortfallAvPOellerBOSDato'
			}
			label="Bortfall av PO eller BOS"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.tilbakeKallUtreiseFrist'
			}
			label="Tilbakekall utreisefrist"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.formeltVedtakUtreiseFrist'
			}
			label="Formelt vedtak utreisefrist"
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.avslagEllerBortfall.tilbakeKallVirkningsDato'
			}
			label="Tilbakekall virkningsdato"
		/>

		<div className="input--fullbredde">
			<h5> Utvist med innreiseforbud </h5>
		</div>

		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbud'
			}
			label="Innreiseforbud"
			options={Options('jaNeiUavklart')}
		/>
		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.varighet'
			}
			label="Varighet"
			options={Options('varighet')}
		/>
		<FormikDatepicker
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbudVedtaksDato'
			}
			label="Innreiseforbud vedtaksdato"
		/>

		<div className="input--fullbredde">
			<h5> Diverse </h5>
		</div>

		<FormikSelect
			name={
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.ovrigIkkeOppholdsKategoriArsak'
			}
			label="Ikke-opphold kategori årsak"
			options={Options('ovrigIkkeOppholdsKategoriArsak')}
		/>
	</div>
)
