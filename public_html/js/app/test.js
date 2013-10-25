/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function Tests(){
    this.runTests = function(){
        var gameboard = new GameBoard();
       
       console.log('Gameboard: ', gameboard);
       
       var pieces = gameboard.pieces;
       console.log('Pieces: ', pieces);
       
       var piece1 = gameboard.getPiece([0,0]);
       var piece2 = gameboard.getPiece([0,1]);
       console.log('GetPiece [0,0] (true) and [0,1] (false)', piece1, piece2);
       
       var piece3 = gameboard.getPiece([1,1]);
       console.log('Valid moves for black piece [1,1] ([0,2] and [2,2]): ', gameboard.getValidTargets(piece3));
       
       var piece4 = gameboard.getPiece([7,7]);
       piece4.position = [2,2];
       
       console.log('Moved [7,7] to [2,2]', piece4);
       
       console.log('New valid moves for [1,1] ([0,2] and [3,3])', gameboard.getValidTargets(piece3));
       
       console.log('Is piece3 still [1,1]?', piece3);
       
       var piece5 = gameboard.getPiece([5,7]);
       piece5.position = [2,4];
       
       console.log('Moved [5,7] to [2,4]', piece5);
       
       console.log('New valid moves for [1,1] ([0,2], [3,3], and [1,5])', gameboard.getValidTargets(piece3));
       
       piece5.position = [3,3];
       console.log('Moved [2,4] to [3,3]', piece5);
       
       console.log('New valid moves for [1,1] ([0,2])', gameboard.getValidTargets(piece3));
       
       piece5.position = [2,4];
       var piece6 = gameboard.getPiece([3,7]);
       piece6.position = [2,7];
       
       console.log(gameboard.getValidTargets(piece3));
       
       piece3.type = 'king';
       
       console.log(gameboard.getValidTargets(piece3));
       
       var piece7 = gameboard.getPiece([3,1]);
       piece6.position = [4,2];
       
       console.log(gameboard.getValidTargets(piece7));
       
       console.log('Pieces of color red: ', gameboard.getColor('red'));
       
       console.log('Are there moves for red? ', gameboard.areValidMoves('red'));
       
       console.log('Pieces of color blue: ', gameboard.getColor('blue'));
       
       console.log('Valid moves for blue: ', gameboard.areValidMoves('blue'));
       gameboard.pieces.push(new Piece({color : 'blue', position : [7,0]}));
       var piece8 = gameboard.getPiece([5,1]);
       piece8.position = [6,1];
       var piece9 = gameboard.getPiece([4,0]);
       piece9.position = [5,2];
       
       console.log('Pieces of color blue: ', gameboard.getColor('blue'));
       
       console.log('Valid moves for blue: ', gameboard.areValidMoves('blue'));
       
       console.log('Valid moves for [7,0] ', gameboard.getValidTargets(gameboard.getPiece([7,0])));
       
       gameboard.removePiece(gameboard.getPiece([7,0]));
       
       console.log('Removed piece [7,0] - Pieces of color blue ', gameboard.getColor('blue'));
       
       console.log('Has either side won?', gameboard.hasWon(gameboard.players.player1), gameboard.hasWon(gameboard.players.player2));
    
       console.log('Remove all red');
       
       var counter = 0;
       while(counter < gameboard.pieces.length){
           if (gameboard.pieces[counter].color === 'red'){
              gameboard.removePiece(gameboard.pieces[counter]);
          } else {
              counter++;
          }
       }
       _.each(gameboard.pieces, function(piece){
          
       });
       
       console.log('Has either side won?', gameboard.hasWon(gameboard.players.player1), gameboard.hasWon(gameboard.players.player2));

       console.log('Current players', gameboard.players.player1, gameboard.players.player2);
       
       var renderer = new Renderer(gameboard, $('#checkers'));
       
       renderer.createBoard();
       
       //renderer.drawBoard();
       
       gameboard.reset();
       renderer.createBoard();
   };
}