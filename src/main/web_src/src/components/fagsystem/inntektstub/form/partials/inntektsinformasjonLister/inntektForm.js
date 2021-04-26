import React from 'react'
import {FormikDollyFieldArray} from '~/components/ui/form/fieldArray/DollyFieldArray'
import {FormikTextInput} from '~/components/ui/form/inputs/textInput/TextInput'
import {FormikDatepicker} from '~/components/ui/form/inputs/datepicker/Datepicker'
import InntektStub from '~/components/inntektStub/validerInntekt'
import {useBoolean} from 'react-use'
import {ToggleGruppe, ToggleKnapp} from '~/components/ui/toggle/Toggle'

const initialValues = {
    beloep: '',
    startOpptjeningsperiode: '',
    sluttOpptjeningsperiode: '',
    inntektstype: ''
}

const changeFormType = event = {
    setFormSimple(event.target.value.includes('Enkel')
}

export const InntektForm = ({formikBag, inntektsinformasjonPath}) => {
    const [formSimple, setFormSimple] = useBoolean(true)
    return (
        <>
            <ToggleGruppe onChange={changeFormType} name="toggler">
                <ToggleKnapp value="Enkel" checked={formSimple}>
                    Enkel
                </ToggleKnapp>
                <ToggleKnapp value="Detaljert" checked={!formSimple}>
                    Detaljert
                </ToggleKnapp>
            </ToggleGruppe>
            <FormikDollyFieldArray
                name={`${inntektsinformasjonPath}.inntektsliste`}
                header="Inntekt"
                newEntry={initialValues}
            >
                {path => (
                    <>
                        <FormikTextInput name={`${path}.beloep`} label="Beløp" type="number"/>
                        {formSimple ? (
                            <></>
                        ) : (
                            <>
                                <FormikDatepicker
                                    name={`${path}.startOpptjeningsperiode`}
                                    label="Start opptjeningsperiode"
                                />
                                <FormikDatepicker
                                    name={`${path}.sluttOpptjeningsperiode`}
                                    label="Slutt opptjeningsperiode"
                                />
                                <InntektStub formikBag={formikBag} inntektPath={path}/>
                            </>
                        )}
                    </>
                )}
            </FormikDollyFieldArray>
        </>
    )
}
