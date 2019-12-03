import React, { PureComponent } from 'react'
import { Formik, Form } from 'formik'
import Knapp from 'nav-frontend-knapper'
import * as yup from 'yup'
import { TpsfApi } from '~/service/Api'
import ContentContainer from '~/components/ui/contentContainer/ContentContainer'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import Loading from '~/components/ui/loading/Loading'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import DataFormatter from '~/utils/DataFormatter'
import { requiredDate } from '~/utils/YupValidations'
import DisplayFormikState from '~/utils/DisplayFormikState'

export default class SendFoedselsmelding extends PureComponent {
	state = {
		isFetching: false,
		isFetchingMiljoer: false,
		nyttBarn: null,
		errorMessage: null,
		foundIdentMor: null,
		showErrorMessageFoundIdent: false,
		currentFnrMor: '',
		environments: [],
		miljoer: [],
		response_success: []
	}

	validation = () =>
		yup.object().shape({
			identMor: yup
				.string()
				.min(11, 'Mors ident må inneholde 11 sifre.')
				.max(11, 'Mors ident må inneholde 11 sifre.')
				.required('Mors ident er et påkrevd felt.'),
			identFar: yup
				.string()
				.min(11, 'Ident må inneholde 11 sifre.')
				.max(11, 'Ident må inneholde 11 sifre.'),
			identtype: yup.string().required('Identtype er ett påkrevd felt.'),
			kjonn: yup.string().required('Kjønn er et påkrevd felt.'),
			miljoer: yup.string().required('Miljø er et påkrevd felt.'),
			foedselsdato: requiredDate,
			adresseFra: yup.string().required('Adresse er et påkrevd felt.')
		})

	createRequestObjects(values) {
		const miljoer = values.miljoer.map(env => {
			return env.value
		})
		return { ...values, miljoer: miljoer }
	}

	_onSubmit = (values, { resetForm }) => {
		const request = this.createRequestObjects(values)
		var success_envs = []

		this.setState(
			{
				isFetching: true,
				nyttBarn: null,
				errorMessage: null,
				foundIdentMor: false,
				miljoer: values.miljoer,
				response_success: []
			},
			async () => {
				try {
					const createFoedselsmeldingRes = await TpsfApi.createFoedselsmelding({
						...request,
						foedselsdato: DataFormatter.parseDate(values.foedselsdato)
					})
					const getKontaktInformasjonRes = await TpsfApi.getKontaktInformasjon(
						createFoedselsmeldingRes.data.personId,
						request.miljoer[0]
					)
					const status = createFoedselsmeldingRes.data.status
					Object.keys(status).map(key => {
						if (status[key] === 'OK') success_envs = [...success_envs, key]
					})
					resetForm()
					return this.setState({
						nyttBarn: getKontaktInformasjonRes.data.person,
						isFetching: false,
						currentFnrMor: null,
						miljoer: [],
						response_success: success_envs
					})
				} catch (err) {
					resetForm()
					this.setState({
						currentFnrMor: null,
						isFetching: false,
						miljoer: [],
						errorMessage: err.response.data.message
					})
				}
			}
		)
	}

	_renderNyttBarn = person => {
		var suksessMiljoer = ''
		if (this.state.response_success.length > 0)
			suksessMiljoer = this.state.response_success.join(', ')

		return (
			<h3 className="tps-endring-success-message">
				Gratulerer, {person.personNavn.gjeldendePersonnavn} med ident {person.fodselsnummer} ble
				født i miljø {suksessMiljoer}!
			</h3>
		)
	}

	fillEnvironmentDropdown(environments) {
		return environments.map(env => ({ value: env, label: env.toUpperCase() }))
	}

	_handleOnBlurInput = e => {
		let fnr = e.target.value.replace(/\s+/g, '')

		if (fnr.length === 11 && !isNaN(fnr)) {
			this.setState(
				{
					isFetchingMiljoer: true,
					nyttBarn: null,
					miljoer: [],
					environments: [],
					showErrorMessageFoundIdent: false,
					foundIdentMor: false,
					errorMessage: null
				},
				async () => {
					try {
						const getMiljoerByFnrRes = await TpsfApi.getMiljoerByFnr(fnr)
						const res_environments = getMiljoerByFnrRes.data.statusPaaIdenter[0].env

						let miljoer = []

						if (res_environments.length < 1) {
							return this.setState({
								miljoer: miljoer,
								currentFnrMor: fnr,
								foundIdentMor: false,
								isFetchingMiljoer: false,
								showErrorMessageFoundIdent: true
							})
						} else if (res_environments.length === 1) {
							miljoer.push({ value: res_environments[0], label: res_environments[0] })
						}

						const displayEnvironmentsInDropdown = this.fillEnvironmentDropdown(res_environments)
						return this.setState({
							environments: displayEnvironmentsInDropdown,
							currentFnrMor: fnr,
							foundIdentMor: true,
							isFetchingMiljoer: false,
							miljoer: miljoer
						})
					} catch (err) {
						this.setState({ isFetchingMiljoer: false, currentFnrMor: fnr })
					}
				}
			)
		}
	}

	render() {
		const { environments, foundIdentMor, miljoer, currentFnrMor } = this.state

		let initialValues = {
			identMor: currentFnrMor,
			identFar: '',
			identtype: 'FNR',
			foedselsdato: '',
			kjonn: '',
			miljoer: miljoer.slice(),
			adresseFra: ''
		}

		const adresseOptions = [
			{ value: 'LAGNY', label: 'LAG NY ADRESSE' },
			{ value: 'MOR', label: 'ARV FRA MORS' },
			{ value: 'FAR', label: 'ARV FRA FARS' }
		]

		return (
			<ContentContainer className="tps-endring-content-container">
				<Formik
					onSubmit={this._onSubmit}
					onReset={this.initialValues}
					validationSchema={this.validation}
					initialValues={initialValues}
					enableReinitialize
				>
					{props => {
						const { values, touched, errors, dirty, isSubmitting } = props
						return (
							<Form autoComplete="off">
								<h2>Send fødselsmelding</h2>
								<div className="tps-endring-foedselmelding-top">
									<FormikTextInput
										name="identMor"
										label="MORS IDENT"
										onBlur={this._handleOnBlurInput}
									/>
									<FormikTextInput name="identFar" label="FARS IDENT" disabled={!foundIdentMor} />
									<FormikSelect
										name="identtype"
										label="BARNETS IDENTTYPE"
										options={Options('identtype')}
										disabled={!foundIdentMor}
									/>
								</div>
								<div className="tps-endring-foedselmelding-bottom">
									<FormikDatepicker
										name="foedselsdato"
										label="BARNETS FØDSELSDATO"
										disabled={!foundIdentMor}
									/>
									<FormikSelect
										name="kjonn"
										label="BARNETS KJØNN"
										options={Options('kjonnBarn')}
										disabled={!foundIdentMor}
									/>
									<FormikSelect
										name="miljoer"
										label="SEND TIL MILJØ"
										options={environments}
										isMulti={true}
										disabled={!foundIdentMor}
									/>
									<FormikSelect
										name="adresseFra"
										label="ADRESSE"
										options={adresseOptions}
										disabled={!foundIdentMor}
									/>
								</div>
								<div className="tps-endring-knapp-container">
									<Knapp type="hoved" htmlType="submit" disabled={!foundIdentMor}>
										Opprett fødselsmelding
									</Knapp>
								</div>
								{/* <DisplayFormikState {...props} /> */}
							</Form>
						)
					}}
				</Formik>
				{this.state.isFetching && <Loading label="Sender fødselsmelding" />}
				{this.state.isFetchingMiljoer && <Loading label="Søker etter person" />}
				{this.state.showErrorMessageFoundIdent && (
					<h3 className="tps-endring-error-message">
						Finner ikke testperson med ident: {this.state.currentFnrMor}
					</h3>
				)}
				{this.state.errorMessage && (
					<h4 className="tps-endring-error-message"> Feil: {this.state.errorMessage} </h4>
				)}
				{this.state.nyttBarn && this._renderNyttBarn(this.state.nyttBarn)}
			</ContentContainer>
		)
	}
}
