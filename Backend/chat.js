import { marked } from "marked";
import fs from "fs/promises"
import { insertItem } from "./lib/file.js";
// get details of user
export const call = (req, res) => {
	res.send("asjf")
}


export const callGemini = async (req, res) => {
	const body = req.body

	
	// const data = await fs.readFile("chatHistory.js", 'utf-8')
	// console.log("file -> ", data);
	
	try {
		const newChat = await insertItem(body.text, "user")
		console.log(newChat);
		
		const response = await fetch(
			process.env.GEMINI_URL,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": process.env.GEMINI_API_KEY
				},
				body: JSON.stringify(newChat)
			}
		);

		const data = await response.json();

		// Check if the API returned an error object
		if (data.error) {
			console.error(`Error ${data.error.code}: ${data.error.message}`);
			return;
		}

		// Correct way to access the response text
		console.log("Gemini says:", data.candidates[0].content.parts[0].text);
		const reply = data.candidates[0].content.parts[0].text

		// add the reply to history file
		insertItem(reply, "model")

		const replyHTML = marked(reply)
		console.log(replyHTML);


		return res.json({
			success: true,
			reply: replyHTML
		})
	} catch (err) {
		console.error("Fetch failed:", err);
		return res.json({
			success: false,
			message: "Fetch failed. Internal server error !!!",
			error: err
		})

	}


}


