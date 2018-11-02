import { relasjonTranslator } from './Utils'
import Formatters from '~/utils/DataFormatter'

export default function mapDetailedData(tpsfData, sigrunData, bestillingData) {
	let data
	if (tpsfData) {
		data = [
			{
				header: 'Personlig informasjon',
				data: [
					{
						id: 'ident',
						label: tpsfData.identtype,
						value: tpsfData.ident
					},
					{
						id: 'fornavn',
						label: 'Fornavn',
						value: tpsfData.fornavn
					},
					{
						id: 'mellomnavn',
						label: 'Mellomnavn',
						value: tpsfData.mellomnavn
					},
					{
						id: 'etternavn',
						label: 'Etternavn',
						value: tpsfData.etternavn
					},
					{
						id: 'kjonn',
						label: 'Kjønn',
						value: Formatters.kjonnToString(tpsfData.kjonn)
					},
					{
						id: 'alder',
						label: 'Alder',
						value: Formatters.formatAlder(tpsfData.alder, tpsfData.doedsdato)
					},
					{
						id: 'miljoer',
						label: 'Miljøer',
						value: Formatters.arrayToString(bestillingData.environments)
					}
				]
			}
		]
	}

	if (tpsfData.statsborgerskap) {
		data.push({
			header: 'Nasjonalitet',
			data: [
				{
					id: 'innvandretFra',
					label: 'Innvandret fra',
					value: tpsfData.innvandretFra
				},
				{
					id: 'statsborgerskap',
					label: 'Statsborgerskap',
					value: tpsfData.statsborgerskap
				}
			]
		})
	}

	if (tpsfData.boadresse) {
		data.push({
			header: 'Bostedadresse',
			data: [
				{
					parent: 'boadresse',
					id: 'gateadresse',
					label: 'Gatenavn',
					value: tpsfData.boadresse.gateadresse
				},
				{
					parent: 'boadresse',
					id: 'husnummer',
					label: 'Husnummer',
					value: tpsfData.boadresse.husnummer
				},
				{
					parent: 'boadresse',
					id: 'gatekode',
					label: 'Gatekode',
					value: tpsfData.boadresse.gatekode
				},
				{
					parent: 'boadresse',
					id: 'postnr',
					label: 'Postnummer',
					value: tpsfData.boadresse.postnr
				},
				{
					parent: 'boadresse',
					id: 'flyttedato',
					label: 'Flyttedato',
					value: Formatters.formatDate(tpsfData.boadresse.flyttedato)
				}
			]
		})
	}
	if (tpsfData.relasjoner.length) {
		data.push({
			header: 'Familierelasjoner',
			multiple: true,
			data: tpsfData.relasjoner.map(relasjon => {
				return {
					parent: 'relasjoner',
					id: relasjon.id,
					label: relasjonTranslator(relasjon.relasjonTypeNavn),
					value: [
						{
							id: 'ident',
							label: relasjon.personRelasjonMed.identtype,
							value: relasjon.personRelasjonMed.ident
						},
						{
							id: 'fornavn',
							label: 'Fornavn',
							value: relasjon.personRelasjonMed.fornavn
						},
						{
							id: 'mellomnavn',
							label: 'Mellomnavn',
							value: relasjon.personRelasjonMed.mellomnavn
						},
						{
							id: 'etternavn',
							label: 'Etternavn',
							value: relasjon.personRelasjonMed.etternavn
						},
						{
							id: 'kjonn',
							label: 'Kjønn',
							value: Formatters.kjonnToString(relasjon.personRelasjonMed.kjonn)
						}
					]
				}
			})
		})
	}
	if (sigrunData) {
		data.push({
			header: 'Inntekter',
			multiple: true,
			data: sigrunData.map(data => {
				return {
					parent: 'inntekter',
					id: data.personidentifikator,
					label: data.inntektsaar,
					value: [
						{
							id: 'aar',
							label: 'År',
							value: data.inntektsaar
						},
						{
							id: 'verdi',
							label: 'Beløp',
							value: data.verdi
						},
						,
						{
							id: 'tjeneste',
							label: 'Tjeneste',
							width: 'medium',
							value: data.tjeneste
						},

						{
							id: 'grunnlag',
							label: 'Grunnlag',
							width: 'xlarge',
							value: Formatters.camelCaseToLabel(data.grunnlag)
						}
					]
				}
			})
		})
	}

	return data
}
