/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//Accepts
// {
//     pieces : Array[], (An array of Pieces)
//     player : Int, (The player number. Currently 1 or 2)
// }
function GameBoard(attrs){
    
    //Returns an individual piece of it exists, false if it doesn't
    this.getPiece = function(position){
        
        //Loop through each piece. If the piece's position matches, return that piece.
        var correctPiece = _.find(this.pieces, function(piece){
            return (piece.position[0] === position[0] && piece.position[1] === position[1]);
        });
        
        //No piece found at that position
        return (correctPiece || false);
    };
    
    //is_valid_move
    //Function that determines whether moving piece a to position b is a valid move
    //A valid move is determined by these rules:
    //It must be on the board.
    //It must be in a diagonal direction.
    //It must not be on top of another piece.
    //If the piece is not a king, it must be "forward" - for black, "forward" is y++, for red it is y--
    
    this.isValidMove = function(piece, target){
        
        //Check if the target is on the board
        if(target[0] > 7 || target[1] > 7 || target[0] < 0 || target[1] < 0){
            return false;
        }
        
        //Check if the target is diagonal from the piece
        if(!this.isDiagonal(piece, target)){
            return false;
        }
        
        //If the move is backwards, check if the piece is a king
        if(piece.color === 'black'){
            if(target[1] < piece.position[1]){
                if(piece.type !== 'king'){
                    return false;
                }
            }
        } else if (piece.color === 'red'){
            if(target[1] > [piece.position[1]]){
                if(piece.type !== 'king'){
                    return false;
                }
            }
        }
        return true;
    };
    
    //is_valid_jump
    //This checks if a piece is allowed to jump another piece.
    //A piece is allowed to jump another piece if:
    //That piece is in a valid move position (diagonal, forward if not a king, on the board)
    //That piece is of the opposing color
    //That piece has a valid move in the direction of the jump
    this.isValidJump = function(piece, target){
        
        //Check if the target piece is the opposite color
        if(piece.color === target.color){
            return false;
        }
        
        //Check if the target piece is a valid move
        if(!this.isValidMove(piece, target.position)){
            return false;
        }
        
        //Returns false if the jump is illegal (off the board or onto another piece) and the target position if it is legal
        var jumpTarget = this.getJumpTarget(piece, target);
        
        if(jumpTarget){
            return jumpTarget;
        }
        
        return false;
        
    };
    
    
    //Returns the square of a jump given a piece and a target piece
    // A jump target must be on the board
    // A jump target must not have a piece on it
    this.getJumpTarget = function(piece, targetPiece){
        var jumpTarget;
        
        //Get direction
        //Top right
        if(piece.position[0] < targetPiece.position[0] && piece.position[1] < targetPiece.position[1]){
            jumpTarget = [targetPiece.position[0] + 1, targetPiece.position[1] + 1];
        //Bottom right
        } else if (piece.position[0] < targetPiece.position[0] && piece.position[1] > targetPiece.position[1]){
            jumpTarget = [targetPiece.position[0] + 1, targetPiece.position[1] - 1];
        //Bottom left
        } else if (piece.position[0] > targetPiece.position[0] && piece.position[1] > targetPiece.position[1]){
           jumpTarget = [targetPiece.position[0] - 1, targetPiece.position[1] - 1];
        //Top left
        } else if (piece.position[0] > targetPiece.position[0] && piece.position[1] < targetPiece.position[1]){
            jumpTarget = [targetPiece.position[0] - 1, targetPiece.position[1] + 1];
        }
        
        //Determine if square is on board
        if(jumpTarget[0] < 0 || jumpTarget[0] > 7 || jumpTarget[1] < 0 || jumpTarget[1] > 7){
            return false;
        }
        
        //Determine if square has a piece in it
        if(this.getPiece(jumpTarget)){
            return false;
        }
        //All clear, return the target
        return jumpTarget;
    };
    //getValidTargets returns an array of all valid targets for a particular piece.
    //A valid target is:
    // One that is a valid move (isValidMove) and empty, or
    // One that is a valid jump (isValidJump), or
    // One that is a chain of valid jumps.
    this.getValidTargets = function(piece){
        var validTargets = [];
        var diagonals = this.getValidDiagonals(piece);
        var self = this;
        //Check the surrounding squares
        _.each(diagonals, function(target){
           if(this.isValidMove(piece, target) && !this.getPiece(target)){
               validTargets.push(target);
           }
        }, self);
        
        //Check all jumps
        var jumpTargets = [];
        jumpTargets = this.getJumps(piece, jumpTargets);
        if(jumpTargets.length > 0){
            validTargets = validTargets.concat(jumpTargets);
        }
        
        //Return all targets or false if there are no targets
        return (validTargets || false);
    };
    
    //For each jump square (diagonal piece), check if it's valid. 
    //If it is valid push it, set the placement piece to that target, and repeat from that square
    this.getJumps = function(piece, validTargets){

        //Piece we use to recurse
        var placementPiece = _.clone(piece, true);

        //Get our diagonals to test for jumps
        var diagonals = this.getValidDiagonals(placementPiece);
        var targetPiece, jumpTarget, newTargets, jumpedAlready;
        var self = this;
        //For each valid diagonal, check if there is a piece to jump
        _.each(diagonals, function(target){    
            targetPiece = this.getPiece(target);
            //If there is a piece to jump, check if the jump is valid
            if(targetPiece){
                jumpTarget = this.isValidJump(piece, targetPiece);
                
                //Then check if the jump has already happened
                jumpedAlready = _.find(validTargets, function(target){
                    return (jumpTarget[0] === target[0] && jumpTarget[1] === target[1]);
                });
                if(jumpTarget && !jumpedAlready){
                    //Get the position of our jump target, add it to results
                    validTargets.push(jumpTarget);
                    //Update our placement piece's position to the target of the jump
                    placementPiece.position = jumpTarget;

                    //Check all jumps for the placement piece's position
                    this.getJumps(placementPiece, validTargets);
                }
            }
        }, self);
        
        return (validTargets || false);
    };
        
     //Generates valid move targets for a given piece
    this.getValidDiagonals = function (piece){
        var targets = [];
        var upperRight = [piece.position[0] + 1, piece.position[1] + 1],
            lowerRight = [piece.position[0] + 1, piece.position[1] - 1],
            lowerLeft = [piece.position[0] - 1, piece.position[1] - 1],
            upperLeft = [piece.position[0] - 1, piece.position[1] + 1];

        if(upperRight[0] >= 0 && upperRight[0] <= 7 && upperRight[1] >= 0 && upperRight[1] <= 7 ){
            targets.push(upperRight);
        }
        if(lowerRight[0] >= 0 && lowerRight[0] <= 7 && lowerRight[1] >= 0 && lowerRight[1] <= 7 ){
            targets.push(lowerRight);
        }
        if(lowerLeft[0] >= 0 && lowerLeft[0] <= 7 && lowerLeft[1] >= 0 && lowerLeft[1] <= 7 ){
            targets.push(lowerLeft);
        }
        if(upperLeft[0] >= 0 && upperLeft[0] <= 7 && upperLeft[1] >= 0 && upperLeft[1] <= 7 ){
            targets.push(upperLeft);
        }

        return targets;
    };

    //Checks if a target is diagonal from a piece
    this.isDiagonal = function (piece, target){
        var targets = this.getValidDiagonals(piece);
        var isDiagonal = false;

        //Check the target against the valid targets
        _.each(targets, function(diagTarget){
           if (target[0] === diagTarget[0] && target[1] === diagTarget[1]){
               isDiagonal = true;
           }
        });    
        return isDiagonal;
    };
    
    //Returns an array of default pieces for an 8x8 game board : 8 black, 8 red with a black at [0,0] and a red at [7,7] alternately spaced.
    this.getDefaultPieces = function(){
        var pieces = [];

        var attrs = {};
        attrs.type = 'regular';

        //first do the first line of blacks
        attrs.color = 'red';
        var xpos, i;
        for(i = 0; i < 4; i++){
            xpos = i * 2;
            attrs.position = [xpos, 0];
            pieces.push(new Piece(attrs));
        }

        //then the second line of blacks
        for(i = 0; i < 4; i++){
            xpos = (i * 2) + 1;
            attrs.position = [xpos, 1];
            pieces.push(new Piece(attrs));
        }

        //then the first line of reds
        attrs.color = 'black';
        for(i = 0; i < 4; i++){
            xpos = i * 2;
            attrs.position = [xpos, 6];
            pieces.push(new Piece(attrs));
        }

        //then the second line of reds
        for(i = 0; i < 4; i++){
            xpos = (i * 2) + 1;
            attrs.position = [xpos, 7];
            pieces.push(new Piece(attrs));
        }

        return pieces;
    };
    
    //are_valid_moves
    //If there are any valid moves for a given color, return true. If not, return false
    this.areValidMoves = function(color){
        var areValidMoves = false;
        var counter = 0;
        
        //Get all the pieces of the given color
        var piecesOfColor = this.getColor(color);
        
        //If there are no pieces of a color, return false
        if (piecesOfColor){
            //Otherwise, check if there are valid targets for each of the pieces. Break on the first valid target
            while(areValidMoves === false && counter < piecesOfColor.length){
                if(this.getValidTargets(piecesOfColor[counter]).length > 0){
                    areValidMoves = true;
                }
                counter++;
            }

            return areValidMoves;
        }
        return false;
    };
    
    //getColor returns an array of pieces that are a given color
    this.getColor = function(color){
        //Get all pieces of a given color as an array
        var piecesOfColor = _.filter(this.pieces, function(piece){
           return (piece.color === color);
        });
        
        //If there are pieces, return the array, else return false
        if (piecesOfColor.length > 0 ){
            return piecesOfColor;
        }
        return false;
    };
    //move
    
    //remove_jumped : see remove_piece
    
    //reset
    //Resets the board, but keeps the players. Currently playing player will start
    this.reset = function(keepPlayers){
        
        keepPlayers = typeof keepPlayers !== 'undefined' ? keepPlayers : false;
        
        var attributes;
        if(keepPlayers){
            attributes.players = this.players;
        }
        
        this.pieces = this.getDefaultPieces();
        
    };
    //has_won
    //Checks if the given player has won the game. 
    //Returns "flawless" if the player has won by capturing all the opposing pieces
    //Returns "decision" if the player has won by more piece captures at a stalemate
    //Returns "tie" if there are no possible moves and the captured pieces are the same
    //Returns "loss" if the opponent has won the game -- Should only occur in the event of a decision loss
    //Returns false if the game has not ended
    this.hasWon = function(player){
        //Get the opponent's color
        var otherColor = player.color === 'black' ? 'red' : 'black';
        
        //If there are no pieces of the opponent's color, you win!
        if (!this.getColor(otherColor)){
            return "flawless";
        } 
        
        if (!this.areValidMoves('red') && !this.areValidMoves('black')){
        //If there are no valid moves for either player and you have captured more pieces, you win!
            if(this.getColor(player.color).length > this.getColor(otherColor).length){
                return "decision";
            //If the other player has captured more pieces, they win
            } else if (this.getColor(player.color).length < this.getColor(otherColor).length){
                return "loss";
            //If the same number of pieces have been captured, it's a tie
            } else {
                return "tie";
            }
        }
        
        //No-one has won this turn, continue with the game
        return false;
    };
    
    //remove_piece
    //Removes a piece from the board and returns it
    this.removePiece = function(piece){
        var index = this.pieces.indexOf(piece);
        return this.pieces.splice(index, 1);
    };
    
    //get_current_player
    //Returns the currently playing player
    this.getCurrentPlayer = function(){
        //It's player1's turn
        if(this.players.player1.isCurrentTurn === true){
            return this.players.player1;
        //It's player2's turn
        } else {
            return this.players.player2;
        }
    };
    
    //advance_turn
    //get_turn_time
    //get_game_time
    
    //Create a gameboard with default pieces if a pieces object is not passed
    if(typeof attrs !== 'undefined'){
        this.pieces = typeof attrs.pieces !== 'undefined' ? attrs.pieces : this.getDefaultPieces();
        this.players = typeof attrs.players !== 'undefined' ? attrs.players : { 
                                                                            player1 : new Player({isCurrentTurn : true, color : 'black'}),
                                                                            player2 : new Player({isCurrentTurn : false, color : 'red'})
                                                                          };
    } else {
        this.pieces = this.getDefaultPieces();
        this.players = { 
                            player1 : new Player({isCurrentTurn : true, color : 'black'}),
                            player2 : new Player({isCurrentTurn : false, color : 'red'})
                       }; 
    }
     
};


//Creates a piece with position, color, and type. 
//Position is given as an [x,y] array, color is either "black" or "red", and type is either "normal" or "king"
function Piece(attrs){
    this.position = typeof attrs.position !== 'undefined' ? attrs.position : [0,0];
    this.color = typeof attrs.color !== 'undefined' ? attrs.color : 'black';
    this.type = typeof attrs.type !== 'undefined' ? attrs.type : 'regular';
};

//Player has an isCurrentTurn variable which determines whether that player has the current turn
//   color which indicates color of pieces, either "black" or "red"
//  numWins, an int which stores number of wins for that player
function Player(attrs){
    this.isCurrentTurn = typeof attrs.isCurrentTurn !== 'undefined' ? attrs.isCurrentTurn : false;
    this.color = typeof attrs.color !== 'undefined' ? attrs.color : 'black';
    this.numWins = typeof attrs.numWins !== 'undefined' ? attrs.numWins : 0;
}

//Provides methods for rendering the gameboard to the page. 
//Gameboard is the gameboard to be rendered. 
//Target is a jQuery selector for the (div|canvas) to be rendered on.
function Renderer(gameboard, target){
    //jQuery representation of board HTML
    this.html;
    this.gameboard = gameboard;
    this.target = target;
    
    //createBoard
    //Creates HTML for the board to be drawn
    this.createBoard = function(){
        var piece, rowTag, pieceTag, squareColor;
        this.html = $('<div></div>').addClass('board-wrapper');
        for(var i = 0; i < 8; i++){
            rowTag = $('<div></div>').addClass('board-row').attr('id', 'row-' + i);
            this.html.append(rowTag);
            for(var j = 0; j < 8; j++){
                pieceTag = $('<div></div>').addClass('board-square');
                squareColor = this.getColor(i,j);
                pieceTag.addClass('square-' + squareColor).attr('id', 'square-' + i + j);
                piece = this.gameboard.getPiece([j,i]);
                if(piece){
                    pieceTag.addClass('piece-' + piece.color);
                }
                if(piece.type === "king"){
                    pieceTag.addClass('king');
                }
                this.html.find('.board-row:last-child').append(pieceTag);
            }
        }
        
        this.drawBoard();
    }
    
    //getSquareColor
    //Determines whether the background of a certain square should be rendered as black or red.
    //Returns the color to render.
    this.getColor = function(x, y){
        if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)){
            return 'black';
        } else {
            return 'red';
        }
    };
    //drawBoard
    //Draws the gameboard on the target
    this.drawBoard = function(){
        this.target.empty().append(this.html);
    }
    
    //startTimer
    //Starts a timer on the target
    
    //resetTimer
    //Resets a timer on the target
}

//Provides methods for playing the game
function Game(gameboard, renderer){
    
}

//Provides methods for getting a move for a player
function AI(){
    
}