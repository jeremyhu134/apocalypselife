//The configuration of your game that is a parameter of the Phaser.Game function
const config = {
    type: Phaser.AUTO,
    width : 1200,
    height: 675,
    backgroundColor: "#999999",
    audio: {
        disableWebAudio: false 
      },
    //allows modification of the games physics
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
           // debug: true
        }
    },
    //subclass scenes 
    scene:[MenuScene,PauseScene,ArenaScene,UpgradeScene,DeathScene,ShopScene,UnlockScene,LoadoutScene,LootboxesScene,IconScene,InventoryScene],
    //phasers scale system to fit into the brower
    scale: {
        zoom: 10,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

//creats a game game object with the configuration
const game = new Phaser.Game(config);

//create a block-scoped object that stores variables that can be accessed in any scene
let gameState = {
    coinsAdd: 3,
    //character stats constants
    characterStats: {
        speed : 150,
        health: 100,
        ammo: 25,
        fireRate: 175,
        damage: 25,
        bulletSpeed: 1500,
        fireReady: true,
        sprint: 100,
        createStats:function(scene){
            gameState.character.speed = gameState.characterStats.speed;
            gameState.character.health = gameState.characterStats.health;
            gameState.character.sprint = gameState.characterStats.sprint;
        }
    },
    
    
    
    selected: ' ',
    pick: null,
    //current sprite for bullet and player
    skin: 'character',
    bulletSkin: 'bullet1',
    
    gunType: 'assaultRifle',
    gunSkin: 'assaultRifle',
    //unlocked skins and their names and bullet sprites
    items: [
        {
            owned: 0,
            type: 'cosmetic',
            name: 'satvikHat',
            displayName: 'Satvik',
            animate: false,
            rarity: 'rare'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'susHat',
            displayName: 'Sus',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'finnHat',
            displayName: 'Finn Hat',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'vikingHelmetHat',
            displayName: 'Viking Helmet',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'roboHelmetHat',
            displayName: 'Robo-Helmet',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'helmetHat',
            displayName: 'Helmet',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'partyHat',
            displayName: 'Party Helmet',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'diegoHat',
            displayName: 'Happy Diego',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'diego2Hat',
            displayName: 'Rambo Diego',
            animate: false,
            rarity: 'rare'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'burningHelmetHat',
            displayName: 'Burning Helmet',
            animate: true,
            rarity: 'epic'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'ghastlySkullHat',
            displayName: 'Ghastly Skull',
            animate: true,
            rarity: 'legendary'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'chadvikHat',
            displayName: 'Chadvik',
            animate: false,
            rarity: 'rare'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'roidRagePhilHat',
            displayName: 'Roid Rage Phil',
            animate: true,
            rarity: 'epic'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'footballHat',
            displayName: 'Football Helmet',
            animate: false,
            rarity: 'common'
        },
        {
            owned: 0,
            type: 'cosmetic',
            name: 'baseballHat',
            displayName: 'Baseball Helmet',
            animate: false,
            rarity: 'common'
        },
        
        
        //weapons
        {
            owned: 0,
            type: 'weapon',
            name: 'assaultRifleFuture',
            displayName: 'Future Assault Rifle',
            animate: false,
            rarity: 'rare'
        }
    ],
    
    itemSlot:[null,null,null],
    inventory:[[null,null,null,null],[null,null,null,null],[null,null,null,null]],
    loadInventory: function(scene){
        var k = 0;
        for (var i = 0; i < gameState.inventory.length; i++){
            for (var j = 0; j < gameState.inventory[i].length; j++){
                if(gameState.inventory[i][k] !== null){
                    
                }
                scene.add.image(800+100*j,100+i*100,'frame2').setOrigin(0,0);
                k++;
            }
        }
        
    },
    
    
    
    weapons:[
        {
            sprite:'glock',
            damage: 10,
            firerate: 10,
            action: function(scene,player){
                player.item.anims.play('glockAction',true);
                var bullet = gameState.bullets.create(player.x,player.y,'smallBullet');
                bullet.setRotation(Phaser.Math.Angle.Between(player.x,player.y,player.trueX,player.trueY));
                scene.physics.moveTo(bullet,player.trueX,player.trueY,600);
            }
        }
    ],
    
    
    thingsToSave: {
        numLootboxes: 5,
        coins: 100,
        date: Date.UTC,
        shopItems:[0,0,0,0]
    },
    //saves variable values to local storage
    save: function(){
        window.localStorage.setItem("inventory", JSON.stringify(gameState.inventory));
        window.localStorage.setItem("thingsToSave", JSON.stringify(gameState.thingsToSave));
    },
    //loads variable values from localstorage
    loadSave: function(){
        if(JSON.parse(window.localStorage.getItem("inventory")) !== null){
            gameState.inventory = JSON.parse(window.localStorage.getItem("inventory"));
        }
        if(JSON.parse(window.localStorage.getItem("thingsToSave")) !== null){
            gameState.thingsToSave = JSON.parse(window.localStorage.getItem("thingsToSave"));
        }
    },
    
    //controls that constantly are looped in the Arena Screen
    characterControls : function(scene){
        if(gameState.character.health > 0){
            gameState.character.trueX = scene.input.x+gameState.character.x-600;
            gameState.character.trueY = scene.input.y+gameState.character.y-338;
            gameState.character.item.x = gameState.character.x;
            gameState.character.item.y = gameState.character.y;
            
            gameState.character.body.checkWorldBounds();
            var angle = Phaser.Math.Angle.Between(gameState.character.x,gameState.character.y,gameState.character.trueX,gameState.character.trueY);
            gameState.character.stats.angle = angle;
            gameState.character.stats.x = gameState.character.x;
            gameState.character.stats.y = gameState.character.y;
            gameState.character.setRotation(Phaser.Math.Angle.Between(gameState.character.x,gameState.character.y,gameState.character.trueX,gameState.character.trueY)); 
            gameState.character.item.setRotation(angle);
            if(gameState.keys.D.isDown && gameState.keys.S.isDown){
                gameState.character.setVelocityX(gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
                gameState.character.setVelocityY(gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
            }
            else if(gameState.keys.D.isDown && gameState.keys.W.isDown){
                gameState.character.setVelocityX(gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
                gameState.character.setVelocityY(-gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
            }
            else if(gameState.keys.A.isDown && gameState.keys.W.isDown){
                gameState.character.setVelocityX(-gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
                gameState.character.setVelocityY(-gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
            }
            else if(gameState.keys.A.isDown && gameState.keys.S.isDown){
                gameState.character.setVelocityX(-gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
                gameState.character.setVelocityY(gameState.character.speed*Math.sin(Phaser.Math.Angle.Between(0,0,1,1)));
            }
            else if(gameState.keys.W.isDown){
                gameState.character.setVelocityX(0);
                gameState.character.setVelocityY(-gameState.character.speed);
            }
            else if(gameState.keys.S.isDown){
                gameState.character.setVelocityX(0);
                gameState.character.setVelocityY(gameState.character.speed);
            }
            else if(gameState.keys.A.isDown){
                gameState.character.setVelocityY(0);
                gameState.character.setVelocityX(-gameState.character.speed);
            }
            else if(gameState.keys.D.isDown){
                gameState.character.setVelocityY(0);
                gameState.character.setVelocityX(gameState.character.speed);
            }
            else{
                gameState.character.setVelocityX(0);
                gameState.character.setVelocityY(0);
            }
            if(gameState.keys.SHIFT.isDown && gameState.character.sprint > 0){
                if(gameState.character.speed < gameState.characterStats.speed * 2){
                    gameState.character.speed *= 2;
                }
                gameState.character.sprint -= 0.5;
            }else{
                if(gameState.character.sprint < gameState.characterStats.sprint){
                    gameState.character.sprint += 0.1;  
                }else{
                    gameState.character.sprint = gameState.characterStats.sprint;
                }
                if(gameState.character.speed > gameState.characterStats.speed){
                    gameState.character.speed /= 2;
                }
            }
            gameState.character.stats.trueX = gameState.character.trueX;
            gameState.character.stats.trueY = gameState.character.trueY;
            if(gameState.keys.ONE.isDown){
                gameState.character.selectedSlot = 0;
                gameState.socket.emit('itemChanged', gameState.character.id,gameState.character.selected,angle);
            }else if(gameState.keys.TWO.isDown){
                gameState.character.selectedSlot = 1;
                gameState.socket.emit('itemChanged', gameState.character.id,gameState.character.selected,angle);
            }else if(gameState.keys.THREE.isDown){
                gameState.character.selectedSlot = 2;
                gameState.socket.emit('itemChanged', gameState.character.id,gameState.character.selected,angle);
            }
            gameState.character.firerate -= 1;
            if(gameState.mouse.isDown){
                if(gameState.character.selected !== null && gameState.character.selected !== "slot1" && gameState.character.selected !== "slot2" && gameState.character.selected !== "slot3"){
                    if(gameState.character.firerate <= 0){
                        gameState.character.selected.action(scene,gameState.character);
                        gameState.socket.emit('itemUsed', gameState.character.stats);
                        gameState.character.firerate = gameState.character.selected.firerate;
                    }
                }
            }
        }
    },
    //functions to reload ammo
    reload: function (scene){
        if(gameState.characterStats.fireReady == true && gameState.disableReload == false){
            gameState.characterStats.fireReady = false;
            var clip = scene.physics.add.image(gameState.character.x+5, gameState.character.y+12, 'gunMagazine').setGravityY(1000);
            if (gameState.character.x > scene.input.x){
                clip.flipX = true;
            }
            clip.depth = clip.y +1;
            var time = 0;
            if(gameState.gunType == 'assaultRifle'){
                gameState.ammo = gameState.characterStats.ammo;
                time = 1500
            }else if(gameState.gunType == 'minigun'){
                gameState.ammo = gameState.characterStats.ammo*8;
                time = 4000
            }
            else if(gameState.gunType == 'rocketLauncher'){
                gameState.ammo = Math.ceil(gameState.characterStats.ammo/4.17)
                time = 2500
            }
            else if(gameState.gunType == 'uzi'){
                gameState.ammo = Math.ceil(gameState.characterStats.ammo*1.2)
                time = 1000;
            }
            else if(gameState.gunType == 'sniperRifle'){
                gameState.ammo = Math.ceil(gameState.characterStats.ammo*0.4)
                time = 1500;
            }
            else if(gameState.gunType == 'shotgun'){
                gameState.ammo = Math.ceil(gameState.characterStats.ammo*0.24)
                time = 1800;
            }
            
            scene.time.addEvent({
                delay: time,
                callback: ()=>{
                    gameState.ammoText.setText(gameState.ammo);
                    gameState.characterStats.fireReady = true;
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    clip.setGravityY(0);
                    clip.setVelocityY(0);
                    scene.time.addEvent({
                        delay: 3000,
                        callback: ()=>{
                            clip.destroy();
                        },  
                        startAt: 0,
                        timeScale: 1
                    });
                },  
                startAt: 0,
                timeScale: 1
            });
        }
    },
    
    
    assaultRifleShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        var flash;
        var bullet;
        if (gameState.character.flipX == false){
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.gunSkin}bullet`);
        }else {
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.gunSkin}bullet`);
        }
        gameState.gun.anims.play(`${gameState.gunSkin}flash`,true);
        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,scene.input.x,scene.input.y);
        bullet.setRotation(gameState.angle); 
        scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
        //scene.physics.moveTo(bullet,scene.input.x,scene.input.y,300);
        var bulletLoop = scene.time.addEvent({
            delay: 5000,
            callback: ()=>{
                bullet.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.physics.add.overlap(bullet, gameState.zombies,(bulletT, target)=>{
            scene.sound.play('hitSound',{volume:0.2});
            var angle = Phaser.Math.Angle.Between(bulletT.x,bulletT.y,target.x,target.y);
            var blood = scene.physics.add.sprite(target.x+10,target.y, 'bulletBlood');
            blood.setRotation(angle);
            blood.anims.play('animate','true');
            scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    blood.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            bulletLoop.destroy();
            if(target.health>0){
                bulletT.destroy();
            }
            target.health -= gameState.damage;
        });
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    minigunShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        var flash;
        var bullet;
        if (gameState.character.flipX == false){
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }else {
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }
        gameState.gun.anims.play('minigunflash',true);
        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,scene.input.x,scene.input.y);
        bullet.setRotation(gameState.angle); 
        //scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
        scene.physics.moveTo(bullet,(scene.input.x-50)+Math.ceil(Math.random()*100),(scene.input.y-50)+Math.ceil(Math.random()*100),gameState.characterStats.bulletSpeed);
        var bulletLoop = scene.time.addEvent({
            delay: 5000,
            callback: ()=>{
                bullet.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.physics.add.overlap(bullet, gameState.zombies,(bulletT, target)=>{
            scene.sound.play('hitSound',{volume:0.2});
            var angle = Phaser.Math.Angle.Between(bulletT.x,bulletT.y,target.x,target.y);
            var blood = scene.physics.add.sprite(target.x+10,target.y, 'bulletBlood');
            blood.setRotation(angle);
            blood.anims.play('animate','true');
            scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    blood.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            bulletLoop.destroy();
            if(target.health>0){
                bulletT.destroy();
            }
            target.health -= gameState.damage;
        });
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    rocketLauncherShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        var flash;
        var bullet;
        var target = {
            x: scene.input.x,
            y: scene.input.y
        }
        if (gameState.character.flipX == false){
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }else {
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }
        gameState.gun.anims.play('rocketLauncherflash',true);
        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,scene.input.x,scene.input.y);
        bullet.setRotation(gameState.angle); 
        scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
        //scene.physics.moveTo(bullet,scene.input.x,scene.input.y,300);
        var bulletLoop = scene.time.addEvent({
            delay: 5000,
            callback: ()=>{
                bullet.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.time.addEvent({
            delay: (Phaser.Math.Distance.BetweenPoints(bullet, target)/gameState.characterStats.bulletSpeed)*1000,
            callback: ()=>{
                if( gameState.zombies.getChildren().length >0){
                    scene.sound.play('explode',{ volume: 0.5 });
                    var explosion = scene.physics.add.sprite(bullet.x,bullet.y,'');
                    explosion.anims.play('explode','true');
                    scene.time.addEvent({
                        delay: 1000,
                        callback: ()=>{
                            explosion.destroy();
                        },  
                        startAt: 0,
                        timeScale: 1
                    });
                    bullet.destroy();
                    var maxKills = 10;
                    for (var i = 0; i < gameState.zombies.getChildren().length; i++){
                        if(Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], bullet)<150&&maxKills>0){
                            gameState.zombies.getChildren()[i].health -= gameState.damage;
                            maxKills--;
                        }
                    }
                } 
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    
    uziShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        var flash;
        var bullet;
        if (gameState.character.flipX == false){
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }else {
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
        }
        gameState.gun.anims.play('uziflash',true);
        //scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
        var bx = (scene.input.x-100)+Math.ceil(Math.random()*200);
        var by = (scene.input.y-100)+Math.ceil(Math.random()*200);
        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,bx,by);
        bullet.setRotation(gameState.angle); 
        scene.physics.moveTo(bullet,bx,by,gameState.characterStats.bulletSpeed);
        var bulletLoop = scene.time.addEvent({
            delay: 5000,
            callback: ()=>{
                bullet.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.physics.add.overlap(bullet, gameState.zombies,(bulletT, target)=>{
            scene.sound.play('hitSound',{volume:0.2});
            var angle = Phaser.Math.Angle.Between(bulletT.x,bulletT.y,target.x,target.y);
            var blood = scene.physics.add.sprite(target.x+10,target.y, 'bulletBlood');
            blood.setRotation(angle);
            blood.anims.play('animate','true');
            scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    blood.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            bulletLoop.destroy();
            if(target.health>0){
                bulletT.destroy();
            }
            target.health -= gameState.damage;
        });
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    
    sniperRifleShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        var flash;
        var bullet;
        if (gameState.character.flipX == false){
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.gunSkin}bullet`);
        }else {
            bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.gunSkin}bullet`);
        }
        gameState.gun.anims.play(`${gameState.gunSkin}flash`,true);
        gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,scene.input.x,scene.input.y);
        bullet.setRotation(gameState.angle); 
        scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
        //scene.physics.moveTo(bullet,scene.input.x,scene.input.y,300);
        var bulletLoop = scene.time.addEvent({
            delay: 5000,
            callback: ()=>{
                bullet.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
        scene.physics.add.overlap(bullet, gameState.zombies,(bulletT, target)=>{
            scene.sound.play('hitSound',{volume:0.2});
            var angle = Phaser.Math.Angle.Between(bulletT.x,bulletT.y,target.x,target.y);
            var blood = scene.physics.add.sprite(target.x+10,target.y, 'bulletBlood');
            blood.setRotation(angle);
            blood.anims.play('animate','true');
            scene.time.addEvent({
                delay: 200,
                callback: ()=>{
                    blood.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            bulletLoop.destroy();
            if(target.health>0){
                bulletT.destroy();
            }
            target.health -= gameState.damage;
        });
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    shotgunShoot: function(scene){
        scene.sound.play('shoot');
        gameState.ammo --;
        gameState.ammoText.setText(gameState.ammo);
        gameState.characterStats.fireReady = false;

        function shoot(scene){
            var flash;
            var bullet;
            if (gameState.character.flipX == false){
                bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
            }else {
                bullet = gameState.bullets.create(gameState.character.x,gameState.character.y+3,`${gameState.bulletSkin}`);
            }
            gameState.gun.anims.play(`${gameState.gunSkin}flash`,true);
            gameState.angle=Phaser.Math.Angle.Between(bullet.x,bullet.y,scene.input.x,scene.input.y);
            bullet.setRotation(gameState.angle); 
            //scene.physics.moveToObject(bullet,scene.input,gameState.characterStats.bulletSpeed);
            scene.physics.moveTo(bullet,(scene.input.x-50)+Math.ceil(Math.random()*100),(scene.input.y-50)+Math.ceil(Math.random()*100),gameState.characterStats.bulletSpeed);
            var bulletLoop = scene.time.addEvent({
                delay: 150,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, gameState.zombies,(bulletT, target)=>{
                scene.sound.play('hitSound',{volume:0.2});
                var angle = Phaser.Math.Angle.Between(bulletT.x,bulletT.y,target.x,target.y);
                var blood = scene.physics.add.sprite(target.x+10,target.y, 'bulletBlood');
                blood.setRotation(angle);
                blood.anims.play('animate','true');
                scene.time.addEvent({
                    delay: 200,
                    callback: ()=>{
                        blood.destroy();
                    },  
                    startAt: 0,
                    timeScale: 1
                });
                bulletLoop.destroy();
                if(target.health>0){
                    bulletT.destroy();
                }
                target.health -= gameState.damage;
            });
        }
        for (var i = 0; i< 7;i++){
            shoot(scene)
        }
        
        scene.time.addEvent({
            delay: gameState.fireRate,
            callback: ()=>{
                gameState.characterStats.fireReady = true;
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    
    
    
    
    //creates a randon powerup or item after zombie death
    createItem: function(scene,x,y){
        var random = Math.ceil(Math.random()*100);
        if(random <= 50){
            var coin = scene.physics.add.sprite(x,y,'coin');
            coin.anims.play('canimate','true');
            var gone = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    coin.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(gameState.character, coin,(character, coin)=>{
                scene.sound.play('coinSound',{volume:0.05});
                var rand = Math.ceil(Math.random()*2)+gameState.coinsAdd;
                gameState.thingsToSave.coins += rand;
                coin.destroy();
                gone.destroy();
            });
        }
        else if(random<=100 && random >=98){
            var iBI = scene.physics.add.sprite(x,y,'infiniteBulletsImage');
            iBI.anims.play('shine','true');
            var gone = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    iBI.destroy();
                }, 
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(gameState.character, iBI,(character, iBI)=>{
                scene.sound.play('powerUp');
                gameState.disableReload = true;
                iBI.destroy();
                gone.destroy();
                gameState.fireRate = gameState.fireRate - 35;
                gameState.ammo = 9999;
                gameState.createTimer(scene,10,60,'infiniteBulletsImage');
                scene.time.addEvent({
                    delay: 10000,
                    callback: ()=>{
                        gameState.fireRate = gameState.currentRate;
                        if(gameState.gunType == 'assaultRifle'){
                             gameState.ammo = gameState.characterStats.ammo;
                        }else if(gameState.gunType == 'minigun'){
                             gameState.ammo = gameState.characterStats.ammo*8;
                        }else if(gameState.gunType == 'rocketLauncher'){
                             gameState.ammo = Math.ceil(gameState.characterStats.ammo/4.17);
                        }else if(gameState.gunType == 'uzi'){
                             gameState.ammo = Math.ceil(gameState.characterStats.ammo*1.2);
                        }
                        gameState.disableReload = false;
                    },  
                    startAt: 0,
                    timeScale: 1
                });
            });
        }
        else if(random<=95 && random >=90){
            var grenade = scene.physics.add.sprite(x,y,'grenadeImage');
            grenade.anims.play('shine2','true');
            var gone = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    grenade.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(gameState.character, grenade,(character, grenade)=>{
                gone.destroy();
                grenade.destroy();
                if(gameState.bossBattle == false){
                    var gren = scene.physics.add.sprite(gameState.character.x,gameState.character.y,'grenadeObj');
                    if( gameState.zombies.getChildren().length >0){
                        var closest = 10000;
                        var dist;
                        var target;
                        for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                            dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], gameState.character);
                            if(dist<closest){
                                closest = dist;
                                target = gameState.zombies.getChildren()[i];
                            }
                        }
                        scene.physics.moveToObject(gren,target,0,500);
                        scene.time.addEvent({
                            delay: 500,
                            callback: ()=>{
                                scene.sound.play('explode',{ volume: 0.5 });
                                var explosion = scene.physics.add.sprite(gren.x,gren.y,'');
                                explosion.anims.play('explode','true');
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        explosion.destroy();
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                                gren.destroy();
                                var maxKills = 10;
                                for (var i = 0; i < gameState.zombies.getChildren().length; i++){
                                    if(Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], gren)<150&&maxKills>0){
                                        gameState.zombies.getChildren()[i].health -= 300;
                                        maxKills--;
                                    }
                                }
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                    } 
                    else{
                        gren.destroy();
                    }
                }
            });
        }
        else if(random<=89 && random >= 85){
            var medic = scene.physics.add.sprite(x,y,'medicImage');
            medic.anims.play('shine3','true');
            var gone = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    medic.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(gameState.character, medic,(character, medic)=>{
                medic.destroy();
                if(gameState.health < gameState.characterStats.health){
                    scene.sound.play('healed');
                }
                gameState.health += 50;
                if(gameState.health > gameState.characterStats.health){
                    gameState.health = gameState.characterStats.health;
                }
            });
        }
        else if(random <= 84 && random >= 83){
            var crate = scene.physics.add.sprite(x,y,'lootBox').setScale(0.15);
            crate.anims.play('lootShine','true');
            var gone = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    crate.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(gameState.character, crate,(character, crate)=>{
                crate.destroy();
                gameState.thingsToSave.numLootboxes++;
                gameState.save();
            });
        }
    },
    
    //creates unlocked screen for whatever image is the parameter
    createUnlocked: function(scene,image){
        var unlockBG = scene.add.image(window.innerWidth/2,window.innerHeight/2,'unlockedMenu').setInteractive().setDepth(100);
        var unlocked = scene.add.image(window.innerWidth/2,window.innerHeight/2+50,`${image}`).setDepth(100).setScale(3);
        unlockBG.on('pointerdown', function(pointer){
            gameState.save();
            gameState.keys.W.isDown = false;
            gameState.keys.S.isDown = false;
            gameState.keys.A.isDown = false;
            gameState.keys.D.isDown = false;
            gameState.mouse.isDown = false;
            unlockBG.destroy();
            unlocked.destroy();
            gameState.globalScene.scene.stop('UnlockedScene');
            gameState.globalScene.scene.resume(`${gameState.currentScene}`);
        });
    },
    
    //tracks achievement completion
    achievmentTracker: function(scene){
        if(gameState.kills >= 500 && gameState.weaponSkins.SkeletonGun.owned == 0){
            gameState.globalScene.scene.pause(`${gameState.currentScene}`);
            gameState.globalScene.scene.launch('UnlockScene');
        }
    },
    
    //stats of zombies and boss zombies
    zombie :{
        speed: 75,
        health : 100,
        damage : 10,
        image: 'zombie'
    },
    sarmsZombie :{
        speed: 70,
        runSpeed: 170,
        health : 4000,
        damage : 27,
        name: 'sarmsZombie'
    },
    quadZombie :{
        health : 2750,
        damage : 50,
        damageRange : 195,
        name: 'quadZombie'
    },
    cloneZombie :{
        health : 2000,
        damage : 20,
        grenDamage: 50,
        speed : 150,
        projectileSpeed: 200,
        name: 'Clone Zombie'
    },
    
    //function to control what happens eveytime the player takes damage in any way
    pDamage: function(damage){
        if(gameState.health > 0){
            gameState.cHurt.play();
        }
        gameState.health -= damage;
    },
    
    //creates a normal zombie
    createZombie: function (scene,inX,inY,zomStats){
        var zombie = gameState.zombies.create(inX,inY,`${zomStats.image}`).setDepth(1).setScale(0.6);
        zombie.setSize(70,110);
        zombie.health = zomStats.health;
        function zombieB(zom){
            zom.setCollideWorldBounds(true);
            var attack = scene.time.addEvent({
                delay: 500,
                callback: ()=>{
                    gameState.pDamage(gameState.zombie.damage);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            var loop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if (zom.health > 0){
                        zom.depth = zom.y-40;
                        if(gameState.character.x > zom.x){
                            zom.flipX = false;
                        }
                        else if(gameState.character.x < zom.x){
                            zom.flipX = true;
                        }
                        var dist = Phaser.Math.Distance.BetweenPoints(gameState.character, zom);
                        if(dist > 30){
                            attack.paused = true;
                            scene.physics.moveTo(zom,gameState.character.x, gameState.character.y,zomStats.speed);
                            zom.anims.play('zombieWalk',true);
                        }
                        else {
                            attack.paused = false;
                            zom.anims.play('zombieStrike',true);
                            zom.setVelocityX(0);
                            zom.setVelocityY(0);
                        }
                    }
                    else {
                        zom.body.height = 1;
                        zom.setImmovable();
                        scene.sound.play('killSound');
                        scene.sound.play('zombieDeath',{volume:0.4});
                        if(gameState.bossBattle == false){
                            gameState.kills++;
                            gameState.createItem(scene,zom.x,zom.y);
                            gameState.bossSummonKills++;
                        }
                        loop.destroy();
                        attack.destroy();
                        zom.setVelocityX(0);
                        zom.setVelocityY(0);
                        if(gameState.skin == "characterGoldenGun"){
                            zom.anims.play('zombieGoldDeath','true');
                        }else {
                            zom.anims.play('zombieDeath','true');
                        }
                        scene.time.addEvent({
                            delay: 1000,
                            callback: ()=>{
                                zom.anims.play('zombieFade','true');
                                scene.time.addEvent({
                                    delay: 200,
                                    callback: ()=>{
                                        if(zom){
                                          zom.destroy();  
                                        }
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
        };
        zombie.anims.play('zombieSpawn');
        scene.time.addEvent({
            delay: 1000, 
            callback: ()=>{
                zombieB(zombie);
                gameState.createHealthBar2(scene,zombie,zomStats.health);
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    
    //buffs the stats of the zombies after every boss kill
   
    
    //creates the players healthbar
    createHealthBar: function(scene,x,y){
        var bars = [];
        var xTimes = 1;
        var barBg = scene.add.image(x, y, 'healthBarBg').setDepth(window.innerHeight+1).setOrigin(0,0).setScale(0.5);
        for (var i = 0; i < 100;i++){
            var bar = scene.add.image(x+(5*xTimes), y+8.5, 'healthBar').setDepth(window.innerHeight+1).setScale(0.5);
            bars.push(bar);
            xTimes ++;
        }
        var checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                if ((gameState.health/(gameState.characterStats.health/100)) < bars.length && bars.length > 0){
                    bars[bars.length-1].destroy();
                    bars.pop();
                    xTimes--;
                }
                else if ((gameState.health/(gameState.characterStats.health/100)) > bars.length && bars.length < 100){
                    var bar = scene.add.image(x+(5*xTimes), y+8.5, 'healthBar').setDepth(window.innerHeight+1).setScale(0.5);
                    bars.push(bar);
                    xTimes ++;
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    },
    //creates temporary ingame text
    createTempText:function(scene,x,y,text,time,size){
        var text = scene.add.text(x, y, `${text}`, {
            fill: '#FF0000', 
            fontSize: `${size}px`,
            fontFamily: 'Qahiri',
            strokeThickness: 5,
        }).setDepth(-100);
        scene.time.addEvent({
            delay: time,
            callback: ()=>{
                if(text){
                  text.destroy();  
                }
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    //creates the timer for the powerup infinite bullets
    createTimer:function(scene,x,y,image){
        var icon = scene.add.image(x,y,`${image}`).setOrigin(0,0).setScale(50/35);
        var timer = scene.add.sprite(icon.x+60,icon.y,'timerSprite').setOrigin(0,0);
        timer.anims.play('moveTime');
        scene.time.addEvent({
            delay: 10000,
            callback: ()=>{
                icon.destroy();
                timer.destroy();
            },  
            startAt: 0,
            timeScale: 1
        });
    },
    createHealthBar2: function(scene, object,maxHP,x,y){
        var hbBG = scene.add.rectangle(x,y,410,30,0x5A5A5A).setScale(1).setDepth(window.innerHeight).setOrigin(0,0);  
        var hb = scene.add.rectangle(x+5,y+5,400,20,0x880808).setScale(1).setDepth(window.innerHeight).setOrigin(0,0);
        var checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                if(object.health > 0){
                    hb.width = object.health/maxHP*400;
                    if(object.health > maxHP){
                        object.health = maxHP;
                    }
                } else {
                    hbBG.destroy();
                    hb.destroy();
                    checkHealth.destroy();
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    },
    createHealthBar3: function(scene, object,maxHP){
        var hbBG = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0x5A5A5A).setScale(object.body.width/100*2).setDepth(window.innerHeight);  
        var hb = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0x880808).setScale(object.body.width/100*2).setDepth(window.innerHeight);
        var checkHealth = scene.time.addEvent({
            delay: 10,
            callback: ()=>{
                if(object.health > 0){
                    hbBG.x = object.x;
                    hbBG.y = (object.y-object.body.height/2)-10;
                    hb.x = object.x;
                    hb.y = (object.y-object.body.height/2)-10;
                    hb.width = object.health/maxHP*100;
                } else {
                    hbBG.destroy();
                    hb.destroy();
                    checkHealth.destroy();
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    },
    createSprintBar: function(scene, object,maxSprint,x,y){
        var hbBG = scene.add.rectangle(x,y,105,15,0x5A5A5A).setScale(2).setDepth(window.innerHeight).setOrigin(0,0);  
        var hb = scene.add.rectangle(x+5,y+5,100,10,0xD3D3D3).setScale(2).setDepth(window.innerHeight).setOrigin(0,0);
        var checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                hb.width = object.sprint/gameState.characterStats.sprint*100;
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
    },
}