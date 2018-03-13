
window.requestAnimFrame = function()
{
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

/** DAT GUI **/
var guiControls = new function(){

this.iMaxDrop = 800;

this.speed = 40;

this.wind = 3;

this.mouseBlock = 70;

}
var datGUI = new dat.GUI();
//j'ajoute a mon ui les variable
datGUI.add( guiControls, 'iMaxDrop', 100, 2000 );
datGUI.add( guiControls, 'speed', 10, 100 );
datGUI.add( guiControls, 'wind', -4, 4 );
datGUI.add( guiControls, 'mouseBlock', 0, 100 );


var meter = new FPSMeter();



/** global vars **/
var oSize = {
h : document.body.clientHeight,
w : document.body.clientWidth
};
var oMouse = {
x : -500,
y : -500
};
var oCanvas = document.getElementById('canvas');
var oCanvasCtx = oCanvas.getContext('2d');

oCanvas.height = oSize.h;
oCanvas.width = oSize.w;






update_mouse = function( _e ){

oMouse.y = _e.pageY;
oMouse.x = _e.pageX;

}
onresize = function () {
oSize.w = oCanvas.width = window.innerWidth;
oSize.h = oCanvas.height = window.innerHeight;
}
document.addEventListener('onresize', onresize, false);
document.addEventListener('mousemove', update_mouse, false);
window.onresize();





function drops() {

this.aDrops = [];
this.aExplode = [];


if ( typeof drops.initialized == "undefined" ) {

    drops.prototype.rand = function( min, max )
    {

        return Math.random() * ( max - min) + min;

    }

    drops.prototype.check_drop_collision = function( drop )
    {

        var radius = guiControls.mouseBlock;	

        var dx = oMouse.x - drop.x;		
        var dy = oMouse.y - drop.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // detection collion circle
        if ( distance < radius)
            return true;
        else
            return false;

    }

    drops.prototype.check_explode = function( drop ){

        if( drop.y > oSize.h )
            return true
        else
            return false;

    }



    drops.prototype.add_explode = function( drop ){

        var nb = this.rand( 2, 4 );

        for (var i = 0; i < nb; i++) {

            this.aExplode.push( this.build_explod( drop ) );

        };

    }

    drops.prototype.build_explod = function( drop )
    {
        
        var y = ( drop.y >  oSize.h )? oSize.h - 1 : drop.y  ;

        oExpl = {

            x 		: drop.x,

            speedx 	: this.rand( -2, 2 ),

            y 		: y,

            speedy  : this.rand( 1, 3 ),

            r 		: this.rand( 5, 10 ) / 10,

            a 		: drop.a,

            speeda  : this.rand( 3, 8 ),

            intens  : -5,

            ampl 	: this.rand( 3, 10 ),

            freq 	: this.rand( 3, 10 )


        }

        return oExpl;

    }



    drops.prototype.addDrop = function()
    {

        this.aDrops.push( this.build_drop() );
        
    };

    drops.prototype.build_drop = function()
    {


        oDrop = {

            x 		: this.rand( -100, oSize.w + 100 ),

            y 		: -this.rand( 50, 200 ),

            h 		: this.rand( 3, 15 ),

            a 		: this.rand( 1, 8 ),

            speedy 	: this.rand( guiControls.speed / 2.5, guiControls.speed ),

            speedx 	: guiControls.wind

        }

        return oDrop;

    };


    drops.prototype.update_rain = function(){

        var resetDrop 		= this.build_drop.bind( this );
        var check_exp 		= this.check_explode.bind( this );
        var do_exp 			= this.add_explode.bind( this );
        var check_mouse 	= this.check_drop_collision.bind( this );
        var length 			= this.aDrops.length;


        for (var i = this.aDrops.length - 1; i >= 0; i--) {

            this.aDrops[i]

            this.aDrops[i].x = this.aDrops[i].x + this.aDrops[i].speedx;

            this.aDrops[i].y = this.aDrops[i].y + this.aDrops[i].speedy;

            if( check_exp( this.aDrops[i] ) )
                do_exp( this.aDrops[i] );

            if( check_mouse( this.aDrops[i] ) ){

                do_exp( this.aDrops[i] );
                //drop = resetDrop();
                if( this.aDrops[i].x < oMouse.x ){

                    this.aDrops[i].x = oMouse.x - guiControls.mouseBlock;
                    this.aDrops[i].y--;
                                    
                }
                else{

                    this.aDrops[i].x = oMouse.x + guiControls.mouseBlock;
                    this.aDrops[i].y++;
                    
                }

            }

            if( check_exp( this.aDrops[i] ) && length < guiControls.iMaxDrop )
                this.aDrops[i] = resetDrop();

            if( this.aDrops[i].y > oSize.h && length >= guiControls.iMaxDrop )
                this.aDrops.splice(i, 1);


        };

    }



    drops.prototype.update_expl = function()
    {


        for (var i = this.aExplode.length - 1; i >= 0; i--) {

            this.aExplode[i].x = this.aExplode[i].x + this.aExplode[i].speedx;

            this.aExplode[i].y = this.aExplode[i].ampl * Math.sin( this.aExplode[i].intens / this.aExplode[i].freq ) + this.aExplode[i].y;

            this.aExplode[i].intens++;

            this.aExplode[i].a = this.aExplode[i].a - ( this.aExplode[i].speeda / 10 );
            

            if( this.aExplode[i].a <= 0 )
                this.aExplode.splice(i, 1);

        };

    }



    drops.prototype.draw = function( ctx )
    {

        for (var i = this.aDrops.length - 1; i >= 0; i--) {

            
            ctx.beginPath();
            ctx.moveTo( this.aDrops[i].x, this.aDrops[i].y);
            ctx.lineTo( this.aDrops[i].x + guiControls.wind, this.aDrops[i].y + this.aDrops[i].h );
            ctx.strokeStyle = 'rgba(200,230,255,' + ( this.aDrops[i].a / 10 ) + ')';
            ctx.stroke();

        };

        for (var i = this.aExplode.length - 1; i >= 0; i--) {

            
            ctx.beginPath();
            ctx.arc( this.aExplode[i].x, this.aExplode[i].y, this.aExplode[i].r, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(200,230,255,' + ( this.aExplode[i].a / 10 ) + ')';
            ctx.fill();

        };

    }




    drops.initialized = true;
}



}







var oRain = new drops();


/** ANIMATION **/
function render(){

oCanvasCtx.clearRect(0, 0, oSize.w, oSize.h );

if( oRain.aDrops.length < guiControls.iMaxDrop )
    oRain.addDrop();

oRain.update_rain();

oRain.update_expl();

oRain.draw( oCanvasCtx );

requestAnimationFrame( render );

document.getElementById('count').innerHTML = oRain.aDrops.length + " drops <br/> " + oRain.aExplode.length + " explodes" ;
meter.tick();

}
render();