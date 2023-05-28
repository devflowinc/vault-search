export interface CardDTO {
	id: string
	content: string
	score: number
	link: string | null
}

export const isCardDTO = (card: unknown): card is CardDTO => {
	if (typeof card !== 'object' || card === null) return false

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

export interface UserDTO {
	id: string
	email: string | null
	username: string | null
	website: string | null
	visible_email: boolean
}

export const isUserDTO = (user: unknown): user is UserDTO => {
	if (typeof user !== 'object' || user === null) return false

	return (
		user.hasOwnProperty('id') &&
		typeof (user as UserDTO).id === 'string' &&
		user.hasOwnProperty('email') &&
		(typeof (user as UserDTO).email === 'string' || (user as UserDTO).email === null) &&
		user.hasOwnProperty('username') &&
		(typeof (user as UserDTO).username === 'string' ||
			(user as UserDTO).username === null) &&
		user.hasOwnProperty('website') &&
		(typeof (user as UserDTO).website === 'string' || (user as UserDTO).website === null) &&
		user.hasOwnProperty('visible_email') &&
		typeof (user as UserDTO).visible_email === 'boolean'
	)
}
