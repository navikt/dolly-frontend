import React from 'react'
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper'

export const AlertAaregRequired = ({ meldingSkjema }) => {
	return (
		<AlertStripeAdvarsel style={{ marginBottom: '20px' }}>
			Personen må ha et arbeidsforhold knyttet til den samme virksomheten som du velger i{' '}
			{meldingSkjema}. Det kan du legge til ved å gå tilbake til forrige side og huke av for
			Arbeidsforhold (Aareg).
		</AlertStripeAdvarsel>
	)
}
