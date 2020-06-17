import React, { useState } from 'react'
import _get from 'lodash/get'
import { FormikProps } from 'formik'
import { RadioPanelGruppe } from 'nav-frontend-skjema'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { AdresseKodeverk } from '~/config/kodeverk'
import { GateadresseDetaljert } from './GateadresseDetaljert'

interface Gateadresse {
	formikBag: FormikProps<{}>
}

enum GateadresseTyper {
	TILFELDIG = 'TILFELDIG',
	POSTNR = 'POSTNR',
	KOMMUNENR = 'KOMMUNENR',
	GATE = 'GATE'
}

export const Gateadresse = ({ formikBag }: Gateadresse) => {
	const getState = () => {
		if (_get(formikBag.values, 'tpsf.midlertidigAdresse.gateadresseNrInfo')) {
			return _get(formikBag.values, 'tpsf.midlertidigAdresse.gateadresseNrInfo.nummertype')
		} else if (_get(formikBag.values, 'tpsf.midlertidigAdresse.norskAdresse.gatenavn')) {
			return GateadresseTyper.GATE
		} else return GateadresseTyper.TILFELDIG
	}

	const [gateAdresseType, setGateAdresseType] = useState(getState())

	const handleRadioChange = (v: any) => {
		const type = v.target.value
		setGateAdresseType(type)

		switch (type) {
			case GateadresseTyper.TILFELDIG:
				formikBag.setFieldValue('tpsf.midlertidigAdresse.norskAdresse', {
					tilleggsadresse: _get(
						formikBag.values,
						'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
					)
				})
				formikBag.setFieldValue('tpsf.midlertidigAdresse.gateadresseNrInfo', undefined)
				break
			case GateadresseTyper.POSTNR:
				formikBag.setFieldValue('tpsf.midlertidigAdresse.norskAdresse', {
					tilleggsadresse: _get(
						formikBag.values,
						'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
					)
				})
				formikBag.setFieldValue('tpsf.midlertidigAdresse.gateadresseNrInfo', {
					nummertype: GateadresseTyper.POSTNR,
					nummer: ''
				})
				break
			case GateadresseTyper.KOMMUNENR:
				formikBag.setFieldValue('tpsf.midlertidigAdresse.norskAdresse', {
					tilleggsadresse: _get(
						formikBag.values,
						'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
					)
				})
				formikBag.setFieldValue('tpsf.midlertidigAdresse.gateadresseNrInfo', {
					nummertype: GateadresseTyper.KOMMUNENR,
					nummer: ''
				})
				break
			case GateadresseTyper.GATE:
				formikBag.setFieldValue('tpsf.midlertidigAdresse.norskAdresse', {
					postnr: '',
					gatenavn: '',
					gatekode: '',
					husnr: '',
					tilleggsadresse: _get(
						formikBag.values,
						'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
					)
				})
				formikBag.setFieldValue('tpsf.midlertidigAdresse.gateadresseNrInfo', undefined)
			default:
				break
		}
	}

	return (
		<div className="flexbox--full-width">
			{/* 
            // @ts-ignore */}
			<RadioPanelGruppe
				name="gateAdresseType"
				legend="Hva slags midlertidig gateadresse vil du opprette?"
				radios={[
					{
						label: 'Tilfeldig gateadresse',
						value: GateadresseTyper.TILFELDIG,
						id: GateadresseTyper.TILFELDIG
					},
					{
						label: 'Tilfeldig gateadresse basert på postnummer ...',
						value: GateadresseTyper.POSTNR,
						id: GateadresseTyper.POSTNR
					},
					{
						label: 'Tilfeldig gateadresse basert på kommunenummer ...',
						value: GateadresseTyper.KOMMUNENR,
						id: GateadresseTyper.KOMMUNENR
					},
					{
						label: 'Gateadresse detaljert ...',
						value: GateadresseTyper.GATE,
						id: GateadresseTyper.GATE
					}
				]}
				checked={gateAdresseType}
				onChange={handleRadioChange}
			/>
			{[GateadresseTyper.POSTNR, GateadresseTyper.KOMMUNENR].includes(gateAdresseType) && (
				<Kategori title="Generer midlertidig adresse ...">
					{gateAdresseType === GateadresseTyper.POSTNR && (
						<FormikSelect
							name="tpsf.midlertidigAdresse.gateadresseNrInfo.nummer"
							label="Postnummer"
							kodeverk={AdresseKodeverk.PostnummerUtenPostboks}
							size="large"
							isClearable={false}
						/>
					)}
					{gateAdresseType === GateadresseTyper.KOMMUNENR && (
						<FormikSelect
							name="tpsf.midlertidigAdresse.gateadresseNrInfo.nummer"
							label="Kommunenummer"
							kodeverk={AdresseKodeverk.Kommunenummer}
							size="large"
							isClearable={false}
						/>
					)}
				</Kategori>
			)}
			{gateAdresseType === GateadresseTyper.GATE && <GateadresseDetaljert formikBag={formikBag} />}
		</div>
	)
}
