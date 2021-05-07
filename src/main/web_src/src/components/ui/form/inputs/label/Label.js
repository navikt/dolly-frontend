import React from 'react'
import cn from 'classnames'
import _isNil from 'lodash/isNil'

export const Label = ({ name, label, feil, containerClass, children }) => {
	const wrapClass = cn('dolly-skjemaelement', containerClass, {
		error: Boolean(feil),
		'label-offscreen': _isNil(label)
	})
	return (
		<div className={wrapClass}>
			<label htmlFor={name} className="dolly-skjemaelement__label">
				{label}
			</label>
			{children}
			{feil && (
				<div role="alert" aria-live="assertive">
					<div className="dolly-skjemaelement__feilmelding">{feil.feilmelding}</div>
				</div>
			)}
		</div>
	)
}
