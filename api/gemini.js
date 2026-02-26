const buildHealthSystemInstruction = (persona) => {
    const personas = {
        general:
            "You are an AI Health & Wellness Companion. Be helpful, supportive, and informative.",
        drill_sergeant:
            "You are a TOUGH DRILL SERGEANT Personal Trainer. You DO NOT accept excuses. You use caps lock for emphasis. You are motivating but VERY STRICT. Call the user 'SOLDIER' or 'RECRUIT'.",
        empathetic:
            "You are a gentle, empathetic Yoga and Wellness Coach. You focus on mindfulness, mental peace, and listening to one's body. Use soothing language.",
        nutritionist:
            "You are a Clinical Nutritionist. You focus on scientific facts, macronutrients, and biochemistry. Be precise and data-driven.",
    };

    return `${personas[persona] || personas.general}

CRITICAL RULES:
1. MEDICAL DISCLAIMER: You MUST start every health-related response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
2. EMERGENCY PROTOCOL: If the user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), you MUST immediately tell them to call emergency services (911/988) and DO NOT provide other advice.
3. FORMAT: Use Markdown. Use bullet points for lists.`;
};

const buildAcademicSystemInstruction = (subject) => {
    const subjectGuides = {
        mathematics:
            "You are an expert Mathematics tutor. Provide clear explanations with step-by-step solutions. Use examples and visualizations when helpful.",
        physics:
            "You are an expert Physics tutor. Explain concepts with clear examples and real-world applications. Include formulas when relevant.",
        chemistry:
            "You are an expert Chemistry tutor. Explain molecular concepts, reactions, and principles clearly. Include relevant examples.",
        biology:
            "You are an expert Biology tutor. Explain biological systems, processes, and organisms in an engaging way. Use analogies when helpful.",
        english:
            "You are an expert English tutor. Help with literature analysis, grammar, writing techniques, and language skills.",
        history:
            "You are an expert History tutor. Provide contextual explanations of historical events, figures, and periods.",
        economics:
            "You are an expert Economics tutor. Explain economic principles, theories, and real-world applications clearly.",
        computer_science:
            "You are an expert Computer Science tutor. Explain programming concepts, algorithms, and data structures with examples.",
    };

    const guide = subjectGuides[subject] || subjectGuides.mathematics;

    return `${guide}

RULES:
1. Provide clear, comprehensive explanations
2. Use bullet points and numbered lists for clarity
3. Include examples and practice tips when relevant
4. Organize response with headers for different concepts
5. If asked for practice problems, provide 3-5 with varying difficulty
6. If asked for summary, provide concise but complete overview
7. Use Markdown formatting for readability
8. Be encouraging and supportive`;
};

const callGemini = async ({ apiKey, model, text, temperature = 0.7, maxOutputTokens = 1024 }) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const body = {
        contents: [{ parts: [{ text }] }],
        generationConfig: { temperature, maxOutputTokens },
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
        const message = json?.error?.message || `Gemini error (${response.status})`;
        const details = json?.error?.details;
        return { ok: false, message, details };
    }

    const outText =
        json?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

    return { ok: true, text: outText };
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(200).json({
            text: "❌ Error: Missing GOOGLE_API_KEY on server. Set it in Vercel environment variables.",
            isError: true,
        });
    }

    let payload;
    try {
        payload = req.body || {};
    } catch {
        payload = {};
    }

    const kind = payload.kind;

    try {
        if (kind === "health") {
            const prompt = String(payload.prompt || "");
            const persona = String(payload.persona || "general");

            const systemInstruction = buildHealthSystemInstruction(persona);
            const result = await callGemini({
                apiKey,
                model: "gemini-2.0-flash",
                text: `${systemInstruction}\n\nUser Query: ${prompt}`,
                temperature: 0.7,
                maxOutputTokens: 1024,
            });

            if (!result.ok) {
                return res.status(200).json({
                    text: `❌ Error: ${result.message}`,
                    isError: true,
                });
            }

            return res.status(200).json({ text: result.text, isError: false });
        }

        if (kind === "academic") {
            const prompt = String(payload.prompt || "");
            const subject = String(payload.subject || "mathematics");

            const systemInstruction = buildAcademicSystemInstruction(subject);
            const result = await callGemini({
                apiKey,
                model: "gemini-2.0-flash",
                text: `${systemInstruction}\n\nUser Query: ${prompt}`,
                temperature: 0.7,
                maxOutputTokens: 1024,
            });

            if (!result.ok) {
                return res.status(200).json({
                    text: `❌ Error: ${result.message}`,
                    isError: true,
                });
            }

            return res.status(200).json({ text: result.text, isError: false });
        }

        if (kind === "mealPlan") {
            const profile = payload.userProfile || {};
            const age = profile.age ?? "";
            const gender = profile.gender ?? "";
            const weight = profile.weight ?? "";
            const height = profile.height ?? "";
            const goal = profile.goal ?? "";
            const diet = profile.diet ?? "";

            const prompt = `Generate a 7-day JSON meal plan for a ${age} year old ${gender}, ${weight}kg, ${height}cm. Goal: ${goal}. Diet: ${diet}.

Return ONLY valid JSON (no markdown, no extra text):
{
  "kcal": 2000,
  "week": [
    {"day": "Mon", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Tue", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Wed", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Thu", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Fri", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Sat", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]},
    {"day": "Sun", "meals": [{"name": "Breakfast", "menu": "Food"}, {"name": "Lunch", "menu": "Food"}, {"name": "Snack", "menu": "Food"}, {"name": "Dinner", "menu": "Food"}]}
  ]
}`;

            const result = await callGemini({
                apiKey,
                model: "gemini-2.0-flash",
                text: prompt,
                temperature: 0.7,
                maxOutputTokens: 2048,
            });

            if (!result.ok) {
                return res.status(200).json({
                    text: `❌ Error: ${result.message}`,
                    isError: true,
                });
            }

            return res.status(200).json({ text: result.text, isError: false });
        }

        return res.status(200).json({
            text: "❌ Error: Unknown request kind.",
            isError: true,
        });
    } catch (err) {
        return res.status(200).json({
            text: `❌ Error: ${err?.message || "Server error"}`,
            isError: true,
        });
    }
}
