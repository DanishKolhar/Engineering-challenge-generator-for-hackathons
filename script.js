const OPENROUTER_API_KEY = "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"; // Replace with your actual key

const generateBtn = document.getElementById("generateBtn");
const challengeBox = document.getElementById("challengeBox");
const loginPage = document.getElementById("loginPage");
const mainInterface = document.getElementById("mainInterface");
const greeting = document.getElementById("greeting");

function startChallenge() {
  const name = document.getElementById("nameInput").value.trim();
  const roll = document.getElementById("rollInput").value.trim();

  if (!name || !roll) {
    alert("Please enter both name and roll number.");
    return;
  }

  // Switch UI
  loginPage.style.display = "none";
  mainInterface.style.display = "flex";
  greeting.innerText = `Hello ${name} (${roll})!`;
}

generateBtn.addEventListener("click", async () => {
  challengeBox.style.display = "block";
  challengeBox.innerHTML = "Generating challenge...";
  generateBtn.disabled = true;

  const prompt = `
You are an expert hackathon mentor. Generate a unique, creative, and technically interesting engineering challenge idea suitable for a college hackathon.

Include:
- Title
- Short description
- Technologies that can be used
- Real-world relevance

Format your response clearly using bullet points or sections.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "google/gemini-pro",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content || "No challenge generated.";
    challengeBox.innerHTML = result
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")         // make **bold** work
    .replace(/^## (.*?)$/gm, "<h2>$1</h2>")                   // ## Headings
    .replace(/^### (.*?)$/gm, "<h3>$1</h3>")                  // ### Subheadings
    .replace(/^\* (.*?)$/gm, "<ul><li>$1</li></ul>")          // bullet points
    .replace(/<\/ul>\s*<ul>/g, "")                            // remove nested <ul>
    .replace(/\n/g, "<br>");                                  // line breaks
  


  } catch (error) {
    console.error(error);
    challengeBox.innerHTML = `<span style="color:red;">Error: ${error.message}</span>`;
  } finally {
    generateBtn.disabled = false;
  }
});
