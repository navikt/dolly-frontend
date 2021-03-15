import './FinnPerson.less'
import { AsyncFn } from 'react-use/lib/useAsync'
import { useAsyncFn } from 'react-use'
// @ts-ignore
import AsyncSelect from 'react-select/async'
import { TpsfApi } from '~/service/Api'
import useBoolean from '~/utils/hooks/useBoolean'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

type FinnPerson = {
	naviger: Function
}

type Option = {
	value: string
	label: string
}

type Person = {
	ident: string
	fornavn: string
	mellomnavn?: string
	etternavn: string
}

type Respons = {
	value: {
		data: {
			gruppe?: {
				id: number
			}
			error?: string
			message?: string
		}
	}
}

export default function FinnPerson({ naviger }: FinnPerson) {
	const [redirectToGruppe, setRedirect] = useBoolean()

	const [gruppe, setGruppe] = useState(null)
	const [feilmelding, setFeilmelding] = useState(null)

	const [options, fetchOptions]: AsyncFn<any> = useAsyncFn(async tekst => {
		const { data }: any = await TpsfApi.soekPersoner(tekst)
		const personer: Array<Option> = []
		data.map((person: Person) => {
			const navn = person.mellomnavn
				? `${person.fornavn} ${person.mellomnavn} ${person.etternavn}`
				: `${person.fornavn} ${person.etternavn}`
			personer.push({
				value: person.ident,
				label: `${person.ident} - ${navn.toUpperCase()}`
			})
		})
		return personer
	}, [])

	const handleChange = (tekst: string) => {
		fetchOptions(tekst)
		setFeilmelding(null)
	}

	const navigerTilIdent = async (ident: string) => {
		naviger(ident).then((response: Respons) => {
			console.log(response) // TODO: slett meg!
			if (response.value.data.error) {
				setFeilmelding(response.value.data.message)
			} else {
				setGruppe(response.value.data.gruppe.id)
				setRedirect()
			}
		})
	}

	if (redirectToGruppe) return <Redirect to={`/gruppe/${gruppe}`} />

	return (
		<div>
			<div className="finnperson-container skjemaelement">
				<AsyncSelect
					defaultOptions={false}
					loadOptions={fetchOptions}
					onInputChange={handleChange}
					isClearable={true}
					options={options}
					onChange={(e: Option) => (e ? navigerTilIdent(e.value) : null)}
					cacheOptions={true}
					label="Person"
					placeholder="FNR/DNR/BOST eller navn"
				/>
			</div>
			{feilmelding && (
				<div className="error-message" style={{ marginTop: '10px' }}>
					{feilmelding}
				</div>
			)}
		</div>
	)
}
