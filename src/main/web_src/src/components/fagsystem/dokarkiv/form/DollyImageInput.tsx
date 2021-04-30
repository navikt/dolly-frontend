import React from 'react'
import { Label } from '~/components/ui/form/inputs/label/Label'

export const DollyImageInput = ({ name, label, setImageValue }) => {
	const changeImage = (file: File) => {
		if (!file) {
			return
		}
		console.log(file) // TODO: slett meg!
		setImageValue(
			JSON.stringify(
				{
					fileName: file.name,
					type: file.type,
					size: `${file.size} bytes`
				},
				null,
				2
			)
		)
	}

	return (
		<div className="container">
			<div className="form-group">
				<Label name={name} label={label} />
				<input
					id={name}
					name={name}
					type="file"
					onChange={event => {
						changeImage(event.currentTarget.files[0])
					}}
					className="form-control"
				/>
			</div>
		</div>
	)
}
