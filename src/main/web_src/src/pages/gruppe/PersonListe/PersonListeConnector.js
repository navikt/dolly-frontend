import { connect } from 'react-redux'
import { fetchTpsfPersoner, actions, sokSelector, selectPersonListe } from '~/ducks/fagsystem'
import { createLoadingSelector } from '~/ducks/loading'
import personListe from './PersonListe'

const loadingSelector = createLoadingSelector(actions.getTpsf)
const mapStateToProps = (state, ownProps) => ({
	searchActive: Boolean(state.search),
	personListe: sokSelector(selectPersonListe(state), state.search),
	isFetching: loadingSelector(state),
	visPerson: state.finnPerson.visPerson
})

const mapDispatchToProps = { fetchTpsfPersoner }

export default connect(mapStateToProps, mapDispatchToProps)(personListe)
