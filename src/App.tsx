import { BrowserRouter, Route, Routes } from 'react-router-dom';

import UserSearchPage from './pages/Users/SearchPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSearchPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
