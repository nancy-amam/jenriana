// services/activity.service.ts
import Activity, { ActivityType } from "@/models/activity";

export class ActivityService {
  async saveActivity(type: ActivityType, message: string) {
    return Activity.create({ type, message });
  }

  async getRecentActivities(limit = 5) {
    return Activity.find().sort({ createdAt: -1 }).limit(limit);
  }
}

export const activityService = new ActivityService();
