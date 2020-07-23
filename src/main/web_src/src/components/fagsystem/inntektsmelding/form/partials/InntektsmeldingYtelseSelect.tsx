import React from 'react'
import _get from 'lodash/get'
import _has from 'lodash/has'
import LoadableComponent, { Feilmelding } from '~/components/ui/loading/LoadableComponent'
import { DollySelect } from '~/components/ui/form/inputs/select/Select'
import { SelectOptionsOppslag } from '~/service/SelectOptionsOppslag'
import Formatters from '~/utils/DataFormatter'
import { FormikProps } from 'formik'
import { Ytelser, Tema } from '~/components/fagsystem/inntektsmelding/InntektsmeldingTypes'

interface InntektsmeldingSelect {
	path: string
	idx: number
	label: string
	formikBag: FormikProps<{}>
	kodeverk: string
	size?: string
}

type Option = {
	label: string
	value: string
	tema?: string
}

export default ({
	path,
	idx,
	label,
	kodeverk,
	formikBag,
	size = 'medium'
}: InntektsmeldingSelect) => {
	const ytelsePath = `${path}.ytelse`

	const feil = (feilmelding: Feilmelding) => {
		if (_has(formikBag.touched, ytelsePath) && _get(formikBag.values, ytelsePath) === '')
			return { feilmelding: 'Feltet er påkrevd' }
		else return feilmelding
	}
	return (
		<LoadableComponent
			onFetch={() =>
				SelectOptionsOppslag.hentInntektsmeldingOptions(kodeverk).then(response =>
					response.map((value: string) => ({
						value,
						label: Formatters.codeToNorskLabel(value),
						tema: findTema(value)
					}))
				)
			}
			render={(data: Array<Option>, feilmelding: Feilmelding) => (
				<DollySelect
					name={ytelsePath}
					label={label}
					options={data}
					type="text"
					size={size}
					value={_get(formikBag.values, ytelsePath)}
					onChange={(e: Option) => setYtelseOgTema(e, formikBag, path, idx)}
					feil={feil(feilmelding)}
					isClearable={false}
				/>
			)}
		/>
	)
}

const findTema = (ytelse: string) => {
	if (ytelse === Ytelser.Sykepenger) return Tema.Syk
	else if (ytelse === Ytelser.Foreldrepenger || ytelse === Ytelser.Svangerskapspenger)
		return Tema.For
	else return Tema.Oms
}

const setYtelseOgTema = (value: Option, formikBag: FormikProps<{}>, path: string, idx: number) => {
	formikBag.setFieldValue('inntektsmelding.joarkMetadata.tema', value.tema)

	const {
		sykepengerIArbeidsgiverperioden,
		startdatoForeldrepengeperiode,
		pleiepengerPerioder,
		omsorgspenger,
		...rest
	} = _get(formikBag.values, path)

	switch (value.value) {
		case Ytelser.Omsorgspenger:
			formikBag.setFieldValue(path, {
				...rest,
				ytelse: value.value,
				omsorgspenger: { harUtbetaltPliktigeDager: false }
			})
			break
		case Ytelser.Sykepenger:
			formikBag.setFieldValue(path, {
				...rest,
				ytelse: value.value,
				sykepengerIArbeidsgiverperioden: { bruttoUtbetalt: '' }
			})

			break
		case Ytelser.Foreldrepenger:
			formikBag.setFieldValue(path, {
				...rest,
				ytelse: value.value,
				startdatoForeldrepengeperiode: ''
			})
			break
		case Ytelser.Pleiepenger:
			formikBag.setFieldValue(path, {
				...rest,
				ytelse: value.value,
				pleiepengerPerioder: [{ fom: '', tom: '' }]
			})
			break
		default:
			// Foreløpig ingen spesielle keys for opplærings- og svangerskapspenger
			formikBag.setFieldValue(`${path}.ytelse`, value.value)
	}
}
