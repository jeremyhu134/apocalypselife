//menu subclass
class MenuScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'MenuScene' })
	}
    //functions preloads sprites, images, and audio
    preload(){
        this.load.spritesheet('loading','images/loadingSprite.png',{frameWidth: 30,frameHeight:3});
        
        //people
        this.load.spritesheet('character','images/character.png',{frameWidth: 120,frameHeight:120});
        
        
       
        //zombies
        
        this.load.image('inventoryIcon','images/inventoryIcon.png');
        
        //objects
        
        this.load.spritesheet('background','images/background.png',{frameWidth: 1397,frameHeight:675});
        
        this.load.image('healthImage','images/healthImage.png');
        this.load.image('sprintIcon','images/sprintIcon.png'); 
        
        this.load.image('smallBullet','images/smallBullet.png');
        this.load.image('frame','images/frame.png');
        this.load.image('frame2','images/frame2.png');
        
        this.load.image('BLANK','images/BLANK.png');
        this.load.image('sprintImage','images/sprintImage.png');
        this.load.spritesheet('glock','images/glock.png',{frameWidth: 80,frameHeight:40});
        
        var progressBar = this.add.graphics();
        progressBar.x = window.innerWidth/2;
        var progressBox = this.add.graphics();
        progressBox.x = window.innerWidth/2;
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(window.innerWidth/2-810, 270, 320, 50);
        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(window.innerWidth/2-800, 280, 300 * value, 30);
        });
        this.load.on('fileprogress', function (file) {
        });
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
        });
        
    }
    create() {
        var scene = this;
        //set current scene to variable
        gameState.currentScene = "MenuScene";
        /*
    //audio
        //config for keeping sound loop
        gameState.loopSound = {
            loop: true,
            volume: .5
        }
          
        //Create variables for necessary sounds
        gameState.bgM = this.sound.add('menuBgMusic');
        gameState.bgM.setMute(false);
        gameState.bgM.play(gameState.loopSound,true);
        gameState.deathMusic = this.sound.add('death');
        
        //sounds added directly to the sound object
        this.sound.add('shoot');
        
        //mute music other than background music for menu (only if they are playing)
        if(gameState.bossM){
            gameState.bossM.setMute(true);
        } if (gameState.arenaM){
            gameState.arenaM.setMute(true);
        }if (gameState.tourM){
            gameState.tourM.setMute(true);
        }
        
        gameState.loadSave();
        
        
        //Loading Animation
        this.anims.create({
            key: 'load',
            frameRate: 18,
            frames:this.anims.generateFrameNames('loading',{start: 0,end: 16})
        });
        */
        this.anims.create({
            key: 'glockAction',
            frameRate: 14,
            frames:this.anims.generateFrameNames('glock',{start: 2,end: 3})
        });
        //sets global scene to variable for inside local functions
        gameState.globalScene = this;
        //create and animate background
        
        gameState.globalScene.scene.start('ArenaScene');
                
	}
    update(){
        //game loop that constantly runs (not needed for menu)
    }
}





























class ToursMenuScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'ToursMenuScene' })
	}
    preload(){
        //no preloads for this subclass
        
        //previews
        this.load.image('cityTourPreview','images/cityTourPreview.png');
        this.load.image('trampolineTourPreview','images/trampolineTourPreview.png');
    }
    create(){
        var selected = '';
        //mutes menu music
        gameState.bgM.setMute(true);
        //create and animate background
        var bg = this.physics.add.sprite(0,0,'background').setOrigin(0,0).setScale(window.innerHeight/675).setDepth(-100);
        bg.anims.play('bganimate','true');
        
        this.physics.add.image(0,0,'background').setOrigin(0,0).setScale(window.innerHeight/675).setDepth(-100);
        
        //Reference scene in local variable and create a back button
        var scene = this;
        
        
        if(gameState.bossM){
            gameState.bossM.setMute(true);
        } if (gameState.tourM){
            gameState.tourM.setMute(true);
        }
        
        
        var back = this.add.sprite(window.innerWidth-120,0,'homeIcon').setOrigin(0,0).setInteractive();
        back.on('pointerup', () => {
            //gameState.save();
            scene.scene.stop("LoadoutScene");
            scene.scene.start(`MenuScene`);
		});
        back.on('pointerover', () => {
            back.setFrame(1);
		});
        back.on('pointerout', () => {
            back.setFrame(0);
		});
        
        this.add.text(window.innerWidth/2-(window.innerWidth/4), 40, `City Tour`, {
            fill: '#000000', 
            fontSize: `30px`,
            fontFamily: 'Qahiri',
            strokeThickness: 4,
        }).setDepth(window.innerHeight+3).setOrigin(0.5);
        this.add.image(window.innerWidth/2-(window.innerWidth/4),window.innerHeight/2-(window.innerHeight/4)+50,'cityTourPreview').setScale(0.7);
        var tour1 = this.add.image(window.innerWidth/2-(window.innerWidth/4),window.innerHeight/2,'startButton').setInteractive();
        tour1.on('pointerdown', function(pointer){
            tour1.destroy();
            var loadingBar = scene.add.sprite(window.innerWidth/2-(window.innerWidth/4),window.innerHeight/2,'loading').setScale(5);
            loadingBar.anims.play('load',true);
            scene.time.addEvent({
                delay: 800,
                callback: ()=>{
                    gameState.tour = 'city';
                    scene.scene.start('TourScene');
                },  
                startAt: 0,
                timeScale: 1
            });
        });
        tour1.on('pointerover', function(pointer){
            scene.sound.play('click');
            tour1.setFrame(1);
        });
        tour1.on('pointerout', function(pointer){
            tour1.setFrame(0);
        });
        
        
        this.add.text(window.innerWidth/2+(window.innerWidth/4), 40, `Trampoline Tour`, {
            fill: '#000000', 
            fontSize: `30px`,
            fontFamily: 'Qahiri',
            strokeThickness: 4,
        }).setDepth(window.innerHeight+3).setOrigin(0.5);
        this.add.image(window.innerWidth/2+(window.innerWidth/4),window.innerHeight/2-(window.innerHeight/4)+50,'trampolineTourPreview').setScale(0.7);
        var tour2 = this.add.image(window.innerWidth/2+(window.innerWidth/4),window.innerHeight/2,'startButton').setInteractive();
        tour2.on('pointerdown', function(pointer){
            tour2.destroy();
            var loadingBar = scene.add.sprite(window.innerWidth/2+(window.innerWidth/4),window.innerHeight/2,'loading').setScale(5);
            loadingBar.anims.play('load',true);
            scene.time.addEvent({
                delay: 800,
                callback: ()=>{
                    gameState.tour = 'trampoline';
                    scene.scene.start('TourScene');
                },  
                startAt: 0,
                timeScale: 1
            });
        });
        tour2.on('pointerover', function(pointer){
            scene.sound.play('click');
            tour2.setFrame(1);
        });
        tour2.on('pointerout', function(pointer){
            tour2.setFrame(0);
        });
        
        //add gold icon and amound
        this.add.image(20,20,"coin").setOrigin(0,0).setDepth(-100).setScale(2);
        var coinsText = this.add.text(125, 40, `${gameState.thingsToSave.coins}`, {
            fill: '#ADD8E6', 
            fontSize: `30px`,
            fontFamily: 'Qahiri',
            strokeThickness: 4,
        }).setDepth(window.innerHeight+3);
        
        //merchant and interact
        
    }
    update(){
        //game loop that constantly runs (not needed for upgrades)
    }
}
