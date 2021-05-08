

class Crossword{
    constructor(obj_json){
        //crossword basics
        this.answers_across = obj_json.answers.across;
        this.answers_down = obj_json.answers.down;
        this.clues_across = obj_json.clues.across;
        this.clues_down = obj_json.clues.down;
        this.date = obj_json.date;
        this.dow = obj_json.dow;
        this.numcols = obj_json.size.cols;
        this.numrows = obj_json.size.rows;
        this.grid = obj_json.grid;
        this.gridnums = obj_json.gridnums;
        this.author = obj_json.author;
        this.title = obj_json.title;

        //variables i added
        this.puzzleBoard = []; //board where guesses actually go
        this.answerKey = [];  // answer key, has all correct values
        this.numberedGrid = []; //grid of numbered words, 0 = middle of word, num = start of word, corresponds to clue num
        this.checkedBoard = []; //board of T and F, where T means guess is correct and F means guess is wrong;
        this.acrossWordsWithNumbers = {}; //object with property = clue num and value = word. (for across words)
        this.acrossCluesWithNumbers = {};
        this.downWordsWithNumbers = {}; // same as above but for down words
        this.downCluesWithNumbers = {};
        this.blank = []; //constantly blank board, for a reference
        
        // scoring variables
        this.score = 0;
        this.revealed = false; // any tiles have been revealed
        this.checked = false; // any tiles have been checked
        this.revealedTiles = [];  // grid to keep track of which tiles the user revealed for scoring purposes, true means revealed, false means otherwise
        this.revealedWords = []; //array of every revealed word, no points for doing so.
        
        // timing
        this.start_time = null;
        this.end_time = null;
        this.elapsed = null;
        this.timePaused = null;
        this.totalPauseTime = 0;
        this.targetTime = 0;



        this.completed = false;
        this.percentageDone = 0;


        //info that could be useful to have i guess/i know what it is
        this.editor = obj_json.editor;
        this.editor = obj_json.editor;
        this.mini = obj_json.mini;
        this.publisher = obj_json.publisher;
        this.copyright = obj_json.copyright;

        // no idea what they mean/are but i have them
        this.acrossmap = obj_json.acrossmap;
        this.admin = obj_json.admin;
        this.autowrap = obj_json.autowrap;
        this.bbars = obj_json.bbars;
        this.code = obj_json.code;
        this.downmap = obj_json.downmap;
        this.hold = obj_json.hold;
        this.id = obj_json.id;
        this.id2 = obj_json.id2;
        this.interpretcolors = obj_json.interpretcolors;
        this.jnotes = obj_json.jnotes;
        this.key = obj_json.key;
        this.notepad = obj_json.notepad;
        this.rbars = obj_json.rbars;
        this.shadecircles = obj_json.shadecircles;
        this.track = obj_json.track;
        this.type = obj_json.type;
        this.setUpGame();
    }

    setUpGame(){
        let ans = this.grid.slice();
        let blank = this.grid.map(x => (x === ".") ? "*":"_");
        let reveal = this.grid.map(x => (x === ".") ? "*":"F");
        let check = this.grid.map(x => (x === ".") ? "*":"_");
        let numGrid = this.gridnums.slice();
        while(ans.length){
            this.answerKey.push(ans.splice(0,this.numcols));
        }
        while(blank.length){
            this.puzzleBoard.push(blank.splice(0,this.numcols));
        }
        while(numGrid.length){
            this.numberedGrid.push(numGrid.splice(0,this.numcols));
        }
        //let bool = this.grid.map(x => (x === ".") ? "*":"F");
        while(check.length){
            this.checkedBoard.push(check.splice(0,this.numcols));
        }
        while(reveal.length){
            this.revealedTiles.push(reveal.splice(0,this.numcols));
        }
        for(let i = 0; i < this.answers_across.length; i++){
            let clue = this.clues_across[i];
            let clue_num = clue.substring(0,clue.indexOf("."));
            this.acrossWordsWithNumbers[''+clue_num] = this.answers_across[i];
            this.acrossCluesWithNumbers[''+clue_num] = this.clues_across[i].substring(clue.indexOf(".")+1);
        }
        for(let i = 0; i < this.answers_down.length; i++){
            let clue = this.clues_down[i];
            let clue_num = clue.substring(0,clue.indexOf("."));
            this.downWordsWithNumbers[''+clue_num] = this.answers_down[i];
            this.downCluesWithNumbers[''+clue_num] = this.clues_down[i].substring(clue.indexOf(".")+1);
        }
        this.blank = this.grid.map(x => (x === ".") ? "*":"_");
        //for(let i = 0; i < this.numcols; i++){
        //    this.revealedTiles[i].fill(false) //no tiles have been revealed yet.
        //}
        this.score = this.answers_down.length*10 + this.answers_across.length*10; //base score bc the puzzle needs to be complete to get a score

        //set target times using time target estimates from my own experiences/educated guesses on average time
        // in milliseconds
        switch(this.dow.toLowerCase())
        {
            case "sunday":
                this.targetTime = 3300000; //55 min
                break;
            case "monday":
                this.targetTime = 540000; // 9 min
                break;
            case "tuesday":
                this.targetTime = 780000; //13 min
                break;
            case "wednesday":
                this.targetTime = 840000; //14 min
                break;
            case "thursday":
                this.targetTime = 1500000; //25 min
                break;
            case "friday":
                this.targetTime = 1800000; //30 min
                break;
            case "saturday":
                this.targetTime = 2700000; //45 min
                break;
            default: 
        }
    }

    toString(board){
        let emptyBoard = "";
        for(let i = 0; i < this.numrows;i++){
            emptyBoard += "|";
            for(let j = 0; j < this.numcols; j++){
                if(board[i][j] === true){
                    emptyBoard += "T" + "|";
                }
                else if(board[i][j] === false){
                    emptyBoard += "F" + "|";
                }
                else{
                    emptyBoard += board[i][j] + "|";
                }
            }
            emptyBoard += "\n";
        }
        return emptyBoard;
    }

    reset(){
        // clear all non JSON-defined variables
        this.puzzleBoard = []; 
        this.answerKey = [];  
        this.numberedGrid = []; 
        this.checkedBoard = []; 
        this.acrossWordsWithNumbers = {}; 
        this.downWordsWithNumbers = {}; 
        this.blank = [];
        this.score = 0;
        this.revealed = false; 
        this.checked = false; 
        this.revealedTiles = [];  
        this.revealedWords = [];
        this.completed = false;
        this.percentageDone = 0;
        // reset all arrays
        this.setUpGame();
    }

    checkFilled(){
        for(let i = 0; i < this.numrows; i++)
        {
            if(this.puzzleBoard[i].includes("_") || this.puzzleBoard[i].includes(" ")){
                return false;
            }
        }
        return true;
    }
    
    checkWin(currentBoardState){
        if(this.checkFilled())
        {
            this.checkGrid(currentBoardState, false);
            for(let i = 0; i < this.numrows; i++)
            {
                if(this.checkedBoard[i].includes(false)){
                    return false;
                }
            }
            this.end_time = Date.now();
            return this.gameFinish(currentBoardState);
        }
        return false;
    }

    currentBoardToString(){
        let b = this.toString(this.puzzleBoard);
        return b;
    }

    gridNumsToString(){
        let emptyBoard = "";
        for(let i = 0; i < this.numrows;i++){
            emptyBoard += "|";
            for(let j = 0; j < this.numcols; j++){
                if(this.numberedGrid[i][j] > 9){
                    emptyBoard += this.numberedGrid[i][j] + "|";
                }
                else{
                    emptyBoard += this.numberedGrid[i][j] + " |";
                }
            }
            emptyBoard += "\n";
        }
        return emptyBoard;
    }

    getCurrentBoard(){
        return this.puzzleBoard;
    }

    setCurrentBoard(currentBoardState){
        this.puzzleBoard = currentBoardState;
    }

    getCheckedBoard(){
        return this.checkedBoard;
    }


    answerKeyToString(){
        return this.toString(this.answerKey);
    }

    checkedGridToString(){
        let grid = this.checkedBoard;
        return this.toString(grid);
    }

    // assumes front end correctly passes what tile/letter the user currently has selected
    // and whether they are currently looking at the across or down word
    findWordfromTile(tileRow, tileCol, across){
        let gridNum = this.numberedGrid[tileRow][tileCol];
        let word = "";
        let wordNum = gridNum;
        let startRow = tileRow;
        let startCol = tileCol;
        let board = this.puzzleBoard;
        if(wordNum === 0){
            if(across){
                let x = tileCol;
                 while(x >= 0 && this.puzzleBoard[tileRow][x] != "*"){
                    let currentGridNum = this.numberedGrid[tileRow][x];
                    if(currentGridNum != 0 && this.acrossWordsWithNumbers.hasOwnProperty(''+currentGridNum))
                    {
                        wordNum = currentGridNum;
                        startCol = x;
                    }
                    x--;
                }
                word = this.acrossWordsWithNumbers[''+wordNum];
            }
            
            else
            {
                let x = tileRow;
                 while(x >= 0 && this.puzzleBoard[x][tileCol] != "*"){
                    let currentGridNum = this.numberedGrid[x][tileCol];
                    if(currentGridNum != 0 && this.downWordsWithNumbers.hasOwnProperty(''+currentGridNum))
                    {
                        wordNum = currentGridNum;
                        startRow = x;
                    }
                    x--;
                }
                word = this.downWordsWithNumbers[''+wordNum];
            }
            return [word, startRow, startCol, wordNum];
        }
        else{
            if(across && this.acrossWordsWithNumbers[''+wordNum] != null){
                word = this.acrossWordsWithNumbers[''+wordNum];
                return [word, startRow, startCol, wordNum];
            }
            else  if(!across && this.downWordsWithNumbers[''+wordNum] != null){
                word = this.downWordsWithNumbers[''+wordNum];
                return [word, startRow, startCol, wordNum];
            }
            else if(across)
            {
                let x = tileCol;
                 while(x >= 0 && this.puzzleBoard[tileRow][x] != "*"){
                    let currentGridNum = this.numberedGrid[tileRow][x];
                    if(currentGridNum != 0 && this.acrossWordsWithNumbers.hasOwnProperty(''+currentGridNum))
                    {
                        wordNum = currentGridNum;
                        startCol = x;
                    }
                    x--;
                }
                word = this.acrossWordsWithNumbers[''+wordNum];
                return [word, startRow, startCol, wordNum];
            }
            else{
                let x = tileRow;
                while(x >= 0 && this.puzzleBoard[x][tileCol] != "*"){
                   let currentGridNum = this.numberedGrid[x][tileCol];
                   if(currentGridNum != 0 && this.downWordsWithNumbers.hasOwnProperty(''+currentGridNum))
                   {
                       wordNum = currentGridNum;
                       startRow = x;
                   }
                   x--;
               }
               word = this.downWordsWithNumbers[''+wordNum];
               return [word, startRow, startCol, wordNum];
            }
        }
    }
    


    // returns an array of of the current board checked against the answer key
    // F = not a match, T = a match, * = black space
    // userCheck = T, if its a user-initiated check, False if the system initiates it
    // system initated check will happend when the grid is filled in the view class, and will also check 
    checkGrid(currentBoardState, userCheck){
        if(userCheck != null && userCheck){
            this.checked = true;
        }
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let checked  = [];
        for(let i = 0; i < this.numrows;i++){
            let row = [];
            for(let j = 0; j < this.numcols; j++){
               if(this.puzzleBoard[i][j] === this.answerKey[i][j]){ //guess is correct, make space = True
                   row.push(true);
               }
               else if(this.puzzleBoard[i][j] === "*" || this.answerKey[i][j] === "."){ //if black square, keep as is
                    row.push("*");
               }
               else if(this.puzzleBoard[i][j] === "_"){  //if no guess made, nothing to check
                    row.push("_");
               }
               else{  // guess is wrong, make space = False
                    row.push(false);
               }
            }
            checked.push(row);
        }
        this.checkedBoard = checked;
        return this.checkedBoard;
    }

    // returns an array of the length of the word where the letter itself means it is correct, _ means it wasn't filled in
    // and FALSE means it was wrong
    checkWord(tileRow, tileCol, across, currentBoardState, userCheck){
        if(userCheck != null && userCheck){
            this.checked = true;
        }
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let word = this.findWordfromTile(tileRow, tileCol, across)[0];
        let startRow = this.findWordfromTile(tileRow, tileCol, across)[1];
        let startCol = this.findWordfromTile(tileRow, tileCol, across)[2];
        let lettersObject = {};
        if(across){
            let increment = 0;
            for(let c = startCol; c < startCol + word.length; c++){
                let currentVal = this.puzzleBoard[tileRow][c];
                if(currentVal == word.charAt(increment)){
                    this.checkedBoard[tileRow][c] = true;
                    lettersObject[tileRow+"_"+currentVal+"_"+c] = true;
                }
                else if(currentVal === "_"){
                    this.checkedBoard[tileRow][c] = "_";
                    lettersObject[tileRow+"_"+c] = null;
                }
                else{
                    this.checkedBoard[tileRow][c] = false;
                    lettersObject[tileRow+"_"+currentVal+"_"+c] = false;
                }
                increment++;
            }
        }
        else{
            let increment = 0;
            for(let r = startRow; r<startRow + word.length; r++){
                let currentVal = this.puzzleBoard[r][tileCol];
                if(currentVal == word.charAt(increment)){
                    this.checkedBoard[r][tileCol] = true;
                    lettersObject[r+"_"+currentVal+"_"+tileCol] = true;
                }
                else if(currentVal === "_"){
                    this.checkedBoard[r][tileCol] = "_";
                    lettersObject[r+"_"+tileCol] = null;
                }
                else{
                    this.checkedBoard[r][tileCol] = false;
                    lettersObject[r+"_"+currentVal+"_"+tileCol] = false;
                }
                increment++;
            }
        }
        return lettersObject;
    }

    checkTile(tileRow, tileCol, currentBoardState, userCheck){
        if(userCheck != null && userCheck){
            this.checked = true;
        }
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        
        if(this.puzzleBoard[tileRow][tileCol] === this.answerKey[tileRow][tileCol]){
            this.checkedBoard[tileRow][tileCol] = true;
            return true;
        }
        else if(this.puzzleBoard[tileRow][tileCol] === "_"){
            this.checkedBoard[tileRow][tileCol] = "_";
            return null;
        }
        this.checkedBoard[tileRow][tileCol] = false;
        return false;
    }


    // redo - need to account for tiles already gotten
    // actually nvm - if you revealGrid --> no points for you. you suck if you do this
    revealGrid(){
        let countCorrect = 0;
        for(let i=0; i<this.numrows; i++){
            for(let j=0; j<this.numcols; j++){
                let currentVal = this.puzzleBoard[i][j];
                let ans = this.answerKey[i][j];
                if(currentVal === ans){
                    countCorrect++;
                }
                this.puzzleBoard[i][j]=this.answerKey[i][j];
            }
        }
        this.score = 0;
        this.completed = true;
        this.revealed = true;
        this.checked = true;
        for(let i = 0; i < this.numcols; i++){
            this.revealedTiles[i].fill(true);
        }
        for(let i = 0; i < this.answers_across.length; i++){
            this.revealedWords.push(this.answers_across[i]);
        }
        for(let i = 0; i < this.answers_down.length; i++){
            this.revealedWords.push(this.answers_down[i]);
        }
        return this.puzzleBoard;
    }

    revealWord(tileRow, tileCol, across, currentBoardState)
    {
        this.revealed = true;
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let word = this.findWordfromTile(tileRow, tileCol, across)[0];
        this.revealedWords.push(word);
        let startRow = this.findWordfromTile(tileRow, tileCol, across)[1];
        let startCol = this.findWordfromTile(tileRow, tileCol, across)[2];
        if(across){
            let increment = 0;
            for(let c = startCol; c < startCol + word.length; c++){
                let currentVal = this.puzzleBoard[startRow][c];
                if(currentVal == word.charAt(increment)){
                    this.puzzleBoard[startRow][c] = ""+word.charAt(increment);
                }
                else{
                    this.revealedTiles[startRow][c] = true;
                    this.puzzleBoard[startRow][c] = this.answerKey[startRow][c];
                }
                increment++;
            }
        }
        else{
            let increment = 0;
            for(let r = startRow; r < startRow + word.length; r++){
                let currentVal = this.puzzleBoard[r][startCol];
                if(currentVal == word.charAt(increment)){
                    this.puzzleBoard[r][startCol] = ""+word.charAt(increment);
                }
                else{
                    this.revealedTiles[r][startCol] = true;
                    this.puzzleBoard[r][startCol] = this.answerKey[r][startCol];
                }
                increment++;
            }
        }
        return this.puzzleBoard;
    }

    revealTile(tileRow, tileCol,currentBoardState){
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        this.revealed = true;
        this.revealedTiles[tileRow][tileCol] = true;
        this.puzzleBoard[tileRow][tileCol] = this.answerKey[tileRow][tileCol];
        return this.puzzleBoard;
    }

    
    // just a testing method (unless i decide to implement constant checking as an option)
    // the UI will just locally store all guesses until a check is asked for
    // then UI will send current game state to model
    guess(){
        this.puzzleBoard[1][12] = "I";
        this.puzzleBoard[2][12] = "E";
        this.puzzleBoard[4][13] = "Q";
    }

    /* Timing Methods
        - planning on implementing a pausing functionality
        - time will start after initialization, when user clicks start button
        - time will pause on pause (obvi) but the screen will freeze (no moves can be made)
        - time will only end once game is completed;
    */
    getElapsedTime(){
        if(this.completed){
            this.elapsed = this.end_time - this.start_time - this.totalPauseTime;
        }
        else{
            this.elapsed = Date.now() - this.start_time - this.totalPauseTime;
        }
        return this.elapsed;
    }

    setElapsedTime(time){
        let myTime = time.split(":");
        let seconds;
        let minutes;
        if(myTime[0] != null){
            minutes = parseInt(myTime[0]);
        }
        if(myTime[1] != null){
            seconds = parseInt(myTime[1]);
        }
        this.start_time = Date.now() - (seconds*1000) + (minutes*60*1000)
        this.totalPauseTime = 0;
    }

    startTime(){
        this.start_time = Date.now();
    }

    pause(){
        this.timePaused = Date.now();
    }

    unpause(){
        let unpause_time = Date.now();
        this.totalPauseTime += unpause_time - this.timePaused;
        this.timePaused = null;
    }

    elapsedTimeToString(){
        let time = this.getElapsedTime();
        if(time >= 3600000){
            let differenceInHours = time/3600000;
            let hour = Math.floor(differenceInHours);
            let differenceInMinutes = (differenceInHours-hour)*60;
            let min = Math.floor(differenceInMinutes);
            let differenceInSeconds = (differenceInMinutes - min)*60;
            let sec = Math.floor(differenceInSeconds);

            let formattedHours = hour.toString().padStart(2, "0");
            let formattedMinutes = min.toString().padStart(2, "0");
            let formattedSeconds = sec.toString().padStart(2, "0");

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }
        else{
            let differenceInMinutes = time/60000;
            let min = Math.floor(differenceInMinutes);
            let differenceInSeconds = (differenceInMinutes - min)*60;
            let sec = Math.floor(differenceInSeconds);
            
            let formattedMinutes = min.toString().padStart(2, "0");
            let formattedSeconds = sec.toString().padStart(2, "0");

            return `${formattedMinutes}:${formattedSeconds}`;
        }

    }

    gameFinish(currentBoardState){
        let gameEndInfo = [];
        gameEndInfo.push(this.getScore(currentBoardState));
        gameEndInfo.push(this.elapsedTimeToString());
        return gameEndInfo;
    }

    getRowColfromNum(gridNum){
        for(let r = 0; r < this.numrows; r++)
        {
            let exists = this.numberedGrid[r].findIndex(element => element == gridNum);
            if(exists != -1)
            {
                return [r, exists];
            }
        }
        return null;
    }

    getStringDate(){
        //  month\/day\/year
        let date = queryString.split("_");
        return date[0]+"_"+date[1]+"_"+date[2];
    }

    getPercentage(currentBoardState){
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let filledTiles = 0;
        for(let r = 0; r < this.numrows; r++){
            filledTiles += (this.puzzleBoard[r].filter(x => (x != "_" && x != " " && x != "*"))).length;
        }
        let totalTiles = this.numrows*this.numcols;
        this.percentageDone = Math.round((filledTiles/totalTiles)*100);
        return this.percentageDone
    }



     /* scoring rules
            - each completed word is 10 pts
            - points are deducted when revealing letters (10 - num tiles revealed per word)
            - no points for revealing whole word
               - simply clicking reveal word will take away all points for it
               - better off exposing individual tiles
            - 15 pts for every full minute under the (suggested) time limit
               - no actual time limit, simply for scoring purposes only
            - extra 150 for completing the puzzle in its entirety with no reveals
            - extra 150 (plus the other 150) for completing the puzzle in its entirety with no checks or reveals
    */
    getScore(currentBoardState){
        if(this.completed){
            if(currentBoardState != null){
                this.checkGrid(currentBoardState, false);   //if board has changed since last check, need to recheck the grid
            }
            if(this.revealed){
                let scoreCalc = this.score - 10*this.revealedWords.length; // no points for revealing whole word
                let wordTileRevealCount = this.revealedWords.reduce(function(accumulator, currentVal){
                    return accumulator += currentVal.length;
                });
                let totalTileRevealCount = 0;
                for(let i = 0; i <= this.numcols; i++){
                    let rowCount = this.revealedTiles.reduce(function(accumulator, currentVal){
                        if(currentVal === "true"){
                            return accumulator += 1;
                        }
                        else{
                            return accumulator;
                        }
                    });
                    totalTileRevealCount += rowCount;
                }
                let numIndividualRevealedTiles = totalTileRevealCount - wordTileRevealCount;
                scoreCalc = scoreCalc - numIndividualRevealedTiles;
            }
            else if(this.checked){
                this.score += 150; //checked but no reveals
            }
            else{
                this.score += 300;  // no checks and no reveals
            }
            this.getElapsedTime();
            if(this.elapsed < this.targetTime)
            {
                let timeDiff = this.elapsed; //time difference in milliseconds
                timeDiff = timeDiff/60000; // time difference in minutes
                timeDiff = Math.floor(timeDiff); //round down
                this.score += 15*timeDiff;
            }
        }
        return this.score;
    }   
}