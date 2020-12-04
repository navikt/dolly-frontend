import { initialValuesBasedOnMal } from '~/components/bestillingsveileder/options/malOptions'

const TYPE = Object.freeze({
	NY_BESTILLING: 'NY_BESTILLING',
	NY_BESTILLING_FRA_MAL: 'NY_BESTILLING_FRA_MAL',
	OPPRETT_FRA_IDENTER: 'OPPRETT_FRA_IDENTER',
	LEGG_TIL: 'LEGG_TIL',
	NY_ORGANISASJON: 'NY_ORGANISASJON'
})

export const BVOptions = ({
	antall = 1,
	identtype = 'FNR',
	mal,
	opprettFraIdenter,
	personFoerLeggTil,
	opprettOrganisasjon = false
} = {}) => {
	let initialValues = {
		antall,
		environments: []
	}

	let initialValuesOrganisasjon = {
		environments: [],
		organisasjon: {
			organisasjonsform: null
		}
	}

	let bestType = TYPE.NY_BESTILLING

	if (mal) {
		bestType = TYPE.NY_BESTILLING_FRA_MAL
		initialValues = Object.assign(initialValues, initialValuesBasedOnMal(mal))
	}

	if (opprettFraIdenter) {
		bestType = TYPE.OPPRETT_FRA_IDENTER
		initialValues.antall = opprettFraIdenter.length
	}

	if (personFoerLeggTil) {
		bestType = TYPE.LEGG_TIL
	}

	if (opprettOrganisasjon) {
		bestType = TYPE.NY_ORGANISASJON
		initialValues = initialValuesOrganisasjon
	}

	return {
		initialValues,
		antall,
		identtype,
		mal,
		opprettFraIdenter,
		personFoerLeggTil,
		is: {
			nyBestilling: bestType === TYPE.NY_BESTILLING,
			nyBestillingFraMal: bestType === TYPE.NY_BESTILLING_FRA_MAL,
			opprettFraIdenter: bestType === TYPE.OPPRETT_FRA_IDENTER,
			leggTil: bestType === TYPE.LEGG_TIL,
			nyOrganisasjon: bestType === TYPE.NY_ORGANISASJON
		}
	}
}
