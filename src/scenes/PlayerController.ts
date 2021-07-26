import Phaser from 'phaser'
import TimerEvent from "phaser"
import StateMachine from '../statemachine/StateMachine'
import DestroyBoxController from './DestroyBoxController'
import ElevatorController from './ElevatorController'
import EmptyLorenController from './EmptyLorenController'
import { events } from './EventCenter'
import ObsticalesController from './ObsticalesController'

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys

export default class PlayerController{

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private cursors: CursorKeys
    private stateMachine: StateMachine
    private obsticales : ObsticalesController
    private health = 100
    private lastMienenguy?: Phaser.Physics.Matter.Sprite
    private lastMiniguy?: Phaser.Physics.Matter.Sprite
    private lastEmptyLore?: Phaser.Physics.Matter.Sprite
    private lastBox?: Phaser.Physics.Matter.Sprite
    private lastElevator?: Phaser.Physics.Matter.Sprite
    private lastBluemienenguy ?: Phaser.Physics.Matter.Sprite
   

    //--- Sounds ----

    private boxBreakSound
    private jumpSound
    private lifeSound
    private damageSound


    //--Andere Sachen----

    private BossLifePoints 

   


    constructor(
                scene: Phaser.Scene,
                sprite: Phaser.Physics.Matter.Sprite,
                cursors: CursorKeys, obsticales: ObsticalesController,
                boxBreakSound: Phaser.Sound.BaseSound,
                jumpSound: Phaser.Sound.BaseSound,
                lifeSound: Phaser.Sound.BaseSound,
                damageSound: Phaser.Sound.BaseSound
            ){

        this.scene = scene
        this.sprite = sprite
        this.cursors = cursors
        this.obsticales = obsticales
        this.boxBreakSound = boxBreakSound
        this.jumpSound = jumpSound
        this.lifeSound = lifeSound
        this.damageSound = damageSound
        this.BossLifePoints = 3

        this.createAnimations()

        this.stateMachine = new StateMachine(this, 'player')


        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate,
            // onExit: this.idleOnExit
        })
        .addState('walk',{
            onEnter: this.walkOnEnter,
            onUpdate: this.walkOnUpdate,
            onExit:this.walkOnExit
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .addState('super-jump',{
            onEnter: this.superJumpOnEnter,
            onUpdate: this.superJumpOnUpdate
        })
        .addState('hitbox-hit', {
            onEnter: this.hitboxhitOnEnter,
            // onUpdate: this.hitboxhitOnUpdate,
            // onExit: this.hitboxhitOnExit
        })
        .addState('killZone',{
            onEnter: this.killZoneOnEnter
        })
        .addState('mienenguy-hit', {
            onEnter: this.mienenguyHitOnEnter
        })
        .addState('jumpOnMienenguy', {
            onEnter: this.jumpOnMienenguyOnEnter
        })
        .addState('miniguy-hit',{
            onEnter: this.miniguyHitOnEnter
        })
        .addState('loren-drive', {
            onEnter: this.lorenDriveOnEnter,
            onUpdate: this.lorenDirveOnUpdate
        })
        .addState('onElevator', {
            onEnter: this.onElevatorOnEnter,
            onUpdate: this.onElevatorOnUpdate
        })
        .addState('jumpOnBluemienenguy',{
            onEnter: this.JumpOnBluemienenguy
        })
        .addState('bluemienenguy-hit', {
            onEnter: this.bluemienenguyHitOnEnter
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType

            if(this.obsticales.is('hitboxs', body)){
                this.stateMachine.setState('hitbox-hit')
                return
            }
            if(this.obsticales.is('deadZones', body)){
                this.stateMachine.setState('killZone')
                return
            }

            if(this.obsticales.is('mienenguy', body)){
                this.lastMienenguy = body.gameObject
                if(this.sprite.y < body.position.y){
                    this.stateMachine.setState('jumpOnMienenguy')
                }else{
                    this.stateMachine.setState('mienenguy-hit')
                }
                return
            }

            if(this.obsticales.is('blueMineneguy', body)){
                console.log('BlauerMann')
                this.lastBluemienenguy = body.gameObject
                if(this.sprite.y < body.position.y){
                    this.stateMachine.setState('jumpOnBluemienenguy')
                }else{
                    this.stateMachine.setState('bluemienenguy-hit')
                }
                
            }

            if(this.obsticales.is('miniMienenguy', body)){
                this.lastMiniguy = body.gameObject
                this.stateMachine.setState('miniguy-hit')
            }

            if(this.obsticales.is('emptyLore', body)){
                this.lastEmptyLore = body.gameObject
                this.stateMachine.setState('loren-drive')
            }

            if(this.obsticales.is('elevator', body)){
                this.lastElevator = body.gameObject
                this.stateMachine.setState('onElevator')
            }

            if(this.obsticales.is('elevator2', body)){
                this.lastElevator = body.gameObject
                this.stateMachine.setState('onElevator')
            }

            if(this.obsticales.is('destroyBox', body)){
                this.lastBox = body.gameObject
                this.destroyTheBox()
            }

            if(this.obsticales.is('mienenBlockTrigger', body)){
                events.emit('startMienenCart')
            }
            if(this.obsticales.is('mienencartStop', body)){
                events.emit('stopMienenCart')
            }
            if(this.obsticales.is('breaktriggers', body)){
                console.log('Break')
                events.emit('breaktrigger')
            }

            if(this.obsticales.is('info', body)){
                events.emit('info')
                return
            }


            if(this.obsticales.is('info2', body)){
                events.emit('info2')
                return
            }

            if(this.obsticales.is('info3', body)){
                events.emit('info3')
                return
            }

            if(this.obsticales.is('info4', body)){
                events.emit('info4')
                return
            }

            if(this.obsticales.is('info5', body)){
                events.emit('info5')
                return
            }

            if(this.obsticales.is('info6', body)){
                events.emit('info6')
                return
            }

            if(this.obsticales.is('info7', body)){
                events.emit('info7')
                return
            }

            if(this.obsticales.is('info8', body)){
                events.emit('info8')
                return
            }

            if(this.obsticales.is('info9', body)){
                events.emit('info9')
                return
            }
            if(this.obsticales.is('info10', body)){
                events.emit('info10')
                return
            }
            if(this.obsticales.is('info11', body)){
                events.emit('info11')
                return
            }

            const gameObject = body.gameObject

            if(!gameObject){
                return
            }

            if(gameObject instanceof Phaser.Physics.Matter.TileBody){

                if(this.stateMachine.isCurrentState('jump')){
                    this.stateMachine.setState('idle')
                }
                if(this.stateMachine.isCurrentState('hitbox-hit')){
                    this.stateMachine.setState('idle')
                }
                return
            }

            const sprite = gameObject as Phaser.Physics.Matter.Sprite
            const type = sprite.getData('type')

            switch(type){
                case 'diamond':{
                    
                    events.emit('diamond-collected')
                    sprite.destroy()
                    break
                }
                case 'bigdiamond':{
                    events.emit('bigdiamond-collected')
                    sprite.destroy()
                    break
                }
                case 'health':{
                    const value = sprite.getData('healthPoints') 
                    this.health += Phaser.Math.Clamp(value, 0, 100)
                    events.emit('health-changed', this.health)
                    sprite.destroy()
                    this.lifeSound.play()
                    break
                }
            }
        })
    }

    update(dt: number){
        this.stateMachine.update(dt)
    }

    public getX(){
        return this.sprite.body.position.x
    }

    private idleOnEnter(){
        this.sprite.play('player-idle')
    }

    private idleOnUpdate(){
        if (this.cursors.left.isDown || this.cursors.right.isDown){
            this.stateMachine.setState('walk')
        }

        const spaceJustPressd = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressd) {
            this.stateMachine.setState('jump')
        }
    }


    private walkOnEnter(){
        this.sprite.play('player-walk')
    }

    private walkOnUpdate(){
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)

            this.sprite.flipX = false
        } else if(this.cursors.left.isUp) {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        } 

        const spaceJustPressd = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressd) {
            this.stateMachine.setState('jump')
        }
        
    }

    private walkOnExit(){
        this.sprite.stop()
    }

    private jumpOnEnter(){
        this.sprite.setVelocityY(-10)
        this.sprite.play('player-jump')
        this.jumpSound.play()
    }

    private jumpOnUpdate(){
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)

            this.sprite.flipX = false
        }
    }

    private superJumpOnEnter(){
        this.sprite.setVelocityY(-20)
    }
    private superJumpOnUpdate(){
        this.sprite.setVelocityY(-20)
        this.stateMachine.setState('idle')
    }


    
    private jumpOnMienenguyOnEnter(){
        this.sprite.setVelocityY(-10)

        events.emit('kill-mienenguy', this.lastMienenguy)

        this.stateMachine.setState('jump')
    }

    private hitboxhitOnEnter(){
        this.sprite.setVelocityY(-12)
        this.health = Phaser.Math.Clamp(this.health - 20, 0,100)
        events.emit('health-changed', this.health)
        this.damageSound.play()
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 2,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )
                this.sprite.setTint(color)
            }
        })

        this.stateMachine.setState('idle')
    }

    private killZoneOnEnter(){
        this.sprite.setVelocityY(-20)
        this.sprite.setVelocityX(0)
        this.health = Phaser.Math.Clamp(this.health - 500, 0,100)
        events.emit('health-changed', this.health)
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 10,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )
                this.sprite.setTint(color)
            }
        })
        
        // this.sprite.setRotation(-1.5)
        
        //TODO: LoseScreen Anzeigen.
        this.stateMachine.setState('jump')
    }

    private mienenguyHitOnEnter(){
        if (this.lastMienenguy){   
			if (this.sprite.x < this.lastMienenguy.x){
				this.sprite.setVelocityX(-20)
			}
			else{
				this.sprite.setVelocityX(20)
			}
		}
		else{
			this.sprite.setVelocityY(-20)
		}
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
		const endColor = Phaser.Display.Color.ValueToColor(0x0000ff)

		this.scene.tweens.addCounter({
			from: 0,
			to: 100,
			duration: 100,
			repeat: 2,
			yoyo: true,
			ease: Phaser.Math.Easing.Sine.InOut,
			onUpdate: tween => {
				const value = tween.getValue()
				const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
					startColor,
					endColor,
					100,
					value
				)

				const color = Phaser.Display.Color.GetColor(
					colorObject.r,
					colorObject.g,
					colorObject.b
				)

				this.sprite.setTint(color)
			}
		})
        this.stateMachine.setState('jump')

        this.health = Phaser.Math.Clamp(this.health - 25, 0,100)
        events.emit('health-changed', this.health)
        this.damageSound.play()
    }

    private miniguyHitOnEnter(){
        if (this.lastMiniguy){   
            console.log('miniguy')
            if(this.cursors.space.isDown){
                this.sprite.setVelocityY(-20)
                this.stateMachine.setState('super-jump')
            }
			else if (this.sprite.x < this.lastMiniguy.x){
				this.sprite.setVelocityX(-15)
                this.stateMachine.setState('jump')
			}
			else if(this.sprite.x > this.lastMiniguy.x){
				this.sprite.setVelocityX(15)
                this.stateMachine.setState('jump')
			}
            
		}
		else {
			this.sprite.setVelocityY(-20)
		}

        
    }

    private lorenDriveOnEnter(){
        if(this.lastEmptyLore){
            console.log(this.lastEmptyLore.body.velocity)
            this.sprite.play('idle')
            
        }
    }

    private lorenDirveOnUpdate(){
        var drivespeed
        if(this.lastEmptyLore){
            var playerBottemYCordinat = this.sprite.y + (this.sprite.height/2)
            var loreTopYCordinat = this.lastEmptyLore.y - (this.lastEmptyLore.height/4)
            console.log("Spieler: " + playerBottemYCordinat)
            console.log("Lore: " + loreTopYCordinat)
            if(playerBottemYCordinat > loreTopYCordinat){
                console.log("Oh no")
                this.stateMachine.setState('idle')
            }
            
            
            if(this.lastEmptyLore.body.velocity.x > 0){
                this.sprite.setVelocity (this.lastEmptyLore.body.velocity.x+0.34,0)
                this.sprite.flipX =  false
                drivespeed = this.lastEmptyLore.body.velocity.x+0.34
            }else{
                this.sprite.setVelocity (this.lastEmptyLore.body.velocity.x-0.34,0)
                this.sprite.flipX =  true
                drivespeed = this.lastEmptyLore.body.velocity.x-0.34
            }
            
            console.log(this.sprite.body.velocity)
        }
    
        const speed = 8
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-speed)
            this.sprite.play('player-walk')
            this.sprite.flipX = true

        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(speed)
            this.sprite.play('player-walk')
            this.sprite.flipX = false
        }else{
            this.sprite.setVelocityX(drivespeed)
            this.sprite.play('player-idle')
        }

        const spaceJustPressd = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressd) {
            this.stateMachine.setState('jump')
        }
       
    }

    private destroyTheBox(){
        if(this.lastBox){
            if(this.lastBox.y+(this.lastBox.height/2) < this.sprite.y){
                // events.emit('distroyTheBox', this)
                this.boxBreakSound.play()
                const boxdestroyer = new DestroyBoxController(this.lastBox)
                    boxdestroyer.setDestroy()
                    this.scene.tweens.add({
                    targets: this.lastBox,
                    alpha: {from: 1, to: 0},
                    ease: 'Sine.InOut',
                    duration: 500,
                    repeat: 0,
                    onComplete: () => {
                        if(this.lastBox){
                            this.lastBox.destroy()
                        }   
                    }   
                })
            }
            if(this.lastBox.y > this.sprite.y){
                this.stateMachine.setState('idle')
            }  
        }
    }

    private onElevatorOnEnter(){
        this.sprite.play('idle')
    }

    private onElevatorOnUpdate(){
        if(this.lastElevator){
            this.sprite.setVelocityY(0)
            // const eloCont = new ElevatorController(this.scene,this.lastElevator, this.obsticales)
            // eloCont.moveUpOnUpdate()
            const speed = 8
            if (this.cursors.left.isDown) {
                this.sprite.setVelocityX(-speed)
                this.sprite.play('player-walk')
                this.sprite.flipX = true
                this.stateMachine.setState('walk')
                // const eloCont = new ElevatorController(this.scene,this.lastElevator, this.obsticales)
                // eloCont.moveDownOnUpdate() 
                // this.lastElevator.setVelocityY(15)

            } else if (this.cursors.right.isDown) {
                this.sprite.setVelocityX(speed)
                this.sprite.play('player-walk')
                this.sprite.flipX = false
                this.stateMachine.setState('walk')
                // const eloCont = new ElevatorController(this.scene,this.lastElevator, this.obsticales)
                // eloCont.moveDownOnUpdate() 
                // this.lastElevator.setVelocityY(15)
            }else{
                this.sprite.setVelocity(this.lastElevator.body.velocity.x,this.lastElevator.body.velocity.y )
                this.sprite.play('player-idle')
            }
            if(this.cursors.space.isDown){
                this.lastElevator.setVelocityY(15)
                this.stateMachine.setState('jump')
                
            }
            
            
        }
    }

    private JumpOnBluemienenguy(){
        this.sprite.setVelocityY(-5)
        this.BossLifePoints--
        console.log('Boss: '+this.BossLifePoints)
        this.stateMachine.setState('jump')
        if(this.BossLifePoints === 0){
            events.emit('kill-blueMienenguy', this.lastBluemienenguy)
        }
    }

    private bluemienenguyHitOnEnter(){
        this.health = Phaser.Math.Clamp(this.health - 35, 0,100)
        events.emit('health-changed', this.health)
        const startColor = Phaser.Display.Color.ValueToColor(0xffffff)
        const endColor = Phaser.Display.Color.ValueToColor(0xff0000)
        this.scene.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 100,
            repeat: 10,
            yoyo: true,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: tween => {
                const value = tween.getValue()
                const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
                    startColor,
                    endColor,
                    100,
                    value
                )
                const color = Phaser.Display.Color.GetColor(
                    colorObject.r,
                    colorObject.g,
                    colorObject.b
                )
                this.sprite.setTint(color)
            }
        })
        this.stateMachine.setState('idle')
    }
        


    


    private createAnimations() {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'coal-guy', frame: 'coal-guy-chill-11.svg' }]
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 12,
                end: 15,
                prefix: 'coal-guy-running-',
                suffix: '.svg'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('coal-guy', {
                start: 18,
                end: 19,
                prefix: 'coal-guy-jumping-',
                suffix: '.svg'
            }),
            repeat: -1
        })

    }
}