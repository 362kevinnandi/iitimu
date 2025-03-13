import { getUserById } from "@/app/data/user/get-user";
import { UserProfileInfo } from "@/components/profile";
import { User } from "@prisma/client";

const ProfilePage = async () => {
  const user = await getUserById();

  return (
    <div className="bg-background w-full min-h-screen flex items-center justify-center">
      <UserProfileInfo user={user as User} />
    </div>
  );
};

export default ProfilePage;
