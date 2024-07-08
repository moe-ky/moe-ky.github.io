document.addEventListener("DOMContentLoaded", async () => {

    document.getElementById("submit-rating").addEventListener("click", async ()=> {
        const chatInputDiv = document.getElementById('textInput');
        const chatInputDivText = chatInputDiv.value.trim()

        const rightPanel = document.getElementById("right-panel");
        while ( rightPanel.firstChild ) rightPanel.removeChild( rightPanel.firstChild )

        if (chatInputDivText.length === 0 || chatInputDivText === ''){
            alert("prompt cannot be empty");
            return;
        }

        const metrics = [
            "Clarity and Context",
            "Focus on Problem",
            "Engagement Potential",
            "Open endedness",
            "Effectiveness in Generating Advice",
        ];
        
        const callForRatings = metrics.map(async (item) => {
            const call = await fetch(`https://api-sender.theletterdigest.com/customer-service/rate-prompt`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({ prompt: chatInputDivText, metric: item })
            });
            const { response } = await call.json();
        
            // Create card container
            const card = document.createElement("div");
            card.classList.add("card");
        
            // Create and append metric name element
            const metricName = document.createElement("h3");
            metricName.textContent = `Metric: ${item}`;
            card.appendChild(metricName);
        
            // Create and append rating element
            const rating = document.createElement("p");
            rating.textContent = `Rating: ${response?.rating}`;
            card.appendChild(rating);
        
            // Create and append reason element
            const reason = document.createElement("p");
            reason.textContent = `Reason: ${response?.description}`;
            card.appendChild(reason);
        
            // Append card to the right panel
            rightPanel.appendChild(card);
        });

        await Promise.all(callForRatings)

    })
})
