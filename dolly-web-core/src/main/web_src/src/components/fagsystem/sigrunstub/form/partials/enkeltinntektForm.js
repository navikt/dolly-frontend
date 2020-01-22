import React from 'react'
import _get from 'lodash/get'
import _isString from 'lodash/isString'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { FormikTextInput } from '~/components/ui/form/inputs/textInput/TextInput'
import { FormikDollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'
import Formatters from '~/utils/DataFormatter'

export const EnkeltinntektForm = ({ path, title, initialGrunnlag, tjeneste, formikBag }) => {
	return (
		<FormikDollyFieldArray name={path} title={title} newEntry={initialGrunnlag} nested>
			{(path, idx) => (
				<React.Fragment key={idx}>
					<FormikSelect
						name={`${path}.tekniskNavn`}
						label="Type inntekt"
						kodeverk={Formatters.uppercaseAndUnderscoreToCapitalized(tjeneste)}
						size="grow"
						isClearable={false}
					/>
					<FormikTextInput name={`${path}.verdi`} label="Beløp" type="number" />
				</React.Fragment>
			)}
		</FormikDollyFieldArray>
	)
}
