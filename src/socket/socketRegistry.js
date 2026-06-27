const userSockets=new Map();

export function addUserSocket(
    userId,
    socketId
){
    if(
        !userSockets.has(
        userId
        )
    ){
        userSockets.set(
            userId,
            new Set()
        );
    }

    userSockets 
        .get(userId)
        .add(socketId);
}


export function removeUserSocket(
    userId,
    socketId
){
    const sockets=userSockets.get(userId);

    if(!sockets) return;

    sockets.delete(
        socketId
    );

    if(
        sockets.size===0
    ){
        userSockets.delete(
            userId
        );
    }
}

export function getUserSockets(userId){
    return (
        userSockets.get(userId)?? new Set()
    );
}   

export function getAllUserSockets(){
    return userSockets;
}

export function getRegistrySnapshot(){
    return Object.fromEntries(
        [...userSockets.entries()]
            .map(
                ([userId,sockets])=>[
                    userId,
                    [...sockets]
                ]
            )
    );
}

export function isUserOnline(
    userId
){
    return userSockets.get(
        userId
    );
}

export function getUserSocketCount(
    userId
){
    return (
        userSockets.get(
            userId
        )?.size??0
    );
}