import React, { Component } from 'react'
import { TpsfApi } from '~/service/Api'
import Button from '~/components/ui/button/Button'
import Loading from '~/components/ui/loading/Loading'

import './EksporterExcel.less'

export default class EksportExcel extends Component {
	state = {
		loading: false
	}

	render() {
		// Ikke render knapp dersom det ikke finnes noen identer
		if (!this.props.identer) return false

		if (this.state.loading) return <Loading label="Eksporterer" />

		return (
			<Button
				className="flexbox--align-center gruppe-exceleksport"
				kind="file-new-table"
				onClick={this._onClick}
			>
				EKSPORTER TIL EXCEL
			</Button>
		)
	}

	_onClick = () => {
		const identliste = this._getIdentliste()

		this.setState({ loading: true }, async () => {
			try {
				const data = await TpsfApi.getExcelForIdenter(identliste)
				const href = 'data:text/csv,\uFEFF' //uFEFF fikser æøå
				const dagensDato = this._getDato()
				const link = document.createElement('a')

				//Lager en link til nedlasting som aktiveres uten klikk
				link.href = href + data.data
				link.download = this.props.gruppeId + '_' + dagensDato + '.csv'
				link.target = '_blank'
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)

				this.setState({ loading: false })
			} catch (err) {
				console.error('error: TpsfApi og nedlasting')
				this.setState({ loading: false })
			}
		})
	}

	_getIdentliste = () => {
		return this.props.identer.map(ident => ident.ident)
	}

	_getDato = () => {
		// TODO - denne hører til i util - dateformatter
		const dato = new Date()
		let dd = String(dato.getDate())
		if (dd < 10) {
			dd = '0' + dd
		}

		let mm = String(dato.getMonth() + 1)
		if (mm < 10) {
			mm = '0' + mm
		}

		return String(dato.getFullYear()) + mm + dd
	}
}
