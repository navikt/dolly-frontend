import _get from 'lodash/get'
import _dropRight from 'lodash/dropRight'
import _takeRight from 'lodash/takeRight'
import _isEmpty from 'lodash/isEmpty'
import Formatters from '~/utils/DataFormatter'

// TODO: Flytte til selector?
// - Denne kan forminskes ved bruk av hjelpefunksjoner
// - Når vi får på plass en bedre struktur for bestillingsprosessen, kan
//   mest sannsynlig visse props fjernes herfra (width?)

const obj = (label, value, apiKodeverkId) => ({
	label,
	value,
	...(apiKodeverkId && { apiKodeverkId })
})

const _getTpsfBestillingData = data => {
	return [
		obj('Identtype', data.identtype),
		obj('Født etter', Formatters.formatDate(data.foedtEtter)),
		obj('Født før', Formatters.formatDate(data.foedtFoer)),
		obj('Alder', data.alder),
		obj('Dødsdato', Formatters.formatDate(data.doedsdato)),
		obj('Statsborgerskap', data.statsborgerskap, 'Landkoder'),
		obj('Statsborgerskap fra', Formatters.formatDate(data.statsborgerskapRegdato)),
		obj('Kjønn', Formatters.kjonn(data.kjonn, data.alder)),
		obj('Har mellomnavn', Formatters.oversettBoolean(data.harMellomnavn)),
		obj('Sivilstand', data.sivilstand, 'Sivilstander'),
		obj('Diskresjonskoder', data.spesreg !== 'UFB' && data.spesreg, 'Diskresjonskoder'),
		obj('Uten fast bopel', (data.utenFastBopel || data.spesreg === 'UFB') && 'JA'),
		obj('Språk', data.sprakKode, 'Språk'),
		obj('Innvandret fra land', data.innvandretFraLand, 'Landkoder'),
		obj('Innvandret dato', Formatters.formatDate(data.innvandretFraLandFlyttedato)),
		obj('Utvandret til land', data.utvandretTilLand, 'Landkoder'),
		obj('Utvandret dato', Formatters.formatDate(data.utvandretTilLandFlyttedato)),
		obj('Er forsvunnet', Formatters.oversettBoolean(data.erForsvunnet)),
		obj('Forsvunnet dato', Formatters.formatDate(data.forsvunnetDato)),
		obj('Egenansatt', Formatters.oversettBoolean(data.egenansattDatoFom))
	]
}

export function mapBestillingData(bestillingData, bestillingsinformasjon) {
	if (!bestillingData) return null

	const data = []

	if (bestillingsinformasjon) {
		const bestillingsInfo = {
			header: 'Bestillingsinformasjon',
			items: [
				obj(
					'Antall',
					bestillingsinformasjon.antallIdenter && bestillingsinformasjon.antallIdenter.toString()
				),
				obj('Sist Oppdatert', Formatters.formatDate(bestillingsinformasjon.sistOppdatert)),
				obj(
					'Gjenopprett fra',
					bestillingsinformasjon.opprettetFraId &&
						`Bestilling # ${bestillingsinformasjon.opprettetFraId}`
				)
			]
		}
		data.push(bestillingsInfo)
	}

	if (bestillingData.tpsf) {
		const {
			boadresse,
			postadresse,
			adresseNrInfo,
			identHistorikk,
			relasjoner,
			...persondetaljer
		} = bestillingData.tpsf

		if (!_isEmpty(persondetaljer)) {
			const personinfo = {
				header: 'Persondetaljer',
				items: _getTpsfBestillingData(bestillingData.tpsf)
			}

			data.push(personinfo)
		}
		if (boadresse) {
			if (adresseNrInfo) {
				const adresseNrInfoObj = {
					header: `Boadresse basert på ${Formatters.showLabel(
						'adresseNrType',
						adresseNrInfo.nummertype
					)}`,
					items: [
						obj(
							`${Formatters.showLabel('adresseNrType', adresseNrInfo.nummertype)}`,
							adresseNrInfo.nummer
						),
						obj('Flyttedato', Formatters.formatDate(boadresse.flyttedato))
					]
				}
				data.push(adresseNrInfoObj)
			} else {
				const adresse = {
					header: 'Bostedadresse',
					items: [
						{
							header: 'Bosted'
						},
						obj('Adressetype', Formatters.adressetypeToString(boadresse.adressetype)),
						obj('Gatenavn', boadresse.gateadresse),
						obj('Husnummer', boadresse.husnummer),
						obj('Stedsnavn', boadresse.mellomnavn),
						obj('Gårdsnummer', boadresse.gardsnr),
						obj('Bruksnummer', boadresse.bruksnr),
						obj('Festenummer', boadresse.festenr),
						obj('Undernummer', boadresse.undernr),
						obj('Postnummer', boadresse.postnr),
						obj('Kommunenummer', boadresse.kommunenr),
						obj('Flyttedato', Formatters.formatDate(boadresse.flyttedato))
					]
				}
				data.push(adresse)
			}
		}

		if (postadresse) {
			const postadr = bestillingData.tpsf.postadresse[0]
			const postadresse = {
				header: 'Postadresse',
				items: [
					obj('Land', postadr.postLand),
					obj('Adresselinje 1', postadr.postLinje1),
					obj('Adresselinje 2', postadr.postLinje2),
					obj('Adresselinje 3', postadr.postLinje3)
				]
			}
			data.push(postadresse)
		}

		if (identHistorikk) {
			const identhistorikkData = {
				header: 'Identhistorikk',
				itemRows: identHistorikk.map((ident, idx) => {
					return [
						{
							numberHeader: `Identhistorikk ${idx + 1}`
						},
						obj('Identtype', ident.identtype),
						obj('Kjønn', Formatters.kjonnToString(ident.kjonn)),
						obj('Utgått dato', Formatters.formatDate(ident.regdato)),
						obj('Født før', Formatters.formatDate(ident.foedtFoer)),
						obj('Født Etter', Formatters.formatDate(ident.foedtEtter))
					]
				})
			}
			data.push(identhistorikkData)
		}

		if (relasjoner) {
			const partnere = relasjoner.partner || relasjoner.partnere
			const barn = relasjoner.barn
			if (partnere) {
				const partner = {
					header: 'Partner',
					itemRows: []
				}

				partnere.forEach((item, j) => {
					const sivilstander = _get(item, 'sivilstander', [])
					const sisteSivilstand = _takeRight(sivilstander)

					const tidligereSivilstander = _dropRight(sivilstander)
						.reverse()
						.map(s => s.sivilstand)

					partner.itemRows.push([
						{
							label: '',
							value: `#${j + 1}`,
							width: 'x-small'
						},
						..._getTpsfBestillingData(item),
						obj('Fnr/dnr/bost', item.ident),
						obj('Bor sammen', Formatters.oversettBoolean(item.harFellesAdresse)),
						obj('Sivilstand', sisteSivilstand[0].sivilstand, 'Sivilstander'),
						obj('Tidligere sivilstander', Formatters.arrayToString(tidligereSivilstander))
					])
				})

				data.push(partner)
			}

			if (barn && barn.length > 0) {
				const barn = {
					header: 'Barn',
					itemRows: []
				}

				relasjoner.barn.forEach((item, i) => {
					barn.itemRows.push([
						{
							label: '',
							value: `#${i + 1}`,
							width: 'x-small'
						},
						..._getTpsfBestillingData(item),
						obj('Fnr/dnr/bost', item.ident),
						obj('Forelder 2', item.partnerIdent),
						obj('Foreldre', Formatters.showLabel('barnType', item.barnType)), //Bruke samme funksjon som i bestillingsveileder
						obj('Bor hos', Formatters.showLabel('barnBorHos', item.borHos)),
						obj('Er adoptert', Formatters.oversettBoolean(item.erAdoptert))
					])
				})

				data.push(barn)
			}
		}
	}

	const aaregKriterier = bestillingData.aareg
	if (aaregKriterier) {
		const aareg = {
			header: 'Arbeidsforhold',
			itemRows: []
		}

		aaregKriterier.forEach((arbeidsforhold, i) => {
			aareg.itemRows.push([
				{
					numberHeader: `Arbeidsforhold ${i + 1}`
				},
				obj('Startdato', Formatters.formatDate(arbeidsforhold.ansettelsesPeriode.fom)),
				obj('Sluttdato', Formatters.formatDate(arbeidsforhold.ansettelsesPeriode.tom)),
				{
					label: 'Type arbeidsforhold',
					value: arbeidsforhold.arbeidsforholdstype,
					apiKodeverkId: 'Arbeidsforholdstyper'
				},
				obj('Type av arbeidsgiver', arbeidsforhold.arbeidsgiver.aktoertype),
				obj('Orgnummer', arbeidsforhold.arbeidsgiver.orgnummer),
				obj('Arbeidsgiver Ident', arbeidsforhold.arbeidsgiver.ident),
				{
					label: 'Yrke',
					value: arbeidsforhold.arbeidsavtale.yrke,
					apiKodeverkId: 'Yrker',
					width: 'xlarge',
					showKodeverkValue: true
				},
				obj('Stillingprosent', arbeidsforhold.arbeidsavtale.stillingsprosent),
				obj(
					'Endringsdato stillingprosent',
					Formatters.formatDate(arbeidsforhold.arbeidsavtale.endringsdatoStillingsprosent)
				),
				{
					label: 'Arbeidstidsordning',
					value: arbeidsforhold.arbeidsavtale.arbeidstidsordning,
					apiKodeverkId: 'Arbeidstidsordninger'
				},
				obj('Antall konverterte timer', arbeidsforhold.arbeidsavtale.antallKonverterteTimer),
				obj('Avtalte timer per uke', arbeidsforhold.arbeidsavtale.avtaltArbeidstimerPerUke),
				obj(
					'Perioder med antall timer for timelønnet',
					arbeidsforhold.permisjon && arbeidsforhold.permisjon.length
				),
				obj('Perioder med permisjon', arbeidsforhold.permisjon && arbeidsforhold.permisjon.length),
				obj(
					'Perioder med utenlandsopphold',
					arbeidsforhold.utenlandsopphold && arbeidsforhold.utenlandsopphold.length
				)
			])
		})
		data.push(aareg)
	}
	const sigrunStubKriterier = bestillingData.sigrunstub

	if (sigrunStubKriterier) {
		// Flatter ut sigrunKriterier for å gjøre det lettere å mappe
		let flatSigrunStubKriterier = []
		sigrunStubKriterier.forEach(inntekt => {
			const inntektObj = { inntektsaar: inntekt.inntektsaar, tjeneste: inntekt.tjeneste }
			inntekt.grunnlag &&
				inntekt.grunnlag.forEach(gr => {
					flatSigrunStubKriterier.push({
						...inntektObj,
						grunnlag: gr.tekniskNavn,
						verdi: gr.verdi,
						inntektssted: 'Fastlands-Norge'
					})
				})
			inntekt.svalbardGrunnlag &&
				inntekt.svalbardGrunnlag.forEach(gr => {
					flatSigrunStubKriterier.push({
						...inntektObj,
						svalbardGrunnlag: gr.tekniskNavn,
						verdi: gr.verdi,
						inntektssted: 'Svalbard'
					})
				})
		})

		const sigrunStub = {
			header: 'Inntekter',
			itemRows: []
		}

		flatSigrunStubKriterier.forEach((inntekt, i) => {
			sigrunStub.itemRows.push([
				{
					numberHeader: `Inntekt ${i + 1}`
				},
				obj('År', inntekt.inntektsaar),
				obj('Beløp', inntekt.verdi),
				obj('Tjeneste', Formatters.uppercaseAndUnderscoreToCapitalized(inntekt.tjeneste)),
				{
					label: 'Grunnlag (Fastlands-Norge)',
					value: inntekt.grunnlag,
					width: 'xlarge',
					apiKodeverkId: Formatters.uppercaseAndUnderscoreToCapitalized(inntekt.tjeneste)
				},
				{
					label: 'Grunnlag (Svalbard)',
					value: inntekt.svalbardGrunnlag,
					width: 'xlarge',
					apiKodeverkId: Formatters.uppercaseAndUnderscoreToCapitalized(inntekt.tjeneste)
				}
			])
		})

		data.push(sigrunStub)
	}

	const krrKriterier = bestillingData.krrstub

	if (krrKriterier) {
		const krrStub = {
			header: 'Kontaktinformasjon og reservasjon',
			items: [
				obj('Mobilnummer', krrKriterier.mobil),
				obj('Epost', krrKriterier.epost),
				{
					label: 'RESERVERT MOT DIGITALKOMMUNIKASJON',
					value: krrKriterier.reservert ? 'JA' : 'NEI',
					width: 'medium'
				},
				obj('Gyldig fra', Formatters.formatDate(krrKriterier.gyldigFra)),
				obj('Registrert i DKIF', krrKriterier.registrert ? 'JA' : 'NEI')
			]
		}

		data.push(krrStub)
	}

	const pdlforvalterKriterier = bestillingData.pdlforvalter

	if (pdlforvalterKriterier) {
		const doedsboKriterier = pdlforvalterKriterier.kontaktinformasjonForDoedsbo
		if (doedsboKriterier) {
			const navnType = doedsboKriterier.adressat.navn
				? 'navn'
				: doedsboKriterier.adressat.kontaktperson
				? 'kontaktperson'
				: null
			const doedsbo = {
				header: 'Kontaktinformasjon for dødsbo',
				items: [
					obj('Fornavn', navnType && doedsboKriterier.adressat[navnType].fornavn),
					obj('Mellomnavn', navnType && doedsboKriterier.adressat[navnType].mellomnavn),
					obj('Etternavn', navnType && doedsboKriterier.adressat[navnType].etternavn),
					obj('Fnr/dnr/BOST', doedsboKriterier.adressat.idnummer),
					obj('Fødselsdato', Formatters.formatDate(doedsboKriterier.adressat.foedselsdato)),
					obj('Organisasjonsnavn', doedsboKriterier.adressat.organisasjonsnavn),
					obj('Organisasjonsnummer', doedsboKriterier.adressat.organisasjonsnummer),
					obj('Adresselinje 1', doedsboKriterier.adresselinje1),
					obj('Adresselinje 2', doedsboKriterier.adresselinje2),
					obj(
						'Postnummer og -sted',
						`${doedsboKriterier.postnummer} ${doedsboKriterier.poststedsnavn}`
					),
					obj('Land', doedsboKriterier.landkode, 'Landkoder'),
					obj('Skifteform', doedsboKriterier.skifteform),
					obj('Dato utstedt', Formatters.formatDate(doedsboKriterier.utstedtDato)),
					obj('Gyldig fra', Formatters.formatDate(doedsboKriterier.gyldigFom)),
					obj('Gyldig til', Formatters.formatDate(doedsboKriterier.gyldigTom))
				]
			}
			data.push(doedsbo)
		}

		if (pdlforvalterKriterier.utenlandskIdentifikasjonsnummer) {
			const uidnr = pdlforvalterKriterier.utenlandskIdentifikasjonsnummer

			const flatUidnrKriterier = []
			uidnr.forEach(ui => {
				flatUidnrKriterier.push({
					identifikasjonsnummer: ui.identifikasjonsnummer,
					kilde: ui.kilde,
					opphoert: ui.opphoert,
					utstederland: ui.utstederland
				})
			})

			const uidnrObj = {
				header: 'Utenlandsk identifikasjonsnummer',
				itemRows: []
			}

			flatUidnrKriterier.forEach((uidr, i) => {
				uidnrObj.itemRows.push([
					{
						numberHeader: `Utenlandsk identifikasjonsnummer ${i + 1}`
					},
					obj('Utenlands-ID', uidr.identifikasjonsnummer),
					obj('Kilde', uidr.kilde),
					obj('Utenlands-ID opphørt', Formatters.oversettBoolean(uidr.opphoert)),
					obj('Utstederland', uidr.utstederland, 'Landkoder')
				])
			})
			data.push(uidnrObj)
		}

		if (pdlforvalterKriterier.falskIdentitet) {
			const falskIdData = pdlforvalterKriterier.falskIdentitet.rettIdentitet

			if (falskIdData.identitetType === 'UKJENT') {
				const falskId = {
					header: 'Falsk identitet',
					items: [
						{
							label: 'Rett identitet',
							value: 'Ukjent'
						}
					]
				}
				data.push(falskId)
			} else if (falskIdData.identitetType === 'ENTYDIG') {
				const falskId = {
					header: 'Falsk identitet',
					items: [
						{
							label: 'Rett fødselsnummer',
							value: falskIdData.rettIdentitetVedIdentifikasjonsnummer
						}
					]
				}
				data.push(falskId)
			} else if (falskIdData.identitetType === 'OMTRENTLIG') {
				const falskId = {
					header: 'Falsk identitet',
					items: [
						obj('Rett identitet', 'Kjent ved personopplysninger'),
						obj('Fornavn', falskIdData.personnavn.fornavn),
						obj('Mellomnavn', falskIdData.personnavn.mellomnavn),
						obj('Etternavn', falskIdData.personnavn.etternavn),
						obj('Kjønn', falskIdData.kjoenn),
						obj('Fødselsdato', Formatters.formatDate(falskIdData.foedselsdato)),
						obj('Statsborgerskap', Formatters.arrayToString(falskIdData.statsborgerskap))
					]
				}
				data.push(falskId)
			}
		}
	}
	const arenaKriterier = bestillingData.arenaforvalter

	if (arenaKriterier) {
		const arenaforvalter = {
			header: 'Arena',
			items: [
				obj(
					'Brukertype',
					Formatters.uppercaseAndUnderscoreToCapitalized(arenaKriterier.arenaBrukertype)
				),
				obj('Servicebehov', arenaKriterier.kvalifiseringsgruppe),
				obj('Inaktiv fra dato', Formatters.formatDate(arenaKriterier.inaktiveringDato)),
				obj('Har 11-5 vedtak', Formatters.oversettBoolean(arenaKriterier.aap115 && true)),
				obj(
					'Fra dato',
					arenaKriterier.aap115 && Formatters.formatDate(arenaKriterier.aap115[0].fraDato)
				),
				obj(
					'Har AAP vedtak UA - positivt utfall',
					Formatters.oversettBoolean(arenaKriterier.aap && true)
				),
				obj('Fra dato', arenaKriterier.aap && Formatters.formatDate(arenaKriterier.aap[0].fraDato)),
				obj('Til dato', arenaKriterier.aap && Formatters.formatDate(arenaKriterier.aap[0].tilDato))
			]
		}
		data.push(arenaforvalter)
	}

	const instKriterier = bestillingData.instdata

	if (instKriterier) {
		// Flater ut instKriterier for å gjøre det lettere å mappe

		let flatInstKriterier = []
		instKriterier.forEach(i => {
			flatInstKriterier.push({
				institusjonstype: i.institusjonstype,
				varighet: i.varighet,
				startdato: i.startdato,
				faktiskSluttdato: i.faktiskSluttdato
			})
		})

		const instObj = {
			header: 'Institusjonsopphold',
			itemRows: []
		}

		flatInstKriterier.forEach((inst, i) => {
			instObj.itemRows.push([
				{
					numberHeader: `Institusjonsopphold ${i + 1}`
				},
				obj('Institusjonstype', Formatters.showLabel('institusjonstype', inst.institusjonstype)),
				obj('Varighet', inst.varighet && Formatters.showLabel('varighet', inst.varighet)),
				obj('Startdato', Formatters.formatDate(inst.startdato)),
				obj('Sluttdato', Formatters.formatDate(inst.faktiskSluttdato))
			])
		})
		data.push(instObj)
	}

	const udiStubKriterier = bestillingData.udistub

	if (udiStubKriterier) {
		const oppholdKriterier = udiStubKriterier.oppholdStatus
		const arbeidsadgangKriterier = udiStubKriterier.arbeidsadgang

		const oppholdsrettTyper = [
			'eosEllerEFTABeslutningOmOppholdsrett',
			'eosEllerEFTAVedtakOmVarigOppholdsrett',
			'eosEllerEFTAOppholdstillatelse'
		]
		const currentOppholdsrettType =
			oppholdKriterier && oppholdsrettTyper.find(type => oppholdKriterier[type])

		const currentTredjelandsborgereStatus =
			oppholdKriterier && oppholdKriterier.oppholdSammeVilkaar
				? 'Oppholdstillatelse eller opphold på samme vilkår'
				: oppholdKriterier && oppholdKriterier.uavklart
				? 'Uavklart'
				: udiStubKriterier.harOppholdsTillatelse === false
				? 'Ikke oppholdstillatalse eller ikke opphold på samme vilkår'
				: null

		const oppholdsrett = Boolean(currentOppholdsrettType)
		const tredjelandsborger = Boolean(currentTredjelandsborgereStatus)

		let aliaserListe = []
		udiStubKriterier.aliaser &&
			udiStubKriterier.aliaser.forEach((alias, i) => {
				if (alias.nyIdent === false) {
					aliaserListe.push(`#${i + 1} Navn\n`)
				} else {
					aliaserListe.push(`#${i + 1} ID-nummer - ${alias.identtype}\n`)
				}
			})

		const udistub = {
			header: 'UDI',
			items: [
				obj(
					'Oppholdsstatus',
					oppholdsrett ? 'EØS-eller EFTA-opphold' : tredjelandsborger ? 'Tredjelandsborger' : null
				),
				obj(
					'Type opphold',
					oppholdsrett && Formatters.showLabel('eosEllerEFTAtypeOpphold', currentOppholdsrettType)
				),
				obj('Status', currentTredjelandsborgereStatus),
				obj(
					'Oppholdstillatelse fra dato',
					Formatters.formatDate(
						_get(oppholdKriterier, `${currentOppholdsrettType}Periode.fra`) ||
							_get(oppholdKriterier, 'oppholdSammeVilkaar.oppholdSammeVilkaarPeriode.fra')
					)
				),
				obj(
					'Oppholdstillatelse til dato',
					Formatters.formatDate(
						_get(oppholdKriterier, `${currentOppholdsrettType}Periode.til`) ||
							_get(oppholdKriterier, 'oppholdSammeVilkaar.oppholdSammeVilkaarPeriode.til')
					)
				),
				obj(
					'Effektueringsdato',
					Formatters.formatDate(
						_get(oppholdKriterier, `${currentOppholdsrettType}Effektuering`) ||
							_get(oppholdKriterier, 'oppholdSammeVilkaar.oppholdSammeVilkaarEffektuering')
					)
				),
				obj(
					'Grunnlag for opphold',
					oppholdsrett &&
						Formatters.showLabel(currentOppholdsrettType, oppholdKriterier[currentOppholdsrettType])
				),
				obj(
					'Type oppholdstillatelse',
					Formatters.showLabel(
						'oppholdstillatelseType',
						_get(oppholdKriterier, 'oppholdSammeVilkaar.oppholdstillatelseType')
					)
				),
				obj(
					'Vedtaksdato',
					Formatters.formatDate(
						_get(oppholdKriterier, 'oppholdSammeVilkaar.oppholdstillatelseVedtaksDato')
					)
				),
				obj(
					'Har arbeidsadgang',
					Formatters.allCapsToCapitalized(
						arbeidsadgangKriterier && arbeidsadgangKriterier.harArbeidsAdgang
					)
				),
				obj(
					'Type arbeidsadgang',
					Formatters.showLabel(
						'typeArbeidsadgang',
						arbeidsadgangKriterier && arbeidsadgangKriterier.typeArbeidsadgang
					)
				),
				obj(
					'Arbeidsomfang',
					Formatters.showLabel(
						'arbeidsOmfang',
						arbeidsadgangKriterier && arbeidsadgangKriterier.arbeidsOmfang
					)
				),
				obj(
					'Arbeidsadgang fra dato',
					Formatters.formatDate(_get(arbeidsadgangKriterier, 'periode.fra'))
				),
				obj(
					'Arbeidsadgang til dato',
					Formatters.formatDate(_get(arbeidsadgangKriterier, 'periode.til'))
				),
				obj('Alias', aliaserListe.length > 0 && aliaserListe),
				obj('Flyktningstatus', Formatters.oversettBoolean(udiStubKriterier.flyktning)),
				obj(
					'Asylsøker',
					Formatters.showLabel(
						'jaNeiUavklart',
						udiStubKriterier.soeknadOmBeskyttelseUnderBehandling
					)
				)
			]
		}
		data.push(udistub)
	}
	return data
}
