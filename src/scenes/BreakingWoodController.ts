import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class BreakingWoodController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController
    private breakSound
    private posX
    private posY
    private break = false
    

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController, breakSound: Phaser.Sound.BaseSound){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.breakSound = breakSound
        this.stateMachine = new StateMachine(this, 'breakingWood')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate

        })
        .addState('break', {
            onEnter: this.breakOnEnter,
            onUpdate: this.breakOnUpdate
        })
        .setState('idle')

        

        this.sprite.setIgnoreGravity(true)
        this.posY = this.sprite.body.position.y
        this.posX = this.sprite.body.position.x

        events.on('breaktrigger', this.breakTheWood, this)
        


    }
    update(dt: number){
        this.stateMachine.update(dt)
        if(!this.break){
            this.corectThePosition(dt)
        }
        
    }

    private corectThePosition(dt: number){
        if(this.sprite.body.position.x !== this.posX ||this.sprite.body.position.y !== this.posY  ){
                this.sprite.setPosition(this.posX, this.posY)
            }
    }
    
    private breakTheWood(){
        this.break = true
        this.breakSound.play()
        this.stateMachine.setState('break')
    }

    private idleOnEnter(){
        this.sprite.isStatic()
       
    }
    private idleOnUpdate(){
        this.sprite.setVelocityY(0)
        this.sprite.setVelocityX(0)
    }


    private breakOnEnter(){
        this.sprite.destroy()
        events.off('breaktrigger', this.breakTheWood, this)
    }

    public breakOnUpdate(){
        
    }


}