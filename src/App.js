import logo from './logo.svg';
import './App.css';
import {Provider} from "react-redux";
import appStore from './store/store';

import Search from "./components/Search";
import Search2 from "./components/Search2";


function App() {
  return (
      <Provider store={appStore}>
          <div id="container">
            <Search2 />
          </div>
      </Provider>
  );
}

export default App;
