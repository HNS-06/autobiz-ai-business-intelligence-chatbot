# AutoBiz AI - Business Intelligence Chatbot

## Overview
AutoBiz AI is an AI-powered business intelligence chatbot that provides real-time analysis of businesses, stocks, and market trends. The application offers strategic insights, forecasts, and interactive data visualization through a conversational interface with live financial data integration.

## Core Features

### AI Chatbot
- Interactive AI assistant that answers business-related questions
- Provides stock performance summaries and analysis using real-time data
- Offers strategic improvement suggestions and recommendations
- Supports both text and voice input/output for natural conversations
- Maintains conversation history during the session

### Real-Time Data Integration
- Backend connects to external financial APIs (Google Finance, Yahoo Finance) using HTTP outcalls
- Fetches and caches real-time stock prices and market data
- Retrieves business performance metrics and financial indicators
- Backend handles API rate limiting and error management
- Frontend polls backend APIs every 30-60 seconds for latest data updates

### Data Visualization
- Dynamic charts and graphs displaying live stock performance with smooth transitions
- Interactive dashboards showing real-time market trends
- Visual representation of business metrics and KPIs with live updates
- Animated data transitions when new information arrives
- Real-time updating of visual elements based on latest cached data

### Voice Interaction
- Voice input capability for asking questions
- Text-to-speech output for AI responses
- Natural conversation flow between user and AI assistant

## Backend Data Management
- Caches financial data from external APIs to optimize performance
- Implements rate limiting and error handling for API calls
- Stores temporary market data and business metrics
- Provides endpoints for frontend to retrieve cached financial information
- Handles HTTP outcalls to Yahoo Finance and Google Finance APIs

## User Interface
- Modern, professional design with smooth animations
- Clean dashboard layout with organized data sections showing live updates
- Responsive design for different screen sizes
- Professional color palette suitable for business applications
- Interactive elements with animated transitions for data updates
- Real-time visual feedback when new data is loaded

## Technical Architecture
- Backend handles all external API integration using HTTP outcalls
- Frontend uses React Query hooks for periodic data polling
- Real-time data processing and caching in the backend
- Live visualization updates with smooth animations in the frontend
- Voice recognition and synthesis integrated into the frontend
- Modular code structure to support future expansion into a full platform

## User Experience Flow
1. User opens the application and sees the main dashboard with live data
2. User can ask questions via text input or voice about current market conditions
3. AI processes the query using real-time cached financial data
4. Response is displayed with accompanying live charts/graphs and smooth animations
5. Data automatically updates every 30-60 seconds with visual transitions
6. User can continue the conversation with access to the latest market information
7. Voice responses provide hands-free interaction option with current data
