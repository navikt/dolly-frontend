import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import Gruppe from './Gruppe'
import { getGruppe, showCreateOrEditGroup, deleteGruppe } from '~/ducks/gruppe'
import { createLoadingSelector } from '~/ducks/loading'

const loadingSelector = createLoadingSelector(getGruppe)
const mapStateToProps = state => ({
	isFetching: loadingSelector(state),
	gruppeArray: state.gruppe.data,
	createOrUpdateId: state.gruppe.createOrUpdateId
})

const mapDispatchToProps = (dispatch, ownProps) => {
	const gruppeId = ownProps.match.params.gruppeId
	return {
		getGruppe: () => dispatch(getGruppe(gruppeId)),
		deleteGruppe: () => dispatch(deleteGruppe(gruppeId)),
		createGroup: () => dispatch(showCreateOrEditGroup(-1)),
		editTestbruker: ident => dispatch(push(`/gruppe/${gruppeId}/testbruker/${ident}`))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Gruppe)