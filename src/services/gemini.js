const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "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";

console.log("OpenRouter API Key loaded:", API_KEY ? "✅ Yes" : "❌ No");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const generateHealthResponse = async (prompt, persona = 'general') => {
    if (!API_KEY) {
        return {
            text: "I'm sorry, but I can't connect to my AI brain right now. Please check if the API Key is configured.",
            isError: true
        };
    }

    const personas = {
        general: "You are an AI Health & Wellness Companion. Be helpful, supportive, and informative.",
        drill_sergeant: "You are a TOUGH DRILL SERGEANT Personal Trainer. You DO NOT accept excuses. You use caps lock for emphasis. You are motivating but VERY STRICT. Call the user 'SOLDIER' or 'RECRUIT'.",
        empathetic: "You are a gentle, empathetic Yoga and Wellness Coach. You focus on mindfulness, mental peace, and listening to one's body. Use soothing language.",
        nutritionist: "You are a Clinical Nutritionist. You focus on scientific facts, macronutrients, and biochemistry. Be precise and data-driven."
    };

    const personaInstruction = personas[persona] || personas.general;

    try {
        const systemPrompt = `${personaInstruction}

CRITICAL RULES:
1. MEDICAL DISCLAIMER: You MUST start every health-related response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
2. EMERGENCY PROTOCOL: If the user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), you MUST immediately tell them to call emergency services (911/988) and DO NOT provide other advice.
3. FORMAT: Use Markdown. Use bullet points for lists.

User Query: ${prompt}`;

        console.log("🚀 Sending prompt to OpenRouter (DeepSeek R1)...");

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": window.location.origin
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ OpenRouter API Error:", errorData);
            return {
                text: `API Error: ${errorData.error?.message || 'Unknown error'}`,
                isError: true
            };
        }

        const result = await response.json();
        console.log("✅ OpenRouter result received");

        const text = result.choices?.[0]?.message?.content || "No response received";
        console.log("Generated text:", text.substring(0, 100) + "...");

        return {
            text: text,
            isError: false
        };
    } catch (error) {
        console.error("❌ DeepSeek API Error:", error.message || error);
        return {
            text: "I'm having trouble thinking right now. Please try again later.",
            isError: true
        };
    }
};

export const generateMealPlan = async (userProfile) => {
    if (!API_KEY) return null;

    try {
        const prompt = `Generate a 7-day JSON meal plan for a ${userProfile.age} year old ${userProfile.gender}, ${userProfile.weight}kg, ${userProfile.height}cm. Goal: ${userProfile.goal}. Diet: ${userProfile.diet}.

Return ONLY valid JSON (no markdown):
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

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": window.location.origin
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [
                    {
                        role: "system",
                        content: "You are a nutritionist. Generate meal plans in valid JSON format only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) throw new Error("API Error");

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "";
        return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("Meal Plan Generation Error:", error);
        return null;
    }
};

export const generateAcademicResponse = async (prompt, subject = 'mathematics') => {
    if (!API_KEY) {
        return {
            text: "I'm sorry, but I can't connect to my AI brain right now. Please check if the API Key is configured.",
            isError: true
        };
    }

    const subjectGuides = {
        mathematics: "You are an expert Mathematics tutor. Provide clear explanations with step-by-step solutions. Use examples and visualizations when helpful.",
        physics: "You are an expert Physics tutor. Explain concepts with clear examples and real-world applications. Include formulas when relevant.",
        chemistry: "You are an expert Chemistry tutor. Explain molecular concepts, reactions, and principles clearly. Include relevant examples.",
        biology: "You are an expert Biology tutor. Explain biological systems, processes, and organisms in an engaging way. Use analogies when helpful.",
        english: "You are an expert English tutor. Help with literature analysis, grammar, writing techniques, and language skills.",
        history: "You are an expert History tutor. Provide contextual explanations of historical events, figures, and periods.",
        economics: "You are an expert Economics tutor. Explain economic principles, theories, and real-world applications clearly.",
        computer_science: "You are an expert Computer Science tutor. Explain programming concepts, algorithms, and data structures with examples."
    };

    const subjectGuide = subjectGuides[subject] || subjectGuides.mathematics;

    try {
        const systemPrompt = `${subjectGuide}

RULES:
1. Provide clear, comprehensive explanations
2. Use bullet points and numbered lists for clarity
3. Include examples and practice tips when relevant
4. Organize response with headers for different concepts
5. If asked for practice problems, provide 3-5 with varying difficulty
6. If asked for summary, provide concise but complete overview
7. Use Markdown formatting for readability
8. Be encouraging and supportive

User Query: ${prompt}`;

        console.log(`🚀 Sending academic prompt to OpenRouter (DeepSeek R1) for ${subject}...`);

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": window.location.origin
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ OpenRouter API Error:", errorData);
            return {
                text: `API Error: ${errorData.error?.message || 'Unknown error'}`,
                isError: true
            };
        }

        const result = await response.json();
        console.log("✅ Academic response received");

        const text = result.choices?.[0]?.message?.content || "No response received";

        return {
            text: text,
            isError: false
        };
    } catch (error) {
        console.error("❌ DeepSeek API Academic Error:", error.message || error);
        return {
            text: "I'm having trouble generating a response right now. Please try again with a different question.",
            isError: true
        };
    }
};
