document.addEventListener('DOMContentLoaded', function() {

    let score = 0;
    let gameGrid = []
    let currentFoodPosition;
    let currentBodyCoord = []
    let gameGridDimension = [20,20]

    // this function creates the game grid
    const createGrid = (dimension=[5,5]) =>{
        const grid = []
        for (let row = 0; row < dimension[0]; row ++){
            const rowArray = []
            for (let column = 0; column < dimension[1]; column ++ ){
                rowArray.push(0)
            }
            grid.push(rowArray)
        }
        return grid
    }

    // this function renders the game board
    const renderGameBoard = (gameGridDimension, gameGrid) => {
        
        // remove game board and re-render on every move
        document.getElementById("game-board").remove();
        let gameBoard = document.createElement("div");
        gameBoard.setAttribute("id", "game-board")
        document.body.appendChild(gameBoard);

        gameGrid.map((rows)=>{
            rows.map((column) => {
                let element = document.createElement("div")
                if (column == 0)
                    element.setAttribute("class", "grid")
                if (column == 1)
                    element.setAttribute("class", "grid-snake")
                if (column == 2)
                    element.setAttribute("class", "grid-food")
                gameBoard.appendChild(element)
            })
        })

        // set grid styling for each item type
        Array.from(["grid", "grid-snake", "grid-food"]).map((grid)=>{
            const gridItems = document.getElementsByClassName(grid)
            Array.from(gridItems).map((grid) => grid.style.width = `${500/gameGridDimension[0]}px`);
            Array.from(gridItems).map((grid) => grid.style.height = `${500/gameGridDimension[1]}px`);
        })
    }

    // update the grid with the food position
    const updateFoodPosition = (currentFoodPosition) =>{
        gameGrid[currentFoodPosition[0]][currentFoodPosition[1]] = 2
        return gameGrid
    }

    // use this to check if snake has found food
    const snakeHasFoundFood = (snakePosition, foodPosition) =>{
        return (
            snakePosition[0] == foodPosition[0] &&
            snakePosition[1] == foodPosition[1]
        )
    }

    // add length to snake when it finds food
    const addLengthToSnake = (snakePosition) =>{
        gameGrid[snakePosition[0]][snakePosition[1]] = 1
        currentBodyCoord.push(snakePosition)
    }

    // this generates the position for the food
    // it checks for the available positions were the snakes body is not present
    const generateNewFoodPosition = () =>{
        const availableLocations = []
        for (const indexOfRow in gameGrid){
            for (const indexOfColumn in gameGrid[indexOfRow]){
                const gridValue = (gameGrid[indexOfRow][indexOfColumn])
                if (gridValue === 0)
                    availableLocations.push([indexOfRow, indexOfColumn])
            }
        }
        const randomSelection = Math.floor(Math.random() * availableLocations.length) + 1
        return availableLocations[randomSelection]
    }    

    // update snake position
    const updateSnakePosition = (newBodyCoord, currentSnakeLength) =>{

        const snakeSuicide = currentBodyCoord.filter((coord) => coord[0]===newBodyCoord[0] && coord[1]===newBodyCoord[1])
        if (snakeSuicide.length >= 1){
            alert ("oops you ate yourself... game over.")
            window.location.reload();
            return;
        }        

        if (newBodyCoord[0] < 0 || newBodyCoord[0] > gameGridDimension[0]-1){
            alert("cannot leave game space.. game over.")
            window.location.reload();
        }

        if (newBodyCoord[1] < 0 || newBodyCoord[1] > gameGridDimension[1]-1){
            alert("cannot leave game space.. game over.")
            window.location.reload();
        }        

        currentBodyCoord.splice(0,0,newBodyCoord)
        
        const updatedSnakePosition = currentBodyCoord.slice(0,currentSnakeLength)
        updatedSnakePosition.forEach((coord)=>{
            gameGrid[coord[0]][coord[1]] = 1
        })
        
        const discardedSnakePosition = currentBodyCoord.slice(currentSnakeLength,)
        discardedSnakePosition.forEach((coord)=>{
            gameGrid[coord[0]][coord[1]] = 0
        })
        
        currentBodyCoord = updatedSnakePosition
    }

    // update score of the game
    const updateScore = (score) =>{
        parseInt(document.getElementById("score").innerHTML=`
            current score is: ${score}
        `)

    }

    // STARTING THE GAME //
    gameGrid = createGrid(gameGridDimension) // create game grid
    updateSnakePosition([4,4], 1) //initialize snake position
    currentFoodPosition = generateNewFoodPosition(gameGridDimension) // get new food position
    updateFoodPosition(currentFoodPosition) // initialize food position
    renderGameBoard(gameGridDimension, gameGrid) // render the game and characters on screen
    updateScore(score) // initialize score

    // this function manages the game state.
    const manageGameState = (newHeadPositionOfSnake) =>{
        const lastKnownPosition = currentBodyCoord.at(-1)
        updateSnakePosition(newHeadPositionOfSnake, currentBodyCoord.length)
        renderGameBoard(gameGridDimension, gameGrid)
        if (snakeHasFoundFood(newHeadPositionOfSnake, currentFoodPosition)) {
            addLengthToSnake(lastKnownPosition)
            currentFoodPosition = generateNewFoodPosition(gameGridDimension)
            updateFoodPosition(currentFoodPosition)
            updateScore(score+=1)
        }
        renderGameBoard(gameGridDimension, gameGrid)      
    }

    // monitoring character movement.
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {          
            const newHeadPositionOfSnake = [currentBodyCoord[0][0]-1, currentBodyCoord[0][1]]
            manageGameState(newHeadPositionOfSnake)                      
        } else if (e.key === "ArrowDown") {
            const newHeadPositionOfSnake = [currentBodyCoord[0][0]+1, currentBodyCoord[0][1]]
            manageGameState(newHeadPositionOfSnake)          
        } else if (e.key === "ArrowLeft") {
            const newHeadPositionOfSnake = [currentBodyCoord[0][0], currentBodyCoord[0][1]-1]
            manageGameState(newHeadPositionOfSnake)          
        } else if (e.key === "ArrowRight") {
            const newHeadPositionOfSnake = [currentBodyCoord[0][0], currentBodyCoord[0][1]+1]
            manageGameState(newHeadPositionOfSnake)
        }});


}, false);