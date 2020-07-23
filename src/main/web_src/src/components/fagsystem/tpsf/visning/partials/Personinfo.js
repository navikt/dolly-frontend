import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import { PersoninformasjonKodeverk, GtKodeverk } from '~/config/kodeverk'

export const Personinfo = ({ data, visTittel = true }) => {
	return (
		<div>
			{visTittel && <SubOverskrift label="Persondetaljer" iconKind="personinformasjon" />}
			<div className="person-visning_content">
				<TitleValue title={data.identtype} value={data.ident} />
				<TitleValue title="Fornavn" value={data.fornavn} />

				<TitleValue title="Mellomnavn" value={data.mellomnavn} />

				<TitleValue title="Etternavn" value={data.etternavn} />

				<TitleValue title="Kjønn" value={Formatters.kjonn(data.kjonn, data.alder)} />
				<TitleValue title="Alder" value={Formatters.formatAlder(data.alder, data.doedsdato)} />

				<TitleValue
					title="Personstatus"
					kodeverk={PersoninformasjonKodeverk.Personstatuser}
					value={data.personStatus}
				/>

				<TitleValue title="Savnet siden" value={Formatters.formatDate(data.forsvunnetDato)} />

				<TitleValue
					title="Sivilstand"
					kodeverk={PersoninformasjonKodeverk.Sivilstander}
					value={data.sivilstand}
				/>

				<TitleValue title="Bankkontonummer" value={data.bankkontonr} />

				<TitleValue
					title="Bankkonto opprettet"
					value={Formatters.formatDate(data.bankkontonrRegdato)}
				/>

				<TitleValue
					title={data.telefonnummer_2 ? 'Telefonnummer 1' : 'Telefonnummer'}
					value={data.telefonnummer_1 && `${data.telefonLandskode_1} ${data.telefonnummer_1}`}
				/>

				<TitleValue
					title="Telefonnummer 2"
					value={data.telefonnummer_2 && `${data.telefonLandskode_2} ${data.telefonnummer_2}`}
				/>

				{data.spesreg !== 'UFB' && (
					<TitleValue
						title="Diskresjonskoder"
						kodeverk={PersoninformasjonKodeverk.Diskresjonskoder}
						value={data.spesreg}
					/>
				)}

				{(data.utenFastBopel || data.spesreg === 'UFB') && (
					<TitleValue title="Uten fast bopel" value="JA" />
				)}

				{data.gtVerdi && (
					<TitleValue
						title="Geo. tilhør."
						kodeverk={GtKodeverk[data.gtType]}
						value={data.gtVerdi}
						size="medium"
					>
						{value => `${Formatters.gtTypeLabel(data.gtType)} - ${value.label}`}
					</TitleValue>
				)}

				<TitleValue
					title="TK-nummer"
					value={data.tknavn ? `${data.tknr} - ${data.tknavn}` : data.tknr}
					size="medium"
				/>
				{data.egenAnsattDatoFom && <TitleValue title="Egenansatt" value="JA" />}
			</div>
		</div>
	)
}
