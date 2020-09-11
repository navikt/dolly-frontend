import React from 'react'
import _get from 'lodash/get'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { DollyApi } from '~/service/Api'
import LoadableComponent from '~/components/ui/loading/LoadableComponent'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'

interface DokarkivVisning {
	ident: string
}

type Dokument = {
	brevkode: string
	dokumentInfoId: string
	journalfoerendeEnhet: string
	journalpostId: string
	kanal: string
	miljoe: string
	tema: string
	tittel: string
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

type Dokumentinfo = {
	data: {
		data: {
			journalpost: {
				kanalnavn: string
				dokumenter: Array<Dokument>
				temanavn: string
				journalfoerendeEnhet: string
				journalpostId: string
			}
		}
	}
}

export const DokarkivVisning = ({ ident }: DokarkivVisning) => {
	// Viser data fra Joark Dokumentinfo
	return (
		<div>
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
										const journalpost = response.data.data.journalpost
										return {
											kanal: journalpost.kanalnavn,
											brevkode: journalpost.dokumenter[0].brevkode,
											tittel: journalpost.dokumenter[0].tittel,
											tema: journalpost.temanavn,
											journalfoerendeEnhet: journalpost.journalfoerendeEnhet,
											journalpostId: journalpost.journalpostId,
											dokumentInfoId: journalpost.dokumenter[0].dokumentInfoId,
											miljoe: bestilling.miljoe
										}
									})
									.catch(error => console.error(error))
							})
						})
						.then((data: Array<Promise<any>>) => {
							return Promise.all(data)
						})
				}
				render={(data: Array<Dokument>) =>
					data &&
					data.length > 0 && (
						<>
							<SubOverskrift label="Dokumenter" iconKind="dokarkiv" />
							{data.length > 1 ? (
								<DollyFieldArray data={data} nested>
									{(dokument: Dokument, idx: number) => {
										return (
											<div key={idx} className="person-visning_content">
												<EnkelDokarkivVisning dokument={dokument} />
											</div>
										)
									}}
								</DollyFieldArray>
							) : (
								<div className="person-visning_content">
									<EnkelDokarkivVisning dokument={data[0]} />
								</div>
							)}
						</>
					)
				}
			/>
		</div>
	)
}

const EnkelDokarkivVisning = ({ dokument }: EnkeltDokument) => {
	return (
		<>
			<TitleValue title="Kanal" value={dokument.kanal} />
			<TitleValue title="Brevkode" value={dokument.brevkode} />
			<TitleValue title="Tittel" value={dokument.tittel} />
			<TitleValue title="Tema" value={dokument.tema} />
			<TitleValue title="Journalførende enhet" value={dokument.journalfoerendeEnhet} />
			<TitleValue title="Journalpost-ID" value={dokument.journalpostId} />
			<TitleValue title="Dokumentinfo-ID" value={dokument.dokumentInfoId} />
			<TitleValue title="Miljø" value={dokument.miljoe} />
		</>
	)
}
