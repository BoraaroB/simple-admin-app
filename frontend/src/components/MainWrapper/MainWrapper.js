import React from 'react';
import NavBar from '../NavBar/NavBar';

const MainWrapper = (props) => {
  return (
    <main>
      <NavBar />
      {props.children}
    </main>
  )
}

export default MainWrapper;