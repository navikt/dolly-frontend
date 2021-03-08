import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import React from 'react'
import styled from 'styled-components'
import { Person } from '~/service/services/personsearch/types'
import Formatters from '~/utils/DataFormatter'
import { AdresseKodeverk, GtKodeverk } from '~/config/kodeverk'

type Props = {
	person: Person
}

const Group = styled.div`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 10px;
`

const Title = styled(TitleValue)`
	margin-bottom: 10px;
`

export default ({ person }: Props) => (
	<>
		<section>
			<SubOverskrift label="Persondetaljer" iconKind="personinformasjon" />
			<Group>
				<Title title="Ident" value={person.ident} />
				<Title title="Aktør Id" value={person.aktorId} />
				<Title title="Fornavn" value={person.fornavn} />
				<Title title="Mellomnavn" value={person.mellomnavn} />
				<Title title="Etternavn" value={person.etternavn} />
				<Title title="Kjønn" value={person.kjoenn} />
				<Title
					title="Fødselsdato"
					value={Formatters.formatStringDates(person.foedsel?.foedselsdato)}
				/>
				<Title title="Sivilstand" value={person.sivilstand?.type} />
			</Group>
		</section>
		<section>
			<SubOverskrift label="Nasjonalitet" iconKind="nasjonalitet" />
			<Group>
				<TitleValue
					title="Statsborgerskap"
					value={person.statsborgerskap?.land}
					kodeverk={GtKodeverk.LAND}
				/>
			</Group>
		</section>
		{!!person.innfyttingTilNorge ? (
			<section>
				<SubOverskrift label="Innfytting til Norge" />
				<Group>
					<TitleValue
						title="Fraflyttingsland"
						value={person.innfyttingTilNorge?.fraflyttingsland}
						kodeverk={GtKodeverk.LAND}
					/>
					<Title
						title="fraflyttingssted i utlandet"
						value={person.innfyttingTilNorge?.fraflyttingsstedIUtlandet}
					/>
				</Group>
			</section>
		) : null}
		{!!person.utfyttingFraNorge ? (
			<section>
				<SubOverskrift label="Utfytting fra Norge" />
				<Group>
					<TitleValue
						title="Tilflyttingsland"
						value={person.utfyttingFraNorge?.tilflyttingsland}
						kodeverk={GtKodeverk.LAND}
					/>
					<Title
						title="Tilflyttingsland i utlandet"
						value={person.utfyttingFraNorge?.tilflyttingsstedIUtlandet}
					/>
					<Title
						title="Utflyttingsdato"
						value={Formatters.formatStringDates(person.utfyttingFraNorge?.utflyttingsdato)}
					/>
				</Group>
			</section>
		) : null}
	</>
)
