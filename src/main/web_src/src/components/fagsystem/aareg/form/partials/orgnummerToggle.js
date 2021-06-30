import React, { useState } from 'react'
import { ToggleGruppe, ToggleKnapp } from '~/components/ui/toggle/Toggle'
import { DollyTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { OrganisasjonMedArbeidsforholdSelect } from '~/components/organisasjonSelect'
import { OrgserviceApi } from '~/service/Api'
import { useBoolean } from 'react-use'
import Icon from '~/components/ui/icon/Icon'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { DollySelect } from '~/components/ui/form/inputs/select/Select'

const inputValg = { fraListe: 'velg', skrivSelv: 'skriv' }

export const OrgnummerToggle = ({ formikBag, path, opplysningspliktigPath }) => {
	const [inputType, setInputType] = useState(inputValg.fraListe)
	const [error, setError] = useState(null)
	const [success, setSuccess] = useBoolean(false)
	const [environment, setEnvironment] = useState(null)
	const [orgnummer, setOrgnummer] = useState(null)

	const handleToggleChange = event => {
		setInputType(event.target.value)
		formikBag.setFieldValue(path, '')
	}

	const handleChange = value => {
		opplysningspliktigPath &&
			formikBag.setFieldValue(`${opplysningspliktigPath}`, value.juridiskEnhet)
		formikBag.setFieldValue(`${path}`, value.orgnr)
	}

	const handleManualOrgChange = (org, miljo) => {
		if (!orgnummer) return
		setError(null)
		setSuccess(false)
		OrgserviceApi.getOrganisasjonInfo(org, miljo)
			.then(response => {
				setSuccess(true)
				opplysningspliktigPath &&
					formikBag.setFieldValue(`${opplysningspliktigPath}`, response.data.juridiskEnhet)
				formikBag.setFieldValue(`${path}`, response.data.orgnummer)
			})
			.catch(err => setError(err))
	}

	return (
		<div className="toggle--wrapper">
			<ToggleGruppe onChange={handleToggleChange} name={path}>
				<ToggleKnapp
					key={inputValg.fraListe}
					value={inputValg.fraListe}
					checked={inputType === inputValg.fraListe}
				>
					Velg organisasjonsnummer
				</ToggleKnapp>
				<ToggleKnapp
					key={inputValg.skrivSelv}
					value={inputValg.skrivSelv}
					checked={inputType === inputValg.skrivSelv}
				>
					Skriv inn organisasjonsnummer
				</ToggleKnapp>
			</ToggleGruppe>

			{inputType === inputValg.fraListe ? (
				<OrganisasjonMedArbeidsforholdSelect
					afterChange={handleChange}
					path={path}
					label={'Organisasjonsnummer'}
				/>
			) : (
				<div className={'flexbox--align-center'}>
					<DollyTextInput
						name={path}
						type={'number'}
						size="xlarge"
						label={'Organisasjonsnummer'}
						onBlur={event => {
							const org = event.target.value
							setOrgnummer(org)
							handleManualOrgChange(org, environment)
						}}
						feil={
							error && {
								feilmelding: 'Fant ikke organisasjonen i ' + (environment ? environment : 'q1')
							}
						}
					/>
					<DollySelect
						name={path}
						size={'small'}
						isClearable={false}
						label={'Organisasjon Miljø'}
						options={Options('dollyMiljoer')}
						placeholder={'q1'}
						value={environment}
						onChange={event => {
							setEnvironment(event.value)
							handleManualOrgChange(orgnummer, event.value)
						}}
					/>
					{success && (
						<>
							<Icon kind="feedback-check-circle" /> Organisasjon funnet
						</>
					)}
				</div>
			)}
		</div>
	)
}
