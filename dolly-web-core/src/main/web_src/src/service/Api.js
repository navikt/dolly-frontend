import DollyService from './services/dolly/DollyService'
import TpsfService from './services/tpsf/TpsfService'
import SigrunService from './services/sigrun/SigrunService'
import KrrService from './services/krr/KrrService'
import ArenaService from './services/arena/ArenaService'
import InstService from './services/inst/InstService'
import UdiService from './services/udi/UdiService'
import InntektstubService from "./services/inntektstub/InntektstubService";

export const DollyApi = DollyService
export const TpsfApi = TpsfService
export const SigrunApi = SigrunService
export const KrrApi = KrrService
export const ArenaApi = ArenaService
export const InstApi = InstService
export const UdiApi = UdiService
export const InntektstubApi = InntektstubService

export default {
	DollyApi: DollyService,
	TpsfApi: TpsfService,
	SigrunApi: SigrunService,
	KrrApi: KrrService,
	ArenaApi: ArenaService,
	InstApi: InstService,
	UdiApi: UdiService,
	InntektstubApi: InntektstubService
}