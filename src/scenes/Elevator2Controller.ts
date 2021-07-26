import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class Elevator2Controller{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private obsticales: ObsticalesController
    private up = 1
    

    

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, obsticales: ObsticalesController){
        this.scene = scene
        this.sprite = sprite
        this.obsticales = obsticales
        this.stateMachine = new StateMachine(this, 'elevator2')

        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move-down', {
            onEnter: this.moveDownOnEnter,
            onUpdate: this.moveDownOnUpdate
        })
        .addState('move-up',{
            onEnter: this.moveUpOnEnter,
            onUpdate: this.moveUpOnUpdate
        })
        .setState('move-up')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            const body = data.bodyB as MatterJS.BodyType
            

            if(this.obsticales.is('elevatorTop', body)){
                this.up = 0
                this.stateMachine.setState('move-down')
                
            }
            if(this.obsticales.is('elevatorBottom', body)){
                this.up = 1
                this.stateMachine.setState('move-up')
            }
        })
        

        this.sprite.setIgnoreGravity(true)


    }
    update(dt: number){
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        this.stateMachine.setState('move-up')
    }

    private moveDownOnEnter(){

    }

    public moveDownOnUpdate(){
        this.sprite.setVelocityY(5)
        this.sprite.setVelocityX(0)
        if(this.up === 1){
            this.stateMachine.setState('move-up')
        }
        
    }

    private moveUpOnEnter(){

    }

    public moveUpOnUpdate(){
        this.sprite.setVelocityY(-5)
        this.sprite.setVelocityX(0)
        if(this.up === 0){
            this.stateMachine.setState('move-down')
        }
    }

}