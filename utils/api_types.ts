export interface CardDTO {
	id: String
	content: String
	side: String
	topic: String
	score: Number
	votes: Number
	link?: String
}

export const isCardDTO = (card: unknown): card is CardDTO => {
	if (typeof card !== 'object' || card === null) return false

  return (
    card.hasOwnProperty('id') && typeof (card as CardDTO).id === 'string' &&
    card.hasOwnProperty('content') && typeof (card as CardDTO).content === 'string' &&
    card.hasOwnProperty('side') && typeof (card as CardDTO).side === 'string' &&
    card.hasOwnProperty('topic') && typeof (card as CardDTO).topic === 'string' &&
    card.hasOwnProperty('score') && typeof (card as CardDTO).score === 'number' &&
    card.hasOwnProperty('votes') && typeof (card as CardDTO).votes === 'number' &&
    (card.hasOwnProperty('link') ? typeof (card as CardDTO).link === 'string' : true)
  )
}
