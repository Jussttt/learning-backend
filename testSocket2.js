
import { io } from "socket.io-client";

const socket =
    io(
        "http://localhost:3001",
        {
            auth:{
                token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwiaWF0IjoxNzgyMDM2Mjg1LCJleHAiOjE3ODI2NDEwODV9.oJwFPSRcFMEvBcCccicon1LV5zciFueymFSAeTCWHtk"
            }
        }
    );

socket.on(
    "connect",
    ()=>{
        console.log(
            "Connected:",
            socket.id
        );

        socket.emit(
            "join_conversation",
            1
        );
    }
);  



socket.on(
    "message:new",
    (message)=>{
        console.log(
            "New Message:",
            message
        );
    }
);

socket.on(
    "user.online",
    (data)=>{
        console.log(
            "ONLINE",
            data
        );
    }
);

socket.on(
    "user.offline",
    (data)=>{
        console.log(
            "OFFLINE",
            data
        );
    }
);

socket.on(
    "typing.start",
    (data)=>{
        console.log(
            "TYPING",
            data
        );
    }
);

socket.on(
    "typing.stop",
    (data)=>{
        console.log(
            "STOPPED",
            data
        );
    }
);

socket.on(
    "notification:new",
    (data)=>{
        console.log(
            "FOLLOW NOTIFICATION",
            data
        );
    }
);