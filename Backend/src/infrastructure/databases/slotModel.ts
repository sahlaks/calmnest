import mongoose, { Model, Schema } from "mongoose"
import ISlot from "../../domain/entity/slots"


const slotSchema: Schema<ISlot> = new mongoose.Schema({
    date: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type:String
    },
    isAvailable:{
        type: Boolean,
        default: true
    },
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parent'
    },
    },
        { timestamps: true }
)

const slotModel: Model<ISlot> = mongoose.model('Slot', slotSchema)

export default slotModel