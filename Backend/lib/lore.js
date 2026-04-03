import { raw } from 'express';
import fs from 'fs/promises'

export const saveLoreTool = {
    functionDeclarations: [ // Note: It should be function_declarations (plural)
        {
            name: "save_memory",
            description: "Saves an important fact or promise about the user.",
            parameters: {
                type: "object",
                properties: {
                    key: {
                        type: "string", // Must be lowercase
                        description: "The primary keyword (e.g., 'name', 'birthday').",
                    },
                    content: {
                        type: "string", // Must be lowercase
                        description: "The full detail of the memory."
                    }
                },
                required: ["key", "content"]
            }
        }
    ]
}

export const addEntryToLore = async (key, content) => {

    const rawData = await fs.readFile("ruka_lore.json", "utf-8");

    const lore = JSON.parse(rawData)
    console.log(lore.entries);

    lore.entries.push({
        id: Date.now().toString(),
        keys: [key.toLowerCase()],
        content: content
    })

    await fs.writeFile("ruka_lore.json", JSON.stringify(lore, null, 2))
    console.log("Ruka just remembered: ", key);

}