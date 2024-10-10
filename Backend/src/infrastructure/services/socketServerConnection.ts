import { Server } from "socket.io"

export const createSocketChatConnection = (server: any) =>{
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST']
        }
    })

    let users: { [userId: string]: string } = {};

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
      
    // Store connected user
  socket.on('user_connected', (userId: string) => {
    users[userId] = socket.id;
    console.log(`User ${userId} is connected.`);
  });

   // Joining a room based on sender and receiver IDs
   socket.on('join_room', (data: { senderId: string, receiverId: string }) => {
    const roomId = [data.senderId, data.receiverId].sort().join('_'); // Create room ID
    socket.join(roomId); // Join the room
    console.log(`User ${data.senderId} joined room: ${roomId}`);
  });

  socket.on('send_message', (data: { senderId: string; receiverId: string; message: string }) => {
    const roomId = [data.senderId, data.receiverId].sort().join('_');
    console.log(`Sending message from ${data.senderId} to ${data.receiverId} in room: ${roomId}`);
    io.to(roomId).emit('receive_message', {
        senderId: data.senderId,
        message: data.message,
        createdAt: new Date()
      });
  });
        // Handle your socket events here
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });
}