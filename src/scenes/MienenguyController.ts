import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";

export default class MienenguyController{

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine

    private moveTime = 0
    private mienenGuySound


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, mienenGuySound: Phaser.Sound.BaseSound){
        this.scene = scene
        this.sprite = sprite
        this.mienenGuySound = mienenGuySound
        this.stateMachine = new StateMachine(this, 'mienenguy')
        this.createAnimations()
        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move-left',{
            onEnter: this.moveLeftOnEnter,
            onUpdate: this.moveLeftOnUpdate
        })
        .addState('move-right',{
            onEnter: this.moveRightOnEnter,
            onUpdate: this.moveRightOnUpadate
        })
        .addState('dead')
        .setState('move-left')

        events.on('kill-mienenguy', this.killMienenguy, this)
    }

    destroy(){
        events.off('kill-mienenguy', this.killMienenguy, this)
    }

    update(dt: number){
        this.stateMachine.update(dt)
    }

    private killMienenguy(mienenguy: Phaser.Physics.Matter.Sprite){
        if(this.sprite !== mienenguy){
            return
        }
        events.off('kill-mienenguy', this.killMienenguy, this)
        this.sprite.play('idle')
        this.mienenGuySound.play()
        this.scene.tweens.add({
            targets: this.sprite,
            displayHeight: 0,
            y: this.sprite.y + (this.sprite.displayHeight * 0.5),
            flipY: true,
            duration: 2000,
            
            onComplete: () => {
                this.sprite.destroy()
            }
        })
        this.stateMachine.setState('dead')
    }


    private idleOnEnter(){
        this.sprite.play('idle')
        const r = Phaser.Math.Between(1,100)
        if(r < 50){
            this.stateMachine.setState('move-left')
        }else{
            this.stateMachine.setState('move-right')
        }
    }

    private moveLeftOnEnter(){
        this.moveTime = 0
        this.sprite.flipX = false
        this.sprite.play('mienenguy-walk')
        
    }

    private moveLeftOnUpdate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(-3)
        if(this.moveTime > 2000){
            this.stateMachine.setState('move-right')
        }
    }

    private moveRightOnEnter(){
        this.moveTime = 0
        this.sprite.flipX = true
        this.sprite.play('mienenguy-walk')
        
    }

    private moveRightOnUpadate(dt: number){
        this.moveTime +=dt
        this.sprite.setVelocityX(3)
        if(this.moveTime > 2000){
            this.stateMachine.setState('move-left')
        }
    }

    private createAnimations(){

        this.sprite.anims.create({
            key: 'idle',
            frames: [{key: 'mienenguy', frame:'mienenguy2.svg'}]
        })
        

        this.sprite.anims.create({
            key: 'mienenguy-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('mienenguy', {
                start: 2,
                end: 8,
                prefix: 'mienenguy',
                suffix: '.svg'
            }),
            repeat: -1
        })

    }
} 