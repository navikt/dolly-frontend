import React from 'react'
import _get from 'lodash/get'
import Formatters from '~/utils/DataFormatter'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { Bidiagnoser } from './partials/Bidiagnoser'
import { Perioder } from './partials/Perioder'
import { ArbeidKodeverk } from '~/config/kodeverk'

interface SykemeldingVisning {
	data: Array<Sykemelding>
}

type Sykemelding = {
	syntSykemelding: {
		startDato: string
		orgnummer: string
		arbeidsforholdId: string
	}
}

type Bestilling = {
	sykemelding?: Array<Sykemelding>
}

export const SykemeldingVisning = ({ data }: SykemeldingVisning) => {
	// Viser foreløpig bestillingsdata
	if (!data || data.length < 1 || !data[0]) return null
	// console.log('data :>> ', data)
	return (
		<div>
			<SubOverskrift label="Sykemelding" iconKind="sykdom" />
			{data.map((bestilling, idx) => {
				const syntSykemelding = _get(bestilling, 'syntSykemelding')
				const detaljertSykemelding = _get(bestilling, 'detaljertSykemelding')
				console.log('syntSykemelding :>> ', syntSykemelding)
				console.log('detaljertSykemelding :>> ', detaljertSykemelding)
				return syntSykemelding ? (
					<div className="person-visning_content" key={idx}>
						<TitleValue
							title="Startdato"
							value={Formatters.formatStringDates(_get(bestilling, 'syntSykemelding.startDato'))}
						/>
						<TitleValue
							title="Organisasjonsnummer"
							value={_get(bestilling, 'syntSykemelding.orgnummer')}
						/>
						<TitleValue
							title="Arbeidsforhold-ID"
							value={_get(bestilling, 'syntSykemelding.arbeidsforholdId')}
						/>
					</div>
				) : detaljertSykemelding ? (
					<>
						<div className="person-visning_content" key={idx}>
							<TitleValue
								title="Startdato"
								value={Formatters.formatDate(detaljertSykemelding.startDato)}
							/>
							<TitleValue
								title="Trenger umiddelbar bistand"
								value={Formatters.oversettBoolean(detaljertSykemelding.umiddelbarBistand)}
							/>
							<TitleValue
								title=" Manglende tilrettelegging på arbeidsplassen"
								value={Formatters.oversettBoolean(
									detaljertSykemelding.manglendeTilretteleggingPaaArbeidsplassen
								)}
							/>
						</div>
						<>
							<h4>Diagnose</h4>
							<div className="person-visning_content">
								<TitleValue title="Diagnose" value={detaljertSykemelding.hovedDiagnose.diagnose} />
								<TitleValue
									title="Diagnosekode"
									value={detaljertSykemelding.hovedDiagnose.diagnosekode}
								/>
								{/* <TitleValue title="System" value={detaljertSykemelding.hovedDiagnose.system} /> */}
							</div>
						</>
						<Bidiagnoser data={detaljertSykemelding.biDiagnoser} />
						<>
							<h4>Lege</h4>
							<div className="person-visning_content">
								<TitleValue
									title="Navn"
									value={`${detaljertSykemelding.lege.fornavn} ${
										detaljertSykemelding.lege.mellomnavn ? detaljertSykemelding.lege.mellomnavn : ''
									} ${detaljertSykemelding.lege.etternavn}`}
								/>
								<TitleValue title="Ident" value={detaljertSykemelding.lege.ident} />
								<TitleValue title="HPR-nummer" value={detaljertSykemelding.lege.hprId} />
							</div>
						</>
						<>
							<h4>Arbeidsgiver</h4>
							<div className="person-visning_content">
								<TitleValue title="Navn" value={detaljertSykemelding.arbeidsgiver.navn} />
								<TitleValue
									title="Yrkesbetegnelse"
									value={detaljertSykemelding.arbeidsgiver.yrkesbetegnelse}
									// kodeverk={ArbeidKodeverk.Arbeidstidsordninger}
								/>
								<TitleValue
									title="Stillingsprosent"
									value={detaljertSykemelding.arbeidsgiver.stillingsprosent}
								/>
							</div>
						</>
						<Perioder data={detaljertSykemelding.perioder} />
						<>
							<h4>Detaljer</h4>
							<div className="person-visning_content">
								<TitleValue
									title="Tiltak fra nav"
									value={detaljertSykemelding.detaljer.tiltakNav}
								/>
								<TitleValue
									title="Tiltak på arbeidsplass"
									value={detaljertSykemelding.detaljer.tiltakArbeidsplass}
								/>
								<TitleValue
									title="Hensyn på arbeidsplass"
									value={detaljertSykemelding.detaljer.beskrivHensynArbeidsplassen}
								/>
								<TitleValue
									title="Arbeidsfør etter endt periode"
									value={Formatters.oversettBoolean(
										detaljertSykemelding.detaljer.arbeidsforEtterEndtPeriode
									)}
								/>
							</div>
						</>
					</>
				) : null
			})}
		</div>
	)
}

SykemeldingVisning.filterValues = (bestillinger: Array<Bestilling>) => {
	if (!bestillinger) return null
	return bestillinger.map((bestilling: any) => bestilling.sykemelding)
}
