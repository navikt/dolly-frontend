import React from 'react'
import { DollySelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'

export const IkkeOppholdSammeVilkaar = path => (
	<div className="flexbox--flex-wrap">
		<div className="input--fullbredde">
			<h5> Avslag eller bortfall </h5>
		</div>

		<FormikDatepicker
			name={path + '.avslagEllerBortfall.avgjorelsesDato'}
			label="Avgjørelsesdato"
		/>
		<DollySelect
			name={path + '.avslagEllerBortfall.avslagGrunnlagOverig'}
			label="Grunnlag for avslag"
			options={Options('avslagGrunnlagOverig')}
			size="large"
		/>
		<DollySelect
			name={path + '.avslagEllerBortfall.avslagGrunnlagTillatelseGrunnlagEOS'}
			label="Tillatelsesgrunnlag EOS"
			options={Options('avslagGrunnlagTillatelseGrunnlagEOS')}
			size="large"
		/>
		<DollySelect
			name={path + '.avslagEllerBortfall.avslagOppholdsrettBehandlet'}
			label="Oppholdsrett behandlet"
			options={Options('avslagOppholdsrettBehandlet')}
		/>
		<DollySelect
			name={path + '.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagEOS'}
			label="Behandlet tillatelsesgrunnlag"
			options={Options('avslagGrunnlagTillatelseGrunnlagEOS')}
		/>
		<DollySelect
			name={path + '.avslagEllerBortfall.avslagOppholdstillatelseBehandletGrunnlagOvrig'}
			label="Behandlet grunnlag for avslag"
			options={Options('avslagGrunnlagTillatelseGrunnlagEOS')}
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.avslagOppholdstillatelseUtreiseFrist'}
			label="Utreisefrist"
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.avslagOppholdstillatelseBehandletUtreiseFrist'}
			label="Behandlet utreisefrist"
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.bortfallAvPOellerBOSDato'}
			label="Bortfall av PO eller BOS"
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.tilbakeKallUtreiseFrist'}
			label="Tilbakekall utreisefrist"
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.formeltVedtakUtreiseFrist'}
			label="Formelt vedtak utreisefrist"
		/>
		<FormikDatepicker
			name={path + '.avslagEllerBortfall.tilbakeKallVirkningsDato'}
			label="Tilbakekall virkningsdato"
		/>

		<div className="input--fullbredde">
			<h5> Utvist med innreiseforbud </h5>
		</div>

		<DollySelect
			name={path + '.utvistMedInnreiseForbud.innreiseForbud'}
			label="Innreiseforbud"
			options={Options('jaNeiUavklart')}
		/>
		<DollySelect
			name={path + '.utvistMedInnreiseForbud.varighet'}
			label="Varighet"
			options={Options('varighet')}
		/>
		<FormikDatepicker
			name={path + '.utvistMedInnreiseForbud.innreiseForbudVedtaksDato'}
			label="Innreiseforbud vedtaksdato"
		/>

		<div className="input--fullbredde">
			<h5> Diverse </h5>
		</div>

		<DollySelect
			name={path + '.ovrigIkkeOppholdsKategoriArsak'}
			label="Ikke-opphold kategori årsak"
			options={Options('ovrigIkkeOppholdsKategoriArsak')}
		/>
	</div>
)
