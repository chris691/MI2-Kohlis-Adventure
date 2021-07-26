import Phaser from 'phaser'
import { events } from '../scenes/EventCenter'
import PlayerController from './PlayerController'
import ObsticalesController from './ObsticalesController'
import MienenguyController from './MienenguyController'
import MiniMienenguyController from './MiniMienenguyController'
import BlueMienenguyController from './BlueMienenguyController'
import EmptyLorenController from './EmptyLorenController'
import DestroyBoxController from './DestroyBoxController'
import ElevatorController from './ElevatorController'
import BreakingWoodController from './BreakingWoodController'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

    private player?: Phaser.Physics.Matter.Sprite
    private playerController?: PlayerController
    private blueMinenguyController?: BlueMienenguyController
    private obstacles!: ObsticalesController
    private mienenguy: MienenguyController[] = []
    private miniMienenguy: MiniMienenguyController[] = []
    private blueMienenguy: BlueMienenguyController[] = []
    private emptyLore: EmptyLorenController[] = []
    private destroyBox: DestroyBoxController[] = []
    private elevator: ElevatorController[] = []
    private breakingWood: BreakingWoodController[] = []
    private mienenBlock
    private isTouchingGround = false
    private boxBreakSound 
    private mienenGuySound
    private jumpSound
    private backgroundMusic
    private lifeSound
    private damageSound
    private mienenCartSound

    constructor() {
        super('game')
        // this.scene.restart()
    }

    init() {
        
        this.cursors = this.input.keyboard.createCursorKeys()
        this.obstacles = new ObsticalesController()
        this.mienenguy = []
        this.miniMienenguy = []
        this.emptyLore = []
        this.destroyBox = []
        this.elevator = []
        this.blueMienenguy = []
        this.breakingWood = []

        this.events.once(Phaser.Scenes.Events.DESTROY, () =>{
            this.destroy()
        })
    }

    preload() {
        this.load.atlas('coal-guy', 'assets/coal_guy2.png', 'assets/coal_guy2.json')
        this.load.atlas('mienenguy', 'assets/mienenguy.png', 'assets/mienenguy.json')
        this.load.atlas('miniMienenguy', 'assets/miniMienenguy.png', 'assets/miniMienenguy.json')
        this.load.atlas('blueMienenguy', 'assets/blueMienenguy.png', 'assets/blueMienenguy.json')
        this.load.atlas('destroyBox', 'assets/destroyBox.png', 'assets/destroyBox.json')
        this.load.image('tiles', 'assets/tiles.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/game2.json')
        this.load.image('diamond', 'assets/diamond2.png')
        this.load.image('health', 'assets/heart.png')
        this.load.image('emptyLore', 'assets/emptylore.png')
        this.load.image('elevator', 'assets/woodelevator.png')

        //---------Sounds----------
        this.load.audio('caveSound', 'sound/test.wav')
        this.load.audio('boxBreak', 'sounds/boxBreak.wav')
        this.load.audio('mienenGuySound', 'sounds/kill_mienenGuy.ogg')
        this.load.audio('jumpSound', 'sounds/jump.wav')
        this.load.audio('lifeSound', 'sounds/life.wav')
        this.load.audio('damageSound', 'sounds/damage.ogg')
        this.load.audio('mienencartSound', 'sounds/mienenCart.wav')
        
        
        
    }

    create() {
        this.scene.launch('ui')
        const map = this.make.tilemap({ key: 'tilemap' })
        const tileset = map.addTilesetImage('Miene', 'tiles')
    
        const background = map.createLayer('background', tileset)
        const backgroundOverlay = map.createLayer('backgroundOverlay', tileset)
        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({ collides: true })
        
        // this.backgroundMusic = this.sound.add('caveSound')
        this.boxBreakSound = this.sound.add('boxBreak')
        this.mienenGuySound = this.sound.add('mienenGuySound')
        this.jumpSound = this.sound.add('jumpSound')
        this.lifeSound = this.sound.add('lifeSound')
        this.damageSound = this.sound.add('damageSound')
        this.mienenCartSound = this.sound.add('mienencartSound', {loop: true})
        
        // console.log('Hier bin ich auch')
        
       

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer.objects.forEach(objData => {
            const { x = 0, y = 0, name, width = 0, height = 0 } = objData
        
            switch (name) {
                case 'player-spawn': {
                    this.player = this.matter.add.sprite(x + (width*0.5), y, 'coal-guy')
                        .setScale(0.8)
                        .setFixedRotation()

                    this.playerController = new PlayerController(this, this.player, this.cursors, this.obstacles, this.boxBreakSound, this.jumpSound, this.lifeSound, this.damageSound)
                    

                    this.cameras.main.startFollow(this.player)

                    
                    break
                }
                
                case 'miniMienenguy-spawn':{
                    const miniMienenguy = this.matter.add.sprite(x,y, 'miniMienenguy')
                        .setFixedRotation()
                    this.obstacles.add('miniMienenguy', miniMienenguy.body as MatterJS.BodyType)
                    this.miniMienenguy.push(new MiniMienenguyController(this, miniMienenguy))
                    break
                }
                case 'mienenguy-spawn':{
                    const mienenguy = this.matter.add.sprite(x,y, 'mienenguy')
                        .setScale(1.2)
                        .setFixedRotation()
                    this.mienenguy.push(new MienenguyController(this, mienenguy,this.mienenGuySound))
                    this.obstacles.add('mienenguy', mienenguy.body as MatterJS.BodyType)
                    break
                }

                case 'blueMienenguy-spawn':{
                    const blueMienenguy = this.matter.add.sprite(x,y, 'blueMienenguy')
                        .setScale(1.2)    
                        .setFixedRotation()
                    this.blueMinenguyController = new BlueMienenguyController(this, blueMienenguy, this.mienenGuySound)
                    this.blueMienenguy.push(this.blueMinenguyController)
                    this.obstacles.add('blueMineneguy', blueMienenguy.body as MatterJS.BodyType)
                    break
                }

                case 'diamond':{
                    const diamont = this.matter.add.sprite(x+(width*0.5),y+(height*0.5),'diamond', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    diamont.setScale(1)
                    diamont.setData('type', 'diamond')

                    break
                }

                case 'Bigdiamond':{
                    const diamont = this.matter.add.sprite(x+(width*0.5),y+(height*0.5),'diamond', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    diamont.setScale(2)
                    diamont.setData('type', 'bigdiamond')

                    break
                }

                case 'block':{
                    const block = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                    } )
                    break
                }

                case 'destroyBox-spawn':{
                    const destroyBox=this.matter.add.sprite(x+(width*0.5),y+(height*0.5), 'destroyBox', undefined, {
                        isStatic: true
                    })
                    this.destroyBox.push(new DestroyBoxController(destroyBox))
                    this.obstacles.add('destroyBox', destroyBox.body as MatterJS.BodyType)
                    break
                }

                case 'health':{
                    const health = this.matter.add.sprite(x+(width*0.5),y, 'health', undefined ,{
                        isStatic: true,
                        isSensor: true
                    })
                    health.setScale(1)
                    health.setData('type', 'health') 
                    health.setData('healthPoints', 10)
                    break
                }
                case 'elevatorBottom':{
                    const elevatorBottom = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    } )
                    this.obstacles.add('elevatorBottom', elevatorBottom)
                    break
                }

                case 'elevatorTop':{
                    const elevatorTop = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    } )
                    this.obstacles.add('elevatorTop', elevatorTop)
                    break
                }

                case 'elevator':{
                    const elevator = this.matter.add.sprite(x+(width*0.5), y+(height*0.5), 'elevator')
                        .setFixedRotation()
                    this.obstacles.add('elevator', elevator.body as MatterJS.BodyType)
                    this.elevator.push(new ElevatorController(this, elevator, this.obstacles))
                    break
                }
                case 'elevator2':{
                    const elevator2 = this.matter.add.sprite(x+(width*0.5), y+(height*0.5), 'elevator')
                        .setFixedRotation()
                    this.obstacles.add('elevator2', elevator2.body as MatterJS.BodyType)
                    this.elevator.push(new ElevatorController(this, elevator2, this.obstacles))
                    break
                }
                case 'breakingWood':{
                    const breakingWood = this.matter.add.sprite(x+(width*0.5), y+(height*0.5), 'elevator')
                        .setFixedRotation()    
                    this.obstacles.add('breakingwood', breakingWood.body as MatterJS.BodyType)
                    this.breakingWood.push(new BreakingWoodController(this, breakingWood, this.obstacles, this.boxBreakSound))
                    break
                }

                case 'hitbox':{
                    const hitbox = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                    } )
                    this.obstacles.add('hitboxs', hitbox)
                    break
                }
                case 'rightWall': {
                    const rightWall = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true
                    })
                    this.obstacles.add('rightWall', rightWall)
                    break
                }
                case 'leftWall': {
                    const leftWall = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true
                    })
                    this.obstacles.add('leftWall', leftWall)
                    break
                }
                case 'mienencart-spawn':{
                    const emptyLore = this.matter.add.sprite(x+(width*0.5), y+(height*0.5), 'emptyLore')
                        .setFixedRotation()
                    this.obstacles.add('emptyLore', emptyLore.body as MatterJS.BodyType)
                    this.emptyLore.push(new EmptyLorenController(this, emptyLore, this.obstacles, this.mienenCartSound))
                    break
                }
                case 'deadZone':{
                    const deadZone = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                    })
                    this.obstacles.add('deadZones', deadZone)
                    break
                }

                case 'mienenBlockTrigger':{
                    const mienenBlockTrigger = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true
                    })
                    this.obstacles.add('mienenBlockTrigger', mienenBlockTrigger)
                    break
                }
                case 'breaktrigger':{
                    const breaktrigger = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true
                    })
                    this.obstacles.add('breaktriggers', breaktrigger)
                    break
                }
                case 'mienencartStop':{
                    const mienencartStop = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true
                    })
                    this.obstacles.add('mienencartStop', mienencartStop)
                    break
                }

                case 'info':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width,height,{
                        isStatic: true,
                        isSensor: true,
                    })
                    console.log(this)
                    this.obstacles.add('info', info)
                    break
                }
                case 'info2':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info2', info)
                    break
                }
                case 'info3':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info3', info)
                    break
                }
                case 'info4':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info4', info)
                    break
                }
                case 'info5':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info5', info)
                    break
                }
                case 'info6':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info6', info)
                    break
                }
                case 'info7':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info7', info)
                    break
                }
                case 'info8':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info8', info)
                    break
                }
                case 'info9':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info9', info)
                    break
                }
                case 'info10':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info10', info)
                    break
                }
                case 'info11':{
                    const info = this.matter.add.rectangle(x+(width*0.5), y+(height*0.5), width, height, {
                        isStatic: true,
                        isSensor: true,
                    })
                    this.obstacles.add('info11', info)
                    break
                }
                
            }
        })

        
        const overlay = map.createLayer('overlay', tileset)
        this.matter.world.convertTilemapLayer(ground)
        
        events.on('BossIsDead', this.bossIsDead, this)
        events.once('Ende', this.ende, this)

    }

    private ende(){
        console.log('Das ist das Ende')
        // events.emit('EndScreen')
        this.mienenCartSound.stop()
        this.destroy()
        // this.scene.start('endScreen')
        
    }

    private bossISDead = false
    private bossIsDead(){
        this.bossISDead = true
        events.off('BossIsDead', this.bossIsDead, this)
    }
    

    private destroy(){
       this.mienenguy.forEach(mienenguy => mienenguy.destroy())
       this.miniMienenguy.forEach(miniMienenguy => miniMienenguy.destroy())
       this.emptyLore.forEach(emptyLore => emptyLore.destroy())
       this.blueMienenguy.forEach(blueMienenguy => blueMienenguy.destroy())

       
    }

    update(t: number, dt: number) {
        this.playerController?.update(dt)
        var playX = this.playerController?.getX()
        this.blueMinenguyController?.setPlayerX(playX)   
        
        this.mienenguy.forEach(mienenguy => mienenguy.update(dt))
        this.miniMienenguy.forEach(miniMienenguy => miniMienenguy.update(dt))
        this.emptyLore.forEach(emptyLore => emptyLore.update(dt))
        this.elevator.forEach(elevator => elevator.update(dt))
        this.breakingWood.forEach(breakingWood => breakingWood.update(dt))
        this.blueMienenguy.forEach(blueMienenguy => blueMienenguy.update(dt))


        

    }
    
}