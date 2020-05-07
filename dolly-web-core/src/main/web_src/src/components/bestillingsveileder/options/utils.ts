import { initialValues as initialValuesInntektstub } from '~/components/fagsystem/inntektstub/form/Form'
import { initialValues as initialValuesAareg } from '~/components/fagsystem/aareg/form/initialValues'
import {
	initialPermisjon,
	initialUtenlandsopphold
} from '~/components/fagsystem/aareg/form/initialValues'
import { initialValues as initialValuesInntektsmelding } from '~/components/fagsystem/inntektsmelding/form/Form'
import { initialValues as initialValuesInst } from '~/components/fagsystem/inst/form/Form'

export const initialValues = {
	inntektstub: initialValuesInntektstub,
	aareg: initialValuesAareg,
	permisjon: initialPermisjon,
	utenlandsopphold: initialUtenlandsopphold,
	inntektsmelding: initialValuesInntektsmelding,
	instdata: initialValuesInst,
	boadresse: {
		// @ts-ignore
		flyttedato: null
	},
	kontaktinformasjonForDoedsbo: {
		adressat: { adressatType: '' },
		adresselinje1: '',
		adresselinje2: '',
		postnummer: '',
		poststedsnavn: '',
		landkode: 'NOR',
		skifteform: '',
		utstedtDato: ''
	},
	arbeidsadgang: {
		// @ts-ignore
		arbeidsOmfang: null,
		harArbeidsAdgang: 'JA',
		periode: {
			// @ts-ignore
			fra: null,
			// @ts-ignore
			til: null
		},
		// @ts-ignore
		typeArbeidsadgang: null
	},
	udistub: [
		{
			eosEllerEFTABeslutningOmOppholdsrettPeriode: {
				// @ts-ignore
				fra: null,
				// @ts-ignore
				til: null
			},
			// @ts-ignore
			eosEllerEFTABeslutningOmOppholdsrettEffektuering: null,
			eosEllerEFTABeslutningOmOppholdsrett: ''
		},
		{
			eosEllerEFTAVedtakOmVarigOppholdsrettPeriode: {
				// @ts-ignore
				fra: null,
				// @ts-ignore
				til: null
			},
			// @ts-ignore
			eosEllerEFTAVedtakOmVarigOppholdsrettEffektuering: null,
			eosEllerEFTAVedtakOmVarigOppholdsrett: ''
		},
		{
			eosEllerEFTAOppholdstillatelsePeriode: {
				// @ts-ignore
				fra: null,
				// @ts-ignore
				til: null
			},
			// @ts-ignore
			eosEllerEFTAOppholdstillatelseEffektuering: null,
			eosEllerEFTAOppholdstillatelse: ''
		},
		{
			oppholdSammeVilkaar: {
				oppholdSammeVilkaarPeriode: {
					// @ts-ignore
					fra: null,
					// @ts-ignore
					til: null
				},
				// @ts-ignore
				oppholdSammeVilkaarEffektuering: null, //date
				// @ts-ignore
				oppholdstillatelseVedtaksDato: null, //date
				oppholdstillatelseType: ''
			}
		}
	],
	partnere: {
		identtype: 'FNR',
		kjonn: '',
		sivilstander: [
			{
				sivilstand: '',
				// @ts-ignore
				sivilstandRegdato: null
			}
		],
		harFellesAdresse: false,
		spesreg: '',
		utenFastBopel: false,
		statsborgerskap: '',
		statsborgerskapRegdato: ''
	},
	barn: {
		identtype: 'FNR',
		kjonn: '',
		barnType: '',
		// @ts-ignore
		partnerNr: null,
		borHos: '',
		erAdoptert: false,
		spesreg: '',
		utenFastBopel: false,
		statsborgerskap: '',
		statsborgerskapRegdato: ''
	},
	statborgerskap: {
		statborgerskap: '',
		// @ts-ignore
		statsborgerskapRegdato: null
	},
	utvandretTil: {
		utvandretTilLand: '',
		// @ts-ignore
		utvandretTilLandFlyttedato: null
	},
	innvandretFra: {
		innvandretFraLand: '',
		// @ts-ignore
		innvandretFraLandFlyttedato: null
	}
}
