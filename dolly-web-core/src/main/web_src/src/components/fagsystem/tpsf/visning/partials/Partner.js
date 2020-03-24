import React from 'react'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import { Adressevisning } from './Boadresse'
import { Historikk } from '~/components/ui/historikk/Historikk'
import { PersoninformasjonKodeverk } from '~/config/kodeverk'

export const Partner = ({ data }) => {
	if (!data) return false

	return (
		<React.Fragment>
			<div className="person-visning_content">
				<TitleValue title={data.identtype} value={data.ident} />
				<TitleValue title="Fornavn" value={data.fornavn} />
				<TitleValue title="Mellomnavn" value={data.mellomnavn} />
				<TitleValue title="Etternavn" value={data.etternavn} />
				<TitleValue title="Kjønn" value={Formatters.kjonn(data.kjonn, data.alder)} />
				<TitleValue title="Alder" value={Formatters.formatAlder(data.alder, data.doedsdato)} />
				<TitleValue title="Diskresjonskode" value={Formatters.showLabel(data.spesreg)} />
				<TitleValue title="Uten fast bopel" value={data.utenFastBopel && 'Ja'} />
				{!data.utenFastBopel && (
					<Historikk component={Adressevisning} propName="boadresse" data={data.boadresse} />
				)}
			</div>
			{data.sivilstander.length > 0 && (
				<DollyFieldArray header="Forhold" data={data.sivilstander} nested>
					{(forhold, idx) => (
						<div key={idx} className="person-visning_content">
							<TitleValue
								title="Forhold til partner (sivilstand)"
								kodeverk={PersoninformasjonKodeverk.Sivilstander}
								value={forhold.sivilstand}
								size="medium"
							/>
							<TitleValue
								title="Sivilstand fra dato"
								value={Formatters.formatDate(forhold.sivilstandRegdato)}
							/>
						</div>
					)}
				</DollyFieldArray>
			)}
		</React.Fragment>
	)
}
