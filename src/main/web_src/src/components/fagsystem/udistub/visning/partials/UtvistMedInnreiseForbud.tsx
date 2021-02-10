import React from 'react'
import { TitleValue } from '~/components/ui/titleValue/TitleValue'
import Formatters from '~/utils/DataFormatter'
import _get from 'lodash/get'

type UtvistMedInnreiseForbud = {
	innreiseForbud: string
	innreiseForbudVedtaksDato: string
	varighet: string
}

export const UtvistMedInnreiseForbud = (utvistMedInnreiseForbud: UtvistMedInnreiseForbud) =>
	Object.values(utvistMedInnreiseForbud).some(item => item !== null) && (
		<>
			<h4>Utvist med innreiseforbud</h4>
			<div className="person-visning_content">
				<TitleValue
					title="Innreiseforbud"
					value={Formatters.showLabel(
						'jaNeiUavklart',
						_get(utvistMedInnreiseForbud, 'innreiseForbud')
					)}
				/>
				<TitleValue
					title="Innreiseforbud vedtatt"
					value={Formatters.formatDate(_get(utvistMedInnreiseForbud, 'innreiseForbudVedtaksDato'))}
				/>
				<TitleValue
					title="Varighet"
					value={Formatters.showLabel('varighet', _get(utvistMedInnreiseForbud, 'varighet'))}
				/>
			</div>
		</>
	)
