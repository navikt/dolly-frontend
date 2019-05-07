import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'
import _startCase from 'lodash/startCase'

import { defaultDateFormat } from '~/components/fields/Datepicker/DateValidation'

const Formatters = {}

// Skriv ut FNR og DNR med mellom mellom fødselsdato og personnummer
// Ex: 010195 12345
Formatters.formatIdentNr = ident => {
	if (!ident) return ident
	const birth = ident.substring(0, 6)
	const personnummer = ident.substring(6, 11)
	return `${birth}${personnummer}`
}

Formatters.formatAlder = (alder, dodsdato) => {
	return `${alder.toString()}${dodsdato ? ' (død)' : ''}`
}

// Format date to readable string format
// Date ---> String
Formatters.formatDate = date => {
	if (!date) return date
	if (date.length == 10) return date
	return dateFnsFormat(date, defaultDateFormat, new Date())
}

// Format string to Date format
// String ---> Date
Formatters.parseDate = date => {
	if (!date) return date

	const parts = date.split('.')
	return new Date(Date.UTC(parts[2], parts[1] - 1, parts[0]))
}

Formatters.kjonnToString = (kjonn = '') => {
	if (!kjonn) return kjonn
	const _kjonn = kjonn.toLowerCase()
	if (!['m', 'k'].includes(_kjonn)) return 'UDEFINERT'
	return _kjonn === 'm' ? 'MANN' : 'KVINNE'
}

Formatters.kjonnToStringBarn = (kjonn = '') => {
	const _kjonn = kjonn.toLowerCase()
	if (!['m', 'k'].includes(_kjonn)) return 'UDEFINERT'
	return _kjonn === 'm' ? 'GUTT' : 'JENTE'
}

Formatters.arrayToString = (array, separator = ',') => {
	if (!array) return null

	return array.reduce((accumulator, nextString, idx) => {
		return `${accumulator}${accumulator ? separator : ''}${
			idx === 0 ? '' : ' '
		}${nextString.toUpperCase()}`
	}, '')
}

Formatters.camelCaseToLabel = camelCase => {
	if (!camelCase) return null

	return _startCase(camelCase)
}

Formatters.kodeverkLabel = kodeverk => {
	if (!kodeverk) return null
	return kodeverk.substring(kodeverk.indexOf('-') + 1)
}

Formatters.oversettBoolean = value => {
	if (!value) return null

	return value === true ? 'Ja' : value === false ? 'Nei' : value
}

Formatters.gtApiKodeverkId = gtType => {
	if (!gtType) return null

	let gtApiKodeverkId = ''
	switch (gtType) {
		case 'KNR':
			gtApiKodeverkId = 'Kommuner'
			break
		case 'BYDEL':
			gtApiKodeverkId = 'Bydeler'
			break
		case 'LAND':
			gtApiKodeverkId = 'Landkoder'
			break
	}

	return gtApiKodeverkId
}

Formatters.gtTypeLabel = gtType => {
	if (!gtType) return null

	let gtTypeLabel = ''
	switch (gtType) {
		case 'KNR':
			gtTypeLabel = 'Kommune'
			break
		case 'BYDEL':
			gtTypeLabel = 'Bydel'
			break
		case 'LAND':
			gtTypeLabel = 'Land'
			break
	}

	return gtTypeLabel
}

Formatters.sort2DArray = (array, i) => {
	// i er indexen av verdi som man ønsker å sortere på
	return array.sort((a, b) => {
		var lengde = Formatters.getIdLengde(a[i])
		var aSub = a[i].substr(0, lengde)
		var bSub = b[i].substr(0, lengde)
		return bSub - aSub
	})
}

Formatters.flat2DArray = (array, i) => {
	if (!array) return null

	array.forEach(person => {
		if (person[i].includes(',')) {
			const arrayValues = person[i].split(',')
			person[i] = Math.max(...arrayValues).toString() + ' ...'
		}
	})
	return array
}

Formatters.getIdLengde = id => {
	if (!id) return null

	var forste = id.split(' ')
	return forste[0].length
}

Formatters.idUtenEllipse = id => {
	if (!id) return null

	var lengde = Formatters.getIdLengde(id)
	return id.substr(0, lengde)
}

Formatters.commaToSpace = streng => {
	if (!streng) return null
	return streng.split(',').join(', ')
}

export default Formatters
