const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || "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";

console.log("🔑 OpenRouter API Key loaded:", API_KEY ? "✅ Yes" : "❌ No");
console.log("🔑 Key starts with:", API_KEY?.substring(0, 30) + "...");

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const healthFallbacks = {
    general: "💡 **Quick Health Tip**: Stay hydrated, get enough sleep (7-9 hours), and move your body regularly for better health!",
    drill_sergeant: "🪖 LISTEN UP RECRUIT! DRINK WATER! DO 10 PUSHUPS RIGHT NOW! NO EXCUSES! YOUR BODY IS YOUR RESPONSIBILITY!",
    empathetic: "🧘 Remember to breathe deeply and listen to your body. Take breaks when needed. Your well-being matters.",
    nutritionist: "🥗 Here's a general tip: Eat a balanced diet with proteins, carbs, and healthy fats. Focus on whole foods rather than processed items."
};

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
        console.log("📝 Prompt length:", prompt.length);

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        });

        console.log("📡 Response status:", response.status, response.statusText);

        if (!response.ok) {
            const text = await response.text();
            console.error("❌ API Error response (FULL):", text);
            console.error("❌ Error status:", response.status);
            return {
                text: healthFallbacks[persona] || healthFallbacks.general,
                isError: false
            };
        }

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "No response received";
        console.log("✅ Success! Response length:", text.length);

        return { text, isError: false };
    } catch (error) {
        console.error("❌ DeepSeek API Error:", error.message || error);
        console.error("📋 Error stack:", error.stack);
        return {
            text: healthFallbacks[persona] || healthFallbacks.general,
            isError: false
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
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1",
                messages: [
                    { role: "system", content: "You are a nutritionist. Generate meal plans in valid JSON format only." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) throw new Error("API Error");

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "";
        return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("Meal Plan Error:", error);
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

    const academicFallbacks = {
        mathematics: "## Quick Math Tip\n\n1. **Read carefully** - Understand what's being asked\n2. **Identify values** - List what you know\n3. **Choose method** - Pick the right approach\n4. **Solve step-by-step** - Show all work\n5. **Check answer** - Verify it makes sense",
        default: "## Study Tips\n\n1. **Read actively** - Take notes\n2. **Summarize** - In your own words\n3. **Practice** - Do exercises\n4. **Explain** - Teach someone else\n5. **Review** - Revisit regularly"
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
        console.log("📝 Prompt length:", prompt.length);

        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: prompt }
                ]
            })
        });

        console.log("📡 Response status:", response.status, response.statusText);

        if (!response.ok) {
            const text = await response.text();
            console.error("❌ API Error response (FULL):", text);
            console.error("❌ Error status:", response.status);
            return {
                text: academicFallbacks[subject] || academicFallbacks.default,
                isError: false
            };
        }

        const result = await response.json();
        const text = result.choices?.[0]?.message?.content || "No response received";
        console.log("✅ Success! Response length:", text.length);

        return { text, isError: false };
    } catch (error) {
        console.error("❌ DeepSeek API Academic Error:", error.message || error);
        console.error("📋 Error stack:", error.stack);
        return {
            text: academicFallbacks[subject] || academicFallbacks.default,
            isError: false
        };
    }
};
