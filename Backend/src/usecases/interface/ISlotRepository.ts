import mongoose, { Schema } from "mongoose";
import ISlot from "../../domain/entity/slots";


export interface ISlotRepository{
   createSlot(slots: { date: string; startTime: string; endTime: string; doctorId: string}): Promise<ISlot | null>
   fetchSlots(id: string): Promise<ISlot[] | null>
   fetchAvailableSlots(id: string): Promise<ISlot[] | null>
   updateSlot(slotId: string, doctorId: string): Promise<ISlot | null>
   deleteSlot(slotId: string, doctorId: string): Promise<ISlot | null>
}
