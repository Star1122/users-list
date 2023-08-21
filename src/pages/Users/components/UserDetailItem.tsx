import React, { useState, MouseEvent, useEffect, useCallback } from 'react';

import { StarBorderOutlinedIcon, StarFilledIcon } from '../../../components/icons';
import {LoadingSpinner} from '../../../components/loading-spinner';
import { User, UserDetail } from '../../../resources/intefaces';
import { HTTP } from '../../../services/http.service';

type UserDetailProps = {
  user: User;
  isFavorite: boolean
  onToggleFavorite: (userId: string | number) => void;
};

export const UserDetailCard = ({
  user,
  isFavorite,
  onToggleFavorite
}: UserDetailProps) => {
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  
  const handleToggleFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(user.id);
  };
  
  const fetchUserDetailInformation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await HTTP.get<UserDetail>(user.url);
      setUserDetail(response.data);
    } catch (e) {
    
    }
    setLoading(false);
  }, [user.url]);
  
  useEffect(() => {
    fetchUserDetailInformation();
  }, [fetchUserDetailInformation]);
  
  return (
    <div className="w-[600px] p-3 mx-auto bg-white shadow-3xl rounded-xl">
      {
        loading ? <LoadingSpinner /> : (
          <div className="user-list-item flex items-start gap-2.5">
            <img className="rounded h-36" src={userDetail?.avatar_url} alt={userDetail?.login} />
            <div className="w-0 flex-1 flex flex-col">
              <p className="text-[28px]">{userDetail?.name}</p>
              <p className="text-blue-400 text-sm">@{userDetail?.login}</p>
              <p className="text-sm text-gray-500">{userDetail?.bio || 'No description'}</p>
              <div className="user-detail-info mt-[18px] flex items-center gap-7">
                <div className="followers-count">
                  <p className="text-[28px]">{userDetail?.followers || 'No'}</p>
                  <p className="text-xs uppercase">Followers</p>
                </div>
                <div>
                  <p className="text-[28px]">{userDetail?.following || 'No'}</p>
                  <p className="text-xs uppercase">Following</p>
                </div>
                <div>
                  <p className="text-[28px]">{userDetail?.public_repos || 'No'}</p>
                  <p className="text-xs uppercase">Repos</p>
                </div>
              </div>
            </div>
            <i className="text-yellow-400 cursor-pointer" onClick={handleToggleFavoriteClick}>
              {isFavorite ? <StarFilledIcon /> : <StarBorderOutlinedIcon />}
            </i>
          </div>
        )
      }
    </div>
  );
}
