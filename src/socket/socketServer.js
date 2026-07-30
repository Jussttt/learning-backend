import {Server } from "socket.io";
import {logger} from "../logger/logger.js";
import { authenticateSocket } from "../middleware/authenticateSocket.js";
import { addUserSocket,removeUserSocket,getRegistrySnapshot,isUserOnline } from "./socketRegistry.js";
import { eventBus } from "../events/eventBus.js";
import { createAdapter }
from "@socket.io/redis-adapter";

import { socketSubClient,socketPubClient } from "../cache/socketRedis.js";
import { setActiveSocketConnections } from "../monitoring/metricsService.js";

export async function createSocketServer(
    httpServer
){
    const io=new Server(
        httpServer,
        {
            cors:{
                origin:"*",
            },
        }
    );
    let activeConnection=0;

    io.use(authenticateSocket);

    // registerRedisSubscriber(io);

    console.log(
        "Redis Subscriber Registered"
    );

    await socketPubClient.connect();
    await socketSubClient.connect();

    io.adapter(
        createAdapter(
            socketPubClient,
            socketSubClient
        )
    );

    logger.info(
        "Socket.IO Redis Adapter Registered"
    );
    
    
    eventBus.on(
        "message.created",
        ({ message, conversationId }) => {

            

            io.to(
                `conversation:${conversationId}`
            ).emit(
                "message:new",
                message
            );
        }
    );

    eventBus.on(
        "conversation.read",
        ({
            conversationId,
            userId
        })=>{
            io.to(
                `conversation:${conversationId}`
            ).emit(
                "conversation.read",
                {
                    userId,
                    conversationId
                }
            )
        }
    );

    eventBus.on(
        "notification.created",
        (notification)=>{
            io.to(
                `user:${notification.recipient_user_id}`
            ).emit(
                "notification:new",
                notification
            );
        }
    );

    io.on(
    "connection",

    (socket)=>{

        activeConnection++;
        setActiveSocketConnections(activeConnection);

        socket.join(
            `user:${socket.user.userId}`
        );

        const wasOnline=isUserOnline(
            socket.user.userId
        );

        addUserSocket(
            socket.user.userId,
            socket.id
        );

        if(!wasOnline){
            io.emit(
                "user.online",
                {
                    userId:
                        socket.user.userId
                }
            );
        }

        logger.info(
            {
                socketId:
                    socket.id,
                userId:
                    socket.user.userId
            },
            "Socket connected"
        );

        logger.info(
            {
                registry:
                    getRegistrySnapshot()
            },
            "Current registry"
        );

        

        socket.on(
            "typing.start",
            ({conversationId})=>{
                socket.to(`conversation:${conversationId}`)
                .emit("typing.start",
                    {
                        userId: 
                            socket.user.userId,
                        conversationId
                    }
                )
            }
        );

        socket.on(
            "typing.stop",
            ({ conversationId }) => {

                socket.to(
                    `conversation:${conversationId}`
                ).emit(
                    "typing.stop",
                    {
                        userId:
                            socket.user.userId,

                        conversationId
                    }
                );
            }
        );

        socket.on(
            "disconnect",
            (reason)=>{
                logger.info({ reason }, "Socket disconnected event fired");
                activeConnection--;
                setActiveSocketConnections(activeConnection);

                removeUserSocket(
                    socket.user.userId,
                    socket.id
                );

                if(
                    !isUserOnline(socket.user.userId)
                ){
                    io.emit(
                        "user.offline",
                        {
                            userId:
                                socket.user.userId
                        }
                    );
                }

                logger.info(
                    {
                        socketId:
                            socket.id,
                        userId:
                            socket.user.userId
                    },
                    "Socket disconnected"
                );

                logger.info(
                    {
                        registry:
                            getRegistrySnapshot()
                    },
                    "Current registry"
                );
            }
        );

        socket.on(
            "join_conversation",
            (conversationId)=>{
                const roomName=
                    `conversation:${conversationId}`;
                socket.join(roomName);

                logger.info(
                    {
                    userId:
                        socket.user.userId,
                    roomName
                    
                    },
                    "User joined conversation room"
                );
            }
        );




    }
);


    return io;
}























































