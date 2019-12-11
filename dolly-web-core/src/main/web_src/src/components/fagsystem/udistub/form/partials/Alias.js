import React from 'react'
import _get from 'lodash/get'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import { SelectOptionsManager as Options } from '~/service/SelectOptions'
import { DollyFieldArray } from '~/components/ui/form/fieldArray/DollyFieldArray'

const initialValues = {
	identtype: '',
	nyIdent: false
}

export const Alias = ({ formikBag }) => (
	<DollyFieldArray name="udistub.aliaser" title="Alias" newEntry={initialValues}>
		{(path, idx, curr) => (
			<React.Fragment key={idx}>
				<FormikSelect name={`${path}.nyIdent`} label="Type alias" options={Options('nyIdent')} />
				{curr.nyIdent && (
					<FormikSelect
						name={`${path}.identtype`}
						label="Identtype"
						options={Options('identtypeUtenBost')}
						isClearable={false}
					/>
				)}
			</React.Fragment>
		)}
	</DollyFieldArray>
)
