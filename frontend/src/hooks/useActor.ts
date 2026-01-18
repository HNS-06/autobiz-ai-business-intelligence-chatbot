
import { useState } from 'react';
import { StockData, MarketTrend, BusinessMetric, KPI } from '../backend';

// Mock Actor
const mockActor = {
    getYahooAPIInbox: async () => JSON.stringify({ chart: { result: [] } }),
    submitStockData: async (data: StockData) => { },
    getAllStockData: async () => [],
    getAllMarketTrendsByPerformance: async () => [],
    submitMarketTrend: async (data: MarketTrend) => { },
    getAllBusinessMetricsByName: async () => [],
    submitBusinessMetric: async (data: BusinessMetric) => { },
    getAllKPIsByKey: async () => [],
    submitKPI: async (data: KPI) => { },
    processAIRequest: async (message: string) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            return { text: "Gemini API key is missing. Please add VITE_GEMINI_API_KEY to .env.local" };
        }

        try {
            // Step 1: Dynamically fetch available models
            let targetModel = 'models/gemini-1.5-flash'; // Default fallback

            try {
                const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
                if (modelsResponse.ok) {
                    const modelsData = await modelsResponse.json();
                    // Find the first model that supports generateContent and ideally is free/stable
                    const availableModel = modelsData.models?.find((m: any) =>
                        m.supportedGenerationMethods?.includes('generateContent') &&
                        (m.name.includes('flash') || m.name.includes('pro'))
                    );

                    if (availableModel) {
                        targetModel = availableModel.name; // name includes 'models/' prefix already usually
                        console.log("Selected Gemini Model:", targetModel);
                    }
                }
            } catch (e) {
                console.warn("Failed to list models, using fallback:", e);
            }

            // Ensure model name format is correct (must not double 'models/')
            const modelName = targetModel.startsWith('models/') ? targetModel.split('models/')[1] : targetModel;

            // Step 2: Generate Content
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: message }] }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Gemini API Error (${modelName}):`, response.status, errorData);

                if (response.status === 429) {
                    return { text: "⚠️ Gemini API Quota Exceeded. Please check your billing. (Switching to Demo Mode)" };
                }

                if (errorData.error && errorData.error.message) {
                    return { text: `⚠️ API Error: ${errorData.error.message} (Model: ${modelName})` };
                }

                throw new Error(`Failed to fetch from Gemini (${modelName}): ${response.status}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return { text: data.candidates[0].content.parts[0].text };
            }

            return { text: "I couldn't generate a response. Please try again." };

        } catch (error: any) {
            console.error('All AI attempts failed:', error);
            return { text: `⚠️ Unable to connect to Gemini API. Please check your API key and enable 'Generative Language API'. (Demo Mode Active)` };
        }
    }
};

export function useActor() {
    return {
        actor: mockActor,
        isFetching: false
    };
}
