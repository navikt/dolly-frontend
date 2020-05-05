import DollyService from './services/dolly/DollyService'
import TpsfService from './services/tpsf/TpsfService'
import SigrunService from './services/sigrun/SigrunService'
import KrrService from './services/krr/KrrService'
import ArenaService from './services/arena/ArenaService'
import InstService from './services/inst/InstService'
import UdiService from './services/udi/UdiService'
import PensjonService from './services/pensjon/PensjonService';
import AaregService from './services/aareg/AaregService';
import InntektstubService from './services/inntektstub/InntektstubService';
import BrregstubService from './services/brregstub/BrregstubService';
import HodejegerenService from '~/service/services/hodejegeren/HodejegerenService'

export const DollyApi = DollyService
export const TpsfApi = TpsfService
export const SigrunApi = SigrunService
export const KrrApi = KrrService
export const ArenaApi = ArenaService
export const InstApi = InstService
export const UdiApi = UdiService
export const PensjonApi = PensjonService
export const AaregApi = AaregService
export const InntektstubApi = InntektstubService
export const BrregstubApi = BrregstubService
export const HodejegerenApi = HodejegerenService

export default {
	DollyApi: DollyService,
	TpsfApi: TpsfService,
	SigrunApi: SigrunService,
	KrrApi: KrrService,
	ArenaApi: ArenaService,
	InstApi: InstService,
	UdiApi: UdiService,
	PensjonApi: PensjonService,
	AaregApi: AaregService,
	InntektstubApi: InntektstubService,
	BrregstubApi: BrregstubService,
	HodejegerenApi: HodejegerenService
}