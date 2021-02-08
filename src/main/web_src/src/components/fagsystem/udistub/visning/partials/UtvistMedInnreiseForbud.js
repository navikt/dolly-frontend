import React from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import _get from 'lodash/get'

export const UtvistMedInnreiseForbud = ({ oppholdsstatus }) =>
	oppholdsstatus?.ikkeOppholdstilatelseIkkeVilkaarIkkeVisum?.utvistMedInnreiseForbud ? (
		<>
			<h4>Utvist med innreiseforbud</h4>
			<div className="person-visning_content">
				<TitleValue
					title="Innreiseforbud"
					value={Formatters.showLabel(
						'jaNeiUavklart',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbud'
						)
					)}
				/>
				<TitleValue
					title="Innreiseforbud vedtatt"
					value={Formatters.formatDate(
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.innreiseForbudVedtaksDato'
						)
					)}
				/>
				<TitleValue
					title="Varighet"
					value={Formatters.showLabel(
						'varighet',
						_get(
							oppholdsstatus,
							'ikkeOppholdstilatelseIkkeVilkaarIkkeVisum.utvistMedInnreiseForbud.varighet'
						)
					)}
				/>
			</div>
		</>
	) : null
