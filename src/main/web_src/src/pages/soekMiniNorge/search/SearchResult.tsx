import React, { useState } from 'react'
import DollyTable from '~/components/ui/dollyTable/DollyTable'
import ContentContainer from '~/components/ui/contentContainer/ContentContainer'
import LoadableComponent from '~/components/ui/loading/LoadableComponent'
// @ts-ignore
import { HodejegerenApi } from '~/service/Api'
import { ManIconItem, WomanIconItem } from '~/components/ui/icon/IconItem'
import ResultatVisningConnecter from '~/pages/soekMiniNorge/search/ResultatVisning/ResultatVisningConnecter'
import { Innhold } from '../hodejegeren/types'
import { VelgPerson } from './ImportTilDolly/VelgPerson'
import { ImportTilDolly } from './ImportTilDolly/ImportTilDolly'
import Button from '~/components/ui/button/Button'

interface SearchResultVisningProps {
	soekOptions: string
	searchActive: boolean
	soekNummer: number
	antallResultat: number
}

export const SearchResult = (props: SearchResultVisningProps) => {
	const [valgtePersoner, setValgtePersoner] = useState([])

	if (!props.searchActive) {
		return <ContentContainer>Ingen søk er gjort</ContentContainer>
	}
	if (props.soekOptions === '' && props.searchActive) {
		return <ContentContainer>Vennligst fyll inn en eller flere verdier å søke på.</ContentContainer>
	}

	const columns = [
		{
			text: 'Ident',
			width: '20',
			dataField: 'personIdent.id',
			unique: true
		},
		{
			text: 'Type',
			width: '10',
			dataField: 'personIdent.type'
		},
		{
			text: 'Navn',
			width: '30',
			dataField: 'navn.fornavn',
			formatter: (cell: string, row: Innhold) => {
				return row.navn.fornavn + ' ' + row.navn.slektsnavn
			}
		},
		{
			text: 'Kjønn',
			width: '10',
			dataField: 'personInfo.kjoenn'
		},
		{
			text: 'Alder',
			width: '10',
			dataField: 'personInfo.datoFoedt',
			formatter: (cell: Date, row: Innhold) => {
				const foedselsdato = new Date(row.personInfo.datoFoedt)
				const diff_ms = Date.now() - foedselsdato.getTime()
				const age_dt = new Date(diff_ms)

				return Math.abs(age_dt.getUTCFullYear() - 1970)
			}
		},
		{
			text: 'Velg alle',
			width: '15',
			dataField: 'velg',
			headerFormatter: (text: string, data: Array<Innhold>) => {
				return (
					<Button
						onClick={() =>
							valgtePersoner.length < 1
								? setValgtePersoner(data.map(person => person.personIdent.id))
								: setValgtePersoner([])
						}
					>
						{text}
					</Button>
				)
			},
			formatter: (cell: any, row: Innhold) => (
				<VelgPerson
					personinfo={row}
					valgtePersoner={valgtePersoner}
					setValgtePersoner={setValgtePersoner}
				/>
			)
		}
	]

	return (
		<LoadableComponent
			onFetch={() => HodejegerenApi.soek(props.soekOptions, props.antallResultat)}
			render={(data: Array<Innhold>) => {
				return !data ? (
					<ContentContainer>Søket gav ingen resultater.</ContentContainer>
				) : (
					<>
						<DollyTable
							data={data}
							columns={columns}
							pagination
							iconItem={(bruker: Innhold) =>
								bruker.personInfo.kjoenn === 'M' ? <ManIconItem /> : <WomanIconItem />
							}
							onExpand={(bruker: Innhold) => (
								<ResultatVisningConnecter personId={bruker.personIdent.id} data={bruker} />
							)}
						/>
						<ImportTilDolly valgtePersoner={valgtePersoner} />
					</>
				)
			}}
		/>
	)
}
