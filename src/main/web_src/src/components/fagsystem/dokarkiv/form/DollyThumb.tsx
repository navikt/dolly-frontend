import React, { useState } from 'react'

export const DollyThumb = ({ file }) => {
	if (!file) {
		return null
	}
	console.log(file) // TODO: slett meg!
	const [state, setState] = useState({
		loading: false,
		thumb: undefined
	})

	let reader = new FileReader()

	reader.onloadend = () => {
		console.log(reader) // TODO: slett meg!
		setState({ loading: false, thumb: reader.result })
	}

	reader.readAsDataURL(file)

	if (!file) {
		return null
	}

	if (state.loading) {
		return <p>loading...</p>
	}

	return (
		<img
			src={state.thumb}
			alt={file.name}
			className="img-thumbnail mt-2"
			height={200}
			width={200}
		/>
	)
}
