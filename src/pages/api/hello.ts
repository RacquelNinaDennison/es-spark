// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { runAssitant } from "@/utils/createAssistant";
import { gptGeneratorResponse } from "@/types";
type Data = {
	name: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<gptGeneratorResponse>
) {
	const { threadID, userData } = req.body;
	console.log(threadID);
	console.log(userData);
	const message = await runAssitant(threadID, userData);
	res.send({
		message: message.message,
		threadId: message.threadID,
	});
}
