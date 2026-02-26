const callGeminiFunction = async (payload) => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    // Function always returns JSON { text, isError }
    let json;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!json || typeof json.text !== 'string') {
        return {
            text: '❌ Error: AI server returned an invalid response.',
            isError: true,
        };
    }

    return json;
};

export const generateHealthResponse = async (prompt, persona = 'general') => {
    try {
        return await callGeminiFunction({ kind: 'health', prompt, persona });
    } catch (error) {
        return {
            text: `❌ Error: ${error?.message || 'Connection failed'}`,
            isError: true,
        };
    }
};

export const generateMealPlan = async (userProfile) => {
    try {
        const result = await callGeminiFunction({ kind: 'mealPlan', userProfile });
        if (result.isError) return null;

        // The function returns a JSON string; keep existing behavior by parsing.
        const cleaned = result.text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Meal Plan Error:', error);
        return null;
    }
};

export const generateAcademicResponse = async (prompt, subject = 'mathematics') => {
    try {
        return await callGeminiFunction({ kind: 'academic', prompt, subject });
    } catch (error) {
        return {
            text: `❌ Error: ${error?.message || 'Connection failed'}`,
            isError: true,
        };
    }
};
