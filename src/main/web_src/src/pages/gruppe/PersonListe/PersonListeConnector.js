import { connect } from 'react-redux'
import { actions, fetchTpsfPersoner, selectPersonListe, sokSelector } from '~/ducks/fagsystem'
import { createLoadingSelector } from '~/ducks/loading'
import personListe from './PersonListe'

const loadingSelector = createLoadingSelector(actions.getTpsf)
const mapStateToProps = (state, ownProps) => ({
	personListe: sokSelector(selectPersonListe(state), state.search),
	gruppeInfo: state.gruppe.gruppeInfo,
	isFetching: loadingSelector(state),
	visPerson: state.finnPerson.visPerson
})

const mapDispatchToProps = { fetchTpsfPersoner }

export default connect(mapStateToProps, mapDispatchToProps)(personListe)
