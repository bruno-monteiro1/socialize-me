import { Response } from "express";
import User from "../models/User.js";

interface IGetUserAndUserFriendsRequest {
  params: {
    id: string;
  };
}

interface IAddRemoveFriend {
  params: {
    id: string;
    friendId: string;
  };
}

/* READ */
export const getUser = async (
  req: IGetUserAndUserFriendsRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
};

export const getUserFriends = async (
  req: IGetUserAndUserFriendsRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      (user as any).friends.map((friendId: string) => User.findById(friendId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
};

/* UPDATE */

export const addRemoveFriend = async (req: IAddRemoveFriend, res: Response) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user?.friends.includes(friendId)) {
      user.friends = user.friends.filter(
        (userFriendId) => userFriendId !== friendId
      );
      (friend as any).friends = friend?.friends.filter(
        (friendOfFriend) => friendOfFriend !== id
      );
    } else {
      user?.friends.push(friendId);
      friend?.friends.push(id);
    }
    await user?.save();
    await friend?.save();

    const friends = await Promise.all(
      (user as any).friends.map((friendId: string) => User.findById(friendId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
};
