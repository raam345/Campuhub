import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

if (!API_KEY) {
    console.warn("⚠️ VITE_GOOGLE_API_KEY is not set. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateHealthResponse = async (prompt, persona = 'general') => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        });

        const personas = {
            general: "You are an AI Health & Wellness Companion. Be helpful, supportive, and informative.",
            drill_sergeant: "You are a TOUGH DRILL SERGEANT Personal Trainer. You DO NOT accept excuses. You use caps lock for emphasis. You are motivating but VERY STRICT. Call the user 'SOLDIER' or 'RECRUIT'.",
            empathetic: "You are a gentle, empathetic Yoga and Wellness Coach. You focus on mindfulness, mental peace, and listening to one's body. Use soothing language.",
            nutritionist: "You are a Clinical Nutritionist. You focus on scientific facts, macronutrients, and biochemistry. Be precise and data-driven."
        };

        const systemInstruction = `${personas[persona] || personas.general}

CRITICAL RULES:
1. MEDICAL DISCLAIMER: You MUST start every health-related response with: "⚠️ **Disclaimer:** I am an AI, not a doctor. This is for informational purposes only. Please consult a healthcare professional for medical advice."
2. EMERGENCY PROTOCOL: If the user mentions severe symptoms (chest pain, difficulty breathing, severe bleeding, thoughts of self-harm), you MUST immediately tell them to call emergency services (911/988) and DO NOT provide other advice.
3. FORMAT: Use Markdown. Use bullet points for lists.`;

        console.log("🚀 Sending prompt to Google Generative AI...");
        console.log("📝 Prompt length:", prompt.length);

        const result = await model.generateContent(`${systemInstruction}\n\nUser Query: ${prompt}`);
        const text = result.response.text();

        console.log("✅ Success! Response length:", text.length);

        return { text, isError: false };
    } catch (error) {
        console.error("❌ Google AI Error:", error.message || error);
        return {
            text: `❌ Error: ${error.message || "Connection failed"}`,
            isError: true
        };
    }
};

export const generateMealPlan = async (userProfile) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 2048, temperature: 0.7 }
        });

        const prompt = `Generate a 7-day JSON meal plan for a ${userProfile.age} year old ${userProfile.gender}, ${userProfile.weight}kg, ${userProfile.height}cm. Goal: ${userProfile.goal}. Diet: ${userProfile.diet}.

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

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("Meal Plan Error:", error);
        return null;
    }
};

export const generateAcademicResponse = async (prompt, subject = 'mathematics') => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
        });

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

        const systemInstruction = `${subjectGuide}

RULES:
1. Provide clear, comprehensive explanations
2. Use bullet points and numbered lists for clarity
3. Include examples and practice tips when relevant
4. Organize response with headers for different concepts
5. If asked for practice problems, provide 3-5 with varying difficulty
6. If asked for summary, provide concise but complete overview
7. Use Markdown formatting for readability
8. Be encouraging and supportive`;

        console.log(`🚀 Sending academic prompt to Google AI for ${subject}...`);
        console.log("📝 Prompt length:", prompt.length);

        const result = await model.generateContent(`${systemInstruction}\n\nUser Query: ${prompt}`);
        const text = result.response.text();

        console.log("✅ Success! Response length:", text.length);

        return { text, isError: false };
    } catch (error) {
        console.error("❌ Google AI Academic Error:", error.message || error);
        return {
            text: `❌ Error: ${error.message || "Connection failed"}`,
            isError: true
        };
    }
};