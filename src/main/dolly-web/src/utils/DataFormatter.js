import dateFormatter from 'date-fns/format'

const formatters = {}

// Skriv ut FNR og DNR med mellom mellom fødselsdato og personnummer
// Ex: 010195 12345
formatters.formatIdentNr = ident => {
	if (!ident) return ident
	const birth = ident.substring(0, 6)
	const personnummer = ident.substring(6, 11)
	return `${birth} ${personnummer}`
}

// Format date to readable string format
formatters.formatDate = date => {
	if (!date) return date
	return dateFormatter(date, 'DD.MM.YYYY')
}

formatters.kjonnToString = (kjonn = '') => {
	const _kjonn = kjonn.toLowerCase()
	if (!['m', 'k'].includes(_kjonn)) return 'udefinert'
	return _kjonn === 'm' ? 'Mann' : 'Kvinne'
}

formatters.kjonnToStringBarn = (kjonn = '') => {
	const _kjonn = kjonn.toLowerCase()
	if (!['m', 'k'].includes(_kjonn)) return 'udefinert'
	return _kjonn === 'm' ? 'Gutt' : 'Jente'
}

formatters.arrayToString = (array, separator = ',') => {
	return array.reduce((accumulator, nextString) => {
		return `${accumulator}${accumulator ? separator : ''} ${nextString.toUpperCase()}`
	}, '')
}

export default formatters
