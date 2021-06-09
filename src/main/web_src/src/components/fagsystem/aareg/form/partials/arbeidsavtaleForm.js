import React, { useState } from 'react'
import _get from 'lodash/get'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { ToggleGruppe, ToggleKnapp } from '~/components/ui/toggle/Toggle'
import Hjelpetekst from '~/components/hjelpetekst'
import { ArbeidKodeverk } from '~/config/kodeverk'
import { ArbeidsgiverTyper } from '~/components/fagsystem/aareg/AaregTypes'

export const ArbeidsavtaleForm = ({ formikBag, path, onChangeLenket }) => {
	return (
		<div>
			<h3>Ansettelsesdetaljer</h3>
			<div className="flexbox--flex-wrap">
				<FormikSelect
					name={`${path}.yrke`}
					label="Yrke"
					kodeverk={ArbeidKodeverk.Yrker}
					size="xxlarge"
					isClearable={false}
					optionHeight={50}
					onChange={onChangeLenket('arbeidsavtale.yrke')}
				/>
				<FormikSelect
					name={`${path}.ansettelsesform`}
					label="Ansettelsesform"
					kodeverk={ArbeidKodeverk.AnsettelsesformAareg}
					onChange={onChangeLenket('arbeidsavtale.ansettelsesform')}
				/>
				<FormikTextInput
					name={`${path}.stillingsprosent`}
					label="Stillingsprosent"
					type="number"
					onChange={onChangeLenket('arbeidsavtale.stillingsprosent')}
				/>
				<FormikDatepicker
					name={`${path}.endringsdatoStillingsprosent`}
					label="Endringsdato stillingsprosent"
					onChange={onChangeLenket('arbeidsavtale.endringsdatoStillingsprosent')}
				/>
				<FormikDatepicker
					name={`${path}.endringsdatoLoenn`}
					label="Endringsdato lønn"
					onChange={onChangeLenket('arbeidsavtale.endringsdatoLoenn')}
				/>
				<FormikSelect
					name={`${path}.arbeidstidsordning`}
					label="Arbeidstidsordning"
					kodeverk={ArbeidKodeverk.Arbeidstidsordninger}
					size="xxlarge"
					isClearable={false}
					onChange={onChangeLenket('arbeidsavtale.arbeidstidsordning')}
				/>
				<FormikTextInput
					name={`${path}.avtaltArbeidstimerPerUke`}
					label="Avtalte arbeidstimer per uke"
					type="number"
					isclearable="true"
					onChange={onChangeLenket('arbeidsavtale.avtaltArbeidstimerPerUke')}
				/>
			</div>
		</div>
	)
}
