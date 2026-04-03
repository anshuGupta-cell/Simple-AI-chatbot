import { marked } from "marked";
import fs from "fs/promises"
import { insertItem } from "./lib/file.js";
import { addEntryToLore, saveLoreTool } from "./lib/lore.js";
// get details of user
export const call = (req, res) => {
	res.send("asjf")
}


export const callGemini = async (req, res) => {
	const body = req.body;

	try {
		// 1. Update history and get the trimmed contents
		const chatHistory = await insertItem(body.text, "user");

		// 2. First Call: See if Ruka wants to save a memory
		const response = await fetch(process.env.GEMINI_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": process.env.GEMINI_API_KEY
			},
			body: JSON.stringify({
				system_instruction: chatHistory.system_instruction,
				contents: chatHistory.contents || chatHistory,
				tools: [saveLoreTool]
			})
		});

		const data = await response.json();
		console.log(data);
		

		if (!response.ok) {
			console.error("Gemini API Error:", data);
			return res.status(response.status).json({ success: false, error: data.error.message });
		}

		// Now it's safe to access candidates
		const firstMatch = data.candidates[0].content.parts[0];

		let finalReply = "";
		console.log("firstMatch --> ", firstMatch);
		

		// 3. Handle Function Call
		if (firstMatch.functionCall && firstMatch.functionCall.name === "save_memory") {
			const call = firstMatch.functionCall;
			await addEntryToLore(call.args.key, call.args.content);

			// IMPORTANT: We must tell Gemini the tool was successful so she can respond!
			const secondResponse = await fetch(process.env.GEMINI_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": process.env.GEMINI_API_KEY
				},
				body: JSON.stringify({
					contents: [
						...chatHistory.contents.slice(-12),
						data.candidates[0].content, // The AI's request to use the tool
						{
							role: "function",
							parts: [{
								functionResponse: {
									name: "save_memory",
									response: { result: "Memory locked in your heart!" }
								}
							}]
						}
					]
				})
			});

			const secondData = await secondResponse.json();
			finalReply = secondData.candidates[0].content.parts[0].text;
		} else {
			// No tool used, just a normal reply
			finalReply = firstMatch.text;
		}

		// 4. Finalize: Save Ruka's words to history and send to UI
		await insertItem(finalReply, "model");
		const replyHTML = marked(finalReply);

		return res.json({
			success: true,
			reply: replyHTML
		});

	} catch (err) {
		console.error("Fetch failed:", err);
		return res.status(500).json({ success: false, error: err.message });
	}
};

