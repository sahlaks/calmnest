import mongoose from "mongoose";
import { ISlotRepository } from "../../usecases/interface/ISlotRepository";
import ISlot from "../../domain/entity/slots";
import slotModel from "../databases/slotModel";

export class SlotRepository implements ISlotRepository{

    /*............................................create slots......................................*/
    async createSlot(data: { date: string; startTime: string; endTime: string; doctorId: string}): Promise<ISlot | null> {
        try {
            const newSlot = new slotModel({
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                doctorId: data.doctorId 
            });
            const savedSlot = await newSlot.save();
            return savedSlot;
        }catch (error) {
            console.error("Error creating slot:", error);
            return null;
        }
    }

    /*...................................fetch slots...........................................*/
    async fetchSlots(id: string): Promise<ISlot[] | null> {
        try{
            const slots = await slotModel.find({doctorId:id});
            return slots
        }catch(error){
            console.error("Error fetching slot:", error);
            return null;
        }
    }

    /*..........................................available slots for doctor..............................*/
    async fetchAvailableSlots(id: string): Promise<ISlot[] | null> {
        try{
            const slots = await slotModel.find({doctorId: id, isAvailable: true})
            return slots
        }catch(error){
            console.error("Error fetching slot:", error);
            return null;
        }
    }

} 