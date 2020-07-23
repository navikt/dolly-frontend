import React from 'react'
import cn from 'classnames'
import _isNil from 'lodash/isNil'

export const Label = ({ name, label, feil, containerClass, children }) => {
	const wrapClass = cn('skjemaelement', containerClass, {
		error: Boolean(feil),
		'label-offscreen': _isNil(label)
	})
	return (
		<div className={wrapClass}>
			<label htmlFor={name} className="skjemaelement__label">
				{label}
			</label>
			{children}
			{feil && (
				<div role="alert" aria-live="assertive">
					<div className="skjemaelement__feilmelding">{feil.feilmelding}</div>
				</div>
			)}
		</div>
	)
}
