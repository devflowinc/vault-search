import { type Accessor, type Setter, createSignal, createEffect } from 'solid-js'

export interface PaginationControlProps {
	currentPage: Accessor<number>
	totalPages: number
	setCurrentPage: Setter<number>
	query: string
}

export const PaginationControl = (props: PaginationControlProps) => {
	const [offset, setOffset] = createSignal(1)
	createEffect(() => {})
	return (
		<div class="flex items-center justify-center space-x-4">
			<button
				disabled={props.currentPage() === 1}
				class={`rounded-full  p-2 ${
					props.currentPage() != 1
						? 'bg-neutral-50 dark:bg-neutral-800'
						: 'bg-neutral-60 dark:bg-neutral-900'
				}`}
				onClick={() => {
					if (Math.ceil(props.currentPage() / 5) * 5 - 4 == props.currentPage()) {
						setOffset(offset() - 5)
						props.setCurrentPage(props.currentPage() - 1)
						window.location.href = `/search?q=${props.query}&page=${props.currentPage() - 1}`
					} else {
						props.setCurrentPage(props.currentPage() - 1)
						window.location.href = `/search?q=${props.query}&page=${props.currentPage() - 1}`
					}
				}}
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M15 19l-7-7 7-7" />
				</svg>
			</button>
			<span class="text-lg font-semibold">
				{Array.from({ length: Math.min(props.totalPages, 5) }, (_, index) => index + offset()).map(
					(pageNumber) => (
						<button
							class={`rounded-full p-2 ${
								pageNumber === props.currentPage() ? 'bg-neutral-50 dark:bg-neutral-700' : ''
							}`}
							onClick={() => {
								props.setCurrentPage(pageNumber)
								window.location.href = `/search?q=${props.query}&page=${props.currentPage()}`
							}}
						>
							{pageNumber}
						</button>
					)
				)}
			</span>
			<button
				disabled={props.currentPage() === props.totalPages}
				class={`${
					props.currentPage() != props.totalPages
						? 'bg-neutral-50 dark:bg-neutral-800'
						: 'bg-neutral-60 dark:bg-neutral-900'
				} rounded-full bg-neutral-50
				p-2`}
				onClick={() => {
					if (props.currentPage() % 5 == 0) {
						setOffset(offset() + 5)
						props.setCurrentPage(props.currentPage() + 1)
						window.location.href = `/search?q=${props.query}&page=${props.currentPage() - 1}`
					} else {
						props.setCurrentPage(props.currentPage() + 1)
						window.location.href = `/search?q=${props.query}&page=${props.currentPage() - 1}`
					}
				}}
			>
				<svg
					class="h-6 w-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	)
}
