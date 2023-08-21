import React, { MouseEvent } from 'react';

import { StarBorderOutlinedIcon, StarFilledIcon } from '../../../components/icons';
import { User } from '../../../resources/intefaces';

type UserListItemProps = {
  user: User;
  isFavorite: boolean
  onToggleFavorite: (userId: string | number) => void;
  onClick: (user: User) => void;
};

export const UserListItem = ({
  user,
  isFavorite,
  onToggleFavorite,
  onClick
}: UserListItemProps) => {
  const handleToggleFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(user.id);
  };

  return (
    <div
      key={user.id}
      onClick={() => onClick(user)}
      className="p-2.5 cursor-pointer hover:bg-gray-200"
    >
      <div className="user-list-item mb-3.5 flex items-center gap-2.5">
        <img className="rounded-full w-10 h-10" src={user.avatar_url} alt={user.login} />
        <div className="w-0 flex-1">
          <p>{user.login}</p>
          <p className="truncate text-gray-500">
            I program computers, and build teams that program I program computers, and build teams that program computers...
          </p>
        </div>
        <i
          className="text-yellow-400 cursor-pointer"
          onClick={handleToggleFavoriteClick}
        >
          {isFavorite ? <StarFilledIcon /> : <StarBorderOutlinedIcon />}
        </i>
      </div>
    </div>
  );
}
