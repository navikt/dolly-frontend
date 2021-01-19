import React from 'react'
import SubOverskrift from '~/components/ui/subOverskrift/SubOverskrift'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'
import { UtenlandsId } from '~/components/fagsystem/pdlf/visning/partials/UtenlandsId'
import { FalskIdentitet } from '~/components/fagsystem/pdlf/visning/partials/FalskIdentitet'
import { KontaktinformasjonForDoedsbo } from '~/components/fagsystem/pdlf/visning/partials/KontaktinformasjonForDoedsbo'

export const PdlPersonInfo = ({ data, visTittel = true }) => {
	if (!data) {
		return null
	}

	const adressebeskyttelse = data.adressebeskyttelse[0]
	const personInfo = data.navn[0]

	return (
		<ErrorBoundary>
			<div>
				{visTittel && <SubOverskrift label="Persondetaljer" iconKind="personinformasjon" />}
				<div className="person-visning_content">
					<TitleValue title="Fornavn" value={personInfo.fornavn} />
					<TitleValue title="Mellomnavn" value={personInfo.mellomnavn} />
					<TitleValue title="Etternavn" value={personInfo.etternavn} />
					<TitleValue title="Kjønn" value={data.kjoenn[0].kjoenn} />
					<TitleValue title="Sivilstand" value={data.sivilstand[0].type} />
					<TitleValue title="Fødselsdato" value={data.foedsel[0].foedselsdato} />
					<h4 style={{ marginTop: '0px' }}>Adressebeskyttelse</h4>
					<div className="person-visning_content">
						<TitleValue
							title="Gradering (Diskresjonskode)"
							value={adressebeskyttelse && adressebeskyttelse.gradering}
						/>
						<TitleValue
							title="Kilde"
							value={
								adressebeskyttelse &&
								adressebeskyttelse.folkeregistermetadata &&
								adressebeskyttelse.folkeregistermetadata.kilde
							}
						/>
						<TitleValue
							title="Gyldighetstidspunkt"
							value={
								adressebeskyttelse &&
								adressebeskyttelse.folkeregistermetadata &&
								adressebeskyttelse.folkeregistermetadata.gyldighetstidspunkt
							}
						/>
					</div>
				</div>
				<UtenlandsId data={data.utenlandskIdentifikasjonsnummer} loading={false} />
				<FalskIdentitet data={data.falskIdentitet} loading={false} />
				<KontaktinformasjonForDoedsbo data={data.kontaktinformasjonForDoedsbo} loading={false} />
			</div>
		</ErrorBoundary>
	)
}
