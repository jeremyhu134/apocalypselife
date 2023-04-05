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
        gameState.itemSlot[0] = gameState.weapons[0];
        gameState.itemSlot[2] = gameState.weapons[0];
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
        gameState.mouse = this.input.mousePointer;
        gameState.camera = this.cameras.main;
        this.physics.world.setBounds(0, 0, 5000, 5000);
        //game.scale.resize(5000, 5000);
        //create health icon and health bar
        gameState.character;
        //loop that spawns zombies every 3 seconds
        this.scene.launch('InventoryScene');
        this.scene.pause('InventoryScene');
        this.scene.bringToTop();
        var self = this;
        
        gameState.otherPlayers = this.physics.add.group();
        function addPlayer(self, playerInfo) {
            gameState.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (playerInfo.playerId === otherPlayer.playerId) {
                    otherPlayer.item.destroy();
                    otherPlayer.destroy();
                }
            });
            gameState.character = self.physics.add.sprite(playerInfo.x,playerInfo.y,`${gameState.skin}`).setDepth(1).setScale(1);
            gameState.character.id = playerInfo.playerId;
            self.cameras.main.startFollow(gameState.character);
            gameState.character.setSize(50,50);
            gameState.character.selected = null;
            gameState.character.item = self.add.sprite(playerInfo.x, playerInfo.y, 'BLANK').setDepth(0);
            gameState.character.selectedSlot = 0;
            gameState.character.firerate = 0;
            gameState.characterStats.createStats(this);
            gameState.playerLoaded = true;
            gameState.character.stats = {
                id: playerInfo.playerId,
                health: 100,
                angle: 0,
                x: 0,
                y: 0,
                trueX: 0,
                trueY: 0,
                selected: 'BLANK',
            };
            self.scene.launch('IconScene');
        }
        function addOtherPlayers(self, playerInfo) {
            var otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'character').setDepth(1);
            otherPlayer.item = self.add.sprite(playerInfo.x, playerInfo.y, 'BLANK').setDepth(0);
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
                    otherPlayer.item.destroy();
                    otherPlayer.destroy();
                }
            });
        });
        this.socket.on('updateStat', function (player,stats) {
            gameState.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (stats.id === otherPlayer.playerId) {
                    otherPlayer.x = stats.x;
                    otherPlayer.y = stats.y;
                    otherPlayer.setRotation(stats.angle);
                    otherPlayer.item.setRotation(stats.angle);
                    otherPlayer.item.x = stats.x;
                    otherPlayer.item.y = stats.y;
                    otherPlayer.trueX = stats.trueX;
                    otherPlayer.trueY = stats.trueY;
                    otherPlayer.item.setTexture(stats.selected.sprite);
                    otherPlayer.item.setFrame(1);
                }
            });
        });
        this.socket.on('itemUse', function (stats) {
            gameState.otherPlayers.getChildren().forEach(function (otherPlayer) {
                if (stats.id === otherPlayer.playerId) {
                    for(var i = 0 ; i < gameState.weapons.length; i++){
                        if(stats.selected.sprite == gameState.weapons[i].sprite && stats.selected.sprite !== "BLANK"){
                            gameState.weapons[i].action(self,otherPlayer);
                        }
                    }
                }
            });
        });
    }
    update(){
        //constantly loops these functions to the keyboard input is constantly tracked
        if(gameState.playerLoaded == true){
            gameState.characterControls(this,gameState.character,gameState.characterStats);
            gameState.socket.emit('stat', gameState.character,gameState.character.stats);
        }
    }
}



