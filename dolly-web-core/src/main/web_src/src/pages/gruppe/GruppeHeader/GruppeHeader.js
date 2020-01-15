import React, { Fragment } from 'react'
import Button from '~/components/ui/button/Button'
import useBoolean from '~/utils/hooks/useBoolean'
import RedigerGruppeConnector from '~/components/redigerGruppe/RedigerGruppeConnector'
import FavoriteButtonConnector from '~/components/ui/button/FavoriteButton/FavoriteButtonConnector'
import { EksporterCSV } from '~/pages/gruppe/EksporterCSV/EksporterCSV'
import { SlettButton } from '~/components/ui/button/SlettButton/SlettButton'
import { Header } from '~/components/ui/header/Header'
import Formatters from '~/utils/DataFormatter'

import './GruppeHeader.less'

export default function GruppeHeader({ gruppe, identArray, isDeletingGruppe, deleteGruppe }) {
	const [visRedigerState, visRediger, skjulRediger] = useBoolean(false)

	return (
		<Fragment>
			<h1>{gruppe.navn}</h1>
			<Header className="gruppe-header" icon="group">
				<div className="flexbox">
					<Header.TitleValue title="Eier" value={gruppe.opprettetAvNavIdent} />
					<Header.TitleValue title="Antall personer" value={identArray.length} />
					<Header.TitleValue
						title="Sist endret"
						value={Formatters.formatStringDates(gruppe.datoEndret)}
					/>
					<Header.TitleValue
						title="Antall i bruk"
						value={identArray.map(p => p.ibruk).filter(Boolean).length}
					/>
					<Header.TitleValue title="Hensikt" value={gruppe.hensikt} />
				</div>
				<div className="gruppe-header_actions">
					{gruppe.erEierAvGruppe && (
						<Button kind="edit" onClick={visRediger}>
							REDIGER
						</Button>
					)}
					<SlettButton action={deleteGruppe} loading={isDeletingGruppe}>
						Er du sikker på at du vil slette denne gruppen?
					</SlettButton>
					<EksporterCSV identer={identArray} gruppeId={gruppe.id} />
					{!gruppe.erEierAvGruppe && <FavoriteButtonConnector groupId={gruppe.id} />}
				</div>
			</Header>

			{visRedigerState && <RedigerGruppeConnector gruppe={gruppe} onCancel={skjulRediger} />}
		</Fragment>
	)
}
