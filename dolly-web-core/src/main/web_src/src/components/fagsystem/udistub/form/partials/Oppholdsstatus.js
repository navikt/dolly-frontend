import React, { useState } from 'react'
import _get from 'lodash/get'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { DollySelect } from '~/components/ui/form/inputs/select/Select'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'

export const Oppholdsstatus = ({ formikBag }) => {
	const [oppholdsstatus, setOppholdsstatus] = useState('')
	const [eosEllerEFTAtypeOpphold, setEosEllerEFTAtypeOpphold] = useState('')
	const [tredjelandsBorgereValg, setTredjelandsBorgereValg] = useState('')

	const oppholdsstatusInitialValues = _get(formikBag.initialValues, 'udistub.oppholdStatus')

	const endreOppholdsstatus = value => {
		setOppholdsstatus(value)
		setEosEllerEFTAtypeOpphold('')
		setTredjelandsBorgereValg('')
		formikBag.setFieldValue('udistub.oppholdStatus', oppholdsstatusInitialValues)
	}

	const endreEosEllerEFTAtypeOpphold = value => {
		setEosEllerEFTAtypeOpphold(value)
		formikBag.setFieldValue('udistub.oppholdStatus', oppholdsstatusInitialValues)
		formikBag.setFieldValue(`udistub.oppholdStatus.${value}Periode`, {
			fra: '',
			til: ''
		})
		formikBag.setFieldValue(`udistub.oppholdStatus.${value}Effektuering`, '')
	}

	const endreTredjelandsBorgereValg = value => {
		setTredjelandsBorgereValg(value)
		formikBag.setFieldValue('udistub.oppholdStatus', oppholdsstatusInitialValues)
		if (value === 'oppholdSammeVilkaar') {
			formikBag.setFieldValue('udistub.harOppholdsTillatelse', '')
			formikBag.setFieldValue('udistub.oppholdStatus.oppholdSammeVilkaar', {
				oppholdSammeVilkaarPeriode: { fra: '', til: '' },
				oppholdSammeVilkaarEffektuering: '',
				oppholdstillatelseVedtaksDato: ''
			})
		} else if (value === 'ikkeOppholdSammeVilkaar') {
			formikBag.setFieldValue('udistub.oppholdStatus', oppholdsstatusInitialValues)
			formikBag.setFieldValue('udistub.harOppholdsTillatelse', false)
		} else if (value === 'UAVKLART') {
			formikBag.setFieldValue('udistub.oppholdStatus', { uavklart: true })
			formikBag.setFieldValue('udistub.harOppholdsTillatelse', '')
		}
	}

	return (
		<Kategori title="Gjeldende oppholdsstatus" vis={pathAttrs.kategori.opphold}>
			<DollySelect
				name="oppholdsstatus"
				label="Oppholdsstatus"
				value={oppholdsstatus}
				options={Options('oppholdsstatus')}
				onChange={v => endreOppholdsstatus(v.value)}
				isClearable={false}
			/>
			{oppholdsstatus === 'eosEllerEFTAOpphold' && (
				<React.Fragment>
					<DollySelect
						name="eosEllerEFTAtypeOpphold"
						label="Type opphold"
						value={eosEllerEFTAtypeOpphold}
						options={Options('eosEllerEFTAtypeOpphold')}
						onChange={v => endreEosEllerEFTAtypeOpphold(v.value)}
						size="xxlarge"
						isClearable={false}
					/>
					<FormikDatepicker
						name={`udistub.oppholdStatus.${eosEllerEFTAtypeOpphold}Periode.fra`}
						label="Oppholdstillatelse fra dato"
					/>
					<FormikDatepicker
						name={`udistub.oppholdStatus.${eosEllerEFTAtypeOpphold}Periode.til`}
						label="Oppholdstillatelse til dato"
					/>
					<FormikDatepicker
						name={`udistub.oppholdStatus.${eosEllerEFTAtypeOpphold}Effektuering`}
						label="Effektueringsdato"
					/>

					<FormikSelect
						name={`udistub.oppholdStatus.${eosEllerEFTAtypeOpphold}`}
						label="Grunnlag for opphold"
						options={Options(eosEllerEFTAtypeOpphold)}
						isClearable={false}
					/>
				</React.Fragment>
			)}
			{oppholdsstatus === 'tredjelandsBorgere' && (
				<React.Fragment>
					<DollySelect
						name="tredjelandsBorgereValg"
						label="Status"
						value={tredjelandsBorgereValg}
						size="xxlarge"
						options={Options('tredjelandsBorgereValg')}
						onChange={v => endreTredjelandsBorgereValg(v.value)}
					/>
					{tredjelandsBorgereValg === 'oppholdSammeVilkaar' && (
						<React.Fragment>
							<FormikDatepicker
								name="udistub.oppholdStatus.oppholdSammeVilkaar.oppholdSammeVilkaarPeriode.fra"
								label="Oppholdstillatelse fra dato"
							/>
							<FormikDatepicker
								name="udistub.oppholdStatus.oppholdSammeVilkaar.oppholdSammeVilkaarPeriode.til"
								label="Oppholdstillatelse til dato"
							/>
							<FormikDatepicker
								name="udistub.oppholdStatus.oppholdSammeVilkaar.oppholdSammeVilkaarEffektuering"
								label="Effektueringsdato"
							/>
							<FormikSelect
								name="udistub.oppholdStatus.oppholdSammeVilkaar.oppholdstillatelseType"
								label="Type oppholdstillatelse"
								options={Options('oppholdstillatelseType')}
							/>
							<FormikDatepicker
								name="udistub.oppholdStatus.oppholdSammeVilkaar.oppholdstillatelseVedtaksDato"
								label="Vedtaksdato"
							/>
						</React.Fragment>
					)}
				</React.Fragment>
			)}
		</Kategori>
	)
}
