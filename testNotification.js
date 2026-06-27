
import { createNotificationService } from "./src/services/notificationService.js";

await createNotificationService(
    {
        recipientUserId: 2,
        actorUserId: 1,
        type: "follow",
        entityId: 1
    }
);