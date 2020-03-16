import React from 'react'
import { useDispatch } from 'react-redux'
import { go } from 'connected-react-router'
import NavButton from '~/components/ui/button/NavButton/NavButton'

import './Navigation.less'

export const Navigation = ({ showPrevious, onPrevious, isLastStep, formikBag }) => {
	const dispatch = useDispatch()
	const { isSubmitting, handleSubmit } = formikBag

	const onAbort = () => dispatch(go(-1))

	return (
		<div className="step-navknapper-wrapper">
			<div className="step-navknapper">
				<NavButton onClick={onAbort}>AVBRYT</NavButton>

				<div className="step-navknapper--right">
					{showPrevious && <NavButton onClick={() => {onPrevious(formikBag)}}>Tilbake</NavButton>}
					{!isLastStep && (
						<NavButton type="hoved" disabled={isSubmitting} onClick={handleSubmit}>
							Videre
						</NavButton>
					)}
					{isLastStep && (
						<NavButton type="hoved" onClick={handleSubmit} disabled={isSubmitting}>
							OPPRETT
						</NavButton>
					)}
				</div>
			</div>
		</div>
	)
}
