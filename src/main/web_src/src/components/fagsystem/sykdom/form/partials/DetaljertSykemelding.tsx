import React from 'react'
import { FormikProps } from 'formik'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { FormikCheckbox } from '~/components/ui/form/inputs/checbox/Checkbox'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { OrganisasjonMedArbeidsforholdSelect } from '~/components/organisasjonSelect'
import { SelectOptionsDiagnoser } from './SelectOptionsDiagnoser'
import LegeSelect from './LegeSelect'
import { ArbeidKodeverk } from '~/config/kodeverk'

interface SykemeldingForm {
	formikBag: FormikProps<{}>
}

type DiagnoseSelect = {
	diagnoseNavn: string
}

type LegeSelect = {
	etternavn: string
	fnr: string
	fornavn: string
	hprId: string
	mellomnavn?: string
}

type ArbeidsgiverSelect = {
	forretningsAdresse: {
		adresse: string
		landkode: string
		postnr: string
		poststed: string
	}
	navn: string
	orgnr: string
}

const initialValuesDiagnose = {
	diagnose: '',
	diagnosekode: '',
	system: ''
}

const initialValuesPeriode = {
	aktivitet: {
		aktivitet: null as string,
		behandlingsdager: 0,
		grad: 0,
		reisetilskudd: false
	},
	fom: '',
	tom: ''
}

export const DetaljertSykemelding = ({ formikBag }: SykemeldingForm) => {
	const handleDiagnoseChange = (v: DiagnoseSelect, path: string) => {
		formikBag.setFieldValue(`${path}.diagnose`, v.diagnoseNavn)
		formikBag.setFieldValue(`${path}.system`, '2.16.578.1.12.4.1.1.7170')
	}

	const handleLegeChange = (v: LegeSelect) => {
		formikBag.setFieldValue('sykemelding.detaljertSykemelding.lege', {
			etternavn: v.etternavn,
			fornavn: v.fornavn,
			hprId: v.hprId,
			ident: v.fnr,
			mellomnavn: v.mellomnavn
		})
	}

	const handleArbeidsgiverChange = (v: ArbeidsgiverSelect) => {
		formikBag.setFieldValue('sykemelding.detaljertSykemelding.mottaker', {
			navn: v.navn,
			orgNr: v.orgnr,
			adresse: {
				by: v.forretningsAdresse.poststed,
				gate: v.forretningsAdresse.adresse,
				land: v.forretningsAdresse.landkode,
				postnummer: v.forretningsAdresse.postnr
			}
		})
	}

	return (
		<div className="flexbox--wrap">
			<div className="flexbox--flex-wrap">
				<FormikDatepicker name="sykemelding.detaljertSykemelding.startDato" label="Startdato" />
				<FormikCheckbox
					name="sykemelding.detaljertSykemelding.umiddelbarBistand"
					label="Trenger umiddelbar bistand"
					size="medium"
					checkboxMargin
				/>
				<FormikCheckbox
					name="sykemelding.detaljertSykemelding.manglendeTilretteleggingPaaArbeidsplassen"
					label="Manglende tilrettelegging på arbeidsplassen"
					size="large"
					checkboxMargin
				/>
			</div>
			<Kategori title="Diagnose" vis="sykemelding">
				<div className="flexbox--flex-wrap">
					<FormikSelect
						name="sykemelding.detaljertSykemelding.hovedDiagnose.diagnosekode"
						label="Diagnose"
						options={SelectOptionsDiagnoser()}
						afterChange={(v: DiagnoseSelect) =>
							handleDiagnoseChange(v, 'sykemelding.detaljertSykemelding.hovedDiagnose')
						}
						size="xlarge"
						isClearable={false}
					/>
				</div>
			</Kategori>
			<FormikDollyFieldArray
				name="sykemelding.detaljertSykemelding.biDiagnoser"
				header="Bidiagnose"
				newEntry={initialValuesDiagnose}
			>
				{(path: string) => (
					<FormikSelect
						name={`${path}.diagnosekode`}
						label="Diagnose"
						options={SelectOptionsDiagnoser()}
						afterChange={(v: DiagnoseSelect) => handleDiagnoseChange(v, path)}
						size="xlarge"
						isClearable={false}
					/>
				)}
			</FormikDollyFieldArray>
			<Kategori title="Lege" vis="sykemelding">
				<LegeSelect
					name="sykemelding.detaljertSykemelding.lege.ident"
					label="Lege"
					afterChange={(v: LegeSelect) => handleLegeChange(v)}
				/>
			</Kategori>
			<Kategori title="Arbeidsgiver" vis="sykemelding">
				<OrganisasjonMedArbeidsforholdSelect
					path="sykemelding.detaljertSykemelding.arbeidsgiver.navn"
					label="Navn"
					afterChange={(v: ArbeidsgiverSelect) => handleArbeidsgiverChange(v)}
					valueNavn={true}
				/>
				<FormikSelect
					name="sykemelding.detaljertSykemelding.arbeidsgiver.yrkesbetegnelse"
					label="Yrkesbetegnelse"
					kodeverk={ArbeidKodeverk.Yrker}
					size="xxlarge"
					isClearable={false}
					optionHeight={50}
				/>
				<FormikTextInput
					name="sykemelding.detaljertSykemelding.arbeidsgiver.stillingsprosent"
					label="Stillingsprosent"
					type="number"
				/>
			</Kategori>
			<FormikDollyFieldArray
				name="sykemelding.detaljertSykemelding.perioder"
				header="Periode"
				newEntry={initialValuesPeriode}
			>
				{(path: string) => (
					<>
						<FormikDatepicker name={`${path}.fom`} label="F.o.m. dato" />
						<FormikDatepicker name={`${path}.tom`} label="T.o.m. dato" />
						<FormikSelect
							name={`${path}.aktivitet.aktivitet`}
							label="Aktivitet"
							options={Options('aktivitet')}
						/>
						<FormikTextInput
							name={`${path}.aktivitet.behandlingsdager`}
							label="Antall behandlingsdager"
							type="number"
						/>
						<FormikTextInput name={`${path}.aktivitet.grad`} label="Grad" type="number" />
						<FormikCheckbox
							name={`${path}.aktivitet.reisetilskudd`}
							label="Har reisetilskudd"
							checkboxMargin
						/>
					</>
				)}
			</FormikDollyFieldArray>
			<Kategori title="Detaljer" vis="sykemelding">
				<FormikTextInput
					name="sykemelding.detaljertSykemelding.detaljer.tiltakNav"
					label="Tiltak fra Nav"
					size="large"
				/>
				<FormikTextInput
					name="sykemelding.detaljertSykemelding.detaljer.tiltakArbeidsplass"
					label="Tiltak på arbeidsplass"
					size="large"
				/>
				<FormikTextInput
					name="sykemelding.detaljertSykemelding.detaljer.beskrivHensynArbeidsplassen"
					label="Hensyn på arbeidsplass"
					size="large"
				/>
				<FormikCheckbox
					name="sykemelding.detaljertSykemelding.detaljer.arbeidsforEtterEndtPeriode"
					label="Arbeidsfør etter endt periode"
					size="medium"
					checkboxMargin
				/>
			</Kategori>
		</div>
	)
}
