import React from 'react'
import _get from 'lodash/get'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import Loading from '~/components/ui/loading/Loading'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'

export const Visning = ({ data }) => {
	if (!data) return null
	return (
		<>
			<TitleValue title="Brukertype" value={data.brukertype} />
			<TitleValue title="Servicebehov" value={data.servicebehov} />
			<TitleValue title="Inaktiv fra dato" value={data.inaktiveringDato} />
			<TitleValue
				title="Automatisk innsending av meldekort"
				value={data.automatiskInnsendingAvMeldekort}
			/>

			{data.aap115?.[0] && (
				<DollyFieldArray header="11.5 vedtak" data={data.aap115} nested>
					{(vedtak, idx) => (
						<React.Fragment key={idx}>
							<TitleValue title="Fra dato" value={Formatters.formatDate(vedtak.fraDato)} />
						</React.Fragment>
					)}
				</DollyFieldArray>
			)}

			{data.aap?.[0] && (
				<DollyFieldArray header="AAP-UA vedtak" data={data.aap} nested>
					{(vedtak, idx) => (
						<React.Fragment key={idx}>
							<TitleValue title="Fra dato" value={Formatters.formatDate(vedtak.fraDato)} />
							<TitleValue title="Til dato" value={Formatters.formatDate(vedtak.tilDato)} />
						</React.Fragment>
					)}
				</DollyFieldArray>
			)}

			{data.dagpenger?.[0] && (
				<DollyFieldArray header="Dagpenger vedtak" data={data.dagpenger} nested>
					{(vedtak, idx) => (
						<React.Fragment key={idx}>
							<TitleValue title="Rettighet kode" value={vedtak.rettighetKode} />
							<TitleValue title="Fra dato" value={Formatters.formatDate(vedtak.fraDato)} />
							<TitleValue title="Til dato" value={Formatters.formatDate(vedtak.tilDato)} />
							<TitleValue title="Mottatt dato" value={Formatters.formatDate(vedtak.mottattDato)} />
						</React.Fragment>
					)}
				</DollyFieldArray>
			)}
		</>
	)
}

export const ArenaVisning = ({ data, bestillinger, loading }) => {
	if (loading) return <Loading label="Laster arena-data" />
	if (!data) return false

	const sortedData = Array.isArray(data.arbeidsokerList)
		? data.arbeidsokerList.slice().reverse()
		: data.arbeidsokerList

	const arenaBestillinger = bestillinger.filter(bestilling =>
		bestilling.data.hasOwnProperty('arenaforvalter')
	)

	const visningData = {
		brukertype: undefined,
		servicebehov: undefined,
		inaktiveringDato: undefined,
		automatiskInnsendingAvMeldekort: undefined,
		aap115: [],
		aap: [],
		dagpenger: []
	}

	const fyllVisningData = (idx, info) => {
		const {
			kvalifiseringsgruppe,
			inaktiveringDato,
			automatiskInnsendingAvMeldekort,
			aap115,
			aap,
			dagpenger
		} = arenaBestillinger[idx].data.arenaforvalter

		if (visningData.brukertype === undefined) {
			visningData.brukertype = info.servicebehov ? 'Med servicebehov' : 'Uten servicebehov'
			visningData.servicebehov = servicebehovKodeTilBeskrivelse(kvalifiseringsgruppe)
			visningData.inaktiveringDato = Formatters.formatDate(inaktiveringDato)
			visningData.automatiskInnsendingAvMeldekort = Formatters.oversettBoolean(
				automatiskInnsendingAvMeldekort
			)
		}
		if (aap115) visningData.aap115 = visningData.aap115.concat(aap115)
		if (aap) visningData.aap = visningData.aap.concat(aap)
		if (dagpenger) visningData.dagpenger = visningData.dagpenger.concat(dagpenger)
	}

	// Arenaforvalternen returnerer veldig lite informasjon, bruker derfor data fra bestillingen i tillegg
	sortedData.forEach((info, idx) => {
		if (_get(arenaBestillinger, `[${idx}].data.arenaforvalter`) !== undefined) {
			fyllVisningData(idx, info)
		}
	})

	return (
		<div>
			<SubOverskrift label="Arbeidsytelser" iconKind="arena" />
			<div className="person-visning_content">
				<Visning data={visningData} />
			</div>
		</div>
	)
}

function servicebehovKodeTilBeskrivelse(value) {
	if (!value) return null
	switch (value) {
		case 'IKVAL':
			return 'IKVAL - Standardinnsats'
		case 'BFORM':
			return 'BFORM - Situasjonsbestemt innsats'
		case 'BATT':
			return 'BATT - Spesielt tilpasset innsats'
		case 'VARIG':
			return 'VARIG - Varig tilpasset innsats'
		default:
			return value
	}
}
