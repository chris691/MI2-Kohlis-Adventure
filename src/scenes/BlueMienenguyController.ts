import Phaser from "phaser";
import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";

export default class BlueMienenguyController{

    private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private playerX
    private moveTime = 0
    private mienenGuySound
    private lifePoints
    private isDead


    constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Matter.Sprite, mienenGuySound: Phaser.Sound.BaseSound){
        this.scene = scene
        this.sprite = sprite
        this.mienenGuySound = mienenGuySound
        this.lifePoints = 2
        this.stateMachine = new StateMachine(this, 'blueMienenguy')
        this.createAnimations()
        this.stateMachine.addState('idle',{
            onEnter: this.idleOnEnter
        })
        .addState('move',{
            onEnter: this.moveOnEnter,
            onUpdate: this.moveOnUpdate
        })
        .addState('move-left',{
            onEnter: this.moveLeftOnEnter,
            onUpdate: this.moveLeftOnUpdate
        })
        .addState('move-right', {
            onEnter: this.moveRightOnEnter,
            onUpdate: this.moveRightOnUpdate
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .addState('dead')
        .setState('move')

        this.isDead = false
        events.once('kill-blueMienenguy', this.kill, this)
        
    }

    destroy(){
        
    }

    update(dt: number){
        this.stateMachine.update(dt)
       
    }

    public setPlayerX(playerX){
        this.playerX = playerX
    }
    

    private kill(blueMienenguy: Phaser.Physics.Matter.Sprite){
        if(this.sprite !== blueMienenguy){
            return
        }
        this.stateMachine.setState('dead')
        this.lifePoints -= 1
        console.log('Lifepoints: '+this.lifePoints)
        this.isDead = true
        if(this.lifePoints  ==1 ){
            
            // this.sprite.play('idle')
            this.mienenGuySound.play()
            this.scene.tweens.add({
                targets: this.sprite,
                displayHeight: 0,
                y: this.sprite.y + (this.sprite.displayHeight * 0.5),
                flipY: true,
                duration: 2000,
                
                onComplete: () => {
                    this.sprite.destroy()
                    events.emit('BossIsDead')
                    events.emit('Ende')
                    events.emit('EndScreen')
                    
                }
            })
        }
        events.off('kill-blueMienenguy', this.kill, this)
    }


    private idleOnEnter(){
        this.sprite.play('idle')
    }
    

    private moveOnEnter(){
        this.sprite.play('idle')
        
    }

    private moveOnUpdate(){
        if(this.isDead !=true){
            if(this.sprite.body.position.x < this.playerX - 10){
                
                    this.stateMachine.setState('move-left')
                
                
            }
            if(this.sprite.body.position.x > this.playerX + 10){
                
                    this.stateMachine.setState('move-right')
            }
        }

    }

    private moveLeftOnEnter(){
        this.sprite.play('mienenguy-walk')
    }
    private moveLeftOnUpdate(){
        if(this.isDead !=true){
            this.sprite.setVelocityX(10)
            this.sprite.flipX = true
                this.scene.tweens.addCounter({
                    duration: 2000,
                    onComplete: () => {
                        this.sprite.flipX = false
                        if(this.isDead !=true){
                            this.stateMachine.setState('jump')
                        }
                }
            })
        }
    }

    private moveRightOnEnter(){
        this.sprite.play('mienenguy-walk')
    }
    private moveRightOnUpdate(){
        if(this.isDead !=true){
            this.sprite.setVelocityX(-10)
            this.sprite.flipX = false
            this.scene.tweens.addCounter({
                duration: 2000,
                    onComplete: () => {
                    if(this.isDead !=true){
                        this.sprite.flipX = true
                        this.stateMachine.setState('jump')
                    } 
                }
            })
        }
    }

    private jumpOnEnter(){
        this.sprite.setVelocityY(-5)
    }

    private jumpOnUpdate(){
        
        this.scene.tweens.addCounter({
            duration: 2000,
            onUpdate:()=>{
                if(this.isDead){
                    return
                }
            },
            onComplete:()=>{
                
                if(this.isDead != true){
                    this.sprite.setVelocityY(2)
                    this.stateMachine.setState('move')
                }
            }
        })
    }
    

    private createAnimations(){

        this.sprite.anims.create({
            key: 'idle',
            frames: [{key: 'blueMienenguy', frame:'mienenguyblau1.png'}]
        })
        

        this.sprite.anims.create({
            key: 'mienenguy-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('blueMienenguy', {
                start: 2,
                end: 9,
                prefix: 'mienenguyblau',
                suffix: '.png'
            }),
            repeat: -1
        })

    }
} 