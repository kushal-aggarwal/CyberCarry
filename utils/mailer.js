const sendEmail = async (data) => {
    console.log("========== sendEmail() ==========");
    console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);
    console.log("Sending to:", data.to);
    console.log("Subject:", data.subject);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(data),
    });

    console.log("HTTP Status:", response.status);

    const text = await response.text();

    console.log("Response Body:");
    console.log(text);

    if (!response.ok) {
        throw new Error(text);
    }

    console.log("Email sent successfully.");

    return text;
};

module.exports = sendEmail;