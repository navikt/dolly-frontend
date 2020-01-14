import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from '../Button'

export default class FavoriteButton extends PureComponent {
	static propTypes = {
		isFavorite: PropTypes.bool,
		addFavorite: PropTypes.func,
		removeFavorite: PropTypes.func
	}

	render() {
		const { isFavorite, hideLabel, addFavorite, removeFavorite } = this.props
		return (
			<Button
				title={isFavorite ? 'Fjern fra favoritter' : 'Legg til som favoritt'}
				iconSize={hideLabel && 18}
				kind={isFavorite ? 'star-filled' : 'star'}
				onClick={isFavorite ? removeFavorite : addFavorite}
			>
				{!hideLabel && (isFavorite ? 'FJERN FAVORITT' : 'FAVORISER')}
			</Button>
		)
	}
}
