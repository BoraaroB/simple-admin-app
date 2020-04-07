import React from 'react';
import UserList from '../../components/UserList/UserList';
import { UserProvider } from '../../context/userContext';

const UsersPage = () => {
  return (
    <div>
      <UserProvider>
        <UserList />
      </UserProvider>
    </div>
  )
}

export default UsersPage;