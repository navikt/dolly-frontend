import * as Yup from 'yup'
import _get from 'lodash/get'
import _isNil from 'lodash/isNil'
import { requiredNumber, ifPresent} from '~/utils/YupValidations'

const innenforInntektsperiodeTest = (validation, validateFomBasedOnAge, validateBasedOnDeath) =>{
    const errorMsgAge =
        'F.o.m. dato må være før t.o.m. dato, og kan tidligst være året personen fyller 18.'
    const errorMsgDeath = 'T.o.m. dato kan ikke være før f.o.m. dato, og kan ikke være etter at personen har dødd.'
    return validation.test(
        'range',
        validateFomBasedOnAge ? errorMsgAge : errorMsgDeath,
        function isWithinTest(val) {
            if (!val) return true

            const dateValue = val
            const path = this.path
            const values = this.options.context
            const arrayPos = path.split('.')[0] // feks: pensjonforvalter[1]

            if(validateFomBasedOnAge){
                const inntektFom = _get(values, `${arrayPos}.inntekt.fomAar`)

                const alder = _get(values, 'tpsf.alder')
                const foedtFoer = _get(values, 'tpsf.foedtFoer')
                const foedtEtter = _get(values, 'tpsf.foedtEtter')

                if(!_isNil(alder)){
                    if(new Date().getFullYear() - alder + 18 > inntektFom ){
                        return false
                    }
                }else if(!_isNil(foedtFoer)){
                    let day = foedtFoer.getDate()
                    let month = foedtFoer.getMonth()
                    let year = foedtFoer.getFullYear()

                    year = (day==1 && month==0) ?  year - 1 : year

                    if(year + 18 > inntektFom){
                        return false
                    }
                }else if(!_isNil(foedtEtter) && _isNil(foedtFoer)){
                    if(foedtEtter.getFullYear() + 18 > inntektFom){
                        return false
                    }
                }else{
                    if(new Date().getFullYear() - 12 > inntektFom){
                        return false
                    }
                }
            }

            if(validateBasedOnDeath){
                const inntektTom = _get(values, `${arrayPos}.inntekt.tomAar`)
                const doedsdato = _get(values, 'tpsf.doedsdato')

                if(!_isNil(doedsdato)){
                    let year = doedsdato.getFullYear();
                    if(year < inntektTom){
                        return false
                    }
                }

            }

            const inntektFom = _get(values, `${arrayPos}.inntekt.fomAar`)
            const inntektTom = _get(values, `${arrayPos}.inntekt.tomAar`)

            return dateValue >= inntektFom && dateValue <= (_isNil(inntektTom) ? new Date().getFullYear() : inntektTom)
        }
    )
}

export const validation  = {
    pensjonforvalter: ifPresent(
        '$pensjonforvalter',
            Yup.object({
                inntekt: Yup.object({
                    fomAar: innenforInntektsperiodeTest(requiredNumber, true, false),
                    tomAar: innenforInntektsperiodeTest(requiredNumber, false, true)
                        .typeError('Velg et gyldig år'),
                    belop: Yup.number()
                        .min(0, 'Tast inn et gyldig beløp')
                        .typeError('Tast inn et gyldig beløp'),
                    redusertMedGrunnbelop: Yup.boolean()
                })
            })
    )
}