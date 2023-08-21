import { createContext, Dispatch, FC, PropsWithChildren, useReducer } from 'react';

interface FavoriteContextValue {
  favorites: (number | string)[];
  dispatch: Dispatch<FavoriteAction>;
}

type FavoriteAction =
  | { type: 'ADD_FAVORITE'; payload: number | string }
  | { type: 'REMOVE_FAVORITE'; payload: number | string };

const reducer = (state: (number | string)[], action: FavoriteAction) => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return [...state, action.payload];
    case 'REMOVE_FAVORITE':
      return state.filter((favorite) => favorite !== action.payload);
    default:
      return state;
  }
};

export const FavoriteContext = createContext<FavoriteContextValue>({
  favorites: [],
  dispatch: () => {},
});

export const FavoriteProvider: FC<PropsWithChildren> = ({ children }) => {
  const [favorites, dispatch] = useReducer(reducer, []);
  
  return (
    <FavoriteContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoriteContext.Provider>
  );
};
