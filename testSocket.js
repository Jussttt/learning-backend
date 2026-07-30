
import { io } from "socket.io-client";
import https from "https";

const socket = io("https://localhost", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzgzOTQyMDg4LCJleHAiOjE3ODQ1NDY4ODh9.bQ9PzQd8ahvp1XUQgZnfIHD61-fSB9qHCiRA8rvGAZU"
    },
    transportOptions: {
        polling: {
            agent: new https.Agent({
                rejectUnauthorized: false,
            }),
        },
    },
});

// import { io } from "socket.io-client";

// const socket =
//     io(
//         "https://localhost",
//         {
//             auth:{
//                 token:
//                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwiaWF0IjoxNzgzOTQyMDg4LCJleHAiOjE3ODQ1NDY4ODh9.bQ9PzQd8ahvp1XUQgZnfIHD61-fSB9qHCiRA8rvGAZU"
//             }
//         }
//     );

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

        setTimeout(() => {
            socket.disconnect();
        }, 20000);

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
socket.on("connect_error",(err)=>{
    console.log("Connection Error:",err.message);
});


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



