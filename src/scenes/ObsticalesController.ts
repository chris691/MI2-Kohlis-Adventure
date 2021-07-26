import Phaser from "phaser";

const createKey = (name: string, id: number) => {
    return `${name}-${id}`
}

export default class ObsticalesController {
    private obsticles = new Map<string, MatterJS.BodyType>()

    add(name: string, body: MatterJS.BodyType){
        const key = createKey(name, body.id)
        if(this.obsticles.has(key)){
            throw new Error('Es exestiert bereits ein Objekt diesen Schlüssel')
        }
        this.obsticles.set(key, body)
    }

    is(name: string, body: MatterJS.BodyType){
        const key = createKey(name, body.id)
        if(!this.obsticles.has(key)){
            return false
        }
        return true
    }

}