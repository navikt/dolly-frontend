import { Kategorier, SubKategorier } from '../Categories'
import { Attributt, InputType, DataSource, AttributtType } from '../Types'
import * as PersoninformasjonListe from './Personinformasjon';
import SelectOptionsManager from '~/service/kodeverk/SelectOptionsManager/SelectOptionsManager'

import * as yup from 'yup'


const partnerAttributes: any = PersoninformasjonListe.default.map(attributt => {
	let copy = Object.assign({}, attributt)
	copy.hovedKategori = Kategorier.FamilieRelasjoner
	copy.subKategori = SubKategorier.Partner
	copy.id = 'partner_' + attributt.id
	copy.parent = 'partner'
	copy.path = 'relasjoner.partner.' + attributt.id
	copy.includeIf = [attributt]
	return copy
})

const barnAttributes: any = PersoninformasjonListe.default.map(attributt => {
	let copy = Object.assign({}, attributt)
	copy.hovedKategori = Kategorier.FamilieRelasjoner
	copy.subKategori = SubKategorier.Barn
	copy.id = 'barn_' + attributt.id
	copy.parent = 'barn'
	copy.path = 'relasjoner.barn.' + attributt.id
	copy.includeIf = [attributt]
	return copy
})

const AttributtListe: Attributt[] = [
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Partner,
		id: 'partner',
		path: 'relasjoner.partner',
		label: 'Har partner',
		dataSource: DataSource.TPSF,
		validation: yup.object(),
		attributtType: AttributtType.SelectOnly
	},	
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Partner,
		id: 'partner_identtype',
		parent: 'partner',
		path: 'relasjoner.partner.identtype',
		label: 'Type',
		dataSource: DataSource.TPSF,
		inputType: InputType.Select,
		options: SelectOptionsManager('identtype'),
		validation: yup.string().required('Velg identtype.'),
		attributtType: AttributtType.SelectOnly,
	}, /*
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Partner,
		id: 'partner_kjonn',
		parent: 'partner',
		path: 'relasjoner.partner.kjonn',
		label: 'Kjønn',
		dataSource: DataSource.TPSF,
		inputType: InputType.Select,
		options: SelectOptionsManager('kjonn'),
		format: Formatters.kjonnToString,
		validation: yup.string().required('Velg kjønn.'),
		attributtType: AttributtType.SelectOnly
	},
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Partner,
		id: 'partner_foedtEtter',
		parent: 'partner',
		path: 'relasjoner.partner.foedtEtter',
		label: 'Født etter',
		dataSource: DataSource.TPSF,
		inputType: InputType.Date,
		validation: DateValidation,
		attributtType: AttributtType.SelectOnly
	},
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Partner,
		id: 'partner_foedtFoer',
		parent: 'partner',
		path: 'relasjoner.partner.foedtFoer',
		label: 'Født før',
		dataSource: DataSource.TPSF,
		inputType: InputType.Date,
		validation: DateValidation,
		attributtType: AttributtType.SelectOnly
	}, */
	{
		hovedKategori: Kategorier.FamilieRelasjoner,
		subKategori: SubKategorier.Barn,
		id: 'barn',
		path: 'relasjoner.barn',
		label: 'Har barn',
		dataSource: DataSource.TPSF,
		validation: yup.object(),
		attributtType: AttributtType.SelectOnly,
		items: [
			{
				hovedKategori: Kategorier.FamilieRelasjoner,
				subKategori: SubKategorier.Barn,
				id: 'identtype',
				path: 'relasjoner.barn.identtype',
				parent: 'barn',
				label: 'Type',
				dataSource: DataSource.TPSF,
				inputType: InputType.Select,
				options: SelectOptionsManager('identtype'),
				validation: yup.string().required('Velg identtype.'),
				attributtType: AttributtType.SelectOnly
			}].concat(barnAttributes) /*
			{
				hovedKategori: Kategorier.FamilieRelasjoner,
				subKategori: SubKategorier.Barn,
				id: 'kjonn',
				path: 'relasjoner.barn.kjonn',
				parent: 'barn',
				label: 'Kjønn',
				dataSource: DataSource.TPSF,
				inputType: InputType.Select,
				options: SelectOptionsManager('kjonnBarn'),
				format: Formatters.kjonnToStringBarn,
				validation: yup.string().required('Velg kjønn.'),
				attributtType: AttributtType.SelectOnly
			},
			{
				hovedKategori: Kategorier.FamilieRelasjoner,
				subKategori: SubKategorier.Barn,
				id: 'foedtEtter',
				path: 'relasjoner.barn.foedtEtter',
				parent: 'barn',
				label: 'Født etter',
				dataSource: DataSource.TPSF,
				inputType: InputType.Date,
				validation: DateValidation,
				attributtType: AttributtType.SelectOnly
			},
			{
				hovedKategori: Kategorier.FamilieRelasjoner,
				subKategori: SubKategorier.Barn,
				id: 'foedtFoer',
				path: 'relasjoner.barn.foedtFoer',
				parent: 'barn',
				label: 'Født før',
				dataSource: DataSource.TPSF,
				inputType: InputType.Date,
				validation: DateValidation,
				attributtType: AttributtType.SelectOnly
			}
		] */
	}
].concat(partnerAttributes)

export default AttributtListe
