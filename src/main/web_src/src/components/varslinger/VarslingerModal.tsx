import React, { useState } from 'react'
import { isBefore, isAfter } from 'date-fns'
import DollyModal from '~/components/ui/modal/DollyModal'
import Stegindikator from 'nav-frontend-stegindikator'
import NavButton from '~/components/ui/button/NavButton/NavButton'
import { VarslingerTekster } from './VarslingerTekster'
import './varslingerModal.less'

interface Varslinger {
	varslinger: Array<Varsling>
	updateVarslingerBruker: Function
}

type Varsling = {
	fom: string
	tom: string
	varslingId: string
}

export const VarslingerModal = ({ varslinger, updateVarslingerBruker }: Varslinger) => {
	const [steg, setSteg] = useState(0)
	const [modalOpen, setModalOpen] = useState(true)

	const currentDate = new Date()
	const gyldigeVarslinger = varslinger.filter(
		varsling =>
			(!varsling.fom && (!varsling.tom || isBefore(currentDate, new Date(varsling.tom)))) ||
			(!varsling.tom && (!varsling.fom || isAfter(currentDate, new Date(varsling.fom)))) ||
			(isAfter(currentDate, new Date(varsling.fom)) &&
				isBefore(currentDate, new Date(varsling.tom)))
	)

	const antallVarslinger = gyldigeVarslinger.length
	if (antallVarslinger < 1) return null

	const varslingerSteg = gyldigeVarslinger.map(varsling => ({ label: varsling.varslingId }))

	const submitSettVarsling = (siste: boolean) => {
		siste ? setModalOpen(false) : setSteg(steg + 1)
		updateVarslingerBruker(gyldigeVarslinger[steg].varslingId)
	}

	return (
		<DollyModal isOpen={modalOpen} noCloseButton={true} width="70%">
			<div className="varslinger-modal">
				{/* 
                //@ts-ignore */}
				{antallVarslinger > 1 && <Stegindikator aktivtSteg={steg} steg={varslingerSteg} kompakt />}

				<VarslingerTekster varslingId={gyldigeVarslinger[steg].varslingId} />

				<div className="varslinger-buttons">
					{steg > 0 && (
						<NavButton type="standard" onClick={() => setSteg(steg - 1)} style={{ float: 'left' }}>
							Forrige side
						</NavButton>
					)}
					{steg < antallVarslinger - 1 ? (
						<NavButton
							type="hoved"
							onClick={() => submitSettVarsling(false)}
							style={{ float: 'right' }}
						>
							Neste side
						</NavButton>
					) : (
						<NavButton
							type="hoved"
							onClick={() => submitSettVarsling(true)}
							style={{ float: 'right' }}
						>
							Lukk
						</NavButton>
					)}
				</div>
			</div>
		</DollyModal>
	)
}
