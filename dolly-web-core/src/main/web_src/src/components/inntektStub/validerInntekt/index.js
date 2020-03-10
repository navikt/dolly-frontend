import React, { useState, useEffect } from 'react'
import _get from 'lodash/get'
import Inntekt from './Inntekt'
import { Formik } from 'formik'
import * as api from '../api'
import tilleggsinformasjonPaths from '../paths'

const InntektStub = ({ formikBag, inntektPath }) => {
	const [fields, setFields] = useState({})
	const [inntektValues, setInntektValues] = useState(_get(formikBag.values, inntektPath))
	const [currentInntektstype, setCurrentInntektstype] = useState(
		_get(formikBag.values, `${inntektPath}.inntektstype`)
	)
	const [currentTilleggsinformasjonstype, setCurrentTilleggsinformasjonstype] = useState(
		_get(formikBag.values, `${inntektPath}.tilleggsinformasjonstype`)
	)

	useEffect(() => {
		setCurrentInntektstype(_get(formikBag.values, `${inntektPath}.inntektstype`))
	})

	useEffect(() => {
		setCurrentTilleggsinformasjonstype(
			_get(formikBag.values, `${inntektPath}.tilleggsinformasjonstype`)
		)
	})

	useEffect(() => {
		if (inntektValues.inntektstype !== '' && Object.keys(fields).length < 1) {
			api.validate(inntektValues).then(response => setFields(response))
		}
	}, [])

	const setFormikBag = values => {
		const tilleggsinformasjonAttributter = {
			BilOgBaat: 'bilOgBaat',
			DagmammaIEgenBolig: 'dagmammaIEgenBolig',
			NorskKontinentalsokkel: 'inntektPaaNorskKontinentalsokkel',
			Livrente: 'livrente',
			LottOgPartInnenFiske: 'lottOgPart',
			Nettoloennsordning: 'nettoloenn',
			UtenlandskArtist: 'utenlandskArtist'
		}

		const nullstiltInntekt = {
			beloep: _get(formikBag.values, `${inntektPath}.beloep`),
			startOpptjeningsperiode: _get(formikBag.values, `${inntektPath}.startOpptjeningsperiode`),
			sluttOpptjeningsperiode: _get(formikBag.values, `${inntektPath}.sluttOpptjeningsperiode`),
			inntektstype: values.inntektstype
		}

		// TODO: Denne må gjøres ferdig - må nullstille tilleggsinformasjon når tilleggsinformasjonstype endres
		// Nullstill inntekt-form om det velges ny inntektstype
		if (values.inntektstype !== currentInntektstype) {
			formikBag.setFieldValue(inntektPath, nullstiltInntekt)
		} else {
			for (var [key, value] of Object.entries(values)) {
				if (key === 'tilleggsinformasjonstype') {
					if (value !== currentTilleggsinformasjonstype) {
						// if (value !== _get(formikBag.values, `${inntektPath}.tilleggsinformasjonstype`)) {
						formikBag.setFieldValue(`${inntektPath}.tilleggsinformasjon`, {})
					}
					setCurrentTilleggsinformasjonstype(value)
				}

				if (tilleggsinformasjonAttributter[value]) {
					// formikBag.setFieldValue(`${inntektPath}.tilleggsinformasjon`, null)
					formikBag.setFieldValue(
						`${inntektPath}.tilleggsinformasjon.${tilleggsinformasjonAttributter[value]}`,
						{}
					)
					formikBag.setFieldValue(`${inntektPath}.${key}`, value) // denne som setter tilleggsinformasjonstype
				} else {
					if (tilleggsinformasjonPaths(key) !== key) {
						// formikBag.setFieldValue(`${inntektPath}.tilleggsinformasjon`, null)
						formikBag.setFieldValue(`${inntektPath}.${tilleggsinformasjonPaths(key)}`, value)
					} else {
						formikBag.setFieldValue(`${inntektPath}.${key}`, value)
					}
				}
			}
		}
	}

	return (
		<Formik
			initialValues={inntektValues.inntektstype !== '' ? inntektValues : {}}
			onSubmit={(values, { resetForm }) => {
				if (currentInntektstype && values.inntektstype !== currentInntektstype) {
					resetForm({ values: { inntektstype: values.inntektstype } })
					values = { inntektstype: values.inntektstype }
				}
				for (var [key, value] of Object.entries(values)) {
					if (value === '') {
						values[key] = null
					}
				}
				api.validate(values).then(response => setFields(response))
				setFormikBag(values)
			}}
			render={({ handleSubmit }) => (
				<div>
					<Inntekt
						fields={fields}
						onValidate={handleSubmit}
						formikBag={formikBag}
						path={inntektPath}
					/>
				</div>
			)}
		/>
	)
}

export default InntektStub
