import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AxiosError } from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactPullToRefresh from 'react-pull-to-refresh';

import { ArrowBackIcon, SearchIcon, StarBorderOutlinedIcon, StarFilledIcon } from '../../components/icons';
import { FavoriteContext } from '../../contexts/AppContext';
import { useDebouncedValue } from '../../hooks';
import { GitHubSearchUserResult, User } from '../../resources/intefaces';
import { HTTP } from '../../services/http.service';
import { IndexedDBService } from '../../services/indexedDB.service';
import { UserDetailCard } from './components/UserDetailItem';
import { UserListItem } from './components/UserListItem';

const DB_NAME = 'github-users-db';
const DB_VERSION = 1;
const OBJECT_STORE_NAME = 'users';
const LIMIT = 30;
const indexedDBService = new IndexedDBService({
  name: DB_NAME,
  version: DB_VERSION,
  objName: OBJECT_STORE_NAME
});

const UserSearchPage = () => {
  const { favorites, dispatch } = useContext(FavoriteContext);

  const [isShowFavorites, setIsShowFavorites] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState(1);
  const [searchResult, setSearchResult] = useState<GitHubSearchUserResult>({
    items: [],
    total_count: 0
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);

  const debouncedSearchKey = useDebouncedValue(searchKey);

  const fetchSearchResult = useCallback(async () => {
    setPage(1);

    if (debouncedSearchKey.length < 3) {
      return;
    }

    try {
      let response;
      if (navigator.onLine) {
        response = await HTTP.get<GitHubSearchUserResult>(
          `/search/users?q=${debouncedSearchKey}&page=${1}`
        );
        // Add data to indexedDB for offline use
        indexedDBService.clearDataFromIndexedDB();
        indexedDBService.addDataToIndexDB<User>(response.data.items);
      } else {
        // Retrieve data from indexedDB if offline
        const totalCount = await indexedDBService.count();
        const data: User[] = await indexedDBService.query(debouncedSearchKey, 1, LIMIT, 'login');
        response = {
          data: { items: data, total_count: totalCount }
        };
      }

      setSearchResult(response.data);
      setError(null);
    } catch (error: any) {
      setError(error);
    }
  }, [debouncedSearchKey]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchKey = event.target.value;
    setSearchKey(newSearchKey);
  };

  const fetchNextUsers = async () => {
    setPage(prevState => prevState + 1);

    try {
      let response;
      if (navigator.onLine) {
        response = await HTTP.get<GitHubSearchUserResult>(
          `/search/users?q=${searchKey}&page=${page + 1}`
        );
        setSearchResult({
          items: searchResult.items.concat(response.data.items),
          total_count: response.data.total_count
        });
        // Add data to indexedDB for offline use
        indexedDBService.addDataToIndexDB<User>(response.data.items);
      } else {
        const totalCount = await indexedDBService.count();
        const data: User[] = await indexedDBService.query(debouncedSearchKey, page + 1, LIMIT, 'login');
        response = {
          data: { items: data, total_count: totalCount }
        };
      }

      setSearchResult({
        items: searchResult.items.concat(response.data.items),
        total_count: response.data.total_count
      });
      setError(null);
    } catch (error: any) {
      setError(error);
    }
  };

  const handleRefresh = async () => {
    fetchSearchResult();
  };

  const handleFavoriteToggle = (userId: string | number) => {
    if (favorites.includes(userId)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: userId });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: userId });
    }
  };

  useEffect(() => {
    indexedDBService.connectToIndexedDB({
      keyPath: 'id',
    }, {
      name: 'login',
      keyPath: 'login'
    });
  }, []);

  useEffect(() => {
    fetchSearchResult();
  }, [fetchSearchResult]);

  return (
    selectedUser ?
      (
        <div className="min-h-screen flex flex-col">
          <header className="py-3 flex items-center justify-center shadow z-[1]">
            <div className="w-[600px] flex items-center gap-2">
              <i
                className="cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowBackIcon />
              </i>
              <span>@{selectedUser.login}</span>
            </div>
          </header>
          <div className="main-pane flex-1 py-4 bg-gray-50">
            <UserDetailCard
              user={selectedUser}
              isFavorite={favorites.includes(selectedUser.id)}
              onToggleFavorite={handleFavoriteToggle}
            />
          </div>
        </div>
      )
      : (
        <ReactPullToRefresh key={debouncedSearchKey} onRefresh={handleRefresh}>
          <InfiniteScroll
            dataLength={searchResult?.items.length || 0}
            next={fetchNextUsers}
            hasMore={!isShowFavorites && searchResult?.total_count > searchResult?.items.length}
            loader="Loading...">
            <div className="flex flex-col">
              <header className="py-3 flex items-center justify-center shadow z-[1]">
                <div className="px-2.5 w-[600px] flex items-center gap-2">
                  <i className="text-gray-500">
                    <SearchIcon />
                  </i>
                  <input
                    className="w-72 text-xl outline-0"
                    placeholder="Search for GitHub Users..."
                    value={searchKey}
                    onChange={handleSearchInputChange}
                  />
                  <div
                    className="ml-auto text-yellow-400 cursor-pointer"
                    onClick={() => setIsShowFavorites(!isShowFavorites)}
                  >
                    {isShowFavorites ? <StarFilledIcon /> : <StarBorderOutlinedIcon />}
                  </div>
                </div>
              </header>
              <div className="main-pane flex-1 py-4 bg-gray-50">
                <div className="message-display-section text-center">
                  {error && <p>Error: {error?.message}</p>}
                  {!searchResult && <p>No search results...</p>}
                </div>
                {searchResult && (
                  <div className="w-[600px] mx-auto grid bg-white shadow-3xl rounded-xl">
                    {searchResult?.items.map((user) => {
                      const isFavorite = favorites.includes(user.id);

                      if (isShowFavorites && !isFavorite) {
                        return null;
                      }

                      return (
                        <div key={user.id} className="user-item-container">
                          <UserListItem
                            user={user}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleFavoriteToggle}
                            onClick={() => setSelectedUser(user)}
                          />
                          <hr className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </InfiniteScroll>
        </ReactPullToRefresh>
      )
  );
};

export default UserSearchPage;
