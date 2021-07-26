import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";

export default class MiniMienenguyController{
    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine

    private moveTime = 0

    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite){
        this.scene = scene
        this.sprite = sprite
        this.createAnimations()
        this.stateMachine = new StateMachine(this, 'miniMienenguy')

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

    }

    destroy(){
        
    }

    update(dt: number){
        this.stateMachine.update(dt)
    }

    private idleOnEnter(){
        this.sprite.play('idle')
        this.stateMachine.setState('move-right')
    }

    private moveLeftOnEnter(){
        this.moveTime = 0
        this.sprite.flipX = false
        this.sprite.play('move')
    }

    private counter = 0
    private moveLeftOnUpdate(dt: number){
        this.moveTime +=dt + Phaser.Math.Between(0, 100)
        this.counter ++
        this.sprite.setVelocityX(-3)
        if(this.moveTime > 5000){
            this.stateMachine.setState('move-right')
            this.counter = 0
        }
    }

    private moveRightOnEnter(){
        this.moveTime = 0
        this.sprite.flipX = true
        this.sprite.play('move')
    }

    private moveRightOnUpdate(dt: number){
        this.moveTime +=dt+Phaser.Math.Between(0, 100)
        this.sprite.setVelocityX(3)
        this.counter ++
        if(this.moveTime > 5000){
            this.stateMachine.setState('move-left')
            this.counter = 0
        }
    }

    private createAnimations(){

        this.sprite.anims.create({
            key: 'idle',
            frames: [{key: 'miniMienenguy', frame:'mienenguygelb1.png'}]
        })
        this.sprite.anims.create({
            key: 'move',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('miniMienenguy', {
                start: 2,
                end: 9,
                prefix: 'mienenguygelb',
                suffix: '.png'
            }),
            repeat: -1
        })
    }
}