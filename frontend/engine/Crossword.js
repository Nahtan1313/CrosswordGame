

export default class Crossword{
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
        this.win = false;
        this.score = 0;
        this.acrossWordsWithNumbers = {}; //object with property = clue num and value = clue word. (for across words)
        this.downWordsWithNumbers = {}; // same as above but for down words
        this.blank = [] //constantly blank board, for a reference
        //this.time = 0;


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
        let ans = this.grid;
        let blank = this.grid.map(x => (x === ".") ? "*":"_");
        let numGrid = this.gridnums;
        while(ans.length){
            this.answerKey.push(ans.splice(0,this.numcols));
        }
        while(blank.length){
            this.puzzleBoard.push(blank.splice(0,this.numcols));
        }
        while(blank.length){
            this.puzzleBoard.push(blank.splice(0,this.numcols));
        }
        while(numGrid.length){
            this.numberedGrid.push(numGrid.splice(0,this.numcols));
        }
        for(let i = 0; i < this.answers_across.length; i++){
            let clue = this.clues_across[i]
            let clue_num = clue.substring(0,clue.indexOf("."));
            this.acrossWordsWithNumbers[''+clue_num] = this.answers_across[i];
        }
        for(let i = 0; i < this.answers_down.length; i++){
            let clue = this.clues_down[i]
            let clue_num = clue.substring(0,clue.indexOf("."));
            this.downWordsWithNumbers[''+clue_num] = this.answers_down[i];
        }
        this.blank = this.puzzleBoard.slice();
        this.checkedBoard = this.puzzleBoard.slice(); //make empty to start
    }

    toString(board){
        let emptyBoard = "";
        for(let i = 0; i < this.numrows;i++){
            emptyBoard += "|"
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
        this.puzzleBoard = this.blank.slice();
        this.checkedBoard = this.blank.slice();
        this.win = false;
        this.score = 0;
    }


    checkWin(){
        for(let i = 0; i < this.numrows; i++)
        {
            if(!this.puzzleBoard[i].includes("_")){
                return true;
            }
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
            emptyBoard += "|"
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
        return this.puzzleBoard();
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
        let gridNum = this.numberedGrid[tileRow][tileCol]
        let word = "";
        let wordNum = gridNum;
        let startRow = tileRow;
        let startCol = tileCol;
        let board = this.puzzleBoard;
        if(wordNum === 0){
            if(across){
                let x = tileCol;
                 while(x >= 0 && this.puzzleBoard[tileRow][x] != "*"){
                    let currentGridNum = this.numberedGrid[tileRow][x]
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
                    let currentGridNum = this.numberedGrid[x][tileCol]
                    if(currentGridNum != 0 && this.downWordsWithNumbers.hasOwnProperty(''+currentGridNum))
                    {
                        wordNum = currentGridNum;
                        startRow = x;
                    }
                    x--;
                }
                word = this.downWordsWithNumbers[''+wordNum];
            }
            return [word, startRow, startCol];
        }
    }
    


    // returns an array of of the current board checked against the answer key
    // F = not a match, T = a match, * = black space
    checkGrid(currentBoardState){
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let checked = this.checkedBoard.slice();
        for(let i = 0; i < this.numrows;i++){
            let row = []
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
    checkWord(tileRow, tileCol, across, currentBoardState){
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        let word = this.findWordfromTile(tileRow, tileCol, across)[0];
        let startRow = this.findWordfromTile(tileRow, tileCol, across)[1];
        let startCol = this.findWordfromTile(tileRow, tileCol, across)[2];
        let lettersObject = {};
        if(across){
            let increment = 0;
            for(let c = startCol; c < word.length; c++){
                let currentVal = his.puzzleBoard[tileRow][c]
                if(currentVal == word.charAt(increment)){
                    this.singleWordCheckedBoard[tileRow][c] = true;
                    lettersObject[currentVal] = true;
                }
                else if(currentVal === "_"){
                    this.checkedBoard[tileRow][c] = "_";
                    lettersObject[tileRow+"_"+c] = null;
                }
                else{
                    this.checkedBoard[tileRow][c] = false;
                    lettersObject[currentVal] = false;
                }
                increment++;
            }
        }
        else{
            let increment = 0;
            for(let r = startRow; r< word.length; r++){
                let currentVal = this.puzzleBoard[r][tileCol];
                if(currentVal == word.charAt(increment)){
                    this.checkedBoard[r][tileCol] = true;
                    lettersObject[currentVal] = true;
                }
                else if(currentVal === "_"){
                    this.checkedBoard[r][tileCol] = "_";
                    lettersObject[r+"_"+tileCol] = null;
                }
                else{
                    this.checkedBoard[r][tileCol] = false;
                    lettersObject[currentVal] = false;
                }
                increment++;
            }
        }
        return lettersObject;
    }

    checkTile(tileRow, tileCol, currentBoardState){
        if(currentBoardState != null){
            this.puzzleBoard = currentBoardState;
        }
        if(this.puzzleBoard[tileRow][tileCol] === this.answerKey[tileRow][tileCol]){
            return true;
        }
        return false;
    }


    revealGrid(){
        this.puzzleBoard = this.answerKey.slice();
        return this.puzzleBoard;
    }

    
    // just a testing method (unless i decide to implement constant checking as an option)
    // the UI will just locally store all guesses until a check is asked for
    // then UI will send current game state to model
    guess(){
        this.puzzleBoard[0][13] = "I";
        this.puzzleBoard[3][13] = "E";
        this.puzzleBoard[5][13] = "Q";
    }

    
}