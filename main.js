var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() { 
        game.stage.backgroundColor = '#00BFFF';

        game.load.image('bird', 'assets/bird.png');  
        game.load.image('pipe', 'assets/pipe.png'); 
        
        game.load.audio('jump', 'assets/jump.wav');      
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 
        
        this.jumpSound = game.add.audio('jump');  
        
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this); 
        
        this.bird.anchor.setTo(-0.2, 0.5);  

        this.score = -1;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
        
        
        
    },

    update: function() {
        
        if (this.bird.inWorld == false){
            this.restartGame(); 
        }
        
        if (this.bird.angle < 10)  
        this.bird.angle += 1;
        
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);     
    },
    
    hitPipe: function() {
        
    if (this.bird.alive == false){
        this.lastScore = this.game.add.text(180, 200, "10", { font: "180px sans-serif", fill: "#ffffff" });
        this.lastScore.text = this.score.toString(), { font: "bold 180px sans-serif", fill: "#fff", align: "center" };
        
        
        
    }

  
    this.bird.alive = false;

   
    game.time.events.remove(this.timer);

    this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
},

    jump: function() {
        if (this.bird.alive == false){  
            return;
        }
    
        this.bird.body.velocity.y = -350;
        
        this.jumpSound.play();  
        
        var animation = game.add.tween(this.bird);
        animation.to({angle: -10}, 400);
        animation.start();
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;     
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5 ) + 1;
        
        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole + 1) 
                this.addOnePipe(400, i * 60 + 10);   
    
        this.score += 1;
        this.labelScore.text = this.score;
        
         
    },
};

game.state.add('main', mainState);  
game.state.start('main'); 