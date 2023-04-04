//Create ArenaScene Phaser SubClass
class ArenaScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'ArenaScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create(){
        
        this.socket = io();
        //Variables to reference the scene globally
        gameState.currentScene = "ArenaScene";
        gameState.globalScene = this;
        //Background image and animation start
        this.physics.add.sprite(0,0,`background`).setDepth(0).setScale(10).setOrigin(0,0);
        
        gameState.socket = this.socket;
        //create block scope variables for mouse so the coordinates can be accessed everywhere
        gameState.input = this.input;
        gameState.mouse = this.input.mousePointer;
        //disables right click menu
        //this.input.mouse.disableContextMenu();
        //assigns cursors to track mouse
        gameState.cursors = this.input.keyboard.createCursorKeys();
        //assigns instances for the keys listed
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC');
        //creats phaser type of lists that make managing and creating zombies and bullets easy
        gameState.bullets = this.physics.add.group();
        gameState.zombies = this.physics.add.group();
        this.scene.launch('IconScene');
        gameState.camera = this.cameras.main;
        this.physics.world.setBounds(0, 0, 5000, 5000);
        //game.scale.resize(5000, 5000);
        //create health icon and health bar
        gameState.character;
        //loop that spawns zombies every 3 seconds
        var self = this;
        gameState.otherPlayers = this.physics.add.group();
        function addPlayer(self, playerInfo) {
            gameState.character = self.physics.add.sprite(playerInfo.x,playerInfo.y,`${gameState.skin}`).setDepth(0).setScale(1);
            gameState.character.id = playerInfo.playerId;
            self.cameras.main.startFollow(gameState.character);
            gameState.character.setSize(50,50);
            gameState.characterStats.createStats(this);
            gameState.playerLoaded = true;
            
        }
        function addOtherPlayers(self, playerInfo) {
            const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'character');
            otherPlayer.playerId = playerInfo.playerId;
            gameState.otherPlayers.add(otherPlayer);
        }
        //this.physics.add.overlap(gameState.blueprint, gameState.buildings)
        this.socket.on('currentPlayers', function (players) {
            
            Object.keys(players).forEach(function (id) {
                if (players[id].playerId === self.socket.id) {
                    
                    addPlayer(self, players[id]);
                }else{
                    addOtherPlayers(self,players[id]);
                }
            });
        });
        this.socket.on('newPlayer', function (playerInfo) {
            
            addOtherPlayers(self,playerInfo);
        });
        this.socket.on('disconnected', function (playerId) {
            gameState.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.destroy();
                }
            });
        });
        this.socket.on('moved', function (playerId,x,y,angle) {
            gameState.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerId === otherPlayer.playerId) {
                    otherPlayer.x = x;
                    otherPlayer.y = y;
                    otherPlayer.setRotation(angle);
                }
            });
        });
    }
    update(){
        //constantly loops these functions to the keyboard input is constantly tracked
        if(gameState.playerLoaded == true){
            gameState.characterControls(this,gameState.character,gameState.characterStats);
        }
    }
}



