import { api } from '../../lib/axios';


const PREFIX = "accounts/user-activities";

export const UserActivity = {
   getUsersActivity: async () => {
    const response = await api.get(PREFIX );
    return response.data;
  }

};