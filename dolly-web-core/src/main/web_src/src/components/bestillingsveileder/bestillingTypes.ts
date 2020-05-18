export type Bestillingsdata = {
	antall: number
	environments: Array<String>
	tpsf?: {
		egenAnsattDatoFom?: string
		spesreg?: string
		relasjoner?: Relasjoner
	}
	// TODO: Lage types for alle fagsystemer
}

export type Relasjoner = {
	barn?: Array<Barn>
	partnere?: Array<Partnere>
}

export type Barn = {
	spesreg?: string
}

export type Partnere = {
	spesreg?: string
}
