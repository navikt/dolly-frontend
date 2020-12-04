import React from 'react'
import LoadableComponent, { Feilmelding } from '~/components/ui/loading/LoadableComponent'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { SelectOptionsOppslag } from '~/service/SelectOptionsOppslag'
import { ErrorBoundary } from '~/components/ui/appError/ErrorBoundary'

interface HelsepersonellSelect {
	name: string
	label: string
	afterChange: Function
}

type Option = {
	value: string
	label: string
	fnr: string
	fornavn: string
	mellomnavn?: string
	etternavn: string
	hprId: string
}

export default ({ name, label, afterChange }: HelsepersonellSelect) => {
	return (
		<ErrorBoundary>
			<LoadableComponent
				onFetch={() =>
					SelectOptionsOppslag.hentHelsepersonell().then(response => {
						return response.helsepersonell.map((helsepersonell: Option) => ({
							value: helsepersonell.fnr,
							label: `${helsepersonell.fnr} - ${helsepersonell.fornavn} ${helsepersonell.mellomnavn} ${helsepersonell.etternavn} - `,
							fnr: helsepersonell.fnr,
							fornavn: helsepersonell.fornavn,
							mellomnavn: helsepersonell.mellomnavn,
							etternavn: helsepersonell.etternavn,
							hprId: helsepersonell.hprId
						}))
					})
				}
				render={(data: Array<Option>, feilmelding: Feilmelding) => (
					<FormikSelect
						name={name}
						label={label}
						options={data}
						type="text"
						size="xxlarge"
						afterChange={afterChange}
						isClearable={false}
						feil={feilmelding}
					/>
				)}
			/>
		</ErrorBoundary>
	)
}
