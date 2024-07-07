let chatInteractions = []
// chatInteractions.push({role: "rep", message: "Hey there, how can i help you today?",})
// chatInteractions.push({role: "customer", message: "Hello, I need help with my order.",})


const checkSessionId = () =>{
    // check if session exists.
    let currentSessionId = localStorage.getItem("session-id")
    if (!currentSessionId || currentSessionId === null) {
        currentSessionId = JSON.stringify(crypto.randomUUID())
        localStorage.setItem("session-id", currentSessionId)        
        console.log("new session id created")
    }
    const sessionIdDiv = document.getElementById("session-id")
    sessionIdDiv.innerHTML = `Current Session Id: ${JSON.parse(currentSessionId)}`
}

const populateChatWindow = (message={}) => {

    const chatInteractions = JSON.parse(localStorage.getItem("chat-interactions"))

    if (Object.keys(message).length !== 0){
        chatInteractions.push(message)
        localStorage.setItem("chat-interactions", JSON.stringify(chatInteractions))
    }

    console.log("current messages", chatInteractions)

    const chatWindow = document.getElementById("chat")
    const currentMsgInDiv = document.getElementsByClassName("message")
    Array.from(currentMsgInDiv).forEach((message)=>{
        message.remove()
    })

    chatInteractions.forEach((message)=>{
        const messageDiv = document.createElement("div")
        messageDiv.setAttribute("class", `message ${message.role === "customer" ? "customer":"rep"}`)
        messageDiv.innerHTML = message.message
        chatWindow.appendChild(messageDiv)
    })    

}

document.addEventListener("DOMContentLoaded", async () => {

    const chatInteractions = localStorage.getItem("chat-interactions")
    if (!chatInteractions || chatInteractions === null){
        localStorage.setItem("chat-interactions", JSON.stringify([]))
    }

    checkSessionId()
    populateChatWindow()
    document.getElementById("send-message").addEventListener("click", async ()=> {

        const chatInput = document.getElementById('chat-input');
        const chatInputTextValue = chatInput.value.trim()

        if (chatInputTextValue.length === 0 || chatInputTextValue === ''){
            alert("please enter a message!")
            return;
        }

        console.log("new message", chatInputTextValue)

        populateChatWindow({role:"rep", message: chatInputTextValue})

        console.log("making call to bot...")
        const chatInteractions = JSON.parse(localStorage.getItem("chat-interactions"))
        console.log("current interaction...", chatInteractions)

        const call = await fetch (`https://api-sender.theletterdigest.com/customer-service/get-message`, { 
            method: 'POST', 
            credentials: 'include', 
            body:JSON.stringify({ messages: chatInteractions, customerProfileId: 3 })
        })

        const { response, continueChat } = await call.json()
        populateChatWindow({role:"customer", message: response})
        console.log("model response", response, "continue chat", continueChat)

        chatInput.value = "";
    })

    document.getElementById("restart").addEventListener("click", ()=> {
        localStorage.setItem("chat-interactions", JSON.stringify([]))
        location.reload();
    })

});
