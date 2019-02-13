import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { FormikDollySelect } from '~/components/fields/Select/Select'
import { FormikInput } from '~/components/fields/Input/Input'
import { Formik, Form, Field, getIn } from 'formik'
import { DollyApi } from '~/service/Api'
import Knapp from 'nav-frontend-knapper'
import * as yup from 'yup'
import Loading from '~/components/loading/Loading'
import Table from '~/components/table/Table'

// import './RedigerGruppe.less'

export default class Rediger extends PureComponent {
	static propTypes = {
		gruppe: PropTypes.shape({
			id: PropTypes.number,
			navn: PropTypes.string,
			teamTilhoerlighetNavn: PropTypes.string,
			hensikt: PropTypes.string
		}),
		team: PropTypes.shape({
			toggle: PropTypes.bool,
			id: PropTypes.string
		}),
		createTeam: PropTypes.func,
		createGruppe: PropTypes.func,
		updateGruppe: PropTypes.func,
		onCancel: PropTypes.func,
		error: PropTypes.string
	}

	erRedigering = Boolean(getIn(this.props.gruppe, 'id', false))
	Teams = Object.freeze({ currentUser: -1, newTeam: -2 })

	onHandleSubmit = async (values, actions) => {
		const { createGruppe, updateGruppe, gruppe } = this.props

		let groupValues = {
			hensikt: values.hensikt,
			navn: values.navn,
			teamId: await this.getTeam(values)
		}

		return this.erRedigering ? updateGruppe(gruppe.id, groupValues) : createGruppe(groupValues)
	}

	getTeam = async values => {
		const { currentUserId, createTeam } = this.props
		let teamValues = null

		if (values.teamId === this.Teams.newTeam) {
			teamValues = { navn: values.teamnavn, beskrivelse: values.beskrivelse }
		} else if (this.erRedigering && values.teamId === this.Teams.currentUser) {
			teamValues = { navn: currentUserId, beskrivelse: null }
		}
		if (teamValues != null) {
			await createTeam(teamValues)
			const { team } = this.props
			return team.id
		} else {
			return values.teamId
		}
	}

	onCancel() {
		this.props.toggleCreateTeam(false)
		this.props.onCancel()
	}

	onBeforeChange(option) {
		const { team, toggleCreateTeam } = this.props
		let toggle = option != null && option.value === this.Teams.newTeam
		if (toggle !== team.toggle) {
			toggleCreateTeam(toggle)
		}
	}

	loadOptions(res) {
		const { currentUserId } = this.props
		let teams = DollyApi.Utils.NormalizeTeamListForDropdown(res)
		if (!teams.options.some(option => option.label === currentUserId)) {
			teams.options.unshift({
				value: this.Teams.currentUser,
				label: currentUserId + ' (Ditt eget team)'
			})
		} else {
			let index = teams.options.findIndex(option => option.label === currentUserId)
			teams.options.splice(0, 0, teams.options.splice(index, 1)[0])
			teams.options[0].label += ' (Ditt eget team)'
		}
		teams.options.push({
			value: this.Teams.newTeam,
			label: '+ Opprett nytt team'
		})
		return teams
	}

	validation = () =>
		yup.object().shape({
			navn: yup
				.string()
				.required('Navn er et påkrevd felt')
				.max(50, 'Maksimalt 30 bokstaver'),
			teamId: yup.number().nullable(),
			hensikt: yup // .required('Du må velge hvilket team gruppen skal knyttes til'),
				.string()
				.required('Gi en liten beskrivelse av hensikten med gruppen')
				.max(200, 'Maksimalt 200 bokstaver'),
			teamnavn: yup.string().when('teamId', {
				is: val => val === this.Teams.newTeam,
				then: yup
					.string()
					.required('Team navn er et påkrevd felt')
					.max(50, 'Maksimalt 30 bokstaver')
			}),
			beskrivelse: yup.string().when('teamId', {
				is: val => val === this.Teams.newTeam,
				then: yup
					.string()
					.required('Gi en liten beskrivelse av teamet')
					.max(200, 'Maksimalt 200 bokstaver')
			})
		})

	render() {
		const { team, currentUserId, gruppe, createOrUpdateFetching, error } = this.props

		if (createOrUpdateFetching) {
			return (
				<Table.Row>
					<Loading label="oppdaterer gruppe" />
				</Table.Row>
			)
		}

		let initialValues = {
			navn: getIn(gruppe, 'navn', ''),
			teamId: getIn(gruppe, 'team.id', null),
			hensikt: getIn(gruppe, 'hensikt', ''),
			teamnavn: getIn(gruppe, 'teamnavn', ''),
			beskrivelse: getIn(gruppe, 'beskrivelse', '')
		}

		let buttons = (
			<Fragment>
				<Knapp mini type="standard" htmlType="button" onClick={() => this.onCancel()}>
					Avbryt
				</Knapp>
				<Knapp mini type="hoved" htmlType="submit">
					{this.erRedigering ? 'Lagre' : 'Opprett og gå til gruppe'}
				</Knapp>
			</Fragment>
		)

		return (
			<Formik
				initialValues={initialValues}
				validationSchema={this.validation}
				onSubmit={this.onHandleSubmit}
				render={props => {
					const { values, touched, errors, dirty, isSubmitting } = props
					return (
						<Form className="opprett-tabellrad" autoComplete="off">
							<div className="fields">
								<Field name="navn" label="NAVN" autoFocus component={FormikInput} />
								<Field name="hensikt" label="HENSIKT" component={FormikInput} />
								<Field
									name="teamId"
									label="VELG TEAM"
									beforeChange={option => this.onBeforeChange(option)}
									component={FormikDollySelect}
									loadOptions={() =>
										DollyApi.getTeamsByUserId(currentUserId).then(res => this.loadOptions(res))
									}
								/>
								{!team.toggle && buttons}
							</div>
							{team.toggle && (
								<div className="fields">
									<Field name="teamnavn" label="team navn" component={FormikInput} />
									<Field name="beskrivelse" label="team beskrivelse" component={FormikInput} />
									{buttons}
								</div>
							)}
							{error && (
								<div className="opprett-error">
									<span>{error.message}</span>
								</div>
							)}
						</Form>
					)
				}}
			/>
		)
	}
}
