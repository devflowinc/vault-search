export interface CardDTO {
	id: string
	content: string
	score: number
	link: string | null
}

export const isCardDTO = (card: unknown): card is CardDTO => {
	if (typeof card !== 'object' || card === null) return false

	console.log(
		'score',
		card.hasOwnProperty('link'),
		typeof (card as CardDTO).link === 'string' || typeof (card as CardDTO).link === null
	)

	return (
		card.hasOwnProperty('id') &&
		typeof (card as CardDTO).id === 'string' &&
		card.hasOwnProperty('content') &&
		typeof (card as CardDTO).content === 'string' &&
		card.hasOwnProperty('score') &&
		typeof (card as CardDTO).score === 'number' &&
		card.hasOwnProperty('link') &&
		(typeof (card as CardDTO).link === 'string' || typeof (card as CardDTO).link === null)
	)
}

export interface ActixApiDefaultError {
	message: string
}

export const isActixApiDefaultError = (data: unknown): data is ActixApiDefaultError => {
	return (
		typeof data === 'object' &&
		data !== null &&
		'message' in data &&
		typeof (data as ActixApiDefaultError).message === 'string'
	)
}

export const detectReferralToken = (queryParamT: string | undefined | null) => {
	if (queryParamT) {
		let previousTokens: string[] = []
		const previousReferralToken = window.localStorage.getItem('referralToken')
		if (previousReferralToken) {
			const previousReferralTokenArray: string[] = JSON.parse(
				previousReferralToken
			) as unknown as string[]
			previousTokens = previousReferralTokenArray
			if (previousTokens.find((val) => val === queryParamT)) {
				return
			}
		}
		previousTokens.push(queryParamT)
		window.localStorage.setItem('referralToken', JSON.stringify(previousTokens))
	}
}

export const getReferralTokenArray = (): string[] => {
	const previousReferralToken = window.localStorage.getItem('referralToken')
	if (previousReferralToken) {
		const previousReferralTokenArray: string[] = JSON.parse(
			previousReferralToken
		) as unknown as string[]
		return previousReferralTokenArray
	}
	return []
}
