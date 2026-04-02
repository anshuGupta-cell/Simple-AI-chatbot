import fs, { writeFile } from 'fs/promises'

export const insertItem = async (text, type) => {
const chatFile = process.env.CHAT_FILE

    try {
        // 1. Read the file
        let rawData = await fs.readFile(chatFile, "utf-8");

        // 2. Parse the string into a JSON object
        let data = JSON.parse(rawData);

        // 3. Push the new message (Ruka or User)
        data.contents.push({
            role: type,
            parts: [{ text: text }]
        });

        // 4. Save it back to the file (formatted with 2 spaces for readability)
        await fs.writeFile(chatFile, JSON.stringify(data, null, 2));

        console.log("Chat history updated!");
        return data
    } catch (error) {
        console.error("Error updating chat:", error);
    }

}