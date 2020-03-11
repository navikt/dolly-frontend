import React from 'react'
import { FieldArray } from 'formik'
import _get from 'lodash/get'
import { FormikDatepicker } from '~/components/ui/form/inputs/datepicker/Datepicker'
import { FormikSelect } from '~/components/ui/form/inputs/select/Select'
import {
	DollyFieldArrayWrapper,
	DollyFaBlokk,
	FieldArrayAddButton
} from '~/components/ui/form/fieldArray/DollyFieldArray'
import { nesteGyldigStatuser, statuser as SivilstandStatuser } from './SivilstandOptions'

const initialValues = { sivilstand: '', sivilstandRegdato: null }

export const Sivilstand = ({ basePath, formikBag, locked }) => (
	<FieldArray name={basePath}>
		{arrayHelpers => {
			const sivilstander = _get(arrayHelpers.form.values, basePath, [])

			// Sjekk forrige (nest siste) sivilstandstatus, for å sette
			// gyldige options for current sivilstandstatus
			let sivilstandKode
			if (sivilstander.length > 1) {
				sivilstandKode = sivilstander[sivilstander.length - 2].sivilstand
			}

			const options = nesteGyldigStatuser(sivilstandKode)

			const addNewEntry = () => arrayHelpers.push(initialValues)
			return (
				<DollyFieldArrayWrapper title="Forhold" nested>
					{sivilstander.map((c, idx) => {
						const path = `${basePath}[${idx}]`
						const isLast = idx === sivilstander.length - 1

						// Det er kun mulig å slette siste forhold
						const showRemove = isLast && idx > 0 && !locked
						const clickRemove = () => arrayHelpers.remove(idx)
						return (
							<DollyFaBlokk
								key={idx}
								idx={idx}
								title="Forhold"
								handleRemove={showRemove && clickRemove}
							>
								<SivilstandForm path={path} options={options} readOnly={!isLast || locked} />
							</DollyFaBlokk>
						)
					})}
					<FieldArrayAddButton
						title="Nytt forhold"
						disabled={!formikBag.isValid}
						onClick={addNewEntry}
					/>
				</DollyFieldArrayWrapper>
			)
		}}
	</FieldArray>
)

const SivilstandForm = ({ path, options, readOnly }) => (
	<React.Fragment>
		<FormikSelect
			name={`${path}.sivilstand`}
			label="Forhold til partner (sivilstand)"
			options={readOnly ? Object.values(SivilstandStatuser) : options}
			isClearable={false}
			disabled={readOnly}
			fastfield={false}
		/>
		<FormikDatepicker
			name={`${path}.sivilstandRegdato`}
			label="Sivilstand fra dato"
			isClearable={false}
			disabled={readOnly}
			fastfield={false}
		/>
	</React.Fragment>
)
