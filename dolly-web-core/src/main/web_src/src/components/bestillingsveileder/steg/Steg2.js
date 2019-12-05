import React from 'react'
import * as Yup from 'yup'
import { AlertStripeInfo } from 'nav-frontend-alertstriper'
import { TpsfForm } from '~/components/fagsystem/tpsf/form/Form'
import { KrrstubForm } from '~/components/fagsystem/krrstub/form/Form'
import { SigrunstubForm } from '~/components/fagsystem/sigrunstub/form/Form'
import { AaregForm } from '~/components/fagsystem/aareg/form/Form'
import { PdlfForm } from '~/components/fagsystem/pdlf/Form'
import { ArenaForm } from '~/components/fagsystem/arena/form/Form'
import { InstForm } from '~/components/fagsystem/inst/Form'
import { UdistubForm } from '~/components/fagsystem/udistub/form/Form'

export const Steg2 = ({ formikBag, attributter }) => {
	const avhukedeAttributter = Object.values(attributter).some(a => a)

	return (
		<div>
			{avhukedeAttributter ? (
				<div>
					<TpsfForm formikBag={formikBag} />
					<InstForm formikBag={formikBag} />
					<KrrstubForm formikBag={formikBag} />
					<AaregForm formikBag={formikBag} />
					<SigrunstubForm formikBag={formikBag} />
					<ArenaForm formikBag={formikBag} />
					<UdistubForm formikBag={formikBag} />
					<PdlfForm formikBag={formikBag} />
				</div>
			) : (
				<AlertStripeInfo>
					Du har ikke valgt noen attributter. Dolly oppretter testpersoner med tilfeldige verdier.
				</AlertStripeInfo>
			)}
		</div>
	)
}

Steg2.label = 'Velg verdier'
Steg2.initialValues = attrs => {
	return Object.assign(
		{},
		{
			...TpsfForm.initialValues(attrs),
			...KrrstubForm.initialValues(attrs),
			...AaregForm.initialValues(attrs),
			...SigrunstubForm.initialValues(attrs),
			...InstForm.initialValues(attrs),
			...ArenaForm.initialValues(attrs),
			...UdistubForm.initialValues(attrs),
			...PdlfForm.initialValues(attrs)
		}
	)
}
Steg2.validation = Yup.object({
	...TpsfForm.validation,
	...KrrstubForm.validation,
	...AaregForm.validation,
	...InstForm.validation,
	...ArenaForm.validation,
	...UdistubForm.validation,
	...PdlfForm.validation
})
