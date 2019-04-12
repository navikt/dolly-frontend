import DataFormatter from '~/utils/DataFormatter'

//liste over koder som må eksludert pga ingen støtte i TPSF/dolly
const _excludeList = ['NULL', 'GLAD']

export const NormalizeTeamListForDropdown = ({ data }) => ({
	options: data.map(team => ({ value: team.id, label: team.navn }))
})

// Specialbehov for modifisering og sortering av kodeverk
export const SortKodeverkArray = data => {
	const koderArray = data.koder
	if (data.name == 'Språk') {
		const spesKoder = ['ES', 'EN', 'NN', 'NB']

		spesKoder.forEach(value => {
			for (var i = 0; i < koderArray.length - 1; i++) {
				const temp = koderArray[i]
				// TODO: Fjern dette etter kodeverk har fjernet typo
				if (value == temp.value) {
					if (value == 'NB') temp.label = 'Norwegian, Bokmål'
					if (value == 'NN') temp.label = 'Norwegian, Nynorsk'
					koderArray.splice(i, 1) && koderArray.unshift(temp)
				}
			}
		})
	}

	if (data.name == 'Diskresjonskoder') {
		const spesKoder = [
			{ value: 'SPFO', label: 'KODE 7 - Sperret adresse, fortrolig' },
			{ value: 'SPSF', label: 'KODE 6 - Sperret adresse, strengt fortrolig' }
		]

		spesKoder.forEach(kode => {
			for (var i = 0; i < koderArray.length - 1; i++) {
				const temp = koderArray[i]
				if (kode.value == temp.value) {
					temp.label = kode.label
					koderArray.splice(i, 1) && koderArray.unshift(temp)
				}
			}
		})
	}

	if (data.name === 'Yrker') {
		//STYRK-koder blir lagt øverst i select yrke for å unngå loop i stort array.
		const spesKoder = [
			{ value: '3231109', label: 'SYKEPLEIER' },
			{ value: '7233108', label: 'SPESIALARBEIDER (LANDBRUKS- OG ANLEGGSMASKINMEKANIKK)' },
			{ value: '7421118', label: 'SNEKKER' },
			{ value: '2320102', label: 'LÆRER (VIDEREGÅENDE SKOLE)' },
			{ value: '7216108', label: 'KAMMEROPERATØR' },
			{ value: '2310114', label: 'HØYSKOLELÆRER' },
			{ value: '5141103', label: 'FRISØR' },
			{ value: '7125102', label: 'BYGNINGSSNEKKER' },
			{ value: '5221126', label: 'BUTIKKMEDARBEIDER' },
			{ value: '7217102', label: 'BILSKADEREPARATØR' },
			{ value: '3310101', label: 'ALLMENNLÆRER' },
			{ value: '2521106', label: 'ADVOKAT' }
		]
		spesKoder.map ( yrke => koderArray.unshift(yrke) )
	}

	return koderArray
}

export const NormalizeKodeverkForDropdown = ({ data }, showValueInLabel) => {
	const sortedArray = SortKodeverkArray(data)

	return {
		options: sortedArray.filter(val => !_excludeList.includes(val.value)).map(kode => ({
			value: kode.value,
			label: showValueInLabel ? kode.value + ' - ' + kode.label : kode.label
		}))
	}
}

export const NormalizeBrukerListForDropdown = (data, teamMembers) => {
	const options = data.reduce((filtered, bruker) => {
		if (!teamMembers.includes(bruker.navIdent)) {
			filtered.push({ value: bruker.navIdent, label: bruker.navIdent })
		}
		return filtered
	}, [])
	return { options }
}

export default {
	NormalizeTeamListForDropdown,
	NormalizeBrukerListForDropdown,
	NormalizeKodeverkForDropdown
}
