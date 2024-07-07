let chatInteractions = []
// chatInteractions.push({role: "rep", message: "Hey there, how can i help you today?",})
// chatInteractions.push({role: "customer", message: "Hello, I need help with my order.",})

function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

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

const processInput = async () => {
    const chatInputDiv = document.getElementById('chat-input');
    localStorage.setItem("current-chat-input", JSON.stringify(chatInputDiv.value.trim())) // doing this to reduce lag when person sends message
    chatInputDiv.value = "";

    const chatInputTextValue = JSON.parse(localStorage.getItem("current-chat-input"))

    if (chatInputTextValue.length === 0 || chatInputTextValue === ''){
        alert("please enter a message!")
        return;
    }

    console.log("new message", chatInputTextValue)

    populateChatWindow({role:"rep", message: chatInputTextValue})

    console.log("making call to bot...")
    const chatInteractions = JSON.parse(localStorage.getItem("chat-interactions"))
    const customerProfile = JSON.parse(localStorage.getItem("customer-profile"))
    console.log("current interaction...", chatInteractions)

    const call = await fetch (`https://api-sender.theletterdigest.com/customer-service/get-message`, { 
        method: 'POST', 
        credentials: 'include', 
        body:JSON.stringify({ messages: chatInteractions, customerProfileId: customerProfile })
    })

    const { response, continueChat } = await call.json()
    populateChatWindow({role:"customer", message: response})
    console.log("model response", response, "continue chat", continueChat)
}

document.addEventListener("DOMContentLoaded", async () => {

    const chatInteractions = localStorage.getItem("chat-interactions")
    if (!chatInteractions || chatInteractions === null){
        localStorage.setItem("chat-interactions", JSON.stringify([]))
    }

    const customerProfile = localStorage.getItem("customer-profile")
    if (!customerProfile || customerProfile === null){
        localStorage.setItem("customer-profile", JSON.stringify(getRandomNumber()))
    }

    // checkSessionId()
    populateChatWindow()
    document.getElementById("send-message").addEventListener("click", async ()=> {
        await processInput();
    })

    // Get the input field
    var input = document.getElementById("chat-input");
    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("send-message").click();
    }});    

    document.getElementById("restart").addEventListener("click", ()=> {
        localStorage.setItem("chat-interactions", JSON.stringify([]));
        localStorage.removeItem("customer-profile");
        localStorage.removeItem("current-chat-input");
        alert("chat reset and new profile selected");
        location.reload();
    })

});
