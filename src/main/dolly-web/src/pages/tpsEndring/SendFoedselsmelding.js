import React, { PureComponent, Fragment } from 'react'
import { Formik, Form, Field } from 'formik'
import { FormikInput } from '~/components/fields/Input/Input'
import ContentContainer from '~/components/contentContainer/ContentContainer'
import { FormikDollySelect } from '~/components/fields/Select/Select'
import { FormikDatepicker } from '~/components/fields/Datepicker/Datepicker'
import { TpsfApi } from '~/service/Api'
import TpsfService from '../../service/services/tpsf/TpsfService'
import Knapp from 'nav-frontend-knapper'
import * as yup from 'yup'
import Loading from '~/components/loading/Loading'

export default class SendFoedselsmelding extends PureComponent {
	state = {
		isFetching: false,
		nyttBarn: null,
		errorMessage: null
	}

	render() {
		let initialValues = {
			identMor: '',
			identFar: '',
			identtype: 'FNR',
			foedselsdato: '',
			kjonn: '',
			miljoe: 't0',
			adresseFra: ''
		}

		const identOptions = [{ value: 'FNR', label: 'FNR' }, { value: 'DNR', label: 'DNR' }]
		const kjoennOptions = [{ value: 'M', label: 'MENN' }, { value: 'F', label: 'KVINNE' }]
		const adresseOptions = [
			{ value: 'LAGNY', label: 'LAG NY ADRESSE' },
			{ value: 'MOR', label: 'ARV FRA MORS' },
			{ value: 'FAR', label: 'ARV FRA FARS' }
		]

		return (
			<ContentContainer>
				<Formik
					onSubmit={this.onFoedselsMeldingSubmit}
					validationSchema={this.validation}
					initialValues={initialValues}
					render={props => {
						const { values, touched, errors, dirty, isSubmitting } = props
						return (
							<Form autoComplete="off">
								<h2>Send fødselsmelding</h2>
								<div className="tps-endring-foedselmelding-top">
									<Field name="identMor" label="MORS IDENT" component={FormikInput} />
									<Field name="identFar" label="FARS IDENT" component={FormikInput} />
									<Field
										name="identtype"
										label="BARNETS IDENTTYPE"
										component={FormikDollySelect}
										options={identOptions}
									/>
									<Field
										name="foedselsdato"
										label="BARNETS FØDSELSDATO"
										component={FormikDatepicker}
									/>
									<Field
										name="kjonn"
										label="BARNETS KJØNN"
										component={FormikDollySelect}
										options={kjoennOptions}
									/>
									<Field
										name="miljoe"
										label="SEND TIL MILJØ"
										options={this.props.dropdownMiljoe}
										component={FormikDollySelect}
									/>
								</div>
								<div className="tps-endring-foedselmelding-bottom">
									<Field
										name="adresseFra"
										label="ADRESSE"
										component={FormikDollySelect}
										options={adresseOptions}
									/>
									<Knapp type="hoved" htmlType="submit">
										Opprett fødselsmelding
									</Knapp>
								</div>
							</Form>
						)
					}}
				/>
				{this.state.isFetching && <Loading label="Sender fødselsmelding" />}
				{this.state.errorMessage && this._renderError(this.state.errorMessage)}{' '}
				{this.state.nyttBarn && this._renderNyttBarn(this.state.nyttBarn)}
			</ContentContainer>
		)
	}

	validation = () =>
		yup.object().shape({
			identMor: yup
				.string()
				.max(11, 'Morindent må inneholde 11 sifre')
				.required('Morindent er et påkrevd felt'),
			identFar: yup.string().max(11, 'Indent må inneholde 11 sifre'),
			kjonn: yup.string().required('Kjønn er et påkrevd felt'),
			miljoe: yup.string().required('Miljø er et påkrevd felt'),
			foedselsdato: yup.date().required('Fødselsdato er et påkrevd felt'),
			adresseFra: yup.string().required('Adresse er et påkrevd felt')
		})

	onFoedselsMeldingSubmit = values => {
		this.setState({ isFetching: true, nyttBarn: null, errorMessage: null }, () => {
			TpsfApi.createFoedselmelding(values)
				.then(fodselRes => {
					console.log(fodselRes)
					TpsfService.getKontaktInformasjon(fodselRes.data.personId, 't0')
						.then(kontaktInfoRes => {
							console.log(kontaktInfoRes)
							this.setState({
								nyttBarn: kontaktInfoRes.data.person,
								isFetching: false
							})
						})
						.catch(err =>
							this.setState({ isFetching: false, errorMessage: err.response.data.message })
						)
				})
				.catch(err => {
					console.log(err.response)
					this.setState({
						isFetching: false,
						errorMessage: err.response.data.message
					})
				})
		})
	}

	_renderNyttBarn = person => {
		return (
			<Fragment>
				<h2 className="success-message">
					Gratulere, {person.personNavn.gjeldendePersonnavn} ble født!{' '}
				</h2>
				<h4>med ident {person.fodselsnummer}</h4>
			</Fragment>
		)
	}

	_renderError = error => {
		return <h4 className="error-message"> Feil: {error} </h4>
	}
}
