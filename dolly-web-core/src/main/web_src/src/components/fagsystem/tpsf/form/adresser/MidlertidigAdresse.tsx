import React, { useState } from 'react'
import _get from 'lodash/get'
import { FormikProps } from 'formik'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { Kategori } from '~/components/ui/form/kategori/Kategori'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { Postboksadresse } from './partials/midlertidigAdresse/Postboksadresse'
import { Stedsadresse } from './partials/midlertidigAdresse/Stedsadresse'
import { UtenlandskAdresse } from './partials/midlertidigAdresse/UtenlandskAdresse'
import { Gateadresse } from './partials/midlertidigAdresse/Gateadresse'
import { Tilleggsadresse } from '~/components/fagsystem/tpsf/form/adresser/partials/Tilleggsadresse/Tilleggsadresse'
import { DollySelect } from '~/components/ui/form/inputs/select/Select'

interface MidlertidigAdresse {
	formikBag: FormikProps<{}>
}

//TODO: Enum for type?
// enum AdresseTyper {
// 	CoNavn = 'CO_NAVN',
// 	LeilighetsNr = 'LEILIGHET_NR',
// 	SeksjonsNr = 'SEKSJON_NR',
// 	BoligNr = 'BOLIG_NR'
// }

export const MidlertidigAdresse = ({ formikBag }: MidlertidigAdresse) => {
	const [adressetype, setAdressetype] = useState(
		_get(formikBag.values, 'tpsf.midlertidigAdresse.adressetype')
	)

	const handleAdressetypeChange = (v: any) => {
		const type = v.value
		setAdressetype(type)
		switch (type) {
			case 'GATE':
				formikBag.setFieldValue('tpsf.midlertidigAdresse', {
					adressetype: type,
					gyldigTom: _get(formikBag.values, 'tpsf.midlertidigAdresse.gyldigTom'),
					norskAdresse: {
						tilleggsadresse: _get(
							formikBag.values,
							'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
						)
					}
				})
				break
			case 'STED':
				formikBag.setFieldValue('tpsf.midlertidigAdresse', {
					adressetype: type,
					gyldigTom: _get(formikBag.values, 'tpsf.midlertidigAdresse.gyldigTom'),
					norskAdresse: {
						postnr: '',
						eiendomsnavn: '',
						tilleggsadresse: _get(
							formikBag.values,
							'tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse'
						)
					}
				})
				break
			case 'PBOX':
				formikBag.setFieldValue('tpsf.midlertidigAdresse', {
					adressetype: type,
					gyldigTom: _get(formikBag.values, 'tpsf.midlertidigAdresse.gyldigTom'),
					norskAdresse: {
						postnr: '',
						postboksnr: '',
						postboksAnlegg: ''
					}
				})
				break
			case 'UTAD':
				formikBag.setFieldValue('tpsf.midlertidigAdresse', {
					adressetype: type,
					gyldigTom: _get(formikBag.values, 'tpsf.midlertidigAdresse.gyldigTom'),
					utenlandskAdresse: {
						postLinje1: '',
						postLinje2: '',
						postLinje3: '',
						postLand: ''
					}
				})
				break
			default:
				break
		}
	}

	return (
		<Kategori title="Midlertidig adresse" vis="tpsf.midlertidigAdresse">
			<DollySelect
				name="tpsf.midlertidigAdresse.adressetype"
				label="Adressetype"
				value={_get(formikBag.values, 'tpsf.midlertidigAdresse.adressetype')}
				options={Options('adresseType')}
				size="large"
				isClearable={false}
				onChange={handleAdressetypeChange}
			/>
			<FormikDatepicker name="tpsf.midlertidigAdresse.gyldigTom" label="Gyldig t.o.m." />
			{adressetype === 'GATE' && <Gateadresse formikBag={formikBag} />}
			{adressetype === 'STED' && <Stedsadresse />}
			{adressetype === 'PBOX' && <Postboksadresse />}
			{adressetype === 'UTAD' && <UtenlandskAdresse />}
			{(adressetype === 'GATE' || adressetype === 'STED') && (
				<Tilleggsadresse
					formikBag={formikBag}
					tilleggsadressePath="tpsf.midlertidigAdresse.norskAdresse.tilleggsadresse"
					options="tilleggstypeMidlertidig"
					type="midlertidig "
				/>
			)}
		</Kategori>
	)
}
