import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Stegindikator from 'nav-frontend-stegindikator'
import Steg1 from './Steps/Step1'
import Steg2 from './Steps/Step2'
import Steg3 from './Steps/Step3'
import { isPage } from './Utils'

import './Bestilling.less'

export default class Bestilling extends PureComponent {
	static propTypes = {}

	render() {
		const {
			values,
			page,
			identtype,
			antall,
			attributeIds,
			startBestilling,
			toggleAttribute,
			setValues,
			setValuesAndGoBack,
			setEnvironments,
			setEnvironmentsAndGoBack,
			postBestilling,
			environments
		} = this.props

		return (
			<div className="bestilling-page">
				<Stegindikator
					aktivtSteg={page}
					steg={[
						{ label: 'Velg egenskaper' },
						{ label: 'Velg verdier' },
						{ label: 'Oppsummering' }
					]}
					visLabel={true}
					kompakt={true}
				/>

				{isPage.first(page) && (
					<Steg1
						identtype={identtype}
						antall={antall}
						selectedAttributeIds={attributeIds}
						startBestilling={startBestilling}
						toggleAttributeSelection={toggleAttribute}
					/>
				)}

				{isPage.second(page) && (
					<Steg2
						identtype={identtype}
						antall={antall}
						selectedAttributeIds={attributeIds}
						setValues={setValues}
						values={values}
						setValuesAndGoBack={setValuesAndGoBack}
					/>
				)}

				{isPage.last(page) && (
					<Steg3
						identtype={identtype}
						antall={antall}
						selectedAttributeIds={attributeIds}
						values={values}
						postBestilling={postBestilling}
						setEnvironments={setEnvironments}
						environments={environments}
						setEnvironmentsAndGoBack={setEnvironmentsAndGoBack}
					/>
				)}
			</div>
		)
	}
}