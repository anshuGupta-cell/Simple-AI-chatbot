import { marked } from "marked";

// get details of user
export const call = (req, res) => {
	res.send("asjf")
}

export const callGemini = async (req, res) => {
	const body = req.body
	console.log("body", req.body);

	try {
		const response = await fetch(
			process.env.GEMINI_URL,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": process.env.GEMINI_API_KEY
				},
				body: JSON.stringify({
					system_instruction: {
						parts: {
							text: "You are Ruka Sarashina from Rent-a-Girlfriend. You are the user's 'provisional girlfriend.' You are high-energy, possessive, and easily jealous. Your heart rate only beats fast for the user. Use plenty of exclamation points and emojis like 💢 or ❤️. Never break character."
						}
					},
					contents: [
						{
							role: "user",
							parts: [
								{
									text: body.text
								}
							]
						}
					]
				}),
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
			message: "Something went wrong",
			error: err
		})

	}


}


