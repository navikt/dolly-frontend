import React, { useEffect, useState } from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import { TpsfApi } from '~/service/Api'
import { Adressevisning } from './Boadresse'
import { PostadresseVisning } from './Postadresse'
import { Historikk } from '~/components/ui/historikk/Historikk'
import { PersoninformasjonKodeverk } from '~/config/kodeverk'

export const Foreldre = ({ data }) => {
	if (!data) return null
	const [foreldreInfo, setForeldreInfo] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			const respons = await TpsfApi.getPersoner([data.ident])
			setForeldreInfo(respons.data)
			setIsLoading(false)
		}
		fetchData()
	}, [])

	return (
		<>
			<div className="person-visning_content">
				<TitleValue title={data.identtype} value={data.ident} />
				<TitleValue title="Fornavn" value={data.fornavn} />
				<TitleValue title="Mellomnavn" value={data.mellomnavn} />
				<TitleValue title="Etternavn" value={data.etternavn} />
				<TitleValue title="Kjønn" value={Formatters.kjonn(data.kjonn, data.alder)} />
				<TitleValue title="Alder" value={data.alder} />
				<TitleValue title="Dødsdato" value={Formatters.formatDate(data.doedsdato)} />
				<TitleValue title="Foreldretype" value={data.foreldreType} />
				<TitleValue
					title="Diskresjonskode"
					kodeverk={PersoninformasjonKodeverk.Diskresjonskoder}
					value={data.spesreg}
				/>
				<TitleValue title="Uten fast bopel" value={data.utenFastBopel && 'Ja'} />
				{foreldreInfo && !isLoading && foreldreInfo.length > 0 && (
					<TitleValue title="Barn" value={finnBarn(foreldreInfo[0].relasjoner).join(', ')} />
				)}
			</div>
			{data.boadresse.length > 0 && (
				<Historikk component={Adressevisning} propName="boadresse" data={data.boadresse} />
			)}
			{data.postadresse.length > 0 && (
				<Historikk component={PostadresseVisning} propName="postadresse" data={data.postadresse} />
			)}
		</>
	)
}

const finnBarn = relasjoner =>
	relasjoner
		.filter(relasjon => {
			return relasjon.relasjonTypeNavn === 'BARN'
		})
		.map(
			relasjon =>
				relasjon.personRelasjonMed.fornavn +
				' ' +
				relasjon.personRelasjonMed.etternavn +
				' (' +
				relasjon.personRelasjonMed.ident +
				')'
		)
