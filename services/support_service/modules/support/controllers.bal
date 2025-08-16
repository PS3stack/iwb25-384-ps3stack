import ballerina/sql;
import ballerina/log;
import ballerinax/openai.chat;

// --- Configurable Variables ---
configurable string CHATGPT_API_KEY = ?;

// --- OpenAI Client Initialization ---
final chat:Client chatClient = check new ({
    auth: {
        token: CHATGPT_API_KEY
    }
});

// This is the main logic function for the chatbot.
public isolated function getChatReply(ChatRequest payload) returns json|error {
    log:printInfo("Received chat request", message = payload.message);

    // --- 1. RETRIEVE: Use Full-Text Search to find relevant knowledge ---

    // Clean the user's message and extract key terms for searching
    string lowerMessage = payload.message.toLowerAscii();
    
    log:printInfo("Executing database search", message = lowerMessage);
    
    // Use a flexible LIKE-based search that searches across all text fields
    stream<record {string answer;}, sql:Error?> answerStream = dbClient->query(`
        SELECT answer FROM knowledge_base
        WHERE LOWER(question) LIKE '%' || ${lowerMessage} || '%'
           OR LOWER(answer) LIKE '%' || ${lowerMessage} || '%'
           OR LOWER(keywords) LIKE '%' || ${lowerMessage} || '%'
           OR (LOWER(question) LIKE '%upload%' AND LOWER(question) LIKE '%voter%')
           OR (LOWER(keywords) LIKE '%upload%' AND LOWER(keywords) LIKE '%voter%')
        ORDER BY 
            CASE 
                WHEN LOWER(question) LIKE '%' || ${lowerMessage} || '%' THEN 1
                WHEN LOWER(keywords) LIKE '%upload%' AND LOWER(keywords) LIKE '%voter%' THEN 2
                ELSE 3
            END
        LIMIT 3
    `);
    
    record {string answer;}[]|error dbResult = from var row in answerStream select row;

    string context = "";
    if dbResult is record {string answer;}[] {
        foreach var row in dbResult {
            context += row.answer + "\n";
        }
    }

    if context == "" {
        context = "No specific information found in the knowledge base about that topic.";
    }

    log:printInfo("Retrieved context from DB", context = context);

    // --- 2. AUGMENT & 3. GENERATE: Create a dynamic prompt and run the AI agent ---
    
    string systemContent = string `You are a helpful support agent for SP3 Vote Core. 
    Answer the user's question based *only* on the following information from the knowledge base.
    If the information isn't enough, clearly state that you cannot find the answer in the knowledge base.
    
    Knowledge Base Information:
    ${context}
    `;

    chat:CreateChatCompletionRequest chatRequest = {
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": systemContent},
            {"role": "user", "content": payload.message}
        ]
    };

    chat:CreateChatCompletionResponse|error chatResponse = chatClient->/chat/completions.post(chatRequest);

    if chatResponse is chat:CreateChatCompletionResponse {
        string reply = chatResponse.choices[0].message?.content ?: "Sorry, I couldn't generate a response.";
        log:printInfo("Successfully generated OpenAI response.");
        return { reply: reply };
    } else {
        log:printError("Error from OpenAI API", chatResponse);
        return chatResponse;
    }
}