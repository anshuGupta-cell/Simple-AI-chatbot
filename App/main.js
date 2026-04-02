
const url = 'http://localhost:3000'

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = userInput.value.trim();

    callGemini(text)
});

async function callGemini(text) {
    console.log(text);
    const body = JSON.stringify({
        text: text
    })
    if (!text) {
        return
    }
    if (text) {
        addMessage(text, 'sent');
        userInput.value = '';
    }

    // 1. Create and show the loading indicator
    const loadingId = 'loading-' + Date.now();
    showLoading(loadingId);

    try {

        const res = await fetch(`${url}/chat/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body,
        });

        const data = await res.json();

        // Check if the API returned an error object
        // if (data.error) {
        //     console.error(`Error ${data.error.code}: ${data.error.message}`);
        //     // Remove loading indicator
        //     document.getElementById(loadingId).remove();

        //     // add reply of ai 
        //     addMessage("Some error occured", 'received');
        //     return;
        // }

        // Correct way to access the response text
        console.log("Gemini says:", data);

        // Remove loading indicator
        document.getElementById(loadingId).remove();

        // add reply of ai 
        if (data.reply) {
            addMessage(data.reply, 'received');
        }

        if (!data.success){
            addMessage(data.message, 'received')
        }

    } catch (error) {
        console.error("Fetch failed:", error);

        // Remove loading indicator
        document.getElementById(loadingId).remove();

        // add reply of ai 
        addMessage("Some error occured", 'received');

    }
}

async function name() {
    const res = await fetch(url + '/chat/')
    console.log(await res.text());

}
name()