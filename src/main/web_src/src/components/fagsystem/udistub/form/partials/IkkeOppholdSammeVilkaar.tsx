import React from 'react'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import _get from 'lodash/get'

export const IkkeOppholdSammeVilkaar = ({ formikBag }: any) => (
	<div className="flexbox--flex-wrap">
		<Kategori title={'Avslag eller bortfall'}>
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
		</Kategori>

		<Kategori title={'Utvist med innreiseforbud'}>
			<FormikSelect
				name={
					'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbud'
				}
				label="Innreiseforbud"
				options={Options('jaNeiUavklart')}
			/>

			{_get(
				formikBag,
				'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbud'
			)?.includes('JA') ? (
				<>
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
				</>
			) : null}
		</Kategori>

		<Kategori title={'Diverse'}>
			<FormikSelect
				name={
					'udistub.oppholdStatus.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.ovrigIkkeOppholdsKategoriArsak'
				}
				label="Ikke-opphold kategori årsak"
				options={Options('ovrigIkkeOppholdsKategoriArsak')}
			/>
		</Kategori>
	</div>
)
