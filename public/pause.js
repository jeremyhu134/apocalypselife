//pause screen subclass
class PauseScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'PauseScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create() {
        //makes it so pause screen covers the game screen
        this.scene.bringToTop();
        //adds image of the pause menu
        this.add.image(window.innerWidth/2,window.innerHeight/2,'pauseMenu');
        //references class so it can be used during the local functions
        var scene = this;
        
        //back button that unpaused game and resets keys current input
        var back = this.add.image(window.innerWidth-75,10,'backButton').setOrigin(0,0).setInteractive();
        back.on('pointerup', () => {
            //gameState.save();
            if(gameState.currentScene == "ArenaScene"){
                gameState.keys.W.isDown = false;
                gameState.keys.S.isDown = false;
                gameState.keys.A.isDown = false;
                gameState.keys.D.isDown = false;
                gameState.keys.SPACE.isDown = false;
            }
            scene.scene.stop("PauseScene");
            scene.scene.resume(`${gameState.currentScene}`);
		});
        
        //adds main menu image and button to return to main menu
        var mainMenu = this.add.image(window.innerWidth/2,window.innerHeight/2+200,'pauseMainMenuButton').setInteractive();
        mainMenu.on('pointerup', () => {
            scene.scene.stop(`${gameState.currentScene}`);
            scene.scene.stop("PauseScene");
            scene.scene.start("MenuScene");
		});
        // sets the highscore kills if player beats the highest kills
        if(gameState.kills> gameState.highestKills){
            gameState.highestKills = gameState.kills;
        }
        //prints the highest kills on the pause menu
        var highestKills = this.add.text(window.innerWidth/2-90, window.innerHeight/2+105, `${gameState.highestKills}`, {
            fill: 'WHITE', 
            fontSize: `30px`,
            fontFamily: 'Qahiri',
            strokeThickness: 4,
        }).setDepth(window.innerHeight+3);
        //save stats whenever paused
        //gameState.save();
	}
    update(){
        //game loop that constantly runs (not needed for pause)
    }
}



//unlock scene subclass
class UnlockScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'UnlockScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create() {
        
	}
    update(){
        //game loop that constantly runs (not needed for unlocking items)
    }
}



//subclass death scene 
class DeathScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'DeathScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create() {
        this.scene.bringToTop();
        gameState.deathMusic.play(gameState.loopSound);
        this.add.image(window.innerWidth/2,window.innerHeight/2,'deathMenu');
        var scene = this;
        if(gameState.kills> gameState.highestKills){
            gameState.highestKills = gameState.kills;
        }
        var mainMenu = this.add.image(window.innerWidth/2,window.innerHeight/2+200,'pauseMainMenuButton').setInteractive();
        mainMenu.on('pointerup', () => {
            gameState.deathMusic.setMute(true);
            scene.scene.stop(`${gameState.currentScene}`);
            scene.scene.stop("DeathScene");
            scene.scene.start("MenuScene");
		});
        //gameState.save();
	}
    update(){
        //game loop that constantly runs (not needed for death screen)
    }
}




class IconScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'IconScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create() {
        if(gameState.playerLoaded == true){
            var self = this;
            var inventoryOpen = false;
            this.scene.bringToTop();
            this.add.image(10,10,'healthImage').setScale(1.5).setOrigin(0,0);
            gameState.createHealthBar2(this,gameState.character,gameState.characterStats.health,55,15);
            this.add.image(500,15,'sprintImage').setScale(1.5).setOrigin(0,0);
            gameState.createSprintBar(this,gameState.character, gameState.characterStats.sprint,550,15);
            var inventoryIcon = this.add.image(1115,15,'inventoryIcon').setScale(1).setOrigin(0,0).setInteractive();
            inventoryIcon.on('pointerdown', function(pointer){
                if(inventoryOpen == false){
                    self.scene.launch('InventoryScene');
                    gameState.InventoryScene.scene.bringToTop();
                    inventoryOpen = true;
                }else{
                    self.scene.stop('InventoryScene');
                    inventoryOpen = false;
                }
            });
            
            function createSlot(scene,k){
                var slot = scene.add.image(800+100*k,10,'frame2').setOrigin(0,0).setInteractive();
                slot.on('pointerdown', function(pointer){
                    gameState.character.selectedSlot = k;
                });
                var slotItem = scene.add.image(800+100*k+40,10+40,'BLANK').setOrigin(0.5,0.5);
                scene.time.addEvent({
                    delay: 100,
                    callback: ()=>{
                        if(gameState.character.selectedSlot == k){
                            gameState.character.selected = gameState.itemSlot[k];
                            gameState.character.stats.selected = gameState.itemSlot[k];
                            if(gameState.itemSlot[k]== null || gameState.itemSlot[k]== `slot${k+1}`){
                                gameState.character.item.setTexture('BLANK');
                            }else{
                                gameState.character.item.setTexture(`${gameState.itemSlot[k].sprite}`);
                                gameState.character.item.setFrame(1);
                            }
                            slot.setTint(0xF0FF06,0xFFFFF6,0xFFFFF6,0xF0FF06);
                        }else{
                            slot.clearTint();
                        }
                        if(gameState.itemSlot[k]== null || gameState.itemSlot[k]== `slot${k+1}`){
                            gameState.itemSlot[k] = `slot${k+1}`;
                            slotItem.setTexture('BLANK');
                        }else{
                            slotItem.setTexture(`${gameState.itemSlot[k].sprite}`);
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1,
                });
            }
            for (var i = 0; i < gameState.itemSlot.length; i++){
                if(gameState.itemSlot[i] !== null){
                    
                }
                createSlot(self,i);
            }
        }
	}
    update(){
        //game loop that constantly runs (not needed for death screen)
    }
}

class InventoryScene extends Phaser.Scene {
    constructor() {
        //parameter for phaser class to allow phaser to reference subclass
		super({ key: 'InventoryScene' })
	}
    preload(){
        //no preloads for this subclass
    }
    create() {
        gameState.InventoryScene = this;
        this.scene.bringToTop();
        if(gameState.playerLoaded == true){
            gameState.loadInventory(this);
        }
	}
    update(){
        //game loop that constantly runs (not needed for death screen)
    }
}