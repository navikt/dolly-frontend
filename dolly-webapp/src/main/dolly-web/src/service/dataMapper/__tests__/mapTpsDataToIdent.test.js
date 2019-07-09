import { mapTpsfData } from '../mapTpsDataToIdent'

describe('mapTpsDataToIdent.js', () => {
	describe('mapTpsfData', () => {
		const testTpsfData = {
			identtype: 'FNR',
			ident: '010101456789',
			fornavn: 'OLA',
			mellomnavn: 'MELLOMNAVN',
			etternavn: 'NORDMANN',
			gtRegel: 'A',
			gtType: 'BYDEL',
			gtVerdi: '030103',
			kjonn: 'MENN',
			alder: 20,
			sivilstand: 'ENKE',
			spesreg: 'KODE6',
			utenFastBopel: 'JA',
			relasjoner: [],
			tknr: '0314',
			egenAnsattDatoFom: '2019-04-10T12:55:14.896',
			sprakKode: 'English'
		}

		const testPdlfData = {
			utenlandskeIdentifikasjonsnummere: {
				0: {
					idNummer: '1234567890',
					registrertOpphoertINAV: '2019-06-25',
					utstederland: 'JAPAN'
				}
			}
		}

		const testTpsfRes = [
			{
				header: 'Personlig informasjon',
				data: [
					{
						id: 'ident',
						label: 'FNR',
						value: '010101456789'
					},
					{
						id: 'fornavn',
						label: 'Fornavn',
						value: 'OLA'
					},
					{
						id: 'mellomnavn',
						label: 'Mellomnavn',
						value: 'MELLOMNAVN'
					},
					{
						id: 'etternavn',
						label: 'Etternavn',
						value: 'NORDMANN'
					},
					{
						id: 'kjonn',
						label: 'Kjønn',
						value: 'MENN'
					},
					{
						id: 'alder',
						label: 'Alder',
						value: '20'
					},
					{
						id: 'sivilstand',
						label: 'Sivilstand',
						value: 'ENKE'
					},
					{
						id: 'miljoer',
						label: 'Miljøer',
						value: 't0, t1'
					},
					{
						id: 'spesreg',
						label: 'Diskresjonskoder',
						value: 'KODE6'
					},
					{
						id: 'utenFastBopel',
						label: 'Uten fast bopel',
						value: 'JA'
					},
					{
						apiKodeverkId: 'Bydeler',
						extraLabel: 'Bydel',
						id: 'gtVerdi',
						label: 'Geo. Tilhør',
						value: '030103'
					},
					{
						id: 'tknr',
						label: 'TK nummer',
						tknr: '0314'
					},
					{
						id: 'egenAnsattDatoFom',
						label: 'Egenansatt',
						value: 'JA'
					}
				]
			}
		]

		const testPdlfRes = [
			...testTpsfRes,
			{
				header: 'Utenlands-ID',
				data: [
					{
						id: 'idNummer',
						label: 'Identifikasjonsnummer',
						value: '1234567890'
					},
					{
						id: 'opphoert',
						label: 'Opphørt',
						value: 'Ja'
					},
					{
						id: 'utstederland',
						label: 'Utstederland',
						value: 'JAPAN',
						apiKodeverkId: 'StatsborgerskapFreg'
					}
				]
			}
		]

		const testIdent = {
			ident: '123456789',
			tpsfSuccessEnv: 't0,t1'
		}

		it('should return null without data', () => {
			expect(mapTpsfData()).toBeNull()
		})

		it('should return tpsf-data', () => {
			expect(mapTpsfData(testTpsfData, testIdent)).toEqual(testTpsfRes)
		})

		it('should return tpsf-data with matrikkeladresse', () => {
			const testTpsfDataAdresseValues = {
				...testTpsfData,
				boadresse: {
					adressetype: 'MATR',
					postnr: '2603',
					kommunenr: '0501',
					mellomnavn: 'Min gård',
					gardsnr: '658',
					bruksnr: '745',
					festenr: '5684',
					undernr: '11',
					flyttedato: '1903-11-03T00:00:00'
				}
			}

			const res = [
				...testTpsfRes,
				{
					header: 'Bostedadresse',
					data: [
						{
							parent: 'boadresse',
							id: 'adressetype',
							label: 'Adressetype',
							value: 'Matrikkeladresse'
						},
						{
							parent: 'boadresse',
							id: 'gateadresse',
							label: 'Gatenavn',
							value: undefined
						},
						{
							parent: 'boadresse',
							id: 'husnummer',
							label: 'Husnummer',
							value: undefined
						},
						{
							parent: 'boadresse',
							id: 'mellomnavn',
							label: 'Stedsnavn',
							value: 'Min gård'
						},
						{
							parent: 'boadresse',
							id: 'gardsnr',
							label: 'Gårdsnummer',
							value: '658'
						},
						{
							parent: 'boadresse',
							id: 'bruksnr',
							label: 'Bruksnummer',
							value: '745'
						},
						{
							parent: 'boadresse',
							id: 'festenr',
							label: 'Festenummer',
							value: '5684'
						},
						{
							parent: 'boadresse',
							id: 'undernr',
							label: 'Undernummer',
							value: '11'
						},
						{
							parent: 'boadresse',
							id: 'postnr',
							label: 'Postnummer',
							extraLabel: '2603',
							apiKodeverkId: 'Postnummer',
							value: '2603'
						},
						{
							parent: 'boadresse',
							id: 'flyttedato',
							label: 'Flyttedato',
							value: '03.11.1903'
						}
					]
				}
			]
			expect(mapTpsfData(testTpsfDataAdresseValues, testIdent)).toEqual(res)
		})

		it('should return tpsf-data and pdlf-data', () => {
			expect(mapTpsfData(testTpsfData, testIdent, testPdlfData)).toEqual(testPdlfRes)
		})

		// it('should return tpsf-data with alle values', () => {
		// 	const testTpsfDataAllValues = {
		// 		...testTpsfData,
		// 		statsborgerskap: 'NOR',
		// 		innvandretFra: 'VIE',
		// 		boadresse: {
		// 			gateadresse: 'SANNERGATA',
		// 			husnummer: 'H0101',
		// 			gatekode: '2',
		// 			postnr: '1234',
		// 			flyttedato: '1903-11-03T00:00:00'
		// 		},
		// 		relasjoner: [
		// 			{
		// 				id: '1',
		// 				relasjonTypeNavn: 'EKTEFELLE',
		// 				personRelasjonMed: {
		// 					identtype: 'FNR',
		// 					ident: '101010456789',
		// 					fornavn: 'LISA',
		// 					mellomnavn: 'MELLOMNAVN',
		// 					etternavn: 'BERG',
		// 					kjonn: 'KVINNE'
		// 				}
		// 			}
		// 		]
		// 	}

		// 	const res = [
		// 		...testTpsfRes,
		// 		{
		// 			header: 'Nasjonalitet',
		// 			data: [
		// 				{
		// 					id: 'innvandretFra',
		// 					label: 'Innvandret fra',
		// 					value: 'VIE'
		// 				},
		// 				{
		// 					id: 'statsborgerskap',
		// 					label: 'Statsborgerskap',
		// 					value: 'NOR'
		// 				},
		// 				{
		// 					id: 'sprakKode',
		// 					label: 'Språk',
		// 					value: 'English'
		// 				}
		// 			]
		// 		},
		// 		// {
		// 		// 	header: 'Bostedadresse',
		// 		// 	data: [
		// 		// 		{
		// 		// 			parent: 'boadresse',
		// 		// 			id: 'gateadresse',
		// 		// 			label: 'Gatenavn',
		// 		// 			value: 'SANNERGATA'
		// 		// 		},
		// 		// 		{
		// 		// 			parent: 'boadresse',
		// 		// 			id: 'husnummer',
		// 		// 			label: 'Husnummer',
		// 		// 			value: 'H0101'
		// 		// 		},
		// 		// 		{
		// 		// 			parent: 'boadresse',
		// 		// 			id: 'gatekode',
		// 		// 			label: 'Gatekode',
		// 		// 			value: '2'
		// 		// 		},
		// 		// 		{
		// 		// 			parent: 'boadresse',
		// 		// 			id: 'postnr',
		// 		// 			label: 'Postnummer',
		// 		// 			value: '1234'
		// 		// 		},
		// 		// 		{
		// 		// 			parent: 'boadresse',
		// 		// 			id: 'flyttedato',
		// 		// 			label: 'Flyttedato',
		// 		// 			value: '03.11.1903'
		// 		// 		}
		// 		// 	]
		// 		// },
		// 		{
		// 			header: 'Familierelasjoner',
		// 			multiple: true,
		// 			data: testTpsfDataAllValues.relasjoner.map(relasjon => {
		// 				return {
		// 					parent: 'relasjoner',
		// 					id: '1',
		// 					label: 'Partner',
		// 					value: [
		// 						{
		// 							id: 'ident',
		// 							label: 'FNR',
		// 							value: '101010456789'
		// 						},
		// 						{
		// 							id: 'fornavn',
		// 							label: 'Fornavn',
		// 							value: 'LISA'
		// 						},
		// 						{
		// 							id: 'mellomnavn',
		// 							label: 'Mellomnavn',
		// 							value: 'MELLOMNAVN'
		// 						},
		// 						{
		// 							id: 'etternavn',
		// 							label: 'Etternavn',
		// 							value: 'BERG'
		// 						},
		// 						{
		// 							id: 'kjonn',
		// 							label: 'Kjønn',
		// 							value: 'KVINNE'
		// 						}
		// 					]
		// 				}
		// 			})
		// 		}
		// 	]

		// 	expect(mapTpsfData(testTpsfDataAllValues, testIdent)).toEqual(res)
		// })
	})
})
