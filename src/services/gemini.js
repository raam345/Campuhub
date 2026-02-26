import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || "AIzaSyDV-xpKfyHFXRHfCRAe5H0hFcFqWnwQgfQ";

console.log("Google Generative AI loaded with API key:", GOOGLE_API_KEY.substring(0, 20) + "...");

let genAI = null;

const initializeAI = () => {
    if (!genAI) {
        try {
            genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
            console.log("✅ Google AI initialized successfully");
        } catch (e) {
            console.error("❌ Failed to initialize Google AI:", e);
            genAI = null;
        }
    }
    return genAI;
};

export const generateHealthResponse = async (prompt, persona = 'general') => {
    if (!GOOGLE_API_KEY) {
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
        // Initialize AI on every call to ensure it's ready
        const ai = initializeAI();

        if (!ai) {
            throw new Error("Google AI failed to initialize");
        }

        const fullPrompt = `${personaInstruction}

CRITICAL RULES:
1. MEDICAL DISCLAIMER: Start every health response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
2. EMERGENCY PROTOCOL: If user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), tell them to call emergency services (911/988).
3. FORMAT: Use Markdown with bullet points for lists.

User Query: ${prompt}`;

        console.log("🚀 Sending prompt to Google Generative AI...");

        const model = ai.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        console.log("✅ Generated text:", text.substring(0, 100) + "...");

        return {
            text: text,
            isError: false
        };
    } catch (error) {
        console.error("❌ Google AI Error:", error.message || error);

        // Provide helpful fallback response based on persona
        const fallbackResponses = {
            general: "💡 **Quick Health Tip**: Stay hydrated, get enough sleep (7-9 hours), and move your body regularly for better health!",
            drill_sergeant: "🪖 LISTEN UP RECRUIT! DRINK WATER! DO 10 PUSHUPS RIGHT NOW! NO EXCUSES! YOUR BODY IS YOUR RESPONSIBILITY!",
            empathetic: "🧘 Remember to breathe deeply and listen to your body. Take breaks when needed. Your well-being matters.",
            nutritionist: "🥗 Here's a general tip: Eat a balanced diet with proteins, carbs, and healthy fats. Focus on whole foods rather than processed items."
        };

        return {
            text: fallbackResponses[persona] || fallbackResponses.general,
            isError: false
        };
    }
};

export const generateMealPlan = async (userProfile) => {
    if (!GOOGLE_API_KEY) return null;

    try {
        // Initialize AI before use
        const ai = initializeAI();
        if (!ai) throw new Error("Google AI not initialized");

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

        const model = ai.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    } catch (error) {
        console.error("Meal Plan Generation Error:", error);
        return null;
    }
};

export const generateAcademicResponse = async (prompt, subject = 'mathematics') => {
    if (!GOOGLE_API_KEY) {
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
        // Initialize AI before use
        const ai = initializeAI();
        if (!ai) throw new Error("Google AI not initialized");

        const fullPrompt = `${subjectGuide}

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

        console.log(`🚀 Sending academic prompt to Google AI for ${subject}...`);

        const model = ai.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        console.log("✅ Academic response received");

        return {
            text: text,
            isError: false
        };
    } catch (error) {
        console.error("❌ Google AI Academic Error:", error.message || error);

        // Provide fallback educational content
        const fallbackContent = {
            mathematics: "## Quick Math Tip\n\n### Breaking Down Problems\n1. **Read carefully** - Understand what the problem is asking\n2. **Identify known values** - List what information you have\n3. **Choose a method** - Pick the right formula or approach\n4. **Solve step-by-step** - Show all your work\n5. **Check your answer** - Verify it makes sense\n\n💡 **Practice Tip**: Solve problems daily, not just before exams!",
            physics: "## Quick Physics Tip\n\n### Understanding Concepts\n1. **Relate to real world** - Connect theories to everyday examples\n2. **Use diagrams** - Draw force diagrams, free body diagrams\n3. **Remember key equations** - F=ma, E=mc², P=F/A\n4. **Practice problems** - Application is key\n5. **Think about why** - Not just how, but why things work\n\n🔬 **Study Tip**: Watch videos demonstrating the concepts!",
            default: "## Study Tips\n\n### Effective Learning\n1. **Read actively** - Take notes while reading\n2. **Summarize** - Write summaries in your own words\n3. **Practice** - Do exercises and problems\n4. **Explain** - Teach concepts to others\n5. **Review** - Revisit material regularly\n\n📚 **Remember**: Consistency beats cramming!\nTry breaking topics into smaller parts and mastering them one by one."
        };

        return {
            text: fallbackContent[subject] || fallbackContent.default,
            isError: false
        };
    }
};
