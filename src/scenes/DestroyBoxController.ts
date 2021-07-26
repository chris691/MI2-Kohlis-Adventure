import StateMachine from "../statemachine/StateMachine";
import { events } from "./EventCenter";
import ObsticalesController from "./ObsticalesController";

export default class DestroyBoxController{
    // private scene: Phaser.Scene
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine

    constructor(sprite: Phaser.Physics.Matter.Sprite){
        this.sprite = sprite
        this.stateMachine = new StateMachine(this, 'destroyBox')

        this.createAnimations()
        this.stateMachine.addState('destroy', {
            onEnter: this.destroyOnEnter,
            onUpdate: this.destroyOnUpdate
        })
        .addState('Box-idle',{
            onEnter: this.boxIdleOnEnter
        })

        events.on('distroyTheBox', this.setDestroy, this)
    }

    private destroyOnEnter(){
        this.sprite.play('destroy')

        events.off('distroyTheBox', this.setDestroy, this)
    }


    public setDestroy(){
        this.stateMachine.setState('destroy')
    }

    private destroyOnUpdate(){
        this.sprite.destroy()
    }

    private boxIdleOnEnter(){
        this.sprite.play
    }

    private createAnimations(){

        this.sprite.anims.create({
            key: 'destroyBox-idle',
            frames: [{ key: 'destroyBox', frame: 'destroyBox1.png' }]
        })

        this.sprite.anims.create({
            key: 'destroy',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('destroyBox', {
                start: 1,
                end: 4,
                prefix: 'destroyBox',
                suffix: '.png'
            }),
            repeat: -1
        })
    }
}