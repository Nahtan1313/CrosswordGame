class CrosswordView {
    constructor(model){
        this.model = model;
        this.root = document.getElementById('root');
        this.currentState = this.model.getCurrentBoard();
        this.listeners = [];
        this.currentRow;
        this.currentCol;
        this.currentlyAcross = true; //true if across, false if down
        this.buttonListeners = [];
        this.board = this.model.getCurrentBoard();
        this.clockInterval;
        this.database = firebase.database();
        // creating the board itself with the dark spaces and numbers
        this.crossword_board = document.createElement('table');
            this.crossword_board.id = "board";
        this.numGrid = this.model.numberedGrid;
        this.initialize();
    }
    initialize(){
        this.downloadBoard();
        this.sendToDatabase(true)
        this.resetCurrentBoard();
        for(let r = 0; r < this.model.numrows; r++){
            let trow = document.createElement('tr');
            for(let c = 0; c < this.model.numcols; c++){
                let numMarker = this.numGrid[r][c];
                let cell_value = this.board[r][c];
                let tArea = document.createElement('textarea');
                    tArea.id = "textArea"+r+"_"+c;
                    tArea.cols = 1;
                    tArea.rows = 1;
                    tArea.maxLength = 1;
                let _this = this;
                tArea.onfocus = function(){
                    _this.currentRow = r;
                    _this.currentCol = c;
                    _this.addDirectionalHighlights()
                }
                tArea.ondblclick = function(){
                    _this.currentlyAcross = !_this.currentlyAcross;
                    _this.addDirectionalHighlights()
                }
                tArea.addEventListener("keydown", (event) =>{
                    let key = event.code
                    let isFalse = $("#textArea"+r+"_"+c).hasClass("incorrect");
                    if(event.code === "Backspace" && isFalse){
                        $("#textArea"+r+"_"+c).removeClass("incorrect");;
                    }
                    else if(key.includes("Key")){
                        key = key.substring(3);
                        _this.board[r][c] = key.toUpperCase();
                        let nextRight = $("#textArea"+r+"_"+(c+1));
                        let nextDown = $("#textArea"+(r+1)+"_"+c);
                        if(_this.currentlyAcross && nextRight != null){
                            setTimeout(slowTransition, 2, nextRight);
                        }
                        else if(!_this.currentlyAcross && nextDown != null){
                            setTimeout(slowTransition, 2, nextDown);
                        }
                        _this.sendToDatabase(false);
                        _this.checkBoard();
                    }
                    else if(key === 'Space'){
                        _this.currentlyAcross = !_this.currentlyAcross;
                        _this.addDirectionalHighlights()
                        event.preventDefault();
                    }
                    else if(key === "Backspace"){
                        let nextUp = $("#textArea"+(r-1)+"_"+(c));
                        let nextLeft = $("#textArea"+(r)+"_"+(c-1));
                        _this.board[r][c] = " "
                        if(_this.currentlyAcross && nextLeft != null){
                            $("#textArea"+r+"_"+c).val("");
                            setTimeout(slowTransition, 2, nextLeft);
                        }
                        else if(!_this.currentlyAcross && nextUp != null){
                            $("#textArea"+r+"_"+c).val("");
                            setTimeout(slowTransition, 2, nextUp);
                        }
                        _this.sendToDatabase(false);
                    }
                    else{
                        event.preventDefault();
                    }
                });
                let tcell = document.createElement('td');
                    tcell.id = "cell"+r+"_"+c;
                if(numMarker != 0){
                    setTimeout(createSuperScripts, 500);
                }
                if(cell_value != "*"){
                     tcell.append(tArea)
                }
                else{
                    tcell.append(cell_value);
                }

                function slowTransition(nextArea){
                        nextArea.focus();
                }
                function createBlackCells(){ 

                    $("#cell"+r+"_"+c).attr("class", "black");
                }
                function createTextCells(){ 

                    $("#cell"+r+"_"+c).attr("class", "text");
                }
                function createSuperScripts(){
                    let superscript = $("<div class = 'superscript'>"+numMarker+"</div>");
                    $("#cell"+r+"_"+c).append(superscript);
                }
                if(cell_value === "*"){
                    setTimeout(createBlackCells, 500)
                }
                else{
                    setTimeout(createTextCells, 500)
                }
                trow.append(tcell);
            }
            this.crossword_board.append(trow);
        }
        //creating across clues table
        let across_clues = document.createElement('table');
            let headerRow = document.createElement('tr');
            headerRow.id = "across_header_row";
            let header = document.createElement("th");
            header.colSpan = 2;
            header.append("Across");
            header.id = "across_header";
            headerRow.append(header);
        across_clues.append(headerRow);

            across_clues.id = "across_clues";
        for(let num in this.model.acrossCluesWithNumbers){
            let trow = document.createElement('tr');
            let clue_cell = document.createElement('td');
                clue_cell.id = "across_"+num;
            let num_cell = document.createElement('td');
            num_cell.append(num+". ");
                num_cell.id = "acrossNum_"+num;
            clue_cell.append(this.model.acrossCluesWithNumbers[num])
            trow.append(num_cell, clue_cell);
                trow.id = "acrossRow_"+num;
            trow.addEventListener("click", (event) =>{
                let location = _this.model.getRowColfromNum(num);
                _this.currentCol = location[1]
                _this.currentRow = location[0];
                _this.currentlyAcross = true;
                _this.addDirectionalHighlights()
            });
            across_clues.append(trow);
        }

        // creating down clues tables
        let down_clues = document.createElement('table');
            headerRow = document.createElement('tr');
            headerRow.id = "down_header_row";
            header = document.createElement("th");
            header.id = "down_header";
            header.colSpan = 2;
            header.append("Down");
            headerRow.append(header);
        down_clues.append(headerRow);
            down_clues.id = "down_clues";
        for(let num in this.model.downCluesWithNumbers){
            let trow = document.createElement('tr');
            let clue_cell = document.createElement('td');
                clue_cell.id = "down_"+num;
            let num_cell = document.createElement('td');
                num_cell.id = "downNum_"+num;
            num_cell.append(num+". ");
            clue_cell.append(this.model.downCluesWithNumbers[num])
            trow.append(num_cell, clue_cell);
                trow.id = "downRow_"+num;
            trow.addEventListener("click", (event) =>{
                let location = _this.model.getRowColfromNum(num);
                _this.currentCol = location[1]
                _this.currentRow = location[0];
                _this.currentlyAcross = false;
                _this.addDirectionalHighlights()
                });
            down_clues.append(trow);
        }
        let _this = this;
        let clueArr = [_this.model.acrossCluesWithNumbers, _this.model.downCluesWithNumbers];
        setTimeout(_this.addCellClasses, 500, clueArr);

        //creating check dropdown and buttons
        document.getElementById("revealGrid").addEventListener("click", function() {
            _this.model.revealGrid();
            _this.revealCurrentBoard();
            _this.checkBoard();
        });
        document.getElementById("revealWord").addEventListener("click", function() {
            _this.model.revealWord(_this.currentRow, _this.currentCol, _this.currentlyAcross , _this.board);
            _this.revealCurrentBoard();
            _this.checkBoard();
        });
        document.getElementById("revealTile").addEventListener("click", function() {
            _this.model.revealTile(_this.currentRow, _this.currentCol,_this.board);
            _this.revealCurrentBoard();
            _this.checkBoard();
        });
        document.getElementById("checkGrid").addEventListener("click", function() {
            _this.model.checkGrid(_this.board, true);
            _this.addsCheckstoBoard();
        });
        document.getElementById("checkWord").addEventListener("click", function() {
            _this.model.checkWord(_this.currentRow, _this.currentCol, _this.currentlyAcross, _this.board, true);
            _this.addsCheckstoBoard();
        });
        document.getElementById("checkTile").addEventListener("click", function() {
            _this.model.checkTile(_this.currentRow, _this.currentCol, _this.board, true);
            _this.addsCheckstoBoard();
        });
        document.getElementById("start_button").addEventListener("click", function(){
            $("#root").css({"opacity": "1","pointer-events":"auto"});
            $(".navigation_bar").css({"opacity": "1","pointer-events":"auto"});
            $("#start_screen").css("display", "none");
            _this.model.startTime();
            _this.clockInterval = setInterval(function(){
                let stringTime = _this.model.elapsedTimeToString();
                $("#clock").html(stringTime);
            },1000);
        })
        this.root.append(this.crossword_board);
        this.root.append(across_clues);
        this.root.append(down_clues);
        document.getElementById("clear_button").addEventListener("click", function(){
            _this.model.reset();
            _this.resetCurrentBoard();
        });
        document.getElementById("pause_button").addEventListener("click", function(){
            _this.model.pause();
            $("#root").css({"opacity": "0.3","pointer-events":"none"});
            $(".navigation_bar").css({"opacity": "0.3","pointer-events":"none"});
            $("#pause_screen").css("display", "block");
            clearInterval(_this.clockInterval);
        });
        document.getElementById("unpause_button").addEventListener("click", function(){
            _this.model.unpause();
            $("#root").css({"opacity": "1","pointer-events":"auto"});
            $(".navigation_bar").css({"opacity": "1","pointer-events":"auto"});
            $("#pause_screen").css("display", "none");
            _this.clockInterval = setInterval(function(){
                let stringTime = _this.model.elapsedTimeToString();
                $("#clock").html(stringTime);
            },1000);
        });
    }

    revealCurrentBoard(){
        this.model.checkGrid(this.board, false);
        for(let r = 0; r < this.model.numrows; r++){
            for(let c = 0; c < this.model.numcols; c++){
                let cell_val = this.model.getCurrentBoard()[r][c];
                let truth_val = this.model.getCheckedBoard()[r][c];
                if(cell_val != "_" || !truth_val)
                {
                    $("#textArea"+r+"_"+c).html(this.model.getCurrentBoard()[r][c]);
                }
            }
        }
    }

    resetCurrentBoard(){
        for(let r = 0; r < this.model.numrows; r++){
            for(let c = 0; c < this.model.numcols; c++){
                let cell_val = this.model.getCurrentBoard()[r][c];
                if(cell_val === "_"){
                    $("#textArea"+r+"_"+c).html("");
                    $("#textArea"+r+"_"+c).val("");
                    this.board[r][c] = "_"
                }
                else{
                    $("#textArea"+r+"_"+c).html(this.model.getCurrentBoard()[r][c]);
                    $("#textArea"+r+"_"+c).val("");
                    this.board[r][c] = this.model.getCurrentBoard()[r][c];
                }
            }
        }
    }

    addsCheckstoBoard(){
        for(let r = 0; r < this.model.numrows; r++){
            for(let c = 0; c < this.model.numcols; c++){
                let cell_val = this.model.getCheckedBoard()[r][c];
                if(cell_val === false)
                {
                    $("#textArea"+r+"_"+c).addClass("incorrect");
                }
                else if(cell_val === true)
                {
                    $("#textArea"+r+"_"+c).removeClass("incorrect");
                }
            }
        }
    }

    addDirectionalHighlights(){
        let wordObj = this.model.findWordfromTile(this.currentRow, this.currentCol, this.currentlyAcross);
        let word = wordObj[0];
        let num = wordObj[3];
        let len = word.length;
        $(".currentWord").removeClass("currentWord");
        $(".currentClue").removeClass("currentClue");
        if(this.currentlyAcross){
            for(let c = wordObj[2]; c < len + wordObj[2]; c++){            
                let row = wordObj[1];
                $("#textArea"+row+"_"+c).toggleClass("currentWord");
            }
            $("#acrossRow_"+num).toggleClass("currentClue");
            let displayNum = $("#acrossNum_"+num).text();
            displayNum = displayNum.substring(0,displayNum.length-2)
            $("#display_clue").html(displayNum +"A  -  " + $("#across_"+num).text());
        }
        else{
            for(let r = wordObj[1]; r < len + wordObj[1]; r++){
                let col = wordObj[2];
                $("#textArea"+r+"_"+col).toggleClass("currentWord");;
            }
            $("#downRow_"+num).toggleClass("currentClue");
            let displayNum = $("#downNum_"+num).text();
            displayNum = displayNum.substring(0,displayNum.length-2)

            $("#display_clue").html(displayNum +"D  -  " + $("#down_"+num).text());
        }
    }

    addCellClasses(arr){
        let acrossClues = arr[0];
        let downClues = arr[1];
        for(let num in acrossClues){
        $("#across_"+num).addClass("clueCell");
        $("#acrossNum_"+num).addClass("numberCell");
        }
        for(let n in downClues){
        $("#down_"+n).addClass("clueCell");
        $("#downNum_"+n).addClass("numberCell")
        }
    }

    sendToDatabase(initial){
        let date = this.model.getStringDate()
        let user = firebase.auth().currentUser;
        let p = this.model.getPercentage(this.board);
        let  userId;
        let t = this.model.elapsedTimeToString();
        let _this = this;
        if (user != null) {
            userId = user.uid;
        }
        if(initial){
            this.database.ref("/users/"+userId+"/puzzles/"+date).set({
                "started": true,
                "completed": false,
                "percentage": 0,  
                "score": 0,
                "time": 0,
                "board": _this.board
            });
        }
        else{
            this.database.ref("/users/"+userId+"/puzzles/"+date).update({
                "percentage": p,
                "time": t,
                "board": _this.board
            })
        }
    }

    downloadBoard(){
        let  userId;
        let user = firebase.auth().currentUser;
        let t = this.model.elapsedTimeToString();
        let date = this.model.getStringDate()
        let _this = this;
        if (user != null) {
            userId = user.uid;
        }
        firebase.database().ref().child("users").child(userId).child("puzzles").child(date).child("board").once("value").then((snapshot) =>{
            let  b = snapshot.val();
            if(b != null){
                console.log(b);
                _this.board = b;
                _this.model.setCurrentBoard(b);
            }
        });
    }

    checkBoard(){

        let winState = this.model.checkWin(this.board);
        if(winState != false){
           let score = winState[0];
           let stringTime = winState[1];
           if(stringTime.length >= 6){
               let cutOff1 = stringTime.indexOf(":");
               let cutOff2 = stringTime.indexOf(":", cutOff1+1);
               let h = parseInt(stringTime.substring(0,cutOff1),10);
               let m = parseInt(stringTime.substring(cutOff1+1, cutOff2),10);
               let s = parseInt(stringTime.substring(cutOff2+1),10);
               if(h > 1){
                $("#display_final_time").html(h + " hours, " + m + " minutes, " + s  + " seconds");
               }
               else{
                $("#display_final_time").html("1 hour, " + m + " minutes, " + s  + " seconds");
               }
           }
           else{
                let cutOff = stringTime.indexOf(":");
                let m = parseInt(stringTime.substring(0, cutOff),10);
                let s = parseInt(stringTime.substring(cutOff+1),10);
                $("#display_final_time").html(m + " minutes, " + s + " seconds");
            }
            $("#display_score").html(score);
            $("#root").css({"opacity": "0.3","pointer-events":"none"});
            $(".navigation_bar").css({"opacity": "0.3","pointer-events":"none"});
            $("#end_screen").css("display", "block");
            clearInterval(this.clockInterval);
            document.getElementById("exit_button").addEventListener("click", function() {
                $("#root").css({"opacity": "1","pointer-events":"auto"});
                $(".navigation_bar").css({"opacity": "1","pointer-events":"auto"});
                $("#end_screen").css("display", "none"); 
            });
            let user = firebase.auth().currentUser;
            let date = this.model.getStringDate()
            let  userId;
            if (user != null) {
                userId = user.uid;
            }
            this.database.ref("/users/"+userId+"/puzzles/"+date).update({
                "completed": true,
                "score": score,
                "time": stringTime,
                "percentage": 100
            })
            
        }
    }
}