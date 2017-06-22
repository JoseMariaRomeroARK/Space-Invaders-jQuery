$(document).ready(function() {
    /*Global variables*/
    var shoots = 0;
    var towards = true;
    var level = 0;
    var score = 0;
    var level_info_col = [6,8,10,12,6,8,10,12];//number of alines in the row
    var level_info_row = [2,2,2,2,3,3,3,3];//number of rows in the level
    /*Game Start Call*/
    palceCanon();
    /*Game logic*/
    // alies 50=minleft
    /*start-reset function*/
    $('#estadio').click(function(){
        shoots = 0;
        towards = true;
        level = 0;
        score = 0;
        $('#score').text(score);
        $('#level').text(level);
        $('#estadio').slideUp();
        $('.alien').remove();
        placeAliens();
        aliens_alive();
    });
     
    /*Keyup event (canon control)*/
    $(document).keyup(function(key) {
    	//$('p#hint').html(key.key+"="+parseInt(key.which,10));

        switch(parseInt(key.which,10)) {
			// A,Left arrow key pressed
			case 65:
			case 37:
                //Left barrier
                if ($('#canon').position().left>= 60) {
                    target_move($('#canon'),"left",10);
                }
				break;
			case 68:
			case 39:
                //Right barrier
                if (($('#canon').position().left + $('#canon').width())<= ($('.game-container').width()-60)) {
                    target_move($('#canon'),"right",10);
                }
				break;
            case 32:
                shoot();
                break;
		}
	});

    function win(){
        if (level<=level_info_col.length-1) {
            level++;
            $('#level').text(level+1);
            placeAliens();
            aliens_alive();
        }else{   
            $('#estadio').text("HEY! You win!(Click me to reset)");
            $('#estadio').show(500);
        }
    }
    function lose(){
        $('#estadio').text("Game Over!(Click me to reset)");
        $('#estadio').show(500);
    }
    /*Aliens and canon movement*/
    function target_move($target,direction,speed){
        switch(direction) {
            case "left":
                $target.animate({left: "-=15px"}, speed);
                break;
            case "up":
                $target.animate({top: "-=15px"}, speed);
                break;
            case "right":
                $target.animate({left: "+=15px"}, speed);
                break;
            case "down":
                $target.animate({top: "+=15px"}, speed);
                break;
        }
    }

    /*Shoot logic 
    Create a "Shoot"
    Display the shoot
    Create a Thread(interval)
    */
    function shoot(){
        shoots ++;
        var canon_position = $('#canon').position();
        var image = "<img class='shoot' id='"+shoots+
                    "'src='shoot.png' style='top:"+(canon_position.top - 10)+
                    "px; left:"+(canon_position.left + ($('#canon').width() / 2 - 2))+
                    "px;'/>";

        $('.game-container').append(image);
        var $image = $('#'+shoots);
        $image.animate({top: "0px"}, "slow");
        /*self-destructive thread 20 times per second*/
        var thread = window.setInterval(function($target){
            var top_position = $target.position().top;
            var hit = false;
            var $hit = 0;
            for (var i = 0; i <= $('.alien').length - 1; i++) {
                if(is_touching($target , $($('.alien')[i]))){
                    hit = true;
                    $hit = $($('.alien')[i]);
                    break;
                }
            }
            if (hit || top_position<=0) {
                $target.remove();
                if ($hit != 0) {
                    $hit.remove();
                    score++;
                    $('#score').text(score);
                }
                clearInterval(thread);
            }
            
        },50,$image);
       
    }
    /*Canon creation*/
    function palceCanon(){
        var canon = '<img id="canon" src="canon.png"/>';
        $('.game-container').append(canon);   
    }
    /*Aliens creation*/
    function placeAliens(){
    	var top = 40;
    	var left = 50;
        var alien = 0;
        for (var i = 0;  i <= level_info_row[level]-1; i++) {
            for (var j = 0; j <= level_info_col[level]-1; j++) {
                alien++;
                var image = "<img class='alien' id='alien-"+alien+"' src='alien.png' style='top:"+(top*i+50)+"px; left:"+(left*j+40)+"px;'/>";
                $('.game-container').append(image);
            }
        }
    }
    /*Aliens "AI"*/
    function aliens_alive(){
        var move = window.setInterval(function(){
            var $aliens = $('.alien');
            var left_max = $('.game-container').width();
            var right_max = 0;
            var bottom_max = 0;

            for (var i = 0; i <= $aliens.length - 1; i++) {
                var $alien = $($aliens[i]);
                var left = $alien.position().left;
                var right = left + $alien.width();
                var bottom = $alien.position().top + $alien.height();
                if(left<left_max){
                    left_max = left;
                }
                if (right>right_max){
                    right_max = right;
                }
                if (bottom>bottom_max){
                    bottom_max = bottom;
                }

            }
            /*if any alien is touching the left or right edge*/
            if (left_max <= 30 || right_max >= ($('.game-container').width()-30)) {
                towards = !towards;
                target_move($aliens,"down",'fast');
            }
            if (towards){ 
                target_move($aliens,"right",'fast'); 
            }else{ 
                target_move($aliens,"left",'fast');
            }
            
            /*if any alien is touching the bottom line or ther is no aliens (lose & win states)*/
            if (bottom_max >= ($('.game-container').height()-70)) {
                clearInterval(move);
                lose();
            }else if ($aliens.length ==0) {
                clearInterval(move);
                win();
            }
            
        },750);
    }
    /*Hit-box logic*/
    function is_touching($target1,$target2){
    	var T1Co = $target1.position();
    	var T2Co = $target2.position();

    	var Btop = ((T1Co.top + $target1.height()) >= T2Co.top )&&(T1Co.top <= (T2Co.top + $target2.height()));
    	var Bleft = (T1Co.left <= (T2Co.left + $target2.width()))&&((T1Co.left + $target1.width()) >= T2Co.left);
    	return (Btop && Bleft);

    }




});3