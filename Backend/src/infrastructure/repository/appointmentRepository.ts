import IAppointment from "../../domain/entity/Appointment";
import INotification from "../../domain/entity/notification";
import { IAppointmentRepository } from "../../usecases/interface/IAppointmentRepositiry";
import appointmentModel from "../databases/appointmentModel";
import notificationModel from "../databases/notificationModel";

export class AppointmentRepository implements IAppointmentRepository{
    /*..........................saving appointment as pending......................................*/
    async saveData(appointment: any): Promise<IAppointment | null> {
        try {
        const data = new appointmentModel(appointment);
        const savedAppointment = await data.save();
        return savedAppointment
    }  catch (error) {
        console.error("Error saving appointment:", error);
        return null;
    }
    }

    /*.................................update appointment................................................*/
    async updateData(id: string): Promise<IAppointment | null> {
        try{
            const data = await appointmentModel.findByIdAndUpdate(id,{paymentStatus: 'Success'},{new: true})
            return data;
        } catch (error) {
          console.error('Error updating appointment:', error);
          return null;
        }
    }

    /*...................................update failure...............................................*/
    async updateFailure(id: string): Promise<IAppointment | null> {
        try{
            const data = await appointmentModel.findByIdAndUpdate(id,{paymentStatus: 'Failed'},{new: true})
            return data;
        } catch(error) {
            console.error('Error in updating')
            return null;
        }
    }

    /*............................................send notification...................................*/
    async sendNotification(notificationData: any): Promise<INotification | null> {
        try{
            const notification = new notificationModel(notificationData)
            const savedOne = await notification.save()
            return savedOne
        } catch(error) {
            console.error('Error in saving notification')
            return null;
        }
    }

    /*.........................................fetch appointments....................................*/
    async fetchAppointments(id: string): Promise<IAppointment[] | null> {
        try{
            const appointments = await appointmentModel.find({parentId:id,paymentStatus: "Success"})
            return appointments
        } catch(error){
            return null
        }
    }

    /*......................................fetch doctor's appointments............................*/
    async fetchDoctorAppointments(id: string): Promise<IAppointment[] | null> {
        try{
            const appointments = await appointmentModel.find({doctorId:id,paymentStatus: "Success"})
            return appointments
        } catch(error){
            return null
        }
    }

    /*..................................change status of appointment.............................*/
    async updateAppointment(id: string, status: string): Promise<IAppointment | null> {
        try{
            const updatedOne = await appointmentModel.findByIdAndUpdate(
                id,
                {$set:{
                appointmentStatus: status}},
            {new: true});
            return updatedOne;
        } catch(error){
            return null
        }
    }
}