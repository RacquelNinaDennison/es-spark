import React, {
	useState,
	ChangeEvent,
	FormEvent,
	useEffect,
	ReactNode,
} from "react";
import {
	useMutation,
	UseMutationResult,
} from "@tanstack/react-query";
import axios from "axios";
import Textarea from "react-textarea-autosize";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import {
	gptGeneratorRequest,
	gptGeneratorResponse,
} from "@/types";

interface Message {
	type: "user" | "response";
	text: string;
}

const parseAndRenderText = (text: string): ReactNode[] => {
	const regex = /\\\((.*?)\\\)/g;
	let parts: ReactNode[] = [];
	let lastIndex = 0;

	text.replace(regex, (match, p1, offset) => {
		parts.push(text.substring(lastIndex, offset));
		parts.push(<InlineMath key={offset}>{p1}</InlineMath>);
		lastIndex = offset + match.length;
		return match;
	});

	parts.push(text.substring(lastIndex));

	return parts;
};

export default function Home() {
	const [input, setInput] = useState<string>("");
	const [conversation, setConversation] = useState<
		Message[]
	>([]);
	const [threadId, setThreadId] = useState<string | null>(
		null
	);

	useEffect(() => {
		const storedThreadId = localStorage.getItem("threadId");

		if (storedThreadId) {
			setThreadId(storedThreadId);
		}
	}, []);

	const mutation: UseMutationResult<
		gptGeneratorResponse,
		unknown,
		gptGeneratorRequest
	> = useMutation({
		mutationFn: async (
			data
		): Promise<gptGeneratorResponse> => {
			try {
				const response = await axios.post(
					"/api/hello",
					data
				);
				return response.data;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					console.error(
						"Error in Axios request:",
						error.response
					);
				} else {
					console.error("Error in Axios request:", error);
				}
				throw error;
			}
		},
		onSuccess: (data) => {
			setConversation((prev) => [
				...prev,
				{ type: "response", text: data.message },
			]);
			localStorage.setItem("threadId", data.threadId);
			setThreadId(data.threadId);
		},
	});

	const handleSubmit = (
		event: FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		setConversation((prev) => [
			...prev,
			{ type: "user", text: input },
		]);
		console.log("handing mutation");
		mutation.mutate({
			userData: input,
			threadID: threadId,
		});
		setInput("");
	};

	const handleInputChange = (
		event: ChangeEvent<HTMLTextAreaElement>
	) => {
		setInput(event.target.value);
	};
	return (
		<div className='min-h-screen bg-white flex flex-col'>
			<header className='flex justify-center items-center bg-white py-4'>
				<h1 className='text-3xl font-bold'>
					<span className='text-yellow-400'>e</span>
					<span className='text-blue-600'>Spark</span>
					<span className='text-yellow-400'>Tutor</span>
				</h1>
			</header>
			<div className='flex-grow overflow-y-auto p-5'>
				<div className='max-w-md mx-auto space-y-2 overflow-y-scroll'>
					{conversation.map((entry, index) => (
						<div
							key={index}
							className={`p-5 m-3 rounded-lg ${
								entry.type === "user"
									? "bg-blue-600 text-right"
									: "bg-green-600 text-left"
							}`}
						>
							{parseAndRenderText(entry.text)}
						</div>
					))}
				</div>
			</div>
			<form
				onSubmit={handleSubmit}
				className='p-3 bg-white'
			>
				<div className='max-w-md w-full mx-auto flex'>
					<Textarea
						tabIndex={0}
						required
						rows={1}
						value={input}
						onChange={handleInputChange}
						autoFocus
						placeholder='Send message...'
						spellCheck={false}
						className='focus:outline-none focus:ring focus:border-blue-300 text-sm text-black p-3 rounded-lg bg-gray-200 flex-grow'
					/>
					<button
						type='submit'
						className='ml-2 bg-blue-500 p-2 rounded-lg'
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
}
