const { StateGraph, MessagesAnnotation } = require('@langchain/langgraph')
const {ChatGoogleGenerativeAI} = require('@langchain/google-genei')
const tools = require('./agent/tools')
const { ToolMessage} = require('@langchain/core/messages')

const model = new ChatGoogleGenerativeAI({
    temperature: 0.5,
    model: "gemini-2.0-flash",
    
})

const graph = new StateGraph(MessagesAnnotation)
    .addNode("tools", async (state, config) => {
        const lastMessage = state.messages[state.messages.length - 1];
        
        const toolsCall = lastMessage.tool_calls

        const toolCallResults = await Promise.all(toolsCall.map(async (call) => {

            const tool = tools[call.name];
            if (!tool) {
                throw new Error(`Tool ${call.name} not found`);
            }

            const toolInput = call.args

            const toolResult = await tool.invoke({ ...toolInput, token: config.metadata.token })
            
            return new ToolMessage({ content:toolResult, toolName:call.name})
            
        }))
        state.messages.push(...toolCallResults);
        return state;
})