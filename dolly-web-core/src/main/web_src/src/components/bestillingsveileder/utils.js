import _has from 'lodash/has'

const rootPaths = [
	'tpsf',
	'pdlforvalter',
	'aareg',
	'sigrunstub',
	'pensjonforvalter',
	'inntektstub',
	'instdata',
	'krrstub',
	'arenaforvalter',
	'udistub',
	'inntektsmelding',
	'bregstub'
]

export const harAvhukedeAttributter = values => {
	return rootPaths.some(path => _has(values, path))
}
