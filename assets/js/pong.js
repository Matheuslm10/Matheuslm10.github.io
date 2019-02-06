var canvas;
		var canvasContext;
		var ballX = 50;
		var ballY = 50;
		var ballSpeedX = 10;
		var ballSpeedY = 4;

		var player1Score = 0;
		var player2Score = 0;
		const WINNIN_SCORE = 3;

		var showingWinScreen = false;

		var paddle1Y = 250;
		var paddle2Y = 250;
		const PADDLE_THICKNESS = 10;
		const PADDLE_HEIGHT = 100;

		function calcultateMousePos(evt){
				var rect = canvas.getBoundingClientRect();
				var root = document.documentElement;
				var mouseX = evt.clientX - rect.left - root.scrollLeft;
				var mouseY = evt.clientY - rect.left - root.scrollLeft;
				return {
					x:mouseX,
					y:mouseY
				}
		}

		function handleMouseClick(){
			if(showingWinScreen){
				player1Score = 0;
				player2Score = 0;
				showingWinScreen = false;
			}
		}

		//faz com que o que está entre chaves só seja executado depois q tudo estiver carregado
		window.onload = function(){
			canvas = document.getElementById('gameCanvas');
			canvasContext = canvas.getContext('2d');

			var framesPerSecond = 30;
			setInterval(function() {
					moveEverything();
					drawEverything();
				}, 1000/framesPerSecond);

			//lida com o clique do mouse para continuar o jogo.
			canvas.addEventListener('mousedown', handleMouseClick);

			//faz a raquete seguir o mouse.
			canvas.addEventListener('mousemove',
				function(evt) {
					var mousePos = calcultateMousePos(evt);
					paddle1Y = mousePos.y-(PADDLE_HEIGHT/3);
				});
		}

		//responsável por determinar o que acontece com a bola quando ela atinge a parede do jogador
		function ballReset(){
			if(player1Score >= WINNIN_SCORE || player2Score >= WINNIN_SCORE){
				showingWinScreen = true;
			}

			ballSpeedX = -ballSpeedX;
			ballX = canvas.width/2;
			ballY = canvas.height/2;
		}

		function computerMovement(){
			var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
			if(paddle2YCenter < ballY-35){
				paddle2Y += 6;
			}else if(paddle2YCenter > ballY+35){
				paddle2Y -= 6;
			}
		}

		//responsável por mover a bola de um lado para o outro.
		function moveEverything(){
			if(showingWinScreen == true){
				return;
			}

			computerMovement();

			ballX += ballSpeedX;
			ballY += ballSpeedY;

			if(ballX < 0){
				if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
					ballSpeedX = -ballSpeedX;

					var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
					ballSpeedY = deltaY * 0.35;

				}else{					
					player2Score++;//deve ser antes do ballReset()
					ballReset();
				}
				
			}
			if(ballX > canvas.width){
				if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
					ballSpeedX = -ballSpeedX;

					var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
					ballSpeedY = deltaY * 0.35;


				}else{
					player1Score++; //deve ser antes do ballReset()
					ballReset();
				}
			}
			if(ballY < 0){
				ballSpeedY = -ballSpeedY;
			}
			if(ballY > canvas.height){
				ballSpeedY = -ballSpeedY;
			}

		}

		function linhaDoMeio() {
			for (var i=0; i<canvas.height; i+=40) {
				colorRect(canvas.width/2-1, i, 2, 20, 'white');
			}
		}

		function drawEverything(){
			//desenha o retangulo preto, que é a tela do jogo
			colorRect(0,0,canvas.width,canvas.height, 'black');

			if(showingWinScreen){
				canvasContext.fillStyle = 'white';

				if(player1Score >= WINNIN_SCORE){
					canvasContext.fillText("Você ganhou!", (canvas.width/2)-19.5, canvas.height/2-30);
				}else if(player2Score >= WINNIN_SCORE){
					canvasContext.fillText("Você perdeu!", (canvas.width/2)-19.5, (canvas.height/2)-30);
				}
				
				canvasContext.fillText("Clique para jogar novamente.", (canvas.width/2)-60, canvas.height/2);
				return;
			}

			linhaDoMeio();

			//desenha a raquete do jogador
			colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');

			//desenha a raquete do computador
			colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');

			//desenha a bola
			colorCircle(ballX, ballY, 10, 'white');

			canvasContext.fillText(player1Score, 100, 100);
			canvasContext.fillText(player2Score, canvas.width-100, 100);
					
		}

		//responsável por desenhar a bola
		function colorCircle(centerX, centerY, radius, drawColor){
			canvasContext.fillStyle = drawColor;	
			canvasContext.beginPath();
			canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
			canvasContext.fill()
		}

		function colorRect(leftX, topY, width, height, drawColor){
			canvasContext.fillStyle = drawColor;
			canvasContext.fillRect(leftX, topY, width, height);
		}