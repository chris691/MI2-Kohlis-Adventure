import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class EmptyLorenController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController

    private mienenCartSound

    private moveTime = 0

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController, mienenCartSound: Phaser.Sound.BaseSound){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.mienenCartSound = mienenCartSound
        this.stateMachine = new StateMachine(this, 'emptyLore')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move-left', {
            onEnter: this.moveLeftOnEnter,
            onUpdate: this.moveLeftOnUpdate
        })
        .addState('move-right',{
            onEnter: this.moveRightOnEnter,
            onUpdate: this.moveRightOnUpdate
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyA as MatterJS.BodyType
            

            if(this.obsticales.is('leftWall', body)){
                console.log('linke Wand')
                // this.stateMachine.setState('move-right')
                this.stateMachine.setState('move-right')
                this.sprite.setVelocityX(3)
            }
            if(this.obsticales.is('rightWall', body)){
                this.stateMachine.setState('move-left')
            }
        })

        events.on('startMienenCart', this.startTheCart, this)
        events.on('stopMienenCart', this.stopTheCart, this)

    }

    private startTheCart(){
        this.stateMachine.setState('move-right')
    }

    private stopTheCart(){
        this.stateMachine.setState('idle')
    }

    

    

    private idleOnEnter(){
        // this.stateMachine.setState('move-left')
        this.mienenCartSound.stop()
    }
    
    private moveLeftOnEnter(){
        this.moveTime = 0
        this.mienenCartSound.play()
    }


    private moveLeftOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(-3)
        console.log('Speed' + this.sprite.body.velocity)
        
        
        // if(this.moveTime > 9000){
        //     this.stateMachine.setState('move-right')
        // }
    }

    private moveRightOnEnter(){
        this.moveTime = 0
        this.mienenCartSound.play()
    }

    private moveRightOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(3)
        // if(this.moveTime > 9000){
        //     this.stateMachine.setState('move-left')
        // }
    }

    destroy(){
        events.off('startMienenCart', this.startTheCart, this)
        events.off('stopMienenCart', this.stopTheCart, this)
    }
    update(dt: number){
        this.stateMachine.update(dt)
    }
}
