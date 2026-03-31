
console.log(process.env.GEMINI_API_KEY);

const callGemini = async () => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Hello, how are you?" }]
            }
          ]
        }),
      }
    );

    const data = await res.json();

    // Check if the API returned an error object
    if (data.error) {
      console.error(`Error ${data.error.code}: ${data.error.message}`);
      return;
    }

    // Correct way to access the response text
    console.log("Gemini says:", data.candidates[0].content.parts[0].text);
    
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

callGemini();
const userText = prompt()
 console.log(userText)
