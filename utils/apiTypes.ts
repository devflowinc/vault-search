export interface CardMetadata {
  id: string;
  content: string;
  card_html?: string;
  link: string | null;
  qdrant_point_id: string;
  created_at: string;
  updated_at: string;
  oc_file_path: string | null;
}

export const indirectHasOwnProperty = (obj: unknown, prop: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const isCardMetadata = (card: unknown): card is CardMetadata => {
  if (typeof card !== "object" || card === null) return false;

  return (
    indirectHasOwnProperty(card, "id") &&
    typeof (card as CardMetadata).id === "string" &&
    indirectHasOwnProperty(card, "content") &&
    typeof (card as CardMetadata).content === "string" &&
    indirectHasOwnProperty(card, "qdrant_point_id") &&
    typeof (card as CardMetadata).qdrant_point_id === "string" &&
    indirectHasOwnProperty(card, "created_at") &&
    typeof (card as CardMetadata).created_at === "string" &&
    indirectHasOwnProperty(card, "updated_at") &&
    typeof (card as CardMetadata).updated_at === "string" &&
    indirectHasOwnProperty(card, "oc_file_path") &&
    (typeof (card as CardMetadata).oc_file_path === "string" ||
      (card as CardMetadata).oc_file_path === null)
  );
};

export type CardMetadataWithVotes = Exclude<CardMetadata, "author"> & {
  author: UserDTO | null;
  total_upvotes: number;
  total_downvotes: number;
  vote_by_current_user: boolean | null;
  private: boolean | null;
};

const isCardMetadataWithVotes = (
  card: unknown,
): card is CardMetadataWithVotes => {
  if (typeof card !== "object" || card === null) return false;

  return (
    indirectHasOwnProperty(card, "id") &&
    typeof (card as CardMetadataWithVotes).id === "string" &&
    indirectHasOwnProperty(card, "author") &&
    (isUserDTO((card as CardMetadataWithVotes).author) ||
      (card as CardMetadataWithVotes).author === null) &&
    indirectHasOwnProperty(card, "content") &&
    typeof (card as CardMetadataWithVotes).content === "string" &&
    indirectHasOwnProperty(card, "qdrant_point_id") &&
    typeof (card as CardMetadataWithVotes).qdrant_point_id === "string" &&
    indirectHasOwnProperty(card, "total_upvotes") &&
    typeof (card as CardMetadataWithVotes).total_upvotes === "number" &&
    indirectHasOwnProperty(card, "total_downvotes") &&
    typeof (card as CardMetadataWithVotes).total_downvotes === "number" &&
    indirectHasOwnProperty(card, "vote_by_current_user") &&
    (typeof (card as CardMetadataWithVotes).vote_by_current_user ===
      "boolean" ||
      (card as CardMetadataWithVotes).vote_by_current_user === null) &&
    indirectHasOwnProperty(card, "created_at") &&
    typeof (card as CardMetadataWithVotes).created_at === "string" &&
    indirectHasOwnProperty(card, "updated_at") &&
    typeof (card as CardMetadataWithVotes).updated_at === "string"
  );
};

export interface CardCollectionDTO {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
}

export interface CardBookmarksDTO {
  id: string;
  collection_id: string;
  card_metadata_id: string;
}

export interface CardsWithTotalPagesDTO {
  score_cards: ScoreCardDTO[];
  total_card_pages: number;
}

export interface ScoreCardDTO {
  metadata: CardMetadataWithVotes;
  score: number;
}

export const isScoreCardDTO = (card: unknown): card is ScoreCardDTO => {
  if (typeof card !== "object" || card === null) return false;

  return (
    indirectHasOwnProperty(card, "metadata") &&
    isCardMetadataWithVotes((card as ScoreCardDTO).metadata) &&
    indirectHasOwnProperty(card, "score") &&
    typeof (card as ScoreCardDTO).score === "number"
  );
};

export interface ActixApiDefaultError {
  message: string;
}

export const isActixApiDefaultError = (
  data: unknown,
): data is ActixApiDefaultError => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as ActixApiDefaultError).message === "string"
  );
};

export const detectReferralToken = (queryParamT: string | undefined | null) => {
  if (queryParamT) {
    let previousTokens: string[] = [];
    const previousReferralToken = window.localStorage.getItem("referralToken");
    if (previousReferralToken) {
      const previousReferralTokenArray: string[] = JSON.parse(
        previousReferralToken,
      ) as unknown as string[];
      previousTokens = previousReferralTokenArray;
      if (previousTokens.find((val) => val === queryParamT)) {
        return;
      }
    }
    previousTokens.push(queryParamT);
    window.localStorage.setItem(
      "referralToken",
      JSON.stringify(previousTokens),
    );
  }
};

export const getReferralTokenArray = (): string[] => {
  const previousReferralToken = window.localStorage.getItem("referralToken");
  if (previousReferralToken) {
    const previousReferralTokenArray: string[] = JSON.parse(
      previousReferralToken,
    ) as unknown as string[];
    return previousReferralTokenArray;
  }
  return [];
};

// Called SlimUser in the backend - ai-editor
export interface UserDTO {
  id: string;
  email: string | null;
  username: string | null;
  website: string | null;
  visible_email: boolean;
}

export const isUserDTO = (user: unknown): user is UserDTO => {
  if (typeof user !== "object" || user === null) return false;

  return (
    indirectHasOwnProperty(user, "id") &&
    typeof (user as UserDTO).id === "string" &&
    indirectHasOwnProperty(user, "email") &&
    (typeof (user as UserDTO).email === "string" ||
      (user as UserDTO).email === null) &&
    indirectHasOwnProperty(user, "username") &&
    (typeof (user as UserDTO).username === "string" ||
      (user as UserDTO).username === null) &&
    indirectHasOwnProperty(user, "website") &&
    (typeof (user as UserDTO).website === "string" ||
      (user as UserDTO).website === null) &&
    indirectHasOwnProperty(user, "visible_email") &&
    typeof (user as UserDTO).visible_email === "boolean"
  );
};

export type UserDTOWithVotesAndCards = UserDTO & {
  created_at: string;
  cards: CardMetadataWithVotes[];
  total_cards_created: number;
  total_upvotes_received: number;
  total_downvotes_received: number;
  total_votes_cast: number;
};

export const isUserDTOWithVotesAndCards = (
  user: unknown,
): user is UserDTOWithVotesAndCards => {
  if (typeof user !== "object" || user === null) return false;

  return (
    isUserDTO(user) &&
    (user as UserDTOWithVotesAndCards).cards.every((card) =>
      isCardMetadata(card),
    ) &&
    indirectHasOwnProperty(user, "created_at") &&
    typeof (user as UserDTOWithVotesAndCards).created_at === "string" &&
    indirectHasOwnProperty(user, "total_cards_created") &&
    typeof (user as UserDTOWithVotesAndCards).total_cards_created ===
      "number" &&
    indirectHasOwnProperty(user, "total_upvotes_received") &&
    typeof (user as UserDTOWithVotesAndCards).total_upvotes_received ===
      "number" &&
    indirectHasOwnProperty(user, "total_downvotes_received") &&
    typeof (user as UserDTOWithVotesAndCards).total_downvotes_received ===
      "number" &&
    indirectHasOwnProperty(user, "total_votes_cast") &&
    typeof (user as UserDTOWithVotesAndCards).total_votes_cast === "number"
  );
};

export interface UsersWithTotalPagesDTO {
  users: UserDTOWithScore[];
  total_user_pages: number;
}
export type UserDTOWithScore = UserDTO & {
  created_at: string;
  score: number;
};

export const isUserDTOWithScore = (user: unknown): user is UserDTOWithScore => {
  if (typeof user !== "object" || user === null) return false;

  return (
    isUserDTO(user) &&
    indirectHasOwnProperty(user, "created_at") &&
    typeof (user as UserDTOWithScore).created_at === "string" &&
    indirectHasOwnProperty(user, "score") &&
    typeof (user as UserDTOWithScore).score === "number"
  );
};

export interface CardCollectionDTO {
  id: string;
  author_id: string;
  name: string;
  description: string;
  is_public: boolean;
}

export const isCardCollectionDTO = (
  collection: unknown,
): collection is CardCollectionDTO => {
  if (typeof collection !== "object" || collection === null) return false;

  return (
    indirectHasOwnProperty(collection, "id") &&
    typeof (collection as CardCollectionDTO).id === "string" &&
    indirectHasOwnProperty(collection, "name") &&
    typeof (collection as CardCollectionDTO).name === "string" &&
    indirectHasOwnProperty(collection, "description") &&
    typeof (collection as CardCollectionDTO).description === "string" &&
    indirectHasOwnProperty(collection, "is_public") &&
    typeof (collection as CardCollectionDTO).is_public === "boolean"
  );
};

export interface CardCollectionBookmarkDTO {
  bookmarks: CardMetadataWithVotes[];
  collection: CardCollectionDTO;
}
