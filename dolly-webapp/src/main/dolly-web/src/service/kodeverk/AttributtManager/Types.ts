import * as yup from 'yup'

// Kategori
export enum InputType {
	Text = 'text',
	Number = 'number',
	Select = 'select',
	Date = 'date'
}

export enum DataSource {
	TPSF = 'TPSF',
	SIGRUN = 'SIGRUN'
}

export interface Options {
	label: string
	value: string | number
}

export interface Kategori {
	id: string
	navn: string
	order: number
	showInSummary?: boolean
}

export interface KategoriTypes {
	[key: string]: Kategori
}

export interface Attributt {
	hovedKategori: Kategori
	subKategori: Kategori
	id: string
	path?: string
	label: string
	dataSource: DataSource
	inputType?: InputType
	options?: Options[]
	format?: Function
	apiKodeverkId?: string
	validation?: yup.MixedSchema
	kanRedigeres?: boolean
	parent?: string
	harBarn?: boolean
	items?: Attributt[]
}

// Attributt grupper
export interface AttributtGruppe {
	hovedKategori: Kategori
	items: SubAttributtGruppe[]
}

export interface SubAttributtGruppe {
	subKategori: Kategori
	items: Attributt[]
}

export interface AttributtGruppeHovedKategori {
	hovedKategori: Kategori
	items: Attributt[]
}