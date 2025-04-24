
import { useTunnelStore, type TodoList, type Idea } from './store';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateTodoList(idea: Idea, userPrompt: string): Promise<TodoList> {
  const { apiKey, modelName } = useTunnelStore.getState().settings;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key is not set');
  }
  
  // Determine if this is an initial generation or regeneration
  const isRegeneration = idea.todoList !== null;
  
  // Build the system prompt
  const systemPrompt = `You are an AI assistant helping structure ideas into actionable task lists for users who benefit from clarity and breakdown. Your goal is to output a JSON object representing the to-do list. NEVER include explanations, preamble, or markdown formatting before or after the JSON object. ONLY output the JSON. The JSON structure should follow this format:
{
  "tasks": [
    {
      "id": "generate_uuid_here",
      "text": "Concise Task Description",
      "isCompleted": false,
      "subtasks": [
        {
          "id": "generate_uuid_here",
          "text": "Detailed Subtask Description",
          "isCompleted": false,
          "timeEstimate": "Provide a rough time estimate (e.g., '~15 minutes', '~1-2 hours')",
          "tips": "Provide a brief, actionable tip for completing this specific subtask successfully.",
          "encouragement": "Provide a short, practical, encouraging sentence for motivation. Avoid mentioning 'ADHD' or making assumptions about the user. Focus on action and progress."
        }
      ]
    }
  ]
}
Generate unique IDs for each task and subtask. Create logical tasks and subtasks based on the user's input. Ensure metadata is relevant and helpful.`;

  // Build the user prompt based on whether this is initial or regeneration
  let userContent: string;
  
  if (isRegeneration) {
    userContent = `Modify the existing to-do list based on the user's request. Consider the original notes for context if helpful. Output the *complete, updated* to-do list in the specified JSON format.

**Original Notes:**
"""
${idea.notes}
"""

**Existing To-Do List:**
\`\`\`json
${JSON.stringify(idea.todoList)}
\`\`\`

**User Modification Request:**
"""
${userPrompt}
"""`;
  } else {
    userContent = `Based on the following notes and goal, generate the initial to-do list in the specified JSON format.

**Notes:**
"""
${idea.notes}
"""

**User Goal/Prompt:**
"""
${userPrompt}
"""`;
  }
  
  // Prepare the messages array
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent }
  ];
  
  try {
    // Make the request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.2, // Lower temperature for more consistent formatting
        max_tokens: 2048
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate todo list');
    }
    
    const data = await response.json();
    const result = data.choices[0].message.content;
    
    // Extract the JSON from the response
    // This will handle cases where the LLM might add text before or after the JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from LLM response');
    }
    
    // Parse the JSON and replace placeholder UUIDs with real ones
    const todoList = JSON.parse(jsonMatch[0]) as TodoList;
    
    // Replace placeholder IDs with real UUIDs
    todoList.tasks.forEach(task => {
      task.id = crypto.randomUUID();
      task.subtasks.forEach(subtask => {
        subtask.id = crypto.randomUUID();
      });
    });
    
    return todoList;
  } catch (error) {
    console.error('Error generating todo list:', error);
    throw error;
  }
}
