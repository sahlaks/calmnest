import IAppointment from "../../domain/entity/Appointment";
import INotification from "../../domain/entity/notification";

export interface IAppointmentRepository{
    saveData(appointment: any): Promise<IAppointment | null>
    updateData(id: string): Promise<IAppointment | null>
    updateFailure(id: string): Promise<IAppointment | null>
    sendNotification(notificationData: any): Promise<INotification | null>
    fetchAppointments(id: string, page: number, limit: number): Promise<IAppointment[] | null>
    fetchDoctorAppointments(id: string, page: number, limit: number): Promise<IAppointment[] | null>
    updateAppointment(id: string, status: string): Promise<IAppointment | null>
    countDocuments(id: string): Promise<number>
    countDoctorDocuments(id: string): Promise<number>
}