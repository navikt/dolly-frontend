import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { DollyApi } from '~/service/Api'
import LoadableComponent from '~/components/ui/loading/LoadableComponent'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'

interface DokarkivVisning {
	ident: string
}

type Dokumentvariant = {
	filnavn: string
	saksbehandlerHarTilgang: boolean
	skjerming: string
	variantformat: string
}

type Dokument = {
	brevkode?: string
	dokumentInfoId?: string
	dokumentvarianter: Array<Dokumentvariant>
	originalJournalpostId?: string
	tittel?: string
	feil?: string
}

type EnkeltDokument = {
	dokument: Dokument
}

type TransaksjonId = {
	transaksjonId: {
		journalpostId: string
	}
	miljoe: string
}

type Journalpost = {
	kanalnavn: string
	behandlingstemanavn: string
	dokumenter: Array<Dokument>
	temanavn: string
	journalfoerendeEnhet: string
	journalpostId: string
	tittel: string
	sak: {
		fagsaksystem: string
		fagsakId: string
	}
}
type Dokumentinfo = {
	data: {
		data?: {
			journalpost: Journalpost
		}
		feil?: string
	}
}

// Viser data fra Joark Dokumentinfo
export const DokarkivVisning = ({ ident }: DokarkivVisning) => (
	<div>
		<ErrorBoundary>
			<LoadableComponent
				onFetch={() =>
					DollyApi.getTransaksjonid('DOKARKIV', ident)
						.then(({ data }: { data: Array<TransaksjonId> }) => {
							return data.map((bestilling: TransaksjonId) => {
								return DollyApi.getDokarkivDokumentinfo(
									bestilling.transaksjonId.journalpostId,
									bestilling.miljoe
								)
									.then((response: Dokumentinfo) => {
										if (response) {
											if (response.data.feil) {
												return response.data
											}
											return response.data.data.journalpost
										}
									})
									.catch(error => console.error(error))
							})
						})
						.then((data: Array<Promise<any>>) => {
							return Promise.all(data)
						})
				}
				render={(data: Array<Journalpost>) => {
					const filteredData = data.filter(dokument => dokument.journalpostId != null)
					return (
						filteredData &&
						filteredData.length > 0 && (
							<ErrorBoundary>
								<>
									<SubOverskrift label="Dokumenter" iconKind="dokarkiv" />
									{filteredData.length > 1 ? (
										<DollyFieldArray data={filteredData} nested>
											{(dokument: Dokument, idx: number) => (
												<div key={idx} className="person-visning_content">
													<EnkelDokarkivVisning dokument={dokument} />
												</div>
											)}
										</DollyFieldArray>
									) : (
										<div className="person-visning_content">
											<EnkelDokarkivVisning dokument={filteredData[0]} />
										</div>
									)}
								</>
							</ErrorBoundary>
						)
					)
				}}
			/>
		</ErrorBoundary>
	</div>
)

const EnkelDokarkivVisning = (journalpost: Journalpost) => {
	if (journalpost) {
		if (journalpost.feil) {
			return <p style={{ margin: 0 }}>{journalpost.feil}</p>
		}
		return (
			<ErrorBoundary>
				<>
					<TitleValue title="Kanal" value={journalpost.kanalnavn} />
					<TitleValue title="Brevkode" value={journalpost.dokumenter[0].brevkode} />
					<TitleValue title="Tittel" value={journalpost.tittel} size={'medium'} />
					<TitleValue title="Tema" value={journalpost.temanavn} size={'small-plus'} />
					<TitleValue title="Fagsak-system" value={journalpost.sak?.fagsaksystem} />
					<TitleValue title="Fagsak-ID" value={journalpost.sak?.fagsakId} />
					<TitleValue title="Journalførende enhet" value={journalpost.journalfoerendeEnhet} />
					<TitleValue title="Journalpost-ID" value={journalpost.journalpostId} />
					{/*<TitleValue title="Dokumentinfo-ID" value={journalpost.dokumentInfoId} />*/}
				</>
			</ErrorBoundary>
		)
	}
}
