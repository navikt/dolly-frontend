import axios from 'axios'
import ContentApi from '~/ContentApi'

export const types = {
	LOAD_TEAMS_SUCCESS: 'LOAD_TEAM_SUCCESS',
	CREATE_TEAM_SUCCESS: 'CREATE_TEAM_SUCCESS'
}

const initialState = []

export default function teamReducer(state = initialState, action) {
	switch (action.type) {
		case types.LOAD_TEAMS_SUCCESS:
			return action.teams
		case types.CREATE_TEAM_SUCCESS:
			return [...state, Object.assign({}, action.team)]
		default:
			return state
	}
}

const loadTeamsSuccess = teams => ({
	type: types.LOAD_TEAMS_SUCCESS,
	teams
})

export const createTeamSuccess = team => ({
	type: types.CREATE_TEAM_SUCCESS,
	team
})

export const fetchTeams = () => dispatch => {
	try {
		return (async () => {
			const response = await axios.get(ContentApi.getTeams())
			dispatch(loadTeamsSuccess(response.data))
		})()
	} catch (error) {
		console.log(error)
	}
}
