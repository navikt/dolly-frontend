import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as gruppeActions from '../../actions/gruppeActions';
import GruppeList from "./GruppeListe";
import {Input} from 'nav-frontend-skjema';
import InputAutocompleteField from '../felles/fields/InputAutocompleteField';

class Home extends Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            postnummer: {}
        };

        this.createPerson = this.createPerson.bind(this);
        this.onSelectedValue = this.onSelectedValue.bind(this);
    }

    createPerson(){
        //this.props.personsActions.createPerson({});
    }

    onSelectedValue(value){
        this.setState( {postnummer: Object.assign({}, value) });
    }

    render(){
        const {grupper} = this.props;

        const kodeverk = [{"navn":"AAP","term":"Arbeidsavklaringspenger"},{"navn":"AAR","term":"Aa-registeret"},{"navn":"AGR","term":"Ajourhold - Grunnopplysninger"},{"navn":"BAR","term":"Barnetrygd"},{"navn":"BID","term":"1 - Bidrag"},{"navn":"BII","term":"2 - Bidrag innkreving"},{"navn":"BIL","term":"Bil"},{"navn":"DAG","term":"Dagpenger"},{"navn":"ENF","term":"Enslig forsørger"},{"navn":"ERS","term":"Erstatning"},{"navn":"FEI","term":"Feilutbetaling"},{"navn":"FOR","term":"Foreldre- og svangerskapspenger"},{"navn":"FOS","term":"Forsikring"},{"navn":"FUL","term":"Fullmakt"},{"navn":"GEN","term":"Generell"},{"navn":"GRA","term":"Gravferdsstønad"},{"navn":"GRU","term":"Grunn- og hjelpestønad"},{"navn":"HEL","term":"Helsetjenester og ort. Hjelpemidler"},{"navn":"HJE","term":"Hjelpemidler"},{"navn":"IAR","term":"Inkluderende Arbeidsliv"},{"navn":"IND","term":"Individstønad"},{"navn":"KLA","term":"Klage/Anke"},{"navn":"KNA","term":"Kontakt NAV"},{"navn":"KOM","term":"Kommunale tjenester"},{"navn":"KON","term":"Kontantstøtte"},{"navn":"KTR","term":"Kontroll"},{"navn":"MED","term":"Medlemskap"},{"navn":"MOB","term":"Mob.stønad"},{"navn":"MOT","term":"3 - Skanning"},{"navn":"OKO","term":"Økonomi"},{"navn":"OMS","term":"Omsorgspenger, Pleiepenger og opplæringspenger"},{"navn":"OPA","term":"Oppfølging - Arbeidsgiver"},{"navn":"OPP","term":"Oppfølging"},{"navn":"OVR","term":"4 - Øvrig"},{"navn":"PEN","term":"Pensjon"},{"navn":"PER","term":"Permittering og masseoppsigelser"},{"navn":"REH","term":"Rehabilitering"},{"navn":"REK","term":"Rekruttering og Stilling"},{"navn":"RPO","term":"Retting av personopplysninger"},{"navn":"RVE","term":"Rettferdsvederlag"},{"navn":"SAA","term":"Sanksjon - Arbeidsgiver"},{"navn":"SAK","term":"Saksomkostning"},{"navn":"SAP","term":"Sanksjon - Person"},{"navn":"SER","term":"Serviceklager"},{"navn":"SIK","term":"Sikkerhetstiltak"},{"navn":"STO","term":"Regnskap/utbetaling"},{"navn":"SUP","term":"Supplerende stønad"},{"navn":"SYK","term":"Sykepenger"},{"navn":"SYM","term":"Sykemeldinger"},{"navn":"TIL","term":"Tiltak"},{"navn":"TRK","term":"Trekkhåndtering"},{"navn":"TRY","term":"Trygdeavgift"},{"navn":"TSO","term":"Tilleggsstønad"},{"navn":"TSR","term":"Tilleggsstønad arbeidssøkere"},{"navn":"UFM","term":"Unntak fra medlemskap"},{"navn":"UFO","term":"Uføretrygd"},{"navn":"UKJ","term":"Ukjent"},{"navn":"VEN","term":"Ventelønn"},{"navn":"YRA","term":"Yrkesrettet attføring"},{"navn":"YRK","term":"Yrkesskade / Menerstatning"}];

        return (
            <div id="home-container">
                <h1>Home Container</h1>
                <Input label='testy' />
                <input label="Bare" />
                <InputAutocompleteField label={"Postnummer"}
                                        id={"postnummer-id"}
                                        onSelectedValue={this.onSelectedValue}
                                        kodeverk={kodeverk}
                />
                <GruppeList grupper={grupper}/>
            </div>
        )

    }
}

function mapStateToProps(stateFrom, ownProps){
    return {
        grupper: stateFrom.gruppeReducer
    };
}

function mapDispatchToProps(dispatch){
    return {
        gruppeActions: bindActionCreators(gruppeActions, dispatch)
    }
}

const function_connectReduxAndComponent = connect(mapStateToProps, mapDispatchToProps);

export default function_connectReduxAndComponent(Home);
