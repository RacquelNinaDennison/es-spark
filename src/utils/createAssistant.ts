import dotenv from "dotenv";
import OpenAI from "openai";
import { sleep } from "openai/core";
dotenv.config();

const API_Key =
	"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";
const client = new OpenAI({ apiKey: API_Key });

const getAssistantMessage = async (
	thread: OpenAI.Beta.Threads.Thread
) => {
	const assistant = await client.beta.assistants.retrieve(
		"asst_Q7VtVgNG4eSD1RTi2VrEZws5"
	);
	let run = await client.beta.threads.runs.create(
		thread.id,
		{
			assistant_id: assistant.id,
		}
	);

	while (run.status != "completed") {
		sleep(3000);
		run = await client.beta.threads.runs.retrieve(
			thread.id,
			run.id
		);
		console.log("waiting for assistant");
		console.log(run.status);
	}

	const messages = await client.beta.threads.messages.list(
		thread.id
	);
	const new_messsage = messages.data[0].content;
	const new_messages = getMessages(new_messsage);
	return new_messages as string;
};
export const runAssitant = async (
	threadID: string | undefined,
	messageBody: string
) => {
	let thread: OpenAI.Beta.Threads.Thread;
	if (threadID) {
		thread = await client.beta.threads.retrieve(threadID);
	} else {
		thread = await client.beta.threads.create();
		threadID = (await thread).id;
	}

	const message = await client.beta.threads.messages.create(
		threadID,
		{
			role: "user",
			content: messageBody,
		}
	);
	const new_message = await getAssistantMessage(thread);

	return { message: new_message, threadID: threadID };
};

const getMessages = (content: any) => {
	return content[0].text.value;
};
