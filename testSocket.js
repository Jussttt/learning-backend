import { io } from "socket.io-client";

const socket =
    io(
        "http://localhost:3000",
        {
            auth:{
                token:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzgyMDM2MjYwLCJleHAiOjE3ODI2NDEwNjB9.Bv18XQSVUhw-_xxYqmTI6syjUqNbkb976uQULNriD2E"
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

        // setTimeout(
        //     ()=>{
        //         socket.emit(
        //             "typing.start",
        //             {
        //                 conversationId: 4
        //             }
        //         );
        //     },
        //     5000
        // );


        // setTimeout(
        //     ()=>{
        //         socket.emit(
        //             "typing.stop",
        //             {
        //                 conversationId: 4
        //             }
        //         );
        //     },
        //     10000
        // );
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
    "conversation.read",
    (data)=>{
        console.log(
            "READ EVENT",
            data
        );
    }
);

socket.on(
    "notification:new",
    (data)=>{
        console.log(
            "NOTIFICATIONS",
            data
        );
    }
);



