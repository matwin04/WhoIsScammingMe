async function checkAccount() {
    const username = document.getElementById("username").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!username) {
        resultDiv.innerHTML = "Please enter a username.";
        return;
    }

    const profileUrl = `https://onlyfans.com/${username}`;

    try {
        const response = await fetch(profileUrl, { method: "GET" });

        if (!response.ok) {
            throw new Error("Profile not found or request blocked.");
        }

        const text = await response.text();
        const match = text.match(/"createdAt":"(.*?)"/);

        if (match) {
            const creationDate = new Date(match[1]).toDateString();
            resultDiv.innerHTML = `Account created on: ${creationDate}`;
        } else {
            resultDiv.innerHTML = "Could not determine account creation date.";
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
}